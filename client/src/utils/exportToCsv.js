/**
 * Universal CSV Export Helper for UniConnect
 * @param {string} filename - Desired download file name (without .csv)
 * @param {Array<Object>} rows - Data array to export
 */
export const exportToCsv = (filename, rows) => {
    if (!rows || !rows.length) {
        alert('No data available to export.');
        return;
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
        headers.join(','),
        ...rows.map(row => 
            headers.map(header => {
                const val = row[header] !== undefined && row[header] !== null ? row[header] : '';
                return `"${val.toString().replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
