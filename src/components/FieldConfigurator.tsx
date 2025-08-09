// src/components/form-builder/FieldConfigurator.tsx
import { useState, useEffect } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import GridItem from "./gridItem";
import type { FormField, ValidationRule } from "../types/formTypes";

interface FieldConfiguratorProps {
  field: FormField;
  allFields: FormField[];
  onUpdateField: (field: FormField) => void;
}

const FieldConfigurator = ({
  field,
  allFields,
  onUpdateField,
}: FieldConfiguratorProps) => {
  const [localField, setLocalField] = useState<FormField>({ ...field });
  const [newValidation, setNewValidation] = useState<
    Omit<ValidationRule, "message">
  >({
    type: "required",
    value: undefined,
  });
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setLocalField({ ...field });
  }, [field]);

  const handleFieldChange = (prop: keyof FormField, value: any) => {
    setLocalField((prev) => ({ ...prev, [prop]: value }));
  };

  const handleSave = () => {
    onUpdateField(localField);
  };

  const addValidation = () => {
    if (!validationMessage.trim()) return;

    const rule: ValidationRule = {
      ...newValidation,
      message: validationMessage,
    };

    setLocalField((prev) => ({
      ...prev,
      validations: [...(prev.validations || []), rule],
    }));

    setNewValidation({ type: "required", value: undefined });
    setValidationMessage("");
  };

  const removeValidation = (index: number) => {
    setLocalField((prev) => ({
      ...prev,
      validations: prev.validations?.filter((_, i) => i !== index) || [],
    }));
  };

  const addOption = () => {
    if (!localField.options) {
      handleFieldChange("options", [{ label: "Option 1", value: "option1" }]);
    } else {
      handleFieldChange("options", [
        ...localField.options,
        {
          label: `Option ${localField.options.length + 1}`,
          value: `option${localField.options.length + 1}`,
        },
      ]);
    }
  };

  const updateOption = (
    index: number,
    prop: "label" | "value",
    value: string
  ) => {
    if (!localField.options) return;

    const newOptions = [...localField.options];
    newOptions[index] = { ...newOptions[index], [prop]: value };
    handleFieldChange("options", newOptions);
  };

  const removeOption = (index: number) => {
    if (!localField.options) return;

    const newOptions = localField.options.filter((_, i) => i !== index);
    handleFieldChange("options", newOptions);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Field Configuration
      </Typography>

      <Grid container spacing={2}>
        <GridItem item xs={12}>
          <TextField
            fullWidth
            label="Field Label"
            value={localField.label}
            onChange={(e) => handleFieldChange("label", e.target.value)}
          />
        </GridItem>

        <GridItem item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={localField.required}
                onChange={(e) =>
                  handleFieldChange("required", e.target.checked)
                }
              />
            }
            label="Required"
          />
        </GridItem>

        {["text", "number", "textarea"].includes(localField.type) && (
          <GridItem item xs={12}>
            <TextField
              fullWidth
              label="Default Value"
              value={localField.defaultValue || ""}
              onChange={(e) =>
                handleFieldChange("defaultValue", e.target.value)
              }
            />
          </GridItem>
        )}

        {["select", "radio"].includes(localField.type) && (
          <GridItem item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Options
            </Typography>
            {localField.options?.map((option, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                mb={1}
              >
                <TextField
                  label="Label"
                  value={option.label}
                  onChange={(e) => updateOption(index, "label", e.target.value)}
                />
                <TextField
                  label="Value"
                  value={option.value}
                  onChange={(e) => updateOption(index, "value", e.target.value)}
                />
                <IconButton onClick={() => removeOption(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button variant="outlined" onClick={addOption}>
              Add Option
            </Button>
          </GridItem>
        )}

        <GridItem item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Validations
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {localField.validations?.map((validation, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <Chip
                  label={`${validation.type}${
                    validation.value ? `: ${validation.value}` : ""
                  }`}
                  onDelete={() => removeValidation(index)}
                />
                <Typography variant="body2">{validation.message}</Typography>
              </Box>
            ))}

            <Box display="flex" alignItems="center" gap={3}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newValidation.type}
                  label="Type"
                  onChange={(e) =>
                    setNewValidation((prev) => ({
                      ...prev,
                      type: e.target.value as ValidationRule["type"],
                    }))
                  }
                >
                  <MenuItem value="required">Required</MenuItem>
                  <MenuItem value="minLength">Min Length</MenuItem>
                  <MenuItem value="maxLength">Max Length</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="password">Password</MenuItem>
                </Select>
              </FormControl>

              {["minLength", "maxLength"].includes(newValidation.type) && (
                <TextField
                  type="number"
                  label="Value"
                  value={newValidation.value || ""}
                  onChange={(e) =>
                    setNewValidation((prev) => ({
                      ...prev,
                      value: parseInt(e.target.value),
                    }))
                  }
                  sx={{ width: 150 }}
                />
              )}

              <TextField
                label="Error Message"
                value={validationMessage}
                onChange={(e) => setValidationMessage(e.target.value)}
                fullWidth
              />

              <Button variant="outlined" onClick={addValidation}>
                Add
              </Button>
            </Box>
          </Box>
        </GridItem>

        <GridItem item xs={12}>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={localField.isDerived}
                onChange={(e) =>
                  handleFieldChange("isDerived", e.target.checked)
                }
              />
            }
            label="Derived Field"
          />

          {localField.isDerived && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Parent Fields
              </Typography>
              <Select
                multiple
                value={localField.parentFields || []}
                onChange={(e) =>
                  handleFieldChange("parentFields", e.target.value as string[])
                }
                fullWidth
              >
                {allFields
                  .filter((f) => f.id !== localField.id)
                  .map((field) => (
                    <MenuItem key={field.id} value={field.id}>
                      {field.label}
                    </MenuItem>
                  ))}
              </Select>

              <TextField
                label="Derivation Logic"
                value={localField.derivationLogic || ""}
                onChange={(e) =>
                  handleFieldChange("derivationLogic", e.target.value)
                }
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2 }}
                placeholder="Example: parentField1 + ' ' + parentField2"
              />
            </Box>
          )}
        </GridItem>

        <GridItem item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Save Changes
          </Button>
        </GridItem>
      </Grid>
    </Paper>
  );
};

export default FieldConfigurator;
