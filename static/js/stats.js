// Skills Radar Chart and simulated Git Grids for Sri Lakshman M L's Personal Portfolio

/* =========================================================================
   1. Chart.js Skills Radar Chart
   ========================================================================= */
function initSkillsRadarChart() {
    const ctx = document.getElementById('skills-radar-chart');
    if (!ctx) return;

    // Detect if dark mode is active
    const isDark = !document.documentElement.classList.contains('light');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark ? '#94a3b8' : '#475569';

    const data = {
        labels: ['AI & ML', 'IoT & Embedded', 'Web Dev', 'Robotics', 'Databases', 'DevOps'],
        datasets: [{
            label: 'Proficiency Level',
            data: [88, 92, 80, 85, 75, 78],
            fill: true,
            backgroundColor: 'rgba(0, 242, 254, 0.2)',
            borderColor: '#00f2fe',
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#8b5cf6',
            borderWidth: 2
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: gridColor
                    },
                    grid: {
                        color: gridColor
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            family: 'Outfit',
                            size: 11,
                            weight: '600'
                        }
                    },
                    ticks: {
                        display: false,
                        maxTicksLimit: 5
                    },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    const radarChart = new Chart(ctx, config);

    // Re-render chart grid colors on theme change
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(() => {
                const nextDark = !document.documentElement.classList.contains('light');
                const nextGridColor = nextDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
                const nextTextColor = nextDark ? '#94a3b8' : '#475569';
                
                radarChart.options.scales.r.angleLines.color = nextGridColor;
                radarChart.options.scales.r.grid.color = nextGridColor;
                radarChart.options.scales.r.pointLabels.color = nextTextColor;
                radarChart.update();
            }, 100);
        });
    }
}

/* =========================================================================
   2. Mock GitHub Contribution Graph Generator
   ========================================================================= */
function initGitHubGraph() {
    const container = document.getElementById('github-graph-container');
    if (!container) return;

    // Define dimensions: 53 weeks (columns) x 7 days (rows)
    const weeks = 53;
    const days = 7;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 740 100`);
    svg.setAttribute("class", "w-full overflow-visible");

    // Colors list based on contribution intensity (dark themes)
    const contributionColors = [
        "rgba(255, 255, 255, 0.03)", // 0 contributions
        "#0e4429",                   // L1
        "#006d32",                   // L2
        "#26a641",                   // L3
        "#39d353"                    // L4
    ];

    // Days name column offset
    const cellWidth = 10;
    const cellHeight = 10;
    const gap = 3;

    for (let w = 0; w < weeks; w++) {
        const colG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        colG.setAttribute("transform", `translate(${w * (cellWidth + gap)}, 0)`);

        for (let d = 0; d < days; d++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", cellWidth);
            rect.setAttribute("height", cellHeight);
            rect.setAttribute("y", d * (cellHeight + gap));
            rect.setAttribute("rx", "2"); // rounded corners

            // Simulated random contributions
            let val = Math.floor(Math.random() * 5);
            // Lower likelihood of high values for natural visual look
            if (val === 4 && Math.random() > 0.3) val = Math.floor(Math.random() * 3);
            
            rect.setAttribute("fill", contributionColors[val]);

            // Tooltip title
            const commits = val === 0 ? "No" : val * 3 + Math.floor(Math.random() * 3);
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `${commits} contributions on Week ${w + 1}, Day ${d + 1}`;
            rect.appendChild(title);

            colG.appendChild(rect);
        }

        svg.appendChild(colG);
    }

    container.appendChild(svg);
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    initSkillsRadarChart();
    initGitHubGraph();
});
