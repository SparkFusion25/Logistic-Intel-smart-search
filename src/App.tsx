
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Home from "@/routes/Home";
import About from "@/routes/About";
import Pricing from "@/routes/Pricing";
import BlogIndex from "@/routes/BlogIndex";
import BlogArticle from "@/routes/BlogArticle";
import BlogCategory from "@/routes/BlogCategory";
import BlogTag from "@/routes/BlogTag";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/blog/category/:slug" element={<BlogCategory />} />
          <Route path="/blog/tag/:slug" element={<BlogTag />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}
