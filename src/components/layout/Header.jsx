import { FiBell, FiMenu, FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { logout } from "../../Utils/auth";

const Header = () => {
  const navigate = useNavigate();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    // Clear authentication data
    logout();

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="top-header">
      <div className="container-fluid h-100">
        <div className="d-flex align-items-center justify-content-between h-100">
          {/* ======================================
              LEFT
          ======================================= */}

          <div className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1">
            <button
              className="btn header-menu-btn d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileSidebar"
              aria-controls="mobileSidebar"
            >
              <FiMenu />
            </button>

            <div className="header-search d-none d-sm-flex">
              <FiSearch className="search-icon" />

              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search your page..."
              />

              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="d-sm-none mobile-brand">
              <div className="brand">
                <div className="brand-logo">QN</div>

                <span>QuickNest</span>
              </div>
            </div>
          </div>

          {/* ======================================
              RIGHT
          ======================================= */}

          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Notification */}

            <button type="button" className="btn header-action-btn">
              <FiBell />
            </button>

            {/* Logout / User */}

            <button
              type="button"
              className="btn header-avatar"
              onClick={handleLogout}
              title="Logout"
            >
              <FiUser />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
