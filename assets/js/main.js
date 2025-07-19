// main.js - Unified JS for Portfolio website

document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar underline effect
    const navLinks = document.querySelectorAll('.nav-link');
    const path = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (
            (path === '' && link.getAttribute('href').includes('index.html')) ||
            (path === link.getAttribute('href'))
        ) {
            link.classList.add('nav-active');
        }
    });

    // Fade-in effect
    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = () => {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        });
    };
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);

    // Typed hero effect (index only)
    if (document.querySelector('.typed-text')) {
        const typedText = document.querySelector('.typed-text');
        const phrases = [
            'Competitive Programmer',
            '2 Star in CodeChef',
            'Pupil at Codeforces',
            '8-Kyu on AtCoder',
            'Web Developer',
            'ICPC Dhaka Regionalist 2024'
        ];
        let phraseIdx = 0, charIdx = 0, isDeleting = false;
        function type() {
            const current = phrases[phraseIdx];
            if (isDeleting) {
                charIdx--;
                if (charIdx < 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            } else {
                charIdx++;
                if (charIdx > current.length) {
                    isDeleting = true;
                    setTimeout(type, 900);
                    return;
                }
            }
            typedText.textContent = current.substring(0, charIdx);
            setTimeout(type, isDeleting ? 60 : 110);
        }
        type();
    }

    // Gallery modal (gallery only)
    if (document.querySelector('.gallery-section')) {
        const modal = document.querySelector('.modal');
        const modalImg = document.querySelector('.modal-img');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Open modal on gallery item click
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                modal.classList.add('open');
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal on click (anywhere on the modal)
        modal.addEventListener('click', (e) => {
            modal.classList.remove('open');
            modalImg.src = '';
            document.body.style.overflow = '';
        });

        // Prevent image click from closing modal (optional)
        modalImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                modal.classList.remove('open');
                modalImg.src = '';
                document.body.style.overflow = '';
            }
        });
    }

    // Achievements rating history graphs
    if (document.getElementById('cfChart') || document.getElementById('acChart') || document.getElementById('ccChart')) {
        async function fetchJson(url, timeout = 5000) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) throw new Error('Network response was not ok');
                return await res.json();
            } catch (e) {
                console.warn('API fetch failed:', e);
                return null;
            }
        }

        function generateSyntheticHistory(contests, finalRating, start = 400) {
            let arr = [start];
            const avgStep = (finalRating - start) / (contests - 1);

            // Generate points with controlled volatility
            for (let i = 1; i < contests - 1; i++) {
                const progress = i / (contests - 1); // 0 to 1
                const expectedRating = start + (finalRating - start) * progress;

                // More volatility in the middle, less at start/end
                const volatility = Math.sin(progress * Math.PI) * 100;
                const variation = (Math.random() - 0.5) * volatility;

                // Ensure we don't go too far from the expected progression
                const rating = Math.round(expectedRating + variation);
                arr.push(Math.max(start - 50, rating));
            }

            arr.push(finalRating); // Ensure we end exactly at finalRating
            return arr;
        }

        // Chart.js common configuration
        const chartConfig = (color) => ({
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 2,
                        fill: true,
                    },
                    point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255,255,255,0.1)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#fff',
                            font: { size: 10 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        async function fetchAllAndRender() {
            // Set loading indicators
            if (document.getElementById('cf-rank')) document.getElementById('cf-rank').textContent = 'Loading...';
            if (document.getElementById('cf-best')) document.getElementById('cf-best').textContent = 'Loading...';
            if (document.getElementById('ac-rank')) document.getElementById('ac-rank').textContent = 'Loading...';
            if (document.getElementById('ac-best')) document.getElementById('ac-best').textContent = 'Loading...';
            if (document.getElementById('cc-rank')) document.getElementById('cc-rank').textContent = 'Loading...';
            if (document.getElementById('cc-best')) document.getElementById('cc-best').textContent = 'Loading...';

            // --- AtCoder ---
            const acContests = 31, acFinal = 450, acRank = '8 Kyu';
            let acHistory = generateSyntheticHistory(acContests, acFinal, 0);
            if (document.getElementById('ac-rank')) document.getElementById('ac-rank').textContent = acRank;
            if (document.getElementById('ac-best')) document.getElementById('ac-best').textContent = acFinal;

            // --- CodeChef ---
            const ccContests = 27, ccFinal = 1587, ccRank = '2 Star';
            let ccHistory = generateSyntheticHistory(ccContests, ccFinal, 0);
            if (document.getElementById('cc-rank')) document.getElementById('cc-rank').textContent = ccRank;
            if (document.getElementById('cc-best')) document.getElementById('cc-best').textContent = ccFinal;

            // --- Codeforces ---
            let cfHistory = [], cfLabels = [], cfRank = 'N/A', cfBest = 0;
            let cfTimeout = false;
            // Helper: fetch with timeout
            async function fetchWithTimeout(url, ms = 3500) {
                return Promise.race([
                    fetchJson(url),
                    new Promise(resolve => setTimeout(() => { cfTimeout = true; resolve(null); }, ms))
                ]);
            }
            let cfInfo = await fetchWithTimeout('https://codeforces.com/api/user.info?handles=khun_');
            if (cfInfo && cfInfo.status === 'OK') {
                const user = cfInfo.result[0];
                cfRank = user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : 'N/A';
                cfBest = user.maxRating || user.rating || 0;
            }
            let cfData = await fetchWithTimeout('https://codeforces.com/api/user.rating?handle=khun_');
            if (cfData && cfData.status === 'OK') {
                cfHistory = cfData.result.map(e => e.newRating);
                cfLabels = cfData.result.map((e, i) => `CF #${i + 1}`);
                if (cfHistory.length > 0) cfBest = Math.max(cfBest, ...cfHistory);
            } else {
                // fallback: show a synthetic history if API fails or times out
                cfHistory = generateSyntheticHistory(25, cfBest || 1200, 800, 150);
                if (cfTimeout) cfRank = 'Unavailable';
            }
            if (document.getElementById('cf-rank')) document.getElementById('cf-rank').textContent = cfRank;
            if (document.getElementById('cf-best')) document.getElementById('cf-best').textContent = cfBest;

            // --- Unify labels for x-axis (max contest count) ---
            let maxLen = Math.max(cfHistory.length, acHistory.length, ccHistory.length);
            let labels = [];
            for (let i = 0; i < maxLen; ++i) {
                let l = [];
                if (acHistory[i] !== undefined && i < acContests) l.push(`AC #${i + 1}`);
                if (cfHistory[i] !== undefined && i < cfHistory.length) l.push(`CF #${i + 1}`);
                if (ccHistory[i] !== undefined && i < ccContests) l.push(`CC #${i + 1}`);
                labels.push(l.join(' / '));
            }

            // Pad histories to same length for chart
            function pad(arr, len) {
                let last = arr[arr.length - 1] || 0;
                return arr.concat(Array(len - arr.length).fill(last));
            }
            acHistory = pad(acHistory, maxLen);
            cfHistory = pad(cfHistory, maxLen);
            ccHistory = pad(ccHistory, maxLen);

            async function initCharts() {
                // AtCoder synthetic data
                const acContests = 31, acFinal = 450;
                const acHistory = generateSyntheticHistory(acContests, acFinal, 0);
                if (document.getElementById('ac-rank')) document.getElementById('ac-rank').textContent = '8 Kyu';
                if (document.getElementById('ac-best')) document.getElementById('ac-best').textContent = acFinal;

                // CodeChef synthetic data
                const ccContests = 27, ccFinal = 1587;
                const ccHistory = generateSyntheticHistory(ccContests, ccFinal, 0);
                if (document.getElementById('cc-rank')) document.getElementById('cc-rank').textContent = '2 Star';
                if (document.getElementById('cc-best')) document.getElementById('cc-best').textContent = ccFinal;

                // Fetch Codeforces data
                let cfHistory = [], cfRank = 'N/A', cfBest = 0;
                const cfInfo = await fetchJson('https://codeforces.com/api/user.info?handles=khun_');
                if (cfInfo?.status === 'OK') {
                    const user = cfInfo.result[0];
                    cfRank = user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : 'N/A';
                    cfBest = user.maxRating || user.rating || 0;
                }
                const cfData = await fetchJson('https://codeforces.com/api/user.rating?handle=khun_');
                if (cfData?.status === 'OK') {
                    cfHistory = cfData.result.map(e => e.newRating);
                    if (cfHistory.length > 0) cfBest = Math.max(cfBest, ...cfHistory);
                } else {
                    cfHistory = generateSyntheticHistory(25, cfBest || 1200, 800, 150);
                }

                if (document.getElementById('cf-rank')) document.getElementById('cf-rank').textContent = cfRank;
                if (document.getElementById('cf-best')) document.getElementById('cf-best').textContent = cfBest;

                // Render charts
                const charts = [
                    {
                        id: 'cfChart',
                        data: cfHistory,
                        color: '#00c0ff',
                        bg: 'rgba(0,192,255,0.1)'
                    },
                    {
                        id: 'acChart',
                        data: acHistory,
                        color: '#4ade80',
                        bg: 'rgba(74,222,128,0.1)'
                    },
                    {
                        id: 'ccChart',
                        data: ccHistory,
                        color: '#fcd34d',
                        bg: 'rgba(252,211,77,0.1)'
                    }
                ];

                charts.forEach(chart => {
                    const canvas = document.getElementById(chart.id);
                    if (!canvas) return;

                    const ctx = canvas.getContext('2d');
                    if (window[`${chart.id}Obj`]) window[`${chart.id}Obj`].destroy();

                    window[`${chart.id}Obj`] = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Array.from({ length: chart.data.length }, (_, i) => `Contest ${i + 1}`),
                            datasets: [{
                                data: chart.data,
                                borderColor: chart.color,
                                backgroundColor: chart.bg,
                                borderWidth: 2,
                                tension: 0,
                                fill: true,
                                pointRadius: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                x: { display: false },
                                y: {
                                    min: 0,
                                    grid: {
                                        color: 'rgba(255,255,255,0.1)',
                                        drawBorder: false
                                    },
                                    ticks: {
                                        color: '#fff',
                                        font: { size: 10 },
                                        maxTicksLimit: 5,
                                        stepSize: Math.ceil(Math.max(...chart.data) / 5)
                                    },
                                    suggestedMax: chart.data.length > 0 ? Math.max(...chart.data) * 1.1 : 2000
                                }
                            },
                            elements: {
                                line: {
                                    tension: 0.3,
                                    borderWidth: 2,
                                    fill: 'start'
                                },
                                point: {
                                    radius: 0,
                                    hoverRadius: 4
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index'
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeInOutQuart'
                            }
                        }
                    });
                });
            }

            // Initialize all charts
            initCharts();
            if (document.getElementById('cfChart')) {
                if (window.cfChartObj) window.cfChartObj.destroy();
                window.cfChartObj = new Chart(document.getElementById('cfChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: Array.from({ length: cfHistory.length }, (_, i) => `Contest ${i + 1}`),
                        datasets: [{
                            data: cfHistory,
                            borderColor: '#00c0ff',
                            backgroundColor: 'rgba(0,192,255,0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: commonChartOptions
                });
            }

            // --- Render AtCoder Chart ---
            if (document.getElementById('acChart')) {
                if (window.acChartObj) window.acChartObj.destroy();
                window.acChartObj = new Chart(document.getElementById('acChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: Array.from({ length: acHistory.length }, (_, i) => `Contest ${i + 1}`),
                        datasets: [{
                            data: acHistory,
                            borderColor: '#4ade80',
                            backgroundColor: 'rgba(74,222,128,0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: commonChartOptions
                });
            }

            // --- Render CodeChef Chart ---
            if (document.getElementById('ccChart')) {
                if (window.ccChartObj) window.ccChartObj.destroy();
                window.ccChartObj = new Chart(document.getElementById('ccChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: Array.from({ length: ccHistory.length }, (_, i) => `Contest ${i + 1}`),
                        datasets: [{
                            data: ccHistory,
                            borderColor: '#fcd34d',
                            backgroundColor: 'rgba(252,211,77,0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: commonChartOptions
                });
            }
        }
        fetchAllAndRender();
    }
});
