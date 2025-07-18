'use client'

import { signOut } from 'next-auth/react'

export default function Logout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: 'https://oss-main-website.vercel.app/' })}
      className="bg-red-500 p-2 rounded-md text-white"
    >
      Logout
    </button>
  )
}
