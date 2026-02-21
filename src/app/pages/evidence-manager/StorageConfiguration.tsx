import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Plus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { toast } from 'sonner';

interface Shelf {
  id: string;
  section: string;
  capacity: number;
  occupied: number;
  status: 'active' | 'inactive';
}

const mockShelves: Shelf[] = [
  { id: 'SHELF-A-12', section: 'Section A', capacity: 50, occupied: 12, status: 'active' },
  { id: 'SHELF-B-05', section: 'Section B', capacity: 50, occupied: 5, status: 'active' },
  { id: 'SHELF-C-08', section: 'Section C', capacity: 50, occupied: 8, status: 'active' },
  { id: 'SHELF-D-15', section: 'Section D', capacity: 50, occupied: 15, status: 'active' }
];

export default function StorageConfiguration() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShelf, setNewShelf] = useState({ section: '', capacity: 50 });

  const handleGenerateQR = (shelfId: string) => {
    toast.success(`QR code generated for ${shelfId}`);
  };

  const handlePrintQR = (shelfId: string) => {
    toast.success(`Printing QR code for ${shelfId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Storage Configuration</h2>
          <p className="text-gray-600 mt-1">Manage storage locations and QR codes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Shelf
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockShelves.map((shelf) => (
          <div key={shelf.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{shelf.id}</h3>
                <p className="text-sm text-gray-600">{shelf.section}</p>
              </div>
              <StatusBadge status={shelf.status} />
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <QRCodeSVG value={shelf.id} size={120} />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium text-gray-900">{shelf.capacity} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-medium text-gray-900">{shelf.occupied} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(shelf.occupied / shelf.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePrintQR(shelf.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => handleGenerateQR(shelf.id)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Regenerate
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Shelf">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Shelf added'); setShowAddModal(false); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
            <input
              type="text"
              required
              value={newShelf.section}
              onChange={(e) => setNewShelf({ ...newShelf, section: e.target.value })}
              placeholder="e.g., Section E"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
            <input
              type="number"
              required
              value={newShelf.capacity}
              onChange={(e) => setNewShelf({ ...newShelf, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Shelf
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
