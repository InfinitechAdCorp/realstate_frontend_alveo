'use client' // Marks this component as client-side

import React, { useCallback, useEffect, useState, useRef } from 'react'
import Image from 'next/image' // Assuming you're using Next.js' Image component
import { useRouter } from 'next/navigation' // Hook for navigation

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import ClipLoader from 'react-spinners/ClipLoader'
import { showToast } from '../../components/alert/page' // Adjust the import path if necessary
import { IoBed, IoManSharp } from 'react-icons/io5'
import { FaCalculator, FaHouseCircleCheck } from 'react-icons/fa6'
import { FaCalendarAlt } from 'react-icons/fa'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SEO from './../seo/page'
import Header from './header'
import Footer from './footer'
import MyBot from '../../components/Chatbot/page'
import SocialMediaFloating from './socialmedia-icons/page'
const containerStyle = {
  width: '100%',
  height: '200px'
}
const center = {
  lat: 13.736,
  lng: 121.0583 // Set your longitude
}

const styles = {
  slide: {
    padding: '20px',
    textAlign: 'center',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '10px',
    transition: 'transform 0.3s ease'
  },
  title: {
    marginTop: '10px',
    fontSize: '18px', // Adjust size as needed
    color: '#333',
    fontWeight: 'bold',
    padding: '0 5px',
    transition: 'color 0.3s ease'
  }
}
const handleShowSuccessToast = message => {
  showToast(message, 'success')
}

const handleShowErrorToast = message => {
  showToast(message, 'error') // Error toast
}

