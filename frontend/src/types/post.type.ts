import { CategoryType, CategoryFieldType } from './category.type';

export type PostFieldValues = {
  id: number;
  post_id: number;
  category_field_id: number;
  value: string;
  category_field: CategoryFieldType;
};

export type PostType = {
  id: number;
  category_id: number;
  category: CategoryType;
  title: string;
  content: string;
  user_id: number;
  image: null | string;
  created_at: string;
  post_field_values: PostFieldValues[];
};
