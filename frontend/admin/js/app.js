/* ===== MAIN APP LOGIC & INITIALIZATION ===== */

class AdminApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.editingId = null;
        this.editingModule = null;
        this.init();
    }

    init() {
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav && activeNav.dataset.module) {
            this.currentModule = activeNav.dataset.module;
        }

        this.setupEventListeners();
        this.setupImagePreview();
        this.loadModules();
        this.updateDashboard();
    }

    loadModules() {
        const activeModuleSection = document.querySelector('.module.active');
        if (activeModuleSection && activeModuleSection.id) {
            this.loadModule(activeModuleSection.id);
            return;
        }

        this.loadModule(this.currentModule);
    }

    setupEventListeners() {
        // Sidebar Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const navLink = item.querySelector('.nav-link');
                if (!navLink) {
                    return;
                }

                const href = navLink.getAttribute('href') || '';
                const isInPageModuleLink = href.startsWith('#');

                if (!isInPageModuleLink) {
                    return;
                }

                e.preventDefault();
                const module = item.dataset.module;
                this.switchModule(module);
            });
        });

        // Sidebar Toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('mobile-open');
            });
        }

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('mobile-open');
            });
        }

        // Form Submissions
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        // Pricing Form
        const pricingForm = document.getElementById('pricingForm');
        if (pricingForm) {
            pricingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePricingSubmit();
            });
        }

        // Blog Form
        const blogForm = document.getElementById('blogForm');
        if (blogForm) {
            blogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBlogSubmit();
            });
        }

        // Team Form
        const teamForm = document.getElementById('teamForm');
        if (teamForm) {
            teamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTeamSubmit();
            });
        }

        // Testimonial Form
        const testimonialForm = document.getElementById('testimonialForm');
        if (testimonialForm) {
            testimonialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTestimonialSubmit();
            });
        }

        // Social Form
        document.addEventListener('DOMContentLoaded', () => {
            const socialForm = document.getElementById('socialForm');
            if (socialForm) {
                this.loadSocialLinks();
            }
        });
    }

    setupImagePreview() {
        handleFilePreview('teamPhoto', 'teamPhotoPreview');
        handleFilePreview('blogImage', 'blogImagePreview');
    }

    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
        });

        // Show selected module
        const module = document.getElementById(moduleName);
        if (module) {
            module.classList.add('active');
        }

        // Update sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === moduleName) {
                item.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'pricing': 'Pricing Plans Management',
            'blog': 'Blog Management',
            'team': 'Team Members',
            'testimonials': 'Testimonials',
            'customers': 'Customer Portal',
            'contact': 'Contact Inquiries',
            'newsletter': 'Newsletter Subscribers',
            'social': 'Social Media Settings',
            'links': 'Pricing Links Generator',
            'whatsapp': 'WhatsApp Integration'
        };

        document.querySelector('.page-title').textContent = titles[moduleName] || 'Dashboard';

        // Load module data
        this.loadModule(moduleName);

        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        }

        this.currentModule = moduleName;
    }

    loadModule(moduleName) {
        switch (moduleName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'pricing':
                if (typeof renderPricingCards === 'function') {
                    renderPricingCards();
                }
                break;
            case 'blog':
                if (typeof renderBlogTable === 'function') {
                    renderBlogTable();
                }
                break;
            case 'team':
                if (typeof renderTeamCards === 'function') {
                    renderTeamCards();
                }
                break;
            case 'testimonials':
                if (typeof renderTestimonials === 'function') {
                    renderTestimonials();
                }
                break;
            case 'customers':
                if (typeof renderCustomersTable === 'function') {
                    renderCustomersTable();
                }
                break;
            case 'contact':
                if (typeof renderContactTable === 'function') {
                    renderContactTable();
                }
                break;
            case 'newsletter':
                if (typeof renderNewsletterTable === 'function') {
                    renderNewsletterTable();
                }
                break;
            case 'social':
                if (typeof loadSocialLinks === 'function') {
                    loadSocialLinks();
                }
                break;
            case 'links':
                if (typeof renderGeneratedLinks === 'function') {
                    renderGeneratedLinks();
                    updatePlanSelectOptions();
                }
                break;
            case 'whatsapp':
                if (typeof loadWhatsAppConfig === 'function') {
                    loadWhatsAppConfig();
                    populateCustomerSelect();
                }
                break;
        }
    }

    updateDashboard() {
        const totalCustomersEl = document.getElementById('totalCustomers');
        const totalLeadsEl = document.getElementById('totalLeads');
        const activePlansEl = document.getElementById('activePlans');
        const pendingPlansEl = document.getElementById('pendingPlans');
        const activityLogEl = document.getElementById('activityLog');

        if (!totalCustomersEl || !totalLeadsEl || !activePlansEl || !pendingPlansEl || !activityLogEl) {
            return;
        }

        // Update stats
        const customers = storage.getCustomers();
        const contacts = storage.getContactInquiries();
        const plans = storage.getPricingPlans();

        totalCustomersEl.textContent = customers.length;
        totalLeadsEl.textContent = contacts.length;
        activePlansEl.textContent = 
            customers.filter(c => c.status === 'completed').length;
        pendingPlansEl.textContent = 
            customers.filter(c => c.status === 'pending').length;

        // Update activity log
        this.renderActivityLog();
    }

    renderActivityLog() {
        const log = storage.getActivityLog();
        const tbody = document.getElementById('activityLog');

        if (log.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No activity yet</td></tr>';
            return;
        }

        tbody.innerHTML = log.map(activity => `
            <tr>
                <td>${formatDate(activity.timestamp)}</td>
                <td>${escapeHtml(activity.action)}</td>
                <td>${escapeHtml(activity.module)}</td>
                <td>${escapeHtml(truncateText(activity.details, 50))}</td>
                <td><span class="badge badge-success">Completed</span></td>
            </tr>
        `).join('');
    }

    // Form Handlers
    handlePricingSubmit() {
        const name = document.getElementById('planName').value.trim();
        const price = parseFloat(document.getElementById('planPrice').value);
        const description = document.getElementById('planDescription').value.trim();
        const features = document.getElementById('planFeatures').value
            .trim()
            .split('\n')
            .filter(f => f.trim());
        const razorpayId = document.getElementById('razorpayId') ? document.getElementById('razorpayId').value.trim() : '';

        if (!name || !price || !description || features.length === 0) {
            notificationManager.error('Please fill in all required fields');
            return;
        }

        const plan = { name, price, description, features, razorpayId };

        if (this.editingId && this.editingModule === 'pricing') {
            storage.updatePricingPlan(this.editingId, plan);
            storage.logActivity('Update', 'Pricing', `Updated plan: ${name}`);
            notificationManager.success('Plan updated successfully ✓');
            this.editingId = null;
        } else {
            storage.addPricingPlan(plan);
            storage.logActivity('Create', 'Pricing', `Added plan: ${name}`);
            notificationManager.success('Plan added successfully ✓');
        }

        this.updateDashboard();
        if (typeof renderPricingCards === 'function') {
            renderPricingCards();
        }
        closeModal('pricingModal');
        clearForm('pricingForm');
    }

    handleBlogSubmit() {
        const keyword = document.getElementById('blogKeyword').value.trim();
        const heading = document.getElementById('blogHeading').value.trim();
        const description = document.getElementById('blogDescription').value.trim();
        const imageInput = document.getElementById('blogImage');

        if (!keyword || !heading || !description) {
            notificationManager.error('Please fill in all required fields');
            return;
        }

        const saveBlog = (imageData) => {
            const blog = { keyword, heading, description, image: imageData };

            if (this.editingId && this.editingModule === 'blog') {
                storage.updateBlog(this.editingId, blog);
                storage.logActivity('Update', 'Blog', `Updated: ${heading}`);
                notificationManager.success('Blog updated successfully');
                this.editingId = null;
            } else {
                storage.addBlog(blog);
                storage.logActivity('Create', 'Blog', `Added: ${heading}`);
                notificationManager.success('Blog added successfully');
            }

            if (typeof renderBlogTable === 'function') {
                renderBlogTable();
            }
            closeModal('blogModal');
            clearForm('blogForm');
            const preview = document.getElementById('blogImagePreview');
            if (preview) {
                preview.innerHTML = '<span class="text-muted">No image selected</span>';
            }
        };

        if (imageInput && imageInput.files && imageInput.files[0]) {
            fileToBase64(imageInput.files[0]).then(base64 => {
                saveBlog(base64);
            });
        } else if (this.editingId && this.editingModule === 'blog') {
            const blogs = storage.getBlogs();
            const existingBlog = blogs.find(blog => blog.id === this.editingId);
            saveBlog(existingBlog ? (existingBlog.image || null) : null);
        } else {
            saveBlog(null);
        }
    }

    handleTeamSubmit() {
        const name = document.getElementById('teamName').value.trim();
        const designation = document.getElementById('teamDesignation').value.trim();
        const instagram = document.getElementById('teamInstagram').value.trim();
        const facebook = document.getElementById('teamFacebook').value.trim();
        const twitter = document.getElementById('teamTwitter').value.trim();
        const whatsapp = document.getElementById('teamWhatsapp').value.trim();

        if (!name || !designation) {
            notificationManager.error('Name and designation are required');
            return;
        }

        const photoInput = document.getElementById('teamPhoto');
        let photo = null;

        const saveTeamMember = (photoData) => {
            const member = { name, designation, instagram, facebook, twitter, whatsapp, photo: photoData };

            if (this.editingId && this.editingModule === 'team') {
                storage.updateTeamMember(this.editingId, member);
                storage.logActivity('Update', 'Team', `Updated: ${name}`);
                notificationManager.success('Team member updated successfully');
                this.editingId = null;
            } else {
                storage.addTeamMember(member);
                storage.logActivity('Create', 'Team', `Added: ${name}`);
                notificationManager.success('Team member added successfully');
            }

            if (typeof renderTeamCards === 'function') {
                renderTeamCards();
            }
            closeModal('teamModal');
            clearForm('teamForm');
        };

        if (photoInput.files && photoInput.files[0]) {
            fileToBase64(photoInput.files[0]).then(base64 => {
                saveTeamMember(base64);
            });
        } else {
            saveTeamMember(null);
        }
    }

    handleTestimonialSubmit() {
        const name = document.getElementById('testimonialName').value.trim();
        const position = document.getElementById('testimonialPosition').value.trim();
        const comment = document.getElementById('testimonialComment').value.trim();
        const rating = parseInt(document.getElementById('testimonialRating').value);

        if (!name || !position || !comment) {
            notificationManager.error('Please fill in all required fields');
            return;
        }

        const testimonial = { name, position, comment, rating };

        if (this.editingId && this.editingModule === 'testimonials') {
            storage.updateTestimonial(this.editingId, testimonial);
            storage.logActivity('Update', 'Testimonials', `Updated: ${name}`);
            notificationManager.success('Testimonial updated successfully');
            this.editingId = null;
        } else {
            storage.addTestimonial(testimonial);
            storage.logActivity('Create', 'Testimonials', `Added: ${name}`);
            notificationManager.success('Testimonial added successfully');
        }

        if (typeof renderTestimonials === 'function') {
            renderTestimonials();
        }
        closeModal('testimonialModal');
        clearForm('testimonialForm');
    }

    loadSocialLinks() {
        const links = storage.getSocialLinks();
        document.getElementById('instagram').value = links.instagram || '';
        document.getElementById('facebook').value = links.facebook || '';
        document.getElementById('twitter').value = links.twitter || '';
        document.getElementById('whatsapp').value = links.whatsapp || '';
    }
}

// Initialize App
const app = new AdminApp();

// Global Functions
function saveSocialLinks() {
    const links = {
        instagram: document.getElementById('instagram').value.trim(),
        facebook: document.getElementById('facebook').value.trim(),
        twitter: document.getElementById('twitter').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim()
    };

    // Validate URLs
    const urlFields = ['instagram', 'facebook', 'twitter'];
    for (let field of urlFields) {
        if (links[field] && !validators.url(links[field])) {
            notificationManager.error(`Invalid URL for ${field}`);
            return;
        }
    }

    storage.updateSocialLinks(links);
    storage.logActivity('Update', 'Social Media', 'Social links updated');
    notificationManager.success('Social links updated successfully');
}

function loadSocialLinks() {
    const links = storage.getSocialLinks();
    document.getElementById('instagram').value = links.instagram || '';
    document.getElementById('facebook').value = links.facebook || '';
    document.getElementById('twitter').value = links.twitter || '';
    document.getElementById('whatsapp').value = links.whatsapp || '';
}

// Handle responsive sidebar
window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
    }
});
