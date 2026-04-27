import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";

const roleLabel = {
  ADMIN: "Admin",
  USER: "User",
  STORE_OWNER: "Store Owner",
};

const Navbar = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    clearAuth();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "USER") return "/user/stores";
    if (user.role === "STORE_OWNER") return "/store-owner/dashboard";
    return "/";
  };

  const getPasswordLink = () => {
    if (user?.role === "USER") return "/user/password";
    if (user?.role === "STORE_OWNER") return "/store-owner/password";
    return null;
  };

  const passwordLink = getPasswordLink();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-[11px] font-medium">R</span>
          </div>
          <span className="text-sm font-medium tracking-tight">Roxiler</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="h-8 px-3 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center cursor-pointer"
              >
                Dashboard
              </Link>

              {passwordLink && (
                <Link
                  to={passwordLink}
                  className="h-8 px-3 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center cursor-pointer"
                >
                  Password
                </Link>
              )}

              <div className="w-px h-4 bg-border mx-1" />

              {/* Avatar + name */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[11px] font-medium text-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-[13px] font-medium">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    {roleLabel[user.role] ?? user.role}
                  </span>
                </div>
              </div>

              <div className="w-px h-4 bg-border mx-1" />

              <button
                onClick={handleLogout}
                className="h-8 px-3 rounded-lg border border-border text-[13px] text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="h-8 px-3 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="h-8 px-3 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-85 transition-opacity flex items-center cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
