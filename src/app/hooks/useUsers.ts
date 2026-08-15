import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { IUser } from '../interfaces/IUser';

export const useUsers = (searchTerm?: string) => {
  const queryClient = useQueryClient();

  // GET all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users/all');
      return res.data.data;
    },
  });

  // POST create user
  const createUserMutation = useMutation({
    mutationFn: (newUser: IUser) => api.post('/users/create', newUser),
    onSuccess: () => {
      // Automatically refresh the user list after creating one!
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const searchResults = useQuery({
    queryKey: ['officer-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      const res = await api.get(`/users/search-officer?term=${searchTerm}`);
      return res.data;
    },
    enabled: !!searchTerm && searchTerm.length > 1
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/users/status`, { id, status }),
    onSuccess: () => {
      // This "refetches" the table immediately
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });


  return {
    users, isLoading, createUser: createUserMutation.mutate,
    officerResults: searchResults.data || [],
    isSearching: searchResults.isFetching,
    toggleStatus: toggleStatusMutation.mutate
  };

};
