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
import OtpPage from "../src/otp_page/OtpPage.jsx";
import ForgotPassword from "../src/password_reset/ForgotPassword.jsx";
import ResetPassword from "../src/password_reset/ResetPassword.jsx";
import AccountPage from "./account/AccountPage.jsx";
import StartPage from "./pages/StartPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpPage />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password" element={<ResetPassword />} /> 
       
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="add-book" element={<AddBookPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="liked-books" element={<LikedBooksPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  </StrictMode>
);
