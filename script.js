window.App = {
    mainData: null,
    codesData: null,
    coursesData: null,
    projectsData: null,
    testimonialsData: null,
    currentView: 'main',
    currentCategory: null,
    currentItem: null,
    
    init: async function() {
        window.ThemeManager.init();
        window.AnimationManager.init();
        window.Router.init();
        
        await this.loadAllData();
    },
    
    loadAllData: async function() {
        try {
            const [mainRes, codesRes, coursesRes, projectsRes, testimonialsRes] = await Promise.all([
                fetch('/data.json'),
                fetch('/codes.json'),
                fetch('/courses.json'),
                fetch('/projects.json'),
                fetch('/testimonials.json')
            ]);
            
            this.mainData = await mainRes.json();
            this.codesData = await codesRes.json();
            this.coursesData = await coursesRes.json();
            this.projectsData = await projectsRes.json();
            this.testimonialsData = await testimonialsRes.json();
            
            this.buildMainSections(this.mainData.main);
            this.buildFooter(this.mainData.footer);
            
            window.Router.processHash();
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('main-content').innerHTML = '<p style="color:red;">Failed to load data.</p>';
        }
    },
    
    buildMainSections: function(mainData) {
        const mainEl = document.getElementById('main-content');
        mainEl.innerHTML = '';

        const profileSection = this.createSection('profile', 'profile-section');
        profileSection.setAttribute('data-aos', 'fade-up');
        profileSection.innerHTML = `
            <div class="profile-grid">
                <div class="profile-left">
                    <img src="${mainData.profile.image}" alt="Uncle Shawaza" class="profile-img">
                    <h1 class="profile-name">${mainData.profile.name}</h1>
                </div>
                <div class="profile-right">
                    <p class="profile-desc">${mainData.profile.description}</p>
                    <button class="btn-scroll" data-target="stats-section">Explore stats <i class="fa-solid fa-arrow-down"></i></button>
                </div>
            </div>
        `;
        mainEl.appendChild(profileSection);

        const aboutSection = this.createSection('about', 'about-section');
        aboutSection.setAttribute('data-aos', 'fade-up');
        aboutSection.innerHTML = `<h2 class="section-title">Quick glances</h2>` +
            mainData.about.map(item => `
                <div class="about-item" data-aos="fade-right">
                    <div class="about-icon"><i class="${item.icon}"></i></div>
                    <div class="about-text">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
        mainEl.appendChild(aboutSection);

        const skillsSection = this.createSection('skills', 'skills-section');
        skillsSection.setAttribute('data-aos', 'fade-up');
        skillsSection.innerHTML = `<h2 class="section-title">Tech & tools</h2>` +
            `<div class="skills-cloud">` +
            mainData.skills.map(skill => `<span class="skill-badge" data-aos="zoom-in">${skill}</span>`).join('') +
            `</div>`;
        mainEl.appendChild(skillsSection);

        const statsSection = this.createSection('stats', 'stats-section');
        statsSection.setAttribute('data-aos', 'fade-up');
        statsSection.innerHTML = `<h2 class="section-title">By numbers</h2>` +
            `<div class="stats-grid">` +
            mainData.stats.map(stat => `
                <div class="stat-card" data-aos="flip-left">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('') +
            `</div>`;
        mainEl.appendChild(statsSection);

        const closingSection = this.createSection('closing', 'closing-section');
        closingSection.setAttribute('data-aos', 'fade-up');
        closingSection.innerHTML = `
            <div class="closing-message">
                <i class="fa-solid fa-quote-right"></i>
                <p>${mainData.closing}</p>
            </div>
        `;
        mainEl.appendChild(closingSection);

        document.querySelector('.btn-scroll')?.addEventListener('click', () => {
            const target = document.getElementById('stats-section');
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        });
        
        window.AnimationManager.init();
    },
    
    buildFooter: function(footerData) {
        const footerEl = document.getElementById('footer-placeholder');
        footerEl.innerHTML = `
            <div class="footer-container">
                <div class="footer-col">
                    <i class="${footerData.icon}"></i> <strong>${footerData.brand}</strong>
                    <p>${footerData.description}</p>
                </div>
                <div class="footer-col">
                    <h4>Quick</h4>
                    <ul>
                        ${footerData.quickLinks.map(link => `<li><a class="quick-link" data-view="${link.toLowerCase()}">${link}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <div class="social-links">
                        ${footerData.social.map(s => `<a href="${s.url}" target="_blank" rel="noopener"><i class="${s.icon}"></i></a>`).join('')}
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                ${footerData.copyright}
            </div>
        `;

        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const view = e.target.closest('a').dataset.view;
                if (view === 'codes') {
                    window.Router.navigate('/portfolio/', 'codes');
                    this.showCodesView();
                } else if (view === 'projects') {
                    window.Router.navigate('/portfolio/', 'projects');
                    this.showProjectsView();
                } else if (view === 'courses') {
                    window.Router.navigate('/portfolio/', 'courses');
                    this.showCoursesView();
                } else if (view === 'contact') {
                    this.showMainView();
                    window.Router.navigate('/portfolio/', '');
                }
            });
        });
    },
    
    showMainView: function() {
        this.currentView = 'main';
        document.getElementById('main-content').innerHTML = '';
        this.buildMainSections(this.mainData.main);
    },
    
    showCodesView: function(category, item) {
        this.currentView = 'codes';
        if (category && item) {
            this.showCodeItem(category, item);
        } else if (category) {
            this.showCodesCategory(category);
        } else {
            this.renderCodesCategories();
        }
    },
    
    showProjectsView: function(projectId) {
        this.currentView = 'projects';
        if (projectId) {
            this.showProjectDetail(projectId);
        } else {
            this.renderProjectsCategories();
        }
    },
    
    showCoursesView: function(courseId) {
        this.currentView = 'courses';
        if (courseId) {
            this.showCourseDetail(courseId);
        } else {
            this.renderCoursesCategories();
        }
    },
    
    renderCodesCategories: function() {
        const mainEl = document.getElementById('main-content');
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showMainView(); window.Router.navigate('/portfolio/', '')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
            <h2 class="section-title" data-aos="fade-right">Code Library</h2>
            <div class="categories-grid" id="categories-container"></div>
        `;

        const container = document.getElementById('categories-container');
        
        for (const [categoryKey, category] of Object.entries(this.codesData)) {
            const firstItem = Object.values(category)[0];
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-aos', 'fade-up');
            card.onclick = () => {
                window.Router.navigate('/portfolio/', `codes/${categoryKey}`);
                this.showCodesCategory(categoryKey);
            };
            card.innerHTML = `
                <div class="category-icon"><i class="${firstItem?.icon || 'fa-solid fa-code'}"></i></div>
                <div class="category-title">${categoryKey.replace('_', ' ').toUpperCase()}</div>
                <div class="category-desc">${Object.keys(category).length} items available</div>
            `;
            container.appendChild(card);
        }
        
        window.AnimationManager.init();
    },
    
    showCodesCategory: function(categoryKey) {
        this.currentCategory = categoryKey;
        const mainEl = document.getElementById('main-content');
        const category = this.codesData[categoryKey];
        
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showCodesView(); window.Router.navigate('/portfolio/', 'codes')"><i class="fa-solid fa-arrow-left"></i> Back to Categories</button>
            <h2 class="section-title">${categoryKey.replace('_', ' ').toUpperCase()}</h2>
            <div class="items-grid" id="items-container"></div>
        `;

        const container = document.getElementById('items-container');
        
        for (const [itemKey, item] of Object.entries(category)) {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.setAttribute('data-aos', 'fade-up');
            card.onclick = () => {
                window.Router.navigate('/portfolio/', `codes/${categoryKey}/${itemKey}`);
                this.showCodeItem(categoryKey, itemKey);
            };
            card.innerHTML = `
                <div class="item-header">
                    <div class="item-icon"><i class="${item.icon || 'fa-solid fa-file-code'}"></i></div>
                    <div class="item-title">${item.title || itemKey}</div>
                </div>
                <div class="item-desc">${item.desc || ''}</div>
                <div class="item-tags">
                    ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            container.appendChild(card);
        }
        
        window.AnimationManager.init();
    },
    
    showCodeItem: function(categoryKey, itemKey) {
        this.currentItem = { category: categoryKey, item: itemKey };
        const item = this.codesData[categoryKey][itemKey];
        const content = item.source?.content || item.content || '// Code not available';
        
        const mainEl = document.getElementById('main-content');
        mainEl.innerHTML = `
            <div class="breadcrumb">
                <span onclick="App.showCodesView(); window.Router.navigate('/portfolio/', 'codes')">Codes</span>
                <i class="fa-solid fa-chevron-right"></i>
                <span onclick="App.showCodesCategory('${categoryKey}'); window.Router.navigate('/portfolio/', 'codes/${categoryKey}')">${categoryKey.replace('_', ' ').toUpperCase()}</span>
                <i class="fa-solid fa-chevron-right"></i>
                <span>${item.title || itemKey}</span>
            </div>
            
            <div class="item-header">
                <div class="item-icon"><i class="${item.icon || 'fa-solid fa-file-code'}"></i></div>
                <div class="item-title">${item.title || itemKey}</div>
            </div>
            <div class="item-desc">${item.desc || ''}</div>
            <div class="item-tags">
                ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="item-actions">
                <button class="action-btn" onclick="App.copyCode()"><i class="fa-regular fa-copy"></i> Copy</button>
                <button class="action-btn" onclick="App.downloadCode()"><i class="fa-solid fa-download"></i> Download</button>
            </div>
            
            <pre class="code-viewer"><code id="code-content">${this.escapeHtml(content)}</code></pre>
        `;
        
        window.AnimationManager.highlightCode();
    },
    
    renderProjectsCategories: function() {
        const mainEl = document.getElementById('main-content');
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showMainView(); window.Router.navigate('/portfolio/', '')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
            <h2 class="section-title" data-aos="fade-right">My Projects</h2>
            <div class="categories-grid" id="projects-container"></div>
        `;

        const container = document.getElementById('projects-container');
        
        for (const [projectKey, project] of Object.entries(this.projectsData)) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-aos', 'fade-up');
            card.onclick = () => {
                window.Router.navigate('/portfolio/', `projects/${projectKey}`);
                this.showProjectDetail(projectKey);
            };
            card.innerHTML = `
                <div class="category-icon"><i class="${project.icon || 'fa-solid fa-diagram-project'}"></i></div>
                <div class="category-title">${project.title || projectKey.replace('_', ' ').toUpperCase()}</div>
                <div class="category-desc">${project.desc || 'Click to view details'}</div>
                <div class="category-tags">
                    ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            container.appendChild(card);
        }
        
        window.AnimationManager.init();
    },
    
    showProjectDetail: function(projectKey) {
        const project = this.projectsData[projectKey];
        const mainEl = document.getElementById('main-content');
        
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showProjectsView(); window.Router.navigate('/portfolio/', 'projects')"><i class="fa-solid fa-arrow-left"></i> Back to Projects</button>
            
            <div class="item-header" data-aos="fade-right">
                <div class="item-icon"><i class="${project.icon || 'fa-solid fa-diagram-project'}"></i></div>
                <div class="item-title">${project.title || projectKey}</div>
            </div>
            
            <div class="item-desc" data-aos="fade-up">${project.desc || ''}</div>
            
            <div class="item-tags" data-aos="fade-up">
                ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="project-content" data-aos="fade-up">
                <h3>Technologies Used</h3>
                <div class="skills-cloud">
                    ${(project.technologies || []).map(tech => `<span class="skill-badge">${tech}</span>`).join('')}
                </div>
                
                <h3>Features</h3>
                <ul class="features-list">
                    ${(project.features || []).map(feature => `<li><i class="fa-solid fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                
                ${project.liveUrl ? `
                    <div class="project-links">
                        <a href="${project.liveUrl}" target="_blank" class="action-btn"><i class="fa-solid fa-globe"></i> Live Demo</a>
                        <a href="${project.githubUrl}" target="_blank" class="action-btn"><i class="fa-brands fa-github"></i> Source Code</a>
                    </div>
                ` : ''}
            </div>
        `;
        
        window.AnimationManager.init();
    },
    
    renderCoursesCategories: function() {
        const mainEl = document.getElementById('main-content');
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showMainView(); window.Router.navigate('/portfolio/', '')"><i class="fa-solid fa-arrow-left"></i> Back to Home</button>
            <h2 class="section-title" data-aos="fade-right">My Courses</h2>
            <div class="categories-grid" id="courses-container"></div>
        `;

        const container = document.getElementById('courses-container');
        
        for (const [courseKey, course] of Object.entries(this.coursesData)) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-aos', 'fade-up');
            card.onclick = () => {
                window.Router.navigate('/portfolio/', `courses/${courseKey}`);
                this.showCourseDetail(courseKey);
            };
            card.innerHTML = `
                <div class="category-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                <div class="category-title">${course.title || courseKey.replace('_', ' ').toUpperCase()}</div>
                <div class="category-desc">${course.desc || 'Click to view course content'}</div>
                <div class="category-tags">
                    <span class="tag">${course.content?.length || 0} lessons</span>
                </div>
            `;
            container.appendChild(card);
        }
        
        window.AnimationManager.init();
    },
    
    showCourseDetail: function(courseKey) {
        const course = this.coursesData[courseKey];
        const mainEl = document.getElementById('main-content');
        
        mainEl.innerHTML = `
            <button class="back-button" onclick="App.showCoursesView(); window.Router.navigate('/portfolio/', 'courses')"><i class="fa-solid fa-arrow-left"></i> Back to Courses</button>
            
            <h2 class="section-title" data-aos="fade-right">${course.title || courseKey.replace('_', ' ').toUpperCase()}</h2>
            <div class="course-description" data-aos="fade-up">${course.desc || ''}</div>
            
            <div class="course-content" id="course-content" data-aos="fade-up"></div>
        `;

        const container = document.getElementById('course-content');
        
        course.content.forEach((item, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'content-item';
            contentDiv.setAttribute('data-aos', 'fade-up');
            
            let mediaHtml = '';
            if (item.attached) {
                if (item.content?.includes('youtube')) {
                    mediaHtml = `
                        <div class="video-container">
                            <iframe src="${item.content}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    `;
                } else if (item.content) {
                    mediaHtml = `
                        <div class="video-container">
                            <video controls src="${item.content}"></video>
                        </div>
                    `;
                }
            }
            
            contentDiv.innerHTML = `
                <h3>${item.title || `Lesson ${index + 1}`}</h3>
                <p>${item.desc || ''}</p>
                ${mediaHtml}
            `;
            container.appendChild(contentDiv);
        });
        
        window.AnimationManager.init();
    },
    
    createSection: function(id, className) {
        const section = document.createElement('section');
        section.id = id + '-section';
        section.classList.add(className);
        return section;
    },
    
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    copyCode: function() {
        const code = document.getElementById('code-content')?.textContent;
        if (code) {
            navigator.clipboard.writeText(code);
            alert('Code copied to clipboard!');
        }
    },
    
    downloadCode: function() {
        const code = document.getElementById('code-content')?.textContent;
        if (code) {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'code.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});
