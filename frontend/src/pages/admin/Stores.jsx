import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const addStoreSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(60, "Max 60 characters"),
  email: z.string().email("Invalid email"),
  address: z.string().max(400, "Max 400 characters"),
  ownerId: z.coerce.number({ required_error: "Owner ID is required" }),
});

const SortIcon = ({ field, sortBy, order }) => (
  <span className="ml-1 text-muted-foreground text-[11px]">
    {sortBy !== field ? "↕" : order === "asc" ? "↑" : "↓"}
  </span>
);

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
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
    resolver: zodResolver(addStoreSchema),
  });

  const fetchStores = async () => {
    try {
      const res = await api.get("/admin/stores", {
        params: { ...filters, sortBy, order },
      });
      setStores(res.data.stores);
    } catch {
      setError("Failed to load stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const onAddStore = async (data) => {
    try {
      await api.post("/admin/stores", data);
      reset();
      setOpen(false);
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add store");
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
          <h1 className="text-2xl font-medium tracking-tight">Stores</h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 bg-foreground text-background text-[13px] font-medium hover:opacity-85 hover:bg-foreground transition-opacity cursor-pointer rounded-lg">
              + Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm rounded-xl border border-border bg-background p-6 shadow-none">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-base font-medium tracking-tight">
                Add New Store
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onAddStore)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium">Store Name</label>
                <Input
                  placeholder="Min 2 characters store name"
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
                  placeholder="store@example.com"
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
                <label className="text-[13px] font-medium">Address</label>
                <Input
                  placeholder="123 Store Street, City"
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
                <label className="text-[13px] font-medium">Owner ID</label>
                <Input
                  type="number"
                  placeholder="Enter store owner's user ID"
                  {...register("ownerId")}
                  className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
                />
                {errors.ownerId ? (
                  <p className="text-[12px] text-destructive">
                    {errors.ownerId.message}
                  </p>
                ) : (
                  <p className="text-[12px] text-muted-foreground">
                    Must be a user with STORE_OWNER role
                  </p>
                )}
              </div>

              {error && <p className="text-[12px] text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-9 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-85 hover:bg-foreground transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Store"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-[12px] text-destructive mb-4">{error}</p>}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
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
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {["name", "email", "address"].map((field) => (
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
                Rating
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-[13px] text-muted-foreground py-12"
                >
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => (
                <TableRow
                  key={store.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-[13px] font-medium">
                    {store.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">
                    {store.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground max-w-[200px] truncate">
                    {store.address}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {store.averageRating ? (
                      <span className="text-[13px] font-medium">
                        ⭐ {store.averageRating}
                      </span>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">
                        No ratings
                      </span>
                    )}
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

export default AdminStores;
