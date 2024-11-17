'use client'

import { Button, Card, CardContent, Typography } from '@mui/material';
import { PhotoCamera, Flag, Mic, Videocam } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Component() {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [transcription, setTranscription] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  // Function to get list of video devices
  const getVideoDevices = async () => {
    try {
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ video: true })
      
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      console.log('Available video devices:', videoDevices) // Debug line
      setVideoDevices(videoDevices)
      // Set first device as default if none selected
      if (videoDevices.length && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId)
      }
    } catch (err) {
      console.error('Error accessing video devices:', err)
      setError('Failed to access video devices. Please ensure camera permissions are granted.')
    }
  }

  // Get devices when component mounts
  useEffect(() => {
    getVideoDevices()
    // Listen for device changes (e.g., plugging in/removing cameras)
    navigator.mediaDevices.addEventListener('devicechange', getVideoDevices)
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getVideoDevices)
    }
  }, [])

  // Start webcam when device is selected
  useEffect(() => {
    async function setupWebcam() {
      if (!selectedDevice) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            deviceId: selectedDevice
          },
          audio: false
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Error accessing webcam:', err)
      }
    }

    setupWebcam()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [selectedDevice])

  // Add this function to handle session end
  const handleSessionButton = () => {
    if (sessionActive) {
      // If session is active, end it and navigate home
      setSessionActive(false)
      // setTimeout(() => {
      //   router.push('/')
      // }, 500)
    } else {
      // If no session, start one
      setSessionActive(true)
      startListening()
    }
  }

  // Handle speech transcription
  const startListening = () => {
    resetTranscript()
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    })
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    // Log the full transcript by joining all entries with newlines
    console.log('Full Session Transcript:\n', transcription.join('\n'))
  }

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Browser doesn't support speech recognition.")
    }
  }, [])

  // Update transcription state when final transcript is available
  useEffect(() => {
    if (finalTranscript) {
      setTranscription((prev) => [...prev, finalTranscript])
      resetTranscript()
    }
  }, [finalTranscript])

  // Add this effect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr] p-4">
          {/* Video Feed */}
          <div className="flex flex-col gap-6">
            {/* Add camera selector */}
            <select 
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="mb-4 p-2 border rounded"
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>

            <Card sx={{ 
              border: '2px dashed rgba(62, 83, 160, 0.3)',
              backgroundColor: 'white' 
            }}>
              <CardContent sx={{ 
                padding: '0 !important', // Remove padding for video
                aspectRatio: '16/9'
              }}>
                {isMounted && (  // Only render video on client-side
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant={isRecording ? "contained" : "contained"}
                color={isRecording ? "error" : "primary"}
                sx={{ 
                  gap: 1,
                  backgroundColor: '#3E53A0',
                  flex: 1,
                  py: 2,
                  fontSize: '1.125rem'
                }}
                onClick={() => setIsRecording(!isRecording)}
                startIcon={<PhotoCamera />}
              >
                {isRecording ? "Stop Recording" : "Take Snapshot"}
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ 
                  gap: 1,
                  borderColor: 'rgba(62, 83, 160, 0.3)',
                  color: 'primary',
                  flex: 1,
                  py: 2,
                  fontSize: '1.125rem'
                }}
              >
                <Flag />
                Flag
              </Button>
              <Button 
                variant="contained" 
                color={sessionActive ? "error" : "success"}
                onClick={() => {
                  handleSessionButton()
                  if (sessionActive) stopListening()
                }}
                sx={{ flex: 1, py: 2, fontSize: '1.125rem' }}
              >
                {sessionActive ? "End Session" : "Start Session"}
              </Button>
            </div>
          </div>

          {/* Live Transcription */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <div className="mb-4 flex items-center gap-3">
                <Mic sx={{ fontSize: 20, color: '#3E53A0' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3E53A0' }}>
                  Live Audio Transcription
                </Typography>
              </div>
              <div className="h-[calc(100vh-20rem)] space-y-4 overflow-auto rounded-md bg-[#ECEEF0] p-4 sm:p-6">
                {error && <Typography color="error">{error}</Typography>}
                {transcription.map((text, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white p-4 text-sm shadow-sm border border-[#3E53A0]/10"
                  >
                    {text}
                  </div>
                ))}
                {interimTranscript && (
                  <div className="text-gray-500 text-sm">
                    {interimTranscript}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
