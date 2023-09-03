import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { FieldTypeEnum } from '../../enums';


type CategoryFilterField = {
  category_fields_id: number;
  field_type_id: number;
  filter: any;
};
type FilterType = {
  category_fields: CategoryFilterField[];
  title: string;
  content: string;
};

export function Filter(props: {
  filter: FilterType;
  id: number;
  title: string;
  categoryProps: {
    [key: number]: {
      name: string;
      options?: { id: number; name: string }[];
      // field_type_id: number;
    };
  };
  handleDelete: () => void;
  handleEdit: () => void;
}) {
  const { filter } = props;

  const renderFilterValue = (field: CategoryFilterField | any) => {
    switch (field.field_type_id) {
      case FieldTypeEnum.TEXT:
        return field.filter.value;
      case FieldTypeEnum.SELECT:
        return (
          props.categoryProps[field.category_fields_id]?.options?.find(
            (option) => option.id == field.filter.value
          )?.name || ''
        );

      case FieldTypeEnum.NUMBER:
      case FieldTypeEnum.DATE:
        return `${
          field.filter.min_value ? `od ${field.filter.min_value} ` : ''
        }${field.filter.max_value ? `do ${field.filter.max_value}` : ''}`;

      default:
        return 'Nepoznat tip polja';
    }
  };

  return (
    <Grid item xs={12} md={12}>
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
              alignItems="flex-start"
            >
              <Typography variant="subtitle1" color="text.secondary">
                Filter #{props.id}
              </Typography>
              <Typography variant="h5">Kategorija: {props.title}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: { xs: 1, md: 2 },
              }}
            >
              <ButtonGroup variant="contained">
                <Button color="error" onClick={props.handleDelete}>
                  <DeleteIcon />
                </Button>
                <Button onClick={props.handleEdit}>
                  <EditIcon />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>

          <List>
            {filter.title && (
              <ListItem>
                <Typography variant="body1">
                  <strong> Naslov:</strong>
                  {filter.title}
                </Typography>
              </ListItem>
            )}
            {filter.content && (
              <ListItem>
                <Typography variant="body1">
                  <strong>Opis:</strong>
                  {filter.content}
                </Typography>
              </ListItem>
            )}
            {filter.category_fields.map((field, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Typography variant="body1">
                    <strong>
                      {props.categoryProps[field.category_fields_id]?.name}:{' '}
                    </strong>
                    {renderFilterValue(field)}
                  </Typography>
                </ListItem>
                {index < filter.category_fields.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
}
