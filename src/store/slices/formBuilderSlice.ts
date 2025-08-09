import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FormField, FormSchema } from "../../types/formTypes";
import { saveFormToStorage } from "../../utils/storage";

interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  selectedFieldId: string | null;
}

const initialState: FormBuilderState = {
  currentForm: {
    name: "",
    fields: [],
  },
  selectedFieldId: null,
};

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(
        (f) => f.id === action.payload.id
      );
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(
        (f) => f.id !== action.payload
      );
    },
    reorderFields: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) => {
      const result = Array.from(state.currentForm.fields);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);
      state.currentForm.fields = result;
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    resetForm: (state) => {
      state.currentForm = { name: "", fields: [] };
      state.selectedFieldId = null;
    },
    saveForm: (_state, action: PayloadAction<FormSchema>) => {
      saveFormToStorage(action.payload);
    },
    loadForm: (
      state,
      action: PayloadAction<{ name: string; fields: FormField[] }>
    ) => {
      state.currentForm = action.payload;
    },
  },
});

export const {
  addField,
  updateField,
  removeField,
  reorderFields,
  selectField,
  setFormName,
  resetForm,
  saveForm,
  loadForm,
} = formBuilderSlice.actions;
export default formBuilderSlice.reducer;
