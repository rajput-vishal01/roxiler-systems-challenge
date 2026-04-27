import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import api from "@/api/axios";

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/store-owner/dashboard");
        setData(res.data.store);
      } catch {
        setError("Failed to load dashboard");
      }
    };
    fetchDashboard();
  }, []);

  if (error) return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-[13px] text-destructive">{error}</p>
    </div>
  );

  if (!data) return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-[13px] text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Store Owner
        </p>
        <h1 className="text-2xl font-medium tracking-tight">{data.name}</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Average Rating
          </p>
          <div className="text-3xl font-medium tracking-tight mb-1">
            {data.averageRating ?? "—"}
          </div>
          <p className="text-[12px] text-muted-foreground">out of 5</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Total Ratings
          </p>
          <div className="text-3xl font-medium tracking-tight mb-1">
            {data.raters.length}
          </div>
          <p className="text-[12px] text-muted-foreground">users rated</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Store Address
          </p>
          <p className="text-[13px] font-medium leading-snug">{data.address}</p>
        </div>
      </div>

      {/* Raters table */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Users Who Rated Your Store
        </p>
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                  Name
                </TableHead>
                <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                  Email
                </TableHead>
                <TableHead className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">
                  Rating Given
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.raters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-[13px] text-muted-foreground py-12">
                    No ratings yet
                  </TableCell>
                </TableRow>
              ) : (
                data.raters.map((rater) => (
                  <TableRow key={rater.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-4 py-3 text-[13px] font-medium">{rater.name}</TableCell>
                    <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">{rater.email}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>
                          <span className="text-yellow-400">{"★".repeat(rater.ratingGiven)}</span>
                          <span className="text-muted-foreground">{"★".repeat(5 - rater.ratingGiven)}</span>
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          ({rater.ratingGiven}/5)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;