'use server'
import { signIn } from "@/auth";
export async function doSocialLogin(formdata){

    const action=formdata.get('action');
    await signIn(action,{redirectTo:'/'});
    console.log(action)

}


export async function doLogout(formdata){
    
}