"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Files from "@/components/Files";

export default function Home() {
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
		<>
		</>
	);
}
