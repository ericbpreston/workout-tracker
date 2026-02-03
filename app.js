// State management
let currentWeek = getWeekKey(new Date());
let workoutData = loadData();

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initWeekSelector();
    renderBoard();
    setupEventListeners();
});

// Get week key in format "2024-W01"
function getWeekKey(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

// Get week date range for display
function getWeekRange(weekKey) {
    const [year, week] = weekKey.split('-W');
    const jan1 = new Date(parseInt(year), 0, 1);
    const days = (parseInt(week) - 1) * 7;
    const monday = new Date(jan1.getTime() + days * 86400000);
    
    // Adjust to Monday
    const dayOfWeek = jan1.getDay();
    const diff = (dayOfWeek <= 4) ? (1 - dayOfWeek) : (8 - dayOfWeek);
    monday.setDate(jan1.getDate() + diff + days);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    return `${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)}`;
}

// Initialize week selector with recent weeks
function initWeekSelector() {
    const selector = document.getElementById('weekSelector');
    const today = new Date();
    
    // Generate weeks: 4 past, current, 2 future
    for (let i = -4; i <= 2; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + (i * 7));
        const weekKey = getWeekKey(d);
        const option = document.createElement('option');
        option.value = weekKey;
        option.textContent = `${getWeekRange(weekKey)} ${i === 0 ? '(This Week)' : ''}`;
        if (weekKey === currentWeek) option.selected = true;
        selector.appendChild(option);
    }
    
    selector.addEventListener('change', (e) => {
        currentWeek = e.target.value;
        renderBoard();
    });
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('workoutTracker');
    return saved ? JSON.parse(saved) : {};
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('workoutTracker', JSON.stringify(workoutData));
    showToast('Progress saved!');
}

// Get exercise data for current week
function getExerciseData(exerciseId) {
    if (!workoutData[currentWeek]) workoutData[currentWeek] = {};
    if (!workoutData[currentWeek][exerciseId]) {
        workoutData[currentWeek][exerciseId] = { reps: '', weight: '', completed: false };
    }
    return workoutData[currentWeek][exerciseId];
}

// Get previous week's data for comparison
function getPreviousData(exerciseId) {
    const weeks = Object.keys(workoutData).sort().reverse();
    for (const week of weeks) {
        if (week < currentWeek && workoutData[week][exerciseId]) {
            return { week, data: workoutData[week][exerciseId] };
        }
    }
    return null;
}

// Render the Kanban board
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (const [dayKey, day] of Object.entries(WORKOUTS)) {
        const column = createDayColumn(dayKey, day);
        board.appendChild(column);
    }
}

// Create a day column
function createDayColumn(dayKey, day) {
    const column = document.createElement('div');
    column.className = 'day-column';
    column.dataset.day = dayKey;
    
    // Calculate completion
    const { completed, total } = calculateCompletion(day);
    
    column.innerHTML = `
        <div class="day-header">
            <div>
                <div>${day.title} <span style="color: var(--text-secondary); font-weight: 400;">(${day.subtitle})</span></div>
                <div class="day-focus">${day.focus}</div>
            </div>
            <div class="completion">${completed}/${total}</div>
        </div>
        <div class="day-content">
            ${day.blocks.map(block => createBlock(block)).join('')}
        </div>
    `;
    
    return column;
}

// Calculate completion for a day
function calculateCompletion(day) {
    let completed = 0;
    let total = 0;
    
    day.blocks.forEach(block => {
        block.exercises.forEach(ex => {
            if (ex.targetReps) { // Only count trackable exercises
                total++;
                const data = getExerciseData(ex.id);
                if (data.completed) completed++;
            }
        });
    });
    
    return { completed, total };
}

// Create a block
function createBlock(block) {
    const isWarmup = block.type === 'warmup';
    
    return `
        <div class="block ${isWarmup ? 'warmup' : ''}">
            <div class="block-header" onclick="toggleBlock(this)">
                <span>${block.name}</span>
                <span class="chevron">▼</span>
            </div>
            <div class="block-content">
                ${block.exercises.map(ex => createExercise(ex, isWarmup)).join('')}
            </div>
        </div>
    `;
}

// Create an exercise card
function createExercise(exercise, isWarmup) {
    if (isWarmup || !exercise.targetReps) {
        // Simple warmup display
        return `
            <div class="exercise">
                <div class="exercise-header">
                    <span class="exercise-name">${exercise.name}</span>
                    <span class="exercise-sets">${exercise.sets}</span>
                </div>
                ${exercise.note ? `<div class="exercise-why" style="display:block;">${exercise.note}</div>` : ''}
            </div>
        `;
    }
    
    const data = getExerciseData(exercise.id);
    const previous = getPreviousData(exercise.id);
    
    return `
        <div class="exercise ${data.completed ? 'completed' : ''}" data-id="${exercise.id}">
            <div class="exercise-header">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-sets">${exercise.sets} × ${exercise.targetReps}</span>
            </div>
            ${exercise.why ? `<div class="exercise-why">💡 ${exercise.why}</div>` : ''}
            ${exercise.technique ? `<div class="exercise-technique">📝 ${exercise.technique}</div>` : ''}
            <div class="input-row">
                <div class="input-group">
                    <label>Reps</label>
                    <input type="text" 
                           placeholder="${exercise.targetReps}" 
                           value="${data.reps}"
                           data-field="reps"
                           data-id="${exercise.id}">
                </div>
                <div class="input-group">
                    <label>Weight</label>
                    <input type="text" 
                           placeholder="kg/lbs" 
                           value="${data.weight}"
                           data-field="weight"
                           data-id="${exercise.id}">
                </div>
                <button class="check-btn ${data.completed ? 'checked' : ''}" 
                        data-id="${exercise.id}"
                        onclick="toggleComplete('${exercise.id}')">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>
            ${previous ? `
                <div class="previous-data">
                    Last time: <strong>${previous.data.reps || '—'} reps @ ${previous.data.weight || '—'}</strong>
                </div>
            ` : ''}
        </div>
    `;
}

// Toggle block collapse
function toggleBlock(header) {
    header.parentElement.classList.toggle('collapsed');
}

// Toggle exercise completion
function toggleComplete(exerciseId) {
    const data = getExerciseData(exerciseId);
    data.completed = !data.completed;
    saveData();
    renderBoard();
}

// Setup event listeners
function setupEventListeners() {
    // Input changes - use event delegation
    document.getElementById('board').addEventListener('input', (e) => {
        if (e.target.matches('input[data-id]')) {
            const id = e.target.dataset.id;
            const field = e.target.dataset.field;
            const data = getExerciseData(id);
            data[field] = e.target.value;
            
            // Debounced save
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(saveData, 1000);
        }
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Clear week button
    document.getElementById('clearWeekBtn').addEventListener('click', () => {
        if (confirm('Clear all data for this week?')) {
            delete workoutData[currentWeek];
            saveData();
            renderBoard();
        }
    });
}

// Export data as JSON
function exportData() {
    const dataStr = JSON.stringify(workoutData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-data-${currentWeek}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Data exported!');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
