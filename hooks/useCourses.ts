import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";

interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  lectures?: Lecture[];
}

interface Lecture {
  id: string;
  name: string;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const initializeAndFetchCourses = async () => {
      if (isLoaded && isSignedIn && user?.id) {
        try {
          // Initialize database first
          await fetch('/api/init-db', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          });

          // Then fetch courses
          const response = await fetch(`/api/courses?userId=${user.id}`);
          const data = await response.json();
          if (data.courses) {
            setCourses(data.courses);
          }
        } catch (error) {
          console.error('Error initializing or fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAndFetchCourses();
  }, [isLoaded, isSignedIn, user?.id]);

  return { courses, loading };
}