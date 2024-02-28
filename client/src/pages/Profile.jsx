import { useState, useEffect, useRef } from 'react'; // Combined import
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  

  // firebase storage
  /*  allow read;
      allow write: if request.resource < 2 * 1024 * 1024 && 
      request.resource.contentType.matches('image/.*') */

  useEffect(() => {
    if(file) {
      handleFileUpload(file)
    }
  }, [file]) // we add file as a dependency to the useEffect hook so that the hook runs when the file state changes

  const handleFileUpload = (file) => {
    const storage = getStorage(app) // we get the storage from the app
    const fileName = new Date().getTime() + file.name // we create a unique file name
    const storageRef = ref(storage, fileName) // we create a reference to the storage
    const uploadTask = uploadBytesResumable(storageRef, file) // we upload the file to the storage from the reference to the storage

    uploadTask.on('state_changed', // we listen to the state of the upload task
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // we calculate the progress of the upload
        setFilePerc(Math.round(progress)) // we set the filePerc state to the progress
      },
      (error) => {  
        setFileUploadError(true) // we set the fileUploadError state to true
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // we get the download url of the file
          setFormData({...formData, profilePicture: downloadURL}) // we set the profilePicture property of the formData object to the download url
        });
      }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) // we spread the formData object to keep the previous values and set the value to the corresponding key in the formData object
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/auth/update/${currentUser._id}`, { // we create the proxy to /api in vite.config.js so we don't need to specify the full url
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // we send the formData object as a JSON string
      })
      const data = await res.json() // we parse the response to JSON

      if (data.success === false) { // in our backend we send a success property in the response, if it's false we set the error message
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
    } catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={formData.profilePicture || currentUser.profilePicture} 
        alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image Upload</span> ) :
            filePerc > 0 && filePerc < 100 ? (
           <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span> ) :
              filePerc === 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span> ) : (
                ""
              )}
        </p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

