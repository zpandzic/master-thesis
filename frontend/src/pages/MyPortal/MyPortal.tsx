import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Post } from '../../components';
import { UserContext } from '../../context/UserContextProvider';
import { postsService } from '../../services';
import { PostType } from '../../types';

type FilterType = {
  id: number;
  categoryName: string;
  checked: boolean;
};

export function MyPortal() {
  const userContext = useContext(UserContext);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [filters, setFilters] = useState<FilterType[]>([]);

  const filteredPosts = posts.filter((post: any) => {
    const checkedFilters = filters
      .filter((filter: any) => filter.checked)
      .map((filter: any) => filter.id);

    return checkedFilters.includes(post.filterId);
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await postsService.getUserPosts(
        userContext.userData?.userId!
      );

      setPosts(data.posts);
      setFilters(
        data.filters.map((filter) => ({
          id: filter.id,
          categoryName: filter.category.title,
          checked: true,
        }))
      );
    };
    fetchPosts();
  }, []);

  const changeFilterHandler = (index: number, value: boolean) => {
    const newFilters = filters.slice();
    newFilters[index] = {
      ...newFilters[index],
      checked: value,
    };

    setFilters(newFilters);
  };

  return (
    <>
      <h3>Portal</h3>
      Prikaži obavijesti za filtere: <br />
      {filters.map((filter, index: number) => (
        <FormControlLabel
          key={filter.id}
          control={
            <Checkbox
              defaultChecked
              onChange={(ev: any) =>
                changeFilterHandler(index, ev.target.checked)
              }
            />
          }
          label={'#' + filter.id + ' ' + filter.categoryName}
        />
      ))}
      {filteredPosts.length > 0 && (
        <>
          <Grid container spacing={4}>
            {filteredPosts.map((post) => (
              <Post key={post.id} post={post} stretch showCategory />
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
