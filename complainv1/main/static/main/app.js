// ================================================
// CGMS - Smart Complaint Management System
// JavaScript functionality
// ================================================

// Global Variables
let complaints = [];
let currentView = 'grid';
let currentFilter = {
    status: 'all',
    priority: 'all',
    search: '',
    sort: 'date-desc'
};
let editingComplaintId = null;

// ================================================
// Initialization
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadComplaints();
    loadTheme();
    
    // Initialize event listeners
    initializeNavigation();
    initializeThemeToggle();
    initializeComplaintControls();
    initializeFilters();
    initializeModal();
    initializeForms();
    
    // Update UI
    updateStatistics();
    renderComplaints();
    updateActivityFeed();
    
    // Show welcome toast
    showToast('System initialized successfully', 'success');
}

// ================================================
// Local Storage Management
// ================================================

function loadComplaints() {
    const stored = localStorage.getItem('cgms_complaints');
    if (stored) {
        complaints = JSON.parse(stored);
    } else {
        // Add sample data for demonstration
        complaints = [
            {
                id: generateId(),
                title: 'Network connectivity issues in Lab A',
                category: 'technical',
                priority: 'high',
                status: 'pending',
                description: 'Internet connection keeps dropping every 10-15 minutes, affecting student work and online submissions.',
                location: 'Computer Lab A, 2nd Floor',
                reporter: 'John Smith',
                contact: 'john.smith@example.com',
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: generateId(),
                title: 'Air conditioning malfunction',
                category: 'infrastructure',
                priority: 'medium',
                status: 'in-progress',
                description: 'AC unit in the main hall is not cooling properly. Temperature reaching uncomfortable levels.',
                location: 'Main Hall, Ground Floor',
                reporter: 'Sarah Johnson',
                contact: 'sarah.j@example.com',
                date: new Date(Date.now() - 86400000).toISOString(),
                lastUpdated: new Date().toISOString()
            },
            {
                id: generateId(),
                title: 'Missing lab equipment',
                category: 'administrative',
                priority: 'low',
                status: 'resolved',
                description: 'Several microscopes and measurement tools are missing from Biology Lab B inventory.',
                location: 'Biology Lab B, 3rd Floor',
                reporter: 'Dr. Michael Brown',
                contact: 'michael.brown@example.com',
                date: new Date(Date.now() - 172800000).toISOString(),
                lastUpdated: new Date(Date.now() - 43200000).toISOString()
            }
        ];
        saveComplaints();
    }
}

function saveComplaints() {
    localStorage.setItem('cgms_complaints', JSON.stringify(complaints));
}

function loadTheme() {
    const theme = localStorage.getItem('cgms_theme') || 'light';
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
}

function saveTheme(theme) {
    localStorage.setItem('cgms_theme', theme);
}

// ================================================
// Navigation System
// ================================================

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const quickActions = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
    
    quickActions.forEach(action => {
        action.addEventListener('click', (e) => {
            if (!action.classList.contains('nav-link')) {
                e.preventDefault();
            }
            const page = action.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Update page-specific content
    if (pageName === 'complaints') {
        renderComplaints();
    }
}

// ================================================
// Theme Toggle
// ================================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        document.body.className = isDark ? 'light-mode' : 'dark-mode';
        saveTheme(isDark ? 'light' : 'dark');
        showToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'success');
    });
}

// ================================================
// Complaint Controls
// ================================================

function initializeComplaintControls() {
    // Add complaint buttons
    document.getElementById('quickAddComplaint').addEventListener('click', () => {
        openComplaintModal();
    });
    
    document.getElementById('addComplaintBtn').addEventListener('click', () => {
        openComplaintModal();
    });
    
    document.getElementById('emptyAddBtn').addEventListener('click', () => {
        openComplaintModal();
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
        exportComplaints();
    });
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderComplaints();
        });
    });
}

// ================================================
// Filter System
// ================================================

function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');
    
    searchInput.addEventListener('input', (e) => {
        currentFilter.search = e.target.value.toLowerCase();
        renderComplaints();
    });
    
    filterStatus.addEventListener('change', (e) => {
        currentFilter.status = e.target.value;
        renderComplaints();
    });
    
    filterPriority.addEventListener('change', (e) => {
        currentFilter.priority = e.target.value;
        renderComplaints();
    });
    
    sortBy.addEventListener('change', (e) => {
        currentFilter.sort = e.target.value;
        renderComplaints();
    });
}

