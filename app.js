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

let tasks = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(function (task) {
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
}
addTaskButton.addEventListener('click', function () {
  const text = taskInput.value.trim();
  if (text === '') return;
  const task = {
    text: text,
    priority: prioritySelect.value,
    id: Date.now(),
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
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
  }
});
renderTasks();
let timer = null;
let isRunning = false;
let timeLeft = 1500;
let isWorkMode = true;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent =
    minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(function () {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;
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
resetDayButton.addEventListener('click', function() {
  log = []
  saveLog()
  renderLog()
  updateStats()
})
