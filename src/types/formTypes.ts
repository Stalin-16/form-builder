// src/types/formTypes.ts
export type FieldType = 
  | 'text' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date';

export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validations?: ValidationRule[];
  isDerived: boolean;
  parentFields?: string[];
  derivationLogic?: string;
  options?: { label: string; value: string }[];
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
};