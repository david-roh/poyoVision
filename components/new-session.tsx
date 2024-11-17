'use client'

import { Button, Card, CardContent, Typography, Popover, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PhotoCamera, Flag, Mic, Videocam } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import ReactMarkdown from 'react-markdown';

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

  const [latestSnapshot, setLatestSnapshot] = useState<string | null>(null)
  const [selectedText, setSelectedText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [sessionDefinitions, setSessionDefinitions] = useState<Array<{term: string, definition: string}>>([]);
  const [sessionSnapshots, setSessionSnapshots] = useState<Array<{ url: string, timestamp: string }>>([]);

  // Function to get list of video devices
  const getVideoDevices = async () => {
    try {
      // First request permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      console.log('Available video devices:', videoDevices)
      
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
  // Start webcam when device is selected
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
    const setupWebcam = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          console.error('No video devices found');
          return;
        }

        // Set the first device as default if none selected
        if (!selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
        }

        if (!videoRef.current) {
          console.error("Video element not found.");
          return;
        }

        try {
          console.log('Attempting to access device:', selectedDevice);
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: selectedDevice }
            },
            audio: false
          });

          videoRef.current.srcObject = stream;
          await videoRef.current.play();

        } catch (err) {
          console.error('Error accessing webcam:', err);
        }
      } catch (err) {
        console.error('Error setting up webcam:', err);
      }
    };

    setupWebcam();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDevice]);

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

  const stopListening = async () => {
    SpeechRecognition.stopListening()
    
    // Wait briefly to ensure final transcription is processed
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add any final transcript that hasn't been added to transcription array yet
    if (finalTranscript) {
      setTranscription(prev => [...prev, finalTranscript])
    }
    
    // Add any remaining interim transcript
    if (interimTranscript) {
      setTranscription(prev => [...prev, interimTranscript])
    }

    // Use a Promise to wait for state update
    await new Promise(resolve => {
      setTimeout(() => {
        const fullTranscript = transcription.join(' ')
        console.log('Full Session Transcript:\n', fullTranscript)
        
        // Move the API call inside here to ensure it happens after state is updated
        fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transcript: fullTranscript
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          setSessionSummary(data.choices[0].message.content);
          setShowSummaryModal(true);
        })
        .catch(error => {
          console.error('Error getting summary:', error)
        })
        .finally(() => resolve(void 0))
      }, 500) 
    })
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

  const takeSnapshotAndUpload = async () => {
    if (!videoRef.current) {
      console.error("Video element not found.");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setLatestSnapshot(imageUrl);

          setSessionSnapshots(prev => [...prev, {
            url: imageUrl,
            timestamp: new Date().toLocaleTimeString()
          }]);

          const file = new File([blob], "snapshot.png", { type: "image/png" });
          
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/files', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);
            
          } catch (error) {
            console.error("Upload error:", error);
            alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }, "image/png");
    }
  };

  const handleTextSelection = async (event: MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);
      setAnchorEl(event.target as HTMLElement);
    } else {
      setAnchorEl(null);
    }
  };

  const handleGetDefinition = async () => {
    setIsLoadingDefinition(true);
    try {
      const response = await fetch('/api/definition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highlightedText: selectedText }),
      });

      if (!response.ok) throw new Error('Failed to get definition');
      
      const data = await response.json();
      const newDefinition = data.choices[0].message.content;
      setDefinition(newDefinition);
      // Store the definition for the session summary
      setSessionDefinitions(prev => [...prev, { term: selectedText, definition: newDefinition }]);
    } catch (error) {
      console.error('Error getting definition:', error);
    } finally {
      setIsLoadingDefinition(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDefinition(null);
  };

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr] p-4">
          {/* Video Feed */}
          <div className="flex flex-col gap-6">
            {/* Camera selector and video content */}
            <select 
              value={selectedDevice}
              onChange={(e) => {
                console.log('Changing device to:', e.target.value)
                setSelectedDevice(e.target.value)
              }}
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
                padding: '0 !important',
                aspectRatio: '16/9'
              }}>
                {isMounted && (
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
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant={isRecording ? "contained" : "contained"}
                color={isRecording ? "error" : "primary"}
                sx={{ 
                  gap: 1,
                  backgroundColor: '#3E53A0',
                  flex: 1,
                  py: 2,
                  fontSize: '1.125rem',
                }}
                onClick={takeSnapshotAndUpload}
                startIcon={<PhotoCamera />}
              >
                Take Snapshot
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
                    onMouseUp={(e) => handleTextSelection(e as unknown as MouseEvent)}
                  >
                    {text}
                  </div>
                ))}
                {interimTranscript && (
                  <div className="text-gray-500 text-sm">
                    {interimTranscript}
                  </div>
                )}

                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div className="p-4 max-w-sm">
                    {!definition ? (
                      <div className="flex flex-col gap-3">
                        <Typography variant="body2">
                          Would you like to get a definition for:
                          <br />
                          <strong>"{selectedText}"</strong>?
                        </Typography>
                        <Button
                          onClick={handleGetDefinition}
                          disabled={isLoadingDefinition}
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: '#3E53A0' }}
                        >
                          {isLoadingDefinition ? 'Loading...' : 'Get Definition'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Typography variant="body2">
                          <strong>Definition:</strong>
                        </Typography>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {definition}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Snapshot Preview */}
      {latestSnapshot && (
        <div 
          className="fixed bottom-4 right-4 z-50 shadow-lg rounded-lg overflow-hidden bg-white"
          style={{ maxWidth: '200px' }}
        >
          <img 
            src={latestSnapshot} 
            alt="Latest snapshot" 
            className="w-full h-auto"
          />
          <button
            onClick={() => setLatestSnapshot(null)}
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary Modal */}
      <Dialog
        open={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Session Summary</DialogTitle>
        <DialogContent>
          <div className="prose max-w-none">
            <h1>Study Notes</h1>
            <ReactMarkdown>{sessionSummary || ''}</ReactMarkdown>
            
            {sessionDefinitions.length > 0 && (
              <>
                <h2 className="mt-8"><hr className="mb-6 border-t-2 border-gray-300" />Definitions</h2>
                {sessionDefinitions.map((def, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-bold">{def.term}</h3>
                    <ReactMarkdown>{def.definition}</ReactMarkdown>
                  </div>
                ))}
              </>
            )}

            {sessionSnapshots.length > 0 && (
              <>
                <h2 className="mt-8"><hr className="mb-6 border-t-2 border-gray-300" />Captured Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {sessionSnapshots.map((snapshot, index) => (
                    <div key={index} className="relative aspect-video">
                      <img 
                        src={snapshot.url} 
                        alt={`Snapshot ${index + 1}`}
                        className="rounded-lg shadow-md w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {snapshot.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}