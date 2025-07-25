export const exportBugsToCSV = (bugs) => {
  const headers = ['Title', 'Description', 'Status', 'Reported By', 'Created At'];
  const rows = bugs.map((bug) => [
    bug.title,
    bug.description,
    bug.status,
    bug.reportedBy || 'N/A',
    new Date(bug.createdAt).toLocaleString(),
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `bug_report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