function filterComplaints(complaintsList) {
    let filtered = [...complaintsList];
    
    // Search filter
    if (currentFilter.search) {
        filtered = filtered.filter(complaint => 
            complaint.title.toLowerCase().includes(currentFilter.search) ||
            complaint.description.toLowerCase().includes(currentFilter.search) ||
            complaint.reporter.toLowerCase().includes(currentFilter.search) ||
            complaint.location.toLowerCase().includes(currentFilter.search)
        );
    }
    
    // Status filter
    if (currentFilter.status !== 'all') {
        filtered = filtered.filter(complaint => complaint.status === currentFilter.status);
    }
    
    // Priority filter
    if (currentFilter.priority !== 'all') {
        filtered = filtered.filter(complaint => complaint.priority === currentFilter.priority);
    }
    
    // Sort
    switch (currentFilter.sort) {
        case 'date-desc':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'priority':
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
    }
    
    return filtered;
}

// ================================================
// Render Complaints
// ================================================

function renderComplaints() {
    const container = document.getElementById('complaintsContainer');
    const emptyState = document.getElementById('emptyState');
    const filtered = filterComplaints(complaints);
    
    // Update view class
    container.className = currentView === 'list' ? 'complaints-grid list-view' : 'complaints-grid';
    
    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        container.innerHTML = filtered.map(complaint => createComplaintCard(complaint)).join('');
        
        // Add event listeners to action buttons
        attachComplaintActions();
    }
}

function createComplaintCard(complaint) {
    const date = new Date(complaint.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const timeAgo = getTimeAgo(date);
    
    return `
        <div class="complaint-card" data-id="${complaint.id}">
            <div class="complaint-header">
                <div class="complaint-id">ID: ${complaint.id.substring(0, 8).toUpperCase()}</div>
                <div class="complaint-badges">
                    <span class="badge badge-priority ${complaint.priority}">${complaint.priority}</span>
                    <span class="badge badge-status ${complaint.status}">${complaint.status.replace('-', ' ')}</span>
                </div>
            </div>
            
            <h3 class="complaint-title">${escapeHtml(complaint.title)}</h3>
            
            <div class="complaint-category">${complaint.category}</div>
            
            <p class="complaint-description">${escapeHtml(complaint.description)}</p>
            
            <div class="complaint-meta">
                <div class="complaint-meta-item">
                    <span class="meta-label">Reporter</span>
                    <span class="meta-value">${escapeHtml(complaint.reporter)}</span>
                </div>
                <div class="complaint-meta-item">
                    <span class="meta-label">Location</span>
                    <span class="meta-value">${escapeHtml(complaint.location || 'N/A')}</span>
                </div>
                <div class="complaint-meta-item">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${timeAgo}</span>
                </div>
            </div>
            
            <div class="complaint-actions">
                ${complaint.status !== 'resolved' && complaint.status !== 'closed' ? 
                    `<button class="action-icon-btn resolve" data-id="${complaint.id}" title="Mark as Resolved">✓</button>` : 
                    ''}
                <button class="action-icon-btn edit" data-id="${complaint.id}" title="Edit">✎</button>
                <button class="action-icon-btn delete" data-id="${complaint.id}" title="Delete">×</button>
            </div>
        </div>
    `;
}

function attachComplaintActions() {
    // Edit buttons
    document.querySelectorAll('.action-icon-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            editComplaint(id);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.action-icon-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteComplaint(id);
        });
    });
    
    // Resolve buttons
    document.querySelectorAll('.action-icon-btn.resolve').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            resolveComplaint(id);
        });
    });
}

// ================================================
// CRUD Operations
// ================================================

function addComplaint(complaintData) {
    const newComplaint = {
        id: generateId(),
        ...complaintData,
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'pending'
    };
    
    complaints.unshift(newComplaint);
    saveComplaints();
    updateStatistics();
    renderComplaints();
    addActivityLog(`New complaint added: ${complaintData.title}`);
    showToast('Complaint added successfully', 'success');
}

function editComplaint(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    editingComplaintId = id;
    openComplaintModal(complaint);
}

function updateComplaint(id, updatedData) {
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) return;
    
    complaints[index] = {
        ...complaints[index],
        ...updatedData,
        lastUpdated: new Date().toISOString()
    };
    
    saveComplaints();
    updateStatistics();
    renderComplaints();
    addActivityLog(`Complaint updated: ${updatedData.title}`);
    showToast('Complaint updated successfully', 'success');
}

function deleteComplaint(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    if (confirm(`Are you sure you want to delete this complaint?\n\n"${complaint.title}"\n\nThis action cannot be undone.`)) {
        complaints = complaints.filter(c => c.id !== id);
        saveComplaints();
        updateStatistics();
        renderComplaints();
        addActivityLog(`Complaint deleted: ${complaint.title}`);
        showToast('Complaint deleted successfully', 'success');
    }
}

function resolveComplaint(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    if (confirm(`Mark this complaint as resolved?\n\n"${complaint.title}"`)) {
        const index = complaints.findIndex(c => c.id === id);
        complaints[index].status = 'resolved';
        complaints[index].lastUpdated = new Date().toISOString();
        
        saveComplaints();
        updateStatistics();
        renderComplaints();
        addActivityLog(`Complaint resolved: ${complaint.title}`);
        showToast('Complaint marked as resolved', 'success');
    }
}

