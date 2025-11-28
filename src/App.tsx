import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import ConversionPage from "./pages/ConversionPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import ResultsPage from "./pages/ResultsPage";
import { theme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/conversion" element={<ConversionPage />} />
          <Route path="/conversion/:id" element={<ConversionPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
