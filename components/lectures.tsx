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
          <Card className="bg-white shadow-lg" sx={{ 
            borderRadius: '12px', 
            height: 'calc(100vh - 12rem)',
            maxHeight: '800px'
          }}>
            <CardHeader 
              title={
                <div className="text-[#3E53A0] flex items-center gap-3 font-bold text-lg">
                  <PsychologyAltIcon className="h-6 w-6" />
                  Lecture Assistant
                </div>
              }
              className="border-b"
              sx={{ 
                p: '16px 20px',  // Adjusted padding
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                bgcolor: 'rgba(62, 83, 160, 0.02)',
                borderBottom: '1px solid rgba(62, 83, 160, 0.1)',
              }}
            />
            <CardContent sx={{ 
              height: 'calc(100% - 64px)', 
              p: '0 !important',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      } items-end gap-3`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex-shrink-0">
                          <MenuBookIcon className="h-5 w-5 text-[#3E53A0]" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-[#F5F7F9] text-gray-800 rounded-bl-none"
                            : "bg-[#3E53A0] text-white rounded-br-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <Input
                    fullWidth
                    placeholder="Ask about the lecture..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '10px 16px',
                        borderRadius: '20px',
                        backgroundColor: '#F5F7F9',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        '&::placeholder': {
                          color: 'rgba(0, 0, 0, 0.45)',
                          opacity: 1
                        }
                      },
                      '&:before': {
                        display: 'none'
                      },
                      '&:after': {
                        display: 'none'
                      }
                    }}
                  />
                  <Button 
                    variant="contained"
                    sx={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      padding: 0,
                      backgroundColor: '#3E53A0',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#2E4390',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <SendIcon sx={{ fontSize: 18 }} />
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