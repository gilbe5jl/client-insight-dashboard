import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricsPanel from './MetricsPanel';
import ChartPanel from './ChartPanel';
// import CustomerCard from './CustomerCard';
import CustomerTable from './CutomerTable';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-no-repeat p-4 space-y-6"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
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
      <CustomerTable />
    </div>
  );
}