import '@/utils/neon-server';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { generateGeminiContent } from '@/utils/GeminiAI';
import { parseGeminiJson } from '@/utils/parseGeminiJson';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export async function POST(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Please sign in before starting an interview.' },
        { status: 401 }
      );
    }

    const { jobPosition, jobDesc, jobExp } = await req.json();

    if (!jobPosition || !jobDesc || jobExp === undefined || jobExp === '') {
      return NextResponse.json(
        { error: 'Job position, description, and experience are required.' },
        { status: 400 }
      );
    }

    const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;

    const prompt = `Job Position: ${jobPosition}. Job description: ${jobDesc}. Years of experience: ${jobExp}.
Return ONLY a JSON array of exactly ${questionCount} objects. Each object must have "question" and "answer" string fields.
No markdown, no extra text.`;

    const rawResponse = await generateGeminiContent(prompt, { json: true });
    const parsedJsonResp = parseGeminiJson(rawResponse);

    if (!parsedJsonResp || (Array.isArray(parsedJsonResp) && parsedJsonResp.length === 0)) {
      return NextResponse.json(
        { error: 'AI returned empty interview questions. Please try again.' },
        { status: 502 }
      );
    }

    const newMockId = uuidv4();
    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: newMockId,
        jsonMockResp: JSON.stringify(parsedJsonResp),
        jobPosition,
        jobExperience: String(jobExp),
        createdBy: userEmail,
        createdAt: moment().format('DD-MM-YYYY'),
      })
      .returning({ mockId: MockInterview.mockId });

    const mockId = resp?.[0]?.mockId;
    if (!mockId) {
      return NextResponse.json(
        { error: 'Failed to save interview to database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ mockId });
  } catch (err) {
    console.error('API /api/interview error:', err);
    const message = err?.message || 'Unknown error';

    if (message.includes('quota') || message.includes('429')) {
      return NextResponse.json(
        { error: 'Gemini API quota exceeded. Wait a few minutes or use a new API key.' },
        { status: 429 }
      );
    }
    if (message.includes('503') || message.includes('high demand')) {
      return NextResponse.json(
        { error: 'Gemini is busy right now. Please try again in a minute.' },
        { status: 503 }
      );
    }
    if (message.includes('parse') || message.includes('JSON')) {
      return NextResponse.json(
        { error: 'AI returned invalid data. Please try again.' },
        { status: 502 }
      );
    }
    if (message.includes('connecting to database') || message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Database connection failed. Check your Neon project and connection URL.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'There was an error generating or inserting the interview data. Please try again.' },
      { status: 500 }
    );
  }
}
