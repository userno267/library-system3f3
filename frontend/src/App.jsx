import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import VerifyEmail from "./pages/VerifyEmail";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookForm from "./pages/BookForm";
import MyBorrows from "./pages/MyBorrows";
import PdfViewer from "./pages/PdfViewer";
import BorrowRecords from "./pages/BorrowRecords";
import NotificationsPage from "./pages/NotificationsPage";
import Dashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";


<Route path="/assistant" element={<Chatbot />} />

export default function App() {
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id || 0;

  return (
    <Routes>
      {/* Home page now WITHOUT sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/my-borrows" element={<MyBorrows userId={currentUserId} />} />
       
<Route path="/assistant" element={<Chatbot />} />
      {/* Pages WITHOUT sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books/add" element={<BookForm />} />
      <Route path="/books/edit/:id" element={<BookForm />} />
      <Route path="/view-pdf/:id" element={<PdfViewer />} />
<Route path="/admin/borrow-records" element={<BorrowRecords />} />
 <Route path="/notifications" element={<NotificationsPage />} />

<Route path="/verify/:token" element={<VerifyEmail />} />

      {/* Admin Dashboard — separate page */}
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}
