import {
  FiGrid,
  FiClipboard,
  FiUsers,
  FiUser,
  FiLayers,
  FiBriefcase,
  FiChevronRight,
  FiImage,
  FiGlobe,
  FiDollarSign,
  FiPercent,
  FiFileText,
  FiCreditCard,
} from "react-icons/fi";
import { FiHelpCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarItem = ({
  icon,
  label,
  active = false,
  hasSubmenu = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sidebar-item w-100 border-0 ${active ? "active" : ""}`}
    >
      <span className="sidebar-item-icon">{icon}</span>

      <span className="sidebar-item-label">{label}</span>

      {hasSubmenu && <FiChevronRight className="sidebar-arrow" />}
    </button>
  );
};

const Sidebar = ({ showLogo = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {showLogo && (
        <div className="sidebar-brand">
          <div className="brand">
            <div className="brand-logo">QN</div>
            <span>QuickNest</span>
          </div>
        </div>
      )}

      <div className="sidebar-content">
        {/* ==========================================
            DASHBOARD
        ========================================== */}

        <div className="sidebar-group">
          <div className="sidebar-heading">DASHBOARD</div>

          {/* Dashboard */}
          <SidebarItem
            icon={<FiGrid />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />

          {/* Order List */}
          <SidebarItem
            icon={<FiClipboard />}
            label="Order List"
            active={location.pathname === "/dashboard/orderlist"}
            onClick={() => navigate("/dashboard/orderlist")}
          />
        </div>

        {/* ==========================================
            USER MANAGEMENT
        ========================================== */}

        <div className="sidebar-group">
          <div className="sidebar-heading">USER MANAGEMENT</div>

          {/* All Users */}
          <SidebarItem
            icon={<FiUser />}
            label="All Users"
            active={location.pathname === "/dashboard/users"}
            onClick={() => navigate("/dashboard/users")}
          />

          {/* Customer List */}
          <SidebarItem
            icon={<FiUsers />}
            label="Customers"
            active={location.pathname === "/dashboard/customers"}
            onClick={() => navigate("/dashboard/customers")}
          />

          <SidebarItem
            icon={<FiUser />}
            label="Providers"
            active={location.pathname === "/dashboard/providers"}
            onClick={() => navigate("/dashboard/providers")}
          />
        </div>

        {/* ==========================================
            SERVICE MANAGEMENT
        ========================================== */}

        <div className="sidebar-group">
          <div className="sidebar-heading">SERVICE MANAGEMENT</div>

          {/* Languages */}
          <SidebarItem
            icon={<FiGlobe />}
            label="Languages"
            active={location.pathname.startsWith("/dashboard/language")}
            onClick={() => navigate("/dashboard/language")}
          />

          {/* Categories */}
          <SidebarItem
            icon={<FiLayers />}
            label="Categories"
            active={location.pathname.startsWith("/dashboard/categories")}
            onClick={() => navigate("/dashboard/categories")}
          />

          <SidebarItem
            icon={<FiLayers />}
            label="SubCategories"
            active={location.pathname.startsWith("/dashboard/subcategories")}
            onClick={() => navigate("/dashboard/subcategories")}
          />

          {/* Banner */}
          <SidebarItem
            icon={<FiImage />}
            label="Banner"
            active={location.pathname.startsWith("/dashboard/banners")}
            onClick={() => navigate("/dashboard/banners")}
          />
          <SidebarItem
            icon={<FiPercent />}
            label="Commission & Tax"
            active={location.pathname === "/dashboard/commission-tax"}
            onClick={() => navigate("/dashboard/commission-tax")}
          />
          <SidebarItem
            icon={<FiFileText />}
            label="Static Pages"
            active={location.pathname === "/dashboard/static-pages"}
            onClick={() => navigate("/dashboard/static-pages")}
          />
          <SidebarItem
            icon={<FiDollarSign />}
            label="Currency"
            active={location.pathname === "/dashboard/currency"}
            onClick={() => navigate("/dashboard/currency")}
          />
          {/* Services */}
          <SidebarItem
            icon={<FiBriefcase />}
            label="Services"
            hasSubmenu
            active={location.pathname.startsWith("/dashboard/services")}
            onClick={() => navigate("/dashboard/services")}
          />
          <SidebarItem
            icon={<FiCreditCard />}
            label="Payment Gateway"
            active={location.pathname === "/dashboard/payment-gateway"}
            onClick={() => navigate("/dashboard/payment-gateway")}
          />
          <SidebarItem
            icon={<FiHelpCircle />}
            label="Support Tickets"
            active={location.pathname === "/dashboard/tickets"}
            onClick={() => navigate("/dashboard/tickets")}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
