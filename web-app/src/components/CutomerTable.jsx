import dummyData from '../data/dummyData';

export default function CustomerTable() {
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
          {dummyData.map((customer, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-xs">{customer.id}</td>
              <td className="px-4 py-2">{customer.name}</td>
              <td className="px-4 py-2">{customer.region}</td>
              <td className="px-4 py-2">${customer.revenue.toLocaleString()}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs rounded font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {customer.status}
                </span>
              </td>
              <td className="px-4 py-2">{customer.metrics.purchases}</td>
              <td className="px-4 py-2">${customer.metrics.avgSpend.toLocaleString()}</td>
              <td className="px-4 py-2">{customer.metrics.satisfactionScore}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}