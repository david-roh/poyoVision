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
			<main className="container max-w-5xl mx-auto px-4 py-8"> {/* Increased max-width */}
			<h1 className="text-4xl font-bold text-[#3E53A0] mb-8">My Courses</h1> {/* Increased heading size and margin */}
			<div className="grid gap-6 md:grid-cols-2"> {/* Increased gap and reduced columns */}
			{courses.map((course, index) => (
				<Card key={index} sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.3s' }}>
					<CardContent sx={{ p: 0 }}>
						<Button 
							fullWidth
							startIcon={<MenuBookIcon sx={{ fontSize: 32, color: '#3E53A0' }} />}
							sx={{
								justifyContent: 'flex-start',
								p: 3,
								height: '100%',
								textAlign: 'left',
								'&:hover': { bgcolor: 'rgba(62, 83, 160, 0.1)' },
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: 2
							}}
						>
							<span style={{ fontWeight: 600, color: '#3E53A0', fontSize: '1.25rem' }}>{course}</span>
						</Button>
					</CardContent>
				</Card>
			))}
			</div>
		</main>
	  </div>
	);
}
