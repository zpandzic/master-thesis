import { Grid, Typography } from '@mui/material';
import React from 'react';
import { Post } from '../../../components';
import { PostType } from '../../../types';

type PostSectionProps = {
  posts: PostType[];
};

export function PostSection({ posts }: PostSectionProps) {
  return (
    <>
      <h3>Objave</h3>
      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post: any) => (
            <Post key={post.id} post={post} />
          ))}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          style={{ marginTop: '20px' }}
        >
          Trenutno nema postova u ovoj kategoriji.
        </Typography>
      )}
    </>
  );
}
