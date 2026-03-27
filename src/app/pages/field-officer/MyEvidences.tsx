import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { FileSearch, ArrowLeft } from 'lucide-react';
import EvidenceDetail from './EvidenceDetail'; // We'll create this next


export default function MyEvidences() {
    const { user, isLoading: authLoading } = useAuth();
    const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
    console.log("Current User:", user); // Check if this is null
    console.log("Auth Loading:", authLoading);

    // 1. Fetch evidence from your MERN backend
    const { data: evidenceList = [], isLoading } = useQuery({
        queryKey: ['my-evidence', user?.id],
        queryFn: async () => {
            const res = await api.get('/evidence/my-submissions');
            console.log('res:', res);

            return res.data.data;
        },
        enabled: !!user?.id
    });

    // 2. Define Table Columns
    const columns: Column<any>[] = [
        { key: 'evidenceId', label: 'Evidence ID', sortable: true },
        { key: 'title', label: 'Title', sortable: true },
        { key: 'caseId', label: 'Case ID', sortable: true },
        {
            key: 'status',
            label: 'Status',
            render: (item) => <StatusBadge status={item.status} />
        },
        {
            key: 'submittedDate',
            label: 'Submitted',
            sortable: true,
            render: (item) => new Date(item.submittedDate).toLocaleDateString()
        }
    ];

    // If a row is clicked, show the detail view
    if (selectedEvidenceId) {
        const selectedData = evidenceList.find((e: any) => e._id === selectedEvidenceId);
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedEvidenceId(null)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
                <EvidenceDetail evidence={selectedData} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900">My Submissions</h2>
                <p className="text-gray-600 mt-1">Track and manage evidence you have collected in the field</p>
            </div>

            <DataTable
                data={evidenceList}
                columns={columns}
                onRowClick={(row) => setSelectedEvidenceId(row._id)}
                searchPlaceholder="Search by ID, Title or Case..."
                // isLoading={isLoading}
                emptyMessage="You haven't submitted any evidence yet."
            />
        </div>
    );
}
