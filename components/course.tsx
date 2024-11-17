'use client'

import { Button, Card, CardContent, Typography, TextField } from '@mui/material';
import { Psychology, Description, Mic, PhotoCamera, Send } from '@mui/icons-material';
import { useState } from "react"

export default function Component() {
  const [message, setMessage] = useState("")
  const [chatHistory, setCharHistory] = useState([
    { role: "assistant", content: "Hello! I'm your Study GPT assistant. How can I help you understand your lecture materials better?" },
  ])

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          {/* Left Column - Stats Cards */}
          <div className="grid gap-6">
            <Card sx={{ backgroundColor: 'white', '&:hover': { boxShadow: 6 }, cursor: 'pointer' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Typography variant="h6" sx={{ color: '#3E53A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description sx={{ fontSize: 20 }} />
                  Notes
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3E53A0' }}>18</Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'white', '&:hover': { boxShadow: 6 }, cursor: 'pointer' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Typography variant="h6" sx={{ color: '#3E53A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Mic sx={{ fontSize: 20 }} />
                  Audio Recordings
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3E53A0' }}>4</Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'white', '&:hover': { boxShadow: 6 }, cursor: 'pointer' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Typography variant="h6" sx={{ color: '#3E53A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoCamera sx={{ fontSize: 20 }} />
                  Snapshots
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3E53A0' }}>20</Typography>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Study GPT Chat */}
          <Card sx={{ backgroundColor: 'white' }}>
            <CardContent sx={{ borderBottom: 1, borderColor: 'divider', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#3E53A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology sx={{ fontSize: 20 }} />
                Study GPT
              </Typography>
            </CardContent>
            <CardContent>
              <div className="flex flex-col gap-4 h-[calc(100vh-20rem)] p-4">
                <div className="flex-1 overflow-auto space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.role === "assistant"
                            ? "bg-[#ECEEF0] text-gray-800"
                            : "bg-[#3E53A0] text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4" style={{ borderTop: 1, borderColor: 'divider' }}>
                  <TextField
                    placeholder="Ask about your lecture notes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: '#3E53A0', '&:hover': { backgroundColor: '#3E53A0CC' } }}
                  >
                    <Send sx={{ fontSize: 20 }} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}