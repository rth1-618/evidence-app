import React, { use, useEffect, useState } from 'react';
// import { mockSystemUsers } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Check, Plus, Power } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '../../hooks/useUsers';
import { IUser } from '../../interfaces/IUser';
import api from '../../api/axios';

export default function Users() {
  const { users, isLoading, createUser, toggleStatus } = useUsers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' as any, badge: '', password: '' } as IUser);
  const [badgeError, setBadgeError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Auto-check as the user types
  useEffect(() => {
    const validateBadge = async () => {
      if ((newUser?.badge as string).length < 3) {
        setBadgeError('');
        return;
      }

      setIsValidating(true);
      try {
        const res = await api.get(`/users/check-badge?badge=${newUser.badge}`);
        if (!res.data.isAvailable) {
          setBadgeError(res.data.message);
        } else {
          setBadgeError('');
        }
      } catch (err) {
        console.error("Validation failed");
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateBadge, 500); // Debounce 500ms
    return () => clearTimeout(timeoutId);
  }, [newUser.badge]);


  const userColumns: Column<IUser>[] = [
    { key: 'badge', label: 'Badge', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge color={item.status as any} />
    },
    {
      key: 'createdAt', //need to match response keys from backend
      label: 'Created',
      sortable: true,
      render: (item) => new Date(item.createdAt as any).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        item.role !== 'EVIDENCE_MANAGER' ? (
          <button
            // onclick show confirm dialog to confirm status change, then call handleToggleStatus if confirmed
            onClick={() => {
              if (window.confirm(`Are you sure you want to ${item.status === 'active' ? 'deactivate' : 'activate'} user ${item.name}?`)) {
                const newStatus = item.status === 'active' ? 'inactive' : 'active';
                // Call the mutation from the hook
                toggleStatus({ id: item._id!, status: newStatus });
              }
            }}
            className={`flex items-center gap-1 px-3 py-1  rounded-lg  ${item.status === 'active' ? "bg-red-200 text-red-700 hover:bg-red-300" : "bg-green-200 text-green-700 hover:bg-green-300"} `}>
            <Power className="w-4 h-4" />
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        ) : null
      )
    }
  ];

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Submitting Payload:", newUser);
    createUser(newUser, {
      onSuccess: () => {
        toast.success('User created successfully');
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', role: '' as any, badge: '', password: '' });
      },
      onError: (err: any) => toast.error(err.response?.data?.message || 'Error')
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-3xl font-semibold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-3xl font-semibold text-green-600">
            {users.filter((u: IUser) => u.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Inactive</div>
          <div className="text-3xl font-semibold text-gray-600">
            {users.filter((u: IUser) => u.status === 'inactive').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Field Officers</div>
          <div className="text-3xl font-semibold text-blue-600">
            {users.filter((u: IUser) => u.role === 'FIELD_OFFICER').length}
          </div>
        </div>
      </div>

      <DataTable
        data={users}
        columns={userColumns}
        searchPlaceholder="Search users..."
      />

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateUser(e); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              name="role"
              required
              value={newUser.role}
              onChange={(e) => {
                const nextRole = e.target.value as IUser['role'];
                setNewUser(prev => ({ ...prev, role: nextRole }))
                // console.log({ ...newUser });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select role...</option>
              <option value="FIELD_OFFICER">Field Officer</option>
              <option value="CUSTODIAN">Custodian</option>
              <option value="INVESTIGATOR">Investigator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Number *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={newUser.badge}
                onChange={(e) => setNewUser({ ...newUser, badge: e.target.value.toUpperCase() })}
                placeholder="e.g., FO-1234"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${badgeError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
              />
              {isValidating && (
                <div className="absolute right-3 top-2.5">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}{
                !isValidating && !badgeError && newUser.badge && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-5 h-5 text-green-600 "><Check /></div>
                  </div>
                )
              }
            </div>
            {badgeError && <p className="text-red-500 text-xs mt-1 font-bold">{badgeError}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!badgeError || isValidating || !newUser.badge}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
