export type CategoryType = {
  id: number;
  title: string;
  description?: string | null;
  parent_id?: number | null;
  image?: string | null;

  category_fields: CategoryFieldType[];
  parent_fields: CategoryFieldType[];
};

export type CategoryFieldType = {
  id: number;
  category_id?: number;
  field_name: string;
  field_type_id: number;
  field_typex: FieldType;
  options?: any[];
};

export type FieldType = {
  id: number;
  name: string;
};
