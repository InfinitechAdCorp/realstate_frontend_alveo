'use client'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { FaSearch, FaBuilding, FaHouseUser } from 'react-icons/fa'
import { throttle } from 'lodash'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { CiMenuFries } from 'react-icons/ci'
import { IoCall } from 'react-icons/io5'
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

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible)
  }
  const [scrolled, setScrolled] = useState(false)
  const [isSidebarVisible, setSidebarVisible] = useState(false)
  const sidebarRef = useRef(null)
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
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsExplorePage(window.location.pathname === '/pages/explore')

      const handleScroll = throttle(() => {
        setScrolled(window.scrollY > 50)
      }, 100)

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (isSidebarVisible) {
      const handleClickOutside = event => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          closeSidebar()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isSidebarVisible])

  const openSidebar = () => {
    setSidebarVisible(true)
  }

  const closeSidebar = () => {
    setSidebarVisible(false)
  }
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area_user`
        );
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
          scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
        } fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out`}
      >
        <div
          style={{ backgroundColor: '#002B47' }}
          className='flex items-center h-16 w-full'
        >
          <div className='container mx-auto flex items-center px-4 sm:px-6 lg:px-8 justify-between'>
            {/* Menu Icon for Mobile */}
            <div className='block md:hidden me-3 mt-2'>
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
              className='branding-text text-white text-4xl font-light me-10 tracking-wider'
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Λ L V E O
            </a>

            {/* Navbar Links */}
            <div className='hidden md:flex justify-center items-center space-x-6'>
              {/* About Link */}
              <Link
                href='/pages/aboutalveo/aboutalveo'
                className='text-white font-light hover:text-blue-300 lg:text-lg xl:text-xl no-underline transition duration-300'
              >
                About
              </Link>

              {/* Properties Dropdown */}
              <div className="relative">
                {/* Dropdown Trigger */}
                <button
                  onClick={toggleDropdown}
                  className="text-white font-light hover:text-blue-300 lg:text-lg xl:text-xl no-underline transition-colors duration-300 flex items-center gap-2"
                >
                  Properties For Sale
                  {/* Dropdown Indicator */}
                  <svg
                    className={`text-white h-4 w-4 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute left-0 w-56 mt-2 origin-top-right divide-y divide-gray-100 bg-gray-100 shadow-lg ring-1 ring-black/5">
                    <div className="py-1">
                      {/* Map properties items */}
                      {properties.map((item, index) => (
                        <a
                          key={index}
                          href={`/pages/explore?specificLocation=${item.slug}`}
                          className="block px-4 py-2 text-lg font-thin text-gray-700 hover:bg-customBlue hover:text-white no-underline"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Us Link */}
              <Link
                href='/pages/ContactUs'
                className='text-white font-light hover:text-blue-300 lg:text-lg xl:text-xl no-underline transition duration-300'
              >
                Contact Us
              </Link>
            </div>

            {/* Explore Properties Section */}
            {!isExplorePage && (
              <div className='ml-auto flex items-center text-sm sm:text-base lg:text-lg xl:text-xl font-medium'>
                <a
                  href='/pages/explore'
                  className='flex items-center text-white hover:opacity-80 transition-opacity duration-300'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <p className='ml-2 font-light text-center mt-3 text-lg lg:block hidden'>
                    Explore Properties
                  </p>
                </a>
              </div>
            )}

            {/* Call Section */}
            {isExplorePage && (
              <div className='ml-auto flex items-center text-white'>
                <IoCall className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white' />
                <p className='mt-3 ms-2'>CALL (632) 88485000</p>
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
        tabIndex='-1'
        onClick={closeSidebar}
        onKeyDown={e => e.key === 'Escape' && closeSidebar()}
      >
        <div className='flex justify-between items-center p-4 border-b border-gray-700 '>
          <a
            href=''
            className='text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg'
          ></a>
          <span
            className='text-xl font-bold cursor-pointer'
            onClick={closeSidebar}
          >
            &times;
          </span>
        </div>

        <nav className='p-4'>
          <a
            href='/pages/aboutalveo/aboutalveo'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            ABOUT ALVEO
          </a>
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
            href='/pages/ContactUs'
            className='block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg'
          >
            CONTACT US
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
