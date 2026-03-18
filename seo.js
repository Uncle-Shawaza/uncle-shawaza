window.SEOManager = {
    defaultTitle: 'Uncle Shawaza - Software & Web Developer',
    defaultDescription: 'Building digital solutions with clean code and creativity. Software & web developer since 2015.',
    defaultImage: 'https://uncle-shawaza.github.io/portfolio/icon.png',
    
    updateMeta: function(title, description, image) {
        document.title = title || this.defaultTitle;
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description || this.defaultDescription;
        
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = title || this.defaultTitle;
        
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = description || this.defaultDescription;
        
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.content = image || this.defaultImage;
        
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.content = title || this.defaultTitle;
        
        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.content = description || this.defaultDescription;
        
        let twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) twitterImage.content = image || this.defaultImage;
    },
    
    trackPageView: function(path) {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: path
            });
        }
        
        let history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
        history.push({
            path: path,
            timestamp: new Date().toISOString(),
            title: document.title
        });
        
        if (history.length > 50) history.shift();
        localStorage.setItem('pageHistory', JSON.stringify(history));
    }
};