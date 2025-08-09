import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FormSchema } from "../../types/formTypes";


interface FormsListState {
  forms: FormSchema[];
}

const initialState: FormsListState = {
  forms: [],
};

const formsListSlice = createSlice({
  name: 'formsList',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormSchema>) => {
      state.forms.push(action.payload);
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
    },
    setForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.forms = action.payload;
    }
  },
});

export const { addForm, deleteForm, setForms } = formsListSlice.actions;
export default formsListSlice.reducer;