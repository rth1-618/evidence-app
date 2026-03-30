import React from 'react';

interface StatusBadgeProps {
  color: 'active' | 'pending' | 'completed' | 'overdue' | 'open' | 'closed' | 'in-lab' | 'disposed' | 'approved' | 'in-transit' | 'inactive' | 'returned';
  size?: 'sm' | 'md';
  status?: string;
}

export function StatusBadge({ color, status = color.toString(), size = 'sm' }: StatusBadgeProps) {
  // if (!status) status = color;
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
    open: 'bg-blue-100 text-blue-800 border-blue-200',
    'in-lab': 'bg-purple-100 text-purple-800 border-purple-200',
    disposed: 'bg-gray-100 text-gray-800 border-gray-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    'in-transit': 'bg-orange-100 text-orange-800 border-orange-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    returned: 'bg-teal-100 text-teal-800 border-teal-200'
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded border ${colors[color]} ${sizeClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}
