import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export const useEvidence = () => {
    const submitEvidenceMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            // Axios handles FormData automatically
            const res = await api.post('/evidence/submit', formData);
            return res.data;
        }
    });

    return {
        submitEvidence: submitEvidenceMutation.mutateAsync, // .mutateAsync returns a promise
        isSubmitting: submitEvidenceMutation.isPending
    };
};
