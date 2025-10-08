let draggedCard = null;
let clickedCard = null;

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage)
function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  const taskText = input.value.trim();

  if (taskText === "") {
    return;
  }
  const taskDate = new Date().toLocaleString("en-GB");
  const taskElement = createTaskElement(taskText, taskDate);

  document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
  updateTasksCount(columnId);
  saveTasksToLocalStorage(columnId, taskText, taskDate);
  input.value = "";
}

function createTaskElement(taskText, taskDate) {
  const element = document.createElement("div");
  element.innerHTML = `<span>${taskText}</span><br><small class ="time">${taskDate}</small>`;
  element.classList.add("card");
  element.setAttribute("draggable", true);
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);
  element.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    clickedCard = this;
    showContextMenu(e.pageX, e.pageY);
  });
  return element;
}

function dragStart() {
  this.classList.add("dragging");
  draggedCard = this;
}

function dragEnd() {
  this.classList.remove("dragging");
  draggedCard = null;
  ["todo", "doing", "done"].forEach((columnId) => {
    updateTasksCount(columnId);
  });
  updateTasksToLocalStorage();
}

const columns = document.querySelectorAll(".tasks");
columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
});

function dragOver(e) {
  e.preventDefault();
  this.appendChild(draggedCard);
}

const contextmenu = document.querySelector(".context-menu");
function showContextMenu(x, y) {
  contextmenu.style.left = `${x}px`;
  contextmenu.style.top = `${y}px`;
  contextmenu.style.display = "block";
}

document.addEventListener("click", () => {
  contextmenu.style.display = "none";
});

function editTask() {
  if (clickedCard !== null) {
    const editTaskDate = new Date().toLocaleString("en-GB");
    const oldTaskText = clickedCard.querySelector("span").textContent;
    const newTaskText = prompt("Edit Task", oldTaskText);
    if (newTaskText !== "") {
      clickedCard.innerHTML = `<span>${newTaskText}</span><br><small class ="time">${editTaskDate}</small>`;
    }
    updateTasksToLocalStorage();
  }
}

function deleteTask() {
  if (clickedCard !== null) {
    const columnId = clickedCard.parentElement.id.replace("-tasks", "");
    console.log(columnId);
    clickedCard.remove();

    updateTasksCount(columnId);
    updateTasksToLocalStorage()
  }
}

function updateTasksCount(columnId) {
  const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
  document.getElementById(`${columnId}-count`).textContent = count;
}

function saveTasksToLocalStorage(columnId, taskText, taskDate) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.push({ text: taskText, date: taskDate });
    localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.forEach(({ text, date }) => {
        const taskElement = createTaskElement(text, date);
        document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    });
    updateTasksCount(columnId);
  });
}

function updateTasksToLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = [];
    document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
      const taskText = card.querySelector("span").textContent;
      const taskDate = card.querySelector("small").textContent;
      tasks.push({ text: taskText, date: taskDate });
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
  });
}
