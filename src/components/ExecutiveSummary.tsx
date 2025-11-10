// src/components/ExecutiveSummary.tsx
import { useMemo } from "react";
import { CSVLink } from "react-csv";

interface ExecutiveSummaryProps {
  data: any[];
  title: string;
}

export default function ExecutiveSummary({ data, title }: ExecutiveSummaryProps) {
  const now = new Date();
  const currentYear = now.getFullYear();

   // ✅ Recompute active/past status for accuracy
  const processedData = useMemo(() => {
    return data.map((u) => {
      const endDateStr = u.role?.termEndDate || u.role?.termEnd;
      if (!endDateStr) return { ...u, _computedActive: true };
      const endYear = new Date(endDateStr).getFullYear();
      const isActive = endYear >= currentYear;
      return { ...u, _computedActive: isActive };
    });
  }, [data, currentYear]);

  // 🧮 Group by termStart–termEnd (yearly)
  const summary = useMemo(() => {
    const grouped: Record<string, number> = {};
    processedData.forEach((u) => {
      const formatYear = (d?: string) =>
        d ? new Date(d).getFullYear().toString() : "";
      const start =
        formatYear(u.role?.termStartDate || u.role?.termStart) || "Unknown";
      const end = formatYear(u.role?.termEndDate || u.role?.termEnd) || "";
      const label = end ? `${start}–${end}` : start;
      grouped[label] = (grouped[label] || 0) + 1;
    });
    return grouped;
  }, [processedData]);

  // 🧾 Prepare CSV export
  const csvData = Object.entries(summary).map(([term, count]) => ({
    Term: term,
    Count: count,
  }));

  // ✅ Calculate totals
  const total = processedData.length;
  const current = processedData.filter((u) => u._computedActive).length;
  const past = total - current;

  return (
    <div
      className="p-3 rounded mb-4 shadow-sm"
      style={{
        backgroundColor: "#006b3f", // NDC green
        color: "white",
        border: "2px solid #e61a23", // NDC red
      }}
    >
      <h5 className="fw-bold mb-3">{title}</h5>
    
      {/* ✅ Clean single summary card — no duplicate lists */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          fontWeight: 700,
          lineHeight: 1.6,
        }}
      >

      <div>
          🌍 <span style={{ color: "#fff" }}>Total:</span>{" "}
          <span style={{ color: "#ffd700", fontSize: "1.1rem" }}>{total}</span>
        </div>
        <div>
          ✅ <span style={{ color: "#fff" }}>Current:</span>{" "}
          <span style={{ color: "#00ff00", fontSize: "1.1rem" }}>{current}</span>
        </div>
        <div>
          🕰 <span style={{ color: "#fff" }}>Past:</span>{" "}
          <span style={{ color: "#ccc", fontSize: "1.1rem" }}>{past}</span>
        </div>
      </div>

      <CSVLink
        data={csvData}
        filename={`${title.replace(/\s+/g, "_")}_Summary.csv`}
        className="btn btn-light btn-sm fw-bold"
        style={{ color: "#0d6efd" }}
      >
        ⬇️ Download CSV
      </CSVLink>
    </div>
  );
}

