'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import LoginForm from '@/components/LoginForm'
import Logout from '@/components/Logout'
import { HeroSectionOne } from '@/components/HeroSectionOne'

const Page = () => {
  const { data: session, status } = useSession()

  if (status === 'loading'){
    return <p>Loading...</p>
  }

  return (
    <div className='mx-4'>
      <HeroSectionOne/>

    </div>
  )
}

export default Page
