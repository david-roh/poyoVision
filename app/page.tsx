"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Card, CardContent } from "@mui/material"
import MenuBookIcon from '@mui/icons-material/MenuBook'

import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useUser } from "@clerk/nextjs";

interface Course {
	id: string;
	name: string;
	description: string;
}

export default function Home() {
	const router = useRouter();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [file, setFile] = useState("");
	const [cid, setCid] = useState("");
	const [uploading, setUploading] = useState(false);
	const { isLoaded, isSignedIn, user } = useUser();

	const inputFile: any = useRef(null);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch("/api/courses");
				if (!response.ok) throw new Error("Failed to fetch courses");
				const data = await response.json();
				setCourses(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	const uploadFile = async (fileToUpload: any) => {
		try {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", fileToUpload, `${fileToUpload.name}`);
			const request = await fetch("/api/files", {
				method: "POST",
				body: formData,
			});
			const response = await request.json();
			console.log(response);
			setCid(response.IpfsHash);
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
			alert("Trouble uploading file");
		}
	};

	return (
		<div>
			{/* Main Content */}
			<main className="container max-w-5xl mx-auto px-4 pt-8"> {/* Increased max-width */}
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
				<div className="grid gap-6 md:grid-cols-2"> {/* Increased gap and reduced columns */}
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
								'&:last-child': { pb: 0 }
							}}
						>
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
