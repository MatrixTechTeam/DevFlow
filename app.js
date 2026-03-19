const themeToggle = document.getElementById('theme-toggle');
const timerMode = document.getElementById('timer-mode');
const timerDisplay = document.getElementById('timer-display');
const currentTask = document.getElementById('current-task');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskButton = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const tasksCompleted = document.getElementById('tasks-completed');
const focusTime = document.getElementById('focus-time');
const logList = document.getElementById('log-list');
const resetDayButton = document.getElementById('reset-day-btn');
const taskCount = document.querySelector('#tasks-section h2')
const sessionStreakElement = document.getElementById('session-streak')
const filterAll = document.getElementById('filter-all')
const filterLow = document.getElementById('filter-low')
const filterMedium = document.getElementById('filter-medium')
const filterHigh = document.getElementById('filter-high')

let currentFilter = 'all'
let tasks = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = currentFilter === 'all' ? tasks : tasks.filter(function(task) {
    return task.priority === currentFilter
  })
  filteredTasks.forEach(function (task) {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('done');
    }
    li.innerHTML = `<span>${task.text}</span>
<span>${task.priority}</span>
<button class="complete-btn" data-id="${task.id}">Complete</button>
<button class="delete-btn" data-id="${task.id}">Delete</button>`;

    taskList.appendChild(li);
  });
  if (tasks.length > 0) {
  taskCount.textContent = 'Task Board (' + tasks.length + ')'
  } else {
    taskCount.textContent = 'Task Board'
  }

}
addTaskButton.addEventListener('click', function () {
  const text = taskInput.value.trim();
  const capitalisedText = text.charAt(0).toUpperCase() + text.slice(1);
  if (text === '') return;
  if (!/^[a-zA-Z0-9 ]+$/.test(text)) {
    currentTask.textContent = 'Only letters and numbers allowed!'
    return
  }
  const task = {
    text: capitalisedText,
    priority: prioritySelect.value,
    id: Date.now(),
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  currentTask.textContent = 'Focusing on: ' + capitalisedText,

  taskInput.value = '';
});
taskList.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
    resetTimer();
    currentTask.textContent = tasks.length > 0 ? 'Focusing on: ' + tasks[0].text : 'No task selected'
  }
  if (e.target.classList.contains('complete-btn')) {
      const completedTask = tasks.find(function (task) {
      return task.id === id;
    });
      tasks = tasks.filter(function(task) {
        return task.id !== id
      })
        if (completedTask) {
      const time = new Date().toLocaleTimeString();
      log.push({ text: completedTask.text, time: time });
      saveLog();
      renderLog();
    }
    saveTasks();
    renderTasks();
    resetTimer();
    currentTask.textContent = tasks.length > 0 ? 'Focusing on: ' + tasks[0].text : 'No task selected'
  }
});
renderTasks();
let timer = null;
let isRunning = false;
let timeLeft = 1500;
let isWorkMode = true;
let focusMinutes = localStorage.getItem('focusMinutes') ? Number(localStorage.getItem('focusMinutes')) : 0
let sessionStreak = localStorage.getItem('sessionStreak') ? Number(localStorage.getItem('sessionStreak')) : 0


function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent =
    minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}
function startTimer() {
  if (tasks.length === 0) {
    currentTask.textContent = 'Add a task first!'
    return
  }
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(function () {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;
      const audioCtx = new AudioContext()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      oscillator.frequency.value = 600
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)
      oscillator.start(audioCtx.currentTime)
      oscillator.stop(audioCtx.currentTime + 0.5)
      if (isWorkMode) {
        focusMinutes += 25
        localStorage.setItem('focusMinutes', focusMinutes)
        focusTime.textContent = 'Focus time: ' + focusMinutes + ' mins'
        sessionStreak++
        localStorage.setItem('sessionStreak', sessionStreak)
        sessionStreakElement.textContent = 'Sessions: ' + sessionStreak
      }
      isWorkMode = !isWorkMode;
      timeLeft = isWorkMode ? 1500 : 300;
      timerMode.textContent = isWorkMode ? 'Work' : 'Break';
      updateDisplay();
    }
    updateDisplay();
  }, 1000);
}
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 1500;
  updateDisplay();
}
startButton.addEventListener('click', function () {
  startTimer();
});
pauseButton.addEventListener('click', function () {
  pauseTimer();
});
resetButton.addEventListener('click', function () {
  resetTimer();
});
let log = localStorage.getItem('log')
  ? JSON.parse(localStorage.getItem('log'))
  : [];
function saveLog() {
  localStorage.setItem('log', JSON.stringify(log));
}
function renderLog() {
  logList.innerHTML = '';
  log.forEach(function (entry) {
    const li = document.createElement('li');
    li.textContent = entry.text + ' - ' + entry.time;
    logList.appendChild(li);
  });
  updateStats()
}
function updateStats() {
  tasksCompleted.textContent = 'Tasks completed: ' + log.length
}
renderTasks()
renderLog()
updateStats()
focusTime.textContent = 'Focus time: ' + focusMinutes + ' mins'
sessionStreakElement.textContent = 'Sessions: ' + sessionStreak
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode')
  themeToggle.textContent = 'Dark Mode'
}


resetDayButton.addEventListener('click', function() {
  log = []
  saveLog()
  renderLog()
  updateStats()
  sessionStreak = 0
  localStorage.setItem('sessionStreak', 0)
  sessionStreakElement.textContent = 'Sessions: 0'
  focusMinutes = 0
  localStorage.setItem('focusMinutes', 0)
  focusTime.textContent = 'Focus time: 0 mins'
})
themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('light-mode')
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light')
    themeToggle.textContent = 'Dark Mode'
  } else {
    localStorage.setItem('theme', 'dark')
    themeToggle.textContent = 'Light Mode'
  }
})
filterAll.addEventListener('click', function() {
  currentFilter = 'all'
  renderTasks()
    document.querySelectorAll('#filter-buttons button').forEach(function(btn) {
        btn.classList.remove('active')
    })
    filterAll.classList.add('active')
})
filterLow.addEventListener('click', function() {
  currentFilter = 'low'
  renderTasks()
    document.querySelectorAll('#filter-buttons button').forEach(function(btn) {
        btn.classList.remove('active')
    })
    filterLow.classList.add('active')
})
filterMedium.addEventListener('click', function() {
  currentFilter = 'medium'
  renderTasks()
    document.querySelectorAll('#filter-buttons button').forEach(function(btn) {
        btn.classList.remove('active')
    })
    filterMedium.classList.add('active')
})
filterHigh.addEventListener('click', function() {
  currentFilter = 'high'
  renderTasks()
    document.querySelectorAll('#filter-buttons button').forEach(function(btn) {
        btn.classList.remove('active')
    })
    filterHigh.classList.add('active')
})
