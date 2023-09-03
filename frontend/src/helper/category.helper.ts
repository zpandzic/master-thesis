import { FieldTypeEnum } from '../enums';
import { CategoryFieldType, CategoryType } from '../types';

export const mergeFields = (category: CategoryType) => [
  ...(category?.parent_fields || []),
  ...(category?.category_fields || []),
];

export const mapCategoryInitialValues = (category: CategoryType) => ({
  title: category.title ?? '',
  description: category.description ?? '',
  parent_id: String(category.parent_id) ?? '',
  image: category.image ?? '',
  category_fields: category.category_fields.map((field: CategoryFieldType) => ({
    ...field,
    options: field.options?.join(','),
  })),
});

export const mapCategoryForUpdate = (values: any): CategoryType => ({
  ...values,
  category_fields: values.category_fields.map((field: any) => ({
    ...field,
    field_type_id: parseInt(field.field_type_id),
    options: [FieldTypeEnum.SELECT, FieldTypeEnum.MULTI_SELECT].includes(
      field.field_type_id
    )
      ? field.options.split(',')
      : null,
  })),
  parent_id: values.parent_id ? parseInt(values.parent_id) : null,
});
