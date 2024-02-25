import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user) // we use the useSelector hook to get the currentUser state from the 'user' slice
    return currentUser ? <Outlet/> : <Navigate to='sign-in' /> // if a user is not logged in, going to the profile page will redirect them to the sign-i 
}
