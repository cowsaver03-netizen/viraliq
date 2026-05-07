// /* ===== LOCAL STORAGE MANAGEMENT ===== */

// class StorageManager {
//     constructor() {
//         this.prefix = 'admin_';
//         this.initializeDefaults();
//     }

//     initializeDefaults() {
//         const defaults = {
//             pricing: [
//                 {
//                     id: 1,
//                     name: 'Basic Plan',
//                     price: 9999,
//                     description: 'Perfect for getting started',
//                     features: ['Feature 1', 'Feature 2', 'Feature 3'],
//                     razorpayId: ''
//                 },
//                 {
//                     id: 2,
//                     name: 'Pro Plan',
//                     price: 19999,
//                     description: 'For growing businesses',
//                     features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
//                     razorpayId: ''
//                 }
//             ],
//             blogs: [
//                 {
//                     id: 1,
//                     keyword: 'example',
//                     heading: 'Example Blog Post',
//                     description: 'This is an example blog post',
//                     image: null,
//                     date: new Date().toISOString().split('T')[0]
//                 }
//             ],
//             team: [
//                 {
//                     id: 1,
//                     name: 'John Doe',
//                     designation: 'CEO',
//                     photo: null,
//                     instagram: 'https://instagram.com',
//                     facebook: 'https://facebook.com',
//                     twitter: 'https://twitter.com',
//                     whatsapp: '+91 98765 43210'
//                 }
//             ],
//             testimonials: [
//                 {
//                     id: 1,
//                     name: 'Jane Smith',
//                     position: 'Manager',
//                     comment: 'Great service and excellent support!',
//                     rating: 5
//                 }
//             ],
//             customers: [
//                 {
//                     id: 1,
//                     name: 'Customer 1',
//                     phone: '+91 98765 43210',
//                     plan: 'Pro Plan',
//                     amount: 19999,
//                     status: 'completed'
//                 }
//             ],
//             contact: [
//                 {
//                     id: 1,
//                     name: 'Contact 1',
//                     email: 'contact@example.com',
//                     phone: '+91 98765 43210',
//                     message: 'Sample inquiry',
//                     date: new Date().toISOString().split('T')[0]
//                 }
//             ],
//             newsletter: [
//                 {
//                     id: 1,
//                     email: 'subscriber@example.com',
//                     date: new Date().toISOString().split('T')[0]
//                 }
//             ],
//             social: {
//                 instagram: 'https://instagram.com/yourprofile',
//                 facebook: 'https://facebook.com/yourpage',
//                 twitter: 'https://twitter.com/yourhandle',
//                 whatsapp: '+91 98765 43210'
//             },
//             links: [],
//             whatsapp: {
//                 apiUrl: 'https://sensational-faun-1a5a11.netlify.app',
//                 number: '+91 98765 43210'
//             },
//             activityLog: []
//         };

//         // Initialize only if not already set
//         Object.keys(defaults).forEach(key => {
//             if (!this.get(key)) {
//                 this.set(key, defaults[key]);
//             }
//         });
//     }

//     set(key, value) {
//         try {
//             localStorage.setItem(this.prefix + key, JSON.stringify(value));
//             return true;
//         } catch (error) {
//             console.error('Error saving to storage:', error);
//             return false;
//         }
//     }

//     get(key) {
//         try {
//             const item = localStorage.getItem(this.prefix + key);
//             return item ? JSON.parse(item) : null;
//         } catch (error) {
//             console.error('Error reading from storage:', error);
//             return null;
//         }
//     }

//     remove(key) {
//         try {
//             localStorage.removeItem(this.prefix + key);
//             return true;
//         } catch (error) {
//             console.error('Error removing from storage:', error);
//             return false;
//         }
//     }

//     // Pricing Methods
//     getPricingPlans() {
//         return this.get('pricing') || [];
//     }

//     addPricingPlan(plan) {
//         const plans = this.getPricingPlans();
//         plan.id = Math.max(...plans.map(p => p.id), 0) + 1;
//         plan.createdAt = new Date().toISOString();
//         plans.push(plan);
//         this.set('pricing', plans);
//         return plan;
//     }

//     updatePricingPlan(id, updatedPlan) {
//         const plans = this.getPricingPlans();
//         const index = plans.findIndex(p => p.id === id);
//         if (index !== -1) {
//             plans[index] = { ...plans[index], ...updatedPlan, id };
//             this.set('pricing', plans);
//             return plans[index];
//         }
//         return null;
//     }

//     deletePricingPlan(id) {
//         const plans = this.getPricingPlans();
//         this.set('pricing', plans.filter(p => p.id !== id));
//     }

//     // Blog Methods
//     getBlogs() {
//         return this.get('blogs') || [];
//     }

//     addBlog(blog) {
//         const blogs = this.getBlogs();
//         blog.id = Math.max(...blogs.map(b => b.id), 0) + 1;
//         blog.date = new Date().toISOString().split('T')[0];
//         blogs.push(blog);
//         this.set('blogs', blogs);
//         return blog;
//     }

//     updateBlog(id, updatedBlog) {
//         const blogs = this.getBlogs();
//         const index = blogs.findIndex(b => b.id === id);
//         if (index !== -1) {
//             blogs[index] = { ...blogs[index], ...updatedBlog, id };
//             this.set('blogs', blogs);
//             return blogs[index];
//         }
//         return null;
//     }

//     deleteBlog(id) {
//         const blogs = this.getBlogs();
//         this.set('blogs', blogs.filter(b => b.id !== id));
//     }

