/* Cloud Office Administration Management System - App Controller */

// ==========================================
// SUPABASE CONFIG
// ==========================================

const supabaseUrl = 'https://bkhemgvlyntxmuftsmdz.supabase.co';

const supabaseKey = 'sb_publishable_UVBHdST6jCEX3ub66OhIgA_DxYc6lyA';

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("Supabase Connected Successfully");

// ==========================================
// SUPABASE INTEGRATION GUIDE (HOW TO SWAP)
// ==========================================
/*
To replace this local mock database with Supabase:
1. Include the Supabase JS Library in index.html:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   
2. Initialize Supabase:
   const supabaseUrl = 'https://your-project-id.supabase.co';
   const supabaseKey = 'your-anon-key';
   const supabase = supabase.createClient(supabaseUrl, supabaseKey);

3. Rewrite the CRUD functions below:
   
   - GET ALL EMPLOYEES:
     async function getEmployees() {
       const { data, error } = await supabase.from('employees').select('*').order('id', { ascending: false });
       if (error) { console.error(error); return []; }
       return data;
     }

   - ADD EMPLOYEE:
     async function addEmployee(employee) {
       const { data, error } = await supabase.from('employees').insert([employee]).select();
       if (error) throw error;
       return data[0];
     }

   - UPDATE EMPLOYEE:
     async function updateEmployee(id, updates) {
       const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select();
       if (error) throw error;
       return data[0];
     }

   - DELETE EMPLOYEE:
     async function deleteEmployee(id) {
       const { error } = await supabase.from('employees').delete().eq('id', id);
       if (error) throw error;
       return true;
     }
*/

// ==========================================
// MOCK DATABASE & STATE MANAGEMENT
// ==========================================
const LOCAL_STORAGE_KEY = 'cloud_office_employees';

const defaultEmployees = [
  {
    id: 'emp-101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    role: 'Software Developer',
    department: 'IT',
    status: 'Active',
    hireDate: '2024-01-15',
    phone: '+91 9876543210'
  },
  {
    id: 'emp-102',
    name: 'Priya Verma',
    email: 'priya.verma@company.com',
    role: 'HR Manager',
    department: 'HR',
    status: 'Active',
    hireDate: '2023-11-10',
    phone: '+91 9123456780'
  },
  {
    id: 'emp-103',
    name: 'Aman Gupta',
    email: 'aman.gupta@company.com',
    role: 'Accountant',
    department: 'Finance',
    status: 'Active',
    hireDate: '2024-03-05',
    phone: '+91 9988776655'
  },
  {
    id: 'emp-104',
    name: 'Sneha Patil',
    email: 'sneha.patil@company.com',
    role: 'Marketing Executive',
    department: 'Marketing',
    status: 'On Leave',
    hireDate: '2024-02-20',
    phone: '+91 9090909090'
  },
  {
    id: 'emp-105',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@company.com',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'Active',
    hireDate: '2023-09-18',
    phone: '+91 9871234567'
  },
  {
    id: 'emp-106',
    name: 'Neha Kulkarni',
    email: 'neha.kulkarni@company.com',
    role: 'Sales Executive',
    department: 'Sales',
    status: 'Active',
    hireDate: '2024-04-12',
    phone: '+91 9765432109'
  },
  {
    id: 'emp-107',
    name: 'Karan Singh',
    email: 'karan.singh@company.com',
    role: 'Technical Support Engineer',
    department: 'Support',
    status: 'Suspended',
    hireDate: '2023-12-01',
    phone: '+91 9345678901'
  },
  {
    id: 'emp-108',
    name: 'Anjali Deshmukh',
    email: 'anjali.deshmukh@company.com',
    role: 'Office Administrator',
    department: 'Administration',
    status: 'Active',
    hireDate: '2024-05-08',
    phone: '+91 9456123780'
  }
];

// Initialize local database states
let employees = [];
let attendance = [];
let leaves = [];

const defaultAttendance = [
  {
    empId: 'emp-101',
    name: 'Rahul Sharma',
    date: '2026-05-28',
    clockIn: '09:00',
    clockOut: '18:00',
    status: 'Present'
  },
  {
    empId: 'emp-102',
    name: 'Priya Verma',
    date: '2026-05-28',
    clockIn: '08:45',
    clockOut: '17:30',
    status: 'Present'
  },
  {
    empId: 'emp-103',
    name: 'Aman Gupta',
    date: '2026-05-28',
    clockIn: '09:15',
    clockOut: '18:15',
    status: 'Present'
  },
  {
    empId: 'emp-104',
    name: 'Sneha Patil',
    date: '2026-05-28',
    clockIn: '--:--',
    clockOut: '--:--',
    status: 'Absent'
  },
  {
    empId: 'emp-105',
    name: 'Arjun Mehta',
    date: '2026-05-28',
    clockIn: '09:35',
    clockOut: '18:00',
    status: 'Late'
  },
  {
    empId: 'emp-106',
    name: 'Neha Kulkarni',
    date: '2026-05-28',
    clockIn: '09:05',
    clockOut: '13:30',
    status: 'Half Day'
  }
];

