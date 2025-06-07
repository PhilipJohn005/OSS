import React from 'react'
import { doSocialLogin } from '@/app/actions'


const LoginForm = () => {
  return (
    <form action={doSocialLogin}>
        <button type="submit" name="action" value="github"
            className='w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200'
        >
            Login with Github
        </button>

    </form>
  )
}

export default LoginForm
