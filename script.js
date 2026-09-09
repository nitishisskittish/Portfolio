(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var idx = sections.indexOf(entry.target);
                btns.forEach(function (b, i) { b.classList.toggle('active', i === idx); });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    window.addEventListener('scroll', function () {
        var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
            btns.forEach(function (b, i) { b.classList.toggle('active', i === sections.length - 1); });
        }
    });
    sections.forEach(function (s) { if (s) io.observe(s); });

    var toasts = document.querySelectorAll('.toast');
    var tio = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function () { entry.target.classList.add('in'); }, i * 90);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    toasts.forEach(function (t) { tio.observe(t); });

    var boot = document.getElementById('boot');
    if (reduce) {
        boot.remove();
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
        setTimeout(function () { boot.remove(); }, 360);
        window.removeEventListener('click', skip);
        window.removeEventListener('keydown', skip);
    };
    setTimeout(skip, lineEls.length * 160 + 500);
    window.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
})();