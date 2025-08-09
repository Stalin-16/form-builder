import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateFormPage from "../pages/CreateFormPage";
import MyFormsPage from "../pages/MyFormsPage";
import PreviewPage from "../pages/PreviewPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create"  element={<CreateFormPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/myforms" element={<MyFormsPage />} />
        <Route path="/" element={<MyFormsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