const defaultLeaves = [
  {
    id: 'req-201',
    empId: 'emp-104',
    name: 'Sneha Patil',
    type: 'Sick Leave',
    startDate: '2026-05-28',
    endDate: '2026-05-30',
    reason: 'Severe fever and body pain. Doctor advised rest.',
    status: 'Approved'
  },
  {
    id: 'req-202',
    empId: 'emp-105',
    name: 'Arjun Mehta',
    type: 'Casual Leave',
    startDate: '2026-06-05',
    endDate: '2026-06-06',
    reason: 'Family event out of town.',
    status: 'Pending'
  },
  {
    id: 'req-203',
    empId: 'emp-103',
    name: 'Aman Gupta',
    type: 'Annual Leave',
    startDate: '2026-07-10',
    endDate: '2026-07-17',
    reason: 'Summer vacation trip with family.',
    status: 'Pending'
  },
  {
    id: 'req-204',
    empId: 'emp-107',
    name: 'Karan Singh',
    type: 'Sick Leave',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    reason: 'Dental appointment and subsequent rest.',
    status: 'Rejected'
  }
];

const ATTENDANCE_STORAGE_KEY = 'cloud_office_attendance';
const LEAVES_STORAGE_KEY = 'cloud_office_leaves';


async function loadFromStorage() {
  const { data: empData, error: empError } = await supabaseClient
    .from('employees')
    .select('*');

  if (empError) {
    console.error(empError);
    employees = [...defaultEmployees]; // fallback
  } else {
    employees = empData;
  }

  // Ensure employees are always sorted by numeric ID
  employees.sort((a, b) => {
    const idA = parseInt(String(a.id).replace('emp-', '')) || 0;
    const idB = parseInt(String(b.id).replace('emp-', '')) || 0;
    return idA - idB;
  });

  const { data: attData, error: attError } = await supabaseClient
    .from('attendance')
    .select('*');

  if (attError) {
    console.error(attError);
    attendance = [...defaultAttendance]; // fallback
  } else {
    attendance = attData;
  }

  const { data: leavesData, error: leavesError } = await supabaseClient
    .from('leaves')
    .select('*');

  if (leavesError) {
    console.error(leavesError);
    leaves = [...defaultLeaves]; // fallback
  } else {
    leaves = leavesData;
  }
}

function saveToStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
}

function saveAttendanceToStorage() {
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
}

function saveLeavesToStorage() {
  localStorage.setItem(LEAVES_STORAGE_KEY, JSON.stringify(leaves));
}

// ==========================================
// CORE APP APP CONTROLLER & ROUTING
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadFromStorage();
  initRouter();
  initSidebar();
  initTheme();
  initSearchAndFilters();
  initFormSubmissions();

  // Load notifications
  updateNotifications();

  // Set initial page/route load
  handleRoute();
  const { data, error } = await supabase
  .from('employees')
  .select('*');

if (error) {
  console.error(error);
} else {
  updateCharts(data); // 🔥 YE LINE ADD KAR
}
});

// Hash-based client-side router
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
}

function handleRoute() {
  const hash = window.location.hash || '#/dashboard';

  // Views toggle
  const views = document.querySelectorAll('.app-view');
  views.forEach(view => view.classList.remove('active'));

  // Nav menu active toggles
  const navLinks = document.querySelectorAll('.nav-menu-item');
  navLinks.forEach(link => link.classList.remove('active'));

  if (hash === '#/dashboard') {
    document.getElementById('dashboard-view').classList.add('active');
    document.querySelector('[href="#/dashboard"]').classList.add('active');
    renderDashboard();
  } else if (hash === '#/employees') {
    document.getElementById('employees-view').classList.add('active');
    document.querySelector('[href="#/employees"]').classList.add('active');
    renderEmployeeTable();
  } else if (hash === '#/attendance') {
    document.getElementById('attendance-view').classList.add('active');
    document.querySelector('[href="#/attendance"]').classList.add('active');
    renderAttendanceTable();
  } else if (hash === '#/leaves') {
    document.getElementById('leave-view').classList.add('active');
    document.querySelector('[href="#/leaves"]').classList.add('active');
    renderLeaveTable();
  } else {
    // Default fallback to dashboard
    window.location.hash = '#/dashboard';
  }

  // Close sidebar on mobile after route change
  const sidebar = document.querySelector('.sidebar-wrapper');
  const backdrop = document.querySelector('.sidebar-backdrop');
  if (sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    backdrop.classList.remove('show');
  }
}

// ==========================================
// SIDEBAR COLLAPSE / MOBILE MENU TOGGLE
// ==========================================
function initSidebar() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const sidebar = document.querySelector('.sidebar-wrapper');

  // Create backdrop if not already exists
  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    backdrop.classList.toggle('show');
  });

  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('show');
    backdrop.classList.remove('show');
  });
}

