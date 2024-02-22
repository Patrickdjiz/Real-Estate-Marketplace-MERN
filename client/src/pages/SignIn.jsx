import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'

function SignIn() {
  const [formData, setFormData] = useState({email: '', password: ''})
  const { loading, error } = useSelector((state) => state.user) // we use the useSelector hook to get the loading and error state from the 'user' slice
  const navigate = useNavigate() // we use the navigate hook to redirect the user after the sign up
  const dispatch = useDispatch() // we use the useDispatch hook to dispatch the actions

  const handleChange = (e) => {
    setFormData({
      ...formData, // we spread the formData object to keep the previous values
      [e.target.id]: e.target.value // we get the id of the input and set the value to the corresponding key in the formData object
    })
  }

  const handleSubmit = async (e) => { 
    e.preventDefault() // we prevent the default behavior of the form to avoid the page to refresh
    dispatch(signInStart()) // we dispatch the signInStart action to set the loading state to true
    const res = await fetch('/api/auth/signin', // we create the proxy to /api in vite.config.js so we don't need to specify the full url
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // we specify that we are sending a JSON string
        },
        body: JSON.stringify(formData) // we send the formData object as a JSON string
      })
      const data = await res.json() // we parse the response to JSON 
      if (data.success === false) { // in our backend we send a success property in the response, if it's false we set the error message
        dispatch(signInFailure(data.message)) // we dispatch the signInFailure action to set the error message
        return
      }
      dispatch(signInSuccess(data)) // we dispatch the signInSuccess action to set the currentUser and loading state to false
      navigate('/') // we redirect the user to the sign in page
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign up'} 
        </button>
      </form>
      <div className='flex gap-1 mt-5'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>} 
    </div>
  )
}

export default SignIn

