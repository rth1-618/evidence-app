import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { IAttachEvidenceInput } from '../interfaces/IAttachEvidenceInput';

export const useCases = (case_id?: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch only cases assigned to the logged-in user
    const { data: assignedCases = [], isLoading: fieldOfficerCasesLoading } = useQuery({
        queryKey: ['my-assigned-cases', user?.id],
        queryFn: async () => {
            const res = await api.get('/cases/my-assigned');
            // Assuming your backend returns { success: true, data: [...] }
            return res.data.data || res.data;
        },
        enabled: !!user?.id // Only run if user is logged in
    });

    // 1. Fetch Investigator's Cases
    const { data: caseList = [], isLoading: casesLoading } = useQuery({
        queryKey: ['cases', user?.id],
        queryFn: async () => {
            const res = await api.get('/cases', { params: { investigatorId: user?.id } });
            console.log('caseList res:', res);
            return res.data.data;
        },
        enabled: !!user?.id
    });
    // 2. Fetch Single Case Detail
    const { data: selectedCaseData, isLoading: detailLoading } = useQuery({
        queryKey: ['case-detail', case_id],
        queryFn: async () => {
            const res = await api.get(`/cases/${case_id}`);
            return res.data.data;
        },
        enabled: !!case_id
    });

    // 3. Create Case Mutation
    const addCase = useMutation({
        mutationFn: (newCase: any) => api.post('/cases/addcase', newCase),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] })
    });

    const useCaseCategories = () => {
        return useQuery({
            queryKey: ['case-categories'],
            queryFn: async () => {
                const res = await api.get('/cases/categories');
                return res.data.data; // { types: [...] }
            }
        });
    };

    const attachEvidence = useMutation({
        mutationFn: async ({ evidenceIds, caseId }: IAttachEvidenceInput) => {
            return api.post(`/cases/verify`, { evidenceIds, caseId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case-detail', case_id] });
            queryClient.invalidateQueries({ queryKey: ['unassigned-evidence'] });
            toast.success("Evidence attached successfully");
        }
    });

    const addPOI = useMutation({
        mutationFn: async (poiData: any) => api.post('/cases/addPOI', { ...poiData, caseId: case_id }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-detail', case_id] })
    });

    const updateCase = useMutation({
        mutationFn: (updateData: any) => api.put(`/cases/${case_id}`, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['case-detail', case_id] });
            toast.success("Case updated");
        }
    });

    const assignOfficer = useMutation({
        mutationFn: (officerIds: string[]) => api.put(`/cases/${case_id}/officers`, { officerIds }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-detail', case_id] })
    });



    return {
        assignedCases,
        fieldOfficerCasesLoading,
        caseList,
        selectedCaseData,
        casesLoading,
        detailLoading,
        addCase: addCase.mutateAsync,
        caseCategoryList: useCaseCategories().data?.types || [],
        caseCategoryLoading: useCaseCategories().isLoading,
        attachEvidence: attachEvidence,
        addPOI,
        updateCase,
        assignOfficer

    };
};
