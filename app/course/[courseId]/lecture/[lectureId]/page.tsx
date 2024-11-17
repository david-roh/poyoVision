'use client'

import { useParams } from "next/navigation";
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Psychology, Description, Mic } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import { useState, useEffect } from "react"

interface LectureData {
  name: string;
  description: string;
  notes?: string;
  transcript?: string;
  audioUrl?: string;
  images?: { url: string }[];
}

export default function LectureIdPage() {
  const params = useParams();
  const [lectureData, setLectureData] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}/lecture/${params.lectureId}`);
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setLectureData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.courseId) {
      fetchLectureData();
    }
  }, [params.courseId]);

  if (loading) return <div>Loading course data...</div>;
  if (!lectureData) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="container mx-auto">
        <Typography variant="h4" sx={{ color: '#3E53A0', fontWeight: 600 }}>
          {lectureData.name}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
          {lectureData.description}
        </Typography>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-[1fr_1fr_300px] gap-8">
          {/* Notes Column */}
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
                  {lectureData.notes ? (
                    <div dangerouslySetInnerHTML={{ __html: lectureData.notes }} />
                  ) : (
                    <p className="text-gray-600">No notes available yet...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Transcript Column */}
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
              <CardContent className="p-6">
                <div className="h-[calc(100vh-18rem)] overflow-auto custom-scrollbar">
                  {lectureData.transcript ? (
                    <p>{lectureData.transcript}</p>
                  ) : (
                    <p className="text-gray-600">No transcript available yet...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audio Player Card */}
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
                    <source src={lectureData.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images Column */}
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
            <CardContent className="p-6">
              <div className="grid gap-6 h-[calc(100vh-18rem)] overflow-auto custom-scrollbar">
                {lectureData.images && lectureData.images.length > 0 ? (
                  lectureData.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image.url} 
                      alt={`Study material ${index + 1}`} 
                      className="w-full rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200" 
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No images available yet...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}