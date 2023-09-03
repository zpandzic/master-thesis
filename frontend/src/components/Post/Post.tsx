import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { renderFieldValue } from '../../helper';
import { PostType } from '../../types';
import { AlertDialog } from '../AlertDialog/AlertDialog';

type PostProps = {
  post: PostType;
  stretch?: boolean;
  showCategory?: boolean;
  handleDelete?: ((id: number) => void) | null;
};

export function Post({ post, stretch, showCategory, handleDelete }: PostProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Grid item xs={12} md={stretch ? 12 : 6}>
      <Card sx={{ display: 'flex' }}>
        <CardContent sx={{ flex: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection={'column'}
              justifyContent="space-between"
              alignItems="left"
            >
              {showCategory && (
                <Typography variant="subtitle1" color="text.secondary">
                  Kategorija: {post.category.title}
                </Typography>
              )}
              <Typography variant="subtitle1" color="text.secondary">
                Created: {new Date(post.created_at).toLocaleString()}
              </Typography>
            </Box>

            {handleDelete && (
              <>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <DeleteIcon />
                </Button>

                <AlertDialog
                  open={showDeleteDialog}
                  title="Jeste li sigurni da želite obrisati objavu?"
                  content=""
                  handleClose={() => {
                    setShowDeleteDialog(false);
                  }}
                  handleAgree={() => {
                    setShowDeleteDialog(false);
                    handleDelete(post.id);
                  }}
                />
              </>
            )}
          </Box>

          <Typography component="h2" variant="h5">
            {post.title}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {post.content}
          </Typography>
          <List>
            {post.post_field_values.map((field, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Typography variant="body1">
                    <strong>{field.category_field.field_name}:</strong>{' '}
                    {renderFieldValue(field)}
                  </Typography>
                </ListItem>
                {index < post.post_field_values.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
        {post.image && (
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={post.image}
          />
        )}
      </Card>
    </Grid>
  );
}
