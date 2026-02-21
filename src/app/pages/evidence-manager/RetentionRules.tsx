import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

interface RetentionRule {
  category: string;
  years: number;
  affectedItems: number;
}

const mockRetentionRules: RetentionRule[] = [
  { category: 'Physical Evidence', years: 10, affectedItems: 2 },
  { category: 'Digital Evidence', years: 7, affectedItems: 0 },
  { category: 'Video Evidence', years: 5, affectedItems: 1 },
  { category: 'Audio Evidence', years: 5, affectedItems: 0 },
  { category: 'Documentary Evidence', years: 15, affectedItems: 0 }
];

export default function RetentionRules() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RetentionRule | null>(null);

  const handleEdit = (rule: RetentionRule) => {
    setEditingRule(rule);
    setShowEditModal(true);
  };

  const handleSave = () => {
    toast.success('Retention rule updated');
    setShowEditModal(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Retention Rules</h2>
        <p className="text-gray-600 mt-1">Configure evidence retention periods by category</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Warning:</strong> Changing retention rules will affect disposal eligibility. Ensure compliance with legal requirements before modification.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Retention Period</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Affected Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockRetentionRules.map((rule) => (
              <tr key={rule.category} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{rule.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{rule.years} years</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rule.affectedItems} items</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Retention Rule"
      >
        {editingRule && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={editingRule.category}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (Years) *</label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={editingRule.years}
                onChange={(e) => setEditingRule({ ...editingRule, years: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                This change will affect <strong>{editingRule.affectedItems} item(s)</strong> currently in the system.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
