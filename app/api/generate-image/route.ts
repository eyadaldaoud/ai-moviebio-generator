import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'No OpenRouter API key configured.' },
                { status: 500 }
            );
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sourceful/riverflow-v2-pro',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                modalities: ['image'],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        const result = await response.json();

        if (result.choices && result.choices[0].message.images) {
            const image = result.choices[0].message.images[0];
            return NextResponse.json({ imageUrl: image.image_url.url });
        } else {
            throw new Error('No image generated in the response');
        }
    } catch (error: any) {
        console.error('[generate-image] error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image.' },
            { status: 500 }
        );
    }
}
