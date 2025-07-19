'use server'

import { signIn,signOut } from "@/auth";


export async function doSocialLogin(formdata: FormData) {
  const action: string | null = formdata.get('action') as string | null;
  await signIn(action ?? '', { redirectTo: 'https://oss-main-website.vercel.app/api/auth/callback/github' });
  console.log(action);
}



export async function doLogout(){
    await signOut({redirectTo:"/"})
}