import { FieldTypeEnum } from '../enums';
import { CategoryFieldType } from '../types';

const getInitialValue = (
  field_type_id: number,
  singleValue: boolean = false,
  defaultValue: any = {}
) => {
  switch (field_type_id) {
    case FieldTypeEnum.TEXT:
      return defaultValue.value || '';

    case FieldTypeEnum.DATE:
    case FieldTypeEnum.NUMBER:
      if (singleValue) return '';
      return {
        from: defaultValue.min_value || '',
        to: defaultValue.max_value || '',
      };
    case FieldTypeEnum.SELECT:
    case FieldTypeEnum.MULTI_SELECT:
      if (singleValue) return '';
      return defaultValue.value || '';
    case FieldTypeEnum.BOOLEAN:
      return false;

    default:
      return '';
  }
};

export const getInitialValues = (
  filters: CategoryFieldType[],
  singleValue: boolean = false,
  defaultValues:
    | {
        category_fields_id: number;
        field_type_id: number;
        filter: { value: string } | { from: string; to: string };
      }[]
    | null = null
) => {
  return filters.reduce((acc: any, filter: CategoryFieldType) => {
    if (defaultValues) {
      const defaultValue = defaultValues.find(
        (defaultValue) => defaultValue.category_fields_id === filter.id
      );

      acc[filter.id] = getInitialValue(
        filter.field_type_id,
        false,
        defaultValue?.filter
      );
    } else {
      acc[filter.id] = getInitialValue(filter.field_type_id, singleValue);
    }
    return acc;
  }, {});
};
