// import { useEffect, useState } from 'react';
// import CustomerDetailModal from './CustomerDetailModal';

// export default function CustomerTable() {
//   const [customers, setCustomers] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:5001/api/customers')
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to load customers');
//         return res.json();
//       })
//       .then((data) => {
//         setCustomers(data);
//         setFiltered(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     const query = search.toLowerCase();
//     const results = customers.filter(c =>
//       c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
//     );
//     setFiltered(results);
//     setCurrentPage(1);
//   }, [search, customers]);

//   const sortedData = [...filtered].sort((a, b) => {
//     const { key, direction } = sortConfig;
//     if (!key) return 0;
//     const aValue = key === 'satisfaction' ? a.metrics?.satisfactionScore : a[key];
//     const bValue = key === 'satisfaction' ? b.metrics?.satisfactionScore : b[key];
//     if (aValue < bValue) return direction === 'asc' ? -1 : 1;
//     if (aValue > bValue) return direction === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const indexOfLast = currentPage * rowsPerPage;
//   const indexOfFirst = indexOfLast - rowsPerPage;
//   const currentData = sortedData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / rowsPerPage);

//   const handlePageChange = (direction) => {
//     setCurrentPage((prev) => {
//       if (direction === 'next') return Math.min(prev + 1, totalPages);
//       if (direction === 'prev') return Math.max(prev - 1, 1);
//       return prev;
//     });
//   };

//   const handleRowsChange = (e) => {
//     setRowsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   if (loading) return <p className="text-sm text-gray-500">Loading customers...</p>;
//   if (error) return <p className="text-sm text-red-600">Error: {error}</p>;

//   return (
    
//     <div className="space-y-4 relative">
//       <CustomerDetailModal
//         customer={selectedCustomer}
//         onClose={() => setSelectedCustomer(null)}
//       />

//       <div className="flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-1/2 p-2 border border-gray-300 rounded"
//         />
//         <select value={rowsPerPage} onChange={handleRowsChange} className="p-2 border border-gray-300 rounded">
//           {[5, 10, 25].map(num => (
//             <option key={num} value={num}>{num} per page</option>
//           ))}
//         </select>
//       </div>


//       <button
//         onClick={() => setShowModal(true)}
//         className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         + Add Customer
//       </button>


//       <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Region</th>
//               <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('revenue')}>
//                 Revenue {sortConfig.key === 'revenue' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
//               </th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Purchases</th>
//               <th className="px-4 py-2">Avg Spend</th>
//               <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('satisfaction')}>
//                 Satisfaction {sortConfig.key === 'satisfaction' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100 text-sm">
//             {currentData.map((c, i) => (
//               <tr
//                 key={i}
//                 onClick={() => setSelectedCustomer(c)}
//                 className="hover:bg-blue-50 cursor-pointer"
//               >
//                 <td className="px-4 py-2 font-mono text-xs">{c.id}</td>
//                 <td className="px-4 py-2">{c.name}</td>
//                 <td className="px-4 py-2">{c.region}</td>
//                 <td className="px-4 py-2">${c.revenue.toLocaleString()}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 text-xs rounded font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
//                     {c.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">{c.metrics?.purchases}</td>
//                 <td className="px-4 py-2">${c.metrics?.avgSpend.toLocaleString()}</td>
//                 <td className="px-4 py-2">{c.metrics?.satisfactionScore}/5</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center">
//         <button
//           onClick={() => handlePageChange('prev')}
//           disabled={currentPage === 1}
//           className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <p className="text-sm text-gray-600">
//           Page {currentPage} of {totalPages}
//         </p>
//         <button
//           onClick={() => handlePageChange('next')}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// {showModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//       <h2 className="text-lg font-bold mb-4">New Customer</h2>
//       <input type="text" placeholder="Name" className="w-full mb-2 p-2 border rounded"
//         value={name} onChange={e => setName(e.target.value)} />
//       <input type="text" placeholder="Region" className="w-full mb-2 p-2 border rounded"
//         value={region} onChange={e => setRegion(e.target.value)} />
//       <input type="number" placeholder="Revenue" className="w-full mb-2 p-2 border rounded"
//         value={revenue} onChange={e => setRevenue(e.target.value)} />
//       <select className="w-full mb-4 p-2 border rounded"
//         value={status} onChange={e => setStatus(e.target.value)}>
//         <option value="Active">Active</option>
//         <option value="Inactive">Inactive</option>
//       </select>
//       <div className="flex justify-end space-x-2">
//         <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//         <button onClick={handleAddCustomer} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
//       </div>
//     </div>
//   </div>
// )}

// const handleAddCustomer = () => {
//   fetch('http://localhost:5001/api/customers', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, region, revenue, status })
//   })
//     .then(res => res.json())
//     .then(() => {
//       setShowModal(false);
//       setName('');
//       setRegion('');
//       setRevenue('');
//       setStatus('Active');
//       // Reload customer list
//       return fetch('http://localhost:5001/api/customers');
//     })
//     .then(res => res.json())
//     .then(data => {
//       setCustomers(data);
//       setFiltered(data);
//     });
// };

import { useEffect, useState } from 'react';
import CustomerDetailModal from './CustomerDetailModal';

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Add customer modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [revenue, setRevenue] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    fetch('http://localhost:5001/api/customers')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to load customers'))
      .then(data => {
        setCustomers(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const results = customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.id.toString().includes(q)
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, customers]);

  const requestSort = (key) => {
    const dir = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction: dir });
  };

  const sortedData = [...filtered].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const aVal = key === 'satisfaction' ? a.metrics?.satisfactionScore : a[key];
    const bVal = key === 'satisfaction' ? b.metrics?.satisfactionScore : b[key];
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (direction === 'asc' ? 1 : -1);
  });

  const paginated = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleAddCustomer = () => {
    fetch('http://localhost:5001/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        region,
        revenue: revenue?.trim() ? parseFloat(revenue) : null,
        status
      })
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        setName('');
        setRegion('');
        setRevenue('');
        setStatus('Active');
        window.location.reload();
        // return fetch('http://localhost:5001/api/customers');
      })
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setFiltered(data);
      });
  };

  if (loading) return <p className="text-sm text-gray-500">Loading customers...</p>;
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
  <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Add Customer
      </button>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded"
        />
        <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))} className="p-2 border rounded">
          {[5, 10, 25].map(n => <option key={n} value={n}>{n} per page</option>)}
        </select>
      </div>

      {/* <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Add Customer
      </button> */}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">New Customer</h2>
            <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="w-full mb-2 p-2 border rounded" placeholder="Region" value={region} onChange={e => setRegion(e.target.value)} />
            <input type="number" className="w-full mb-2 p-2 border rounded" placeholder="Revenue" value={revenue} onChange={e => setRevenue(e.target.value)} />
            <select className="w-full mb-4 p-2 border rounded" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleAddCustomer}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('revenue')}>Revenue</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Purchases</th>
              <th className="px-4 py-2">Avg Spend</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('satisfaction')}>Satisfaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {paginated.map((c, i) => (
              <tr key={i} onClick={() => setSelectedCustomer(c)} className="hover:bg-blue-50 cursor-pointer">
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
                <td className="px-4 py-2">${c.metrics?.avgSpend?.toLocaleString()}</td>
                <td className="px-4 py-2">{c.metrics?.satisfactionScore}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
        <p className="text-sm text-gray-600">Page {currentPage} of {Math.ceil(filtered.length / rowsPerPage)}</p>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === Math.ceil(filtered.length / rowsPerPage)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}