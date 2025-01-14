'use client' // Ensure this is at the top
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Directory from '../pathDirectory'
import Header from '../header'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Footer from './../footer'
import SEO from '../../seo/page'
const LocationPage = () => {
  const pathname = usePathname() // Use the usePathname hook to access the current path
  const [currentLocation, setCurrentLocation] = useState('LOCATION')
  const [specificLocation, setSpecificLocation] = useState('')
  const [posts, setPosts] = useState({}) // State to store fetched data

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCurrentLocation(params.get('currentLocation') || 'LOCATION')
    setSpecificLocation(params.get('specificLocation') || '')
    console.log(params)
  }, [])

  useEffect(() => {
    // Fetch data from the backend API
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`) // Adjust the API endpoint if necessary
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log('Fetched data:', data) // Log the raw data fetched from the API

        const fetchedPosts = {}
        // Process the data into a key-value object
        data.forEach(location => {
          const key = location.area_name // The transformed area_name from the backend
          fetchedPosts[key] = {
            location: location.area_name,
            key: key,
            path: location.image, // Image path from the API
            title: location.title,
            intro: location.description
          }
        })
        setPosts(fetchedPosts) // Set the transformed data to state
      })
      .catch(error => {
        console.error('Error fetching areas:', error)
      })
  }, [])
  const handleToggle = key => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [key]: !prevExpanded[key]
    }))
  }

  const [expanded, setExpanded] = useState({})

  const toggleReadMore = key => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <SEO
        title='REAL ESTATE'
        description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
        keywords='alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale, property location, location'
        canonical='${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/location'
      />
      <div className='mb-10'>
        <Header />
      </div>

      {/* <div className="xl:ml-64 mt-20">
        <Directory currentLocation="LOCATION" specificLocation={``} />
      </div> */}

      <div className='locations-container text-center mb-0 mt-20'>
        <div className='w-1/2 text-center flex flex-col items-center'>
          <h1 className='font-thin mt-5 text-center text-4xl text-customBlue border-t-2 border-customBlue pl-4 pb-10'>
            OUR LOCATION
          </h1>
        </div>

        <div className='container mx-auto'>
          <div className='flex flex-wrap -mx-2'>
            {Object.values(posts).map(
              ({ location, key, path, title, intro }) => (
                <div className='w-full md:w-1/3 px-2 mb-8' key={key}>
                  <div className='bg-white shadow-md  overflow-hidden flex flex-col h-full'>
                    <img
                      src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}${path}`} // Try to load from localhost:3000
                      onError={e => {
                        e.target.onerror = null // Prevent infinite loop if image fails
                        e.target.src = `${process.env.NEXT_PUBLIC_SERVER_PORT}${path}` // Fallback to localhost:8000 if not found
                      }}
                      className='w-full object-cover transform transition-transform duration-500 hover:scale-110 h-48 md:h-56 lg:h-64'
                    />
                    <div className='p-4 flex flex-col justify-between flex-grow'>
                      <div>
                        <h5 className='text-lg font-semibold'>{title}</h5>
                        <p className='text-base'>
                          {expanded[key]
                            ? intro
                            : `${intro.substring(0, 100)}...`}
                        </p>
                      </div>
                      <a
                        href={`/pages/locations/${key}`} // Standard anchor tag for navigation
                        className='mt-4 text-customBlue hover:text-customBlue'
                      >
                        {expanded[key] ? 'Read Less' : 'Read More'} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className='text-left xl:mt-10'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default LocationPage
