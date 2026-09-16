import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="app-wrapper">
      {/* ==========================================
          Desktop Sidebar
      =========================================== */}
      <div className="desktop-sidebar d-none d-lg-block">
        <Sidebar />
      </div>

      {/* ==========================================
          Mobile Sidebar
      =========================================== */}
      <div
        className="offcanvas offcanvas-start mobile-sidebar"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header border-bottom">
          <div className="brand">
            <div className="brand-logo">H</div>
            <span>HandyHue</span>
          </div>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body p-0">
          <Sidebar showLogo={false} />
        </div>
      </div>

      {/* ==========================================
          Main Wrapper
      =========================================== */}
      <div className="main-wrapper">
        <Header />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
