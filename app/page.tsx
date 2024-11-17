"use client";

import { useState, useRef } from "react";
import { Button, Card, CardContent } from "@mui/material"
import MenuBookIcon from '@mui/icons-material/MenuBook'

export default function Home() {
	const courses = [
		"Introduction to Computer Science",
		"Data Structures and Algorithms",
		"Web Development Fundamentals",
		"Machine Learning Basics",
		"Software Engineering Principles"
	  ]
	
	const [file, setFile] = useState("");
	const [cid, setCid] = useState("");
	const [uploading, setUploading] = useState(false);

	const inputFile: any = useRef(null);

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

	const handleChange = (e: any) => {
		setFile(e.target.files[0]);
		uploadFile(e.target.files[0]);
	};

	const loadRecent = async () => {
		try {
			const res = await fetch("/api/files");
			const json = await res.json();
			setCid(json.ipfs_pin_hash);
		} catch (e) {
			console.log(e);
			alert("trouble loading files");
		}
	};

	return (
		<div>
		{/* Main Content */}
			<main className="container max-w-5xl mx-auto px-4 pt-8"> {/* Increased max-width */}
			<h1 className="text-4xl font-bold text-[#3E53A0] mb-8 font-telegraf">My Courses</h1> {/* Increased heading size and margin */}
			<div className="grid gap-6 md:grid-cols-2"> {/* Increased gap and reduced columns */}
			{courses.map((course, index) => (
				<Card 
					key={index} 
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
								{course}
							</span>
							<span style={{
								fontSize: '0.875rem',
								color: '#666',
								opacity: 0.8
							}}>
								Click to view course details
							</span>
						</Button>
					</CardContent>
				</Card>
			))}
			</div>
		</main>
	  </div>
	);
}
