import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setForms, deleteForm } from '../store/slices/formsListSlice';
import { loadForm } from '../store/slices/formBuilderSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Paper,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';;
import dayjs from 'dayjs';
import type { AppDispatch, RootState } from '../store/store';
import type { FormSchema } from '../types/formTypes';

const MyFormsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forms } = useSelector((state: RootState) => state.formsList);
  const navigate = useNavigate();

  useEffect(() => {
    // Load forms from localStorage
    const savedForms = localStorage.getItem('savedForms');
    if (savedForms) {
      dispatch(setForms(JSON.parse(savedForms)));
    }
  }, [dispatch]);

  const handleDeleteForm = (id: string) => {
    dispatch(deleteForm(id));
    // Update localStorage
    localStorage.setItem('savedForms', JSON.stringify(forms.filter(form => form.id !== id)));
  };

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(loadForm({ name: form.name, fields: form.fields }));
    navigate('/preview');
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Forms</Typography>
        <Button variant="contained" onClick={handleCreateNew} >
          Create New Form
        </Button>
      </Box>
      
      {forms.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No forms saved yet</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={handleCreateNew}
          >
            Create Your First Form
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <List>
            {forms.map(form => (
              <ListItem 
                key={form.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteForm(form.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={form.name}
                  secondary={`Created: ${dayjs(form.createdAt).format('MMM D, YYYY h:mm A')} | Fields: ${form.fields.length}`}
                  onClick={() => handlePreviewForm(form)}
                  sx={{ cursor: 'pointer' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default MyFormsPage;