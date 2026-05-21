"use client"

import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const pathname = usePathname();

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Link href='/'>
        <Image src='/logo.svg' width={160} height={100} alt='logo' />
      </Link>
      
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${pathname === '/dashboard' ? 'text-primary font-bold' : ''}`}>
          <Link href='/dashboard'>Dashboard</Link>
        </li> <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${pathname === '/dashboard/how' ? 'text-primary font-bold' : ''}`}>
          <Link href='/dashboard/how'>How it works?</Link>
        
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${pathname === '/dashboard/upgrade' ? 'text-primary font-bold' : ''}`}>
          <Link href='/dashboard/upgrade'>Upgrade</Link>
        </li>

        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${pathname === '/dashboard/price' ? 'text-primary font-bold' : ''}`}>
          <Link href='/dashboard/price'>Price</Link>
        </li>

       

       <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${pathname === '/dashboard/questions' ? 'text-primary font-bold' : ''}`}>
          <Link href='/dashboard/questions'>About Me</Link>
        </li>
      </ul>

      <UserButton />
    </div>
  )
}

export default Header
