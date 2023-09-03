import { Grid, Typography } from '@mui/material';
import React from 'react';
import { CategoryType } from '../../types';
import { CategoryCard } from './CategoryCard';

type CategoryCardListProps = {
  title: string;
  categories: CategoryType[];
  changeCategoryHandler: (id: number) => void;
};

export function CategoryCardList({
  title,
  categories,
  changeCategoryHandler,
}: CategoryCardListProps) {
  return (
    <>
      <h3>{title}</h3>
      <Grid container spacing={4}>
        {categories.map((category: CategoryType) => (
          <CategoryCard
            key={category.id}
            category={category}
            changeCategory={() => changeCategoryHandler(category.id)}
          />
        ))}
      </Grid>
    </>
  );
}
