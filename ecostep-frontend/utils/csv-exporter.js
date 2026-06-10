import { toast } from 'sonner';
import { formatActivityDate } from './date-formatter';

const CSV_HEADERS = ['Date', 'Category', 'Type', 'Quantity', 'CO2 (kg)'];
const CSV_FILE_NAME = 'ecostep_activities.csv';

/**
 * Converts a single activity record into a CSV row array.
 * @param {Object} activity - An activity object from the API
 * @returns {Array} Row values in column order
 */
function mapActivityToCsvRow(activity) {
  return [
    formatActivityDate(activity.date),
    activity.category,
    activity.type,
    activity.quantity,
    activity.co2.toFixed(2),
  ];
}

/**
 * Triggers a CSV file download of the provided activities in the user's browser.
 * @param {Array<Object>} activities - List of activity objects to export
 * @returns {void}
 */
export function downloadActivitiesAsCsv(activities) {
  const rows = activities.map(mapActivityToCsvRow);
  const csvContent = [CSV_HEADERS, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const downloadUrl = URL.createObjectURL(blob);

  // Programmatically click a temporary anchor to trigger the download
  const tempAnchor = document.createElement('a');
  tempAnchor.href = downloadUrl;
  tempAnchor.download = CSV_FILE_NAME;
  tempAnchor.click();

  URL.revokeObjectURL(downloadUrl);
  toast.success('CSV downloaded!');
}
