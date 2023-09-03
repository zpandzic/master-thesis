import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CategoryType } from '../../types';

interface CategoryProps {
  category: CategoryType;
  changeCategory: () => void;
}

export function CategoryCard(props: CategoryProps) {
  const { category, changeCategory } = props;

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" onClick={changeCategory}>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {category.title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {category.description}
            </Typography>
          </CardContent>
          {category.image && (
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
              image={category.image}
              alt={category.title}
            />
          )}
        </Card>
      </CardActionArea>
    </Grid>
  );
}
