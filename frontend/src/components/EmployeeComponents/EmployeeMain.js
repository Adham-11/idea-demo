import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useFunctions } from '../../useFunctions';
import { openProjectData } from '../../redux/projectDataSlice';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function EmployeeMain() {
  const { project: allProjects = [], API_BASE_URL } = useFunctions();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState(null);
  const [projectMap, setProjectMap] = useState(() => {
    const map = {};
    allProjects.forEach(p => {
      map[p._id] = p;
    });
    return map;
  });



  // Fetch fraud detection and analytics data
  useEffect(() => {
    const runFraudDetectionAndAnalyze = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/detect_fraud`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Fraud detection error:", err);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/analyze`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    runFraudDetectionAndAnalyze();
  }, [API_BASE_URL, token]);

  const handleProjectChartClick = async (projectId) => {
    const project = projectMap[projectId];
    if (!project) return;

    const transformedProjectData = {
      images: project.project_images?.map(img => `${API_BASE_URL}/${img}`) || [],
      details: {
        step1: {
          projectIndustry: project.project_industry || "N/A",
          projectStage: project.project_stage || "N/A",
          minimumInvestment: project.min_investment || "N/A",
          maximumInvestment: project.max_investment || "N/A",
          netWorth: project.networth || "N/A",
          dealType: project.deal_type || "N/A",
          projectLocation: `${project.city || "N/A"}, ${project.state || "N/A"}`,
          website: project.website_link || "N/A",
        },
        step2: {
          description: {
            marketDescription: project.market_description || "N/A",
            businessHighlights: project.bussiness_highlights || "N/A",
            financialStatus: project.financial_status || "N/A",
            businessObjectives: project.business_objectives || "N/A",
            businessDescription: project.business_description || "N/A",
          },
        },
        step3: {
          documents: [
            ...(project.business_plan ? [{
              name: "Business Plan",
              size: "N/A",
              color: "#00D0FF",
              path: project.business_plan,
            }] : []),
            ...(project.additional_document ? [{
              name: "Additional Document",
              size: "N/A",
              color: "#FFCA28",
              path: project.additional_document,
            }] : []),
            ...(project.exective_sunnary ? [{
              name: "Executive Summary",
              size: "N/A",
              color: "#3A974C",
              path: project.exective_sunnary,
            }] : []),
            ...(project.financial_statement ? [{
              name: "Financial Statement",
              size: "N/A",
              color: "#E71D36",
              path: project.financial_statement,
            }] : []),
          ],
        },
        step4: {
          id: project._id,
          state: project.status,
          comment: project.comment || "N/A",
        },
        title: project.project_name || "N/A",
      },
    };

    dispatch(openProjectData({
      header: 'View Project',
      buttonText: 'View',
      type: 'View',
      initialData: transformedProjectData,
    }));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 14 },
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

  const projectLabels = data.project_predictions[0].predictions.map(p => p.project_name || `Project ${p.project_id}`);

  const predictionComparisonData = {
    labels: projectLabels,
    datasets: [
      {
        label: 'Advanced Model Score',
        data: data.project_predictions[0].predictions.map(p => p.confidence),
        backgroundColor: '#3b82f6',
        borderColor: '#ffffff',
        borderWidth: 2,
      },
      {
        label: 'Simplified Model Score',
        data: data.project_predictions[1].predictions.map(p => p.confidence),
        backgroundColor: '#ef4444',
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const predictionComparisonOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'How Likely Are Projects to Succeed?',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Click a bar to view project details',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}% likelihood of success`,
        },
      },
    },
    onClick: (event, elements, chart) => chartClickHandler(event, elements, chart, 0),
  };

  const fraudTrendData = {
    labels: projectLabels,
    datasets: [
      {
        label: 'Simplified Model Score',
        data: data.project_predictions[1].predictions.map(p => p.confidence),
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4,
      },
      {
        label: 'Fraud Risk Baseline (50%)',
        data: Array(data.project_predictions[1].predictions.length).fill(50),
        fill: false,
        borderDash: [5, 5],
        borderColor: '#10b981',
        tension: 0.1,
      },
    ],
  };

  const fraudTrendOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Project Fraud Risk Assessment',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Scores below 50% may indicate higher fraud risk. Click a point to view project details.',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => context.dataset.label === 'Simplified Model Score'
            ? `${context.raw}% confidence (lower scores may indicate fraud risk)`
            : `Baseline: 50% threshold for fraud risk`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Confidence Score (%)' },
      },
    },
    onClick: (event, elements, chart) => chartClickHandler(event, elements, chart, 1),
  };

  const fraudDetectionData = {
    labels: data.flagged_projects?.map(p => p.project_name || `Project ${p.project_id}`) || ['No Flagged Projects'],
    datasets: [{
      label: 'Flagged Projects',
      data: data.flagged_projects?.map(() => 1) || [0],
      backgroundColor: '#ef4444',
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const fraudDetectionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Suspicious Activity Alerts',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Projects flagged for potential fraud. Click a bar to view details.',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.label}: Flagged as potentially fraudulent`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => value === 1 ? 'Flagged' : '',
        },
        title: { display: true, text: 'Fraud Status' },
      },
    },
    onClick: (event, elements, chart) => {
      if (!elements.length) return;
      const index = elements[0].index;
      const projectId = data.flagged_projects?.[index]?.project_id;
      if (projectId) handleProjectChartClick(projectId);
    },
  };

  const chatTypeData = {
    labels: data.chat_types.map(item => item._id === 'text' ? 'Text Messages' : item._id),
    datasets: [{
      label: 'Messages by Type',
      data: data.chat_types.map(item => item.count),
      backgroundColor: ['#3b82f6'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const chatTypeOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'How Are Users Communicating?',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the number of messages by type',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} messages sent between users`,
        },
      },
    },
  };

  const meetingStatusData = {
    labels: data.meeting_statuses.map(item => item._id === 'Requested' ? 'Pending Requests' : 'Scheduled with Investor'),
    datasets: [{
      label: 'Meeting Status',
      data: data.meeting_statuses.map(item => item.count),
      backgroundColor: ['#6366f1', '#f97316'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const meetingStatusOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Meeting Progress',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the status of meetings with investors',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => context.label === 'Pending Requests'
            ? `${context.raw} meeting(s) awaiting approval`
            : `${context.raw} meeting(s) scheduled with investors`,
        },
      },
    },
  };

  const projectStageData = {
    labels: data.project_stages.map(item => item._id === 'Seed' ? 'Early Stage' : 'Ready to Launch'),
    datasets: [{
      label: 'Project Stages',
      data: data.project_stages.map(item => item.count),
      backgroundColor: ['#10b981', '#3b82f6'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const projectStageOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Where Are Projects in Development?',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the current stage of each project',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => context.label === 'Early Stage'
            ? `${context.raw} project(s) in initial development`
            : `${context.raw} project(s) ready for market launch`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Projects' },
      },
    },
  };

  const userRolesData = {
    labels: data.user_roles.map(item => item._id === 'investor' ? 'Investors' : 'Entrepreneurs'),
    datasets: [{
      label: 'User Roles',
      data: data.user_roles.map(item => item.count),
      backgroundColor: ['#8b5cf6', '#ec4899'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const userRolesOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Who’s Using the Platform?',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the types of users on the platform',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => context.label === 'Investors'
            ? `${context.raw} users looking to fund projects`
            : `${context.raw} users creating new projects`,
        },
      },
    },
  };

  const staffRolesData = {
    labels: data.staff_roles.map(item => item._id === 'Cs' ? 'Customer Support' : item._id),
    datasets: [{
      label: 'Team Roles',
      data: data.staff_roles.map(item => item.count),
      backgroundColor: ['#0ea5e9', '#14b8a6', '#f43f5e'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const staffRolesOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Team Roles Breakdown',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the roles of staff members',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            if (context.label === 'Admins') return `${context.raw} staff managing the platform`;
            if (context.label === 'Auditors') return `${context.raw} staff reviewing projects`;
            return `${context.raw} staff assisting users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Staff' },
      },
    },
  };

  const staffStatusData = {
    labels: data.staff_statuses.map(item => item._id === 'Active' ? 'Currently Active' : 'On Leave'),
    datasets: [{
      label: 'Team Status',
      data: data.staff_statuses.map(item => item.count),
      backgroundColor: ['#facc15', '#4ade80'],
      borderColor: ['#ffffff'],
      borderWidth: 2,
    }],
  };

  const staffStatusOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Team Activity Status',
        font: { size: 18 },
      },
      subtitle: {
        display: true,
        text: 'Shows the number of active and inactive staff members',
        font: { size: 12 },
        padding: { top: 10 },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} staff members`,
        },
      },
    },
  };

  const chartClickHandler = (event, elements, chart, predictionsIndex = 0) => {
    if (!elements.length) return;
    const index = elements[0].index;
    const projectId = data.project_predictions[predictionsIndex].predictions[index]?.project_id;
    if (projectId) handleProjectChartClick(projectId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          How Likely Are Projects to Succeed?
        </h2>
        <div className="relative" style={{ height: '350px' }}>
          <Bar data={predictionComparisonData} options={predictionComparisonOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Team Activity Status
        </h2>
        <div className="relative" style={chartStyle}>
          <Pie data={staffStatusData} options={staffStatusOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Meeting Progress
        </h2>
        <div className="relative" style={chartStyle}>
          <Pie data={meetingStatusData} options={meetingStatusOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Where Are Projects in Development?
        </h2>
        <div className="relative" style={chartStyle}>
          <Bar data={projectStageData} options={projectStageOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Who’s Using the Platform?
        </h2>
        <div className="relative" style={chartStyle}>
          <Doughnut data={userRolesData} options={userRolesOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Team Roles Breakdown
        </h2>
        <div className="relative" style={chartStyle}>
          <Bar data={staffRolesData} options={staffRolesOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Project Fraud Risk Assessment
        </h2>
        <div className="relative" style={{ height: '350px' }}>
          <Line data={fraudTrendData} options={fraudTrendOptions} />
        </div>
      </div>

      {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          How Are Users Communicating?
        </h2>
        <div className="relative" style={chartStyle}>
          <Pie data={chatTypeData} options={chatTypeOptions} />
        </div>
      </div> */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Suspicious Activity Alerts
        </h2>
        <div className="relative" style={chartStyle}>
          <Bar data={fraudDetectionData} options={fraudDetectionOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative flex flex-col justify-center items-center" style={chartStyle}>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Average User Satisfaction
        </h2>
        <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 text-center">
          {data.review_average_rating?.toFixed(1) ?? 'N/A'} <span className="text-yellow-400">★</span>
        </p>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-2">
          Average rating based on user reviews
        </p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeMain;