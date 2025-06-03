//Main page after login: charts, filters, tables.
//Main layout after login; will contain MetricsPanel, ChartPanel, and CustomerList
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricsPanel from './MetricsPanel';
import ChartPanel from './ChartPanel';
// import CustomerCard from './CustomerCard';
import dummyData from '../data/dummyData';
import CustomerTable from './CutomerTable';
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
      <MetricsPanel />
      <ChartPanel />
      {/* <CustomerCard data={dummyData[0]} /> */}
        <CustomerTable data={dummyData} />
    </div>
  );
}