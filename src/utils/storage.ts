import type { FormSchema } from "../types/formTypes";



export const saveFormToStorage = (form: FormSchema) => {
  const savedForms = localStorage.getItem('savedForms');
  const forms = savedForms ? JSON.parse(savedForms) : [];
  
  // Check if form already exists
  const existingIndex = forms.findIndex((f: FormSchema) => f.id === form.id);
  
  if (existingIndex >= 0) {
    forms[existingIndex] = form;
  } else {
    forms.push(form);
  }
  
  localStorage.setItem('savedForms', JSON.stringify(forms));
};

export const loadFormsFromStorage = (): FormSchema[] => {
  const savedForms = localStorage.getItem('savedForms');
  return savedForms ? JSON.parse(savedForms) : [];
};

export const deleteFormFromStorage = (id: string) => {
  const savedForms = localStorage.getItem('savedForms');
  if (!savedForms) return;
  
  const forms = JSON.parse(savedForms).filter((form: FormSchema) => form.id !== id);
  localStorage.setItem('savedForms', JSON.stringify(forms));
};