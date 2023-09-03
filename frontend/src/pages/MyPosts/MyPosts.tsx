import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../../components';
import { UserContext } from '../../context/UserContextProvider';
import { postsService } from '../../services';
import { PostType } from '../../types';

export function MyPosts() {
  const userContext = useContext(UserContext);
  const { postId } = useParams();

  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const payload = postId
        ? { post_id: Number(postId) }
        : { user_id: userContext.userData?.userId };

      const _posts = await postsService.getPosts(payload);

      setPosts(_posts);
    };

    fetchPosts();
  }, [postId]);

  const handleDelete = async (postId: number) => {
    await postsService.deletePost(postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <>
      <h3>{postId ? 'Objava' : 'Moje objave'}</h3>

      {posts.length > 0 && (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              stretch
              handleDelete={postId ? null : handleDelete}
              showCategory
            />
          ))}
        </Grid>
      )}
    </>
  );
}