// ==========================================
// THEME CONFIGURATION & TOGGLE
// ==========================================
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  const updateIcon = (theme) => {
    if (theme === 'dark') {
      themeToggleIcon.className = 'bi bi-sun-fill';
    } else {
      themeToggleIcon.className = 'bi bi-moon-fill';
    }
  };

  // Get initial theme to align button icon
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);

    // Re-render dashboard charts to apply new theme colors if dashboard is active
    const hash = window.location.hash || '#/dashboard';
    if (hash === '#/dashboard') {
      renderDashboard();
    }
  });
}

// ==========================================
// DASHBOARD VIEWS RENDERER
// ==========================================
function renderDashboard() {
  // Update Analytics Cards
  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const leaveCount = employees.filter(e => e.status === 'On Leave').length;
  const suspendedCount = employees.filter(e => e.status === 'Suspended').length;

  document.getElementById('stat-total-employees').innerText = totalEmployees;

  // Attendance calculation
  const attendanceRate = totalEmployees > 0 ? Math.round(((activeCount + (leaveCount * 0.5)) / totalEmployees) * 100) : 0;
  document.getElementById('stat-attendance-rate').innerText = `${attendanceRate}%`;

  document.getElementById('stat-on-leave').innerText = leaveCount;

  if (document.getElementById('stat-suspended')) {
    document.getElementById('stat-suspended').innerText = suspendedCount;
  }

  // Draw & Update Charts
  if (typeof updateCharts === 'function') {
    updateCharts(employees);
  }
}

// ==========================================
// EMPLOYEE MANAGEMENT UI RENDERER
// ==========================================
let filterSearchQuery = '';
let filterDepartment = '';
let filterStatus = '';

let attendanceSearchQuery = '';
let attendanceFilterDate = '';
let attendanceFilterStatus = '';

let leaveSearchQuery = '';
let leaveFilterType = '';
let leaveFilterStatus = '';

function initSearchAndFilters() {
  const searchInput = document.getElementById('employee-search');
  const deptFilter = document.getElementById('filter-department');
  const statusFilter = document.getElementById('filter-status');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterSearchQuery = e.target.value.toLowerCase().trim();
      renderEmployeeTable();
    });
  }

  if (deptFilter) {
    deptFilter.addEventListener('change', (e) => {
      filterDepartment = e.target.value;
      renderEmployeeTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      renderEmployeeTable();
    });
  }

  // Attendance Filters
  const attSearch = document.getElementById('attendance-search');
  const attDate = document.getElementById('filter-attendance-date');
  const attStatus = document.getElementById('filter-attendance-status');

  if (attSearch) {
    attSearch.addEventListener('input', (e) => {
      attendanceSearchQuery = e.target.value.toLowerCase().trim();
      renderAttendanceTable();
    });
  }
  if (attDate) {
    attDate.addEventListener('change', (e) => {
      attendanceFilterDate = e.target.value;
      renderAttendanceTable();
    });
  }
  if (attStatus) {
    attStatus.addEventListener('change', (e) => {
      attendanceFilterStatus = e.target.value;
      renderAttendanceTable();
    });
  }

  // Leave Filters
  const lvSearch = document.getElementById('leave-search');
  const lvType = document.getElementById('filter-leave-type');
  const lvStatus = document.getElementById('filter-leave-status');

  if (lvSearch) {
    lvSearch.addEventListener('input', (e) => {
      leaveSearchQuery = e.target.value.toLowerCase().trim();
      renderLeaveTable();
    });
  }
  if (lvType) {
    lvType.addEventListener('change', (e) => {
      leaveFilterType = e.target.value;
      renderLeaveTable();
    });
  }
  if (lvStatus) {
    lvStatus.addEventListener('change', (e) => {
      leaveFilterStatus = e.target.value;
      renderLeaveTable();
    });
  }
}

