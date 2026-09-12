(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.addEventListener('load', function () {
        setTimeout(function () {
            var t = document.querySelector('.terminal');
            if (t) t.classList.add('in');
        }, 3000);
    });

    function tick() {
        var d = new Date();
        var h = String(d.getHours()).padStart(2, '0');
        var mi = String(d.getMinutes()).padStart(2, '0');
        document.getElementById('clock').textContent = h + ':' + mi;
    }
    tick();
    setInterval(tick, 1000 * 15);

    var sections = ['whoami', 'stack', 'projects', 'contact'].map(function (id) {
        return document.getElementById(id);
    });
    var btns = document.querySelectorAll('.ws-btn');

    function updateActiveWorkspace() {
        var refY = document.querySelector('.waybar').offsetHeight + 20;
        var activeIndex = 0;
        sections.forEach(function (s, i) {
            if (!s) return;
            var top = s.getBoundingClientRect().top;
            if (top <= refY) activeIndex = i;
        });
        var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) activeIndex = sections.length - 1;
        btns.forEach(function (b, i) { b.classList.toggle('active', i === activeIndex); });
    }
    window.addEventListener('scroll', updateActiveWorkspace, { passive: true });
    window.addEventListener('resize', updateActiveWorkspace);
    updateActiveWorkspace();

    function revealGroup(items, opts) {
        opts = opts || {};
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    var delay = opts.stagger ? i * opts.stagger : 0;
                    setTimeout(function () { entry.target.classList.add('in'); }, delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: opts.threshold || 0.2 });
        items.forEach(function (el) { io.observe(el); });
    }

    revealGroup(document.querySelectorAll('.sec-head'), { threshold: 0.4 });
    revealGroup(document.querySelectorAll('.launcher'), { threshold: 0.15 });
    revealGroup(document.querySelectorAll('.tile-layout .win'), { stagger: 100, threshold: 0.2 });
    revealGroup(document.querySelectorAll('.toasts .toast'), { stagger: 90, threshold: 0.3 });

    var boot = document.getElementById('boot');
    if (reduce) {
        boot.remove();
        var t0 = document.querySelector('.terminal');
        if (t0) t0.classList.add('in');
        return;
    }

    var lines = [
        'initializing session...',
        'mounting ~/assets  [ok]',
        'loading index.html [ok]',
        'loading style.css  [ok]',
        'loading script.js  [ok]',
        'starting window manager...',
        'ready.',
        '',
        'Welcome to my website!'
    ];
    var html = lines.map(function (l) { return '<span class="line">' + l + '</span>'; }).join('\n');
    boot.innerHTML = html + '\n<span class="cursor2"></span>';
    var lineEls = boot.querySelectorAll('.line');
    lineEls.forEach(function (el, i) {
        setTimeout(function () { el.style.opacity = 1; }, i * 160);
    });
    var skip = function () {
        boot.style.transition = 'opacity .35s ease';
        boot.style.opacity = 0;
        var t = document.querySelector('.terminal');
        if (t) t.classList.add('in');
        setTimeout(function () { boot.remove(); }, 360);
        window.removeEventListener('click', skip);
        window.removeEventListener('keydown', skip);
    };
    setTimeout(skip, lineEls.length * 160 + 500);
    window.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
})();