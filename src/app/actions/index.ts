'use server'

import { signIn,signOut } from "@/auth";


export async function doSocialLogin(formdata) {
    const action: string | null = formdata.get('action');
    await signIn(action as string, { redirectTo: '/' });  //signin automatically detects api/auth/[...nextauth]
    console.log(action);
}


export async function doLogout(){
    await signOut({redirectTo:"/"})
}