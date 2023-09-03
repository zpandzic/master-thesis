import { CategoryType } from '../types';
import api from '../utils/api';

export const categoriesService = {
  getAllCategories: async (): Promise<CategoryType[]> => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },
  getTopLevelCategories: async () => {
    try {
      const response = await api.get('/categories/top-level');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch top level categories: ${error.message}`);
    }
  },
  getSubCategories: async (id: number) => {
    try {
      const response = await api.get(`/categories/child-of/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch subcategories: ${error.message}`);
    }
  },
  getCategoryById: async (id: number): Promise<CategoryType> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  },
  createCategory: async (category: CategoryType) => {
    try {
      const response = await api.post('/categories/', category);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  },
  deleteCategory: async (id: number) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  },
};
