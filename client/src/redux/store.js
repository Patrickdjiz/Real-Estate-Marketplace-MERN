// Redux is a state management library for JavaScript applications.
// It helps manage the state of an application in a predictable and centralized way.

// The core concept in Redux is the store, which holds the state of the application.
// The store is created using the createStore function from the Redux library.

import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice' 

export const store = configureStore({ // we create the store using the configureStore function

    // Reducers are pure functions that specify how the state should change in response to actions.
    // They take the current state and an action as input, and return a new state.
    // Reducers are combined using the combineReducers function to create the root reducer.

    reducer: {user: userReducer}, // we pass the userReducer to the store,
    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ // we add the middleware to the store
        serializableCheck: false // we disable the serializableCheck middleware to avoid an error when we send the state to the backend
    })
})