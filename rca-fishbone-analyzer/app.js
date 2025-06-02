// Root Cause Analysis - Fishbone Diagram Application
class FishboneApp {
    constructor() {
        this.data = {
            methodologies: {
                "6M": ["Manpower", "Method", "Machine", "Material", "Measurement", "Mother Nature"],
                "4P": ["Policy", "Process", "People", "Plant"]
            },
            colors: {
                "Manpower": "#3498db", "Method": "#e74c3c", "Machine": "#f39c12",
                "Material": "#27ae60", "Measurement": "#9b59b6", "Mother Nature": "#16a085",
                "Policy": "#3498db", "Process": "#e74c3c", "People": "#f39c12", "Plant": "#27ae60"
            },
            priorityLevels: [
                {level: 1, label: "Very Low", color: "#95a5a6"},
                {level: 2, label: "Low", color: "#f1c40f"},
                {level: 3, label: "Medium", color: "#f39c12"},
                {level: 4, label: "High", color: "#e67e22"},
                {level: 5, label: "Critical", color: "#e74c3c"}
            ],
            statusOptions: ["Not Started", "In Progress", "Under Review", "Completed"]
        };
        
        this.state = {
            currentMethodology: "6M",
            problemStatement: "",
            causes: {},
            selectedCause: null,
            nextCauseId: 1
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromSession();
        this.renderFishbone();
        this.updateCharCount();
        this.updateReport();
    }

    setupEventListeners() {
        // Problem statement
        const problemInput = document.getElementById('problem-statement');
        problemInput.addEventListener('input', (e) => {
            this.state.problemStatement = e.target.value;
            this.updateCharCount();
            this.renderFishbone();
            this.saveToSession();
        });

        // Methodology toggle
        document.getElementById('methodology').addEventListener('change', (e) => {
            this.state.currentMethodology = e.target.value;
            this.state.causes = {}; // Clear causes when switching methodology
            this.renderFishbone();
            this.updateReport();
            this.saveToSession();
        });

        // Toolbar buttons
        document.getElementById('save-btn').addEventListener('click', () => this.saveProgress());
        document.getElementById('load-btn').addEventListener('click', () => this.loadProgress());
        document.getElementById('export-btn').addEventListener('click', () => this.exportReport());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal events
        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('cause-modal');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-cause-btn');
        const saveBtn = document.getElementById('save-cause-btn');
        const deleteBtn = document.getElementById('delete-cause-btn');

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => this.closeCauseModal());
        });

        saveBtn.addEventListener('click', () => this.saveCause());
        deleteBtn.addEventListener('click', () => this.deleteCause());

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeCauseModal();
        });
    }

    renderFishbone() {
        const svg = document.getElementById('fishbone-svg');
        svg.innerHTML = '';

        const width = 1200;
        const height = 800;
        const centerY = height / 2;
        const spineLength = 800;
        const spineStartX = 50;
        const spineEndX = spineStartX + spineLength;

        // Draw main spine
        this.createSVGElement(svg, 'line', {
            x1: spineStartX, y1: centerY,
            x2: spineEndX, y2: centerY,
            class: 'fishbone-spine'
        });

        // Draw problem box
        const problemBoxWidth = 180;
        const problemBoxHeight = 80;
        const problemBoxX = spineEndX + 20;
        const problemBoxY = centerY - problemBoxHeight / 2;

        this.createSVGElement(svg, 'rect', {
            x: problemBoxX, y: problemBoxY,
            width: problemBoxWidth, height: problemBoxHeight,
            rx: 8, ry: 8,
            class: 'problem-box',
            onclick: 'fishboneApp.editProblemStatement()'
        });

        // Problem text
        const problemText = this.state.problemStatement || 'Click to define problem';
        this.createSVGElement(svg, 'text', {
            x: problemBoxX + problemBoxWidth / 2,
            y: problemBoxY + problemBoxHeight / 2,
            class: 'problem-text',
            onclick: 'fishboneApp.editProblemStatement()'
        }, this.wrapText(problemText, 20));

        // Draw category branches
        const categories = this.data.methodologies[this.state.currentMethodology];
        const branchSpacing = spineLength / (categories.length + 1);

        categories.forEach((category, index) => {
            const isTop = index % 2 === 0;
            const x = spineStartX + branchSpacing * (index + 1);
            const branchLength = 120;
            const branchEndY = isTop ? centerY - branchLength : centerY + branchLength;
            const color = this.data.colors[category];

            // Category branch line
            this.createSVGElement(svg, 'line', {
                x1: x, y1: centerY,
                x2: x + (isTop ? -40 : 40), y2: branchEndY,
                stroke: color,
                class: 'category-branch'
            });

            // Category label
            const labelX = x + (isTop ? -50 : 50);
            const labelY = branchEndY + (isTop ? -10 : 20);
            
            this.createSVGElement(svg, 'text', {
                x: labelX, y: labelY,
                class: 'category-label',
                'text-anchor': 'middle',
                fill: color,
                onclick: `fishboneApp.showCategoryDetails('${category}')`
            }, category);

            // Add button for category
            const addBtnX = x + (isTop ? -70 : 70);
            const addBtnY = branchEndY + (isTop ? -35 : 35);

            this.createSVGElement(svg, 'circle', {
                cx: addBtnX, cy: addBtnY, r: 12,
                class: 'category-add-btn',
                onclick: `fishboneApp.addCause('${category}')`
            });

            this.createSVGElement(svg, 'text', {
                x: addBtnX, y: addBtnY,
                class: 'category-add-text',
                onclick: `fishboneApp.addCause('${category}')`
            }, '+');

            // Draw causes for this category
            this.renderCauses(svg, category, x, centerY, isTop, color);
        });
    }

    renderCauses(svg, category, branchX, centerY, isTop, color) {
        const categoryCauses = Object.values(this.state.causes).filter(cause => cause.category === category);
        
        categoryCauses.forEach((cause, index) => {
            const causeSpacing = 60;
            const causeX = branchX + (isTop ? -20 : 20) + (index * 15);
            const causeY = isTop ? centerY - 60 - (index * 25) : centerY + 60 + (index * 25);

            // Cause line
            this.createSVGElement(svg, 'line', {
                x1: branchX + (isTop ? -20 : 20), y1: isTop ? centerY - 60 : centerY + 60,
                x2: causeX, y2: causeY,
                class: 'cause-line',
                stroke: this.data.priorityLevels[cause.priority - 1].color
            });

            // Cause text
            const textElement = this.createSVGElement(svg, 'text', {
                x: causeX, y: causeY,
                class: 'cause-text',
                fill: this.data.priorityLevels[cause.priority - 1].color,
                onclick: `fishboneApp.editCause('${cause.id}')`
            }, this.truncateText(cause.text, 15));

            // Root cause indicator
            if (cause.isRootCause) {
                this.createSVGElement(svg, 'circle', {
                    cx: causeX - 10, cy: causeY - 5, r: 4,
                    class: 'root-cause-indicator'
                });
            }
        });
    }

    createSVGElement(parent, tag, attributes = {}, textContent = null) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        if (textContent) {
            element.textContent = textContent;
        }
        parent.appendChild(element);
        return element;
    }

    addCause(category) {
        const causeId = `cause-${this.state.nextCauseId++}`;
        this.state.causes[causeId] = {
            id: causeId,
            category: category,
            text: 'New Cause',
            priority: 3,
            status: 'Not Started',
            comments: '',
            isRootCause: false,
            whys: ['', '', '', '', '']
        };
        this.editCause(causeId);
        this.renderFishbone();
        this.updateReport();
        this.saveToSession();
    }

    editCause(causeId) {
        this.state.selectedCause = causeId;
        const cause = this.state.causes[causeId];
        
        document.getElementById('cause-text').value = cause.text;
        document.getElementById('cause-priority').value = cause.priority;
        document.getElementById('cause-status').value = cause.status;
        document.getElementById('cause-comments').value = cause.comments;
        document.getElementById('is-root-cause').checked = cause.isRootCause;
        document.getElementById('modal-title').textContent = 'Edit Cause';
        
        this.showCauseModal();
        this.showCauseDetails(causeId);
    }

    saveCause() {
        if (!this.state.selectedCause) return;

        const cause = this.state.causes[this.state.selectedCause];
        cause.text = document.getElementById('cause-text').value;
        cause.priority = parseInt(document.getElementById('cause-priority').value);
        cause.status = document.getElementById('cause-status').value;
        cause.comments = document.getElementById('cause-comments').value;
        cause.isRootCause = document.getElementById('is-root-cause').checked;

        this.closeCauseModal();
        this.renderFishbone();
        this.updateReport();
        this.saveToSession();
    }

    deleteCause() {
        if (!this.state.selectedCause) return;
        
        delete this.state.causes[this.state.selectedCause];
        this.closeCauseModal();
        this.renderFishbone();
        this.updateReport();
        this.saveToSession();
    }

    showCauseModal() {
        document.getElementById('cause-modal').classList.remove('hidden');
    }

    closeCauseModal() {
        document.getElementById('cause-modal').classList.add('hidden');
        this.state.selectedCause = null;
    }

    showCategoryDetails(category) {
        const categoryCauses = Object.values(this.state.causes).filter(cause => cause.category === category);
        const detailsContainer = document.getElementById('cause-details');
        
        if (categoryCauses.length === 0) {
            detailsContainer.innerHTML = `
                <h4>${category}</h4>
                <p class="help-text">No causes added yet. Click the + button to add a cause.</p>
            `;
            return;
        }

        let html = `<h4>${category} (${categoryCauses.length} causes)</h4>`;
        categoryCauses.forEach(cause => {
            const priorityColor = this.data.priorityLevels[cause.priority - 1].color;
            const priorityLabel = this.data.priorityLevels[cause.priority - 1].label;
            
            html += `
                <div class="cause-item" style="border-left: 4px solid ${priorityColor}; padding: 12px; margin: 8px 0; background: var(--color-background); border-radius: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${cause.text}</strong>
                        ${cause.isRootCause ? '<span class="status status--error">Root Cause</span>' : ''}
                    </div>
                    <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                        Priority: ${priorityLabel} | Status: ${cause.status}
                    </div>
                    ${cause.comments ? `<div style="margin-top: 8px; font-style: italic;">${cause.comments}</div>` : ''}
                    <button onclick="fishboneApp.editCause('${cause.id}')" class="btn btn--sm btn--outline" style="margin-top: 8px;">Edit</button>
                </div>
            `;
        });
        
        detailsContainer.innerHTML = html;
    }

    showCauseDetails(causeId) {
        const cause = this.state.causes[causeId];
        if (!cause) return;

        this.showCategoryDetails(cause.category);
        this.switchTab('analysis');
        this.showFiveWhys(causeId);
    }

    showFiveWhys(causeId) {
        const cause = this.state.causes[causeId];
        const container = document.getElementById('five-whys');
        
        let html = `<h4>5 Whys Analysis for: ${cause.text}</h4>`;
        
        for (let i = 0; i < 5; i++) {
            html += `
                <div class="why-item">
                    <div class="why-label">Why ${i + 1}:</div>
                    <input type="text" class="form-control why-input" 
                           value="${cause.whys[i] || ''}" 
                           onchange="fishboneApp.updateWhy('${causeId}', ${i}, this.value)"
                           placeholder="Why did this happen?">
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    updateWhy(causeId, index, value) {
        if (this.state.causes[causeId]) {
            this.state.causes[causeId].whys[index] = value;
            this.saveToSession();
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updateCharCount() {
        const problemInput = document.getElementById('problem-statement');
        const charCount = document.getElementById('char-count');
        charCount.textContent = problemInput.value.length;
        
        if (problemInput.value.length > 450) {
            charCount.style.color = 'var(--color-error)';
        } else {
            charCount.style.color = 'var(--color-text-secondary)';
        }
    }

    updateReport() {
        const causes = Object.values(this.state.causes);
        const totalCauses = causes.length;
        const highPriorityCauses = causes.filter(c => c.priority >= 4).length;
        const rootCauses = causes.filter(c => c.isRootCause).length;

        document.getElementById('total-causes').textContent = totalCauses;
        document.getElementById('high-priority-causes').textContent = highPriorityCauses;
        document.getElementById('root-causes').textContent = rootCauses;

        this.updatePriorityChart(causes);
    }

    updatePriorityChart(causes) {
        const priorityCounts = [0, 0, 0, 0, 0];
        causes.forEach(cause => {
            priorityCounts[cause.priority - 1]++;
        });

        const total = causes.length || 1;
        const container = document.getElementById('priority-chart');
        
        let html = '';
        this.data.priorityLevels.forEach((level, index) => {
            const count = priorityCounts[index];
            const percentage = (count / total) * 100;
            
            html += `
                <div class="priority-bar">
                    <div class="priority-bar-label">${level.label}</div>
                    <div class="priority-bar-fill" style="background: var(--color-secondary);">
                        <div class="priority-bar-progress" 
                             style="width: ${percentage}%; background: ${level.color};"></div>
                        <div class="priority-bar-text">${count}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    editProblemStatement() {
        document.getElementById('problem-statement').focus();
    }

    saveProgress() {
        const data = {
            state: this.state,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fishbone-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.state = data.state;
                        document.getElementById('problem-statement').value = this.state.problemStatement;
                        document.getElementById('methodology').value = this.state.currentMethodology;
                        this.renderFishbone();
                        this.updateReport();
                        this.saveToSession();
                    } catch (error) {
                        alert('Error loading file: Invalid format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportReport() {
        const causes = Object.values(this.state.causes);
        const rootCauses = causes.filter(c => c.isRootCause);
        
        let report = `# Root Cause Analysis Report\n\n`;
        report += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
        report += `**Problem Statement:** ${this.state.problemStatement || 'Not defined'}\n\n`;
        report += `**Methodology:** ${this.state.currentMethodology}\n\n`;
        
        report += `## Summary\n`;
        report += `- Total Causes Identified: ${causes.length}\n`;
        report += `- High Priority Causes: ${causes.filter(c => c.priority >= 4).length}\n`;
        report += `- Root Causes: ${rootCauses.length}\n\n`;
        
        if (rootCauses.length > 0) {
            report += `## Root Causes\n`;
            rootCauses.forEach((cause, index) => {
                report += `${index + 1}. **${cause.text}** (${cause.category})\n`;
                report += `   - Priority: ${this.data.priorityLevels[cause.priority - 1].label}\n`;
                report += `   - Status: ${cause.status}\n`;
                if (cause.comments) {
                    report += `   - Comments: ${cause.comments}\n`;
                }
                report += `\n`;
            });
        }
        
        const categories = this.data.methodologies[this.state.currentMethodology];
        categories.forEach(category => {
            const categoryCauses = causes.filter(c => c.category === category);
            if (categoryCauses.length > 0) {
                report += `## ${category}\n`;
                categoryCauses.forEach(cause => {
                    report += `- ${cause.text} (Priority: ${this.data.priorityLevels[cause.priority - 1].label})\n`;
                });
                report += `\n`;
            }
        });
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rca-report-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.state = {
                currentMethodology: "6M",
                problemStatement: "",
                causes: {},
                selectedCause: null,
                nextCauseId: 1
            };
            document.getElementById('problem-statement').value = '';
            document.getElementById('methodology').value = '6M';
            this.renderFishbone();
            this.updateReport();
            this.saveToSession();
        }
    }

    showHelp() {
        document.getElementById('help-modal').classList.remove('hidden');
    }

    saveToSession() {
        try {
            sessionStorage.setItem('fishbone-app-state', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Could not save to session storage:', error);
        }
    }

    loadFromSession() {
        try {
            const saved = sessionStorage.getItem('fishbone-app-state');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
                document.getElementById('problem-statement').value = this.state.problemStatement;
                document.getElementById('methodology').value = this.state.currentMethodology;
            }
        } catch (error) {
            console.warn('Could not load from session storage:', error);
        }
    }

    wrapText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
}

// Global functions for SVG event handlers
function closeHelpModal() {
    document.getElementById('help-modal').classList.add('hidden');
}

// Initialize the application
let fishboneApp;

document.addEventListener('DOMContentLoaded', () => {
    fishboneApp = new FishboneApp();
});

// Handle window beforeunload to save state
window.addEventListener('beforeunload', () => {
    if (fishboneApp) {
        fishboneApp.saveToSession();
    }
});