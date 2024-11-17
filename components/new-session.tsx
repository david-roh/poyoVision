'use client'

import { Button, Card, CardContent, Typography } from '@mui/material';
import { PhotoCamera, Flag, Mic, Videocam } from '@mui/icons-material';
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

interface NewSessionProps {
  courseId: string;
  lectureId: string;
  recordingId: string;
}

export default function Component({ courseId, lectureId, recordingId }: NewSessionProps) {
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

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'completed' | 'error'>('idle');

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
  const handleSessionButton = async () => {
    if (sessionActive) {
      // Stop recording
      setSessionActive(false);
      if (audioRecorder) {
        await stopListening(); // Wait for transcription to finish
        audioRecorder.stop();
        // audioRecorder.onstop will handle the audio upload
        await handleSessionEnd(); // Wait for transcript and summary uploads
      }
    } else {
      // Start new recording session
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        
        const recorder = new MediaRecorder(stream);
        setAudioRecorder(recorder);
        
        recorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          
          try {
            // Upload audio file
            const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioFile);

            // Upload to Pinata
            const uploadResponse = await fetch('/api/files', {
              method: 'POST',
              body: formData
            });

            if (!uploadResponse.ok) throw new Error('Failed to upload audio to Pinata');
            const uploadData = await uploadResponse.json();

            // Save to recordings table
            const response = await fetch(`/api/courses/${courseId}/lectures/${lectureId}/media`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                type: 'audio',
                recordingId: recordingId,
                cid: uploadData.IpfsHash
              })
            });

            if (!response.ok) {
              throw new Error('Failed to save audio metadata');
            }

            // Clean up
            audioStream?.getTracks().forEach(track => track.stop());
            setAudioStream(null);
            setAudioRecorder(null);
            audioChunks.current = [];

          } catch (error) {
            console.error('Failed to handle audio:', error);
            setError('Failed to save audio recording');
          }
        };

        recorder.start();
        setSessionActive(true);
        startListening();
      } catch (error) {
        console.error('Failed to start recording:', error);
        setError('Failed to start audio recording');
      }
    }
  };

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
          console.log('Transcript Summary:', data.choices[0].message.content)
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
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const imageBlob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg')
    );

    // Create file from blob
    const file = new File([imageBlob], 'snapshot.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file);

    try {
      // First upload to Pinata through /api/files
      const uploadResponse = await fetch('/api/files', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload to Pinata');
      
      const uploadData = await uploadResponse.json();
      setLatestSnapshot(URL.createObjectURL(imageBlob));

      // If we have courseId and lectureId, save to snapshots table
      if (courseId && lectureId) {
        const response = await fetch(`/api/courses/${courseId}/lecture/${lectureId}/media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'snapshot',
            recordingId: recordingId, // You'll need to track this in state
            imageCid: uploadData.cid // CID from Pinata response
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save snapshot metadata');
        }
      }
    } catch (error) {
      console.error('Failed to handle snapshot:', error);
      setError('Failed to save snapshot');
    }
  };

  const handleSessionEnd = async () => {
    try {
      setStatus('processing');
      
      // Handle transcript upload
      const transcriptBlob = new Blob([transcription.join(' ')], { type: 'text/plain' });
      const transcriptFile = new File([transcriptBlob], 'transcript.txt', { type: 'text/plain' });
      const transcriptFormData = new FormData();
      transcriptFormData.append('file', transcriptFile);

      const transcriptUploadResponse = await fetch('/api/files', {
        method: 'POST',
        body: transcriptFormData
      });

      if (!transcriptUploadResponse.ok) {
        throw new Error('Failed to upload transcript');
      }

      const transcriptData = await transcriptUploadResponse.json();
      console.log('Transcript upload response:', transcriptData); // Debug log

      // Update recording with transcript CID
      const transcriptMediaResponse = await fetch(`/api/courses/${courseId}/lectures/${lectureId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'transcript',
          recordingId: recordingId, // Make sure this is passed from props
          cid: transcriptData.IpfsHash // Use IpfsHash from Pinata response
        })
      });

      if (!transcriptMediaResponse.ok) {
        const errorData = await transcriptMediaResponse.json();
        throw new Error(`Failed to save transcript metadata: ${JSON.stringify(errorData)}`);
      }

      // Generate and upload summary
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: transcription.join(' ')
        })
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryData = await summaryResponse.json();
      const summary = summaryData.choices[0].message.content;
      
      const summaryBlob = new Blob([summary], { type: 'text/plain' });
      const summaryFile = new File([summaryBlob], 'summary.txt', { type: 'text/plain' });
      const summaryFormData = new FormData();
      summaryFormData.append('file', summaryFile);

      const summaryUploadResponse = await fetch('/api/files', {
        method: 'POST',
        body: summaryFormData
      });

      if (!summaryUploadResponse.ok) {
        throw new Error('Failed to upload summary');
      }

      const summaryUploadData = await summaryUploadResponse.json();
      console.log('Summary upload response:', summaryUploadData); // Debug log

      const summaryMediaResponse = await fetch(`/api/courses/${courseId}/lectures/${lectureId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'summary',
          recordingId: recordingId, // Make sure this is passed from props
          cid: summaryUploadData.IpfsHash // Use IpfsHash from Pinata response
        })
      });

      if (!summaryMediaResponse.ok) {
        const errorData = await summaryMediaResponse.json();
        throw new Error(`Failed to save summary metadata: ${JSON.stringify(errorData)}`);
      }

      setStatus('completed');
    } catch (error) {
      console.error('Session end error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process session');
      setStatus('error');
    }
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
                  fontSize: '1.125rem'
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
    </div>
  )
}