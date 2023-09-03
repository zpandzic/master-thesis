import { FormControl, Grid, InputLabel, MenuItem } from '@mui/material';
import { Field } from 'formik';
import { Select, Switch, TextField } from 'formik-material-ui';
import React from 'react';
import { FieldTypeEnum } from '../enums';
import {
  CategoryFieldFilterType,
  CategoryFieldType,
  FilterValue,
} from '../types';

function getCategoryFieldElement(
  categoryField: CategoryFieldType,
  isPost: boolean = false
) {
  switch (categoryField.field_type_id) {
    case FieldTypeEnum.TEXT:
      return (
        <Field
          component={TextField}
          name={String(categoryField.id)}
          label={`${categoryField.field_name}`}
          key={categoryField.id}
          fullWidth
        />
      );
    case FieldTypeEnum.DATE:
    case FieldTypeEnum.NUMBER:
      if (isPost) {
        return (
          <Field
            component={TextField}
            type={
              categoryField.field_type_id === FieldTypeEnum.DATE
                ? 'date'
                : 'number'
            }
            name={String(categoryField.id)}
            label={categoryField.field_name}
            fullWidth
            InputLabelProps={
              categoryField.field_type_id === FieldTypeEnum.DATE
                ? {
                    shrink: categoryField.field_type_id === FieldTypeEnum.DATE,
                  }
                : {}
            }
          />
        );
      }

      return (
        <Grid container spacing={2} key={categoryField.id}>
          <Grid item xs={6}>
            <Field
              component={TextField}
              type={
                categoryField.field_type_id === FieldTypeEnum.DATE
                  ? 'date'
                  : 'number'
              }
              name={`${categoryField.id}.from`}
              label={`${categoryField.field_name} From`}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              component={TextField}
              type={
                categoryField.field_type_id === FieldTypeEnum.DATE
                  ? 'date'
                  : 'number'
              }
              name={`${categoryField.id}.to`}
              label={`${categoryField.field_name} To`}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      );
      break;
    case FieldTypeEnum.SELECT:
    case FieldTypeEnum.MULTI_SELECT:
      if (!categoryField.options || !Array.isArray(categoryField.options)) {
        throw new Error('Filter options must be an array');
      }

      return (
        <Field
          component={Select}
          name={String(categoryField.id)}
          label={categoryField.field_name}
          key={categoryField.id}
          multiple={categoryField.field_type_id === FieldTypeEnum.MULTI_SELECT}
        >
          <MenuItem value="">None</MenuItem>

          {categoryField.options.map((option: any) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </Field>
      );

    case FieldTypeEnum.BOOLEAN:
      return (
        <Field
          component={Switch}
          type="checkbox"
          name={String(categoryField.id)}
          label={categoryField.field_name}
          key={categoryField.id}
        />
      );

    default:
      return null;
  }
}

export function getCategoryFieldRow(
  categoryField: CategoryFieldType,
  isPost: boolean = false,
  inline: boolean = false
) {
  if (inline) {
    return (
      <FormControl fullWidth>
        {getCategoryFieldElement(categoryField, isPost)}
      </FormControl>
    );
  }
  return (
    <>
      <Grid item xs={3}>
        <InputLabel
          // shrink
          style={{ wordWrap: 'break-word', width: '100%', textAlign: 'center' }}
        >
          {categoryField.field_name}
        </InputLabel>
      </Grid>
      <Grid item xs={9}>
        <FormControl fullWidth>
          {getCategoryFieldElement(categoryField, isPost)}
        </FormControl>
      </Grid>
    </>
  );
}

export const renderFieldValue = (field: any) => {
  switch (field.category_field.field_type_id) {
    case FieldTypeEnum.TEXT:
    case FieldTypeEnum.SELECT:
    case FieldTypeEnum.MULTI_SELECT:
      return field.value;
    case FieldTypeEnum.NUMBER:
      return Number(field.value);
    case FieldTypeEnum.DATE:
      return new Date(field.value).toLocaleDateString();
    case FieldTypeEnum.BOOLEAN:
      return field.value ? 'True' : 'False';
    default:
      return null;
  }
};

export const mapFormikValuesForSubmit = (
  fields: CategoryFieldType[],
  values: any
) => {
  const category_fields: CategoryFieldFilterType[] = fields.reduce(
    (acc: any[], filter: CategoryFieldType) => {
      let filterValues: FilterValue = {};

      switch (filter.field_type_id) {
        case FieldTypeEnum.TEXT:
          if (values[filter.id]) {
            filterValues = { value: values[filter.id] };
          }
          break;
        case FieldTypeEnum.DATE:
        case FieldTypeEnum.NUMBER:
          if (values[filter.id]) {
            if (values[filter.id].from) {
              filterValues.min_value = values[filter.id].from;
            }
            if (values[filter.id].to) {
              filterValues.max_value = values[filter.id].to;
            }
          }
          break;
        case FieldTypeEnum.SELECT:
        case FieldTypeEnum.MULTI_SELECT:
          if (values[filter.id] && values[filter.id].length > 0) {
            filterValues = { value: values[filter.id] };
          }
          break;
        case FieldTypeEnum.BOOLEAN:
          if (values[filter.id]) {
            filterValues = { value: values[filter.id] };
          }
          break;
        default:
          break;
      }

      if (
        !(
          Object.keys(filterValues).length === 0 &&
          filterValues.constructor === Object
        )
      ) {
        acc.push({
          category_fields_id: filter.id,
          field_type_id: filter.field_type_id,
          filter: filterValues,
        });
      }

      return acc;
    },
    []
  );

  return category_fields;
};
