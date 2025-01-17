'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/alert/page'
import DevelopmentTypeModal from '@/components/admin/developmentTypeModal'
import ArchitecturalThemeModal from '@/components/admin/architecturalThemeModal'
import StatusModal from '@/components/admin/statusModal'
import Chart from '@/components/admin/chart'
import { Input } from '@/components/ui/input'
import { TiThMenu } from 'react-icons/ti'
import Demo from './../properties/page'
import Header from '../pages/header'
import AreaModal from '@/components/admin/areaModal'
import Appointment from '@/components/admin/appointments'
import SubmittedProperties from '@/components/admin/submittedProperties'
import Slider from 'react-slick'

export default function Admin ({}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)

  const [showProperties, setShowProperties] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of popup
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false) // To track OTP sent state
  const [isLoggedIn, setIsLoggedin] = useState(false) // To track OTP sent state
  const [submittedProperties, setSubmittedProperties] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalImages, setModalImages] = useState([])
  const [currentImages, setCurrentImages] = useState([])
  const [authToken, setAuthToken] = useState([]) // State to store fetched data from API
  const [properties, setProperties] = useState([]) // State to store fetched data from API

  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0
  })
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  const [isSidebarVisible, setSidebarVisible] = useState(false) // State for controlling sidebar visibility
  const [isDevelopmentTypeModalOpen, setDevelopmentTypeModalOpen] =
    useState(false)
  const [isArchitecturalThemeModalOpen, setArchitecturalThemeModalOpen] =
    useState(false)
  const [isStatusModalOpen, setStatusModalOpen] = useState(false)
  const [isAreaModalOpen, setAreaModalOpen] = useState(false)

  // Functions to open the respective modals
  const openDevelopmentTypeModal = () => setDevelopmentTypeModalOpen(true)
  const openArchitecturalThemeModal = () => setArchitecturalThemeModalOpen(true)
  const openStatusModal = () => setStatusModalOpen(true)
  const openAreaModal = () => setAreaModalOpen(true)
  const [activeNav, setActiveNav] = useState('DASHBOARD') // Default active nav
  const [data, setData] = useState({
    newType: '',
    newTheme: '',
    newStatus: '',
    newLocation: '',
    developmentTypes: [], // Ensure this is initialized as an array
    architecturalThemes: [],
    statusOptions: [],
    chatbotEntries: [], // Ensure chatbotEntries is an array
    newQuestion: '',
    newAnswer: '',
    newAreaName: '',
    newTitle: '',
    newDescription: '',
    newImage: null,
    locations: []
  })

  const [chatbotData, setChatbotData] = useState([])
  const [chatbotFormData, setChatbotFormData] = useState({
    question: '',
    answer: ''
  })

  const [editing, setEditing] = useState(null)
  const navItems_1 = [
    {
      name: 'DASHBOARD',
      onClick: () => console.log('Properties Clicked'),
      icon: '/assets/dashboard.png'
    },
    {
      name: 'PROPERTIES',
      onClick: () => console.log('Properties Clicked'),
      icon: '/assets/house.png'
    },
    {
      name: 'CLIENT PROPERTY',
      onClick: () => console.log('Details Clicked'),
      icon: '/assets/customers.png'
    },
    {
      name: 'APPOINTMENTS',
      onClick: () => console.log('Details Clicked'),
      icon: '/assets/appointment.png'
    }
  ]

  const navItems_2 = [
    {
      name: 'FORM FILLER',
      onClick: () => console.log('Detailes Clicked'),
      icon: '/assets/form.png'
    },
    {
      name: 'CHATBOT',
      onClick: () => console.log('Detailes Clicked'),
      icon: '/assets/robotic.png'
    }
  ]
  const navItems_FormFiller = [
    {
      name: 'DEVELOPMENT TYPE',
      onClick: () => setActiveNav('DEVELOPMENT TYPE'),
      icon: '/assets/turn-right.png'
    },
    {
      name: 'STATUS',
      onClick: () => setActiveNav('STATUS'),
      icon: '/assets/turn-right.png'
    },
    {
      name: 'ARCHITECTURAL THEME', // New item for architectural themes
      onClick: () => setActiveNav('ARCHITECTURAL THEME'), // Set activeNav to "ARCHITECTURAL THEMES"
      icon: '/assets/turn-right.png'
    },
    {
      name: 'LOCATION', // New item for locations
      onClick: () => setActiveNav('LOCATION'), // Set activeNav to "LOCATIONS"
      icon: '/assets/turn-right.png'
    }
  ]

  const [isEditing, setIsEditing] = useState(false)

  const [success, setSuccess] = useState('')

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const toggleDropdownCanvas = () => {
    setIsCanvasOpen(!isCanvasOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('isLoggedIn')
    window.location.reload() // You can redirect or reload the page after logging out
  }
  const handleAddLoc = async (
    type,
    areaName,
    title,
    description,
    image,
    setData,
    listType,
    areaId = null
  ) => {
    setError('')
    setSuccess('')
    if (!areaName || !title || !description) {
      setError('All fields are required')
      return
    }
    const formData = new FormData()
    formData.append('area_name', areaName)
    formData.append('title', title)
    formData.append('description', description)
    if (image) formData.append('image', image)

    // Add area ID if it's an update request
    if (type === 'update' && areaId) {
      formData.append('id', areaId)
    }
    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}` // Add Authorization header with token
          },
          body: formData // Send the formData
        }
      )
      const data = await response.json()
      if (response.ok) {
        handleShowSuccessToast('Location added successfully!')
        // Fetch the updated list of locations after adding the new location
        fetchFormFiller_location(setData)
        // Reset form data
        setData(prevData => ({
          ...prevData,
          newAreaName: '',
          newTitle: '',
          newDescription: '',
          newImage: null
        }))
      } else {
        console.error('Error:', data.message)
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      console.error('An error occurred:', err)
      setError('An error occurred during submission')
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
  // Fetch locations and update state
  const fetchLocations = async setData => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`
      )
      const data = await response.json()
      console.log('Fetched Locations:', data)
      setData(prevData => ({ ...prevData, locations: data }))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setData({ ...data, newImage: file })
    }
  }
  useEffect(() => {
    // Make sure user is logged in and token is available
    const storedToken = localStorage.getItem('auth_token')
    const storedLoginStatus = localStorage.getItem('isLoggedIn')

    if (!storedToken || storedLoginStatus !== 'true') {
      console.error('User is not logged in or token not found.')
      return // Don't proceed if not logged in
    }

    // Update state variables after checking login status
    setAuthToken(storedToken) // Ensure token is available in the state
    setIsLoggedin(storedLoginStatus === 'true') // Set login state if necessary

    const fetchData = async () => {
      try {
        // Fetch the data for each category
        const propertiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countproperties`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`, // Use the stored token
              'Content-Type': 'application/json'
            }
          }
        )
        const propertiesData = await propertiesRes.json()

        const otherBuildingsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countotherbuildings`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        const otherBuildingsData = await otherBuildingsRes.json()

        const condominiumsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countcondominiums`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        const condominiumsData = await condominiumsRes.json()

        const locationsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countlocations`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        const locationsData = await locationsRes.json()

        // Update the state with the fetched counts
        setCounts({
          properties: propertiesData.count || 0,
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0
        })

        console.log('Updated counts:', {
          properties: propertiesData.count || 0,
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData() // Call fetchData after setting the token
  }, [isLoggedIn, authToken]) // Depend on isLoggedIn and authToken

  useEffect(() => {
    const Token = localStorage.getItem('auth_token')
    const LoginStatus = localStorage.getItem('isLoggedIn')

    if (activeNav === 'DASHBOARD') {
      fetchCount() // Fetch other data for "Details"
    } else if (activeNav === 'STATUS') {
      fetchFormFiller_status(Token) // Fetch other data for "Details"
    } else if (activeNav === 'LOCATION') {
      fetchFormFiller_location(Token) // Fetch other data for "Details"
    } else if (activeNav === 'DEVELOPMENT TYPE') {
      fetchFormFiller_developmenttype(Token) // Fetch other data for "Details"
    } else if (activeNav === 'ARCHITECTURAL THEME') {
      fetchFormFiller_architecturaltheme(Token) // Fetch other data for "Details"
    } else if (activeNav === 'CHATBOT') {
      const fetchChatbotData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/getChatbot`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Token}` // Apply token here
              }
            }
          )
          const chatbotData = await response.json()
          console.log(chatbotData)
          // Update chatbotEntries state
          setData(prevData => ({
            ...prevData,
            chatbotEntries: chatbotData
          }))
        } catch (error) {
          console.error('Error fetching chatbot data:', error)
        }
      }

      fetchChatbotData()
    } else if (activeNav === 'CLIENT PROPERTY') {
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Token}` // Apply token here
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          setSubmittedProperties(data) // Store the data in the state
        })
        .catch(error => {
          console.error('Error fetching submitted properties:', error)
        })
    }
  }, [activeNav])
  const fetchFormFiller_status = token => {
    console.log(token)
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Status:', data)
        setData(prevData => ({ ...prevData, statusOptions: data }))
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  const fetchFormFiller_developmenttype = token => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Development Types:', data)
        setData(prevData => ({ ...prevData, developmentTypes: data }))
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  const fetchFormFiller_architecturaltheme = token => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Architectural Themes:', data)
        setData(prevData => ({ ...prevData, architecturalThemes: data }))
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  const fetchFormFiller_location = () => {
    const token = localStorage.getItem('auth_token')
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Locations:', data)
        setData(prevData => ({
          ...prevData,
          locations: data // Update the locations state
        }))
      })
      .catch(error => console.error('Error fetching data:', error))
  }

  const handleAdd = (type, newItem, setData, field) => {
    console.log('Adding item:', newItem) // Log the new item being added
    console.log(type)
    const Token = localStorage.getItem('auth_token') // Retrieve the token
    if (type === 'chatbot') {
      const { question, answer } = newItem
      // If we are editing an existing entry, use PUT instead of POST
      const method = isEditing ? 'PUT' : 'POST'
      console.log(method)
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/chatbot/${newItem.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addChatbot`
      console.log(url)
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Token}` // Include the token
        },
        body: JSON.stringify({ question, answer })
      })
        .then(response => response.json())
        .then(data => {
          // Ensure the response contains success status and new item with id
          if (data.success) {
            handleShowSuccessToast(
              `${isEditing ? 'Updated' : 'Added'} chatbot entry successfully!`,
              'success'
            )
            // If adding a new entry, add the entry with id to the chatbotEntries array
            if (isEditing) {
              setData(prevData => ({
                ...prevData,
                chatbotEntries: prevData.chatbotEntries.map(item =>
                  item.id === newItem.id ? { ...item, question, answer } : item
                )
              }))
            } else {
              const addedItem = { ...newItem, id: data.data.id } // Ensure newItem includes id
              setData(prevData => ({
                ...prevData,
                chatbotEntries: [...prevData.chatbotEntries, addedItem]
              }))
            }

            // Clear the input fields
            setChatbotFormData({ question: '', answer: '' })
          } else {
            console.error('Error response from API:', data.message)
          }

          fetchData() // Optionally fetch the updated data
        })
        .catch(error => {
          // Log the error if request fails
          console.error('Error adding/updating data:', error)
        })
    } else {
      // Existing logic for other types (e.g., developmentTypes, locations)

      if (!Token) {
        handleShowErrorToast('Authorization token is missing!')
        return
      }

      fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Token}` // Include the token
        },
        body: JSON.stringify({ name: newItem }) // Send new item data
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to add ${type}: ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          console.log('Add Response:', data)

          // Check if the API returned a success message or equivalent flag
          if (data?.success || data?.message) {
            handleShowSuccessToast(
              `Item added successfully: ${newItem}`,
              'success'
            )

            // Update the state to add the new item
            setData(prevData => ({
              ...prevData,
              [field]: Array.isArray(prevData[field])
                ? [
                    ...prevData[field],
                    { id: data.id || Date.now(), name: newItem }
                  ] // Use API `id` or fallback to `Date.now`
                : [{ id: data.id || Date.now(), name: newItem }]
            }))
          } else {
            handleShowErrorToast('Failed to add the item. Please try again.')
          }
        })
        .catch(error => {
          console.error('Error adding item:', error)
          handleShowErrorToast('An error occurred while adding the item.')
        })
    }
  }
  const openModal2 = filesArray => {
    setModalImages(filesArray.map(file => file.replace(/\\/g, '/'))) // Replace backslashes with forward slashes
    setModalIsOpen(true)
  }

  // Function to close the modal
  const closeModal2 = () => {
    setModalIsOpen(false)
    setModalImages([])
  }
  const handleDelete = (type, id, field) => {
    console.log(type, id, field) // Debugging log to check the values
    const Token = localStorage.getItem('auth_token') // Retrieve the token from localStorage

    if (!Token) {
      handleShowErrorToast('Authorization token is missing!')
      return
    }
    // Handle deletion of chatbot entries separately
    if (type === 'chatbot') {
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteChatbot/${id}` // API endpoint for chatbot deletion
      console.log('Deleting from URL:', url)

      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Token}` // Include the token
        }
      })
        .then(response => {
          if (response.ok) {
            handleShowSuccessToast(`Deleted Successfully!`)
          } else {
            handleShowErrorToast(`Deletion Failed!`)
          }
          return response.json() // Parse the JSON response
        })
        .then(data => {
          console.log('Delete Response:', data)
          setData(prevData => {
            const updatedData = { ...prevData }
            if (Array.isArray(prevData[field])) {
              updatedData[field] = prevData[field].filter(
                item => item.id !== id
              )
            }
            return updatedData
          })
          handleShowSuccessToast('Chatbot entry deleted successfully.') // Notify user
        })
        .catch(error => {
          console.error('Error deleting chatbot entry:', error)
          handleShowErrorToast(
            'An error occurred while deleting the chatbot entry.'
          )
        })
    } else {
      // Existing logic for deleting other types
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-${type}/${id}`
      console.log('Deleting from URL:', url) // Debugging line to check the URL
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Token}` // Include the token
        }
      })
        .then(response => {
          if (response.ok) {
            handleShowSuccessToast(`Deleted Successfully!`)
          } else {
            handleShowErrorToast(`Deletion Failed: ${id}`)
          }
          return response.json()
        })
        .then(data => {
          console.log(data.message)
          setData(prevData => {
            const updatedData = { ...prevData }
            if (Array.isArray(prevData[field])) {
              updatedData[field] = prevData[field].filter(
                item => item.id !== id
              )
            } else {
              updatedData[field] = prevData[field] === id ? '' : prevData[field]
            }
            if (field === 'developmentTypes') {
              updatedData.newType = ''
            } else if (field === 'architecturalThemes') {
              updatedData.newTheme = ''
            } else if (field === 'statusOptions') {
              updatedData.newStatus = ''
            } else if (field === 'locations') {
              updatedData.newAreaName = ''
              updatedData.newTitle = ''
              updatedData.newDescription = ''
              updatedData.newImage = null
            }

            return updatedData
          })
        })
        .catch(error => {
          console.error('Error deleting data:', error)
          handleShowErrorToast('An error occurred while deleting the item.')
        })
    }
  }

  const handleInputChange_chatbot = e => {
    const { name, value } = e.target
    setChatbotFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleLogin = async e => {
    e.preventDefault()

    const loginData = {
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      password: formData.password
    }
    console.log(loginData)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)

        // Clear localStorage first to ensure it's clean before setting new login data
        localStorage.clear()

        // Store the token and other user data in localStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userInfo', JSON.stringify(data.name))

        // Update the necessary states
        setAuthToken(data.token)
        setIsLoggedin(true) // Ensure isLoggedin is set to true

        // Set visibility or other UI-related states if needed
        setIsVisible(false)

        // No need to reload the page, just trigger any required side effects
      } else {
        const errorData = await response.json()
        console.error('Error during login:', errorData)
        setError(errorData.error || 'Login failed.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred.')
    }
  }

  const handlePropertiesClick = () => {
    setShowProperties(!showProperties)
  }
  const fetchCount = async (endpoint, key) => {
    console.log(endpoint)
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('Token not found.')
      setError('Token not found.')
      return // Exit if no token is found
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/${endpoint}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            'Content-Type': 'application/json' // Optional: specify the content type if needed
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setCounts(prevCounts => ({ ...prevCounts, [key]: data.count }))
      } else {
        console.error(`Error fetching ${key} count:`, data)
        setError(data.error || 'Error fetching data.')
      }
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error)
      setError('An unexpected error occurred while fetching data.')
    }
  }
  // UseEffect to fetch data after successful login
  useEffect(() => {
    const log = localStorage.getItem('isLoggedIn')
    const token = localStorage.getItem('auth_token') // Get the token from localStorage

    if (!token) {
      console.error('Token not found.')
      setError('Token not found.')
      return // Exit if no token is found
    } else {
      if (log === 'true') {
        console.log(token, log)
        setIsVisible(false)
        // Call the fetchCount function for each category, passing the appropriate endpoint and state key
        fetchCount('countproperties', 'properties')
        fetchCount('countotherbuildings', 'otherBuildings')
        fetchCount('countcondominiums', 'condominiums')
        fetchCount('countlocations', 'locations')
      } else {
        console.error('User is not logged in or token not found.')
      }
    }
  }, [])
  const openSidebar = () => {
    setSidebarVisible(true)
  }

  // Function to close the sidebar
  const closeSidebar = () => {
    setSidebarVisible(false)
  }

  // Functions to close the respective modals
  const closeModal = () => {
    setDevelopmentTypeModalOpen(false)
    setArchitecturalThemeModalOpen(false)
    setStatusModalOpen(false)
    setAreaModalOpen(false)
  }

  return (
    <>
      {isVisible && (
        <div className='popup-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
            <h2 className='text-2xl font-semibold text-center mb-4'>ACCOUNT</h2>
            <form>
              <div>
                <label htmlFor='password' className='block text-lg font-medium'>
                  Password:
                </label>
                <input
                  className='h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md'
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <p className='text-red-500 mt-2'>{error}</p>}

              <div className='w-full flex gap-6 mt-4 justify-center'>
                <button
                  className='w-32 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300'
                  type='submit'
                  onClick={handleLogin}
                >
                  LOGIN
                </button>
              </div>
            </form>

            {/* Log the admin email to the console */}
          </div>
        </div>
      )}

      <div className='flex fixed w-full'>
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-black text-white shadow-md transition-transform duration-300 z-40 ${
            isCanvasOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:w-1/6`}
          style={{
            backgroundImage: `url('/assets/sidebar.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className='text-center mt-14'>
            <h1 className='font-bold text-5xl md:text-4xl sm:text-3xl'>
              <a href='/'>Λ L V E O</a>
            </h1>
            <p className='text-base md:text-sm sm:text-xs mt-2'>
              an <b>AyalaLand</b> company
            </p>
          </div>

          <div className='mt-6'>
            <nav className='p-6'>
              <div className='flex items-center w-full'>
                <div className='flex-grow border-t border-gray-400'></div>
                <h1 className='text-sm px-3'>MENU</h1>
                <div className='flex-grow border-t border-gray-400'></div>
              </div>
              <ul>
                {navItems_1.map(item => (
                  <li
                    key={item.name}
                    onClick={() => {
                      setActiveNav(item.name)
                      item.onClick()
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                      activeNav === item.name ? 'bg-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 ${
                        activeNav === item.name
                          ? 'text-black'
                          : 'text-white group-hover:text-black'
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className='w-3 h-3 mr-2'
                      />
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className='p-6'>
              <div className='flex items-center w-full'>
                <div className='flex-grow border-t border-gray-400'></div>
                <h1 className='text-sm px-3'>MISC</h1>
                <div className='flex-grow border-t border-gray-400'></div>
              </div>
              <ul>
                {navItems_2.map(item => (
                  <li
                    key={item.name}
                    onClick={() => {
                      if (item.name === 'FORM FILLER') {
                        setActiveNav(
                          activeNav === 'FORM FILLER' ? null : 'FORM FILLER'
                        )
                      } else {
                        setActiveNav(item.name)
                        item.onClick()
                      }
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                      activeNav === item.name ? 'bg-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 ${
                        activeNav === item.name
                          ? 'text-black'
                          : 'text-white group-hover:text-black'
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className='w-3 h-3 mr-2'
                      />
                      {item.name}
                    </div>

                    {/* Submenu for "FORM FILLER" */}
                    {item.name === 'FORM FILLER' &&
                      activeNav === 'FORM FILLER' && (
                        <nav className='ml-4'>
                          <ul>
                            {navItems_FormFiller.map(subItem => (
                              <li
                                key={subItem.name}
                                onClick={e => {
                                  e.stopPropagation()
                                  setActiveNav(subItem.name)
                                  subItem.onClick()
                                }}
                                className={`group cursor-pointer transition-all duration-300 rounded-lg text-sm ${
                                  activeNav === subItem.name
                                    ? 'bg-blue-200'
                                    : 'hover:bg-blue-200'
                                }`}
                              >
                                <div
                                  className={`flex items-center text-sm p-1 ${
                                    activeNav === subItem.name
                                      ? 'text-black'
                                      : 'text-black group-hover:text-black'
                                  }`}
                                >
                                  <img
                                    src={subItem.icon}
                                    alt={subItem.name}
                                    className='w-3 h-3 mr-2'
                                  />
                                  {subItem.name}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {isCanvasOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
            onClick={() => setIsCanvasOpen(false)}
          ></div>
        )}

        <div
          className={`w-full p-4 h-screen overflow-y-auto ${
            isCanvasOpen ? 'ml-64' : 'ml-0'
          } md:ml-64`}
        >
          <header className='fixed top-0 left-0 w-full bg-white shadow-lg'>
            <div className='flex justify-between items-center p-4'>
              <div className='flex justify-between items-center px-4'>
                <div className='logosec text-center flex-grow'>
                  <a href='/'>
                    <div className='logo cursor-pointer text-darkblue font-semibold text-lg'>
                      ALVEO LAND
                    </div>
                  </a>
                </div>
              </div>

              <div className='message flex items-center space-x-4'>
                <div className='circle w-4 h-4 rounded-full bg-red-500'></div>
                <img
                  src='https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png'
                  className='icn'
                  alt='message-icon'
                  width={20}
                  height={20}
                />
                <div className='dp' onClick={toggleDropdown}>
                  <img
                    src='https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png'
                    className='dpicn rounded-full'
                    alt='profile'
                    width={40}
                    height={40}
                  />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg'>
                    <button
                      onClick={handleLogout}
                      className='block px-4 py-2 text-gray-800 w-full text-left hover:bg-gray-100'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* Hamburger button */}
              {!isCanvasOpen && (
                <button
                  className='md:hidden p-2 bg-customBlue text-white '
                  onClick={() => setIsCanvasOpen(!isCanvasOpen)}
                >
                  <TiThMenu />
                </button>
              )}
            </div>
          </header>
          <div className='demo-container min-h-screen mt-14 w-11/12 mx-auto overflow-y-auto scrollbar-hidden  justify-center'>
            {activeNav === 'DASHBOARD' && (
              <>
                {/* Grid Container */}
                <div className='flex justify-center mt-10'>
                  <div className='box-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4 sm:px-8 max-w-screen-xl'>
                    {/* Box 1 */}
                    <div className='box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                      <div className='text text-center flex flex-col items-center'>
                        <div className='flex items-center mb-2 sm:mb-4 justify-center'>
                          <h2 className='topic-heading text-2xl sm:text-3xl font-semibold'>
                            {counts.properties}
                          </h2>
                          <img
                            src='/assets/town.png'
                            alt='Views'
                            className='ml-2 sm:ml-4'
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className='topic text-sm sm:text-lg font-medium'>
                          Properties
                        </h2>
                      </div>
                    </div>

                    {/* Box 2 */}
                    <div className='box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                      <div className='text text-center flex flex-col items-center'>
                        <div className='flex items-center mb-2 sm:mb-4 justify-center'>
                          <h2 className='topic-heading text-2xl sm:text-3xl font-semibold'>
                            {counts.otherBuildings}
                          </h2>
                          <img
                            src='/assets/neighborhood.png'
                            alt='Other Buildings'
                            className='ml-2 sm:ml-4'
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className='topic text-sm sm:text-lg font-medium'>
                          Other Buildings
                        </h2>
                      </div>
                    </div>

                    {/* Box 3 */}
                    <div className='box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                      <div className='text text-center flex flex-col items-center'>
                        <div className='flex items-center mb-2 sm:mb-4 justify-center'>
                          <h2 className='topic-heading text-2xl sm:text-3xl font-semibold'>
                            {counts.condominiums}
                          </h2>
                          <img
                            src='/assets/skyline.png'
                            alt='Condominiums'
                            className='ml-2 sm:ml-4'
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className='topic text-sm sm:text-lg font-medium'>
                          Condominiums
                        </h2>
                      </div>
                    </div>

                    {/* Box 4 */}
                    <div className='box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                      <div className='text text-center flex flex-col items-center'>
                        <div className='flex items-center mb-2 sm:mb-4 justify-center'>
                          <h2 className='topic-heading text-2xl sm:text-3xl font-semibold'>
                            {counts.locations}
                          </h2>
                          <img
                            src='/assets/location.png'
                            alt='Locations'
                            className='ml-2 sm:ml-4'
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className='topic text-sm sm:text-lg font-medium'>
                          Locations
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Section */}
                <div className='mt-8 px-4'>
                  <Chart data={isLoggedIn} />
                </div>
              </>
            )}
            {activeNav === 'PROPERTIES' && (
              <div className='mt-20'>
                <Demo data={isLoggedIn} />
              </div>
            )}
            {activeNav === 'APPOINTMENTS' && (
              <div className='mt-20'>
                <Appointment />
              </div>
            )}
            {activeNav === 'CLIENT PROPERTY' && (
              <div className='mt-20'>
                <div className='justify-center text-center text-3xl my-2 mb-3'>
                  <h1 className='text-customBlue'>CLIENT PROPERTIES</h1>
                </div>
                <div className='overflow-x-auto'>
                  <table className='table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-700'>
                    <thead>
                      <tr>
                        <th className='px-4 py-2 border border-gray-200'>
                          First Name
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Last Name
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Email
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Phone
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Property Name
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Location
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Price
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Status
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Description
                        </th>
                        <th className='px-4 py-2 border border-gray-200'>
                          Files
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {submittedProperties.map(property => {
                        // Parse the files field into an array
                        const filesArray = JSON.parse(property.files)

                        return (
                          <tr key={property.id}>
                            <td className='border px-4 py-2'>
                              {property.first_name}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.last_name}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.email}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.phone}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.property_name}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.location}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.price}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.status}
                            </td>
                            <td className='border px-4 py-2'>
                              {property.description}
                            </td>
                            <td className='border px-4 py-2'>
                              {/* Button to show images in the modal */}
                              {filesArray.length > 0 && (
                                <button
                                  onClick={() => openModal2(filesArray)}
                                  className='px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600'
                                >
                                  Show Images
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal for displaying images */}
            {modalIsOpen && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                <div className='bg-white p-4 rounded-lg w-1/3 h-auto overflow-x-auto flex items-center justify-center'>
                  <button
                    onClick={closeModal2}
                    className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded p-2'
                  >
                    X
                  </button>
                  <div className='flex justify-center items-center w-full h-full'>
                    {modalImages.map((image, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${image}`} // Full URL to the image
                        alt={`Property image ${index + 1}`}
                        className='w-full h-full object-contain' // Make image fill the container
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeNav === 'DEVELOPMENT TYPE' && (
              <div className='h-[600px] overflow-y-auto mt-20'>
                <div className='h-80 overflow-y-auto'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Development Types
                  </h2>
                  <div className='flex gap-2 mb-4'>
                    <input
                      type='text'
                      placeholder='New Type Name'
                      value={data.newType || ''}
                      onChange={e =>
                        setData(prevData => ({
                          ...prevData,
                          newType: e.target.value
                        }))
                      }
                      className='border rounded p-2 w-full'
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          'development-type',
                          data.newType,
                          setData,
                          'developmentTypes'
                        )
                        setData(prevData => ({ ...prevData, newType: '' })) // Clear input
                      }}
                      className='bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600'
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.developmentTypes?.length > 0 ? (
                      data.developmentTypes.map(type => (
                        <li
                          key={type.id}
                          className='flex justify-between p-2 border-b hover:bg-gray-100'
                        >
                          <span>{type.name}</span>
                          <button
                            onClick={() =>
                              handleDelete(
                                'development-type',
                                type.id,
                                'developmentTypes'
                              )
                            }
                            className='text-red-500 hover:text-red-700'
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Development Types Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === 'ARCHITECTURAL THEME' && (
              <div className='h-[600px] overflow-y-auto mt-20'>
                {/* Architectural Theme */}
                <div className='h-80 overflow-y-auto'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Architectural Themes
                  </h2>
                  <div className='flex gap-2 mb-4'>
                    <input
                      type='text'
                      placeholder='New Theme Name'
                      value={data.newTheme}
                      onChange={e =>
                        setData({ ...data, newTheme: e.target.value })
                      }
                      className='border rounded p-2 w-full'
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          'architectural-theme',
                          data.newTheme,
                          setData,
                          'architecturalThemes'
                        )
                        setData({ ...data, newTheme: '' }) // Clear input after adding
                      }}
                      className='bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600'
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.architecturalThemes?.length > 0 ? (
                      data.architecturalThemes.map(theme => (
                        <li
                          key={theme.id}
                          className='flex justify-between p-2 border-b hover:bg-gray-100'
                        >
                          <span>{theme.name}</span>
                          <button
                            onClick={() =>
                              handleDelete(
                                'architectural-theme',
                                theme.id,
                                'architecturalThemes'
                              )
                            }
                            className='text-red-500 hover:text-red-700'
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Architectural Themes Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === 'STATUS' && (
              <div className='h-[600px] overflow-y-auto mt-20'>
                {/* Status */}
                <div className='h-80 overflow-y-auto'>
                  <h2 className='text-xl font-semibold mb-4'>Status</h2>
                  <div className='flex gap-2 mb-4'>
                    <input
                      type='text'
                      placeholder='New Status'
                      value={data.newStatus}
                      onChange={e =>
                        setData({ ...data, newStatus: e.target.value })
                      }
                      className='border rounded p-2 w-full'
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          'status',
                          data.newStatus,
                          setData,
                          'statusOptions'
                        )
                        setData({ ...data, newStatus: '' })
                      }}
                      className='bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600'
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.statusOptions?.length > 0 ? (
                      data.statusOptions.map(status => (
                        <li
                          key={status.id}
                          className='flex justify-between p-2 border-b hover:bg-gray-100'
                        >
                          <span>{status.name}</span>
                          <button
                            onClick={() =>
                              handleDelete('status', status.id, 'statusOptions')
                            }
                            className='text-red-500 hover:text-red-700'
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Status Options Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === 'LOCATION' && (
              <div className='h-[600px] overflow-y-auto mt-20 px-4 sm:px-8'>
                {/* Locations */}
                <div className='grid grid-cols-1 mb-6'>
                  <h2 className='text-lg sm:text-xl font-semibold mb-4'>
                    Locations
                  </h2>
                  <div className='flex flex-col sm:flex-row gap-2 mb-4'>
                    {/* Area Name */}
                    <input
                      type='text'
                      placeholder='Area Name'
                      value={data.newAreaName || ''}
                      onChange={e =>
                        setData({ ...data, newAreaName: e.target.value })
                      }
                      className='border rounded p-2 w-full'
                    />
                    {/* Title */}
                    <input
                      type='text'
                      placeholder='Title'
                      value={data.newTitle || ''}
                      onChange={e =>
                        setData({ ...data, newTitle: e.target.value })
                      }
                      className='border rounded p-2 w-full'
                    />
                    {/* Description */}
                    <input
                      type='text'
                      placeholder='Description'
                      value={data.newDescription || ''}
                      onChange={e =>
                        setData({ ...data, newDescription: e.target.value })
                      }
                      className='border rounded p-2 w-full'
                    />
                    {/* File Upload */}
                    <input
                      type='file'
                      onChange={handleImageChange}
                      className='border rounded p-2 w-full'
                    />
                    {/* Add Button */}
                    <button
                      onClick={() =>
                        handleAddLoc(
                          'location',
                          data.newAreaName,
                          data.newTitle,
                          data.newDescription,
                          data.newImage,
                          setData,
                          'locations'
                        )
                      }
                      className='bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto'
                    >
                      Add
                    </button>
                  </div>
                  {success && <p className='text-green-500 mb-4'>{success}</p>}
                  <ul>
                    {data.locations?.length > 0 ? (
                      data.locations.map(location => (
                        <li
                          key={location.id}
                          className='flex flex-col sm:flex-row justify-between p-2 border-b hover:bg-gray-100'
                        >
                          <span className='text-sm sm:text-base'>
                            {location.area_name} - {location.title}
                          </span>
                          <button
                            onClick={() =>
                              handleDelete('location', location.id, 'locations')
                            }
                            className='text-red-500 hover:text-red-700 mt-2 sm:mt-0'
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className='text-sm sm:text-base'>
                        No Locations Found
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === 'CHATBOT' && (
              <div className='p-6 w-full bg-white rounded-lg shadow-md'>
                <h3 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
                  Chatbot Table
                </h3>

                <table className='w-full table-auto mb-8 border-collapse'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600'>
                        ID
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600'>
                        Question
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600'>
                        Answer
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.chatbotEntries && data.chatbotEntries.length > 0 ? (
                      data.chatbotEntries.map(item => (
                        <tr
                          key={item.id || `${item.question}-${item.answer}`}
                          className='hover:bg-gray-100'
                        >
                          <td className='px-4 py-2 text-sm text-gray-800'>
                            {item.id}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-800'>
                            {item.question}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-800'>
                            {item.answer}
                          </td>
                          <td className='px-4 py-2 text-sm text-gray-800'>
                            <button
                              className='bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500'
                              onClick={() =>
                                handleDelete(
                                  'chatbot',
                                  item.id,
                                  'chatbotEntries'
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan='4'
                          className='px-4 py-2 text-center text-sm text-gray-500'
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
                  <h4 className='text-xl font-semibold text-gray-800 mb-4'>
                    {isEditing ? 'Edit' : 'Add'} Chatbot Entry
                  </h4>

                  <div className='space-y-4'>
                    <input
                      type='text'
                      name='question'
                      value={chatbotFormData.question}
                      onChange={handleInputChange_chatbot}
                      placeholder='Enter question'
                      className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <input
                      type='text'
                      name='answer'
                      value={chatbotFormData.answer}
                      onChange={handleInputChange_chatbot}
                      placeholder='Enter answer'
                      className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>

                  <div className='flex justify-center'>
                    <button
                      className={`w-1/2 mt-10 py-3 text-white rounded-md ${
                        isEditing
                          ? 'bg-indigo-600 hover:bg-indigo-500'
                          : 'bg-green-600 hover:bg-green-500'
                      }`}
                      onClick={() =>
                        handleAdd(
                          'chatbot',
                          {
                            question: chatbotFormData.question,
                            answer: chatbotFormData.answer
                          },
                          setData,
                          'chatbotEntries'
                        )
                      }
                    >
                      {isEditing ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <DevelopmentTypeModal
              isOpen={isDevelopmentTypeModalOpen}
              closeModal={closeModal}
            />
            <ArchitecturalThemeModal
              isOpen={isArchitecturalThemeModalOpen}
              closeModal={closeModal}
            />
            <StatusModal isOpen={isStatusModalOpen} closeModal={closeModal} />
            <AreaModal isOpen={isAreaModalOpen} closeModal={closeModal} />
          </div>
        </div>
      </div>
    </>
  )
}
