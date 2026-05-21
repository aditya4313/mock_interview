import '@/utils/neon-server';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import moment from 'moment';
import { generateGeminiContent } from '@/utils/GeminiAI';
import { parseGeminiJson } from '@/utils/parseGeminiJson';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';

export async function GET(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockIdRef = req.nextUrl.searchParams.get('mockIdRef');
    if (!mockIdRef) {
      return NextResponse.json({ error: 'mockIdRef is required' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockIdRef),
          eq(UserAnswer.userEmail, userEmail)
        )
      )
      .orderBy(UserAnswer.id);

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error('GET /api/user-answer error:', err);
    return NextResponse.json(
      { error: 'Failed to load interview answers.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }

    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      questionIndex,
    } = await req.json();

    if (!mockIdRef || !question || !userAns?.trim()) {
      return NextResponse.json(
        { error: 'mockIdRef, question, and userAns are required.' },
        { status: 400 }
      );
    }

    if (userAns.trim().length <= 10) {
      return NextResponse.json(
        { error: 'Answer is too short. Please record a longer answer.' },
        { status: 400 }
      );
    }

    const feedbackPrompt = `Question: ${question}, User Answer: ${userAns}, Depending on the question and user answer for the given interview question, please give us a rating for the answer and feedback as areas of improvement if any, in just 3 to 5 lines to improve it in JSON format with rating and feedback fields.`;

    const rawFeedback = await generateGeminiContent(feedbackPrompt, { json: true });
    const jsonfeedbackresp = parseGeminiJson(rawFeedback);

    const rating = String(jsonfeedbackresp?.rating ?? '');
    const feedback = String(jsonfeedbackresp?.feedback ?? '');

    const row = {
      mockIdRef,
      question,
      correctAns: correctAns ?? '',
      userAns: userAns.trim(),
      feedback,
      rating,
      userEmail,
      createdAt: moment().format('DD-MM-YYYY'),
    };

    const existing = await db
      .select({ id: UserAnswer.id })
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockIdRef),
          eq(UserAnswer.userEmail, userEmail),
          eq(UserAnswer.question, question)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(UserAnswer)
        .set({
          userAns: row.userAns,
          correctAns: row.correctAns,
          feedback: row.feedback,
          rating: row.rating,
          createdAt: row.createdAt,
        })
        .where(eq(UserAnswer.id, existing[0].id));

      return NextResponse.json({ ok: true, updated: true, questionIndex });
    }

    await db.insert(UserAnswer).values(row);
    return NextResponse.json({ ok: true, updated: false, questionIndex });
  } catch (err) {
    console.error('POST /api/user-answer error:', err);
    const message = err?.message || '';

    if (message.includes('parse') || message.includes('JSON')) {
      return NextResponse.json(
        { error: 'AI returned invalid feedback. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save your answer. Please try again.' },
      { status: 500 }
    );
  }
}