function renderEmployeeTable() {
  const tbody = document.getElementById('employee-table-body');
  if (!tbody) return;

  // Filter Employees array
  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(filterSearchQuery) ||
      emp.email.toLowerCase().includes(filterSearchQuery) ||
      emp.role.toLowerCase().includes(filterSearchQuery) ||
      emp.id.toLowerCase().includes(filterSearchQuery);

    const matchesDept = filterDepartment === '' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === '' || emp.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Render Table rows
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5 text-muted">
          <i class="bi bi-people d-block fs-1 mb-2"></i>
          No employees found matching the filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(emp => {
    let statusClass = 'active';
    if (emp.status === 'On Leave') statusClass = 'on-leave';
    if (emp.status === 'Suspended') statusClass = 'suspended';

    const formattedDate = emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

    return `
      <tr>
        <td>
          <span class="text-secondary fw-semibold">${emp.id}</span>
        </td>
        <td>
          <span class="fw-semibold" style="color: var(--text-main) !important;">${escapeHTML(emp.name)}</span>
        </td>
        <td>
          <span class="fw-semibold" style="color: var(--text-main) !important;">${escapeHTML(emp.department)}</span>
        </td>
        <td>
          <span class="text-secondary">${escapeHTML(emp.role)}</span>
        </td>
        <td>
          <span class="text-secondary">${formattedDate}</span>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${escapeHTML(emp.status)}</span>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <button onclick="openEditEmployeeModal('${emp.id}')" class="btn-icon-sm edit" title="Edit Employee">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button onclick="deleteEmployeePrompt('${emp.id}')" class="btn-icon-sm delete" title="Delete Employee">
              <i class="bi bi-trash3-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================
// CRUD OPERATIONS (CREATE / UPDATE / DELETE)
// ==========================================

function initFormSubmissions() {
  // Add Employee Form
  const addForm = document.getElementById('addEmployeeForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let maxIdNum = 100;
      if (employees.length > 0) {
        const ids = employees.map(e => parseInt(e.id.replace('emp-', '')) || 0);
        maxIdNum = Math.max(...ids, 100);
      }
      const nextId = 'emp-' + (maxIdNum + 1);

      const newEmp = {
        id: nextId,
        name: document.getElementById('add-name').value,
        email: document.getElementById('add-email').value,
        phone: document.getElementById('add-phone').value,
        department: document.getElementById('add-department').value,
        role: document.getElementById('add-role').value,
        status: document.getElementById('add-status').value,
        hireDate: document.getElementById('add-hiredate').value,

      };

      console.log("Hire Date Value:", document.getElementById('add-hiredate').value);

      const { error } = await supabaseClient
        .from('employees')
        .insert([newEmp]);

      if (error) {
        console.error(error);
        showToast('Error saving employee!', 'danger');
        return;
      }

      employees.push(newEmp);
      employees.sort((a, b) => {
        const idA = parseInt(String(a.id).replace('emp-', '')) || 0;
        const idB = parseInt(String(b.id).replace('emp-', '')) || 0;
        return idA - idB;
      });
      saveToStorage();

      // Reset form & Hide modal
      addForm.reset();
      const modalElement = document.getElementById('addEmployeeModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      // Show alert toast/toast-like status notification
      showToast('Employee successfully added!', 'success');

      renderEmployeeTable();
    });
  }

  // Edit Employee Form
  const editForm = document.getElementById('editEmployeeForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('edit-emp-id').value;
      const index = employees.findIndex(emp => emp.id === id);

      if (index !== -1) {
        const updatedData = {
          name: document.getElementById('edit-name').value,
          email: document.getElementById('edit-email').value,
          phone: document.getElementById('edit-phone').value,
          department: document.getElementById('edit-department').value,
          role: document.getElementById('edit-role').value,
          status: document.getElementById('edit-status').value,
          hireDate: document.getElementById('edit-hiredate').value
        };

        const { error } = await supabaseClient
          .from('employees')
          .update(updatedData)
          .eq('id', id);

        if (error) {
          console.error(error);
          showToast('Error updating employee!', 'danger');
          return;
        }
        employees[index].name = document.getElementById('edit-name').value;
        employees[index].email = document.getElementById('edit-email').value;
        employees[index].phone = document.getElementById('edit-phone').value;
        employees[index].department = document.getElementById('edit-department').value;
        employees[index].role = document.getElementById('edit-role').value;
        employees[index].status = document.getElementById('edit-status').value;
        employees[index].hireDate = document.getElementById('edit-hiredate').value;

        saveToStorage();

        // Hide modal
        const modalElement = document.getElementById('editEmployeeModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        showToast('Employee details updated!', 'success');
        renderEmployeeTable();
      }
    });
  }

  // Mark Attendance Form Submission
  const markAttendanceForm = document.getElementById('markAttendanceForm');
  if (markAttendanceForm) {
    markAttendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const empId = document.getElementById('attendance-emp-select').value;
      const emp = employees.find(emp => emp.id === empId);
      if (!emp) return;

      const newRecord = {
        empId: emp.id,
        name: emp.name,
        date: document.getElementById('attendance-date').value,
        clockIn: document.getElementById('attendance-status').value === 'Absent' ? '--:--' : document.getElementById('attendance-clock-in').value || '09:00',
        clockOut: document.getElementById('attendance-status').value === 'Absent' ? '--:--' : document.getElementById('attendance-clock-out').value || '18:00',
        status: document.getElementById('attendance-status').value
      };

      // Check if employee already has a record for that date. If so, update it, else insert.
      const existingIndex = attendance.findIndex(a => a.empId === newRecord.empId && a.date === newRecord.date);
      if (existingIndex !== -1) {
        // UPDATE IN SUPABASE
        const { error } = await supabaseClient
          .from('attendance')
          .update(newRecord)
          .eq('empId', newRecord.empId)
          .eq('date', newRecord.date);

        if (error) {
          console.error(error);
          showToast('Error updating attendance record!', 'danger');
          return;
        }

        attendance[existingIndex] = newRecord;
      } else {
        // INSERT IN SUPABASE
        const { error } = await supabaseClient
          .from('attendance')
          .insert([newRecord]);

        if (error) {
          console.error(error);
          showToast('Error logging attendance!', 'danger');
          return;
        }

        attendance.unshift(newRecord);
      }

      saveAttendanceToStorage();
      renderAttendanceTable();

      // Reset & Hide Modal
      markAttendanceForm.reset();
      const clockInWr = document.getElementById('clock-in-wrapper');
      const clockOutWr = document.getElementById('clock-out-wrapper');
      if (clockInWr) clockInWr.style.display = 'block';
      if (clockOutWr) clockOutWr.style.display = 'block';

      const modalElement = document.getElementById('markAttendanceModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      showToast('Attendance logged successfully!', 'success');
      renderAttendanceTable();
    });
  }

  // Attendance Status Toggle (hide clock-in/out if Absent)
  const attStatusSelect = document.getElementById('attendance-status');
  if (attStatusSelect) {
    attStatusSelect.addEventListener('change', (e) => {
      const clockInWr = document.getElementById('clock-in-wrapper');
      const clockOutWr = document.getElementById('clock-out-wrapper');
      if (clockInWr && clockOutWr) {
        if (e.target.value === 'Absent') {
          clockInWr.style.display = 'none';
          clockOutWr.style.display = 'none';
        } else {
          clockInWr.style.display = 'block';
          clockOutWr.style.display = 'block';
        }
      }
    });
  }

  // Populate dropdowns in Attendance Modal when opened
  const markAttendanceModal = document.getElementById('markAttendanceModal');
  if (markAttendanceModal) {
    markAttendanceModal.addEventListener('show.bs.modal', () => {
      const select = document.getElementById('attendance-emp-select');
      if (select) {
        select.innerHTML = '<option value="" disabled selected>Select Employee</option>' +
          employees.map(emp => `<option value="${emp.id}">${escapeHTML(emp.name)} (${emp.id})</option>`).join('');
      }

      // Set default date to today
      const dateInput = document.getElementById('attendance-date');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  // Request Leave Form Submission
  const requestLeaveForm = document.getElementById('requestLeaveForm');
  if (requestLeaveForm) {
    requestLeaveForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const empId = document.getElementById('leave-emp-select').value;
      const emp = employees.find(emp => emp.id === empId);
      if (!emp) return;

      let maxReqNum = 200;
      if (leaves.length > 0) {
        const ids = leaves.map(l => parseInt(l.id.replace('req-', '')) || 0);
        maxReqNum = Math.max(...ids, 200);
      }
      const nextReqId = 'req-' + (maxReqNum + 1);

      const newRequest = {
        id: nextReqId,
        empId: emp.id,
        name: emp.name,
        type: document.getElementById('leave-type').value,
        startDate: document.getElementById('leave-start-date').value,
        endDate: document.getElementById('leave-end-date').value,
        reason: document.getElementById('leave-reason').value,
        status: 'Pending'
      };

      const { error } = await supabaseClient
        .from('leaves')
        .insert([newRequest]);

      if (error) {
        console.error(error);
        showToast('Error submitting leave!', 'danger');
        return;
      }

      leaves.unshift(newRequest);
      renderLeaveTable();
      updateNotifications();

      // Reset & Hide Modal
      requestLeaveForm.reset();
      const modalElement = document.getElementById('requestLeaveModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      showToast('Leave request submitted successfully!', 'success');
      updateNotifications();
    });
  }

  // Populate dropdowns in Leave Request Modal when opened
  const requestLeaveModal = document.getElementById('requestLeaveModal');
  if (requestLeaveModal) {
    requestLeaveModal.addEventListener('show.bs.modal', () => {
      const select = document.getElementById('leave-emp-select');
      if (select) {
        select.innerHTML = '<option value="" disabled selected>Select Employee</option>' +
          employees.map(emp => `<option value="${emp.id}">${escapeHTML(emp.name)} (${emp.id})</option>`).join('');
      }
    });
  }

  // Edit Attendance Form Submission
  const editAttendanceForm = document.getElementById('editAttendanceForm');
  if (editAttendanceForm) {
    editAttendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const empId = document.getElementById('edit-attendance-emp-id').value;
      const date = document.getElementById('edit-attendance-date').value;
      const index = attendance.findIndex(a => a.empId === empId && a.date === date);

      if (index !== -1) {
        const status = document.getElementById('edit-attendance-status').value;
        const clockIn = status === 'Absent' ? '--:--' : document.getElementById('edit-attendance-clock-in').value || '09:00';
        const clockOut = status === 'Absent' ? '--:--' : document.getElementById('edit-attendance-clock-out').value || '18:00';

        const updatedRecord = {
          status: status,
          clockIn: clockIn,
          clockOut: clockOut
        };

        // UPDATE IN SUPABASE
        const { error } = await supabaseClient
          .from('attendance')
          .update(updatedRecord)
          .eq('empId', empId)
          .eq('date', date);

        if (error) {
          console.error(error);
          showToast('Error updating attendance record!', 'danger');
          return;
        }

        attendance[index].status = status;
        attendance[index].clockIn = clockIn;
        attendance[index].clockOut = clockOut;

        saveAttendanceToStorage();

        const modalElement = document.getElementById('editAttendanceModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        showToast('Attendance record updated!', 'success');
        renderAttendanceTable();
      }
    });
  }

  // Edit Attendance Status Toggle
  const editAttStatusSelect = document.getElementById('edit-attendance-status');
  if (editAttStatusSelect) {
    editAttStatusSelect.addEventListener('change', (e) => {
      const clockInWr = document.getElementById('edit-clock-in-wrapper');
      const clockOutWr = document.getElementById('edit-clock-out-wrapper');
      if (clockInWr && clockOutWr) {
        if (e.target.value === 'Absent') {
          clockInWr.style.display = 'none';
          clockOutWr.style.display = 'none';
        } else {
          clockInWr.style.display = 'block';
          clockOutWr.style.display = 'block';
        }
      }
    });
  }
}

// Trigger edit modal and pre-populate fields
window.openEditEmployeeModal = function (id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  document.getElementById('edit-emp-id').value = emp.id;
  document.getElementById('edit-name').value = emp.name;
  document.getElementById('edit-email').value = emp.email;
  document.getElementById('edit-phone').value = emp.phone || '';
  document.getElementById('edit-department').value = emp.department;
  document.getElementById('edit-role').value = emp.role;
  document.getElementById('edit-status').value = emp.status;
  document.getElementById('edit-hiredate').value = emp.hireDate || '';

  const modal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
  modal.show();
}

window.openEditAttendanceModal = function (empId, date) {
  const record = attendance.find(a => a.empId === empId && a.date === date);
  if (!record) return;

  document.getElementById('edit-attendance-emp-id').value = record.empId;
  document.getElementById('edit-attendance-date').value = record.date;
  document.getElementById('edit-attendance-emp-name').value = `${record.name} (${record.empId})`;

  const formattedDate = record.date ? new Date(record.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';
  document.getElementById('edit-attendance-date-display').value = formattedDate;

  document.getElementById('edit-attendance-status').value = record.status;

  const clockIn = record.clockIn === '--:--' ? '09:00' : record.clockIn;
  const clockOut = record.clockOut === '--:--' ? '18:00' : record.clockOut;

  document.getElementById('edit-attendance-clock-in').value = clockIn;
  document.getElementById('edit-attendance-clock-out').value = clockOut;

  const clockInWr = document.getElementById('edit-clock-in-wrapper');
  const clockOutWr = document.getElementById('edit-clock-out-wrapper');
  if (clockInWr && clockOutWr) {
    if (record.status === 'Absent') {
      clockInWr.style.display = 'none';
      clockOutWr.style.display = 'none';
    } else {
      clockInWr.style.display = 'block';
      clockOutWr.style.display = 'block';
    }
  }

  const modal = new bootstrap.Modal(document.getElementById('editAttendanceModal'));
  modal.show();
}

// Prompt and handle delete
window.deleteEmployeePrompt = async function (id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  if (confirm(`Are you sure you want to delete ${emp.name}?`)) {

    // DELETE FROM SUPABASE
    const { error } = await supabaseClient
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      showToast('Error deleting employee!', 'danger');
      return;
    }

    // REMOVE FROM LOCAL ARRAY
    employees = employees.filter(e => e.id !== id);
    saveToStorage();

    // UPDATE UI
    renderEmployeeTable();
    showToast('Employee deleted from Supabase!', 'warning');
  }
};



// Custom Toast notifications
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.style.marginBottom = '10px';

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-semibold">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'} me-2"></i>
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  container.style.zIndex = '1100';
  document.body.appendChild(container);
  return container;
}

// ==========================================
// ATTENDANCE & LEAVE UI RENDERERS
// ==========================================

function renderAttendanceTable() {
  const tbody = document.getElementById('attendance-table-body');
  if (!tbody) return;

  const filtered = attendance.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(attendanceSearchQuery) ||
      record.empId.toLowerCase().includes(attendanceSearchQuery) ||
      record.status.toLowerCase().includes(attendanceSearchQuery);

    const matchesDate = attendanceFilterDate === '' || record.date === attendanceFilterDate;
    const matchesStatus = attendanceFilterStatus === '' || record.status === attendanceFilterStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const recordCountText = document.getElementById('attendance-record-count');
  if (recordCountText) {
    recordCountText.innerText = `Showing ${filtered.length} of ${attendance.length} records`;
  }

  // Calculate dynamic stats
  const statsBaseRecords = attendanceFilterDate
    ? attendance.filter(r => r.date === attendanceFilterDate)
    : attendance;

  const totalPresent = statsBaseRecords.filter(r => r.status === 'Present').length;
  const totalAbsent = statsBaseRecords.filter(r => r.status === 'Absent').length;
  const totalLate = statsBaseRecords.filter(r => r.status === 'Late').length;
  const totalHalfDay = statsBaseRecords.filter(r => r.status === 'Half Day').length;

  const presentSubtotal = totalPresent + totalLate + totalHalfDay;

  // Attendance rate
  let rate = 0;
  if (attendanceFilterDate) {
    const activeStaff = employees.filter(e => e.status !== 'Suspended').length;
    rate = activeStaff > 0 ? Math.round((presentSubtotal / activeStaff) * 100) : 0;
  } else {
    rate = statsBaseRecords.length > 0 ? Math.round((presentSubtotal / statsBaseRecords.length) * 100) : 0;
  }

  // Update dynamic elements
  const statPresentEl = document.getElementById('attendance-stat-present');
  const statAbsentEl = document.getElementById('attendance-stat-absent');
  const statLateEl = document.getElementById('attendance-stat-late');
  const statRateEl = document.getElementById('attendance-stat-rate');

  if (statPresentEl) statPresentEl.innerText = presentSubtotal;
  if (statAbsentEl) statAbsentEl.innerText = totalAbsent;
  if (statLateEl) statLateEl.innerText = totalLate;
  if (statRateEl) statRateEl.innerText = `${rate}%`;

  const trendPresentEl = document.getElementById('attendance-trend-present');
  const trendAbsentEl = document.getElementById('attendance-trend-absent');
  const trendLateEl = document.getElementById('attendance-trend-late');
  const trendRateEl = document.getElementById('attendance-trend-rate');

  if (attendanceFilterDate) {
    const formattedFilterDate = new Date(attendanceFilterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (trendPresentEl) trendPresentEl.innerText = `On ${formattedFilterDate}`;
    if (trendAbsentEl) trendAbsentEl.innerText = `On ${formattedFilterDate}`;
    if (trendLateEl) trendLateEl.innerText = `On ${formattedFilterDate}`;
    if (trendRateEl) trendRateEl.innerText = `Active staff on ${formattedFilterDate}`;
  } else {
    if (trendPresentEl) trendPresentEl.innerText = `All-time records`;
    if (trendAbsentEl) trendAbsentEl.innerText = `All-time records`;
    if (trendLateEl) trendLateEl.innerText = `All-time records`;
    if (trendRateEl) trendRateEl.innerText = `All-time average`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5 text-muted">
          <i class="bi bi-calendar-x d-block fs-1 mb-2"></i>
          No attendance records found matching the filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(rec => {
    let statusClass = 'present';
    if (rec.status === 'Absent') statusClass = 'absent';
    if (rec.status === 'Late') statusClass = 'late';
    if (rec.status === 'Half Day') statusClass = 'half-day';

    const formattedDate = rec.date ? new Date(rec.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

    return `
      <tr>
        <td>
          <span class="text-secondary fw-semibold">${rec.empId}</span>
        </td>
        <td>
          <span class="fw-semibold" style="color: var(--text-main) !important;">${escapeHTML(rec.name)}</span>
        </td>
        <td>
          <span class="text-secondary">${formattedDate}</span>
        </td>
        <td>
          <span class="text-secondary">${rec.clockIn}</span>
        </td>
        <td>
          <span class="text-secondary">${rec.clockOut}</span>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${escapeHTML(rec.status)}</span>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <button onclick="openEditAttendanceModal('${rec.empId}', '${rec.date}')" class="btn-icon-sm edit" title="Edit Record">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button onclick="deleteAttendanceRecord('${rec.empId}', '${rec.date}')" class="btn-icon-sm delete" title="Delete Record">
              <i class="bi bi-trash3-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.deleteAttendanceRecord = async function (empId, date) {
  if (confirm(`Are you sure you want to delete this attendance record?`)) {
    // DELETE FROM SUPABASE
    const { error } = await supabaseClient
      .from('attendance')
      .delete()
      .eq('empId', empId)
      .eq('date', date);

    if (error) {
      console.error(error);
      showToast('Error deleting attendance record!', 'danger');
      return;
    }

    attendance = attendance.filter(a => !(a.empId === empId && a.date === date));
    saveAttendanceToStorage();
    showToast('Attendance record deleted.', 'warning');
    renderAttendanceTable();
  }
};

function renderLeaveTable() {
  const tbody = document.getElementById('leave-table-body');
  if (!tbody) return;

  const filtered = leaves.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(leaveSearchQuery) ||
      req.empId.toLowerCase().includes(leaveSearchQuery) ||
      req.type.toLowerCase().includes(leaveSearchQuery) ||
      req.reason.toLowerCase().includes(leaveSearchQuery);

    const matchesType = leaveFilterType === '' || req.type === leaveFilterType;
    const matchesStatus = leaveFilterStatus === '' || req.status === leaveFilterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const recordCountText = document.getElementById('leave-record-count');
  if (recordCountText) {
    recordCountText.innerText = `Showing ${filtered.length} of ${leaves.length} requests`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-5 text-muted">
          <i class="bi bi-file-earmark-x d-block fs-1 mb-2"></i>
          No leave requests found matching the filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(req => {
    let statusClass = 'pending';
    if (req.status === 'Approved') statusClass = 'approved';
    if (req.status === 'Rejected') statusClass = 'rejected';

    const formattedStart = req.startDate ? new Date(req.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

    const formattedEnd = req.endDate ? new Date(req.endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

    const showActions = req.status === 'Pending';

    return `
      <tr>
        <td>
          <span class="text-secondary fw-semibold">${req.id}</span>
        </td>
        <td>
          <div class="fw-semibold" style="color: var(--text-main) !important;">${escapeHTML(req.name)} <span class="text-muted small">(${req.empId})</span></div>
        </td>
        <td>
          <span class="fw-semibold text-secondary">${escapeHTML(req.type)}</span>
        </td>
        <td>
          <span class="text-secondary">${formattedStart}</span>
        </td>
        <td>
          <span class="text-secondary">${formattedEnd}</span>
        </td>
        <td>
          <span class="text-secondary text-truncate d-inline-block" style="max-width: 180px;" title="${escapeHTML(req.reason)}">${escapeHTML(req.reason)}</span>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${escapeHTML(req.status)}</span>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            ${showActions ? `
              <button onclick="updateLeaveStatus('${req.id}', 'Approved')" class="btn-icon-sm edit" style="--target-color: var(--success); --bg-hover: var(--success-light);" title="Approve Request">
                <i class="bi bi-check-lg"></i>
              </button>
              <button onclick="updateLeaveStatus('${req.id}', 'Rejected')" class="btn-icon-sm delete" title="Reject Request">
                <i class="bi bi-x-lg"></i>
              </button>
            ` : `
              <button onclick="deleteLeaveRecord('${req.id}')" class="btn-icon-sm delete" title="Delete Leave Request">
                <i class="bi bi-trash3-fill"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateLeaveStatus = async function (id, status) {

  // 1. UPDATE IN SUPABASE
  const { error } = await supabaseClient
    .from('leaves')
    .update({ status: status })
    .eq('id', id);

  if (error) {
    console.error(error);
    showToast('Error updating leave status!', 'danger');
    return;
  }

  // 2. UPDATE LOCAL ARRAY
  const reqIndex = leaves.findIndex(l => l.id === id);
  if (reqIndex !== -1) {
    leaves[reqIndex].status = status;

    // 3. EMPLOYEE STATUS UPDATE (same logic)
    const empId = leaves[reqIndex].empId;
    const empIndex = employees.findIndex(e => e.id === empId);

    if (empIndex !== -1) {
      if (status === 'Approved') {
        employees[empIndex].status = 'On Leave';
      } else if (status === 'Rejected') {
        employees[empIndex].status = 'Active';
      }

      // Update employee status in Supabase too!
      await supabaseClient
        .from('employees')
        .update({ status: employees[empIndex].status })
        .eq('id', empId);

      saveToStorage();
    }
  }

  // 4. UI UPDATE
  renderLeaveTable();
  updateNotifications();

  showToast(`Leave ${status}!`, status === 'Approved' ? 'success' : 'warning');
};

window.deleteLeaveRecord = async function (id) {
  if (confirm(`Are you sure you want to delete this leave request record?`)) {
    // DELETE FROM SUPABASE
    const { error } = await supabaseClient
      .from('leaves')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      showToast('Error deleting leave record!', 'danger');
      return;
    }

    leaves = leaves.filter(l => l.id !== id);
    saveLeavesToStorage();
    showToast('Leave request deleted.', 'warning');
    updateNotifications();
    renderLeaveTable();
  }
};

function updateNotifications() {
  const badgeEl = document.getElementById('notification-badge');
  const countEl = document.getElementById('notification-count');
  const listEl = document.getElementById('notification-list');
  if (!listEl) return;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  if (pendingLeaves.length > 0) {
    if (badgeEl) badgeEl.classList.remove('d-none');
    if (countEl) countEl.innerText = `${pendingLeaves.length} New`;

    listEl.innerHTML = pendingLeaves.map(req => {
      return `
        <li>
          <a href="#/leaves" class="dropdown-item px-3 py-2 border-bottom d-flex align-items-start gap-2 text-wrap" style="transition: var(--transition-smooth);">
            <div class="bg-warning-light text-warning rounded-circle p-1 me-1 fs-7 d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; flex-shrink: 0;">
              <i class="bi bi-calendar-range-fill"></i>
            </div>
            <div class="flex-grow-1">
              <div class="fw-semibold text-dark fs-7" style="font-size: 0.85rem;">${escapeHTML(req.name)}</div>
              <div class="text-muted fs-8 text-truncate" style="max-width: 190px; font-size: 0.75rem;">Requested: ${escapeHTML(req.type)}</div>
            </div>
          </a>
        </li>
      `;
    }).join('');
  } else {
    if (badgeEl) badgeEl.classList.add('d-none');
    if (countEl) countEl.innerText = `0 New`;

    listEl.innerHTML = `
      <li class="px-3 py-4 text-center text-muted small">
        <i class="bi bi-bell-slash d-block fs-3 mb-2 text-secondary"></i>
        No pending leave requests.
      </li>
    `;
  }
}
