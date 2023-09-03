import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryForm } from '../../../components';
import {
  mapCategoryForUpdate,
  mapCategoryInitialValues,
} from '../../../helper';
import { categoriesService } from '../../../services';
import { CategoryFieldType, CategoryType } from '../../../types';

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    parent_id: '',
    image: '',
    category_fields: [] as any[],
  });

  useEffect(() => {
    fetchCategories(id ? parseInt(id) : undefined);
  }, []);

  const fetchCategories = async (categoryId?: number) => {
    try {
      const allCategories = await categoriesService.getAllCategories();
      setCategories(allCategories);

      if (categoryId) {
        const category = await categoriesService.getCategoryById(categoryId);

        setInitialValues(mapCategoryInitialValues(category));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    const mapedValues: CategoryType = mapCategoryForUpdate(values);

    if (id) {
      // await categoriesService.updateCategory(parseInt(id), mapedValues);
    } else {
      await categoriesService.createCategory(mapedValues);
    }
    navigate('/categories');
  };

  return (
    <CategoryForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      categories={categories}
      title={id ? 'Uredi kategoriju' : 'Dodaj kategoriju'}
    ></CategoryForm>
  );
}
