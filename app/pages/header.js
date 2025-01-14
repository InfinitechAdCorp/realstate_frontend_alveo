'use client' // Add this line at the top
import { useRouter } from 'next/router' // Import useRouter for navigation
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image' // Assuming you're using Next.js's Image component
import { FaSearch, FaBuilding, FaHouseUser } from 'react-icons/fa'
import { throttle } from 'lodash'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { CiMenuFries } from 'react-icons/ci'
const properties = [
  { title: 'Condominiums', slug: 'condominiums' },
  { title: 'Lots', slug: 'residential' },
  { title: 'Commercials', slug: 'commercial' },
  { title: 'Offices', slug: 'office' }
]
;<ul>
  {properties.map((item, index) => (
    <li key={index}>
      <a href={`/pages/explore?specificLocation=${item.slug}`}>{item.title}</a>
    </li>
  ))}
</ul>

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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Scroll threshold, adjust as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
      <header
        className={`${
          scrolled ? 'bg-gray-900 shadow-lg' : ''
        } fixed top-0 left-0 w-full z-50 transition-all`}
      >
        <div
          style={{ backgroundColor: '#002B47' }}
          className='flex items-center h-16 w-full'
        >
          <div className='container mx-auto flex items-center px-4 sm:px-6 lg:px-8 justify-between'>
            {/* Menu Icon */}
            <div className='flex items-center block md:hidden me-3'>
              <button
                className='text-white text-2xl hover:scale-110 transition-transform'
                onClick={openSidebar}
              >
                <CiMenuFries />
              </button>
            </div>

            {/* Branding Section */}
            <a
              href='/'
              className='branding-text text-white text-4xl font-thin me-10'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Λ L V E O
            </a>


            {/* Navbar Links */}
            <div className='hidden md:flex justify-center items-center space-x-6'>
              {/* About Link */}
              <Link
                href='/pages/aboutalveo/aboutalveo'
                className='text-white font-thin hover:text-blue-300 lg:text-lg xl:text-xl no-underline me-2'
              >
                About
              </Link>

              {/* Properties Dropdown */}
              <div className='relative group'>
                {/* Dropdown Trigger */}
                <Link
                  href='#'
                  className='text-white font-thin hover:text-blue-300 lg:text-lg xl:text-xl no-underline me-4'
                >
                  Properties
                </Link>

                {/* Dropdown Menu */}
                <div className='absolute hidden mt-2 bg-white shadow-lg rounded-md group-hover:block left-1/2 -translate-x-1/2'>
                  <ul className='py-2 w-48'>
                    <li>
                      <Link
                        href='/pages/condominiums'
                        className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white no-underline'
                      >
                        Condominiums
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/pages/residentials'
                        className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white no-underline'
                      >
                        Residentials
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/pages/commercials'
                        className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white no-underline'
                      >
                        Commercials
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/pages/offices'
                        className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white no-underline'
                      >
                        Offices
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Us Link */}
              <Link
                href='/pages/contact'
                className='text-white font-thin hover:text-blue-300 lg:text-lg xl:text-xl no-underline me-2'
              >
                Contact Us
              </Link>
            </div>

            {/* Explore Properties Section */}
            {!isExplorePage && (
              <div className='ml-auto flex items-center text-sm sm:text-base lg:text-lg xl:text-xl font-medium'>
                <a
                  href='/pages/explore'
                  className='flex items-center text-white hover:opacity-80'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <FaSearch className='w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform rotate-90 cursor-pointer' />
                  <p className='ml-2 font-thin text-center'>
                    Explore Properties
                  </p>
                </a>
              </div>
            )}

            {/* Call Section */}
            {isExplorePage && (
              <div className='ml-auto flex items-center text-white'>
                <Image
                  src='/assets/call.png'
                  alt='Call'
                  width={18}
                  height={18}
                  className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 -mt-1'
                />
                <p className='ml-2 text-sm sm:text-base lg:text-lg xl:text-xl'>
                  CALL (632) 88485000
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 
    sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12
    ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
        ref={sidebarRef}
        tabIndex='-1' // Makes the sidebar focusable
        onClick={closeSidebar}
        onKeyDown={e => e.key === 'Escape' && closeSidebar()}
      >
        <div className='flex justify-between items-center p-4 border-b border-gray-700 '>
          <a
            href='/pages/aboutalveo/aboutalveo'
            className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
          >
            ABOUT ALVEO
          </a>
          <span
            className='text-xl font-bold cursor-pointer'
            onClick={closeSidebar}
          >
            &times;
          </span>
        </div>

        <nav className='p-4'>
          <a
            href='/pages/location'
            className='block text-lg mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            LOCATIONS
          </a>
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
          <a
            href='/pages/explore'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            PROPERTIES FOR SALE
          </a>
          <ul className='space-y-2'>
            {properties.map((item, index) => (
              <li key={index}>
                <a
                  href={`/pages/explore?specificLocation=${item.slug}`}
                  className='block hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm'
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <a
            href='/pages/set-appointment'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            SET APPOINTMENT
          </a>
          <a
            href='/pages/submit-property'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            SUBMIT PROPERTY
          </a>
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
