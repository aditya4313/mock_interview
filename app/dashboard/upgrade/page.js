import React from 'react';

function Page() {
  return (
    <div className='relative mt-10 flex flex-col items-center justify-center'>
      {/* Background Video */}
      <video className='mt-10' autoPlay loop>
        <source src='/meme 2.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      <h2 className="mt-4 font-bold text-primary" style={{ fontSize: '40px' }}>Beta Tujse..........</h2>
      
     
      </div>
    
  );
}

export default Page;
