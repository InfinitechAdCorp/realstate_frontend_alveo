'use client' // Add this line at the top
import { useRouter } from 'next/router' // Import useRouter for navigation
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image' // Assuming you're using Next.js's Image component
import Link from 'next/link'
import { throttle } from 'lodash'
import { useSession, signIn, signOut } from 'next-auth/react'

import SEO from './../seo/page'
const Footer = () => {
  useEffect(() => {
    // Reload the page if it hasn't already been reloaded
    const hasReloaded = sessionStorage.getItem('footerPageReloaded')
    if (!hasReloaded) {
      sessionStorage.setItem('footerPageReloaded', 'true') // Set a flag to prevent infinite reloads
      window.location.reload()
    }
  }, [])
  const handleDownloadClick = () => {
    const apkUrl = '/apk/app-apk-677ca71aecae2-1736222490.apk'
    const link = document.createElement('a')
    link.href = apkUrl
    link.download = 'Alveo.apk' // Specify the desired file name
    document.body.appendChild(link) // Append to DOM
    link.click() // Trigger download
    document.body.removeChild(link) // Remove from DOM
  }

  return (
    <>
      <SEO
        title='REAL ESTATE'
        description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
        keywords='alveo, real estate, luxury living, property, contacts, services, account'
        canonical='https://realstate-frontend-alveo.vercel.app'
      />
      <div
        className='text-center xl:-mt-14 2xl:mt-1 xl:z-50 text-white h-100 gap-12 lg:text-2xl xl:text-left xl:flex xl:flex-row xl:items-start'
        style={{ background: '#002B47' }}
      >
        <div className='xl:w-1/3 max-sm:-mt-3 sm:mt-5 flex flex-col items-center justify-center'>
          <div className='flex flex-col text-left xl:text-left max-sm:mt-5 sm:pt-10 '>
            <h1>Λ L V E O</h1>
            <p className='text-sm'>an AyalaLand company</p>
          </div>
          <div className='mb-3 text-sm '>
            <button
              onClick={handleDownloadClick}
              className='bg-blue-500 text-white py-2 px-4 rounded'
            >
              Download APK
            </button>
          </div>
        </div>
        {/* For large and medium screens */}
        <div className='hidden md:flex flex-col xl:flex-row gap-12 p-3'>
          {/* Contact Us Section */}
          <div className='w-full xl:w-1/3 px-4 xl:px-8 text-left'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
              Contact Us
            </h1>
            <p className='text-sm sm:text-base mb-6'>
              Our dedicated teams are ready to assist you with needed
              information on Alveo Land properties, wherever you are.
            </p>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              Customer Hotline:
            </h1>
            <p className='text-sm sm:text-base mb-6'>(+632) 8848 5000</p>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              Email:
            </h1>
            <p className='text-sm sm:text-base'>info@alveoland.com.ph</p>
          </div>

          {/* Location Section */}
          <div className='w-full xl:w-1/3 px-4 xl:px-8 text-left'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
              Location:
            </h1>
            <p className='text-sm sm:text-base'>
              Alveo Corporate Center 728 28th Street, Bonifacio Global City 1634
              Taguig City, Metro Manila, Philippines
            </p>
          </div>
        </div>

        {/* For small screens */}
        <div className='flex flex-col gap-12 p-3 md:hidden'>
          {/* Contact Us Section */}
          <div className='w-full px-4 text-left'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
              Contact Us
            </h1>
            <p className='text-sm sm:text-base mb-6'>
              Our dedicated teams are ready to assist you with needed
              information on Alveo Land properties, wherever you are.
            </p>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              Customer Hotline:
            </h1>
            <p className='text-sm sm:text-base mb-6'>(+632) 8848 5000</p>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              Email:
            </h1>
            <p className='text-sm sm:text-base'>info@alveoland.com.ph</p>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              Location:
            </h1>
            <p className='text-sm sm:text-base'>
              Alveo Corporate Center 728 28th Street, Bonifacio Global City 1634
              Taguig City, Metro Manila, Philippines
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
