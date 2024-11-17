'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, FileText, LogOut, Mic, Camera, Send } from 'lucide-react'
import { useState } from "react"

export default function Component() {
  const [message, setMessage] = useState("")
  const [chatHistory, setCharHistory] = useState([
    { role: "assistant", content: "Hello! I'm your Study GPT assistant. How can I help you understand your lecture materials better?" },
  ])

  return (
    <div className="flex min-h-screen flex-col bg-[#ECEEF0]">
      {/* Header */}
      <header className="bg-[#3E53A0] shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-white" />
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
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          {/* Left Column - Stats Cards */}
          <div className="grid gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#3E53A0] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
                <span className="text-lg font-bold text-[#3E53A0]">18</span>
              </CardHeader>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#3E53A0] flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Audio Recordings
                </CardTitle>
                <span className="text-lg font-bold text-[#3E53A0]">4</span>
              </CardHeader>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#3E53A0] flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Snapshots
                </CardTitle>
                <span className="text-lg font-bold text-[#3E53A0]">20</span>
              </CardHeader>
            </Card>
          </div>

          {/* Right Column - Study GPT Chat */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-[#3E53A0] flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Study GPT
              </CardTitle>
            </CardHeader>
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
                    placeholder="Ask about your lecture notes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-[#3E53A0] hover:bg-[#3E53A0]/90">
                    <Send className="h-4 w-4" />
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