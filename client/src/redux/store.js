// Redux is a state management library for JavaScript applications.
// It helps manage the state of an application in a predictable and centralized way.

// The core concept in Redux is the store, which holds the state of the application.
// The store is created using the createStore function from the Redux library.

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice' 
import { persistReducer } from 'redux-persist' 
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({ user: userReducer }) // we want the userReducer to be part of the rootReducer so it can be combined

const persistConfig = { 
    key: 'root', // the key is the key in the local storage where the user state will be stored
    storage,
    version: 1,
}

// we create the persistedReducer to that when the web page is refreshed the state is not lost and the user is still logged in
const persistedReducer = persistReducer(persistConfig, rootReducer) 

export const store = configureStore({ // we create the store using the configureStore function

    // Reducers are pure functions that specify how the state should change in response to actions.
    // They take the current state and an action as input, and return a new state.
    // Reducers are combined using the combineReducers function to create the root reducer.

    reducer: {user: persistedReducer}, // we pass the persistedReducer to the store which contains the userReducer and persistConfig
    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ // we add the middleware to the store
        serializableCheck: false // we disable the serializableCheck middleware to avoid an error when we send the state to the backend
    })
})

export const persistor = persistStore(store) // we create the persistor using the persistStore function which will be used to persist the state