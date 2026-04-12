import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import api from '../../api/axios';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Plus, Search, X, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

export default function Cases() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { caseList, addCase, caseCategoryList } = useCases();

  const [showAddModal, setShowAddModal] = useState(false);
  const [officerSearch, setOfficerSearch] = useState('');
  const [selectedOfficers, setSelectedOfficers] = useState<any[]>([]);
  const [newCase, setNewCase] = useState({ caseId: '', title: '', types: '', status: 'active' });


  const { officerResults: searchedOfficers, isSearching } = useUsers(officerSearch);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCase({
        ...newCase,
        investigatorId: user?.id, assignedOfficers: selectedOfficers.map(o => o._id)
      });
      toast.success('Case added successfully');
      resetAddForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create case');
    }
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setNewCase({ caseId: '', title: '', types: '', status: 'active' });
    setOfficerSearch('');
    setSelectedOfficers([]);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'overdue';
      case 'medium': return 'pending';
      case 'low': return 'returned';
      default: return 'inactive';
    }
  };


  const caseColumns: Column<any>[] = [
    { key: 'caseId', label: 'Case ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'types', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge color={item.status} />, sortable: true },
    { key: 'priority', label: 'Priority', render: (item) => <StatusBadge color={getPriorityColor(item.priority)} status={item.priority} />, sortable: true },
    { key: 'createdAt', label: 'Created', render: (item) => new Date(item.createdAt).toLocaleDateString(), sortable: true }
  ];

  const generateCaseId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `C-${year}-${random}`;
  };

  useEffect(() => {
    if (showAddModal) {
      setNewCase(prev => ({ ...prev, caseId: generateCaseId() }));
    }
  }, [showAddModal]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Cases</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all">
          <Plus size={20} /> Add Case
        </button>
      </div>

      <DataTable
        data={caseList}
        columns={caseColumns}
        onRowClick={(row) => navigate(`/investigator/cases/${row._id}`)}
        searchPlaceholder="Search cases by ID or title..."
      />

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Case">
        {/* Added pb-32 to the form to ensure space for the floating dropdown */}
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case ID (Auto)</label>
              <input
                disabled
                value={newCase.caseId}
                className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              {/* 2. TYPES DROPDOWN */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
              <select
                required
                value={newCase.types}
                onChange={e => setNewCase({ ...newCase, types: e.target.value })}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select a type...</option>
                {caseCategoryList.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              required
              value={newCase.title}
              onChange={e => setNewCase({ ...newCase, title: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Main St Store Robbery"
            />
          </div>

          {/* BEAUTIFIED OFFICER DROPDOWN */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Field Officers</label>
            <div className="relative group">
              <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                value={officerSearch}
                onChange={e => setOfficerSearch(e.target.value)}
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search by Badge (e.g. FO-001)..."
              />
              {isSearching && <Loader2 className="absolute right-3 top-3 animate-spin text-blue-500" size={18} />}
            </div>

            {/* 3. FLOATING DROPDOWN FIX */}
            {searchedOfficers.length > 0 && (
              <div className="absolute z-[999] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {searchedOfficers.map((off: any) => (
                  <button
                    key={off._id}
                    type="button"
                    onClick={() => {
                      if (!selectedOfficers.find(o => o._id === off._id)) setSelectedOfficers([...selectedOfficers, off]);
                      setOfficerSearch('');
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-blue-50 transition-colors border-b last:border-0 border-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        {off.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{off.name}</p>
                        <p className="text-[10px] text-gray-500">{off.email}</p>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-2 py-1 rounded-md border border-gray-200">
                      {off.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedOfficers.map(off => (
                <span key={off._id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  <ShieldCheck size={14} className="text-blue-500" />
                  {off.name}
                  <X size={14} className="ml-1 cursor-pointer hover:text-red-500" onClick={() => setSelectedOfficers(selectedOfficers.filter(o => o._id !== off._id))} />
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom of form logic */}
          <div className="flex gap-3 pt-6">
            <button type="button" onClick={() => resetAddForm()} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg">Create Case</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
