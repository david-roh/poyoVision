'use client'

import { useParams } from "next/navigation";
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useState, useEffect } from "react";

interface CourseData {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: { url: string }[];
  lectures?: {
    id: string;
    title: string;
    description: string;
    date: string;
    createdAt: string;
  }[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.courseId) {
      fetchCourseData();
    }
  }, [params.courseId]);

  const addLecture = async (title: string, description: string) => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}/lectures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create lecture');
      
      // Refresh course data to show new lecture
      const updatedCourse = await fetch(`/api/courses/${params.courseId}`);
      const data = await updatedCourse.json();
      setCourseData(data);
    } catch (error) {
      console.error('Failed to add lecture:', error);
      alert('Failed to add lecture');
    }
  };

  if (loading) return <div>Loading course data...</div>;
  if (!courseData) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-[#ECEEF0]">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          {/* Left Column - Lecture List */}
          <div className="space-y-4">
            <Typography variant="h4" sx={{ color: '#3E53A0', fontWeight: 600, mb: 3 }}>
              {courseData.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
              {courseData.description}
            </Typography>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" sx={{ color: '#3E53A0' }}>
                Lectures
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  const title = prompt('Enter lecture title:');
                  const description = prompt('Enter lecture description:');
                  if (title && description) {
                    addLecture(title, description);
                  }
                }}
                sx={{
                  bgcolor: '#3E53A0',
                  '&:hover': {
                    bgcolor: '#5C71BE',
                  },
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                }}
              >
                Add Lecture
              </Button>
            </div>
            
            {courseData.lectures?.map((lecture) => (
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
                  onClick={() => router.push(`/course/${params.courseId}/lecture/${lecture.id}`)}
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
          {/* Add the chat component here or create a separate component for it */}
        </div>
      </main>
    </div>
  );
}