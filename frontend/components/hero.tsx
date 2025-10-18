"use client"

import type React from "react"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"


export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
    

      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium text-blue-600">Download Videos Instantly</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Download YouTube Videos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
              in Seconds
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Fast, secure, and simple. Download any YouTube video in the highest quality available. No registration
            required.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        //   onSubmit={}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="Paste YouTube link here..."
            //   value={url}
            //   onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-14 px-6 bg-secondary/50 border-secondary text-foreground placeholder:text-muted-foreground rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
            //   disabled={loading}
            />
            <Button
              type="submit"
            //   disabled={loading || !url.trim()}
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-5 h-5" />
              {/* {loading ? "Processing..." : "Download"} */}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Supports <span className="text-blue-600">MP4, MP3, and more</span> formats. Maximum file size: 2GB
          </p>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-secondary/50"
        >
          {[
            { label: "Downloads", value: "2.5M+" },
            { label: "Formats", value: "50+" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
