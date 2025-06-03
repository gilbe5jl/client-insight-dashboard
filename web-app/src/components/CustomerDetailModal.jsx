import React, { useState, useEffect } from 'react';

export default function CustomerDetailModal({ customer, onClose }) {
  const [notes, setNotes] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!customer) return;
    // Fetch notes and purchases for selected customer
    fetch(`http://localhost:5001/api/customers/${customer.id}/notes`)
      .then(res => res.json())
      .then(data => setNotes(data));

    fetch(`http://localhost:5001/api/customers/${customer.id}/purchases`)
      .then(res => res.json())
      .then(data => setPurchases(data));
  }, [customer]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    fetch(`http://localhost:5001/api/customers/${customer.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: newNote })
    })
      .then(res => res.json())
      .then(data => {
        setNotes([...notes, data]);
        setNewNote('');
      });
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p><strong>ID:</strong> {customer.id}</p>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Region:</strong> {customer.region}</p>
            <p><strong>Status:</strong> {customer.status}</p>
            <p><strong>Revenue:</strong> ${customer.revenue.toLocaleString()}</p>
            <p><strong>Purchases:</strong> {customer.metrics?.purchases}</p>
            <p><strong>Avg Spend:</strong> ${customer.metrics?.avgSpend.toLocaleString()}</p>
            <p><strong>Satisfaction:</strong> {customer.metrics?.satisfactionScore}/5</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Interaction Notes</h3>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {notes.map((n, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  <p className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleString()}</p>
                  <p>{n.note}</p>
                </li>
              ))}
            </ul>
            <textarea
              rows={3}
              className="w-full border mt-2 p-1 text-sm rounded"
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button onClick={handleAddNote} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
              Add Note
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-sm mb-2">Purchase History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Amount</th>
                  <th className="px-2 py-1 border">Item</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 border">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-2 py-1 border">${p.amount.toFixed(2)}</td>
                    <td className="px-2 py-1 border">{p.item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}