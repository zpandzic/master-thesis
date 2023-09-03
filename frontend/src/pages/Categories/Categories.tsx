import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryCardList } from '../../components/Categories/CategoryCardList';
import { ParentCategory } from '../../components/Categories/ParentCategory/ParentCategory';
import { FilterForm } from '../../components/FilterForm/FilterForm';
import { UserContext } from '../../context/UserContextProvider';
import { getInitialValues, mergeFields } from '../../helper';
import { categoriesService, filterService, postsService } from '../../services';
import {
  CategoryFieldFilterType,
  CategoryFieldType,
  CategoryType,
  PostType,
} from '../../types';
import { PostSection } from './PostSection/PostSection';

export function Categories() {
  const { id } = useParams();
  const navigate = useNavigate();

  const authContext = useContext(UserContext);

  const [categoryData, setCategoryData] = useState({
    parentCategory: null as null | CategoryType,
    categories: [] as CategoryType[],
    fields: [] as CategoryFieldType[],
  });
  const [posts, setPosts] = useState<PostType[]>([]);
  const [showFields, setShowFields] = useState(true);

  useEffect(() => {
    fetchData(id ? parseInt(id) : undefined);
  }, [id]);

  const fetchData = async (categoryId?: number) => {
    setShowFields(() => false);
    try {
      let fetchedCategories: CategoryType[] = [];
      let fetchedParentCategory: CategoryType | null = null;
      let fetchedPosts: PostType[] = [];

      if (categoryId) {
        [fetchedCategories, fetchedParentCategory, fetchedPosts] =
          await Promise.all([
            categoriesService.getSubCategories(categoryId),
            categoriesService.getCategoryById(categoryId),
            postsService.getPosts({ category_id: categoryId }),
          ]);
      } else {
        [fetchedCategories, fetchedPosts] = await Promise.all([
          categoriesService.getTopLevelCategories(),
          postsService.getPosts({}),
        ]);
      }

      setCategoryData({
        parentCategory: fetchedParentCategory,
        categories: fetchedCategories,
        fields: fetchedParentCategory ? mergeFields(fetchedParentCategory) : [],
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
    setShowFields(() => true);
  };

  const searchHandler = async (
    category_fields: CategoryFieldFilterType[] = [],
    title?: string,
    content?: string
  ) => {
    const posts = await postsService.getPosts({
      category_fields,
      category_id: categoryData.parentCategory?.id,
      title,
      content,
    });
    setPosts(posts);
  };

  const saveFilter = async (filter: any) => {
    const _filter = await filterService.saveFilter({
      category_id: categoryData.parentCategory!.id,
      filter,
    });
    if (_filter) {
      alert('Filter uspjesno spremljen!');
    }
  };

  return (
    <>
      {categoryData.parentCategory && (
        <ParentCategory
          category={categoryData.parentCategory}
          onCategoryDelete={async () => {
            await categoriesService.deleteCategory(
              categoryData.parentCategory!.id
            );
            navigate('/categories');
          }}
          onCategoryEdit={() =>
            navigate('/categories/' + categoryData.parentCategory!.id + '/edit')
          }
        />
      )}

      {categoryData.categories.length > 0 && (
        <CategoryCardList
          title={categoryData.parentCategory ? 'Potkategorije' : 'Kategorije'}
          categories={categoryData.categories}
          changeCategoryHandler={(categoryId: number) =>
            navigate('/categories/' + categoryId)
          }
        />
      )}

      {!categoryData.parentCategory && authContext.isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/categories/create')}
        >
          <AddIcon></AddIcon> Kreiraj novu kategoriju
        </Button>
      )}

      {showFields && (
        <FilterForm
          fields={categoryData.fields}
          fieldsInitialValues={{
            ...getInitialValues(categoryData.fields),
            title: '',
            content: '',
          }}
          search={searchHandler}
          saveFilter={saveFilter}
          hideSaveFilter={!categoryData.parentCategory?.id}
        />
      )}

      <PostSection posts={posts} />
    </>
  );
}
