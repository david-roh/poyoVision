"use client";

import { useState } from "react";
import { Button, TextField, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from "@clerk/nextjs";

export default function CreateCourse() {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      router.push(`/`);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 pt-8">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 4, color: '#3E53A0' }}
      >
        Back
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h4" component="h1" sx={{ 
          color: '#3E53A0', 
          mb: 4, 
          fontWeight: 600 
        }}>
          Create New Course
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Course Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#3E53A0',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#3E53A0',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              bgcolor: '#3E53A0',
              '&:hover': {
                bgcolor: '#5C71BE',
              },
              textTransform: 'none',
              py: 1.5,
              mt: 4,
            }}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}