import express from "express";
import { spawn } from "child_process";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json())
app.use(rateLimit({ windowMs: 60_000, max: 5 }));

// Helper to validate YouTube URL
const validateYouTubeUrl = (url) =>
  /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/.test(url) ||
  /^https:\/\/youtu\.be\/[\w-]{11}/.test(url);

app.get("/download", async (req, res) => {
  // const url = req.query.url;
  const url = req.body.url;

  if (!url || !validateYouTubeUrl(url)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  console.log("Starting download for:", url);

  // Use yt-dlp to download and merge, then pipe through ffmpeg for final encoding
  const ytdlpProcess = spawn("yt-dlp", [
    "-f", "bv*[height>1080]+ba*/bv*[height=1080]+ba*/bv*+ba*",  // Merge video+audio
    "-o", "-",  // Output to stdout
    url
  ]);

  // Use ffmpeg to ensure proper MP4 format with streaming support
  const ffmpegProcess = spawn("ffmpeg", [
    "-i", "pipe:0",        // input from stdin
    "-c", "copy",          // copy streams (no re-encode)
    "-movflags", "+frag_keyframe+empty_moov+default_base_moof",  // streaming MP4
    "-f", "mp4",
    "pipe:1"               // output to stdout
  ]);

  // Pipe yt-dlp output to ffmpeg
  ytdlpProcess.stdout.pipe(ffmpegProcess.stdin);

  // Set response headers
  res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
  res.setHeader("Content-Type", "video/mp4");

  // Pipe ffmpeg output to response
  ffmpegProcess.stdout.pipe(res);

  // Error handling
  ytdlpProcess.stderr.on("data", (data) => {
    console.error(`yt-dlp: ${data}`);
  });

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`ffmpeg: ${data}`);
  });

  [ytdlpProcess, ffmpegProcess].forEach(p => {
    p.on("error", (err) => {
      console.error("Process error:", err);
      if (!res.headersSent) {
        res.status(500).send("Download failed");
      }
    });
  });

  ytdlpProcess.on("close", (code) => {
    console.log(`yt-dlp closed with code ${code}`);
    ffmpegProcess.stdin.end();
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`ffmpeg closed with code ${code}`);
  });

  // Clean up if client disconnects
  req.on("close", () => {
    console.log("Client disconnected, cleaning up processes");
    [ytdlpProcess, ffmpegProcess].forEach(p => {
      if (!p.killed) {
        p.kill();
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));