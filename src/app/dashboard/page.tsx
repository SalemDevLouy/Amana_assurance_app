"use client";
import AdminOverview from '../components/dashboard/AdminOverview';
import Statistics from '../components/dashboard/Statistics';

const Dashboard: React.FC = () => {
return (
    <div className='w-full flex flex-col gap-6'>
      <div className="mb-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-3">
          Administration
        </div>
        <h1 className="text-2xl font-extrabold text-gray-500">
          Tableau de{' '}
          <span className="text-transparent bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text">bord</span>
        </h1>
      </div>
      <Statistics/>
      <AdminOverview/>
    </div>
  );
};

export default Dashboard;