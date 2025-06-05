import React from 'react'
import { doSocialLogin } from '@/app/actions'

const LoginForm = () => {
  return (
    <form action={doSocialLogin}>
      
        <button>
            Login With Google
        </button>

        <button type="submit" name="action" value="github"
            className='bg-gray-800 p-4 rounded-md text-white hover:cursor-pointer'
        >
            Login with Github
        </button>

    </form>
  )
}

export default LoginForm
