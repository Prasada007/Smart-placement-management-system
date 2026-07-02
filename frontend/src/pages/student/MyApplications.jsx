import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import DataTable from "../../components/DataTable";

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/student/${user.id}`)
      .then((res) => setApplications(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user.id]);

  const columns = [
    {
      key: "company",
      header: "Company",
      render: (_, row) => row.drive?.company?.name || "—",
    },
    {
      key: "jobRole",
      header: "Role",
      render: (_, row) => row.drive?.company?.jobRole || "—",
    },
    {
      key: "salary",
      header: "Salary",
      render: (_, row) =>
        row.drive?.company?.salaryLpa
          ? `₹${row.drive.company.salaryLpa} LPA`
          : "—",
    },
    {
      key: "testDate",
      header: "Test Date",
      render: (_, row) => row.drive?.testDate || "TBD",
    },
    {
      key: "appliedAt",
      header: "Applied On",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
    },
    {
      key: "status",
      header: "Status",
    },
  ];

  return (
    <DashboardLayout pageTitle="My Applications">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">My Applications 📋</h1>
        <p className="page-subtitle">
          Track the status of your placement applications
        </p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
      ) : (
        <DataTable
          columns={columns}
          data={applications}
          emptyMessage="You haven't applied to any drives yet."
        />
      )}
    </DashboardLayout>
  );
}
