'use client'
import React, { useState } from 'react'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Header from '../header'
import Footer from '../footer'
import SEO from '../../seo/page'

const SetAppointment = () => {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('') // Time in HH:mm format
  const [formattedDate, setFormattedDate] = useState('')
  const [message, setMessage] = useState('') // To store success or error message
  const [messageType, setMessageType] = useState('')
  // Handle date change
  const handleDateChange = newDate => {
    setDate(newDate)
    const formatted = newDate.toLocaleDateString() // Format date as 'MM/DD/YYYY'
    setFormattedDate(formatted)
  }

  // Handle time selection
  const handleTimeSelection = selectedTime => {
    setTime(selectedTime)
  }

  // Update the combined datetime field
  const updateDateTime = (selectedDate, selectedTime) => {
    if (selectedDate && selectedTime) {
      return `${selectedDate} ${selectedTime}`
    }
    return ''
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const appointmentData = new FormData()
    appointmentData.append('fullname', values.fullname)
    appointmentData.append('email', values.email)
    appointmentData.append('number', values.number)
    appointmentData.append('reason', values.reason)
    appointmentData.append('property', values.property)
    appointmentData.append('message', values.message)
    appointmentData.append('datetime', updateDateTime(formattedDate, time))

    try {
      const response = await fetch(
        'https://infinitech-testing1.online/api/set-appointment',
        {
          method: 'POST',
          body: appointmentData
        }
      )
      if (response.ok) {
        const data = await response.json()
        setMessage('Appointment scheduled successfully!')
        setMessageType('success') // Success message
        console.log(data)
      } else {
        setErrors({ submit: 'Failed to schedule the appointment.' })
        setMessage('Failed to schedule the appointment. Please try again.')
        setMessageType('error') // Error message
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      setErrors({
        submit: 'An error occurred while scheduling the appointment.'
      })
      setMessage(
        'An error occurred while scheduling the appointment. Please try again.'
      )
      setMessageType('error') // Error message
    }
    setSubmitting(false)
  }

  // Validation schema with Yup
  const validationSchema = Yup.object({
    fullname: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    reason: Yup.string().required('Please select a reason for the appointment'),
    property: Yup.string().required('Please provide property/unit information'),
    message: Yup.string().required('Message is required')
  })

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
              {message && (
                <div
                  className={`p-4 mt-4 text-white rounded-lg text-center ${
                    messageType === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </div>
              )}
              <Formik
                initialValues={{
                  fullname: '',
                  email: '',
                  number: '',
                  reason: '',
                  property: '',
                  message: '',
                  datetime: updateDateTime(formattedDate, time)
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  errors,
                  touched
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {errors.submit && (
                      <p className='text-red-500 mb-4'>{errors.submit}</p>
                    )}
                    {/* Full Name */}
                    <div className='mb-4'>
                      <label
                        htmlFor='fullname'
                        className='block text-sm font-medium text-gray-600'
                      >
                        Full Name
                      </label>
                      <Field
                        type='text'
                        id='fullname'
                        name='fullname'
                        value={values.fullname}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg max-w-md mt-2'
                        placeholder='e.g. Juan Dela Cruz'
                      />
                      {touched.fullname && errors.fullname && (
                        <div className='text-red-500 text-sm'>
                          {errors.fullname}
                        </div>
                      )}
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
                        <Field
                          type='email'
                          id='email'
                          name='email'
                          value={values.email}
                          onChange={handleChange}
                          className='w-full p-2 border border-gray-300 rounded-lg'
                          placeholder='e.g. juandelacruz@gmail.com'
                        />
                        {touched.email && errors.email && (
                          <div className='text-red-500 text-sm'>
                            {errors.email}
                          </div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label
                          htmlFor='number'
                          className='block text-sm font-medium text-gray-600'
                        >
                          Number
                        </label>
                        <Field
                          type='tel'
                          id='number'
                          name='number'
                          value={values.number}
                          onChange={handleChange}
                          className='w-full p-2 border border-gray-300 rounded-lg'
                          placeholder='e.g. +63 992 440 1097'
                        />
                        {touched.number && errors.number && (
                          <div className='text-red-500 text-sm'>
                            {errors.number}
                          </div>
                        )}
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
                        <Field
                          as='select'
                          id='reason'
                          name='reason'
                          className='w-full p-2 border border-gray-300 rounded-lg'
                        >
                          <option value='' disabled>
                            Select an option
                          </option>
                          <option value='Property Viewing'>
                            Property Viewing
                          </option>
                          <option value='Online Meeting'>Online Meeting</option>
                        </Field>
                        {touched.reason && errors.reason && (
                          <div className='text-red-500 text-sm'>
                            {errors.reason}
                          </div>
                        )}
                      </div>

                      {/* Property/Unit */}
                      <div>
                        <label
                          htmlFor='property'
                          className='block text-sm font-medium text-gray-600'
                        >
                          Property/Unit
                        </label>
                        <Field
                          type='text'
                          id='property'
                          name='property'
                          value={values.property}
                          onChange={handleChange}
                          className='w-full p-2 border border-gray-300 rounded-lg'
                          placeholder='e.g. Unit 205'
                        />
                        {touched.property && errors.property && (
                          <div className='text-red-500 text-sm'>
                            {errors.property}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Message */}
                    <div className='mb-4'>
                      <label
                        htmlFor='message'
                        className='block text-sm font-medium text-gray-600'
                      >
                        Message
                      </label>
                      <Field
                        as='textarea'
                        id='message'
                        name='message'
                        value={values.message}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                        rows='4'
                        placeholder='Additional details...'
                      />
                      {touched.message && errors.message && (
                        <div className='text-red-500 text-sm'>
                          {errors.message}
                        </div>
                      )}
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
                        value={updateDateTime(formattedDate, time)}
                        readOnly
                        className='w-full p-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    {/* Submit Button */}
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full py-2 bg-blue-600 text-white rounded-lg mt-4'
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Schedule'}
                    </button>
                  </Form>
                )}
              </Formik>
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
