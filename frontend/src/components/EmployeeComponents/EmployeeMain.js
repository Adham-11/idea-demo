import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useFunctions } from '../../useFunctions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function EmployeeMain() {
  const { API_BASE_URL } = useFunctions();
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState(null);

  useEffect(() => {
    const handleAnalyze = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/analyze`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    handleAnalyze();
  }, [API_BASE_URL, token]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
      },
    },
  };

  const chartStyle = {
    height: '300px',
  };

  const chatTypeData = {
    labels: data.chat_types.map(item => item._id),
    datasets: [{
      label: 'Chat Messages by Type',
      data: data.chat_types.map(item => item.count),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const meetingStatusData = {
    labels: data.meeting_statuses.map(item => item._id),
    datasets: [{
      label: 'Meeting Statuses',
      data: data.meeting_statuses.map(item => item.count),
      backgroundColor: ['#6366f1', '#f97316', '#22c55e'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const projectStageData = {
    labels: data.project_stages.map(item => item._id),
    datasets: [{
      label: 'Project Stages',
      data: data.project_stages.map(item => item.count),
      backgroundColor: ['#10b981', '#3b82f6', '#eab308'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const userRolesData = {
    labels: data.user_roles.map(item => item._id),
    datasets: [{
      label: 'User Roles',
      data: data.user_roles.map(item => item.count),
      backgroundColor: ['#8b5cf6', '#ec4899'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const staffRolesData = {
    labels: data.staff_roles.map(item => item._id),
    datasets: [{
      label: 'Staff Roles',
      data: data.staff_roles.map(item => item.count),
      backgroundColor: ['#0ea5e9', '#14b8a6', '#f43f5e'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const staffStatusData = {
    labels: data.staff_statuses.map(item => item._id),
    datasets: [{
      label: 'Staff Statuses',
      data: data.staff_statuses.map(item => item.count),
      backgroundColor: ['#facc15', '#4ade80'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

   const projectIds = data.project_predictions[0].predictions.map(p => p.project_id);
  const bigModelData = data.project_predictions[0].predictions.map(p => p.confidence);
  const cleanedModelData = data.project_predictions[1].predictions.map(p => p.confidence);

  const predictionComparisonData = {
    labels: projectIds,
    datasets: [
      {
        label: 'Big Model Confidence',
        data: bigModelData,
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Cleaned Model Confidence',
        data: cleanedModelData,
        backgroundColor: '#ef4444',
      },
    ],
  };
  

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Prediction Confidence Comparison</h2>
          <div className="relative" style={chartStyle}>
            <Bar data={predictionComparisonData} options={chartOptions} />
          </div>
        </div>

       {/* Staff Statuses Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Staff Statuses</h2>
          <div className="relative" style={chartStyle}>
            <Pie data={staffStatusData} options={chartOptions} />
          </div>
        </div>        

        {/* Meeting Statuses Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meeting Statuses</h2>
          <div className="relative" style={chartStyle}>
            <Pie data={meetingStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Project Stages Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Stages</h2>
          <div className="relative" style={chartStyle}>
            <Bar data={projectStageData} options={chartOptions} />
          </div>
        </div>

        {/* User Roles Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Roles</h2>
          <div className="relative" style={chartStyle}>
            <Doughnut data={userRolesData} options={chartOptions} />
          </div>
        </div>

        {/* Staff Roles Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Staff Roles</h2>
          <div className="relative" style={chartStyle}>
            <Bar data={staffRolesData} options={chartOptions} />
          </div>
        </div>

        {/* Chat Message Types Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chat Message Types</h2>
          <div className="relative" style={chartStyle}>
            <Bar data={chatTypeData} options={chartOptions} />
          </div>
        </div>

        {/* Average Review Rating Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Average Review Rating
          </h2>
          <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 text-center">
            {data.review_average_rating?.toFixed(1) ?? 'N/A'} <span className="text-yellow-400">★</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default EmployeeMain;