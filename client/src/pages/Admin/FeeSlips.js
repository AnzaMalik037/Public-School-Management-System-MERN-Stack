// client/src/pages/Admin/FeeSlips.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4caf50', '#f44336']; // Green for paid, red for unpaid

const FeeSlips = () => {
  const [slips, setSlips] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slipRes, studentRes] = await Promise.all([
          axios.get('/api/upload/fee-slips'),
          axios.get('/api/students'),
        ]);

        setSlips(slipRes.data);
        setTotalStudents(studentRes.data.length);
      } catch (err) {
        console.error('Error fetching fee slips or students:', err);
      }
    };

    fetchData();
  }, []);

  const paid = slips.length;
  const unpaid = totalStudents - paid;

  const chartData = [
    { name: 'Paid', value: paid },
    { name: 'Unpaid', value: unpaid < 0 ? 0 : unpaid },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {totalStudents > 0 && (
        <div style={{ height: 300, marginBottom: '2rem' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {slips.length === 0 ? (
        <p>No slips uploaded yet.</p>
      ) : (
        <ul>
          {slips.map((slip, index) => (
            <li key={index}>
              <a
                href={`${process.env.REACT_APP_API_URL}/fee-slips/${slip.url.split('/').pop()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {slip.url.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeeSlips;
