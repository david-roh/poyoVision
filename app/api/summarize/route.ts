import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { transcript } = await request.json();

        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "Summarize the following transcript into concise and well-organized notes. Focus on the key points, main ideas, and any actionable takeaways or examples. Present the summary in a structured, bullet-point format as if an expert notetaker is preparing study notes for students based on a lecture. Ensure clarity and brevity while retaining all essential information:"
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                stop: ["<|eot_id|>"],
                model: "Meta-Llama-3.1-405B-Instruct",
                stream: false,
                stream_options: { include_usage: true }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in summarize API route:', error);
        return NextResponse.json(
            { error: "Failed to summarize transcript" },
            { status: 500 }
        );
    }
}