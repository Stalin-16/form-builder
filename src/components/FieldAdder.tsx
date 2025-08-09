import { MenuItem, Select, FormControl, InputLabel, Box, Button } from '@mui/material';
import { useState } from 'react';
import type { FieldType } from '../types/formTypes';

interface FieldAdderProps {
  onAddField: (type: FieldType) => void;
}

const FieldAdder = ({ onAddField }: FieldAdderProps) => {
  const [selectedType, setSelectedType] = useState<FieldType>('text');

  const fieldTypes: FieldType[] = [
    'text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'
  ];

  return (
    <Box mb={4}>
      <FormControl fullWidth>
        <InputLabel>Select Field Type</InputLabel>
        <Select
          value={selectedType}
          label="Field Type"
          onChange={(e) => setSelectedType(e.target.value as FieldType)}
        >
          {fieldTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="outlined" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={() => onAddField(selectedType)}
      >
        Add Field
      </Button>
    </Box>
  );
};

export default FieldAdder;