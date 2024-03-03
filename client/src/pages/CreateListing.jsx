import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' required></input>
                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required></textarea>
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required></input>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='sell'></input>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='rent'></input>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='parking'></input>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='furnished'></input>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='offer'></input>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'></input>
                        <span>Beds</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='baths' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'></input>
                        <span>Baths</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' required className='p-3 border border-gray-300 rounded-lg'></input>
                        <div className='flex flex-col items-center'>
                            <span>Regular price</span>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' required className='p-3 border border-gray-300 rounded-lg'></input>
                        <div className='flex flex-col items-center'>
                            <span>Discounted price</span>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-700 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple required></input>
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
                <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
