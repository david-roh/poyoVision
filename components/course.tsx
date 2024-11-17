'use client'

import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
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
    <div className="min-h-screen bg-light">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-[1fr_1fr_300px] gap-8">
          {/* Left Column - Notes */}
          <Card 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid rgba(62, 83, 160, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <CardHeader 
              className="border-b border-gray-100"
              avatar={
                <DescriptionIcon 
                  sx={{ 
                    color: '#3E53A0',
                    fontSize: '1.5rem'
                  }} 
                />
              }
              title={
                <Typography variant="h6" sx={{ 
                  color: '#3E53A0',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  Notes
                </Typography>
              }
            />
            <CardContent className="p-4">
              <div className="h-[calc(100vh-24rem)] overflow-auto custom-scrollbar">
                <div className="prose max-w-none">
                  <p className="text-gray-600">Your notes will appear here...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Middle Column - Audio Transcript and Player */}
          <div className="flex flex-col gap-6">
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(62, 83, 160, 0.1)',
                flex: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardHeader 
                className="border-b border-gray-100"
                avatar={
                  <Mic 
                    sx={{ 
                      color: '#3E53A0',
                      fontSize: '1.5rem'
                    }} 
                  />
                }
                title={
                  <Typography variant="h6" sx={{ 
                    color: '#3E53A0',
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}>
                    Audio Transcript
                  </Typography>
                }
              />
              <CardContent className="p-4">
                <div className="h-[calc(100vh-28rem)] overflow-auto custom-scrollbar">
                  <p className="text-gray-600">Transcript will appear here...</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(62, 83, 160, 0.1)',
              }}
            >
              <CardHeader 
                className="border-b border-gray-100"
                avatar={
                  <Mic 
                    sx={{ 
                      color: '#3E53A0',
                      fontSize: '1.5rem'
                    }} 
                  />
                }
                title={
                  <Typography variant="h6" sx={{ 
                    color: '#3E53A0',
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}>
                    Audio File
                  </Typography>
                }
              />
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <audio controls className="w-full rounded-full">
                    <source src="" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scrollable Images */}
          <Card 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid rgba(62, 83, 160, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <CardHeader 
              className="border-b border-gray-100"
              avatar={
                <PhotoCameraBackIcon 
                  sx={{ 
                    color: '#3E53A0',
                    fontSize: '1.5rem'
                  }} 
                />
              }
              title={
                <Typography variant="h6" sx={{ 
                  color: '#3E53A0',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  Snapshots
                </Typography>
              }
            />
            <CardContent className="p-4">
              <div className="grid gap-3 h-[calc(100vh-28rem)] overflow-auto custom-scrollbar">
                {/* Example image placeholders */}
                <img src="/placeholder.svg?height=200&width=200" alt="Study material 1" className="w-full rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" />
                <img src="/placeholder.svg?height=200&width=200" alt="Study material 2" className="w-full rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" />
                <img src="/placeholder.svg?height=200&width=200" alt="Study material 3" className="w-full rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}