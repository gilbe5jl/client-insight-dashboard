import { useEffect, useState } from 'react';

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/customers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load customers');
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading customers...</p>;
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Region</th>
            <th className="px-4 py-2">Revenue</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Purchases</th>
            <th className="px-4 py-2">Avg Spend</th>
            <th className="px-4 py-2">Satisfaction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {customers.map((c, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-xs">{c.id}</td>
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.region}</td>
              <td className="px-4 py-2">${c.revenue.toLocaleString()}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs rounded font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-2">{c.metrics?.purchases}</td>
              <td className="px-4 py-2">${c.metrics?.avgSpend.toLocaleString()}</td>
              <td className="px-4 py-2">{c.metrics?.satisfactionScore}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}