import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import api from "@/api/axios";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl cursor-pointer"
        >
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-muted-foreground"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

const SortIcon = ({ field, sortBy, order }) => (
  <span className="ml-1 text-muted-foreground text-[11px]">
    {sortBy !== field ? "↕" : order === "asc" ? "↑" : "↓"}
  </span>
);

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingError, setRatingError] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchStores = async () => {
    try {
      const res = await api.get("/user/stores", { params: { ...filters, sortBy, order } });
      setStores(res.data.stores);
    } catch {
      setError("Failed to load stores");
    }
  };

  useEffect(() => { fetchStores(); }, [filters, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else { setSortBy(field); setOrder("asc"); }
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating ?? 0);
    setRatingError("");
    setModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!ratingValue) { setRatingError("Please select a rating"); return; }
    setRatingLoading(true);
    try {
      if (selectedStore.userRating) {
        await api.put("/user/ratings", { storeId: selectedStore.id, value: ratingValue });
      } else {
        await api.post("/user/ratings", { storeId: selectedStore.id, value: ratingValue });
      }
      setModalOpen(false);
      fetchStores();
    } catch (err) {
      setRatingError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Browse
        </p>
        <h1 className="text-2xl font-medium tracking-tight">Stores</h1>
      </div>

      {error && <p className="text-[12px] text-destructive mb-4">{error}</p>}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        <Input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
        />
        <Input
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {[
                { field: "name", label: "Store Name" },
                { field: "address", label: "Address" },
              ].map(({ field, label }) => (
                <TableHead
                  key={field}
                  onClick={() => handleSort(field)}
                  className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors px-4 py-3"
                >
                  {label}
                  <SortIcon field={field} sortBy={sortBy} order={order} />
                </TableHead>
              ))}
              <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                Overall Rating
              </TableHead>
              <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                Your Rating
              </TableHead>
              <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-[13px] text-muted-foreground py-12">
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => (
                <TableRow key={store.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="px-4 py-3 text-[13px] font-medium">{store.name}</TableCell>
                  <TableCell className="px-4 py-3 text-[13px] text-muted-foreground max-w-[200px] truncate">
                    {store.address}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {store.overallRating ? (
                      <span className="text-[13px] font-medium">⭐ {store.overallRating}</span>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {store.userRating ? (
                      <span className="text-[13px] font-medium text-yellow-500">★ {store.userRating}</span>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">Not rated</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      size="sm"
                      onClick={() => openRatingModal(store)}
                      className={
                        store.userRating
                          ? "h-7 px-3 rounded-lg border border-border bg-background text-foreground text-[12px] hover:bg-muted hover:bg-background transition-colors cursor-pointer"
                          : "h-7 px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:opacity-85 hover:bg-foreground transition-opacity cursor-pointer"
                      }
                    >
                      {store.userRating ? "Edit Rating" : "Rate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rating Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm rounded-xl border border-border bg-background p-6 shadow-none">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base font-medium tracking-tight">
              {selectedStore?.userRating ? "Update Rating" : "Submit Rating"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-muted-foreground">
              Rating for{" "}
              <span className="font-medium text-foreground">{selectedStore?.name}</span>
            </p>

            <div className="flex justify-center py-2">
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>

            <p className="text-center text-[12px] text-muted-foreground">
              {ratingValue > 0
                ? `You selected ${ratingValue} star${ratingValue > 1 ? "s" : ""}`
                : "Click to rate"}
            </p>

            {ratingError && (
              <p className="text-[12px] text-destructive text-center">{ratingError}</p>
            )}

            <Button
              onClick={handleSubmitRating}
              disabled={ratingLoading}
              className="h-9 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-85 hover:bg-foreground transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {ratingLoading ? "Submitting..." : selectedStore?.userRating ? "Update" : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserStores;