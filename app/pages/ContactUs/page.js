'use client'

import { useState } from 'react'
import { showToast } from '@/components/alert/page'
import Header from '../header'
import Footer from '../footer'
import { FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  })

  const handleShowSuccessToast = message => {
    showToast(message, 'success')
  }

  const handleShowErrorToast = message => {
    showToast(message, 'error')
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    if (res.ok) {
      handleShowSuccessToast('Message sent successfully!')
      setFormData({
        inquiryType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        message: ''
      })
    } else {
      handleShowErrorToast('Something went wrong, please try again!')
    }
  }

  return (
    <div>
      <Header />
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 rounded-lg mt-24 text-customBlue'>
        <div>
          <h2 className='text-3xl font-thin mb-6 text-customBlue'>
            Get in Touch
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6 text-customBlue'>
            <div>
              <label className='block  font-medium mb-2' htmlFor='inquiryType'>
                What can we help you with?
              </label>
              <select
                id='inquiryType'
                name='inquiryType'
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:ring-customBlue'
              >
                <option value=''>Select an option</option>
                <option value='Sales Inquiry'>Sales Inquiry</option>
                <option value='Customer Care'>Customer Care</option>
                <option value='Leasing Inquiry'>Leasing Inquiry</option>
                <option value='Other Concern'>Other Concern</option>
              </select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block  font-medium mb-2' htmlFor='firstName'>
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:ring-customBlue '
                />
              </div>
              <div>
                <label className='block  font-medium mb-2' htmlFor='lastName'>
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:customBlue '
                />
              </div>
            </div>

            <div>
              <label className='block  font-medium mb-2' htmlFor='email'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:customBlue '
              />
            </div>

            <div>
              <label className='block  font-medium mb-2' htmlFor='phone'>
                Phone Number
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                required
                className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:customBlue '
              />
            </div>

            <div>
              <label className='block  font-medium mb-2' htmlFor='message'>
                Message
              </label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                rows='4'
                required
                className='w-full p-3 border border-customBlue  focus:outline-none focus:ring-2 focus:customBlue '
              />
            </div>

            <div class='flex justify-center'>
              <button
                type='submit'
                className='w-1/2 py-3 bg-customBlue text-white font-thin  hover:bg-customBlue focus:outline-none focus:ring-2 focus:customBlue '
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>

        <div className='bg-customBlue border border-white p-7 max-w-lg mx-auto'>
          <h3 className='text-3xl font-thin mb-8 text-gray-200 tracking-wide text-center'>
            Contact Information
          </h3>
          <div className='space-y-8 text-white'>
            {/* Phone Section */}
            <div>
              <h4 className='text-xl font-thin mb-4 flex items-center'>
                <FaLocationDot className='text-xl mr-3 text-white' /> Location
              </h4>
              <ul className='space-y-3'>
                <li className='text-sm'>ALVEO Corporate Center</li>
                <li className='text-xs'>728 28th Street, Bonifacio Global City 1634 Taguig City, Metro Manila, Philippines</li>
              </ul>
            </div>
            <div>
              <h4 className='text-xl font-thin mb-4 flex items-center'>
                <FaPhoneAlt className='text-xl mr-3 text-white' /> Phone
              </h4>
              <ul className='space-y-3'>
                <li className='text-sm'>Customer Care: tel:(+632) 8848 5000</li>
              </ul>
            </div>

            {/* Email Section */}
            <div>
              <h4 className='text-xl font-thin mb-4 flex items-center'>
                <FaEnvelope className='text-xl mr-3 text-white' /> Email
              </h4>
              <ul className='space-y-3'>
                <li className='text-sm'>
                  Sales:{' '}
                  <a
                    href='mailto:sales@dmcihomes.com'
                    className='text-blue-300 hover:text-blue-500 font-medium'
                  >
                    info@alveoland.com.ph
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
