"use client"
import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa"

const LogOut = () => {
  return (
    <button
      onClick={() => signOut({ redirect: true, callbackUrl: `${window.location.origin}` })}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 font-medium text-sm transition-all duration-200"
    >
      <FaSignOutAlt className="text-base" />
      <span>Déconnexion</span>
    </button>
  )
}

export default LogOut
