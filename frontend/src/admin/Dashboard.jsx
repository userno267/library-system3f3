import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null); // initially null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>Failed to load stats.</p>; // in case API failed

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">📊 Admin Dashboard</h1>

      {/* Stats Row */}
      <div className="row">
        {/* Total Books */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                Total Books
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_books}</div>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                Users
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_users}</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                Categories
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_categories}</div>
            </div>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                Borrowed Books
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total_borrowed}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