const handleShowWarningToast = message => {
  showToast(message, 'warning') // Warning toast
}
const Carousel = () => {
  const [locations, setLocations] = useState([])
  const sliderRef = useRef(null) // Create a reference for the Slider component

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/allproperty')

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [])

  const settings = {
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  return (
    <div className='w-full mx-auto overflow-hidden mt-3 p-1 text-center h-full relative'>
      <h1 className='text-4xl text-customBlue font-light mb-4'>
        FEATURED PROPERTIES
      </h1>
      <Slider ref={sliderRef} {...settings}>
        {locations.map((location, index) => (
          <div
            key={index}
            className='flex flex-col items-center text-center p-4 border border-gray-300 bg-gray-100 shadow-md h-fit'
          >
            <img
              src={`/${location.path}`}
              alt={location.name}
              className='w-full h-60 object-cover rounded-lg mb-4'
            />
            <div className='text-center h-full'>
              <h3 className='text-lg font-bold my-1'>{location.name}</h3>
              <p className='text-sm text-gray-600 my-1'>
                {location.development_type}
              </p>
              <p className='text-sm text-gray-600 my-1'>{location.location}</p>
              <p className='text-sm text-gray-600 my-1'>
                {location.price_range}
              </p>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation buttons at the side of the carousel */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-customBlue text-white p-3 rounded-full shadow-lg hover:bg-customBlue transition duration-300'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='w-6 h-6 transform rotate-0'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-customBlue text-white p-3 rounded-full shadow-lg hover:bg-customBlue transition duration-300'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>
    </div>
  )
}
const Map = () => {
  const [locations, setLocations] = useState([]) // State for locations
  const [selectedLocation, setSelectedLocation] = useState(null) // State for the selected location
  const [isFullscreen, setIsFullscreen] = useState(false) // State for fullscreen mode

  useEffect(() => {
    // Fetch locations from the Laravel API
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/locations')
        const data = await response.json()
        setLocations(data) // Update state with fetched data
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [])

  const handleMarkerClick = location => {
    setSelectedLocation(location) // Set the selected location when marker is clicked
  }

  const containerStyle = {
    width: '100%',
    height: isFullscreen ? '100vh' : '400px' // Adjust height for fullscreen
  }

  const closeInfoContainer = () => {
    setSelectedLocation(null) // Clear the selected location
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <>
      {/* Embed Google Map iframe */}
      <iframe
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6866183300262!2d121.01093307577298!3d14.559904978070358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90b830e5f29%3A0x89fe307dfecd3c0d!2sCampos%20Rueda%20Building!5e0!3m2!1sen!2sph!4v1736238470025!5m2!1sen!2sph'
        width='100%' // Make iframe responsive
        height='450'
        style={{ border: '0' }} // Use object notation for styles
        allowFullScreen=''
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </>
  )
}

const AboutAlveo = () => {
  return (
    <>
      <div className='relative mt-0 p-4 bg-gray-100 shadow-md text-justify w-full lg:mt-0 2xl:h-full'>
        <div className='text-center'>
          <h1 className='text-5xl font-thin text-gray-800 my-4 lg:text-5xl xl:text-5xl 2xl:pt-5 tracking-widest'>
            ABOUT Λ L V E O LAND
          </h1>
        </div>

        <p className='text-lg leading-relaxed text-gray-700 indent-14 lg:text-xl lg:p-5 xl:text-xl xl:p-5'>
          As Ayala Lands upscale residential arm, Alveo offers a vibrant
          portfolio of groundbreaking real estate developments that provides
          upscale living and working spaces within various thriving and emerging
          growth centers around the country.
        </p>

        <p className='text-lg leading-relaxed text-gray-700 mt-2 indent-14 lg:text-xl lg:p-5 xl:text-xl xl:p-5'>
          Armed with sharper foresight, unparalleled excellence, and total
          commitment, the company is committed to providing
          thoughtfully-designed and master-planned living environments for the
          unique needs of its discerning market.
        </p>

        <div id='map' className='my-4 full'></div>
      </div>
    </>
  )
}
const ImageSlider = () => {
  const [locations, setLocations] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/properties')
      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }
      const data = await response.json()

      // Log the response to see its structure
      console.log(data)

      // Process the data to only extract id, name, and location
      if (Array.isArray(data)) {
        const simplifiedProperties = data.map(property => {
          return {
            id: property.id,
            name: property.name,
            location: property.location,
            path: property.path
          }
        })

        setLocations(simplifiedProperties) // Assuming setLocations sets the state
      } else {
        console.error('Invalid properties data structure', data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // Update the image every 3 seconds
  const nextImage = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % locations.length)
  }, [locations])

  useEffect(() => {
    if (locations.length > 0) {
      const interval = setInterval(nextImage, 3000)
      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [locations, nextImage])

  // Handle image load
  const handleImageLoad = () => {
    setLoading(false)
  }

  return (
    <div className='relative flex items-center justify-center w-auto h-auto p-0 m-0 max-sm:w-auto sm:w-1/3 md:w-auto lg:w-5/12'>
      {/* Check for loading state */}
      {loading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'>
          <span className='text-white'>Loading...</span>
        </div>
      )}

      {/* Only show the location image if there are locations */}
      {locations && locations.length > 0 && (
        <div className='relative w-full h-auto rounded-lg overflow-hidden cursor-pointer z-10'>
          <a
            href={`/pages/buildings/${encodeURIComponent(
              locations[currentIndex].id
            )}`}
            passHref
          >
            <Image
              src={
                locations[currentIndex].path &&
                locations[currentIndex].path.startsWith('https://')
                  ? locations[currentIndex].path // If it's already a full URL, use it directly
                  : locations[currentIndex].path
                  ? `http://localhost:8000/${locations[
                      currentIndex
                    ].path.replace(/\\/g, '/')}` // If it's a relative path, construct the full URL
                  : '' // If there's no path, set it to an empty string or fallback image URL
              }
              alt={locations[currentIndex].name}
              layout='responsive'
              width={600}
              height={400}
              className={`object-cover transition-opacity duration-300 ${
                loading ? 'opacity-0' : 'opacity-100'
              } w-80 xl:w-full 2xl:w-full h-full`}
              onLoad={handleImageLoad}
              priority
            />
          </a>

          {/* Location info overlay */}
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center p-3 text-sm z-30'>
            <h5 className='m-0 text-xs sm:text-sm md:text-base truncate'>
              {locations[currentIndex].name}
            </h5>
            <p className='m-0 text-xs sm:text-sm md:text-base truncate'>
              {locations[currentIndex].location}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

let dropdownValue
let searchValue
const AlveoBanner = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [fetchedData, setFetchedData] = useState([])
  const [isPopupVisible, setPopupVisible] = useState(false)
  const [propertyData, setPropertyData] = useState(null) // State for fetched data
  const [buildingData, setBuildingData] = useState([]) // State for building data
  const [propertiesWithBuildings, setPropertiesWithBuildings] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [enlargedImage, setEnlargedImage] = useState(null)
  const dashboardClips = [
    '/assets/dashboard/854325-hd_1280_720_25fps.mp4',
    '/assets/dashboard/2282013-uhd_3840_2024_24fps.mp4',
    '/assets/dashboard/3648257-uhd_3840_2160_30fps.mp4',
    '/assets/dashboard/3773486-hd_1920_1080_30fps.mp4',
    '/assets/dashboard/3773488-hd_1920_1080_30fps.mp4',
    '/assets/dashboard/4193140-uhd_2562_1440_24fps.mp4',
    '/assets/dashboard/8996835-uhd_3840_2160_30fps.mp4',
    '/assets/dashboard/alveo_cut.mp4'
  ]

  const [currentClip, setCurrentClip] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClip(prev => (prev + 1) % dashboardClips.length)
    }, 10000) // Change video every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const router = useRouter()
  // Image enlargement handler
  const handleImageClick = imgPath => {
    setEnlargedImage(imgPath) // Set the clicked image to enlarge
  }

  // Close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }
  // Function to hide the suggestions container
  const hideSuggestions = () => {
    setIsSuggestionsVisible(false) // Set the state to hide the suggestions
  }
  const openPopup = () => {
    setPopupVisible(true)
  }

  const closePopup = () => {
    closeEnlargedImage()
    setPopupVisible(false)
  }
  const handleSelectChange = event => {
    const dropdownValue = event.target.value
    console.log(dropdownValue)
    setSelectedValue(dropdownValue)
    setSearchInput('') // Clear search input when dropdown changes
    setSuggestions([]) // Clear suggestions when dropdown changes
    setShowSuggestions(false)
  }
  const handleSearchInputChange = event => {
    const searchValue = event.target.value
    setSearchInput(searchValue)

    // Trigger fetch only if both dropdown and input have values
    if (selectedValue && searchValue) {
      fetchSuggestions(selectedValue, searchValue)
      setIsSuggestionsVisible(true) // Show suggestions
    } else {
      setSuggestions([]) // Clear suggestions if either value is missing
      setIsSuggestionsVisible(false) // Hide suggestions if no valid search
    }
  }
  const fetchSuggestions = async (filter, searchValue) => {
    console.log(`Filter: ${filter}, Search Value: ${searchValue}`)

    try {
      const response = await fetch(`http://localhost:8000/api/properties`)
      const data = await response.json()

      console.log('API response data:', data)

      // Filter the data based on the search value
      const filteredSuggestions = data.filter(item =>
        item[filter]?.toLowerCase().includes(searchValue.toLowerCase())
      )

      // Remove duplicates based on the selected filter value
      const seen = new Set()
      const uniqueSuggestions = filteredSuggestions.filter(item => {
        const value = item[filter]
        if (seen.has(value)) {
          return false // If the value is already seen, filter it out
        } else {
          seen.add(value)
          return true // Otherwise, keep it
        }
      })

      setSuggestions(uniqueSuggestions) // Set unique filtered suggestions
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const renderSuggestion = item => {
    // Determine which property to display based on the selected dropdown value
    switch (selectedValue) {
      case 'name':
        return item.name // Display residence name
      case 'status':
        return item.status // Display status
      case 'location':
        return item.location // Display location
      case 'specific_location':
        return item.specific_location // Display specific location
      case 'price_range':
        return item.price_range // Display price range
      case 'units':
        return item.units // Display units
      case 'land_area':
        return item.land_area // Display land area
      case 'development_type':
        return item.development_type // Display development type
      case 'architectural_theme':
        return item.architectural_theme // Display architectural theme
      default:
        return null // Fallback if no valid property is found
    }
  }
  const fetchBuildingFeatures = async propertyId => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildingfeatures?property_id=${propertyId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }

      const features = await response.json()
      console.log(features)
      return features
    } catch (error) {
      console.error('Error fetching building features:', error)
    }
  }

  const fetchBuildings = async propertyId => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildings?property_id=${propertyId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }

      const buildings = await response.json()
      return buildings // Return buildings data
    } catch (error) {
      console.error('Error fetching buildings:', error)
      return [] // Return an empty array on error
    }
  }

  const fetchData = async (filter, searchValue, callback) => {
    if (!filter) {
      filter = 'All'
    }
    console.log(filter)
    try {
      const response = await fetch(
        `http://localhost:8000/api/searchProperty?filter=${filter}&search=${searchValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(data)
      // Fetch buildings for each property
      const propertiesWithBuildings = await Promise.all(
        data.properties.map(async property => {
          const buildings = await fetchBuildings(property.id)
          const buildingfeatures = await fetchBuildingFeatures(property.id) // Fetch buildings using property ID
          return { ...property, buildings, buildingfeatures } // Attach buildings to the property
        })
      )

      setFetchedData(propertiesWithBuildings) // Update state with properties and buildings

      const uniqueSuggestions = [
        ...new Set(propertiesWithBuildings.map(item => item[filter]))
      ]
      setSuggestions(uniqueSuggestions)

      if (callback) callback(propertiesWithBuildings)
    } catch (error) {
      console.error('Error fetching data:', error)
      setSuggestions([]) // Clear suggestions on error
    }
  }

  const handleClick1 = () => {
    // Check if the viewport width is 1366 or more
    if (window.innerWidth >= 1366) {
      // Append a random query parameter to the URL to avoid cache
      const randomParam = `?cacheBuster=${new Date().getTime()}`
      window.location.href = `/pages/roomplanner${randomParam}` // Refresh the page after navigation
    } else {
      handleShowErrorToast(
        'This feature is only available on larger screens (1366px or wider).'
      )
    }
  }

  const arrowFetch = () => {
    if (!selectedValue || selectedValue === 'All') {
      console.log('No value selected in dropdown')
    } else {
      console.log('Selected Value:', selectedValue)
    }

    // Log search input with a check for emptiness
    if (!searchInput) {
      console.log('No input in search field')
    } else {
      console.log('Search Input:', searchInput)
    }
    hideSuggestions()
    setShowSuggestions(false)
    openPopup()
    setLoading(true)

    // Fetch the property data based on selected value and search input
    fetchData(selectedValue, searchInput, async properties => {
      if (properties.length > 0) {
        // Create an array to store properties with buildings
        const propertiesWithBuildings = await Promise.all(
          properties.map(async property => {
            // Fetch buildings for each property and only associate them with that property
            const buildings = await fetchBuildings(property.id)
            return {
              ...property,
              buildings // Attach the fetched buildings to the property
            }
          })
        )

        // Store in state or pass to UI (depending on how you want to handle it)
        setFetchedData(propertiesWithBuildings)
      } else {
      }

      setLoading(false)
      setShowSuggestions(false)
    })
  }

  return (
    <>
      <div className='relative w-full h-screen'>
        <div className='absolute inset-0 bg-cover bg-center '>
          <div className='relative flex h-screen w-full'>
            {/* Video Background */}
            <video
              className='absolute inset-0 w-full h-full object-cover'
              src='/assets/dashboard/2282013-uhd_3840_2024_24fps.mp4'
              autoPlay
              loop
              muted
              playsInline
            ></video>

            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-customBlue'></div>

            {/* Content Section */}
            <div className='relative z-10 content sm:mt-10 xl:mt-40 2xl:mt-48 flex flex-col items-center xl:items-start justify-center text-center mt-10'>
              <div className='w-full max-w-7xl xl:max-w-full xl:pl-20 xl:text-left'>
                {/* Title */}
                <h1 className='mt-2 text-3xl font-medium sm:text-6xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-8xl 2xl:font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'>
                  Λ L V E O LAND
                </h1>

                {/* Subtitle */}
                <h4 className='text-xs font-thin sm:text-2xl md:text-xl lg:text-xl xl:text-3xl 2xl:text-5xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]'>
                  LIVE WELL ACROSS THE PHILIPPINES
                </h4>
                <div className='my-6 h-auto grid grid-cols-1 gap-6 relative'>
                  {/* Left Column: Search Inputs */}
                  <div className='space-y-4 lg:-mt-3 xl:-ml-40 xl:-mt-4 2xl:-ml-1 relative'>
                    {/* Search Bar */}
                    <div className='flex items-center border border-white rounded-md p-1 w-full max-w-lg'>
                      {/* Dropdown Selection */}
                      <select
                        id='locationDropdown'
                        value={selectedValue}
                        onChange={handleSelectChange}
                        className='bg-transparent text-white placeholder-white px-2 focus:outline-none flex-1 appearance-none'
                        aria-label='Select search category'
                      >
                        <option
                          value=''
                          disabled
                          selected
                          className='bg-[#002B47] text-white'
                        >
                          Select Category
                        </option>
                        <option value='all' className='bg-[#002B47] text-white'>
                          All
                        </option>
                        <option
                          value='name'
                          className='bg-[#002B47] text-white'
                        >
                          Residence Name
                        </option>
                        <option
                          value='location'
                          className='bg-[#002B47] text-white'
                        >
                          Location
                        </option>
                        <option
                          value='status'
                          className='bg-[#002B47] text-white'
                        >
                          Status
                        </option>
                        <option
                          value='specific_location'
                          className='bg-[#002B47] text-white'
                        >
                          Specific Location
                        </option>
                        <option
                          value='price_range'
                          className='bg-[#002B47] text-white'
                        >
                          Price Range
                        </option>
                        <option
                          value='units'
                          className='bg-[#002B47] text-white'
                        >
                          Units
                        </option>
                        <option
                          value='land_area'
                          className='bg-[#002B47] text-white'
                        >
                          Land Area
                        </option>
                        <option
                          value='development_type'
                          className='bg-[#002B47] text-white'
                        >
                          Development Type
                        </option>
                        <option
                          value='architectural_theme'
                          className='bg-[#002B47] text-white'
                        >
                          Architectural Theme
                        </option>
                      </select>

                      {/* Input Field */}
                      <input
                        type='text'
                        placeholder='Enter your search'
                        aria-label='Search'
                        id='searchInput'
                        className='flex-1 bg-transparent text-white placeholder-white px-2 focus:outline-none'
                        value={searchInput || ''}
                        onChange={handleSearchInputChange}
                      />

                      {/* Search Button */}
                      <button
                        onClick={arrowFetch}
                        className='bg-transparent text-white font-semibold px-4 py-1 border-l border-white hover:text-gray-300 focus:outline-none'
                      >
                        SEARCH →
                      </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {isSuggestionsVisible && searchInput.trim() && (
                      <div className='absolute max-h-60 overflow-y-auto w-full sm:w-2/4 md:w-2/4 lg:w-1/3 xl:w-1/5 mx-auto top-full mt-1 z-20 bg-white shadow-md border rounded-md space-y-1'>
                        {suggestions.length > 0 && selectedValue !== 'All' ? (
                          suggestions.map((item, index) => (
                            <div
                              key={index}
                              className='cursor-pointer hover:bg-gray-100 p-2 rounded max-h-40'
                              onClick={() => {
                                setSearchInput(item[selectedValue]) // Dynamically set search input
                                setSuggestions([])
                                setIsSuggestionsVisible(false)
                              }}
                            >
                              {item[selectedValue]}
                            </div>
                          ))
                        ) : (
                          <div className='text-gray-500 text-center py-2'>
                            No Data Available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Right Column: Image Slider */}
              {/* <div className='relative flex justify-center items-center w-4/5 max-sm:left-8 sm:left-1/3 sm:top-20 md:left-40 xl:-mt-10 max-sm:h-40 md:w-1/2 md:top-20 md:ml-16 lg:left-1/3 lg:ml-1 lg:w-1/3 xl:w-5/12 xl:left-1/2 xl:ml-10 xl:absolute xl:-translate-y-1/3 xl:flex xl:justify-start xl:items-center'>
                    <div className='absolute inset-0 w-full flex'>
                      <ImageSlider />
                    </div>
                  </div> */}
            </div>
          </div>

          <div className='fixed top-20 right-1 z-50 lg:top-13 lg:right-2 flex space-x-2'>
            {/* Room Planner Icon */}
            <div className='flex justify-center items-center'>
              <div className='bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'>
                <a href='/pages/roomplanner' target='_blank'>
                  <div className='cursor-pointer relative group'>
                    <IoBed
                      className='w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue'
                      onMouseOver={e =>
                        (e.currentTarget.style.transform =
                          'scale(1.1) translateY(-5px)')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform =
                          'scale(1) translateY(0)')
                      }
                    />
                    <span className='tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      Room Planner
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Loan Calculator Icon */}
            <div className='flex justify-center items-center'>
              <div className='bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'>
                <a href='/pages/loancalculator' passHref>
                  <div className='relative group'>
                    <FaCalculator
                      className='w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue'
                      onMouseOver={e =>
                        (e.currentTarget.style.transform =
                          'scale(1.1) translateY(-5px)')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform =
                          'scale(1) translateY(0)')
                      }
                    />
                    <span className='tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      Loan Calculator
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Set Appointment Icon */}
            <div className='flex justify-center items-center'>
              <div className='bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'>
                <a href='/pages/set-appointment' passHref>
                  <div className='relative group'>
                    <FaCalendarAlt
                      className='w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue'
                      onMouseOver={e =>
                        (e.currentTarget.style.transform =
                          'scale(1.1) translateY(-5px)')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform =
                          'scale(1) translateY(0)')
                      }
                    />
                    <span className='tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      Set Appointment
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Submit Property Icon */}
            <div className='flex justify-center items-center'>
              <div className='bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'>
                <a href='/pages/add-property' passHref>
                  <div className='relative group'>
                    <FaHouseCircleCheck
                      className='w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue'
                      onMouseOver={e =>
                        (e.currentTarget.style.transform =
                          'scale(1.1) translateY(-5px)')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform =
                          'scale(1) translateY(0)')
                      }
                    />
                    <span className='tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      Submit Property
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Agent Icon */}
            <div className='flex justify-center items-center'>
              <div className='bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out'>
                <a href='/pages/agent' passHref>
                  <div className='relative group'>
                    <IoManSharp
                      className='w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue'
                      onMouseOver={e =>
                        (e.currentTarget.style.transform =
                          'scale(1.1) translateY(-5px)')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.transform =
                          'scale(1) translateY(0)')
                      }
                    />
                    <span className='tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      Agent
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {enlargedImage && (
            <div
              className='absolute top-1 w-screen  h-1/2 md:w-1/2 md:h-screen z-40'
              onClick={closeEnlargedImage}
            >
              <img
                src={enlargedImage}
                alt='Enlarged'
                className='w-full h-full' // Adjust as necessary
              />
            </div>
          )}
          {isPopupVisible && (
            <div className='popup-container absolute inset-0  flex justify-center items-center h-screen overflow-auto top-1/2 z-50 md:w-1/2 md:left-1/2 lg:right-0 xl:right-0 2xl:ml-36  md:top-0'>
              <div className='bg-blue-600 p-6  w-full max-w-2xl h-full  overflow-y-auto relative shadow-lg'>
                <span
                  className='absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-600 transition-colors duration-300'
                  onClick={closePopup}
                >
                  &times;
                </span>

                {loading ? (
                  <div className='flex justify-center items-center py-16'>
                    <ClipLoader color='#ffffff' loading={loading} size={100} />
                  </div>
                ) : fetchedData && fetchedData.length > 0 ? (
                  fetchedData.map((property, index) => (
                    <div
                      key={index}
                      className='property-card mb-8 space-y-8 bg-white rounded-lg shadow-lg p-6'
                    >
                      <h2 className='text-2xl font-semibold text-gray-800 text-center'>
                        Property Details
                      </h2>
                      <div className='property-card-header flex items-center justify-between gap-5'>
                        <h3 className='text-xl font-semibold text-gray-700'>
                          {property.name}
                        </h3>
                        <p className='text-gray-600 mt-2'>
                          {property.location}
                        </p>
                      </div>

                      {/* Image Gallery */}
                      {[property.path, property.view].map(
                        (imgPath, imgIndex) => {
                          // Construct the image source URL based on whether it's a relative path or an absolute URL
                          const imageSrc = (() => {
                            if (
                              imgPath.startsWith('http') ||
                              imgPath.startsWith('https')
                            ) {
                              // If it's an absolute URL, use it directly
                              return imgPath
                            }

                            if (imgPath.startsWith('property/')) {
                              // If the image path starts with "property/", it is assumed to be in the "public" folder
                              return `http://localhost:8000/${imgPath.replace(
                                /\\/g,
                                '/'
                              )}`
                            }

                            // For any other local paths, prepend the base URL
                            return `http://localhost:8000/${imgPath.replace(
                              /\\/g,
                              '/'
                            )}`
                          })()

                          console.log('Image Source:', imageSrc) // Log the image source to verify the correct path

                          return (
                            <div className='relative' key={imgIndex}>
                              <img
                                src={imageSrc}
                                alt={`${property.name} view ${imgIndex + 1}`}
                                onMouseEnter={() => setHoveredImage(imageSrc)}
                                onMouseLeave={() => setHoveredImage(null)}
                                onClick={() => handleImageClick(imageSrc)}
                                className='w-full h-auto rounded-lg shadow-md group-hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 object-cover'
                              />
                              {/* Hover overlay */}
                              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out rounded-lg'></div>
                            </div>
                          )
                        }
                      )}

                      {/* Property Info */}
                      <div className='property-info bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out'>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Status:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.status}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Price Range:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.price_range}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Land Area:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.land_area}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Architectural Theme:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.architectural_theme}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Development Type:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.development_type}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between border-b pb-4 mb-4'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Specific Location:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.specific_location}
                          </span>
                        </div>
                        <div className='property-detail-item flex items-center justify-between'>
                          <span className='text-gray-800 font-semibold w-1/2 text-left'>
                            Units:
                          </span>
                          <span className='text-gray-600 w-1/2 text-left'>
                            {property.units}
                          </span>
                        </div>
                      </div>

                      {/* Key Features Section */}
                      <div className='features-section space-y-8 flex flex-col items-center justify-center'>
                        <span className='section-title text-3xl font-extrabold text-gray-900 tracking-tight text-center'>
                          Key Features
                        </span>
                        <ul className='features-list space-y-8 flex flex-col items-center justify-center w-full max-w-4xl -ml-10'>
                          {/* Check if there are features available */}
                          {property.features &&
                          JSON.parse(property.features).length > 0 ? (
                            JSON.parse(property.features).map(
                              (feature, featureIndex) => {
                                // Check the type of image path and create the appropriate source URL
                                const getImageSrc = imagePath => {
                                  if (!imagePath) return '' // If no image path, return empty string or placeholder

                                  // If the image path starts with '/property/', treat it as a URL that requires the base URL
                                  if (imagePath.startsWith('/property/')) {
                                    return `http://localhost:8000${imagePath.replace(
                                      /\\/g,
                                      '/'
                                    )}`
                                  }

                                  // If the image path starts with 'http' or 'https', it's already a full URL
                                  if (
                                    imagePath.startsWith('http') ||
                                    imagePath.startsWith('https')
                                  ) {
                                    return imagePath
                                  }

                                  // If it's a relative path (assets folder), convert it to the correct path
                                  return `${imagePath.replace(/\\/g, '/')}`
                                }

                                const imageSrc = getImageSrc(feature.image) // Get the image source based on the logic

                                return (
                                  <li
                                    key={featureIndex}
                                    className='feature-item flex items-center gap-6 p-6 rounded-2xl bg-white shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 w-full max-w-md'
                                  >
                                    <img
                                      src={imageSrc} // Use the dynamic image source here
                                      alt={feature.name}
                                      className='feature-icon w-16 h-16 border-4 border-gray-300 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-125 hover:shadow-xl'
                                      onMouseEnter={() =>
                                        setHoveredImage(imageSrc)
                                      }
                                      onMouseLeave={() => setHoveredImage(null)}
                                      onClick={() => handleImageClick(imageSrc)}
                                      style={{ cursor: 'pointer' }}
                                    />
                                    <span className='text-xl font-semibold text-gray-800 tracking-tight'>
                                      {feature.name}
                                    </span>
                                  </li>
                                )
                              }
                            )
                          ) : (
                            <div className='text-center text-xl font-semibold text-gray-500'>
                              No features available
                            </div>
                          )}
                        </ul>
                      </div>

                      {/* Building Features Section */}
                      <div className=''>
                        {/* Section Title */}
                        <span className='section-title flex justify-center text-center text-2xl font-bold  text-gray-800 tracking-wide uppercase'>
                          Building Features
                        </span>

                        {/* Building Features List */}
                        <ul className='building-features-list  list-none text-center justify-center'>
                          {property.buildingfeatures &&
                          property.buildingfeatures.length > 0 ? (
                            property.buildingfeatures.map(
                              (feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className='building-feature-item flex items-center text-center justify-center  text-lg text-gray-800'
                                >
                                  {/* Add an icon for each feature */}
                                  <span className='icon text-green-500'>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      className='h-6 w-6'
                                      fill='none'
                                      viewBox='0 0 24 24'
                                      stroke='currentColor'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M5 13l4 4L19 7'
                                      />
                                    </svg>
                                  </span>
                                  <span className='text-black font-semibold'>
                                    {feature.name}
                                  </span>
                                </li>
                              )
                            )
                          ) : (
                            <li className='text-gray-500 text-lg'>
                              {/* Add a subtle placeholder icon */}
                              <span className='icon text-gray-400'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-6 w-6'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12h6m-6 4h6m-6-8h6m2-4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z'
                                  />
                                </svg>
                              </span>
                              No building features available.
                            </li>
                          )}
                        </ul>

                        {/* Building Layout Section */}
                        {property.buildings && property.buildings.length > 0 && (
                          <div className='mt-6 w-auto flex justify-center'>
                            <div className='w-auto max-w-4xl'>
                              {/* Container with max width */}
                              <span className='section-title text-2xl font-bold text-gray-800 tracking-wide uppercase'>
                                Building Layout
                              </span>
                              <ul className='mt-3 flex -ml-9 flex-wrap w-80 gap-5'>
                                {/* Grid layout */}
                                {property.buildings.map(
                                  (building, buildingIndex) => (
                                    <li
                                      key={buildingIndex}
                                      className='space-y-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4'
                                    >
                                      {/* Building Name */}
                                      <h5 className='text-xl font-semibold text-gray-800'>
                                        {building.name}
                                      </h5>

                                      {/* Image Container */}
                                      <div className='relative'>
                                        <img
                                          src={
                                            building.path
                                              ? building.path.startsWith(
                                                  'http'
                                                ) ||
                                                building.path.startsWith(
                                                  'https'
                                                )
                                                ? building.path // If it's a URL, use it directly
                                                : building.path.startsWith(
                                                    '/property/'
                                                  )
                                                ? `http://localhost:8000${building.path.replace(
                                                    /\\/g,
                                                    '/'
                                                  )}` // If it's a local asset with '/property/', prepend the local server URL
                                                : `${building.path.replace(
                                                    /\\/g,
                                                    '/'
                                                  )}` // If it's a relative asset, prepend '/assets'
                                              : '' // Fallback in case building.path is null or undefined
                                          }
                                          alt={building.name}
                                          onMouseEnter={() =>
                                            setHoveredImage(building.path)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredImage(null)
                                          }
                                          onClick={() =>
                                            handleImageClick(building.path)
                                          }
                                          className='w-full h-64 object-cover rounded-lg transition-all duration-300 transform hover:scale-105'
                                        />
                                        {/* Hover Effect: Show image details on hover */}
                                      </div>

                                      {/* Building Info List */}
                                      <ul className='mt-4 text-gray-700 space-y-2 list-none pl-0'>
                                        <li>
                                          <strong className='text-gray-800'>
                                            Development Type:
                                          </strong>{' '}
                                          {building.development_type}
                                        </li>
                                        <li>
                                          <strong className='text-gray-800'>
                                            Residential Levels:
                                          </strong>{' '}
                                          {building.residential_levels}
                                        </li>
                                        <li>
                                          <strong className='text-gray-800'>
                                            Basement Parking Levels:
                                          </strong>{' '}
                                          {building.basement_parking_levels}
                                        </li>
                                        <li>
                                          <strong className='text-gray-800'>
                                            Podium Parking Levels:
                                          </strong>{' '}
                                          {building.podium_parking_levels}
                                        </li>
                                        <li>
                                          <strong className='text-gray-800'>
                                            Commercial Units:
                                          </strong>{' '}
                                          {building.commercial_units}
                                        </li>
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No properties found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const DashboardComponent = () => {
  return (
    <>
      <SEO
        title='REAL ESTATE'
        description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
        keywords='alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale'
        canonical='http://localhost:3000'
      />

      <div className='mb-10'>
        <Header />
      </div>

      <AlveoBanner />

      <Carousel />
      <div className='xl:flex w-screen xl:-z-10'>
        <div className='xl:w-1/2 xl:-z-10'>
          <AboutAlveo />
        </div>
        <div className='xl:w-1/2 '>
          <Map />
        </div>
      </div>
      <div className='max-sm:mt-32 sm:mt-32 xl:mt-0 xl:z-50'>
        <SocialMediaFloating />
        <MyBot />
        <Footer />
      </div>

      {/**    
        
      */}

      <div></div>
    </>
  )
}

export default DashboardComponent
