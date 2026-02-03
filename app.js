// State
let currentWeek = getWeekKey(new Date());
let currentDay = getTodayWorkoutDay();
let workoutData = loadData();

// Number of sets per exercise
const SETS_PER_EXERCISE = 3;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initWeekSelector();
    initDayTabs();
    renderWorkoutView();
    setupEventListeners();
});

// Get today's workout day (or monday if not a workout day)
function getTodayWorkoutDay() {
    const dayMap = { 1: 'monday', 2: 'tuesday', 4: 'thursday', 5: 'friday' };
    const today = new Date().getDay();
    return dayMap[today] || 'monday';
}

// Get week key - fixed to use ISO week calculation
function getWeekKey(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    // Get Thursday of this week (ISO weeks start Monday, Thursday determines the week's year)
    const thursday = new Date(d);
    thursday.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
    
    // Get first Thursday of the year
    const firstThursday = new Date(thursday.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);
    
    // Calculate week number
    const weekNum = Math.round((thursday - firstThursday) / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    return `${thursday.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

// Get Monday of a week from week key
function getWeekMonday(weekKey) {
    const [year, week] = weekKey.split('-W').map(Number);
    
    // Find first Thursday of the year
    const jan4 = new Date(year, 0, 4);
    const firstThursday = new Date(jan4);
    firstThursday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + 3);
    
    // Get the Monday of week 1
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - 3);
    
    // Add weeks
    const targetMonday = new Date(firstMonday);
    targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    return targetMonday;
}

// Get week date range for display
function getWeekRange(weekKey) {
    const monday = getWeekMonday(weekKey);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    return `${monday.toLocaleDateString('en-US', options)} - ${sunday.toLocaleDateString('en-US', options)}`;
}

// Initialize week selector - only current week and future weeks
function initWeekSelector() {
    const selector = document.getElementById('weekSelector');
    const today = new Date();
    
    // Generate weeks: current week + 8 future weeks
    for (let i = 0; i <= 8; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + (i * 7));
        const weekKey = getWeekKey(d);
        
        // Skip if we already added this week (can happen at week boundaries)
        if (selector.querySelector(`option[value="${weekKey}"]`)) continue;
        
        const option = document.createElement('option');
        option.value = weekKey;
        option.textContent = `${getWeekRange(weekKey)}${i === 0 ? ' (This Week)' : ''}`;
        if (weekKey === currentWeek) option.selected = true;
        selector.appendChild(option);
    }
    
    selector.addEventListener('change', (e) => {
        currentWeek = e.target.value;
        renderWorkoutView();
    });
}

// Initialize day tabs
function initDayTabs() {
    const tabs = document.querySelectorAll('.day-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = tab.dataset.day;
            renderWorkoutView();
        });
        
        // Set initial active tab
        if (tab.dataset.day === currentDay) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('workoutTrackerV2');
    return saved ? JSON.parse(saved) : {};
}

// Save data to localStorage
function saveData(showToastMsg = true) {
    localStorage.setItem('workoutTrackerV2', JSON.stringify(workoutData));
    if (showToastMsg) showToast('Saved!');
}

// Get exercise data for current week and specific set
function getSetData(exerciseId, setIndex) {
    if (!workoutData[currentWeek]) workoutData[currentWeek] = {};
    if (!workoutData[currentWeek][exerciseId]) {
        workoutData[currentWeek][exerciseId] = { sets: [] };
    }
    if (!workoutData[currentWeek][exerciseId].sets[setIndex]) {
        workoutData[currentWeek][exerciseId].sets[setIndex] = { reps: '', weight: '', completed: false };
    }
    return workoutData[currentWeek][exerciseId].sets[setIndex];
}

// Get previous week's data for an exercise
function getPreviousData(exerciseId) {
    const weeks = Object.keys(workoutData).sort().reverse();
    for (const week of weeks) {
        if (week < currentWeek && workoutData[week][exerciseId]) {
            const sets = workoutData[week][exerciseId].sets || [];
            // Return the last completed set's data
            for (let i = sets.length - 1; i >= 0; i--) {
                if (sets[i] && (sets[i].reps || sets[i].weight)) {
                    return { week, data: sets[i] };
                }
            }
        }
    }
    return null;
}

// Check if workout is finished
function isWorkoutFinished() {
    if (!workoutData[currentWeek]) return false;
    return workoutData[currentWeek][`${currentDay}-finished`] === true;
}

// Calculate day stats
function calculateDayStats(day) {
    let completed = 0;
    let total = 0;
    let volume = 0;
    
    day.blocks.forEach(block => {
        if (block.type === 'warmup') return;
        
        block.exercises.forEach(ex => {
            if (ex.targetReps) {
                for (let s = 0; s < SETS_PER_EXERCISE; s++) {
                    total++;
                    const setData = getSetData(ex.id, s);
                    if (setData.completed) {
                        completed++;
                        const reps = parseInt(setData.reps) || 0;
                        const weight = parseFloat(setData.weight) || 0;
                        volume += reps * weight;
                    }
                }
            }
        });
    });
    
    return { completed, total, volume };
}

// Render the workout view for current day
function renderWorkoutView() {
    const view = document.getElementById('workoutView');
    const day = WORKOUTS[currentDay];
    const stats = calculateDayStats(day);
    const finished = isWorkoutFinished();
    
    view.innerHTML = `
        <div class="day-header-card">
            <div class="day-title">${day.title} — ${day.subtitle}</div>
            <div class="day-subtitle">${day.focus}</div>
            <div class="day-stats">
                <div class="stat-box">
                    <div class="stat-label">Progress</div>
                    <div class="stat-value progress">${stats.completed}/${stats.total}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Volume</div>
                    <div class="stat-value volume">${stats.volume.toLocaleString()}</div>
                </div>
            </div>
        </div>
        
        ${day.blocks.map(block => renderBlock(block)).join('')}
        
        <div class="finish-workout-container">
            <button class="finish-btn ${finished ? 'finished' : ''}" 
                    onclick="toggleFinishWorkout()"
                    ${stats.completed === 0 ? 'disabled' : ''}>
                ${finished ? '✓ Workout Complete!' : 'Finish Workout'}
            </button>
        </div>
    `;
}

// Render a block
function renderBlock(block) {
    const isWarmup = block.type === 'warmup';
    
    return `
        <div class="block" data-type="${isWarmup ? 'warmup' : 'exercise'}">
            <div class="block-header">${block.name}</div>
            <div class="block-content">
                ${block.exercises.map(ex => isWarmup ? renderWarmupExercise(ex) : renderExercise(ex)).join('')}
            </div>
        </div>
    `;
}

// Render warmup exercise (simple display)
function renderWarmupExercise(exercise) {
    return `
        <div class="warmup-exercise">
            <div>
                <div class="warmup-name">${exercise.name}</div>
                ${exercise.note ? `<div class="warmup-note">${exercise.note}</div>` : ''}
            </div>
            <div class="warmup-duration">${exercise.sets}</div>
        </div>
    `;
}

// Render exercise with sets
function renderExercise(exercise) {
    const previous = getPreviousData(exercise.id);
    const allSetsComplete = Array.from({ length: SETS_PER_EXERCISE }, (_, i) => 
        getSetData(exercise.id, i).completed
    ).every(c => c);
    
    // Use previous data as placeholders
    const prevReps = previous?.data?.reps || exercise.targetReps;
    const prevWeight = previous?.data?.weight || '';
    
    return `
        <div class="exercise ${allSetsComplete ? 'completed' : ''}" data-id="${exercise.id}">
            <div class="exercise-header">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-prescription">${exercise.sets} × ${exercise.targetReps}</span>
            </div>
            
            <div class="exercise-info">
                ${exercise.why ? `<div class="exercise-why">${exercise.why}</div>` : ''}
                ${exercise.technique ? `<div class="exercise-technique">${exercise.technique}</div>` : ''}
            </div>
            
            <div class="sets-container">
                ${Array.from({ length: SETS_PER_EXERCISE }, (_, i) => renderSet(exercise.id, i, prevReps, prevWeight)).join('')}
            </div>
            
            ${previous ? `
                <div class="previous-hint">
                    Last workout: <strong>${previous.data.reps || '—'} reps @ ${previous.data.weight || '—'}</strong>
                </div>
            ` : ''}
        </div>
    `;
}

// Render a single set row
function renderSet(exerciseId, setIndex, defaultReps, defaultWeight) {
    const data = getSetData(exerciseId, setIndex);
    
    return `
        <div class="set-row">
            <div class="set-number">${setIndex + 1}</div>
            <div class="set-inputs">
                <div class="input-group">
                    <label>Reps</label>
                    <input type="number" 
                           inputmode="numeric"
                           pattern="[0-9]*"
                           placeholder="${defaultReps}" 
                           value="${data.reps}"
                           data-exercise="${exerciseId}"
                           data-set="${setIndex}"
                           data-field="reps">
                </div>
                <div class="input-group">
                    <label>Weight</label>
                    <input type="number" 
                           inputmode="decimal"
                           step="0.5"
                           placeholder="${defaultWeight || '—'}" 
                           value="${data.weight}"
                           data-exercise="${exerciseId}"
                           data-set="${setIndex}"
                           data-field="weight">
                </div>
            </div>
            <button class="check-btn ${data.completed ? 'checked' : ''}" 
                    data-exercise="${exerciseId}"
                    data-set="${setIndex}">
                <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
        </div>
    `;
}

// Toggle set completion
function toggleSetComplete(exerciseId, setIndex) {
    const data = getSetData(exerciseId, setIndex);
    data.completed = !data.completed;
    
    // Auto-fill reps/weight from placeholder if empty when completing
    if (data.completed) {
        const setRow = document.querySelector(`[data-exercise="${exerciseId}"][data-set="${setIndex}"][data-field="reps"]`);
        if (setRow && !data.reps) {
            data.reps = setRow.placeholder;
        }
        const weightInput = document.querySelector(`[data-exercise="${exerciseId}"][data-set="${setIndex}"][data-field="weight"]`);
        if (weightInput && !data.weight && weightInput.placeholder !== '—') {
            data.weight = weightInput.placeholder;
        }
    }
    
    saveData();
    renderWorkoutView();
}

// Toggle finish workout
function toggleFinishWorkout() {
    if (!workoutData[currentWeek]) workoutData[currentWeek] = {};
    workoutData[currentWeek][`${currentDay}-finished`] = !isWorkoutFinished();
    saveData();
    renderWorkoutView();
}

// Setup event listeners
function setupEventListeners() {
    const view = document.getElementById('workoutView');
    
    // Input changes
    view.addEventListener('input', (e) => {
        if (e.target.matches('input[data-exercise]')) {
            const exerciseId = e.target.dataset.exercise;
            const setIndex = parseInt(e.target.dataset.set);
            const field = e.target.dataset.field;
            const data = getSetData(exerciseId, setIndex);
            data[field] = e.target.value;
            
            // Debounced save
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(() => saveData(false), 500);
        }
    });
    
    // Check button clicks
    view.addEventListener('click', (e) => {
        const checkBtn = e.target.closest('.check-btn');
        if (checkBtn) {
            const exerciseId = checkBtn.dataset.exercise;
            const setIndex = parseInt(checkBtn.dataset.set);
            toggleSetComplete(exerciseId, setIndex);
        }
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}
