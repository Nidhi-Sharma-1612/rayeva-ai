import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CategorizerPage from "./pages/CategorizerPage";
import ProposalPage from "./pages/ProposalPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/categorizer" />} />
        <Route path="/categorizer" element={<CategorizerPage />} />
        <Route path="/proposal" element={<ProposalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
