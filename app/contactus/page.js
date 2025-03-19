"use client";

import { useState } from "react";
import { showToast } from "@/components/alert/page";

import Icon from "@/app/pages/socialmedia-icons/page";
import Footer from "@/app/pages/footer";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaBuilding,
} from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  const validationSchema = Yup.object({
    inquiryType: Yup.string().required("Please select an inquiry type."),
    firstName: Yup.string()
      .min(4, "First name must be at least 4 characters.")
      .required("First name is required."),
    lastName: Yup.string()
      .min(4, "Last name must be at least 4 characters.")
      .required("Last name is required."),
    email: Yup.string()
      .email("Invalid email format.")
      .required("Email is required."),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only numbers.")

      .max(11, "Phone number can be at most 11 digits.")
      .required("Phone number is required."),
    message: Yup.string().required("Message is required."),
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
  const handleSubmit = async (values, { resetForm }) => {
    // Log the values that are passed from Formik (the actual form data)
    console.log(values); // This will show the correct form data

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Use values directly here
      }
    );

    if (res.ok) {
      handleShowSuccessToast("Message sent successfully!");
      // Reset the form values after success
      resetForm();
    } else {
      handleShowErrorToast("Something went wrong, please try again!");
    }
  };

  return (
    <>
      <div className="w-full flex justify-center h-auto">
        <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 rounded-lg mt-24  bg-white">
          <div>
            <h2 className="text-3xl font-thin mb-6 ">Get in Touch</h2>
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit} // Formik will handle the form submission
            >
              {({ handleChange, values, errors, touched }) => (
                <Form className="space-y-6 text-customBlue">
                  <div>
                    <label
                      className="block font-medium mb-2"
                      htmlFor="inquiryType"
                    >
                      What can we help you with?
                    </label>
                    <Field
                      as="select"
                      id="inquiryType"
                      name="inquiryType"
                      className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                    >
                      <option value="">Select an option</option>
                      <option value="Sales Inquiry">Sales Inquiry</option>
                      <option value="Customer Care">Customer Care</option>
                      <option value="Leasing Inquiry">Leasing Inquiry</option>
                      <option value="Other Concern">Other Concern</option>
                    </Field>
                    {errors.inquiryType && touched.inquiryType && (
                      <div className="text-red-500 text-xs">
                        {errors.inquiryType}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block font-medium mb-2"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-medium mb-2"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2" htmlFor="email">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" htmlFor="message">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows="4"
                      value={values.message}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-1/2 py-3 bg-customBlue text-white font-thin hover:bg-customBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="bg-customBlue border border-white p-10 max-w-lg mx-auto rounded-lg shadow-lg">
            <h3 className="text-4xl font-thin mb-8 text-white tracking-wide text-center">
              Contact Information
            </h3>
            <div className="space-y-8 text-white">
              <div>
                <h4 className="text-2xl font-thin mb-4 flex items-center">
                  <FaBuilding className="text-3xl mr-3 text-white" /> Head
                  Office
                </h4>
                <ul className="space-y-3">
                  <li className="text-lg">
                    ALVEO Corporate Center 728 28th Street, Bonifacio Global
                    City 1634 Taguig City, Metro Manila, Philippines
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-thin mb-4 flex items-center">
                  <FaPhoneAlt className="text-3xl mr-3 text-white" /> Phone
                </h4>
                <ul className="space-y-3">
                  <li className="text-lg">
                    Customer Hotline: (+632) 8848 5000
                  </li>
                </ul>
              </div>

              {/* Email Section */}
              <div>
                <h4 className="text-2xl font-thin mb-4 flex items-center">
                  <FaEnvelope className="text-3xl mr-3 text-white" /> Email
                </h4>
                <ul className="space-y-3">
                  <li className="text-lg">
                    Customer Care:{" "}
                    <a
                      href="mailto:info@alveoland.com.ph"
                      className="text-blue-300 hover:text-blue-500 font-medium"
                    >
                      info@alveoland.com.ph
                    </a>
                  </li>
                </ul>
              </div>

              {/* Appointment Section */}
              <div>
                <h4 className="text-2xl font-thin mb-4 flex items-center">
                  <FaCalendarAlt className="text-3xl mr-3 text-white" /> Set an
                  Appointment
                </h4>
                <p className="text-lg">
                  Avoid the queues, book a visit at our{" "}
                  <a
                    href="/pages/set-appointment"
                    className="text-blue-300 underline hover:text-blue-500 font-medium"
                  >
                    Alveo Property
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
