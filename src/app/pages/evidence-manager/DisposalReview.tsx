import React, { useState } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface EligibleEvidence {
  id: string;
  title: string;
  caseId: string;
  retentionExpiry: string;
  status: 'active';
}

const mockEligibleEvidence: EligibleEvidence[] = [];

export default function DisposalReview() {
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSelectAll = () => {
    if (selectedEvidence.length === mockEligibleEvidence.length) {
      setSelectedEvidence([]);
    } else {
      setSelectedEvidence(mockEligibleEvidence.map(e => e.id));
    }
  };

  const handleApproveDisposal = () => {
    toast.success(`${selectedEvidence.length} item(s) approved for disposal`);
    setSelectedEvidence([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Disposal Review</h2>
        <p className="text-gray-600 mt-1">Review and approve evidence eligible for disposal</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 font-medium mb-1">Disposal Warning</p>
            <p className="text-sm text-red-700">
              Disposal is permanent and cannot be undone. Ensure all legal requirements are met before approving disposal.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Eligible for Disposal</div>
          <div className="text-3xl font-semibold text-gray-900">{mockEligibleEvidence.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
          <div className="text-3xl font-semibold text-yellow-600">0</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Disposed This Year</div>
          <div className="text-3xl font-semibold text-gray-600">0</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {mockEligibleEvidence.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedEvidence.length === mockEligibleEvidence.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  {selectedEvidence.length} of {mockEligibleEvidence.length} selected
                </span>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={selectedEvidence.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve Disposal
              </button>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedEvidence.length === mockEligibleEvidence.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Evidence ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Case</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Retention Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockEligibleEvidence.map((evidence) => (
                  <tr key={evidence.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEvidence.includes(evidence.id)}
                        onChange={() => {
                          if (selectedEvidence.includes(evidence.id)) {
                            setSelectedEvidence(selectedEvidence.filter(id => id !== evidence.id));
                          } else {
                            setSelectedEvidence([...selectedEvidence, evidence.id]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evidence.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evidence.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{evidence.caseId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(evidence.retentionExpiry).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge color={evidence.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No Evidence Eligible for Disposal</p>
            <p className="text-sm text-gray-500">
              Evidence will appear here when retention periods expire
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleApproveDisposal}
        title="Confirm Disposal"
        message={`Are you sure you want to approve disposal of ${selectedEvidence.length} evidence item(s)? This action cannot be undone.`}
        confirmText="Approve Disposal"
        isDestructive
      />
    </div>
  );
}
