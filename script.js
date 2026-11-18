/* ==========================================
   TemplateHub — Interactive Functionality
   ========================================== */

// ============================================
// Template Data
// ============================================
const templates = [
  {
    id: 'budget-tracker',
    name: 'Monthly Budget Tracker',
    description: 'Track your income, expenses, and savings goals with automated calculations and visual breakdowns.',
    icon: '💰',
    category: 'finance',
    tags: ['Budget', 'Personal Finance', 'Monthly'],
    excelFile: 'templates/monthly-budget-tracker.xlsx',
    accentColor: '#06d6a0',
  },
  {
    id: 'invoice',
    name: 'Invoice Template',
    description: 'Professional invoice template with auto-calculated totals, tax fields, and clean formatting.',
    icon: '📄',
    category: 'business',
    tags: ['Invoice', 'Billing', 'Business'],
    excelFile: 'templates/invoice-template.xlsx',
    accentColor: '#4361ee',
  },
  {
    id: 'project-planner',
    name: 'Project Planner',
    description: 'Plan and track project milestones, tasks, deadlines, and team assignments in one organized sheet.',
    icon: '📋',
    category: 'planning',
    tags: ['Project', 'Planning', 'Tasks'],
    excelFile: 'templates/project-planner.xlsx',
    accentColor: '#7209b7',
  },
  {
    id: 'expense-report',
    name: 'Expense Report',
    description: 'Submit and organize business expenses with categories, receipt tracking, and approval workflows.',
    icon: '💳',
    category: 'finance',
    tags: ['Expense', 'Business', 'Report'],
    excelFile: 'templates/expense-report.xlsx',
    accentColor: '#f72585',
  },
  {
    id: 'weekly-schedule',
    name: 'Weekly Schedule',
    description: 'Organize your week with time blocks, priority tasks, and daily planning across all 7 days.',
    icon: '📅',
    category: 'planning',
    tags: ['Schedule', 'Weekly', 'Time Management'],
    excelFile: 'templates/weekly-schedule.xlsx',
    accentColor: '#ff6b35',
  },
  {
    id: 'inventory-tracker',
    name: 'Inventory Tracker',
    description: 'Monitor stock levels, track orders, set reorder points, and manage your product catalog.',
    icon: '📦',
    category: 'tracking',
    tags: ['Inventory', 'Stock', 'Products'],
    excelFile: 'templates/inventory-tracker.xlsx',
    accentColor: '#00b4d8',
  },
];

// Category label mapping
const categoryLabels = {
  finance: 'Finance',
  business: 'Business',
  planning: 'Planning',
  tracking: 'Tracking',
};

// ============================================
// DOM Elements
// ============================================
const templateGrid = document.getElementById('templateGrid');
const searchInput = document.getElementById('searchInput');
const filterBar = document.getElementById('filterBar');
const noResults = document.getElementById('noResults');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// ============================================
// State
// ============================================
let activeCategory = 'all';
let searchQuery = '';

// ============================================
// Template Card Rendering
// ============================================
function createTemplateCard(template) {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.dataset.category = template.category;
  card.dataset.id = template.id;

  // Set CSS custom properties for the accent color
  const r = parseInt(template.accentColor.slice(1, 3), 16);
  const g = parseInt(template.accentColor.slice(3, 5), 16);
  const b = parseInt(template.accentColor.slice(5, 7), 16);

  card.style.setProperty('--card-accent', template.accentColor);
  card.style.setProperty('--icon-bg', `rgba(${r}, ${g}, ${b}, 0.12)`);
  card.style.setProperty('--badge-bg', `rgba(${r}, ${g}, ${b}, 0.1)`);
  card.style.setProperty('--badge-color', template.accentColor);
  card.style.setProperty('--badge-border', `rgba(${r}, ${g}, ${b}, 0.2)`);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-icon">${template.icon}</div>
      <span class="card-badge">${categoryLabels[template.category]}</span>
    </div>
    <div class="card-content">
      <h3>${template.name}</h3>
      <p>${template.description}</p>
    </div>
    <div class="card-tags">
      ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="card-actions">
      <a href="${template.excelFile}" download class="btn-download btn-excel" id="download-excel-${template.id}" title="Download Excel file">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Excel
      </a>
      <button class="btn-download btn-sheets" id="download-sheets-${template.id}" title="Use in Google Sheets" onclick="handleSheetsClick('${template.excelFile}', '${template.name}')">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        Google Sheets
      </button>
    </div>
  `;

  // Track Excel downloads
  const excelBtn = card.querySelector('.btn-excel');
  excelBtn.addEventListener('click', (e) => {
    showToast('✅', `Downloading ${template.name}...`);
  });

  return card;
}

function renderTemplates() {
  templateGrid.innerHTML = '';

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery) ||
      t.description.toLowerCase().includes(searchQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      t.category.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    templateGrid.style.display = 'none';
  } else {
    noResults.classList.add('hidden');
    templateGrid.style.display = 'grid';
    filtered.forEach((t, i) => {
      const card = createTemplateCard(t);
      card.style.transitionDelay = `${i * 0.08}s`;
      templateGrid.appendChild(card);
      // Trigger animation after a brief delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      });
    });
  }
}

// ============================================
// Google Sheets Handler
// ============================================
function handleSheetsClick(excelFile, name) {
  // Download the file for the user
  const link = document.createElement('a');
  link.href = excelFile;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(
    '📊',
    `${name} downloaded! Open Google Sheets → File → Import to use it.`
  );
}

// ============================================
// Filter Logic
// ============================================
filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  // Update active state
  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  activeCategory = btn.dataset.category;
  renderTemplates();
});

// ============================================
// Search Logic
// ============================================
let searchDebounce;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTemplates();
  }, 200);
});

// ============================================
// Toast Notification
// ============================================
let toastTimeout;
function showToast(icon, message) {
  clearTimeout(toastTimeout);
  toastIcon.textContent = icon;
  toastMessage.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ============================================
// Mobile Menu
// ============================================
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve cards so they can re-animate after filtering
        if (!entry.target.classList.contains('template-card')) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Account for fixed navbar
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    }
  });
});

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderTemplates();
  initScrollAnimations();
});
