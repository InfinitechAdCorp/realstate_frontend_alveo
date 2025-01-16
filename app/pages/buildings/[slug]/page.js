'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Directory from '../../pathDirectory'
import Header from '../../header'
import Footer from './../../footer'
import SEO from './../../../seo/page'
import { showToast } from '@/components/alert/page'

export default function BlogPost ({ params }) {
  const { slug } = params
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [facilities, setFacilities] = useState([])
  const [buildings, setBuildings] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [popupType, setPopupType] = useState('')
  const togglePopup = (type = '') => {
    setPopupType(type)
    setIsOpen(!isOpen)
  }
  const handleShowSuccessToast = message => {
    showToast(message, 'success')
  }

  const handleShowErrorToast = message => {
    showToast(message, 'error')
  }

  const handleShowWarningToast = message => {
    showToast(message, 'warning')
  }
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    appointmentDate: '',
    unit: '',
    message: '',
    status: 'PENDING',
    reason: ''
  })
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/property/id/${slug}`
        )
        const data = await res.json()

        if (res.ok) {
          setProperty(data)

          await fetchFacilities(slug)
          await fetchBuildings(slug)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchFacilities = async propertyId => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/facilities_user/id/${propertyId}`
        )
        const data = await res.json()

        if (res.ok) {
          setFacilities(data)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching facilities:', error)
      }
    }

    const fetchBuildings = async propertyId => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/buildings_user/id/${propertyId}`
        )
        const data = await res.json()

        if (res.ok) {
          setBuildings(data)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching buildings:', error)
      }
    }

    fetchProperty()
  }, [slug])
  const parseFeatures = features => {
    try {
      return JSON.parse(features)
    } catch (error) {
      console.error('Error parsing features:', error)
      return []
    }
  }
  const submitForm = () => {
    console.log(popupType)

    const formdata = { ...formData, propertyId: property.id }
    const formattedDateForDisplay = new Date(
      formData.appointmentDate
    ).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    const isoDateForBackend = new Date(formData.appointmentDate).toISOString()

    const formDataToSubmit = {
      ...formData,
      unit: property.name,
      appointmentDate: isoDateForBackend
    }

    console.log(formDataToSubmit)
    if (popupType === 'Request Viewing') {
      const formDataToSubmit = {
        ...formData,
        unit: property.name,
        appointmentDate: isoDateForBackend,
        reason: popupType
      }
      submitAppointment(formDataToSubmit)
      console.log('Submitting Viewing Request:', formDataToSubmit)
    } else if (popupType === 'Property Inquiry') {
      const formDataToSubmit = {
        ...formData,
        unit: property.name,
        appointmentDate: isoDateForBackend,
        reason: popupType
      }
      submitAppointment(formDataToSubmit)
    }
  }
  const submitAppointment = formDataToSubmit => {
    console.log('Appointment Details to send:', formDataToSubmit)

    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataToSubmit)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('Appointment saved successfully:', data)
        console.log(popupType)
        const successMessage =
          popupType === 'Request Viewing'
            ? 'Appointment scheduled successfully!'
            : 'Property inquired successfully!'

        handleShowSuccessToast(successMessage)
      })

      .catch(error => {
        console.error('Error saving appointment:', error.message)
        handleShowErrorToast(
          'Failed to schedule appointment. Please try again.'
        )
      })
  }

  if (loading) return <div></div>

  if (!property) return <div>Property not found</div>
  const parsedFeatures = parseFeatures(property.features)
  return (
    <>
      <SEO
        title='REAL ESTATE'
        description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter..'
        keywords='alveo, real estate, luxury property, property features, building information, property information, building features, condominium features'
        canonical='${process.env.NEXT_PUBLIC_LOCAL_PORT}'
      />
      <div className='mb-10'>
        <Header />
      </div>
      <div className=' p-4 md:p-8 mt-20 w-full mb-20 text-customBlue'>
        <h1 className='text-2xl font-semibold text-customBlue mb-4 text-center'>
          {property.name}
        </h1>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='grid lg:grid-cols-2 gap-8'>
            <div className='relative'>
              <div className='grid gap-4'>
                <img
                  src={
                    property.path?.startsWith('https://')
                      ? property.path
                      : `${process.env.NEXT_PUBLIC_SERVER_PORT}/${property.path}`
                  }
                  alt={property.name}
                  className='w-full h-auto max-h-80 object-cover rounded-sm'
                />
              </div>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='property-info mb-4'>
                <div className='space-y-3'>
                  <h2 className='text-xl font-semibold'>Property Details</h2>
                  <p>
                    <strong>Location:</strong> {property.location}
                  </p>
                  <p>
                    <strong>Price Range:</strong> {property.price_range}
                  </p>
                  <p>
                    <strong>Status:</strong> {property.status}
                  </p>
                  <p>
                    <strong>Development Type:</strong>{' '}
                    {property.development_type}
                  </p>
                  <p>
                    <strong>Units:</strong> {property.units}
                  </p>
                  <p>
                    <strong>Specific Location:</strong>{' '}
                    {property.specific_location}
                  </p>
                </div>

                <div className='mt-7 space-x-4'>
                  <button
                    onClick={() => togglePopup('Request Viewing')}
                    className='px-6 py-2 text-md font-semibold text-white bg-cyan-700 
                    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out'
                  >
                    Request Viewing
                  </button>
                  <button
                    onClick={() => togglePopup('Property Inquiry')}
                    className='px-6 py-2 text-md font-semibold text-white bg-cyan-700 
                    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out'
                  >
                    Property Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-4/5 md:w-3/4 lg:w-1/2 flex flex-col md:flex-row gap-6 relative'>
                <button
                  className='absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75'
                  onClick={togglePopup}
                >
                  &times;
                </button>

                <div className='w-full md:w-1/2'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Property Details
                  </h2>
                  <p>
                    <strong>Name:</strong> {property.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {property.location}
                  </p>
                  <p>
                    <strong>Price Range:</strong> {property.price_range}
                  </p>
                  <p>
                    <strong>Status:</strong> {property.status}
                  </p>
                  <p>
                    <strong>Development Type:</strong>{' '}
                    {property.development_type}
                  </p>
                  <p>
                    <strong>Units:</strong> {property.units}
                  </p>
                  <p>
                    <strong>Specific Location:</strong>{' '}
                    {property.specific_location}
                  </p>
                </div>

                <div className='w-full md:w-1/2'>
                  <h2 className='text-xl font-semibold mb-4'>
                    {popupType === 'Request Viewing'
                      ? 'Schedule Appointment'
                      : 'Submit Inquiry'}
                  </h2>
                  <form
                    className='grid grid-cols-1 md:grid-cols-2 gap-4'
                    onSubmit={e => {
                      e.preventDefault()
                      submitForm()
                    }}
                  >
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Name
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Your Name'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Your Phone Number'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Your Email'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        {popupType === 'Request Viewing'
                          ? 'Appointment Date & Time'
                          : 'Preferred Contact Date & Time'}
                      </label>
                      <input
                        type='datetime-local'
                        name='appointmentDate'
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Message
                        </label>
                        <textarea
                          name='message'
                          value={formData.message}
                          onChange={handleInputChange}
                          className='mt-1 p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none h-20 w-full'
                          placeholder='Type your message here'
                        />
                      </div>

                      <button
                        type='submit'
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                      >
                        {popupType === 'Request Viewing'
                          ? 'Confirm Appointment'
                          : 'Submit Inquiry'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className='features mb-4'>
          <h2 className='text-2xl font-semibold mb-2'>Features</h2>
          {!parsedFeatures || parsedFeatures.length === 0 ? (
            <p>No features available for this property.</p>
          ) : (
            <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 text-center'>
              {parsedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className='border p-4'
                >
                  <h5>{feature.name}</h5>
                  <div className='relative group perspective-1000'>
                    <img
                      src={
                        feature.image?.startsWith('https://')
                          ? feature.image
                          : `${
                              process.env.NEXT_PUBLIC_SERVER_PORT
                            }/${feature.image.replace(/\\/g, '/')}`
                      }
                      alt={feature.name}
                      className='w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:rotate-x-12 group-hover:rotate-y-12 group-hover:scale-105 group-hover:shadow-lg'
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*  Facilities */}
        <div className='facilities mb-4 p-2 bg-gray-100'>
          <h2 className='text-2xl font-semibold text-center mb-4'>
            Facilities
          </h2>

          <ul className='grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-center justify-center'>
            {facilities.length === 0 ? (
              <div className='col-span-full flex items-center justify-center'>
                <p className='text-xl'>
                  No facilities available for this property.
                </p>
              </div>
            ) : (
              facilities.map(facility => (
                <li
                  key={facility.id}
                  className='bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition'
                >
                  <span className='text-lg text-gray-700'>{facility.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* building */}
        <h2 className='text-2xl font-semibold text-center items-center mb-4'>
          Buildings
        </h2>
        <div className='buildings grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full'>
          {buildings.length === 0 ? (
            <div className='col-span-full flex items-center justify-center text-center'>
              <p className='text-xl'>
                No buildings available for this property.
              </p>
            </div>
          ) : (
            buildings.map(building => (
              <div
                key={building.id}
                className='flex flex-col items-center p-6 bg-gray-100'
              >
                <h3 className='text-xl font-semibold text-center mb-6'>
                  {building.name}
                </h3>
                <img
                  src={
                    building.path?.startsWith('https://')
                      ? building.path
                      : building.path
                      ? `${process.env.NEXT_PUBLIC_SERVER_PORT}/${building.path
                          .replace(/^\/+/, '')
                          .replace(/\\/g, '/')}`
                      : ''
                  }
                  alt={building.name}
                  className='w-full h-60 rounded-lg mb-6'
                />

                <div className='text-base'>
                  <p>
                    <strong>Residential Levels:</strong>{' '}
                    {building.residential_levels}
                  </p>
                  <p>
                    <strong>Basement Parking Levels:</strong>{' '}
                    {building.basement_parking_levels}
                  </p>
                  <p>
                    <strong>Podium Parking Levels:</strong>{' '}
                    {building.podium_parking_levels || 'N/A'}
                  </p>
                  <p>
                    <strong>Commercial Units:</strong>{' '}
                    {building.commercial_units || 'N/A'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
