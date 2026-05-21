"use client"

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Questionsection from './_components/Questionsection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Startinterview({params}) {

    const[interviewdata,setInterviewdata] = useState();
    const [mockinterviewquestion, setmockinterviewquestion] = useState();
    const[activequestionindex,setactivequestionindex]= useState(0);

    useEffect(()=> {
    GetInterviewDetails();
    },[]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));

          console.log(params.interviewId);

          const jsonMockResp = JSON.parse(result[0].jsonMockResp);
          console.log(jsonMockResp);
          setmockinterviewquestion(jsonMockResp);
          setInterviewdata(result[0]);
    }
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        <Questionsection mockinterviewquestion ={mockinterviewquestion} 
        activequestionindex={activequestionindex}
        />


     <RecordAnsSection 
     mockinterviewquestion ={mockinterviewquestion} 
     activequestionindex={activequestionindex}
     interviewdata={interviewdata}
     />
      </div >
      <div className='flex justify-end gap-6'>
      {activequestionindex>0&&
       <Button onClick={()=>setactivequestionindex(activequestionindex - 1)}>Previous Question</Button>}
      {activequestionindex!=mockinterviewquestion?.length-1&&
       <Button onClick={()=>setactivequestionindex(activequestionindex+1)}>Next Question</Button>}
     {activequestionindex==mockinterviewquestion?.length-1&& 
    <Link href={'/dashboard/interview/' + interviewdata?.mockId+"/feedback"}>
    <Button>End Interview</Button>
      </Link>}
      </div>
    </div>
    
  )
}

export default Startinterview
