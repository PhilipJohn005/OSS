import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Logout from '@/components/Logout';

const HomePage = async () => {

    const session=await auth();
console.log(" Session on HomePage:", session);
    if(!session?.user)redirect("/");
  return (
    <div>
      <h1>{session.user.name}</h1>
      <Image
        src={session.user.image ?? "/default-avatar.png"}
        alt={session.user.name ?? "User Avatar"}
        width={72}
        height={72}
        className="rounded-full"/>

        <Logout/>
    </div>
  )
}

export default HomePage
