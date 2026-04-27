import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const addUserSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(60, "Max 60 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8)
    .max(16)
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Need special character"),
  address: z.string().max(400, "Max 400 characters"),
  role: z.enum(["USER", "ADMIN", "STORE_OWNER"]),
});

const roleStyles = {
  ADMIN: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  USER: "bg-muted text-muted-foreground border-border hover:bg-muted",
  STORE_OWNER: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
};

const roleLabel = { ADMIN: "Admin", USER: "User", STORE_OWNER: "Store Owner" };

const SortIcon = ({ field, sortBy, order }) => (
  <span className="ml-1 text-muted-foreground text-[11px]">
    {sortBy !== field ? "↕" : order === "asc" ? "↑" : "↓"}
  </span>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addUserSchema),
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        params: { ...filters, sortBy, order },
      });
      setUsers(res.data.users);
    } catch {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onAddUser = async (data) => {
    try {
      await api.post("/admin/users", data);
      reset();
      setOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Management
          </p>
          <h1 className="text-2xl font-medium tracking-tight">Users</h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 bg-foreground text-background text-[13px] font-medium hover:opacity-85 hover:bg-foreground transition-opacity cursor-pointer rounded-lg">
              + Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm rounded-xl border border-border bg-background p-6 shadow-none">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-base font-medium tracking-tight">
                Add New User
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onAddUser)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Name</label>
                <Input
                  placeholder="Min 2 characters full name"
                  {...register("name")}
                  className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
                />
                {errors.name && (
                  <p className="text-[12px] text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  {...register("email")}
                  className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
                />
                {errors.email && (
                  <p className="text-[12px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Password@1"
                  {...register("password")}
                  className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
                />
                {errors.password && (
                  <p className="text-[12px] text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Address</label>
                <Input
                  placeholder="123 Street, City"
                  {...register("address")}
                  className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
                />
                {errors.address && (
                  <p className="text-[12px] text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Role</label>
                <select
                  {...register("role")}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors cursor-pointer"
                >
                  <option value="">Select role</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
                {errors.role && (
                  <p className="text-[12px] text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {error && <p className="text-[12px] text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-9 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-85 hover:bg-foreground transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-[12px] text-destructive mb-4">{error}</p>}

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {[
          { key: "name", placeholder: "Filter by name" },
          { key: "email", placeholder: "Filter by email" },
          { key: "address", placeholder: "Filter by address" },
        ].map(({ key, placeholder }) => (
          <Input
            key={key}
            placeholder={placeholder}
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
          />
        ))}
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors cursor-pointer"
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {["name", "email", "address", "role"].map((field) => (
                <TableHead
                  key={field}
                  onClick={() => handleSort(field)}
                  className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors px-4 py-3"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <SortIcon field={field} sortBy={sortBy} order={order} />
                </TableHead>
              ))}
              <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-[13px] text-muted-foreground py-12"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-[13px] font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground max-w-[200px] truncate">
                    {user.address}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      className={`text-[11px] font-medium border px-2 py-0.5 rounded-md ${roleStyles[user.role]}`}
                    >
                      {roleLabel[user.role] ?? user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
