import DashboardLayout from '../layouts/DashboardLayout';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Problems', value: '12', icon: <FileText className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Published', value: '8', icon: <CheckCircle className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'Under Review', value: '3', icon: <Clock className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Needs Changes', value: '1', icon: <AlertTriangle className="text-red-500" />, bg: 'bg-red-50' },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-sm text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          No recent activity. Click "Create Problem" to get started.
        </div>
      </div>
    </DashboardLayout>
  );
}
