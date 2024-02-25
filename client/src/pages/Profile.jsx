import React from 'react'
import { useSelector, useState, useEffect } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { set } from 'mongoose'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})


  // firebase storage
  /*  allow read;
      allow write: if request.resource < 2 * 1024 * 1024 && 
      request.resource.contentType.matches('image/.*') */

  useEffect(() => {
    if(file) {
      handleFileUpload(file)
    }
  }, [file]) // we add file as a dependency to the useEffect hook so that the hook runs when the file state changes

  const handleFileUpload = async (file) => {
    const storage = getStorage(app) // we get the storage from the app
    const fileName = new Date().getTime() + '-' + file.name // we create a unique file name
    const storageRef = ref(storage, fileName) // we create a reference to the storage
    const uploadTask = uploadBytesResumable(storageRef, file) // we upload the file to the storage from the reference to the storage

    uploadTask.on('state_changed', // we listen to the state of the upload task
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // we calculate the progress of the upload
        setFilePerc(Math.round(progress)) // we set the filePerc state to the progress
        
      });
      (error) => {  
        setFileUploadError(true) // we set the fileUploadError state to true
      }
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // we get the download url of the file
          setFormData({...formData, profilePicture: downloadURL}) // we set the profilePicture property of the formData object to the download url
      });
  }}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={currentUser.profilePicture} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disbled:opacity-80'>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

