import { Box, Grid, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Filter, FilterForm } from '../../components';
import { getInitialValues, mergeFields } from '../../helper';
import { categoriesService, filterService } from '../../services';
import { CategoryFieldType, CategoryType } from '../../types';

type Filter = {
  category_id: number;
  id: number;
  user_id: number;
  filter: any;
  category: CategoryType;
  allFields: CategoryFieldType[];
};

export function MyFilters() {
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = useState<Array<Filter>>([]);
  const [fields, setFields] = useState<CategoryFieldType[]>([]);
  const [filterId, setFilterId] = useState<number | null>(null);
  const [initValues, setInitValues] = useState<any>({});

  const handleOpen = async (filter: {
    id: number;
    category_id: number;
    filter: any;
  }) => {
    const _category = await categoriesService.getCategoryById(
      filter.category_id
    );
    const _fields = mergeFields(_category);
    const newInit = {
      ...getInitialValues(_fields, false, filter.filter.category_fields),
      title: filter.filter.title || '',
      content: filter.filter.content || '',
    };
    setInitValues(newInit);

    setFilterId(filter.id);
    setFields(_fields);
    setOpen(true);
  };

  const handleClose = () => {
    setInitValues(null);
    setFilterId(null);
    setFields([]);
    setOpen(false);
  };

  const updateFilterHandler = async (editedFilter: any) => {
    if (!filterId) return;
    try {
      await filterService.updateFilter(filterId, editedFilter);
      fetchFilters();
    } catch (error) {
      console.error('Error updating filter:', error);
    } finally {
      handleClose();
    }
  };

  const handleDelete = async (filterId: number) => {
    try {
      await filterService.deleteFilter(filterId);
      setOpen(false);
      setFilters((prevFilters) =>
        prevFilters.filter((filter) => filter.id !== filterId)
      );
    } catch (error) {
      console.error('Error deleting filter:', error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const _filters: Array<Filter> = (await filterService.getMyFilters()).map(
        (filter) => {
          return { ...filter, allFields: mergeFields(filter.category) };
        }
      );

      setFilters(_filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  return (
    <>
      <h3>Moji filteri</h3>
      <Grid container spacing={4}>
        {filters.map((filter) => {
          return (
            <Filter
              filter={filter.filter}
              categoryProps={filter.allFields.reduce((acc: any, field: any) => {
                acc[field.id] = {
                  name: field.field_name,
                  options: field.options,
                };
                return acc;
              }, {})}
              key={filter.id}
              id={filter.id}
              title={filter.category.title}
              handleDelete={() => handleDelete(filter.id)}
              handleEdit={() => handleOpen(filter)}
            />
          );
        })}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-filter-modal-title"
        aria-describedby="edit-filter-modal-description"
      >
        <Box
          style={{
            outline: 'none',
            width: '80%',
            margin: '5% auto',
            padding: '20px',
            background: '#fff',
          }}
        >
          <Typography id="edit-filter-modal-title" variant="h6" gutterBottom>
            Edit Filter
          </Typography>
          {open && (
            <FilterForm
              fields={fields}
              fieldsInitialValues={initValues}
              hideSearch
              saveFilter={(filter) => {
                updateFilterHandler(filter);
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}
