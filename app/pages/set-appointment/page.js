'use client'
import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Header from '../header'
import Footer from '../footer'
import SEO from '../../seo/page'

const SetAppointment = () => {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('') // Time in HH:mm format
  const [formattedDate, setFormattedDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    number: '',
    reason: '',
    property: '',
    message: '',
    datetime: '' // This will hold the formatted datetime
  })

  // Handle date change
  const handleDateChange = newDate => {
    setDate(newDate)
    const formatted = newDate.toLocaleDateString() // Format date as 'MM/DD/YYYY'
    setFormattedDate(formatted)
    updateDateTime(formatted, time)
  }

  // Handle time selection
  const handleTimeSelection = selectedTime => {
    setTime(selectedTime)
    updateDateTime(formattedDate, selectedTime)
  }

  // Update the combined datetime field
  const updateDateTime = (selectedDate, selectedTime) => {
    if (selectedDate && selectedTime) {
      const datetime = `${selectedDate} ${selectedTime}`
      setFormData(prevData => ({
        ...prevData,
        datetime: datetime
      }))
    }
  }

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()

    setError('') // Clear previous errors
    setSuccess('') // Clear previous success messages

    const appointmentData = new FormData()
    appointmentData.append('fullname', formData.fullname)
    appointmentData.append('email', formData.email)
    appointmentData.append('number', formData.number)
    appointmentData.append('reason', formData.reason)
    appointmentData.append('property', formData.property)
    appointmentData.append('message', formData.message)
    appointmentData.append('datetime', formData.datetime) // Send the formatted datetime

    try {
      const response = await fetch(
        'http://localhost:8000/api/set-appointment',
        {
          method: 'POST',
          body: appointmentData
        }
      )
      if (response.ok) {
        const data = await response.json()
        setSuccess('Appointment scheduled successfully!')
        console.log(data)
      } else {
        setError('Failed to schedule the appointment.')
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      setError('An error occurred while scheduling the appointment.')
    }
  }

  return (
    <div className=''>
      {/* SEO setup */}
      <SEO
        title='REAL ESTATE'
        description='Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.'
        keywords='alveo, real estate, location, property, building location, property location'
        canonical='http://localhost:3000/pages/locations'
      />

      {/* Header outside the main content */}
      <Header />

      <div className='text-center mb-2 mt-10'>
        <h1 className='text-3xl font-bold text-blue-600'>
          Schedule Your Appointment
        </h1>
        <p className='text-lg text-gray-700 mt-2'>
          Select a date and time for your appointment, and fill out the form
          below.
        </p>
        {/* Time Slot Selection */}
        <div className='px-2 p-2 items-center'>
          {[
            '08:00 AM',
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '01:00 PM',
            '02:00 PM',
            '03:00 PM',
            '04:00 PM',
            '05:00 PM'
          ].map(timeSlot => (
            <button
              key={timeSlot}
              onClick={() => handleTimeSelection(timeSlot)}
              className={`px-4 py-2 me-2 border rounded-lg ${
                time === timeSlot
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
            >
              {timeSlot}
            </button>
          ))}
        </div>
      </div>

      {/* Main content layout */}
      <div className='flex flex-col lg:flex-row mt-4 justify-center items-center'>
        <div className='lg:w-1/2 flex flex-col items-center w-full'>
          {/* Selected Time and Date */}
          <div className='mb-6'>
            <p className='text-xl font-medium text-gray-700'>
              Time and Date:{' '}
              <span className='text-blue-600'>
                {time
                  ? `${formattedDate} - ${time}`
                  : 'No date and time selected'}
              </span>
            </p>
          </div>

          {/* Calendar and Form Wrapper */}
          <div className='flex flex-col lg:flex-row w-full gap-4 p-5'>
            {/* Calendar */}
            <div className='w-full lg:max-w-lg'>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className='border border-gray-300 rounded-lg shadow-lg w-full p-4 items-center justify-center h-full'
              />
            </div>

            {/* Appointment Form */}
            <div className='bg-white p-6 rounded-lg shadow-md w-full'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Appointment Details
              </h2>
              <form onSubmit={handleSubmit}>
                {error && <p className='text-red-500 mb-4'>{error}</p>}{' '}
                {/* Error message */}
                {success && (
                  <p className='text-green-500 mb-4'>{success}</p>
                )}{' '}
                {/* Success message */}
                {/* Full Name */}
                <div className='mb-4'>
                  <label
                    htmlFor='fullname'
                    className='block text-sm font-medium text-gray-600'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='fullname'
                    name='fullname'
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-lg max-w-md mt-2'
                    placeholder='e.g. Juan Dela Cruz'
                  />
                </div>
                {/* Email and Phone Number - Two columns */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                  {/* Email */}
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-600'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                      placeholder='e.g. juandelacruz@gmail.com'
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor='number'
                      className='block text-sm font-medium text-gray-600'
                    >
                      Number
                    </label>
                    <input
                      type='tel'
                      id='number'
                      name='number'
                      value={formData.number}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                      placeholder='e.g. +63 992 440 1097'
                    />
                  </div>
                </div>
                {/* Appointment for and Property/Unit - Two columns */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label
                      htmlFor='reason'
                      className='block text-sm font-medium text-gray-600'
                    >
                      Appointment For
                    </label>
                    <select
                      id='reason'
                      name='reason'
                      value={formData.reason}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    >
                      <option value='' disabled>
                        Select an option
                      </option>
                      <option value='Property Viewing'>Property Viewing</option>
                      <option value='Online Meeting'>Online Meeting</option>
                    </select>
                  </div>

                  {/* Property/Unit */}
                  <div>
                    <label
                      htmlFor='property'
                      className='block text-sm font-medium text-gray-600'
                    >
                      Property/Unit
                    </label>
                    <input
                      type='text'
                      id='property'
                      name='property'
                      value={formData.property}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                      placeholder='e.g. Unit 205'
                    />
                  </div>
                </div>
                {/* Message - Single row text area */}
                <div className='mb-4'>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-600'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-lg'
                    rows='4'
                    placeholder='Additional details...'
                  ></textarea>
                </div>
                {/* Date and Time */}
                <div className='mb-4'>
                  <label
                    htmlFor='datetime'
                    className='block text-sm font-medium text-gray-600'
                  >
                    Selected Date and Time
                  </label>
                  <input
                    type='text'
                    id='datetime'
                    name='datetime'
                    value={formData.datetime}
                    readOnly
                    className='w-full p-2 border border-gray-300 rounded-lg'
                  />
                </div>
                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full py-2 bg-blue-600 text-white rounded-lg mt-4'
                >
                  Submit Schedule
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer outside the main content */}
      <Footer />
    </div>
  )
}

export default SetAppointment
