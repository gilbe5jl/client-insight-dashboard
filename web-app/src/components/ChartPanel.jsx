//Displays one or more charts (using Chart.js or Recharts)

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#8dd1e1'];

export default function ChartPanel() {
  const [revenueData, setRevenueData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    fetch('http://localhost:5001/api/sales_summary')
      .then(res => res.ok ? res.json() : [])
      .then(data => setRevenueData(data));

    fetch('http://localhost:5001/api/customers')
      .then(res => res.ok ? res.json() : [])
      .then(customers => {
        const regionCounts = customers.reduce((acc, c) => {
          acc[c.region] = (acc[c.region] || 0) + 1;
          return acc;
        }, {});
        const regionFormatted = Object.entries(regionCounts).map(([region, count]) => ({ name: region, value: count }));
        setRegionData(regionFormatted);
      });
  }, []);

  
return (
  <div className="bg-white bg-opacity-10 p-4 rounded-lg shadow-md hover:shadow-lg transition">
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="mb-2 text-sm text-white hover:text-yellow-300 hover:scale-105 focus:ring focus:outline-none transition duration-150 ease-in-out"
    >
      {collapsed ? 'Show▼' : 'Hide▲'}
    </button>

    {!collapsed && (
     <div
  className={`transition-opacity duration-500 ease-in-out ${
    collapsed ? 'opacity-0 invisible' : 'opacity-100 visible'
  }`}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Chart 1 */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={revenueData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Chart 2 */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Customers by Region</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={regionData} dataKey="value" nameKey="name" outerRadius={100} fill="#82ca9d" label>
            {regionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
    )}
  </div>
);
}