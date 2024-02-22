import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'

export default function OAuth() {
   const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}) // we send the user's name, email and photo to the backend
            })
            const data = await res.json() // we parse the response to JSON
            if (data.success === true) { // in our backend we send a success property in the response, if it's true we redirect the user to the home page
                useDispatch(signInSuccess(data)) // we dispatch the signInSuccess action to set the currentUser and loading state to false
            }
        } catch (error) {
            console.log('could not sign in with google', error)
        }
    }

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}
