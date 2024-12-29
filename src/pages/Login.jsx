import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/login', {
        email,
        password,
      }, { withCredentials: true });
  
      if (response.data.success) {

        // Check if the token exists before setting the cookie
        if (response.data.token) {
          Cookies.set('GAME_TOKEN', response.data.token, { expires: 7 });
        }
  
        // Show success toast
        toast.success(response.data.message);
  
        // Redirect based on role
        const userRole = response.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin_dashboard');
        } else {
          navigate('/');
        }
      }

      // In your handleSubmit function after setting the cookie
console.log(Cookies.get('GAME_TOKEN')); // Log to check if it's saved

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };
  

  return (
    <div className='h-screen bg-gray-950 flex justify-center items-center'>
      <Toaster position="top-center" />

      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-gray-900 rounded-lg shadow-lg lg:max-w-4xl">
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          }}
        ></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-7 sm:h-8"
              src="/placeholder.svg?height=32&width=32"
              alt="Logo"
            />
          </div>

          <p className="mt-3 text-xl text-center text-gray-100">Welcome back!</p>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b border-gray-600 lg:w-1/4"></span>

            <a
              href="#"
              className="text-xs text-center text-gray-400 uppercase hover:underline"
            >
              login with email
            </a>

            <span className="w-1/5 border-b border-gray-600 lg:w-1/4"></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-200"
                htmlFor="LoggingEmailAddress"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  id="LoggingEmailAddress"
                  className="block w-full pl-10 pr-4 py-2 text-gray-300 bg-gray-700 border rounded-lg border-gray-600 focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium text-gray-200"
                  htmlFor="loggingPassword"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-gray-400 hover:underline"
                >
                  Forget Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  id="loggingPassword"
                  className="block w-full pl-10 pr-4 py-2 text-gray-300 bg-gray-700 border rounded-lg border-gray-600 focus:border-blue-400 focus:ring-opacity-40 ffocus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>

          
        </div>
      </div>
    </div>
  );
}
