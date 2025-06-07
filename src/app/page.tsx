'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import LoginForm from '@/components/LoginForm'
import Logout from '@/components/Logout'

const Page = () => {
  const { data: session, status } = useSession()

  if (status === 'loading'){
    return <p>Loading...</p>
  }

  return (
    <div>
      {!session ? (
        <>
          <h1>Sign in</h1>
          <LoginForm />
        </>
      ) : (
        <>
        <h1>{session?.user?.name}</h1>
          <Image
            src={session?.user?.image ?? "/default-avatar.png"}
            alt={session?.user?.name ?? "User Avatar"}
            width={72}
            height={72}
            className="rounded-full"/>
          <Logout/>
        </>
      )}
    </div>
  )
}

export default Page
