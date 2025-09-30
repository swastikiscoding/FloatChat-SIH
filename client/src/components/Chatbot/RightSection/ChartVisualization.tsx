import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PlotData {
  title: string;
  kind: string;
  x_label: string;
  y_label: string;
  x: (number | string)[];
  y: (number | string)[];
  x_type?: string;
  y_type?: string;
}

interface ChartVisualizationProps {
  plotsData: PlotData[];
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ plotsData }) => {
  if (!plotsData || plotsData.length === 0) {
    return null;
  }

  const getChartColors = (index: number) => {
    const colorSets = [
      {
        background: 'rgba(6, 182, 212, 0.1)', // cyan with transparency
        border: '#06b6d4', // cyan
        point: '#06b6d4',
      },
      {
        background: 'rgba(16, 185, 129, 0.1)', // emerald with transparency
        border: '#10b981', // emerald
        point: '#10b981',
      },
      {
        background: 'rgba(245, 158, 11, 0.1)', // amber with transparency
        border: '#f59e0b', // amber
        point: '#f59e0b',
      },
      {
        background: 'rgba(239, 68, 68, 0.1)', // red with transparency
        border: '#ef4444', // red
        point: '#ef4444',
      },
      {
        background: 'rgba(139, 92, 246, 0.1)', // violet with transparency
        border: '#8b5cf6', // violet
        point: '#8b5cf6',
      },
      {
        background: 'rgba(236, 72, 153, 0.1)', // pink with transparency
        border: '#ec4899', // pink
        point: '#ec4899',
      },
    ];
    return colorSets[index % colorSets.length];
  };

  // Common chart options that match the chatbot theme
  const getChartOptions = (data: PlotData) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      title: {
        display: false, // We'll use custom title
      },
      tooltip: {
        backgroundColor: 'rgba(15, 17, 26, 0.95)', // Dark background
        titleColor: '#06b6d4', // Cyan title
        bodyColor: '#d1d5db', // Light gray text
        borderColor: '#06b6d4',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: unknown[]) => {
            const ctx = context[0] as { label: string };
            return `${data.x_label}: ${ctx.label}`;
          },
          label: (context: { parsed: { y: number } }) => `${data.y_label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)', // Subtle grid lines
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af', // Gray text
          font: {
            size: 11,
          },
          maxTicksLimit: 8, // Limit number of ticks
        },
        title: {
          display: true,
          text: data.x_label,
          color: '#06b6d4', // Cyan
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)', // Subtle grid lines
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af', // Gray text
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: data.y_label,
          color: '#06b6d4', // Cyan
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  });

  const renderLineChart = (data: PlotData, index: number) => {
    const colors = getChartColors(index);
    
    const chartData = {
      labels: data.x.map(String),
      datasets: [
        {
          data: data.y as number[],
          borderColor: colors.border,
          backgroundColor: colors.background,
          pointBackgroundColor: colors.point,
          pointBorderColor: colors.border,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          fill: true,
          tension: 0.4, // Smooth curves
        },
      ],
    };

    return (
      <div key={index} className="mb-6 p-4 bg-gray-900/50 border border-cyan-400/20 rounded-xl">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{data.title}</h3>
        <div className="relative bg-gray-950/50 rounded-lg p-4 border border-gray-700 h-80">
          <Line data={chartData} options={getChartOptions(data)} />
        </div>
      </div>
    );
  };

  const renderBarChart = (data: PlotData, index: number) => {
    const colors = getChartColors(index);
    
    const chartData = {
      labels: data.x.map(String),
      datasets: [
        {
          data: data.y as number[],
          backgroundColor: colors.border + '80', // Add transparency to border color
          borderColor: colors.border,
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };

    return (
      <div key={index} className="mb-6 p-4 bg-gray-900/50 border border-cyan-400/20 rounded-xl">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{data.title}</h3>
        <div className="relative bg-gray-950/50 rounded-lg p-4 border border-gray-700 h-80">
          <Bar data={chartData} options={getChartOptions(data)} />
        </div>
      </div>
    );
  };

  const renderScatterChart = (data: PlotData, index: number) => {
    const colors = getChartColors(index);
    
    // Prepare scatter plot data
    const scatterData = data.x.map((x, i) => ({
      x: x as number,
      y: data.y[i] as number,
    }));
    
    const chartData = {
      datasets: [
        {
          data: scatterData,
          backgroundColor: colors.point,
          borderColor: colors.border,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    const scatterOptions = {
      ...getChartOptions(data),
      scales: {
        ...getChartOptions(data).scales,
        x: {
          ...getChartOptions(data).scales.x,
          type: 'linear' as const,
        },
        y: {
          ...getChartOptions(data).scales.y,
          type: 'linear' as const,
        },
      },
    };

    return (
      <div key={index} className="mb-6 p-4 bg-gray-900/50 border border-cyan-400/20 rounded-xl">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{data.title}</h3>
        <div className="relative bg-gray-950/50 rounded-lg p-4 border border-gray-700 h-80">
          <Scatter data={chartData} options={scatterOptions} />
        </div>
      </div>
    );
  };

  const renderChart = (data: PlotData, index: number) => {
    switch (data.kind.toLowerCase()) {
      case 'line':
        return renderLineChart(data, index);
      case 'bar':
        return renderBarChart(data, index);
      case 'scatter':
        return renderScatterChart(data, index);
      default:
        return renderLineChart(data, index); // Default to line chart
    }
  };

  return (
    <div className="mt-4">
      {plotsData.map((data, index) => renderChart(data, index))}
    </div>
  );
};

export default ChartVisualization;