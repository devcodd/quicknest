import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiActivity,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Appointment",
    value: "123",
    change: "-100%",
    icon: FiCalendar,
    theme: "blue",
  },
  {
    title: "Total Services",
    value: "34",
    change: "+100%",
    icon: FiBriefcase,
    theme: "green",
  },
  {
    title: "Pending Booking",
    value: "27",
    change: "-100%",
    icon: FiClock,
    theme: "red",
  },
  {
    title: "Accepted Booking",
    value: "12",
    change: "0%",
    icon: FiCheckCircle,
    theme: "blue",
  },
  {
    title: "Completed Booking",
    value: "16",
    change: "-100%",
    icon: FiCheckCircle,
    theme: "orange",
  },
  {
    title: "Total Products",
    value: "28",
    change: "-100%",
    icon: FiPackage,
    theme: "indigo",
  },
  {
    title: "Total Providers",
    value: "30",
    change: "-100%",
    icon: FiUsers,
    theme: "purple",
  },
  {
    title: "Total Customers",
    value: "68",
    change: "-100%",
    icon: FiUserCheck,
    theme: "orange",
  },
];

const StatCard = ({ item }) => {
  const Icon = item.icon;

  const positive = item.change.startsWith("+");
  const neutral = item.change === "0%";

  return (
    <div className="card dashboard-stat-card h-100">
      <div className="card-body">
        <div className="d-flex align-items-start">
          <div className={`stat-icon stat-${item.theme}`}>
            <Icon />
          </div>

          <div className="ms-3 flex-grow-1">
            <p className="stat-title mb-1">{item.title}</p>
            <h4 className="stat-value mb-0">{item.value}</h4>
          </div>

          <div className={`mini-bars mini-${item.theme}`}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="stat-change mt-2">
          <span
            className={
              positive
                ? "text-success"
                : neutral
                  ? "text-success"
                  : "text-danger"
            }
          >
            {positive && "+"}
            {item.change.replace("+", "")}
          </span>

          <span className="text-muted ms-1">vs last month</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="container-fluid px-0">
      {/* Heading */}
      <div className="dashboard-title mb-3">
        <h1 className="mb-0">Dashboard</h1>
        <p className="mb-0">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="row g-3">
        {stats.map((item) => (
          <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
            <StatCard item={item} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-6">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
                <div>
                  <h6 className="dashboard-card-title">Earnings Summary</h6>

                  <div className="d-flex align-items-center gap-2">
                    <h4 className="mb-0 fw-bold">$14,832</h4>

                    <span className="dashboard-badge-success">2 Live Data</span>
                  </div>
                </div>

                <div className="chart-legends">
                  <span>
                    <i className="legend-dot provider"></i>
                    Provider
                  </span>

                  <span>
                    <i className="legend-dot handyman"></i>
                    Handyman
                  </span>

                  <span>
                    <i className="legend-dot admin"></i>
                    Admin
                  </span>
                </div>
              </div>

              <div className="chart-placeholder">
                <FiActivity />
                <span>Earnings chart will be added here</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                <div>
                  <h6 className="dashboard-card-title">Sales Overview</h6>

                  <div className="d-flex align-items-center gap-2">
                    <h4 className="mb-0 fw-bold">$14,832</h4>

                    <small className="text-success">
                      ↗ 188.57% vs last year
                    </small>
                  </div>
                </div>

                <div className="chart-legends">
                  <span>
                    <i className="legend-dot provider"></i>
                    Base
                  </span>

                  <span>
                    <i className="legend-dot premium"></i>
                    Premium
                  </span>
                </div>
              </div>

              <div className="chart-placeholder">
                <FiActivity />
                <span>Sales chart will be added here</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="row g-3 mt-1">
        <div className="col-12 col-lg-6">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="donut-section">
                <div className="fake-donut">
                  <div>
                    <strong>Total</strong>
                    <small>100%</small>
                  </div>
                </div>

                <div className="donut-info">
                  <div className="donut-row">
                    <span>
                      <i className="legend-dot provider"></i>
                      Service
                    </span>

                    <strong>66%</strong>
                  </div>

                  <div className="donut-row">
                    <span>
                      <i className="legend-dot light-blue"></i>
                      Product
                    </span>

                    <strong>34%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <h6 className="dashboard-card-title mb-4">Year Summary</h6>

              <div className="year-summary">
                <div className="year-item">
                  <h3>$10,600</h3>
                  <span className="text-success">↗ 193.63%</span>
                  <p>Total Services</p>
                </div>

                <div className="year-item">
                  <h3>$4,232</h3>
                  <span className="text-success">↗ 179.89%</span>
                  <p>Total Products</p>
                </div>

                <div className="year-illustration">💰</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
