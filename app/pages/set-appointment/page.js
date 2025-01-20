"use client";
import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../header";
import Footer from "../footer";
import SEO from "../../seo/page";
import { showToast } from "@/components/alert/page";
import Icon from "@/app/pages/socialmedia-icons/page";
const SetAppointment = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formatted = newDate.toLocaleDateString();
    setFormattedDate(formatted);
  };
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning");
  };
  const handleTimeSelection = (selectedTime) => {
    setTime(selectedTime);
  };

  const updateDateTime = (selectedDate, selectedTime) => {
    if (selectedDate && selectedTime) {
      return `${selectedDate} ${selectedTime}`;
    }
    return "";
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const appointmentData = new FormData();
    appointmentData.append("fullname", values.fullname);
    appointmentData.append("email", values.email);
    appointmentData.append("number", values.number);
    appointmentData.append("reason", values.reason);
    appointmentData.append("property", values.property);
    appointmentData.append("message", values.message);
    appointmentData.append("datetime", updateDateTime(formattedDate, time));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/set-appointment`,
        {
          method: "POST",
          body: appointmentData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        handleShowSuccessToast("Appointment scheduled successfully!");
        setMessageType("success");
        console.log(data);
      } else {
        setErrors({ submit: "Failed to schedule the appointment." });
        handleShowErrorToast(
          "Failed to schedule the appointment. Please try again."
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setErrors({
        submit: "An error occurred while scheduling the appointment.",
      });
      setMessage(
        "An error occurred while scheduling the appointment. Please try again."
      );
      setMessageType("error");
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    number: Yup.string()
      .matches(
        /^[0-9]{10,13}$/,
        "Phone number must be between 10 and 13 digits"
      )

      .required("Phone number is required"),
    reason: Yup.string().required("Please select a reason for the appointment"),
    property: Yup.string().required("Please provide property/unit information"),
    message: Yup.string().required("Message is required"),
  });

  return (
    <div className="">
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter."
        keywords="alveo, real estate, location, property, building location, property location"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/locations"
      />

      <div className="mb-16">
        <Header /> <Icon />
      </div>

      <div className="text-center mb-2 mt-20">
        <h1
          className="mt-12 mb-5 font-semibold text-2xl text-customBlue 
    border-t-2 w-fit mx-auto border-customBlue whitespace-nowrap 
    sm:text-4xl md:text-5xl lg:text-3xl sm:mt-16 lg:mt-24"
        >
          SCHEDULE YOUR APPOINTMENT
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row mt-4 justify-center items-center w-screen">
        <div className="flex flex-col lg:flex-row w-full gap-4 p-5 justify-center items-center">
          {/* Appointment Form */}
          <div className="w-full lg:max-w-lg bg-white border border-customBlue  p-4 shadow-lg lg:h-[625px] mt-5 md:w-[550px] lg:w-full">
            <p className="text-sm font-semibold text-gray-700 mt-2 mb-4">
              Select a date and time for your appointment, and fill out the form
              below.
            </p>

            <p className="text-sm font-medium text-gray-700 flex justify-center">
              Time and Date:{" "}
              <span className="text-red-900">
                {time
                  ? `${formattedDate} - ${time}`
                  : "No date and time selected"}
              </span>
            </p>

            <div className="px-2 p-2 items-center">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "08:00 AM",
                  "09:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "01:00 PM",
                  "02:00 PM",
                  "03:00 PM",
                  "04:00 PM",
                  "05:00 PM",
                  "06:00 PM",
                ].map((timeSlot) => (
                  <button
                    key={timeSlot}
                    onClick={() => handleTimeSelection(timeSlot)}
                    className={`px-2 py-1 text-xs m-1 border rounded-lg ${
                      time === timeSlot
                        ? "bg-customBlue text-white"
                        : "bg-white text-gray-700 border-customBlue hover:bg-blue-100"
                    }`}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="border border-customBlue rounded-lg shadow-lg w-full p-4 h-auto text-black"
              />
            </div>
          </div>
          <div className="bg-white p-6 border border-customBlue shadow-md w-full sm:w-4/5 md:w-3/4 lg:w-1/2 mt-4">
            <h2 className="text-xl font-semibold text-customBlue mb-4">
              Appointment Details
            </h2>
            {message && (
              <div
                className={`p-4 mt-4 text-white text-center ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                number: "",
                reason: "",
                property: "",
                message: "",
                datetime: updateDateTime(formattedDate, time),
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
                touched,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {errors.submit && (
                    <p className="text-red-500 mb-4">{errors.submit}</p>
                  )}
                  {/* Date and Time */}
                  <div className="mb-4">
                    <label
                      htmlFor="datetime"
                      className="block text-sm font-medium text-customBlue"
                    >
                      Selected Date and Time
                    </label>
                    <input
                      type="text"
                      id="datetime"
                      name="datetime"
                      value={updateDateTime(formattedDate, time)}
                      readOnly
                      className="w-full p-2 border border-customBlue "
                    />
                  </div>
                  {/* Full Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium text-customBlue"
                    >
                      Full Name
                    </label>
                    <Field
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={values.fullname}
                      onChange={handleChange}
                      className="w-full p-2 border border-customBlue  mt-2"
                      placeholder="e.g. Juan Dela Cruz"
                    />
                    {touched.fullname && errors.fullname && (
                      <div className="text-red-500 text-sm">
                        {errors.fullname}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-customBlue"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-customBlue "
                        placeholder="e.g. juandelacruz@gmail.com"
                      />
                      {touched.email && errors.email && (
                        <div className="text-red-500 text-sm">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-customBlue"
                      >
                        Number
                      </label>
                      <Field
                        type="tel"
                        id="number"
                        name="number"
                        value={values.number}
                        onChange={handleChange}
                        className="w-full p-2 border border-customBlue "
                        placeholder="e.g. +63 992 440 1097"
                      />
                      {touched.number && errors.number && (
                        <div className="text-red-500 text-sm">
                          {errors.number}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-customBlue"
                      >
                        Appointment For
                      </label>
                      <Field
                        as="select"
                        id="reason"
                        name="reason"
                        className="w-full p-2 border border-customBlue "
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Property Viewing">
                          Property Viewing
                        </option>
                        <option value="Online Meeting">Online Meeting</option>
                      </Field>
                      {touched.reason && errors.reason && (
                        <div className="text-red-500 text-sm">
                          {errors.reason}
                        </div>
                      )}
                    </div>

                    {/* Property/Unit */}
                    <div>
                      <label
                        htmlFor="property"
                        className="block text-sm font-medium text-customBlue"
                      >
                        Property/Unit
                      </label>
                      <Field
                        type="text"
                        id="property"
                        name="property"
                        value={values.property}
                        onChange={handleChange}
                        className="w-full p-2 border border-customBlue "
                        placeholder="e.g. Unit 205"
                      />
                      {touched.property && errors.property && (
                        <div className="text-red-500 text-sm">
                          {errors.property}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Message */}
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-customBlue"
                    >
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      className="w-full p-2 border border-customBlue "
                      rows="4"
                      placeholder="Additional details..."
                    />
                    {touched.message && errors.message && (
                      <div className="text-red-500 text-sm">
                        {errors.message}
                      </div>
                    )}
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 py-2 bg-customBlue text-white  mt-4 "
                  >
                    {isSubmitting ? "Submitting..." : "Submit Schedule"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          {/* Calendar */}
        </div>
      </div>
      <div className="mt-14">
        <Footer />
      </div>
    </div>
  );
};

export default SetAppointment;
