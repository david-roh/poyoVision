import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { highlightedText } = await request.json();

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
                        content: "Provide a concise definition and context for the following text. If it is a word, explain its meaning. If it is a phrase or sentence, summarize its purpose or meaning in a clear and brief manner suitable for quick understanding."
                    },
                    {
                        role: "user",
                        content: highlightedText
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
        console.error('Error in definition API route:', error);
        return NextResponse.json(
            { error: "Failed to define highlighted text" },
            { status: 500 }
        );
    }
}