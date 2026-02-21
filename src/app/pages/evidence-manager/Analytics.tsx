import React from 'react';
import { mockCases, mockEvidence } from '../../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export default function Analytics() {
  const casesByMonth = [
    { month: 'Jan', cases: 5 },
    { month: 'Feb', cases: 3 }
  ];

  const evidenceByCategory = [
    { name: 'Physical', value: 2, color: '#3B82F6' },
    { name: 'Video', value: 1, color: '#8B5CF6' },
    { name: 'Digital', value: 0, color: '#10B981' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">System performance and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={casesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={evidenceByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {evidenceByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-semibold text-gray-900">{mockCases.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Cases</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-semibold text-gray-900">{mockEvidence.length}</div>
            <div className="text-sm text-gray-600 mt-1">Evidence Items</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-semibold text-gray-900">
              {((mockCases.filter(c => c.status === 'closed').length / mockCases.length) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Resolution Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-semibold text-gray-900">100%</div>
            <div className="text-sm text-gray-600 mt-1">Chain Integrity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
