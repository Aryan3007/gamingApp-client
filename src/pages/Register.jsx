import { useState } from 'react'
import { Mail, Lock, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registration attempt', { name, email, password })
  }

  return (
    <div className='h-screen bg-gray-950 flex justify-center items-center'>
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-gray-900 rounded-lg shadow-lg lg:max-w-4xl">
        <div className="hidden bg-cover lg:block lg:w-1/2" style={{backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"}}></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src="/placeholder.svg?height=32&width=32" alt="Logo" />
          </div>

          <p className="mt-3 text-xl text-center text-gray-100">
            Create your account
          </p>

          {/* <a href="#" className="flex items-center justify-center mt-4 text-gray-100 transition-colors duration-300 transform border rounded-lg border-gray-700 hover:bg-gray-700">
            <div className="px-4 py-2">
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
              </svg>
            </div>

            <span className="w-5/6 px-4 py-3 font-bold text-center">Sign up with Google</span>
          </a> */}

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b border-gray-600 lg:w-1/4"></span>

            <a href="#" className="text-xs text-center text-gray-400 uppercase hover:underline"> sign up with email</a>

            <span className="w-1/5 border-b border-gray-600 lg:w-1/4"></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-200" htmlFor="RegisterName">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  id="RegisterName"
                  className="block w-full pl-10 pr-4 py-2 text-gray-300 bg-gray-700 border rounded-lg border-gray-600 focus:border-blue-400 focus:ring-opacity-40 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-200" htmlFor="RegisterEmailAddress">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  id="RegisterEmailAddress"
                  className="block w-full pl-10 pr-4 py-2 text-gray-300 bg-gray-700 border rounded-lg border-gray-600 focus:border-blue-400 focus:ring-opacity-40 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-200" htmlFor="RegisterPassword">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  id="RegisterPassword"
                  className="block w-full pl-10 pr-4 py-2 text-gray-300 bg-gray-700 border rounded-lg border-gray-600 focus:border-blue-400 focus:ring-opacity-40 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50">
                Sign Up
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b border-gray-600 md:w-1/4"></span>

            <Link to={"/login"} className="text-xs text-gray-400 uppercase hover:underline">or login</Link>

            <span className="w-1/5 border-b border-gray-600 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

