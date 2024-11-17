'use client'

import { Button, Card, CardContent, CardHeader, Input} from "@mui/material"
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react"
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function Component() {
  const [message, setMessage] = useState("")
  const [chatHistory, setCharHistory] = useState([
    { role: "assistant", content: "Select a lecture to start discussing it!" },
  ])

  const lectures = [
    { id: 1, title: "Introduction to Computer Science", date: "2024-03-15" },
    { id: 2, title: "Data Structures and Algorithms", date: "2024-03-18" },
    { id: 3, title: "Web Development Fundamentals", date: "2024-03-20" },
    { id: 4, title: "Database Management Systems", date: "2024-03-22" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#ECEEF0]">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          {/* Left Column - Lecture List */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#3E53A0] mb-6">
              My Lectures
            </h2>
            {lectures.map((lecture) => (
              <Card 
                key={lecture.id} 
                sx={{ 
                  bgcolor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: 'auto',
                  p: 0,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 6px 12px -2px rgba(62, 83, 160, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Button
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    py: 3,
                    px: 4,
                    minHeight: '84px',
                    textAlign: 'left',
                    background: 'linear-gradient(135deg, rgba(62, 83, 160, 0.02) 0%, rgba(62, 83, 160, 0.06) 100%)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, rgba(62, 83, 160, 0.06) 0%, rgba(62, 83, 160, 0.1) 100%)',
                    },
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: '3px',
                      width: '100%',
                      background: 'linear-gradient(90deg, #3E53A0 0%, #5C71BE 100%)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                    },
                    '&:hover::after': {
                      opacity: 1
                    }
                  }}
                >
                  <div className="bg-[#3E53A0]/5 rounded-full p-2">
                    <PlayCircleOutlineIcon 
                      sx={{ 
                        fontSize: 24,
                        color: '#3E53A0',
                        transition: 'transform 0.2s ease-in-out',
                        '.MuiButton-root:hover &': {
                          transform: 'scale(1.1)'
                        }
                      }} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-[#3E53A0] leading-tight">
                      Lecture {lecture.id}
                    </div>
                    <p className="text-base text-gray-500 truncate leading-tight mt-1.5">
                      {lecture.title}
                    </p>
                  </div>
                  <span className="text-base text-gray-500 font-medium pl-4">
                    {new Date(lecture.date).toLocaleDateString()}
                  </span>
                </Button>
              </Card>
            ))}
          </div>

          {/* Right Column - Chat Bot */}
          <Card className="bg-white shadow-lg">
            <CardHeader 
              title={
                <div className="text-[#3E53A0] flex items-center gap-2 font-bold text-xl">
                  <PsychologyAltIcon className="h-6 w-6" />
                  Lecture Assistant
                </div>
              }
              className="border-b"
            />
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
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Ask about the lecture..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-[#3E53A0] hover:bg-[#3E53A0]/90">
                    <SendIcon className="h-4 w-4" />
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