//     // Team Methods
//     getTeamMembers() {
//         return this.get('team') || [];
//     }

//     addTeamMember(member) {
//         const team = this.getTeamMembers();
//         member.id = Math.max(...team.map(t => t.id), 0) + 1;
//         team.push(member);
//         this.set('team', team);
//         return member;
//     }

//     updateTeamMember(id, updatedMember) {
//         const team = this.getTeamMembers();
//         const index = team.findIndex(t => t.id === id);
//         if (index !== -1) {
//             team[index] = { ...team[index], ...updatedMember, id };
//             this.set('team', team);
//             return team[index];
//         }
//         return null;
//     }

//     deleteTeamMember(id) {
//         const team = this.getTeamMembers();
//         this.set('team', team.filter(t => t.id !== id));
//     }

//     // Testimonials Methods
//     getTestimonials() {
//         return this.get('testimonials') || [];
//     }

//     addTestimonial(testimonial) {
//         const testimonials = this.getTestimonials();
//         testimonial.id = Math.max(...testimonials.map(t => t.id), 0) + 1;
//         testimonials.push(testimonial);
//         this.set('testimonials', testimonials);
//         return testimonial;
//     }

//     updateTestimonial(id, updatedTestimonial) {
//         const testimonials = this.getTestimonials();
//         const index = testimonials.findIndex(t => t.id === id);
//         if (index !== -1) {
//             testimonials[index] = { ...testimonials[index], ...updatedTestimonial, id };
//             this.set('testimonials', testimonials);
//             return testimonials[index];
//         }
//         return null;
//     }

//     deleteTestimonial(id) {
//         const testimonials = this.getTestimonials();
//         this.set('testimonials', testimonials.filter(t => t.id !== id));
//     }

//     // Customers Methods
//     getCustomers() {
//         return this.get('customers') || [];
//     }

//     addCustomer(customer) {
//         const customers = this.getCustomers();
//         customer.id = Math.max(...customers.map(c => c.id), 0) + 1;
//         customers.push(customer);
//         this.set('customers', customers);
//         return customer;
//     }

//     updateCustomer(id, updatedCustomer) {
//         const customers = this.getCustomers();
//         const index = customers.findIndex(c => c.id === id);
//         if (index !== -1) {
//             customers[index] = { ...customers[index], ...updatedCustomer, id };
//             this.set('customers', customers);
//             return customers[index];
//         }
//         return null;
//     }

//     deleteCustomer(id) {
//         const customers = this.getCustomers();
//         this.set('customers', customers.filter(c => c.id !== id));
//     }

//     // Contact Methods
//     getContactInquiries() {
//         return this.get('contact') || [];
//     }

//     addContactInquiry(inquiry) {
//         const inquiries = this.getContactInquiries();
//         inquiry.id = Math.max(...inquiries.map(i => i.id), 0) + 1;
//         inquiry.date = new Date().toISOString().split('T')[0];
//         inquiries.push(inquiry);
//         this.set('contact', inquiries);
//         return inquiry;
//     }

//     deleteContactInquiry(id) {
//         const inquiries = this.getContactInquiries();
//         this.set('contact', inquiries.filter(i => i.id !== id));
//     }

//     // Newsletter Methods
//     getNewsletterSubscribers() {
//         return this.get('newsletter') || [];
//     }

//     addNewsletterSubscriber(email) {
//         const subscribers = this.getNewsletterSubscribers();
//         const subscriber = {
//             id: Math.max(...subscribers.map(s => s.id), 0) + 1,
//             email,
//             date: new Date().toISOString().split('T')[0]
//         };
//         subscribers.push(subscriber);
//         this.set('newsletter', subscribers);
//         return subscriber;
//     }

//     deleteNewsletterSubscriber(id) {
//         const subscribers = this.getNewsletterSubscribers();
//         this.set('newsletter', subscribers.filter(s => s.id !== id));
//     }

//     // Social Media Methods
//     getSocialLinks() {
//         return this.get('social') || {
//             instagram: '',
//             facebook: '',
//             twitter: '',
//             whatsapp: ''
//         };
//     }

//     updateSocialLinks(links) {
//         this.set('social', links);
//         return links;
//     }

//     // Pricing Links Methods
//     getGeneratedLinks() {
//         return this.get('links') || [];
//     }

//     addGeneratedLink(link) {
//         const links = this.getGeneratedLinks();
//         link.id = Math.max(...links.map(l => l.id), 0) + 1;
//         link.createdAt = new Date().toISOString();
//         links.push(link);
//         this.set('links', links);
//         return link;
//     }

//     deleteGeneratedLink(id) {
//         const links = this.getGeneratedLinks();
//         this.set('links', links.filter(l => l.id !== id));
//     }

//     // WhatsApp Methods
//     getWhatsAppConfig() {
//         return this.get('whatsapp') || {
//             apiUrl: 'https://sensational-faun-1a5a11.netlify.app',
//             number: ''
//         };
//     }

//     updateWhatsAppConfig(config) {
//         this.set('whatsapp', config);
//         return config;
//     }

//     // Activity Log Methods
//     getActivityLog() {
//         return this.get('activityLog') || [];
//     }

//     logActivity(action, module, details) {
//         const log = this.getActivityLog();
//         log.unshift({
//             id: Date.now(),
//             timestamp: new Date().toISOString(),
//             action,
//             module,
//             details
//         });
//         // Keep only last 50 activities
//         if (log.length > 50) log.pop();
//         this.set('activityLog', log);
//     }
// }

// // Initialize global storage manager
// const storage = new StorageManager();
