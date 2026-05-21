"use client";

import React, { useEffect, useState } from 'react';
import Questionsection from './_components/Questionsection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Startinterview({ params }) {
  const [interviewdata, setInterviewdata] = useState();
  const [mockinterviewquestion, setmockinterviewquestion] = useState();
  const [activequestionindex, setactivequestionindex] = useState(0);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interview/${params.interviewId}`);
      const data = await res.json();

      if (!res.ok) {
        setLoadError(data.error || 'Failed to load interview');
        return;
      }

      setmockinterviewquestion(data.questions);
      setInterviewdata(data.interview);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load interview');
    }
  };

  if (loadError) {
    return <p className="p-10 text-red-500">{loadError}</p>;
  }

  if (!mockinterviewquestion?.length) {
    return <p className="p-10">Loading interview...</p>;
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <Questionsection
          mockinterviewquestion={mockinterviewquestion}
          activequestionindex={activequestionindex}
          setactivequestionindex={setactivequestionindex}
        />

        <RecordAnsSection
          mockinterviewquestion={mockinterviewquestion}
          activequestionindex={activequestionindex}
          interviewdata={interviewdata}
        />
      </div>
      <div className='flex justify-end gap-6'>
        {activequestionindex > 0 && (
          <Button onClick={() => setactivequestionindex(activequestionindex - 1)}>
            Previous Question
          </Button>
        )}
        {activequestionindex !== mockinterviewquestion?.length - 1 && (
          <Button onClick={() => setactivequestionindex(activequestionindex + 1)}>
            Next Question
          </Button>
        )}
        {activequestionindex === mockinterviewquestion?.length - 1 && (
          <Link href={'/dashboard/interview/' + interviewdata?.mockId + '/feedback'}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Startinterview;
