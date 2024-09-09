import { saveAs } from 'file-saver';
import axios from 'axios';
import { observer } from 'mobx-react-lite';

const ExportData = observer(({ url ,headers}) => {
    const fetchDataToExport = async () => {
        try {
            if (!url) {
                console.error('Error: URL is not defined.');
                return;
            }
            console.log(`Fetching data from URL: ${url}`); // Debugging statement
            const response = await axios.get(url, { headers });
            if (response.status !== 200) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            console.log('Fetched data:', response.data); // Debugging statement
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const jsonToCSV = (json) => {
        if (!json || json.length === 0) {
            console.error('Error: JSON data is empty or undefined.');
            return '';
        }
        const fields = Object.keys(json[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(fields.join(','));

        // Add rows
        for (const row of json) {
            const values = fields.map(field => {
                let value = row[field];
                if (typeof value === 'number') {
                    value = `="${value}"`;
                } else {
                    value = ('' + value).replace(/"/g, '""'); // Escape double quotes
                }
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    };

    const handleExportToCsvClick = async () => {
        try {
            const data = await fetchDataToExport();
            if (!data || data.length === 0) {
                console.error('No data to export.');
                return;
            }
            const csvData = jsonToCSV(data);
            const blob = new Blob(["\ufeff" + csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'data.csv');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
        }
    };

    return (
        <div>
            <button className="admin-button" onClick={handleExportToCsvClick}>
                Export Data to CSV
            </button>
        </div>
    );
});

export default ExportData;
