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
            console.log('res:', res);

            return res.data.data;
        },
        enabled: !!user?.id
    });

    return {
        myEvidenceList,
        submitEvidence: submitEvidenceMutation.mutateAsync, // .mutateAsync returns a promise
        isSubmitting: submitEvidenceMutation.isPending
    };
};
