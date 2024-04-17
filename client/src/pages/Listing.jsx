import { set } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {
    SwiperCore.use([Navigation]) // we use the Navigation module from SwiperCore to enable navigation
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                // fetch the listing from the server
                // use the listingId from the url
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json() // convert the response to json

                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId]) // we add params.listingId as a dependency so the useEffect runs when the listingId changes

  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Error fetching listing</p>}
        {listing && !loading && !error && <div>
            <Swiper navigation>
                {listing.imageUrls.map(url => <SwiperSlide key={url}> 
                    <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div> 
                </SwiperSlide>)}
            </Swiper>

        </div>}

    </main>
  )
}
