/* Cloud Office Administration Management System - Charts Controller */

let growthChartInstance = null;
let deptChartInstance = null;

// Initialize or Update Charts dynamically based on current employee data
function updateCharts(employees) {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js is not loaded yet.');
    return;
  }

  const bodyStyles = window.getComputedStyle(document.body);
  const fontColor = bodyStyles.getPropertyValue('--text-muted').trim() || '#64748b';
  const tooltipBg = bodyStyles.getPropertyValue('--bg-body').trim() === '#0f172a' ? '#1e293b' : '#0f172a';

  // Set global Chart.js defaults for modern look
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.color = fontColor;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.borderRadius = 8;
  Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
  Chart.defaults.plugins.tooltip.titleFont = { size: 13, weight: 'bold' };
  Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;

  renderGrowthChart(employees);
  renderDepartmentChart(employees);
}

// 1. Line Chart: Monthly Hires / Growth Trend
function renderGrowthChart(employees) {
  const ctx = document.getElementById('growthChart');
  if (!ctx) return;

  const bodyStyles = window.getComputedStyle(document.body);
  const gridColor = bodyStyles.getPropertyValue('--border-color').trim() || '#f1f5f9';
  const tickColor = bodyStyles.getPropertyValue('--text-muted').trim() || '#94a3b8';
  const cardBg = bodyStyles.getPropertyValue('--bg-card').trim() || '#ffffff';

  // Process data: count hires per month (based on hireDate format "YYYY-MM-DD")
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyHires = new Array(12).fill(0);
  
  // Dynamic cumulative calculations or just hires per month
  // Let's calculate hires per month for the current year (2026) or generic monthly distribution
  employees.forEach(emp => {
    if (emp.hireDate) {
      const date = new Date(emp.hireDate);
      if (!isNaN(date.getTime())) {
        const monthIndex = date.getMonth();
        monthlyHires[monthIndex]++;
      }
    }
  });

  // Cumulative sum for headcount growth trend
  let cumulativeCount = employees.length - monthlyHires.reduce((a, b) => a + b, 0);
  if (cumulativeCount < 0) cumulativeCount = 0;
  
  const growthData = monthlyHires.map(count => {
    cumulativeCount += count;
    return cumulativeCount;
  });

  // Destroy previous instance to avoid hover flicker/memory leaks
  if (growthChartInstance) {
    growthChartInstance.destroy();
  }

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.00)');

  growthChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Total Headcount',
        data: growthData,
        borderColor: '#6366f1',
        borderWidth: 3,
        pointBackgroundColor: cardBg,
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        backgroundColor: gradient
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            precision: 0,
            color: tickColor
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: tickColor
          }
        }
      }
    }
  });
}

// 2. Donut Chart: Employees by Department
function renderDepartmentChart(employees) {
  const ctx = document.getElementById('departmentChart');
  if (!ctx) return;

  const bodyStyles = window.getComputedStyle(document.body);
  const cardBg = bodyStyles.getPropertyValue('--bg-card').trim() || '#ffffff';
  const legendColor = bodyStyles.getPropertyValue('--text-main').trim() || '#475569';

  // Process data: count employees per department
  const deptCounts = {};
  employees.forEach(emp => {
    if (emp.department) {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    }
  });

  const labels = Object.keys(deptCounts);
  const data = Object.values(deptCounts);

  // Fallback if no employees exist yet
  if (labels.length === 0) {
    labels.push('No Data');
    data.push(1);
  }

  if (deptChartInstance) {
    deptChartInstance.destroy();
  }

  // Harmonious theme palette for departments
  const deptColors = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#94a3b8'  // Slate
  ];

  deptChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: deptColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: cardBg,
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 16,
            color: legendColor,
            font: {
              size: 11,
              weight: '600'
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}
