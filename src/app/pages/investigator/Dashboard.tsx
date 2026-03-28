import React from 'react';
import { Folder, FlaskConical, AlertCircle, FileText } from 'lucide-react';
import { mockCases, mockEvidence, mockLabRequests } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InvestigatorDashboard() {
  const openCases = mockCases.filter(c => c.status === 'open').length;
  const closedCases = mockCases.filter(c => c.status === 'closed').length;
  const overdueLabReports = mockLabRequests.filter(r =>
    r.status === 'in-lab' && new Date(r.dueDate) < new Date()
  ).length;

  const stats = [
    {
      label: 'Open Cases',
      value: openCases,
      icon: <Folder className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Closed Cases',
      value: closedCases,
      icon: <FileText className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      label: 'Lab Requests',
      value: mockLabRequests.length,
      icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Overdue Reports',
      value: overdueLabReports,
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-red-50'
    }
  ];

  const caseTypeData = [
    { type: 'Burglary', count: 1 },
    { type: 'Theft', count: 1 },
    { type: 'Fraud', count: 1 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Investigator Dashboard</h2>
        <p className="text-gray-600 mt-1">Case management and evidence tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={caseTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Summary</h3>
          <div className="space-y-3">
            {mockEvidence.map((evidence) => (
              <div key={evidence.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{evidence.id}</div>
                  <div className="text-xs text-gray-600">{evidence.title}</div>
                </div>
                <StatusBadge color={evidence.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Lab Requests</h3>
        <div className="space-y-3">
          {mockLabRequests.map((request) => (
            <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">{request.id} - {request.requestType}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Evidence: {request.evidenceId} | Case: {request.caseId}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Due: {new Date(request.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge color={request.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
