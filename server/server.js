import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'
// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());
app.post('/download', async (req, res) => {
  const { url } = req.body;
  console.log('Received URL:', url);

  try {
    // Validate URL (basic check)
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      console.error('URL validation failed');
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Generate output filename
    const videoTitle = `video_${Date.now()}`; // Use timestamp to avoid sanitization issues
    const finalOutputPath = path.join(__dirname, `downloaded_${videoTitle}.mp4`);

    // Use yt-dlp to download 1080p video with best audio
    console.log('Downloading and merging with yt-dlp...');
    const execPromise = promisify(exec);
    await execPromise(`yt-dlp -f "bestvideo[height=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${finalOutputPath}" "${url}"`);

    // Send the file to the client
    res.download(finalOutputPath, `${videoTitle}.mp4`, async err => {
      if (err) {
        console.error('Error sending file:', err.message);
        res.status(500).json({ error: 'Error sending file' });
      }

      // Clean up output file
      try {
        await fs.unlink(finalOutputPath);
      } catch (cleanupErr) {
        console.error('Error cleaning up files:', cleanupErr.message);
      }
    });

  } catch (error) {
    console.error('Detailed error:', error.stack);
    res.status(500).json({ error: 'Failed to download video', details: error.message });
  }
});
app.get('/', (req, res) => {
  res.send('YouTube Downloader Server is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});