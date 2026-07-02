import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import DataTable from "../../components/DataTable";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [cgpaFilter, setCgpaFilter] = useState("ALL");

  useEffect(() => {
    api.get("/students")
      .then((res) => setStudents(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const branches = useMemo(() => {
    const set = new Set(students.map((s) => s.branch).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.rollNumber?.toLowerCase().includes(q);
      const matchBranch = branchFilter === "ALL" || s.branch === branchFilter;
      const matchCgpa =
        cgpaFilter === "ALL" ||
        (cgpaFilter === "9+" && s.cgpa >= 9) ||
        (cgpaFilter === "8+" && s.cgpa >= 8) ||
        (cgpaFilter === "7+" && s.cgpa >= 7) ||
        (cgpaFilter === "<7" && s.cgpa < 7);
      return matchSearch && matchBranch && matchCgpa;
    });
  }, [students, search, branchFilter, cgpaFilter]);

  const columns = [
    { key: "id", header: "#" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "rollNumber", header: "Roll No" },
    { key: "branch", header: "Branch" },
    { key: "cgpa", header: "CGPA" },
    { key: "yearOfPassing", header: "Year" },
    {
      key: "hasBacklog",
      header: "Backlog",
      render: (val) => (
        <span className={`badge ${val ? "badge-danger" : "badge-success"}`}>
          {val ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="Students">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Manage Students 🎓</h1>
        <p className="page-subtitle">
          {filtered.length} of {students.length} students
        </p>
      </div>

      {/* Filters */}
      <div className="students-filters animate-fade-in delay-1">
        <div className="filter-search-wrap">
          <span className="filter-search-icon">🔍</span>
          <input
            type="text"
            className="form-input filter-search-input"
            placeholder="Search by name, email, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="filter-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>
        <select
          className="form-select filter-select"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>{b === "ALL" ? "All Branches" : b}</option>
          ))}
        </select>
        <select
          className="form-select filter-select"
          value={cgpaFilter}
          onChange={(e) => setCgpaFilter(e.target.value)}
        >
          <option value="ALL">All CGPAs</option>
          <option value="9+">≥ 9.0</option>
          <option value="8+">≥ 8.0</option>
          <option value="7+">≥ 7.0</option>
          <option value="<7">&lt; 7.0</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage={search || branchFilter !== "ALL" ? "No students match your filters." : "No students registered yet."}
        />
      )}

      <style>{`
        .students-filters {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }
        .filter-search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .filter-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          pointer-events: none;
          opacity: 0.6;
        }
        .filter-search-input {
          padding-left: 36px !important;
        }
        .filter-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
        }
        .filter-select {
          min-width: 140px;
          flex-shrink: 0;
        }
      `}</style>
    </DashboardLayout>
  );
}
