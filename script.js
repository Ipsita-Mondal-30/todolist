
let timerInterval;
let totalSeconds = 0;

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      totalSeconds++;
      displayTimer();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  totalSeconds = 0;
  displayTimer();
}

function displayTimer() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("timerDisplay").textContent =
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateCalendar() {
  const calendarDiv = document.getElementById("calendar");
  const monthYearSpan = document.getElementById("calendarMonthYear");
  const date = new Date(currentYear, currentMonth, 1);

  const month = date.toLocaleString("default", { month: "long" });
  monthYearSpan.textContent = `${month} ${currentYear}`;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  calendarDiv.innerHTML = "<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></table>";
  const table = calendarDiv.querySelector("table");
  let row = document.createElement("tr");

  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if ((row.children.length + 1) % 7 === 1 && row.children.length > 0) {
      table.appendChild(row);
      row = document.createElement("tr");
    }

    const cell = document.createElement("td");
    cell.textContent = day;
    row.appendChild(cell);
  }

  if (row.children.length > 0) {
    table.appendChild(row);
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
}

// Task Manager functionality
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const listItem = document.createElement("li");
  listItem.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => taskList.removeChild(listItem);

  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);

  taskInput.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCalendar();
  displayTimer();
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskText = taskInput.value.trim();
  
    if (taskText === "") return;
  
    const listItem = document.createElement("li");
  
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      listItem.classList.toggle("completed");
    });
  
    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
  
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#x1F5D1;"; // Trash can icon
    deleteButton.onclick = () => taskList.removeChild(listItem);
  
    listItem.appendChild(checkbox);
    listItem.appendChild(textSpan);
    listItem.appendChild(deleteButton);
  
    taskList.appendChild(listItem);
    taskInput.value = "";
  }
  

  function clearAllTasks() {
    document.getElementById("taskList").innerHTML = "";
  }

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const prioritySelect = document.getElementById("prioritySelect");
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
  
    if (taskText === "") return;
  
    const listItem = document.createElement("li");
    listItem.className = `task-${priority}`;
  
    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
  
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#x1F5D1;";
    deleteButton.onclick = () => {
      taskList.removeChild(listItem);
      updateProgressBar();
    };
  
    listItem.draggable = true;
    listItem.ondragstart = (e) => dragStart(e);
    listItem.ondragover = (e) => e.preventDefault();
    listItem.ondrop = (e) => dropTask(e, listItem);
  
    listItem.appendChild(textSpan);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  
    taskInput.value = "";
    updateProgressBar();
  }
  
  function filterTasks() {
    const searchValue = document.getElementById("searchTask").value.toLowerCase();
    const tasks = document.querySelectorAll("#taskList li");
  
    tasks.forEach((task) => {
      const text = task.querySelector("span").textContent.toLowerCase();
      task.style.display = text.includes(searchValue) ? "flex" : "none";
    });
  }
  
  
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.outerHTML);
    e.target.classList.add("dragged");
  }
  
  function dropTask(e, target) {
    const draggedHTML = e.dataTransfer.getData("text/plain");
    const draggedElement = document.createElement("div");
    draggedElement.innerHTML = draggedHTML;
    target.insertAdjacentElement("beforebegin", draggedElement.firstChild);
    document.querySelector(".dragged").remove();
    updateProgressBar();
  }
  
  function updateProgressBar() {
    const tasks = document.querySelectorAll("#taskList li").length;
    const completed = document.querySelectorAll("#taskList li.completed").length;
    const progress = tasks ? (completed / tasks) * 100 : 0;
  
    document.getElementById("progressBar").style.width = `${progress}%`;
  }
  
  function toggleTheme() {
    const isDarkMode = document.getElementById("themeSwitch").checked;
    document.body.style.background = isDarkMode
      ? "linear-gradient(45deg, #ffffff, #f0f0f0)"
      : "linear-gradient(45deg, #141e30, #243b55)";
    document.body.style.color = isDarkMode ? "#000" : "#fff";
  }
  let selectedDate = null;

  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (!taskText) return;
  
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    li.textContent = taskText;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&#x1F5D1;";
    deleteBtn.onclick = () => taskList.removeChild(li);
  
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  
    taskInput.value = "";
  }
  
  function loadCalendar() {
    const today = new Date();
    selectedDate = today;
    displayMonth(today);
  }
  
  function displayMonth(date) {
    const calendarBody = document.getElementById("calendarBody");
    const currentMonth = document.getElementById("currentMonth");
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
    calendarBody.innerHTML = "";
    currentMonth.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
  
    let row = document.createElement("tr");
    for (let i = 0; i < firstDay; i++) row.appendChild(document.createElement("td"));
  
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("td");
      cell.textContent = day;
      cell.onclick = () => onDateClick(new Date(date.getFullYear(), date.getMonth(), day));
      row.appendChild(cell);
      if ((day + firstDay) % 7 === 0 || day === daysInMonth) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }
  }
  
  function onDateClick(date) {
    selectedDate = date;
    alert(`Selected date: ${date.toDateString()}`);
  }
  
  document.getElementById("prevMonth").onclick = () => changeMonth(-1);
  document.getElementById("nextMonth").onclick = () => changeMonth(1);
  
  function changeMonth(offset) {
    selectedDate.setMonth(selectedDate.getMonth() + offset);
    displayMonth(selectedDate);
  }
  
  loadCalendar();
      