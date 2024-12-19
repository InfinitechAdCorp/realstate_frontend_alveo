import { useEffect, useState } from 'react'
  import 'simple-datatables/dist/style.css'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const Table = () => {
  const [appointments, setAppointments] = useState([])
  const [dataTable, setDataTable] = useState(null)
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

      if (dataTable) {
        dataTable.destroy()
      }

      const table = document.getElementById('search-table')
      if (table) {
        const newDataTable = new DataTable(table, {
          searchable: true,
          sortable: true,
          labels: {
            placeholder: 'Search appointments...',
            perPage: 'records per page'
          }
        })
        setDataTable(newDataTable)
      }
    }
  }, [appointments])

  const handleAccept = async (id) => {
    console.log(`Attempting to accept appointment with ID: ${id}`) // Debug log

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/appointment/accept/${id}`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update appointment status')
      }

      // Update the status in local state without re-fetching data
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === id
            ? { ...appointment, status: 'ACCEPTED' }
            : appointment
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDecline = async (id) => {
    console.log(`Attempting to decline appointment with ID: ${id}`) // Debug log

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/appointment/decline/${id}`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update appointment status')
      }

      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === id
            ? { ...appointment, status: 'DECLINED' }
            : appointment
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
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
                      onClick={() => handleAccept(appointment.id)}
                      className='px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600'
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDecline(appointment.id)}
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
