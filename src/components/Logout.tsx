// components/Logout.tsx
import { doLogout } from '@/app/actions'

export default function Logout() {
  return (
    <form action={doLogout}>
      <button 
        type="submit" 
        className="bg-red-500 p-2 rounded-md text-white"
      >
        Logout
      </button>
    </form>
  )
}