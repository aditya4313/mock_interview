import '@/utils/neon-server';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';

export async function GET(_req, { params }) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interviewId } = params;
    if (!interviewId) {
      return NextResponse.json({ error: 'Interview id is required' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const interview = result[0];
    if (interview.createdBy !== userEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      interview,
      questions: JSON.parse(interview.jsonMockResp),
    });
  } catch (err) {
    console.error('GET /api/interview/[interviewId] error:', err);
    return NextResponse.json(
      { error: 'Failed to load interview.' },
      { status: 500 }
    );
  }
}
