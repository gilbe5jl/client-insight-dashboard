export default function CustomerCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-xs text-gray-500">Customer ID</p>
          <p className="font-mono text-sm">{data.id}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${data.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
          {data.status}
        </span>
      </div>

      <p className="text-sm font-semibold mb-1">{data.name}</p>
      <p className="text-xs text-gray-500 mb-1">Industry: {data.industry}</p>
      <p className="text-xs text-gray-500 mb-1">Region: {data.region}</p>
      <p className="text-xs text-gray-500 mb-1">Joined: {data.joined}</p>
      <p className="text-xs text-gray-500 mb-4">Last Activity: {new Date(data.lastActivity).toLocaleString()}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Revenue</p>
          <p className="font-semibold">${data.revenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Purchases</p>
          <p className="font-semibold">{data.metrics.purchases}</p>
        </div>
        <div>
          <p className="text-gray-600">Avg. Spend</p>
          <p className="font-semibold">${data.metrics.avgSpend.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Satisfaction</p>
          <p className="font-semibold">{data.metrics.satisfactionScore}/5</p>
        </div>
      </div>
    </div>
  );
}