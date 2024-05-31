document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const priorityInput = document.getElementById("priority-input");
  const taskList = document.getElementById("task-list");
  const filterOptions = document.getElementById("filter-options");
  let isEditing = false;
  let editingTaskId = null;

  // Load tasks from local storage
  loadTasks();

  // Add or edit a task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isEditing) {
      updateTask(editingTaskId, taskInput.value, priorityInput.value);
      isEditing = false;
      editingTaskId = null;
      taskForm.querySelector("button").textContent = "Add Task";
    } else {
      addTask(taskInput.value, priorityInput.value);
    }
    taskInput.value = "";
  });

  // Handle task actions (edit, delete, toggle completed)
  taskList.addEventListener("click", handleTaskAction);

  // Filter tasks
  filterOptions.addEventListener("click", filterTasks);

  function addTask(task, priority) {
    const tasks = getTasksFromStorage();
    const taskObject = { id: Date.now(), task, priority, completed: false };
    tasks.push(taskObject);
    saveTasksToStorage(tasks);
    renderTasks(tasks);
  }

  function updateTask(id, updatedTask, updatedPriority) {
    const tasks = getTasksFromStorage();
    tasks.forEach((task) => {
      if (task.id == id) {
        task.task = updatedTask;
        task.priority = updatedPriority;
      }
    });
    saveTasksToStorage(tasks);
    renderTasks(tasks);
  }

  function handleTaskAction(e) {
    const tasks = getTasksFromStorage();
    const id = e.target.parentElement.dataset.id;

    if (e.target.classList.contains("edit")) {
      editTask(id);
    } else if (e.target.classList.contains("delete")) {
      deleteTask(id);
    } else if (e.target.classList.contains("toggle-completed")) {
      toggleTaskCompletion(id);
    }
  }

  function filterTasks(e) {
    const filter = e.target.id;
    const tasks = getTasksFromStorage();

    if (filter === "filter-all") {
      renderTasks(tasks);
    } else if (filter === "filter-pending") {
      const filteredTasks = tasks.filter((task) => !task.completed);
      renderTasks(filteredTasks);
    } else if (filter === "filter-completed") {
      const filteredTasks = tasks.filter((task) => task.completed);
      renderTasks(filteredTasks);
    }
  }

  function editTask(id) {
    const tasks = getTasksFromStorage();
    const taskToEdit = tasks.find((task) => task.id == id);
    taskInput.value = taskToEdit.task;
    priorityInput.value = taskToEdit.priority;
    isEditing = true;
    editingTaskId = id;
    taskForm.querySelector("button").textContent = "Update Task";
  }

  function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToStorage(tasks);
    renderTasks(tasks);
  }

  function toggleTaskCompletion(id) {
    const tasks = getTasksFromStorage();
    tasks.forEach((task) => {
      if (task.id == id) task.completed = !task.completed;
    });
    saveTasksToStorage(tasks);
    renderTasks(tasks);
  }

  function getTasksFromStorage() {
    return localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
  }

  function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = getTasksFromStorage();
    renderTasks(tasks);
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
                ${task.task} - ${task.priority}
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="toggle-completed">${
                  task.completed ? "Undo" : "Complete"
                }</button>
            `;
      taskList.appendChild(li);
    });
  }
});
