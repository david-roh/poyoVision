"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, CardContent } from "@mui/material"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useCourses } from '@/hooks/useCourses';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";

interface Course {
	id: string;
	name: string;
	description: string;
	imageUrl?: string;
}
export default function Home() {
	const router = useRouter();
	const { isLoaded, isSignedIn, user } = useUser();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [file, setFile] = useState("");
	const [cid, setCid] = useState("");
	const [uploading, setUploading] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState<{open: boolean, courseId: string | null}>({
		open: false,
		courseId: null
	});

	const inputFile = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const initializeAndFetchCourses = async () => {
			if (isLoaded && isSignedIn && user?.id) {
				setLoading(true);
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

	const handleDelete = async () => {
		if (!deleteDialog.courseId) return;

		try {
			const response = await fetch('/api/courses', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: deleteDialog.courseId }),
			});

			if (response.ok) {
				setCourses(prevCourses => 
					prevCourses.filter(course => course.id !== deleteDialog.courseId)
				);
			} else {
				throw new Error('Failed to delete course');
			}
		} catch (error) {
			console.error(error);
			alert('Failed to delete the course');
		} finally {
			setDeleteDialog({ open: false, courseId: null });
		}
	};

	return (
		<div>
			<Dialog
				open={deleteDialog.open}
				onClose={() => setDeleteDialog({ open: false, courseId: null })}
				PaperProps={{
					sx: {
						borderRadius: '12px',
						maxWidth: '400px'
					}
				}}
			>
				<DialogTitle sx={{ 
					color: '#3E53A0',
					pb: 1
				}}>
					Delete Course
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this course?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialog({ open: false, courseId: null })} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="primary" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			{/* Main Content */}
			<main className="container max-w-5xl mx-auto px-4 pt-8"> 
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold text-[#3E53A0] font-telegraf">My Courses</h1>
				<Button
					variant="contained"
					startIcon={<AddCircleOutlineIcon />}
					onClick={() => router.push('/course/create')}
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
					Create Course
				</Button>
			</div>
			{loading ? (
				<div>Loading courses...</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2"> 
				{courses.map((course) => (
					<Card 
						key={course.id} 
						sx={{ 
							bgcolor: 'white', 
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
							borderRadius: '12px',
							overflow: 'hidden',
							transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
							'&:hover': { 
								transform: 'translateY(-4px)',
								boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
							},
							height: '100%'
						}}
					>
						<CardContent 
							sx={{ 
								p: 0,
								height: '100%',
								'&:last-child': { pb: 0 },
								position: 'relative'
							}}
						>
							<Button 
								onClick={() => setDeleteDialog({ open: true, courseId: course.id })}
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
									minWidth: 'auto',
									p: 1,
									zIndex: 1,
									color: '#666',
									'&:hover': {
										color: '#ff4444',
										bgcolor: 'rgba(255, 68, 68, 0.1)',
									},
								}}
							>
								<DeleteOutlineIcon />
							</Button>
							<Button 
								fullWidth
								onClick={() => router.push(`/course/${course.id}`)}
								startIcon={
									<MenuBookIcon sx={{ 
										fontSize: 32, 
										color: '#3E53A0',
										transition: 'transform 0.2s ease-in-out',
										'.MuiButton-root:hover &': {
											transform: 'scale(1.1)'
										}
									}} />
								}
								sx={{
									justifyContent: 'flex-start',
									p: 3,
									height: '100%',
									textAlign: 'left',
									background: 'linear-gradient(135deg, rgba(62, 83, 160, 0.05) 0%, rgba(62, 83, 160, 0.1) 100%)',
									'&:hover': { 
										background: 'linear-gradient(135deg, rgba(62, 83, 160, 0.1) 0%, rgba(62, 83, 160, 0.15) 100%)',
									},
									flexDirection: 'column',
									alignItems: 'flex-start',
									gap: 2,
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
								<span style={{ 
									fontWeight: 600, 
									color: '#3E53A0', 
									fontSize: '1.25rem',
									textTransform: 'none',
									marginBottom: '4px'
								}}>
									{course.name}
								</span>
								<span style={{
									fontSize: '0.875rem',
									color: '#666',
									opacity: 0.8
								}}>
									{course.description || 'Click to view course details'}
								</span>
							</Button>
						</CardContent>
					</Card>
				))}
				</div>
			)}
			</main>
		</div>
	);
}
