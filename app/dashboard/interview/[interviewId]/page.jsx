"use client";

import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewdata, setInterviewdata] = useState();
  const [webcamenable, setWebcamenable] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewdata(result[0]);
  };

  return (

    // <h2> he is a boy</h2>
    <div className='my-10 flex flex-col items-center'>
      <h2 className='font-bold text-2xl'>
        Let's Get Started
      </h2>
      <div className='flex flex-col md:flex-row md:justify-between w-full max-w-4xl mt-10 gap-10'>
        <div className='md:w-1/2'>
          {!webcamenable && (
            <div className='mt-5 p-4 bg-gray-100 border rounded-lg text-left'>
              <h3 className='font-semibold text-lg mb-2'>Tips for Giving the Test:</h3>
              <ul className='list-disc list-inside'>
                <li>Ensure your internet connection is stable.</li>
                <li>Find a quiet place to avoid any disturbances.</li>
                <li>Have a glass of water nearby to stay hydrated.</li>
                <li>Take a deep breath and stay calm during the test.</li>
                <li>Read each question carefully before answering.</li>
                <li>Keep track of the time to ensure you complete the test.</li>
              </ul>
            
              
              
            </div>

            
            
          )}
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 mt-5'>
    <h2 className='flex gap-2 items-center text-yellow-500'>
                <Lightbulb /> 
                  <strong>Information</strong></h2>
                  <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
              </div>
        </div>
        <div className='md:w-1/2 flex flex-col items-center'>
          {webcamenable ? (
            <Webcam
              onUserMedia={() => setWebcamenable(true)}
              onUserMediaError={() => setWebcamenable(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300
              }}
            />
          ) : (
            <>
              <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
              <Button className= 'flex justify-end items-end  hover:scale-105 transition-all shadow-md' onClick={() => setWebcamenable(true)}>Enable Web Cam and Microphone</Button>
            </>
          )}
        </div>
      </div>
<diV className= 'flex justify-end items-end mt-6 hover:scale-105 transition-all shadow-md'>
    <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
      <Button >Start Interview </Button>
      </Link>
      </diV>
    </div>
  );
}

export default Interview;
