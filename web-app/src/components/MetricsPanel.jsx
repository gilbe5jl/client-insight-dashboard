//KPI cards showing total revenue, customer count, etc.

export default function MetricsPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Total Customers</h3>
        <p className="text-xl font-bold">128</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Monthly Revenue</h3>
        <p className="text-xl font-bold">$240K</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Avg Spend</h3>
        <p className="text-xl font-bold">$1.9K</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Satisfaction</h3>
        <p className="text-xl font-bold">4.5 / 5</p>
      </div>
    </div>
  );
}