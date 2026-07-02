import StatusBadge from "./StatusBadge";

export default function DataTable({ columns, data, emptyMessage = "No data found" }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-icon">📭</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container animate-fade-in">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : col.key === "status"
                    ? <StatusBadge status={row[col.key]} />
                    : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
