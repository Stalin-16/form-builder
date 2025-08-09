import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  Paper,
  InputLabel,
} from "@mui/material";
import type { FormField } from "../types/formTypes";
import type { RootState } from "../store/store";

const PreviewPage = () => {
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize form values with defaults
    const initialValues: Record<string, any> = {};
    currentForm.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.type === "checkbox") {
        initialValues[field.id] = false;
      } else if (field.type === "select" || field.type === "radio") {
        initialValues[field.id] = field.options?.[0]?.value || "";
      }
    });
    setFormValues(initialValues);
  }, [currentForm]);

  const validateField = (fieldId: string, value: any): string | null => {
    const field = currentForm.fields.find((f) => f.id === fieldId);
    if (!field) return null;

    if (
      field.required &&
      (value === undefined || value === null || value === "")
    ) {
      return (
        field.validations?.find((v) => v.type === "required")?.message ||
        "This field is required"
      );
    }

    if (field.validations) {
      for (const validation of field.validations) {
        switch (validation.type) {
          case "minLength":
            if (
              typeof value === "string" &&
              value.length < (validation.value as number)
            ) {
              return validation.message;
            }
            break;
          case "maxLength":
            if (
              typeof value === "string" &&
              value.length > (validation.value as number)
            ) {
              return validation.message;
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return validation.message;
            }
            break;
          case "password":
            if (value.length < 8 || !/\d/.test(value)) {
              return validation.message;
            }
            break;
        }
      }
    }

    return null;
  };

  const handleChange = (fieldId: string, value: any) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);

    // Validate the field
    const error = validateField(fieldId, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldId]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // Update derived fields
    currentForm.fields.forEach((field) => {
      if (field.isDerived && field.parentFields?.includes(fieldId)) {
        try {
          const derivedValue = computeDerivedValue(field, newValues);
          setFormValues((prev) => ({ ...prev, [field.id]: derivedValue }));
        } catch (e) {
          console.error("Error computing derived value:", e);
        }
      }
    });
  };

  const computeDerivedValue = (
    field: FormField,
    values: Record<string, any>
  ): any => {
    if (!field.derivationLogic) return "";

    try {
      // Create a safe context for evaluation
      const context: Record<string, any> = {};
      field.parentFields?.forEach((parentId) => {
        context[parentId] = values[parentId];
      });

      const func = new Function(
        ...Object.keys(context),
        `return ${field.derivationLogic}`
      );
      console.log(field.derivationLogic);
      return func(...Object.values(context));
    } catch (e) {
      console.error("Error in derivation logic:", e);
      return "Error in computation";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentForm.fields.forEach((field) => {
      const error = validateField(field.id, formValues[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      alert("Form submitted successfully!");
      // Note: We're not saving the values per requirements
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom >
        {currentForm.name || "Form Preview"}
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          {currentForm.fields.map((field) => (
            <Box key={field.id} mb={3}>
              {field.type === "text" && (
                <TextField
                  fullWidth
                  label={field.label}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  required={field.required}
                />
              )}

              {field.type === "number" && (
                <TextField
                  fullWidth
                  type="number"
                  label={field.label}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  required={field.required}
                />
              )}

              {field.type === "textarea" && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={field.label}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  required={field.required}
                />
              )}

              {field.type === "select" && (
                <FormControl
                  fullWidth
                  error={!!errors[field.id]}
                  required={field.required}
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formValues[field.id] || ""}
                    label={field.label}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[field.id] && (
                    <Typography variant="caption" color="error">
                      {errors[field.id]}
                    </Typography>
                  )}
                </FormControl>
              )}

              {field.type === "radio" && (
                <FormControl
                  component="fieldset"
                  error={!!errors[field.id]}
                  required={field.required}
                >
                  <FormLabel component="legend">{field.label}</FormLabel>
                  <RadioGroup
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                  {errors[field.id] && (
                    <Typography variant="caption" color="error">
                      {errors[field.id]}
                    </Typography>
                  )}
                </FormControl>
              )}

              {field.type === "checkbox" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formValues[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                    />
                  }
                  label={field.label}
                />
              )}

              {field.type === "date" && (
                <TextField
                  fullWidth
                  type="date"
                  label={field.label}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  required={field.required}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              {field.isDerived && (
                <Box mt={1}>
                  <Typography variant="body2" color="textSecondary">
                    Derived value:{" "}
                    {formValues[field.id]?.toString() || "Not computed"}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
            variant="outlined"
              onClick={() => navigate("/create")}
              sx={{
                mr: 2, 
                ":hover": {
                  color: "white",
                  borderColor: "grey",
                  backgroundColor: "grey",
                },
              }}
            >
              Back to Builder
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit Form
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PreviewPage;
