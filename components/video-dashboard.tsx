'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Flag, LogOut, Mic, Video } from 'lucide-react'
import { useState } from "react"

export default function Component() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState<string[]>([
    "Lorem ipsum dolor sit amet...",
    "Consectetur adipiscing elit...",
    "Sed do eiusmod tempor...",
  ])

  return (
    <div className="flex min-h-screen flex-col bg-[#ECEEF0]">
      {/* Header */}
      <header className="bg-[#3E53A0] shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="text-2xl font-bold text-white">EduStream</span>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" className="font-semibold text-white hover:text-white hover:bg-white/10">
                Dashboard
              </Button>
              <Button variant="ghost" className="font-semibold text-white hover:text-white hover:bg-white/10">
                My Courses
              </Button>
            </nav>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr] p-4 sm:p-6 lg:p-8">
          {/* Video Feed */}
          <div className="flex flex-col gap-6">
            <Card className="border-2 border-dashed border-[#3E53A0]/30 bg-white shadow-lg">
              <CardContent className="flex aspect-video flex-col items-center justify-center gap-4 p-8 sm:p-10">
                <Video className="h-16 w-16 text-[#3E53A0]" />
                <p className="text-center text-lg font-medium text-[#3E53A0]">Live Video Feed</p>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant={isRecording ? "destructive" : "default"}
                className="gap-2 bg-[#3E53A0] hover:bg-[#3E53A0]/90 text-white flex-1 py-6 text-lg"
                onClick={() => setIsRecording(!isRecording)}
              >
                <Camera className="h-6 w-6" />
                {isRecording ? "Stop Recording" : "Take Snapshot"}
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 border-[#3E53A0]/30 text-[#3E53A0] hover:bg-[#3E53A0]/10 flex-1 py-6 text-lg"
              >
                <Flag className="h-6 w-6" />
                Flag
              </Button>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600 flex-1 py-6 text-lg">
                End Session
              </Button>
            </div>
          </div>

          {/* Live Transcription */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Mic className="h-5 w-5 text-[#3E53A0]" />
                <h2 className="text-xl font-semibold text-[#3E53A0]">Live Audio Transcription</h2>
              </div>
              <div className="h-[calc(100vh-20rem)] space-y-4 overflow-auto rounded-md bg-[#ECEEF0] p-4 sm:p-6">
                {transcription.map((text, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white p-4 text-sm shadow-sm border border-[#3E53A0]/10"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}