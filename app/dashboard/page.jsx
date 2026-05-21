import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Addnewinterview from './_components/AddNewJsxFile'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className='p-10'>
    
     <h2 className='font-bold text-2xl'>
      Dashboard
     </h2>

     <h2 className='text-gray-500'>Create and Start your AI Interview</h2>


     <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
     <Addnewinterview />
     </div>
 
      {/*PREVIOUS INTERVIEW LIST */}

      <InterviewList />
    </div>
  )
}

export default Dashboard
