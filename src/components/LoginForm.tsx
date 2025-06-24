import React from 'react'
import { doSocialLogin } from '@/app/actions'
import { Button } from './ui/button'


const LoginForm = () => {
  return (
    <form action={doSocialLogin}>
        <Button type="submit" name="action" value="github"
            className='transform rounded-lg bg-black px-8 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200'
        >
            Login with Github
        </Button>

    </form>
  )
}

export default LoginForm