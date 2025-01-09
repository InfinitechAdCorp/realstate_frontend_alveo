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
        <div className='xl:w-1/3 max-sm:-mt-3 sm:mt-5 flex flex-col items-start justify-start'>
  <div className='flex flex-col text-left xl:text-left max-sm:mt-5 sm:pt-10 ms-40'>
    <h1>Λ L V E O</h1>
    <p>an AyalaLand company</p>

  </div>
  <div className='mt-4 text-sm ms-40'>
    <button
      onClick={handleDownloadClick}
      className='bg-blue-500 text-white py-2 px-4 rounded'
    >
      Download APK
    </button>
  </div>
</div>


        <div className='xl:w-1/3 xl:pl-8 xl:text-left xl:-ml-20'>
          <h1 className='xl:text-3xl xl:mt-10 text-3xl sm:text-3xl lg:text-5xl'>
            Contact Us
          </h1>
          <p className='xl:text-lg text-sm sm:text-xl lg:text-2xl'>
            Our dedicated teams are ready to assist you with needed information
            on Alveo Land properties, wherever you are.
          </p>

          <h1 className='xl:text-3xl text-2xl sm:text-3xl lg:text-5xl'>
            Customer Hotline:
          </h1>
          <p className='xl:text-lg text-sm sm:text-xl lg:text-2xl'>
            (+632) 8848 5000
          </p>
          <h1 className='xl:text-3xl text-2xl sm:text-3xl lg:text-5xl'>
            Email:
          </h1>
          <p className='xl:text-lg text-sm sm:text-xl lg:text-2xl'>
            info@alveoland.com.ph
          </p>
        </div>

        <div className='xl:w-1/3 xl:pl-8 xl:text-left xl:-ml-20'>
          <h1 className='xl:text-3xl xl:mt-10 text-2xl sm:text-3xl lg:text-5xl'>
            Location:
          </h1>
          <h5 className='xl:text-lg text-sm sm:text-xl lg:text-2xl'>
            Alveo Corporate Center 728 28th Street, Bonifacio Global City 1634
            Taguig City, Metro Manila Philippines
          </h5>

          {/* Container for Images and Labels */}
          {/* <div className="flex sm:justify-center xl:justify-start mt-4">
    <div className="flex flex-col items-start w-full sm:w-20">
      {[
        { src: "/assets/socialmedia/facebook.png", label: "Facebook" },
        { src: "/assets/socialmedia/messenger.png", label: "Messenger" },
        { src: "/assets/socialmedia/telegram.png", label: "Telegram" },
        { src: "/assets/socialmedia/viber.png", label: "Viber" },
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-2 mt-2">
          <img
            src={item.src}
            className="w-6 h-6 lg:w-8 lg:h-8"
            alt={item.label}
          />
          <h3 className="text-lg sm:text-xl lg:text-2xl">{item.label}</h3>
        </div>
      ))}
    </div>
  </div> */}
        </div>
      </div>
    </>
  )
}

export default Footer
