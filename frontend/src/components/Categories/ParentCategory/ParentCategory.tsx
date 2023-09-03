import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContextProvider';
import { CategoryType } from '../../../types';
import { AlertDialog } from '../../AlertDialog/AlertDialog';
import './ParentCategory.css';

type ParentCategoryProps = {
  category: CategoryType;
  onCategoryEdit: () => void;
  onCategoryDelete: () => void;
};

export function ParentCategory({
  category,
  onCategoryEdit,
  onCategoryDelete,
}: ParentCategoryProps) {
  const [openDelteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();
  const authContext = React.useContext(UserContext);

  return (
    <>
      <Paper
        className="paper"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <Box className="overlay" />
        <Grid container>
          <Grid item md={6}>
            <Box className="container">
              <Typography className="title">{category.title}</Typography>
              <Typography className="description">
                {category.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {authContext.isAdmin && (
          <Box className="buttonGroup">
            <ButtonGroup variant="contained">
              <Button color="error" onClick={() => setOpenDeleteDialog(true)}>
                <DeleteIcon />
              </Button>
              <Button onClick={onCategoryEdit}>
                <EditIcon />
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Paper>
      <AlertDialog
        open={openDelteDialog}
        title="Jeste li sigurni da želite obrisati kategoriju?"
        content="Ova akcija je nepovratna. Sa kategorijom se brišu i sve potkategorije i objave."
        handleClose={() => setOpenDeleteDialog(false)}
        handleAgree={onCategoryDelete}
      />
      {authContext.token && (
        <Button
          className="addButton"
          variant="contained"
          onClick={() => navigate('/post/create/' + category.id)}
        >
          <AddIcon />
          Nova objava
        </Button>
      )}
    </>
  );
}
