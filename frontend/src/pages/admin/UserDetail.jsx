import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";

const roleStyles = {
  ADMIN: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  USER: "bg-muted text-muted-foreground border-border hover:bg-muted",
  STORE_OWNER: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
};

const roleLabel = { ADMIN: "Admin", USER: "User", STORE_OWNER: "Store Owner" };

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
    <p className="text-[14px] font-medium">{value || "—"}</p>
  </div>
);

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data.user);
      } catch {
        setError("Failed to load user");
      }
    };
    fetchUser();
  }, [id]);

  if (error)
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-[13px] text-destructive mb-4">{error}</p>
        <Button
          onClick={() => navigate("/admin/users")}
          className="h-9 px-4 rounded-lg border border-border bg-background text-foreground text-[13px] hover:bg-muted transition-colors cursor-pointer"
        >
          ← Back to Users
        </Button>
      </div>
    );

  if (!user)
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-[13px] text-muted-foreground">Loading...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="h-8 px-3 rounded-lg border border-border text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Management
          </p>
          <h1 className="text-2xl font-medium tracking-tight leading-none mt-0.5">
            User Detail
          </h1>
        </div>
      </div>

      {/* Card */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Card header — avatar + name + role */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[15px] font-medium text-foreground">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-medium leading-none">
                {user.name}
              </p>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
          <Badge
            className={`text-[11px] font-medium border px-2 py-0.5 rounded-md ${roleStyles[user.role]}`}
          >
            {roleLabel[user.role] ?? user.role}
          </Badge>
        </div>

        {/* Fields grid */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Email" value={user.email} />
          <Field label="Role" value={roleLabel[user.role] ?? user.role} />
          <Field label="Address" value={user.address} />
          {user.role === "STORE_OWNER" && (
            <Field
              label="Store Average Rating"
              value={
                user.averageRating
                  ? `${user.averageRating} / 5`
                  : "No ratings yet"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
