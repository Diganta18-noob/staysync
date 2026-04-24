import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Title, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Title, Tooltip, Legend
);

const RevenueChart = ({ labels = [], values = [], loading = false }) => {
  const { currentTheme } = useTheme(); // forces re-render on theme change
  const { h, s } = currentTheme?.primary || { h: 239, s: 84 };
  const primaryColor = `${h} ${s}% 56%`;

  if (loading) {
    return <div className="h-64 skeleton rounded-xl" />;
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: values,
        borderColor: `hsl(${primaryColor})`,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(99, 102, 241, 0.1)';
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `hsl(${primaryColor} / 0.3)`);
          gradient.addColorStop(1, `hsl(${primaryColor} / 0.02)`);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#fff',
        pointBorderColor: `hsl(${primaryColor})`,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `₹${ctx.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#94a3b8',
        },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#94a3b8',
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
