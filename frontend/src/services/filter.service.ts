import { CategoryType } from '../types';
import api from '../utils/api';

export const filterService = {
  saveFilter: async (data: {
    category_id: number;
    filter: any[];
  }): Promise<{
    id: number;
    user_id: number;
    category_id: number;
    filter: JSON;
  }> => {
    const response = await api.post('/user_filter/save-filter', data);
    return response.data;
  },
  getMyFilters: async (): Promise<
    {
      category_id: number;
      id: number;
      user_id: number;
      filter: any;
      category: CategoryType;
    }[]
  > => {
    const response = await api.get('/user_filter/get-my-filters');
    return response.data.map((filter: any) => {
      return {
        category_id: filter.category_id,
        id: filter.id,
        user_id: filter.user_id,
        filter: JSON.parse(filter.filter),
        category: {
          ...filter.category,
          parent_fields: filter.category.parent?.category_fields || [],
        },
      };
    });
  },
  updateFilter: async (filterId: number, data: any) => {
    const response = await api.put(`/user_filter/${filterId}`, {
      filter: data,
    });
    return response.data;
  },
  deleteFilter: async (filterID: number): Promise<any> => {
    const response = await api.delete(`/user_filter/${filterID}`);
    return response.data;
  },
};
