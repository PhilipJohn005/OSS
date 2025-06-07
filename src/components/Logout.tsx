'use client'

import { signOut } from 'next-auth/react'

export default function Logout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-500 p-2 rounded-md text-white"
    >
      Logout
    </button>
  )
}
