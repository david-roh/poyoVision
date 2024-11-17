'use client'

import { Button, Card, CardContent, CardHeader, Input} from "@mui/material"
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react"

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
            <h2 className="text-2xl font-bold text-[#3E53A0] mb-6">My Lectures</h2>
            {lectures.map((lecture) => (
              <Card key={lecture.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader 
                  title={
                    <div className="flex items-center gap-3">
                      <PlayCircleOutlineIcon className="h-5 w-5 text-[#3E53A0]" />
                      <div>
                        <div className="text-[#3E53A0]">Lecture {lecture.id}</div>
                        <p className="text-sm text-gray-600">{lecture.title}</p>
                      </div>
                    </div>
                  }
                  action={
                    <span className="text-sm text-gray-600">
                      {new Date(lecture.date).toLocaleDateString()}
                    </span>
                  }
                />
              </Card>
            ))}
          </div>

          {/* Right Column - Chat Bot */}
          <Card className="bg-white shadow-lg">
            <CardHeader 
              title={
                <div className="text-[#3E53A0] flex items-center gap-2">
                  <PsychologyAltIcon className="h-5 w-5" />
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