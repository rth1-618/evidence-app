import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

export const useEvidence = (searchQuery?: string) => {
    const queryClient = useQueryClient();

    const { user, isLoading: authLoading } = useAuth();
    // console.log("Current User:", user); // Check if this is null
    // console.log("Auth Loading:", authLoading);


    const submitEvidenceMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            // Axios handles FormData automatically
            const res = await api.post('/evidence/submit', formData);
            return res.data;
        }
    });
    // 1. Fetch evidence from your MERN backend
    const { data: myEvidenceList = [], isLoading } = useQuery({
        queryKey: ['my-evidence', user?.id],
        queryFn: async () => {
            const res = await api.get('/evidence/my-submissions');
            // console.log('res:', res);

            return res.data.data;
        },
        enabled: !!user?.id
    });

    // Mutation for linking
    const linkStorageMutation = useMutation({
        mutationFn: async ({ evidenceId, shelf_id }: { evidenceId: string, shelf_id: string }) => {
            const res = await api.post('/shelves/link-storage', { evidenceId, shelf_id });
            return res.data;
        }
    });

    // Query to fetch specific evidence details after scan
    const getEvidenceDetails = async (evidenceId: string) => {
        const res = await api.get(`/evidence/${evidenceId}`);
        return res.data.data;
    };

    const getShelfById = async (objectId: string) => {

        // Fetch shelf details using the scanned ObjectID to display friendly name
        const res = await api.get(`/shelves/${objectId}`); // Assuming this returns all, or add getById
        // console.log('shelf res', res)
        const shelf = res.data;
        return shelf;
    };

    const { data: unassignedEvidence = [], isLoading: loadingUnassigned } = useQuery({
        // 1. queryKey must include the searchQuery to refetch on type
        queryKey: ['unassigned-evidence', searchQuery],

        queryFn: async () => {
            // 2. Logic: Send 'term' only if 3+ chars. 
            // Otherwise, send no params (hits the "Unassigned Mode" in backend)
            const params = (searchQuery && searchQuery.length >= 3)
                ? { term: searchQuery }
                : {};

            const res = await api.get('/evidence/unassigned', { params });

            // 3. Ensure we return the data array correctly
            return res.data;
        },

        // 4. Set to true so it loads the default "Unassigned" list on mount
        enabled: true,

        // 5. Recommended: Keeps the old list visible while the new search is fetching
        // placeholderData: (previousData) => previousData,
    });

    const updateStatus = useMutation({
        mutationFn: ({ id, status, caseId }: { id: string, status: string, caseId?: string }) =>
            api.patch(`/evidence/${id}/status`, { status, caseId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case-detail'] });
            queryClient.invalidateQueries({ queryKey: ['unassigned-evidence'] });
            queryClient.invalidateQueries({ queryKey: ['evidence-preview'] });
            toast.success("Status updated successfully");
        }
    });

    return {
        myEvidenceList,
        submitEvidence: submitEvidenceMutation.mutateAsync, // .mutateAsync returns a promise
        isSubmitting: submitEvidenceMutation.isPending,
        linkStorage: linkStorageMutation.mutateAsync,
        isLinking: linkStorageMutation.isPending,
        getEvidenceDetails,
        getShelfById,
        unassignedEvidence,
        loadingUnassigned,
        updateStatus
    };
};
