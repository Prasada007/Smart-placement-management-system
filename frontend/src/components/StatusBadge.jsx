export default function StatusBadge({ status }) {
  const config = {
    // Application statuses
    APPLIED: { className: "badge-info", label: "Applied" },
    SHORTLISTED: { className: "badge-warning", label: "Shortlisted" },
    SELECTED: { className: "badge-success", label: "Selected" },
    REJECTED: { className: "badge-danger", label: "Rejected" },
    // Drive statuses
    UPCOMING: { className: "badge-info", label: "Upcoming" },
    ONGOING: { className: "badge-warning", label: "Ongoing" },
    COMPLETED: { className: "badge-success", label: "Completed" },
    CANCELLED: { className: "badge-danger", label: "Cancelled" },
    // Company statuses
    PENDING: { className: "badge-warning", label: "Pending" },
    APPROVED: { className: "badge-success", label: "Approved" },
  };

  const { className, label } = config[status] || {
    className: "badge-accent",
    label: status,
  };

  return <span className={`badge ${className}`}>{label}</span>;
}
