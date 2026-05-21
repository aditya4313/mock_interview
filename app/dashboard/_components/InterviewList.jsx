"use client"

import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {

    const {user} = useUser();
    const [InterviewList,setinterviewList] = useState([]);

    useEffect (()=> {
    
       user&&GetInterviewList();

    },[user])

    const GetInterviewList = async() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
                .orderBy(desc(MockInterview.id));

            console.log(result);
            setinterviewList(result);
        }
    }

  return (
    <div>
      <h2 className='font-medium text-lg'>Previous Mock Interview</h2>
    
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4'>
    
     {InterviewList&&InterviewList.map((interview,index)=>(
        <InterviewItemCard  key={index} Interview={interview} />
     ))}


    </div>
    
    </div>
  )
}

export default InterviewList
