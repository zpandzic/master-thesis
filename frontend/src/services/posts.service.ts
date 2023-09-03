import { CategoryFieldFilterType, PostType, UserFilterType } from '../types';
import api from '../utils/api';

export const postsService = {
  getPosts: async (payload: {
    title?: string;
    content?: string;
    category_id?: number;
    category_fields?: CategoryFieldFilterType[];
    user_id?: number;
    post_id?: number;
  }) => {
    try {
      const response = await api.post('/post/search', payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  createPost: async (payload: any) => {
    try {
      const response = await api.post('/post', payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  deletePost: async (post_id: number) => {
    try {
      const response = await api.delete(`/post/${post_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  getUserPosts: async (
    user_id: number
  ): Promise<{
    filters: UserFilterType[];
    posts: PostType[];
  }> => {
    const response = await api.get(`/post/get-user-posts/${user_id}`);
    return response.data;
  },
};
