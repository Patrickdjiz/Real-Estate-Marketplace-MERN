// This file contains the userSlice which is a slice of the Redux store that contains the user state and actions to update the user state globally. 
// We use the createSlice function from the @reduxjs/toolkit package to create the userSlice. 

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => { // we create a signInStart action to set the loading state to true
            state.loading = true
        },
        signInSuccess: (state, action) => { // we create a signInSuccess action to set the currentUser and loading state to false
            state.currentUser = action.payload // payload is the data we send with the action
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => { // we create a signInFailure action to set the error and loading state to false
            state.error = action.payload
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        }, 
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    }
})

export const { signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserStart, deleteUserFailure, deleteUserSuccess } = userSlice.actions

export default userSlice.reducer