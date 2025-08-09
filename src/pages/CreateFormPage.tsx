import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addField,
  selectField,
  reorderFields,
  resetForm,
  updateField,
  removeField,
  saveForm,
} from "../store/slices/formBuilderSlice";
import { Box,Typography, TextField, Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import FieldAdder from "../components/FieldAdder";
import FieldConfigurator from "../components/FieldConfigurator";
import FieldList from "../components/FieldList";
import GridItem from "../components/gridItem";
import type { AppDispatch, RootState } from "../store/store";
import type { FieldType, FormField, FormSchema } from "../types/formTypes";

const CreateFormPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentForm, selectedFieldId } = useSelector(
    (state: RootState) => state.formBuilder
  );
  const [formName, setFormName] = useState("");

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} Field`,
      required: false,
      isDerived: false,
    };

    if (type === "select" || type === "radio") {
      newField.options = [{ label: "Option 1", value: "option1" }];
    }

    dispatch(addField(newField));
    dispatch(selectField(newField.id));
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }

    const formSchema: FormSchema = {
      id: `form-${Date.now()}`,
      name: formName,
      createdAt: new Date().toISOString(),
      fields: currentForm.fields,
    };

    dispatch(saveForm(formSchema));
    dispatch(resetForm());
    setFormName("");
  };

return (
  <Box p={4}>
    <Typography variant="h4" gutterBottom border={1} borderRadius={2}>
      Form Builder
    </Typography>

    <Grid container spacing={4}>
      <GridItem item xs={12} md={4}>
        <TextField
          fullWidth
          label="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          margin="normal"
        />
        <FieldAdder onAddField={handleAddField} />
        <FieldList
          onRemoveField={(id) => dispatch(removeField(id))}
          fields={currentForm.fields}
          selectedFieldId={selectedFieldId}
          onSelectField={(id) => dispatch(selectField(id))}
          onReorderFields={(startIndex, endIndex) =>
            dispatch(reorderFields({ startIndex, endIndex }))
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveForm}
          style={{ marginTop: "16px" }}
          disabled={ currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </GridItem>

      <GridItem item xs={12} md={8}>
        {selectedFieldId ? (
          <FieldConfigurator
            field={currentForm.fields.find((f) => f.id === selectedFieldId)!}
            allFields={currentForm.fields}
            onUpdateField={(updatedField) =>
              dispatch(updateField(updatedField))
            }
          />
        ) : (
          <Typography>Select a field to configure</Typography>
        )}
      </GridItem>
    </Grid>
  </Box>
);
};

export default CreateFormPage;
