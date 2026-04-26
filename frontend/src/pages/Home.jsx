import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const features = [
  {
    icon: "⭐",
    title: "Rate Stores",
    description:
      "Submit and manage ratings from 1 to 5 for any registered store on the platform.",
  },
  {
    icon: "🏪",
    title: "Discover Stores",
    description:
      "Browse all registered stores, search by name or address and see overall ratings.",
  },
  {
    icon: "📊",
    title: "Owner Dashboard",
    description:
      "Store owners get a dedicated dashboard to track ratings and customer feedback.",
  },
  {
    icon: "🛡️",
    title: "Role Based Access",
    description:
      "Three distinct roles — Admin, User, and Store Owner — each with their own experience.",
  },
];

const stats = [
  { num: "1–5", label: "Rating scale" },
  { num: "3", label: "User roles" },
  { num: "∞", label: "Stores" },
];

const Home = () => {
  const { user } = useAuthStore();

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "USER") return "/user/stores";
    if (user?.role === "STORE_OWNER") return "/store-owner/dashboard";
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 border-b border-border">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium tracking-widest uppercase bg-muted text-muted-foreground border border-border mb-6">
          Store Rating Platform
        </span>

        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.15] max-w-lg mb-4">
          Rate Stores.{" "}
          <span className="text-muted-foreground">Share Feedback.</span>
        </h1>

        <p className="text-[15px] text-muted-foreground max-w-sm leading-relaxed mb-8">
          Roxiler helps users discover and rate stores, while giving store
          owners real-time insight into their performance.
        </p>

        <div className="flex gap-2 flex-wrap justify-center">
          {user ? (
            <Link
              to={getDashboardLink()}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity cursor-pointer"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto w-full px-6 py-14">
        <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-muted-foreground text-center mb-8">
          What's included
        </p>

        {/* Stats */}
        <div className="flex gap-3 justify-center flex-wrap mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-muted rounded-lg px-5 py-3 text-center min-w-[88px]"
            >
              <span className="block text-xl font-medium">{s.num}</span>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-sm mb-3">
                {f.icon}
              </div>
              <h3 className="text-[13px] font-medium mb-1.5">{f.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="border-t border-border px-6 py-14 flex flex-col items-center text-center">
          <h2 className="text-xl font-medium tracking-tight mb-2">
            Ready to get started?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create your free account and start rating stores today.
          </p>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-85 transition-opacity cursor-pointer"
          >
            Create Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
