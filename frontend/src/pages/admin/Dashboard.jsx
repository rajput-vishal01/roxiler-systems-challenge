import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";

const StatCard = ({ title, value, icon, href }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
      <span className="text-base">{icon}</span>
    </div>
    <div className="text-3xl font-medium tracking-tight mb-4">
      {value ?? "—"}
    </div>
    {href && (
      <Link
        to={href}
        className="inline-flex items-center text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        View all →
      </Link>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch {
        setError("Failed to load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Overview
        </p>
        <h1 className="text-2xl font-medium tracking-tight">Admin Dashboard</h1>
      </div>

      {error && <p className="text-[13px] text-destructive mb-6">{error}</p>}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon="👤"
          href="/admin/users"
        />
        <StatCard
          title="Total Stores"
          value={stats?.totalStores}
          icon="🏪"
          href="/admin/stores"
        />
        <StatCard title="Total Ratings" value={stats?.totalRatings} icon="⭐" />
      </div>
    </div>
  );
};

export default AdminDashboard;
