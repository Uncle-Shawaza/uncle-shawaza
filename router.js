window.Router = {
    currentPath: window.location.pathname,
    currentHash: window.location.hash,
    
    init: function() {
        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('hashchange', () => this.handleHash());
        this.handleRoute();
    },
    
    handleRoute: function() {
        this.currentPath = window.location.pathname;
        this.currentHash = window.location.hash;
        
        if (this.currentPath.includes('404')) {
            document.title = '404 - Page Not Found | Uncle Shawaza';
            return;
        }
        
        this.processHash();
    },
    
    handleHash: function() {
        this.currentHash = window.location.hash;
        this.processHash();
    },
    
    processHash: function() {
        const hash = this.currentHash.replace('#', '');
        
        if (!hash || hash === '' || hash === '/') {
            //window.App?.showMainView();
            document.title = 'Uncle Shawaza - Software & Web Developer';
            window.SEOManager?.updateMeta();
            return;
        }
        
        const parts = hash.split('/');
        const view = parts[0];
        
        let title = 'Uncle Shawaza';
        let description = '';
        
        switch(view) {
            case 'codes':
                title = 'Code Library - Uncle Shawaza';
                description = 'Collection of useful code snippets and examples';
                if (parts[1]) {
                    title = `${parts[1]} - Code Library | Uncle Shawaza`;
                    if (parts[2]) {
                        title = `${parts[2]} - ${parts[1]} | Uncle Shawaza`;
                    }
                }
                if (window.App) {
                    window.App?.showCodesView(parts[1], parts[2]);
                }
                break;
                
            case 'projects':
                title = 'Projects - Uncle Shawaza';
                description = 'Portfolio of software and web development projects';
                if (parts[1]) {
                    title = `${parts[1]} - Projects | Uncle Shawaza`;
                }
                if (window.App) {
                    window.App?.showProjectsView(parts[1]);
                }
                break;
                
            case 'courses':
                title = 'Courses - Uncle Shawaza';
                description = 'Programming and development courses';
                if (parts[1]) {
                    title = `${parts[1]} - Courses | Uncle Shawaza`;
                }
                if (window.App) {
                    window.App?.showCoursesView(parts[1]);
                }
                break;
            default:
                if (window.App) {
                    window.App.showMainView();
                 }
                 return;
        }
        
        window.SEOManager?.updateMeta(title, description);
        window.SEOManager?.trackPageView(window.location.pathname + window.location.hash);
    },
    
    navigate: function(path, hash) {
        let url = path || '/portfolio/';
        if (hash) {

            url += '#' + hash;
        }
        history.pushState(null, '', url);
        this.handleRoute();
    }
};
