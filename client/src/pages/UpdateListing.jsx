import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'    


export default function CreateListing() {
    const {currentUser} = useSelector((state) => state.user)
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({ // we create a formData object to store the form data that the user will upload as an image
        imageUrls: [], // we create an imageUrls array to store the download urls of the images
        name: '',
        description: '',
        address: '',
        type: '',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })  
    const [imageUploadError, setImageUploadError] = useState(false) // we create an imageUploadError state to handle errors that occur during the image upload
    const [uploading, setUploading] = useState(false) 
    const [error, setError] = useState(false) 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate() 
    const params = useParams()

    useEffect(() => { 
      const fetchListing = async () => {
        const listingId = params.listingId // we get the listingId from the params in the url
        const res = await fetch(`/api/listing/get/${listingId}`) // we fetch the listing with the listingId
        const data = await res.json() // we are returning the listing from our listing.controller as a response
        if (data.success === false) {
            console.log(data.message)
            return
        }
        console.log(data.name)
        setFormData(data)
      }

      fetchListing() // we call the fetchListing function
    }, [])

    const handleImageSubmit =  (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [] // promises are used to handle asynchronous operations since the file upload is asynchronous and takes time
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i])) // we push the promise returned by the storeImage function to the promises array
            }
            Promise.all(promises).then((urls) => { // we use the Promise.all method to wait for all the promises to resolve. .then returns the resolve or reject value of the promise
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)}) // we set the imageUrls property of the formData object to the urls array
                setImageUploadError(false) 
                setUploading(false)
            }).catch((error) => {
                setImageUploadError('Image upload failed')
            })
        } else {
            setImageUploadError('You can only upload 6 images')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => { // we create a new promise which takes two parameters, resolve and reject. These are functions that are passed to the promise by JavaScript
            const storage = getStorage(app) // we get the storage from the app
            const fileName = new Date().getTime() + file.name // we create a unique file name
            const storageRef = ref(storage, fileName) // we create a reference to the storage  
            const uploadTask = uploadBytesResumable(storageRef, file) // we upload the file to the storage from the reference to the storage 
            uploadTask.on(
                'state_changed', // we listen to the state of the upload task
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // we calculate the progress of the upload
                    console.log('Upload is ' + progress + '% done') // we log the progress of the upload
                },
                (error)=> {
                    reject(error) // if there is an error we reject the promise
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // we get the download url of the file
                        resolve(downloadURL) // if the upload is successful we resolve the promise with the download url
                    })
                }
            )

        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index) // we filter the imageUrls array to remove the image at the index
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({...formData, type: e.target.id}) // we set the type property of the formData object to the id of the input
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({...formData, [e.target.id]: e.target.checked}) // we set the value of the input to the corresponding key in the formData object
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({...formData, [e.target.id]: e.target.value}) // we set the value of the input to the corresponding key in the formData object
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(formData.imageUrls.length < 1) return setError('You need to upload at least one image')
            if(+formData.regularPrice < +formData.discountedPrice) return setError('Discounted price cannot be higher than regular price') // the + converts the string to a number
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)
            if (data.success === false) {
                setError(data.message)
            } 
            navigate(`listing/${data._id}`)

        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' required onChange={handleChange} value={formData.name} ></input>
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} ></textarea>
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address} ></input>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='sell' onChange={handleChange} checked={formData.type == "sell"}></input>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='rent' onChange={handleChange} checked={formData.type == "rent"}></input>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='parking' onChange={handleChange} checked={formData.parking}></input>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='furnished' onChange={handleChange} checked={formData.furnished}></input>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='offer' onChange={handleChange} checked={formData.offer}></input>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms}></input>
                        <span>Beds</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='baths' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms}></input>
                        <span>Baths</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}></input>
                        <div className='flex flex-col items-center'>
                            <span>Regular price</span>
                            {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                        </div>
                    </div>
                    {formData.offer &&
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountedPrice' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountedPrice}></input>
                            <div className='flex flex-col items-center'>
                                <span>Discounted price</span>
                                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-700 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple></input>
                    <button type='button' onClick={handleImageSubmit} disabled={uploading}
                    className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className='flex justify-between p-3 border items-center'>
                            <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'></img>
                            <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80' disabled={loading || uploading}>
                    {loading ? 'Updating...' : 'Update Listing'}
                </button>
                {error && <p className='text-red-700'>{error}</p>}
            </div>
        </form>
    </main>
  )
}
