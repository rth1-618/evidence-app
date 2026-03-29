import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const useEvidence = () => {
    const { user, isLoading: authLoading } = useAuth();
    console.log("Current User:", user); // Check if this is null
    console.log("Auth Loading:", authLoading);

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

    return {
        myEvidenceList,
        submitEvidence: submitEvidenceMutation.mutateAsync, // .mutateAsync returns a promise
        isSubmitting: submitEvidenceMutation.isPending,
        linkStorage: linkStorageMutation.mutateAsync,
        isLinking: linkStorageMutation.isPending,
        getEvidenceDetails,
        getShelfById
    };
};
