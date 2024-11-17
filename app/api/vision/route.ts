import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract and summarize the key information from this image in a concise, notes-style format. Focus only on the main points and content. When mathematical expressions are present, use markdown math notation."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.5, // Lower temperature for more focused responses
      max_tokens: 500,  // Reduced for more concise responses
      top_p: 1,
      stream: false,
    });

    return NextResponse.json(chatCompletion);
  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}