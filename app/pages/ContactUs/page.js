"use client";

import { useState } from "react";
import { showToast } from "@/components/alert/page";
import Header from "../header";
import Footer from "../footer";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    inquiryType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      handleShowSuccessToast("Message sent successfully!");
      setFormData({
        inquiryType: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        message: "",
      });
    } else {
      handleShowErrorToast("Something went wrong, please try again!");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 shadow-lg rounded-lg mt-20">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="inquiryType"
              >
                What can we help you with?
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div class="flex justify-center">
              <button
                type="submit"
                className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
          <h3 className="text-4xl font-semibold mb-8 text-gray-900 tracking-wide">
            Contact Information
          </h3>
          <div className="space-y-6 text-gray-700">
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📞</span> Phone
              </h4>
              <ul className="space-y-3">
                <li className="text-lg">Sales: +63 (2) 53248888</li>
                <li className="text-lg">Leasing: +63 (2) 84037368</li>
                <li className="text-lg">Customer Care: (+63) 918 9183456</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📧</span> Email
              </h4>
              <ul className="space-y-3">
                <li className="text-lg">
                  Sales:{" "}
                  <a
                    href="mailto:sales@dmcihomes.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    sales@dmcihomes.com
                  </a>
                </li>
                <li className="text-lg">
                  Customer Care:{" "}
                  <a
                    href="mailto:customercare@dmcihomes.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    customercare@dmcihomes.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📅</span> Set an Appointment
              </h4>
              <p className="text-lg">
                Avoid the queues, book a visit at{" "}
                <a
                  href="https://book.dmcihomes.com"
                  className="text-blue-600 underline hover:text-blue-800 font-medium"
                >
                  book.dmcihomes.com
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactForm;
