import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for streaming
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { movieName, language, tone } = await request.json();

        if (!movieName) {
            return NextResponse.json({ error: 'Movie name is required' }, { status: 400 });
        }

        const langInstruction = language === 'ar'
            ? 'Write the description ENTIRELY in Arabic. Use Arabic hashtags where appropriate, but keep the movie title hashtag in English/transliterated form.'
            : 'Write the description ENTIRELY in English.';

        const selectedTone = tone || 'Enthusiastic, immersive, and authentic';

        const systemPrompt = `You are an expert Instagram content creator specializing in movie reels. Generate an engaging, high-quality Instagram reel description for the movie "${movieName.trim()}".

${langInstruction}

Requirements:
1. DESCRIPTION: Write a detailed, engaging caption (approx. 2 paragraphs) that:
   - Starts with the Movie Title (Year) 🍿 on the first line.
   - First paragraph: Set the scene and the hook. Describe the plot premise in an exciting way without major spoilers. Use dramatic, storytelling language.
   - Second paragraph: Focus on the atmosphere, tension, or emotional impact. Why is this a must-watch? Use phrases that build hype (e.g., "Every scene builds tension...", "A masterpiece of...").
   - Use emojis naturally within the text to break up lines.
   - Tone: ${selectedTone}. Avoid generic AI-sounding reviews.

2. HASHTAGS: Provide 5 highly relevant hashtags and 3 general hashtags.

IMPORTANT FORMATTING:
- First, output the Description.
- Then, output a new line with exactly: "|||HASHTAGS|||"
- Then, output the hashtags separated by spaces on the next line.
- Do NOT output markdown code blocks. Just plain text.`;

        const apiKey = process.env.OPENROUTER;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'No OpenRouter API key configured.' },
                { status: 500 }
            );
        }

        // Use native fetch to support custom 'reasoning' parameter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Movie Reel Description Generator",
            },
            body: JSON.stringify({
                model: "arcee-ai/trinity-large-preview:free",
                messages: [
                    {
                        "role": "user",
                        "content": systemPrompt
                    }
                ],
                reasoning: { enabled: true },
                stream: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        if (!response.body) {
            throw new Error('No response body from OpenRouter');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        // Create a custom stream to parse SSE and pipe just the content
        const stream = new ReadableStream({
            async start(controller) {
                let buffer = '';

                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');

                        // Keep the last incomplete line in the buffer
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

                            if (trimmedLine.startsWith('data: ')) {
                                try {
                                    const jsonStr = trimmedLine.substring(6);
                                    const json = JSON.parse(jsonStr);
                                    const content = json.choices?.[0]?.delta?.content;

                                    if (content) {
                                        controller.enqueue(encoder.encode(content));
                                    }
                                } catch (e) {
                                    console.warn('Error parsing SSE JSON chunk:', e);
                                }
                            }
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
            cancel() {
                reader.cancel();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error) {
        console.error('[generate] Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate description.' },
            { status: 500 }
        );
    }
}
