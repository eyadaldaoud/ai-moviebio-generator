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

        const metadataLabels = language === 'ar'
            ? { name: 'الاسم', rating: 'التقييم', type: 'النوع', genre: 'التصنيف', year: 'سنة الإصدار', movie: 'فيلم', tvShow: 'مسلسل' }
            : { name: 'Name', rating: 'Rating', type: 'Type', genre: 'Genre', year: 'Year', movie: 'Movie', tvShow: 'TV Show' };

        const selectedTone = tone || 'Enthusiastic, immersive, and authentic';

        const systemPrompt = `You are a viral Instagram storyteller who creates descriptions that make people STOP scrolling. You write like a passionate cinephile, not a robot. Generate an extremely engaging, scroll-stopping Instagram reel description for the movie/show "${movieName.trim()}".

${langInstruction}

Requirements:
1. DESCRIPTION: Write a detailed, engaging caption that MUST start with these 5 info lines at the top, each on its own line, using the EXACT format below:

🎥 ${metadataLabels.name} : (the full title of the movie/show)
⭐ ${metadataLabels.rating} : X/10
🎬 ${metadataLabels.type} : ${metadataLabels.movie} or ${metadataLabels.tvShow}
🎭 ${metadataLabels.genre} : (the genre(s), e.g. Drama, Action, Thriller)
📅 ${metadataLabels.year} : (the year of release)

Example (English):
🎥 Name : Interstellar
⭐ Rating : 8.7/10
🎬 Type : Movie
🎭 Genre : Sci-Fi, Adventure
📅 Year : 2014

Example (Arabic):
🎥 الاسم : إنترستيلر
⭐ التقييم : 8.7/10
🎬 النوع : فيلم
🎭 التصنيف : خيال علمي، مغامرة
📅 سنة الإصدار : 2014

You MUST use the correct IMDb rating (or closest known rating out of 10), the accurate type, genre(s), and year of release. Do NOT guess — use real data.

After these 4 info lines, leave a blank line, then write the caption (approx. 2 paragraphs):
   - First paragraph: Set the scene and the hook. Describe the plot premise in an exciting way without major spoilers. Use dramatic, storytelling language.
   - Second paragraph: Focus on the atmosphere, tension, or emotional impact. Why is this a must-watch? Use phrases that build hype (e.g., "Every scene builds tension...", "A masterpiece of...").
   - Use emojis GENEROUSLY (at least 2-3 per sentence) within the text to break up lines and add visual flavor. Use relevant movie, emotion, and aesthetic emojis.
   - Tone: ${selectedTone}. Avoid generic AI-sounding reviews.

2. HASHTAGS: Provide exactly 4 hashtags. Two hashtags must be #fyp and #اكسبلور. The other two hashtags must be highly relevant to the movie type/genre and context.

IMPORTANT FORMATTING:
- First, output the 4 info lines, then a blank line, then the description paragraphs.
- Then, output a new line with exactly: "|||HASHTAGS|||"
- Then, output the hashtags separated by spaces on the next line.
- Do NOT use markdown, bullet points, or code blocks.`;

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
                // Stream directly without any prefix

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
