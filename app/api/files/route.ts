import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
	try {
		console.log('Received file upload request');

		if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
			console.error('Invalid content type:', request.headers.get('content-type'));
			return NextResponse.json(
				{ error: "Invalid content type. Expected multipart/form-data" },
				{ status: 400 }
			);
		}

		const data = await request.formData();
		const file: File | null = data.get("file") as unknown as File;
		
		if (!file) {
			console.error('No file in request');
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			);
		}

		console.log('File details:', {
			name: file.name,
			type: file.type,
			size: file.size
		});

		if (!process.env.PINATA_JWT) {
			console.error('Pinata JWT missing');
			return NextResponse.json(
				{ error: "Server configuration error - Pinata JWT missing" },
				{ status: 500 }
			);
		}

		try {
			console.log('Attempting Pinata upload...');
			const uploadData = await pinata.upload.file(file);
			console.log('Upload successful:', uploadData);
			return NextResponse.json(uploadData, { status: 200 });
		} catch (pinataError: any) {
			console.error('Pinata upload error:', {
				message: pinataError.message,
				response: pinataError.response?.data,
				status: pinataError.response?.status
			});
			
			return NextResponse.json(
				{ 
					error: "Pinata upload failed", 
					details: pinataError.message,
					status: pinataError.response?.status || 500
				},
				{ status: 500 }
			);
		}

	} catch (e) {
		console.error('General error in file upload:', e);
		return NextResponse.json(
			{ 
				error: "Internal Server Error",
				details: e instanceof Error ? e.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const response = await pinata.listFiles();
		return NextResponse.json(response[0]);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
