import React from 'react';
import { Table } from '@shadcn/ui'; // Assuming this is the correct import for ShadCN UI Table

const Appointments = () => {
  // Sample data for the table
  const data = [
    { id: 1, name: 'John Doe', date: '2024-12-18', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, name: 'Jane Smith', date: '2024-12-19', time: '02:00 PM', status: 'Pending' },
    { id: 3, name: 'Alice Johnson', date: '2024-12-20', time: '11:30 AM', status: 'Canceled' },
  ];

  // Columns for the data table
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <div>
      <h1>Appointments</h1>
      <Table data={data} columns={columns} />
    </div>
  );
};

export default Appointments;
