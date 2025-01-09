'use client'
import { useEffect, useState } from 'react'
  import 'simple-datatables/dist/style.css'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const Table = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'http://localhost:8000/api/admin/appointments'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    if (appointments.length > 0 && typeof window !== 'undefined') {
      const { DataTable } = require('simple-datatables')

      const table = document.getElementById('search-table')
      if (table) {
        new DataTable(table, {
          searchable: true,
          sortable: true,
          labels: {
            placeholder: 'Search appointments...',
            perPage: 'records per page'
          }
        })
      }
    }
  }, [appointments])

  const handleUpdateStatus = async (id, status) => {
    console.log('Updating status for ID:', id, 'with status:', status)

    try {
      const response = await fetch(
        'http://localhost:8000/api/admin/appointment/accept',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, status })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response from server:', errorData) // Log the response error data
        throw new Error(
          `Failed to update status: ${errorData.message || 'Unknown error'}`
        )
      }

      setAppointments(prev =>
        prev.map(appointment =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      )
    } catch (error) {
      console.error('Error updating status:', error.message) // Log the specific error message
      if (error.response) {
        console.error('Full error details:', error.response) // Log the full error details if available
      }
    }
  }

  return (
    <div className='w-full px-4'>
      <div className='overflow-x-auto'>
        <table
          id='search-table'
          className='table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-700'
        >
          <thead className='bg-gray-100'>
            <tr>
              <th className='border border-gray-300 px-4 py-2'>Full Name</th>
              <th className='border border-gray-300 px-4 py-2'>Email</th>
              <th className='border border-gray-300 px-4 py-2'>Phone Number</th>
              <th className='border border-gray-300 px-4 py-2'>
                Appointment For
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                Property/Unit
              </th>
              <th className='border border-gray-300 px-4 py-2'>Message</th>
              <th className='border border-gray-300 px-4 py-2'>Status</th>
              <th className='border border-gray-300 px-4 py-2'>Action</th>
            </tr>
          </thead>
  <tbody>
  {appointments.map(appointment => (
    <tr key={appointment.id} className='hover:bg-gray-50'>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.fullname}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.email}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.number}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.reason}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.property}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.message}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        {appointment.status}
      </td>
      <td className='border border-gray-300 px-4 py-2'>
        <div>
          <button
            onClick={() => {
              console.log(`Accepting appointment with ID: ${appointment.id}`);  // Log the ID
              handleAccept(appointment.id);  // Call the handleAccept function
            }}
            className='px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600'
          >
            <FaCheckCircle />
          </button>
          <button
            onClick={() => {
              console.log(`Declining appointment with ID: ${appointment.id}`);  // Log the ID
              handleDecline(appointment.id);  // Call the handleDecline function
            }}
            className='px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600'
          >
            <FaTimesCircle />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  )
}

export default Table
