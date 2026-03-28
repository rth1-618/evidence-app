import React, { useState ,useRef} from 'react';
//import ReactToPrint from 'react-to-print';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Printer, Plus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
// 新增shelf的表單 Add new shelf form
//list all shelf in the Evidence Manager
export default function StorageConfiguration() {
    const {  user, isLoading: authLoading } = useAuth();
    const componentRef = useRef(null);
    //驗證身分 Verify user role
    console.log("Current User:", user); // Check if this is null
    console.log("Auth Loading:", authLoading);
      if (authLoading) {
        return <div>Loading...</div>;
      }
      if (!user || user.role !== 'EVIDENCE_MANAGER') {
        return <div>Unauthorized</div>;
      }
      else {
        //新增shelf: Add new shelf
        const [showAddModal, setShowAddModal] = useState(false);
        const [newShelf, setNewShelf] = useState({ shelfId: '', section: '', capacity: 0 ,status: 'active'});
        const handleAddShelf = async () => {
          try {
            const res = await api.post('/shelves/addshelf', newShelf );
            toast.success('Shelf added successfully');
            setShowAddModal(false);
            // After adding a new shelf, refetch the shelf list to show the updated data
            refetch();
          } catch (error) {
            toast.error('Failed to add shelf');
          }
        };
        // 從資料庫獲取shelf資料 Fetch shelf data from database
        const { data: shelfList = [], isLoading, refetch } = useQuery({
            queryKey: ['shelves', user?.id],
            queryFn: async () => {
              const res = await api.get('/shelves');
              console.log('res:', res);
              return res.data;
            },        
            enabled: !!user?.id
        });
      // 定義表格欄位 Define table columns
        const columns: Column<any>[] = [
          { key: 'shelfId', label: 'Shelf ID', sortable: true },
          { key: 'occupied', label: 'Occupied', sortable: true },
          { key: 'capacity', label: 'Capacity', sortable: true },
          {
              key: 'status',  
              label: 'Status',
              render: (item) => <StatusBadge status={item.status} />
          },
          {
              key: 'createdDate',
              label: 'Created',
              sortable: true,
              render: (item) => new Date(item.createdDate).toLocaleDateString()
          }
      ];
      const handleGenerateQR = (shelfId: string) => {
        toast.success(`QR code generated for ${shelfId}`);
      };

      const handlePrintQR = (shelfId: string) => {


        toast.success(`Printing QR code for ${shelfId}`);
      };
      //const [uploadstatus, setUploadstatus] = useState({shelfId: '',newStatus: ''});
      const changeShelfStatus = async (uploadstatus: { shelfId: string; newStatus: string }) => {
        try {
            const res = await api.post('/shelves/changeStatus', uploadstatus);
            toast.success('Shelf status changed successfully');
              // After changing shelf status, refetch the shelf list to show the updated data
              refetch();
          } catch (error) {
            console.error('Error changing shelf status:', error, uploadstatus);
            toast.error('Failed to change shelf status');
          }
        //toast.success(`Shelf ${uploadstatus.shelfId} status changed to ${uploadstatus.newStatus}`);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={componentRef}>
        {shelfList.map((shelf: any) => (
          <div key={shelf._id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{shelf.shelfId}</h3>
                <p className="text-sm text-gray-600">{shelf.section}</p>
              </div>
              <StatusBadge status={shelf.status} />
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <QRCodeSVG value={shelf._id} size={120} />
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
                onClick={() => {handlePrintQR(shelf._id); window.print();}}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => handleGenerateQR(shelf._id) }
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Regenerate
              </button>
            </div>
            <div className="space-y-2 mb-4 mt-4">
              <button
                onClick={() => {
                  changeShelfStatus({ shelfId: shelf.shelfId, newStatus: 'Deactivate' });
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm conditional-classname"  
              >
                Deactivate
              </button>
            </div>

          </div>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Shelf">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Shelf added'); setShowAddModal(false);handleAddShelf(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shelf ID *</label>
            <input
              type="text"
              required
              value={newShelf.shelfId}
              onChange={(e) => setNewShelf({ ...newShelf, shelfId: e.target.value })}
              placeholder="e.g., Shelf 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              value={newShelf.capacity ?? ""}
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
}  // 如果點擊行，顯示詳細視圖 If a row is clicked, show the detail view



