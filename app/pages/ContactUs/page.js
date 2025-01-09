'use client';

import { useState } from 'react';
import { showToast } from '@/components/alert/page';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const handleShowSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const handleShowErrorToast = (message) => {
    showToast(message, 'error'); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, 'warning'); // Warning toast
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      handleShowSuccessToast('Message sent successfully!');
      setFormData({
        inquiryType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        message: ''
      });
    } else {
      handleShowErrorToast('Something went wrong, please try again!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 shadow-lg rounded-lg">
      {/* Contact Form */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="inquiryType">
              What can we help you with?
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select an option</option>
              <option value="Sales Inquiry">Sales Inquiry</option>
              <option value="Customer Care">Customer Care</option>
              <option value="Leasing Inquiry">Leasing Inquiry</option>
              <option value="Other Concern">Other Concern</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Submit Inquiry
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 p-8 rounded">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h3>
        <div className="space-y-6 text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">📞 Phone</h4>
            <ul>
              <li>Sales: +63 (2) 53248888</li>
              <li>Leasing: +63 (2) 84037368</li>
              <li>Customer Care: (+63) 918 9183456</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📧 Email</h4>
            <ul>
              <li>Sales: <a href="mailto:sales@dmcihomes.com" className="text-blue-600">sales@dmcihomes.com</a></li>
              <li>Customer Care: <a href="mailto:customercare@dmcihomes.com" className="text-blue-600">customercare@dmcihomes.com</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📅 Set an Appointment</h4>
            <p>
              Avoid the queues, book a visit at{' '}
              <a href="https://book.dmcihomes.com" className="text-blue-600 underline">
                book.dmcihomes.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
