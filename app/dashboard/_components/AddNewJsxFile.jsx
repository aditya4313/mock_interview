"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; 

function Addnewinterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExp, setJobExp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user?.primaryEmailAddress?.emailAddress) {
      setError('Please sign in with an email address before starting an interview.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPosition, jobDesc, jobExp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      if (data.mockId) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + data.mockId);
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Tell us more about your job Interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your job position/role, job description and years of experience</h2>

                  <div className='mt-7 my-2'>
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder='EX. Full Stack Developer'
                      required
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      placeholder='EX. React, Angular, NodeJS, MySql etc'
                      required
                      value={jobDesc}
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Years of experience</label>
                    <Input
                      placeholder='EX. 5'
                      max='50'
                      min='0'
                      type='number'
                      required
                      value={jobExp}
                      onChange={(event) => setJobExp(event.target.value)}
                    />
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type='button' variant='ghost' onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className='animate-spin' /> Generating from AI
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Addnewinterview;