// ================================================
// Modal Management
// ================================================

function initializeModal() {
    const modal = document.getElementById('complaintModal');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeComplaintModal());
    cancelBtn.addEventListener('click', () => closeComplaintModal());
    overlay.addEventListener('click', () => closeComplaintModal());
}

function openComplaintModal(complaint = null) {
    const modal = document.getElementById('complaintModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtnText = document.getElementById('submitBtnText');
    const form = document.getElementById('complaintForm');
    
    if (complaint) {
        // Edit mode
        modalTitle.textContent = 'Edit Complaint';
        submitBtnText.textContent = 'Update Complaint';
        fillForm(complaint);
    } else {
        // Add mode
        modalTitle.textContent = 'New Complaint';
        submitBtnText.textContent = 'Submit Complaint';
        form.reset();
        editingComplaintId = null;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeComplaintModal() {
    const modal = document.getElementById('complaintModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    editingComplaintId = null;
}

function fillForm(complaint) {
    document.getElementById('complaintId').value = complaint.id;
    document.getElementById('complaintTitle').value = complaint.title;
    document.getElementById('complaintCategory').value = complaint.category;
    document.getElementById('complaintPriority').value = complaint.priority;
    document.getElementById('complaintDescription').value = complaint.description;
    document.getElementById('complaintLocation').value = complaint.location || '';
    document.getElementById('complaintReporter').value = complaint.reporter;
    document.getElementById('complaintContact').value = complaint.contact || '';
}

// ================================================
// Form Handling
// ================================================

function initializeForms() {
    const complaintForm = document.getElementById('complaintForm');
    const contactForm = document.getElementById('contactForm');
    
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleComplaintSubmit();
    });
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactSubmit();
    });
}

function handleComplaintSubmit() {
    const formData = {
        title: document.getElementById('complaintTitle').value.trim(),
        category: document.getElementById('complaintCategory').value,
        priority: document.getElementById('complaintPriority').value,
        description: document.getElementById('complaintDescription').value.trim(),
        location: document.getElementById('complaintLocation').value.trim(),
        reporter: document.getElementById('complaintReporter').value.trim(),
        contact: document.getElementById('complaintContact').value.trim()
    };
    
    if (editingComplaintId) {
        updateComplaint(editingComplaintId, formData);
    } else {
        addComplaint(formData);
    }
    
    closeComplaintModal();
}

function handleContactSubmit() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate form submission
    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    document.getElementById('contactForm').reset();
    
    addActivityLog(`Contact message received from ${name}`);
}

// ================================================
// Statistics
// ================================================

function updateStatistics() {
    const stats = {
        pending: complaints.filter(c => c.status === 'pending').length,
        progress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        total: complaints.length
    };
    
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statProgress').textContent = stats.progress;
    document.getElementById('statResolved').textContent = stats.resolved;
    document.getElementById('statTotal').textContent = stats.total;
}

// ================================================
// Activity Feed
// ================================================

function updateActivityFeed() {
    const feed = document.getElementById('activityFeed');
    const activities = getRecentActivities();
    
    feed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function getRecentActivities() {
    const activities = JSON.parse(localStorage.getItem('cgms_activities') || '[]');
    return activities.slice(0, 5); // Show only 5 most recent
}

function addActivityLog(text) {
    const activities = JSON.parse(localStorage.getItem('cgms_activities') || '[]');
    activities.unshift({
        text,
        time: getTimeAgo(new Date()),
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.pop();
    }
    
    localStorage.setItem('cgms_activities', JSON.stringify(activities));
    updateActivityFeed();
}

// ================================================
// Export Functionality
// ================================================

function exportComplaints() {
    if (complaints.length === 0) {
        showToast('No complaints to export', 'error');
        return;
    }
    
    // Create CSV content
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Description', 'Location', 'Reporter', 'Contact', 'Date', 'Last Updated'];
    const rows = complaints.map(c => [
        c.id,
        c.title,
        c.category,
        c.priority,
        c.status,
        c.description,
        c.location || '',
        c.reporter,
        c.contact || '',
        new Date(c.date).toLocaleString(),
        new Date(c.lastUpdated).toLocaleString()
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `CGMS_Complaints_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Complaints exported successfully', 'success');
    addActivityLog('Complaint data exported to CSV');
}

// ================================================
// Toast Notifications
// ================================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ================================================
// Utility Functions
// ================================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    return 'Just now';
}

// ================================================
// Keyboard Shortcuts
// ================================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: New complaint
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openComplaintModal();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('complaintModal');
        if (modal.classList.contains('active')) {
            closeComplaintModal();
        }
    }
    
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// ================================================
// Initial Activity Log
// ================================================

if (!localStorage.getItem('cgms_activities')) {
    addActivityLog('System initialized');
}
