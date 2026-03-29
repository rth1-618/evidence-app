import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { Printer, Plus, ShieldCheck } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { PrintSticker } from '../../components/core/PrintSticker';

export default function StorageConfiguration() {
  const { user, isLoading: authLoading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShelf, setNewShelf] = useState({ shelfId: '', section: '', capacity: 0, status: 'active' });

  // State to track which shelf is currently being printed
  const [printingShelf, setPrintingShelf] = useState<any>(null);

  // Verify user role
  if (authLoading) return <div className="p-8 text-center">Loading Auth...</div>;
  if (!user || user.role !== 'EVIDENCE_MANAGER') return <div className="p-8 text-center">Unauthorized</div>;

  // Fetch shelf data
  const { data: shelfList = [], isLoading, refetch } = useQuery({
    queryKey: ['shelves', user?.id],
    queryFn: async () => {
      const res = await api.get('/shelves');
      return res.data;
    },
    enabled: !!user?.id
  });

  const handleAddShelf = async () => {
    try {
      await api.post('/shelves/addshelf', newShelf);
      toast.success('Shelf added successfully');
      setShowAddModal(false);
      setNewShelf({ shelfId: '', section: '', capacity: 0, status: 'active' });
      refetch();
    } catch (error) {
      toast.error('Failed to add shelf');
    }
  };

  const changeShelfStatus = async (shelfId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.post('/shelves/changeStatus', { shelfId, newStatus });
      toast.success(`Shelf ${shelfId} is now ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const handlePrint = (shelf: any) => {
    setPrintingShelf(shelf);
    // Timeout allows the hidden print-sticker to render before the dialog opens
    setTimeout(() => {
      window.print();
      setPrintingShelf(null);
    }, 250);
  };

  return (
    <>
      <div className="space-y-6">
        {/* AWESOME PRINT STYLES */}


        {/* Page Header */}
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Storage Configuration</h2>
            <p className="text-gray-600 mt-1">Manage storage locations and generate tracking tags</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Shelf
          </button>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          {shelfList.map((shelf: any) => {
            const occupancyPercentage = Math.min((shelf.occupied / shelf.capacity) * 100, 100);
            const getBarColor = (percent: number) => {
              if (percent >= 90) return 'bg-red-500';
              if (percent >= 70) return 'bg-orange-500';
              if (percent >= 50) return 'bg-yellow-500';
              return 'bg-blue-600'; // Default blue for 0-49%
            };

            const barColor = getBarColor(occupancyPercentage);
            return (
              <div key={shelf._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{shelf.shelfId}</h3>
                    <p className="text-sm text-gray-600">{shelf.section}</p>
                  </div>
                  <StatusBadge color={shelf.status === 'active' ? 'completed' : 'pending'} status={shelf.status} />
                </div>

                <div className="flex justify-center mb-4 bg-gray-50 p-4 rounded-lg">
                  <QRCodeSVG value={shelf._id} size={120} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Occupied:</span>
                  <span className="font-medium text-gray-900">{shelf.occupied} items</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium text-gray-900">{shelf.capacity} items</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${barColor} h-2 rounded-full transition-all`}
                      style={{ width: `${occupancyPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrint(shelf)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Printer className="w-4 h-4" /> Print Tag
                    </button>

                    <button
                      onClick={() => changeShelfStatus(shelf.shelfId, shelf.status)}
                      className={`flex-1 py-2 rounded-lg text-white text-sm transition-colors ${shelf.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      {shelf.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* HIDDEN PRINT STICKER - Matches Evidence Bag Style */}
        {printingShelf && (
          <PrintSticker
            type="STORAGE"
            qrValue={printingShelf._id}
            idDisplay={printingShelf.shelfId}
            title={printingShelf.section}
            secondaryId={printingShelf.capacity.toString()}
            status={printingShelf.status}
          />
        )}

        {/* Add Shelf Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Shelf">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddShelf(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shelf ID*</label>
              <input
                type="text" required value={newShelf.shelfId}
                onChange={(e) => setNewShelf({ ...newShelf, shelfId: e.target.value })}
                placeholder="e.g., Shelf-01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section*</label>
              <input
                type="text" required value={newShelf.section}
                onChange={(e) => setNewShelf({ ...newShelf, section: e.target.value })}
                placeholder="e.g., Cold Storage A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity*</label>
              <input
                type="number" required value={newShelf.capacity || ''}
                onChange={(e) => setNewShelf({ ...newShelf, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Shelf</button>
            </div>
          </form>
        </Modal>
      </div>

    </>
  );
}
