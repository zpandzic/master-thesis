import { CategoryType } from './category.type';

export type CategoryFieldFilterType = {
  category_fields_id: number;
  field_type_id: number;
  filter: FilterValue;
};

export type FilterValue = {
  value?: string | number[] | boolean;
  min_value?: string | number;
  max_value?: string | number;
};

export type UserFilterType = {
  id: number;
  user_id: number;
  category_id: number;
  filter: string;
  category: CategoryType;
};
