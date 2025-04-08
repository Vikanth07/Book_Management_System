import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "../src/landing_page/login/LoginPage.jsx";
import SignupPage from "../src/landing_page/signup/SignupPage.jsx";
import HomePage from "../src/home_page/HomePage.jsx";
import AddBookPage from "../src/addBook_page/AddBookPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add-book" element={<AddBookPage />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>
);
