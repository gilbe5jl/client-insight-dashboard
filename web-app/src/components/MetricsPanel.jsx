import React, { useState, useEffect } from 'react';

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    monthly_revenue: 0,
    avg_spend: 0,
    satisfaction: 4.5, // Placeholder until backend supports it
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/metrics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch metrics');
        return res.json();
      })
      .then(data => {
        console.log("📊 Metrics Data:", data);
        setMetrics(prev => ({ ...prev, ...data }));
      })
      .catch(err => {
        console.error("❌ Error loading metrics:", err);
      });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Total Customers</h3>
        <p className="text-xl font-bold">{metrics.total_customers}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Monthly Revenue</h3>
        <p className="text-xl font-bold">${metrics.monthly_revenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Avg Spend</h3>
        <p className="text-xl font-bold">${metrics.avg_spend.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-sm text-gray-500">Satisfaction</h3>
        <p className="text-xl font-bold">{metrics.satisfaction} / 5</p>
      </div>
    </div>
  );
}