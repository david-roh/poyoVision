'use client'

import { Button, Card, CardContent, CardHeader } from '@mui/material';
import { Psychology, Description, Mic } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import { useState } from "react"

export default function Component() {
  const [message, setMessage] = useState("")
  const [chatHistory, setCharHistory] = useState([
    { role: "assistant", content: "Hello! I'm your Study GPT assistant. How can I help you understand your lecture materials better?" },
  ])

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-[1fr_1fr_300px] gap-6">
          {/* Left Column - Notes */}
          <Card className="bg-white shadow-lg">
            <CardHeader 
              className="border-b text-[#3E53A0]"
              avatar={<DescriptionIcon className="h-5 w-5" />}
              title="Notes"
            />
            <CardContent className="p-4">
              <div className="h-[calc(100vh-12rem)] overflow-auto">
                {/* Add note content here */}
                <div className="prose max-w-none">
                  <p>Your notes will appear here...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Middle Column - Audio Transcript and Player */}
          <div className="flex flex-col gap-6">
            <Card className="bg-white shadow-lg flex-1">
              <CardHeader 
                className="border-b text-[#3E53A0]"
                avatar={<Mic className="h-5 w-5" />}
                title="Audio Transcript"
              />
              <CardContent className="p-4">
                <div className="h-[calc(100vh-18rem)] overflow-auto">
                  {/* Add transcript content here */}
                  <p className="text-gray-600">Transcript will appear here...</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg">
              <CardHeader 
                className="border-b text-[#3E53A0]"
                avatar={<Mic className="h-5 w-5" />}
                title="Audio File"
              />
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <audio controls className="w-full">
                    <source src="" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scrollable Images */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader 
                className="border-b text-[#3E53A0]"
                avatar={<PhotoCameraBackIcon className="h-5 w-5" />}
                title="Scrollable Images"
              />
              <CardContent className="p-4">
                <div className="grid gap-4 h-[calc(100vh-18rem)] overflow-auto">
                  {/* Example image placeholders */}
                  <img src="/placeholder.svg?height=200&width=200" alt="Study material 1" className="w-full rounded-lg" />
                  <img src="/placeholder.svg?height=200&width=200" alt="Study material 2" className="w-full rounded-lg" />
                  <img src="/placeholder.svg?height=200&width=200" alt="Study material 3" className="w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}