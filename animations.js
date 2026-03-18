window.AnimationManager = {
    init: function() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-in-out'
            });
        }
        
        this.initHoverEffects();
    },
    
    initHoverEffects: function() {
        document.querySelectorAll('.category-card, .item-card, .skill-badge').forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-5px)';
            });
            
            el.addEventListener('mouseleave', function(e) {
                this.style.transform = 'translateY(0)';
            });
        });
    },
    
    highlightCode: function() {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }
};