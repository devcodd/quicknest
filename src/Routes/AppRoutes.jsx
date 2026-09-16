import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import OrderList from "../pages/orders/OrderList";

import UserList from "../pages/users/UserList";
import ProviderList from "../pages/providers/ProviderList";

import CategoryList from "../pages/categories/CategoryList";
import AddCategory from "../pages/categories/AddCategory";
import EditCategory from "../pages/categories/EditCategory";

import BannerList from "../pages/banner/BannerList";
import AddBanner from "../pages/banner/AddBanner";

import LanguageList from "../pages/language/LanguageList";
import AddLanguage from "../pages/language/AddLanguage";
import EditLanguage from "../pages/language/EditLanguage";

import AddSubcategory from "../pages/subcategories/AddSubcategory";
import SubcategoryList from "../pages/subcategories/SubcategoryList";

import Login from "../pages/auth/Login";
// import CreateUser from "../pages/users/CreateUser";
import CurrencyList from "../pages/currency/CurrencyList";
import CommissionTax from "../pages/platformSettings/CommissionTax";
import StaticPageList from "../pages/staticPages/StaticPageList";
import AddStaticPage from "../pages/staticPages/AddStaticPage";
import EditStaticPage from "../pages/staticPages/EditStaticPage";
import StaticPageDetail from "../pages/staticPages/StaticpageDetail";
import TicketList from "../pages/Tickets/TicketList";
import CustomersList from "../pages/customers/CustomersList";


const AppRoutes = () => {
  return (
    <Routes>
      {/* ==========================================
          PUBLIC ROUTES
      =========================================== */}

      <Route path="/login" element={<Login />} />

      {/* ==========================================
          PROTECTED DASHBOARD
      =========================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ==========================================
            DASHBOARD
        =========================================== */}

        <Route index element={<Dashboard />} />

        {/* ==========================================
            ORDERS
        =========================================== */}

        <Route path="orderlist" element={<OrderList />} />

        {/* ==========================================
            USER MANAGEMENT
        =========================================== */}

        <Route path="users" element={<UserList />} />
        <Route path="providers" element={<ProviderList />} />

        {/* ==========================================
            LANGUAGES
        =========================================== */}

        <Route path="language" element={<LanguageList />} />

        <Route path="language/add" element={<AddLanguage />} />

        <Route path="language/edit/:id" element={<EditLanguage />} />

        {/* ==========================================
            SUB-CATEGORIES
        =========================================== */}

        <Route path="subcategories" element={<SubcategoryList />} />

        <Route path="subcategories/add" element={<AddSubcategory />} />

        {/* ==========================================
            CATEGORIES
        =========================================== */}

        <Route path="categories" element={<CategoryList />} />

        <Route path="categories/add" element={<AddCategory />} />

        <Route path="categories/edit/:id" element={<EditCategory />} />
        {/* Currency */}
        <Route path="currency" element={<CurrencyList />} />
        {/* ==========================================
            BANNERS
        =========================================== */}

        <Route path="banners" element={<BannerList />} />

        <Route path="banners/add" element={<AddBanner />} />
        {/* Commission & Tax */}
        <Route path="commission-tax" element={<CommissionTax />} />

        {/* Static Pages */}
        <Route path="static-pages" element={<StaticPageList />} />

        <Route path="static-pages/add" element={<AddStaticPage />} />
        <Route path="static-pages/edit/:pageId" element={<EditStaticPage />} />
        <Route path="static-pages/view/:slug" element={<StaticPageDetail />} />
        <Route path="/dashboard/tickets" element={<TicketList />} />
        <Route path="/dashboard/customers" element={<CustomersList />} />
      </Route>

      {/* ==========================================
          DEFAULT ROUTE
      =========================================== */}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ==========================================
          404
      =========================================== */}

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
