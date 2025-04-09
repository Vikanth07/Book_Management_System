import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "../src/landing_page/login/LoginPage.jsx";
import SignupPage from "../src/landing_page/signup/SignupPage.jsx";
import DashboardLayout from "./DashboardLayout.jsx";
import HomePage from "../src/home_page/HomePage.jsx";
import AddBookPage from "../src/addBook_page/AddBookPage.jsx";
import RecommendationsPage from '../src/recommendations_page/Recommendations_page.jsx';
import LikedBooksPage from '../src/liked_books/LikedBooksPage.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="add-book" element={<AddBookPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="liked-books" element={<LikedBooksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>
);
