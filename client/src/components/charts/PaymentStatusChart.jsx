import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentStatusChart = ({ counts = {}, loading = false }) => {
  if (loading) {
    return <div className="h-56 skeleton rounded-xl" />;
  }

  const data = {
    labels: ['Paid', 'Pending', 'Overdue', 'Partial'],
    datasets: [
      {
        label: 'Payments',
        data: [
          counts.paid || 0,
          counts.pending || 0,
          counts.overdue || 0,
          counts.partial || 0,
        ],
        backgroundColor: [
          'hsla(160, 84%, 39%, 0.8)',   // emerald
          'hsla(38, 92%, 50%, 0.8)',    // amber
          'hsla(0, 72%, 51%, 0.8)',     // red
          'hsla(199, 89%, 48%, 0.8)',   // cyan
        ],
        borderColor: [
          'hsl(160, 84%, 39%)',
          'hsl(38, 92%, 50%)',
          'hsl(0, 72%, 51%)',
          'hsl(199, 89%, 48%)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
          label: (ctx) => `${ctx.raw} payments`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#94a3b8',
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-56">
      <Bar data={data} options={options} />
    </div>
  );
};

export default PaymentStatusChart;
