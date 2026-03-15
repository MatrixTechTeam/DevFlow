const themeToggle = document.getElementById('theme-toggle')
const timerMode = document.getElementById('timer-mode')
const timerDisplay = document.getElementById('timer-display')
const currentTask = document.getElementById('current-task')
const startButton = document.getElementById('start-btn')
const pauseButton = document.getElementById('pause-btn')
const resetButton = document.getElementById('reset-btn')
const taskInput = document.getElementById('task-input')
const prioritySelect = document.getElementById('priority-select')
const addTaskButton = document.getElementById('add-task-btn')
const taskList = document.getElementById('task-list')
const tasksCompleted = document.getElementById('tasks-completed')
const focusTime = document.getElementById('focus-time')
const logList = document.getElementById('log-list')
const resetDayButton = document.getElementById('reset-day-btn')

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
function renderTasks () {
  taskList.innerHTML = ''
  tasks.forEach(function(task) {
  const li = document.createElement('li')
  if (task.completed) {
    li.classlist.add('done')
  }
  li.innerHTML = `<span>${task.text}</span>
<span>${task.priority}</span>
<button class="complete-btn" data-id=${task.id}">Complete</button>
<button class="delete-btn" data-id="${task.id}">Delete</button>`

  taskList.appendChild(li)
}
)
}
addTaskButton.addEventListener('click', function() {
const text = taskInput.value.trim()
if (text === '') return
const task = {
  text:text,
  priority: prioritySelect.value,
  id: Date.now()
}
tasks.push(task)
saveTasks()
renderTasks()
taskInput.value = ''
})
taskList.addEventListener('click', function(e) {
  const id = Number(e.target.dataset.id)
  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(function(task) {
      return task.id !== id
    })
    saveTasks()
    renderTasks()
  }
  if (e.target.classList.contains('complete-btn')) {
    tasks = tasks.map(function(task) {
      if (task.id === id) {
        task.completed = !task.completed
      }
      return task
    })
    saveTasks()
    renderTasks()
  }
})
renderTasks()
