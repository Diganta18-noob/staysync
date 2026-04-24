import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const OccupancyChart = ({ data = [], loading = false }) => {
  if (loading) {
    return <div className="h-56 w-56 mx-auto skeleton rounded-full" />;
  }

  const totalOccupied = data.reduce((sum, d) => sum + d.occupied, 0);
  const totalVacant = data.reduce((sum, d) => sum + d.vacant, 0);

  const chartData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [
      {
        data: [totalOccupied, totalVacant],
        backgroundColor: [
          'hsl(160, 84%, 39%)',  // emerald
          'hsl(220, 14%, 76%)', // surface-300
        ],
        borderColor: [
          'hsl(160, 84%, 35%)',
          'hsl(220, 14%, 70%)',
        ],
        borderWidth: 2,
        cutout: '72%',
        borderRadius: 6,
        spacing: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} rooms`,
        },
      },
    },
  };

  const total = totalOccupied + totalVacant;
  const rate = total > 0 ? Math.round((totalOccupied / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        <Doughnut data={chartData} options={options} />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            {rate}%
          </span>
          <span className="text-xs text-surface-500">Occupied</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-surface-600 dark:text-surface-400">
            Occupied ({totalOccupied})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-surface-300" />
          <span className="text-sm text-surface-600 dark:text-surface-400">
            Vacant ({totalVacant})
          </span>
        </div>
      </div>
    </div>
  );
};

export default OccupancyChart;
