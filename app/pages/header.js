'use client' // Add this line at the top
import { useRouter } from 'next/router' // Import useRouter for navigation
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image' // Assuming you're using Next.js's Image component
import Link from 'next/link'
import { throttle } from 'lodash'
import { useSession, signIn, signOut } from 'next-auth/react'
/** 
const services = [
    { title: "CommTalk", slug: "commtalk" },
    { title: "Contact Us", slug: "contactus" },
    { title: "Join Team Alveo", slug: "jointeamalveo" },
];
 * 
*/

const properties = [
  { title: 'Condominiums', slug: 'condominiums' },
  { title: 'Lots', slug: 'residential' },
  { title: 'Commercials', slug: 'commercial' },
  { title: 'Offices', slug: 'office' }
]
;<ul>
  {properties.map((item, index) => (
    <li key={index}>
      <Link href={`/pages/explore?specificLocation=${item.slug}`}>
        {item.title}
      </Link>
    </li>
  ))}
</ul>
/**
  const guide = [
        { title: "Terms and Conditions", slug: "terms" },
        { title: "Privacy Policy", slug: "privacy" }
    ];

 */

const Header = () => {
  const [isPopupVisible, setPopupVisible] = useState(false)
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible)
  }
  const [scrolled, setScrolled] = useState(false)
  const [isSidebarVisible, setSidebarVisible] = useState(false) // State for controlling sidebar visibility
  const sidebarRef = useRef(null) // Create a ref for the sidebar
  const [isExplorePage, setIsExplorePage] = useState(false)
  const [areas, setArea] = useState([])
  const [viewportSize, setViewportSize] = useState('')

  const handleViewportClick = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    setViewportSize(`Viewport size: ${width}px x ${height}px`)
  }
  useEffect(() => {
    // Check if the current URL path is '/pages/explore'
    if (typeof window !== 'undefined') {
      setIsExplorePage(window.location.pathname === '/pages/explore')

      // Throttled scroll function to reduce re-rendering
      const handleScroll = throttle(() => {
        setScrolled(window.scrollY > 50)
      }, 100) // Adjust delay as needed

      // Add scroll listener
      window.addEventListener('scroll', handleScroll)

      return () => {
        // Clean up scroll listener
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Click outside detection for sidebar
  useEffect(() => {
    if (isSidebarVisible) {
      const handleClickOutside = event => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          closeSidebar()
        }
      }

      // Add event listener only when sidebar is visible
      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        // Cleanup listener when sidebar is closed
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isSidebarVisible])

  // Function to open the sidebar
  const openSidebar = () => {
    setSidebarVisible(true)
  }

  // Function to close the sidebar
  const closeSidebar = () => {
    setSidebarVisible(false)
  }

  // Close the sidebar when clicking outside of it or clicking an item inside it

  // const uniqueLocations = Array.from(
  //   new Set(locations.map(loc => loc.location))
  // ).map(location => locations.find(loc => loc.location === location))
  // const style = {
  //   color: 'transparent',
  //   transform: 'rotate(-180deg)',
  //   cursor: 'pointer'
  //   // width: '100%', // Remove this line
  //   // height: 'auto', // Remove this line
  // }

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/area')
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.json()
        setArea(data)
      } catch (error) {
        console.error('Error fetching', error)
      }
    }

    fetchArea()
  }, [])

  return (
    <>
      <header className={`${scrolled ? 'scrolled' : ''}`}>
        <div className='bg-blue-500 flex items-center px-3 pt-3 h-12 w-screen relative'>
          {/* Menu Icon */}
          <div className='flex items-center'>
            <Image
              src='/assets/menu.png'
              alt='Menu'
              width={25}
              height={25}
              className='cursor-pointer transform rotate-180 hover:opacity-80 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6'
              onClick={openSidebar}
            />
          </div>

          {/* Branding */}
          <div className='absolute left-1/2 transform -translate-x-1/2'>
            <a
              href='/'
              className='branding-text'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h1 className='text-lg sm:text-lg lg:text-xl font-bold'>ALVEO</h1>
            </a>
          </div>

          {/* Explore Our Properties Section */}
          {!isExplorePage && (
            <div className='ml-auto flex items-end justify-end text-sm sm:text-base lg:text-lg xl:text-xl font-medium mt-1 w-1/2 pl-10'>
              <a
                href='/pages/explore'
                className='flex items-center'
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Image
                  src='/assets/search.png'
                  alt='Search'
                  width={25}
                  height={25}
                  className='w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 -mt-2'
                  style={{ transform: 'rotate(-270deg)', cursor: 'pointer' }}
                />
                <p className='ml-2 mr-5 font-bold w-full'>Explore Properties</p>
              </a>
            </div>
          )}

          {/* Call Section */}
          {isExplorePage && (
            <div className='ml-auto flex items-center'>
              <Image
                src='/assets/call.png'
                alt='Call'
                width={25}
                height={25}
                className='w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8'
              />
              <p className='ml-2 text-sm sm:text-base lg:text-lg xl:text-xl'>
                123-4567
              </p>
            </div>
          )}
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 
    sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12
    ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
        ref={sidebarRef}
        tabIndex='-1' // Makes the sidebar focusable
        onClick={closeSidebar}
        onKeyDown={e => e.key === 'Escape' && closeSidebar()} // Allows closing on Escape key
      >
        <div className='flex justify-between items-center p-4 border-b border-gray-700 '>
          <Link
            href='/pages/aboutalveo/aboutalveo'
            className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
          >
            ABOUT ALVEO
          </Link>
          <span
            className='text-xl font-bold cursor-pointer'
            onClick={closeSidebar}
          >
            &times;
          </span>
        </div>

        <nav className='p-4'>
          <Link
            href='/pages/location'
            className='block text-lg mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            LOCATIONS
          </Link>
          <ul className='space-y-2'>
            {areas.map(area => (
              <li key={area.key}>
                <a
                  className='block cursor-pointer hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm'
                  href={`/pages/locations/${area.area_name
                    .toLowerCase()
                    .replace(/\s+/g, '')}`}
                >
                  {area.area_name}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href='/pages/explore'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            PROPERTIES FOR SALE
          </Link>
          <ul className='space-y-2'>
            {properties.map((item, index) => (
              <li key={index}>
                <Link
                  href={`/pages/explore?specificLocation=${item.slug}`}
                  className='block hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm'
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href='/pages/set-appointment'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            SET APPOINTMENT
          </Link>
        </nav>

        {isPopupVisible && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white text-black p-6 rounded shadow-lg text-center'>
              <h3 className='text-lg font-bold mb-2'>LOGIN</h3>
              <p>This is the content of the popup.</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Header
