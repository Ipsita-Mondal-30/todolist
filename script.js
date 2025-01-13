let tasks = [];
let history = [];
let editingTaskId = null;

function addTask() {
    const name = document.getElementById('taskName').value;
    const date = document.getElementById('taskDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!name || !date) return;

    const task = {
        id: Date.now(),
        name,
        date,
        priority,
        status: 'ongoing',
    };

    tasks.push(task);
    updateTasks();
    updateCalendar();

    document.getElementById('taskName').value = '';
    document.getElementById('taskDate').value = '';
}

function toggleTaskStatus(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.status === 'ongoing') {
        task.status = 'completed';
        history.push({...task}); 
        tasks = tasks.filter((t) => t.id !== id);
    } else {
        task.status = 'ongoing';
        tasks.push({...task});
        history = history.filter((t) => t.id !== id);
    }

    updateTasks();
    updateHistory();
    updateCalendar();
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    updateTasks();
    updateCalendar();
}

function deleteHistoryTask(id) {
    history = history.filter((t) => t.id !== id);
    updateHistory();
    updateCalendar();
}

function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    editingTaskId = id;
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskDate').value = task.date;
    document.getElementById('editTaskPriority').value = task.priority;

    document.getElementById('editModal').style.display = 'flex';
}

function saveTaskEdits() {
    const name = document.getElementById('editTaskName').value;
    const date = document.getElementById('editTaskDate').value;
    const priority = document.getElementById('editTaskPriority').value;

    const task = tasks.find((t) => t.id === editingTaskId);
    if (!task) return;

    task.name = name;
    task.date = date;
    task.priority = priority;

    closeEditModal();
    updateTasks();
    updateCalendar();
}

function closeEditModal() {
    editingTaskId = null;
    document.getElementById('editModal').style.display = 'none';
}

function updateTasks() {
    const highPriorityContainer = document.getElementById('highPriorityTasks');
    const lowPriorityContainer = document.getElementById('lowPriorityTasks');

    highPriorityContainer.innerHTML = '';
    lowPriorityContainer.innerHTML = '';

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.priority}-priority`;
        taskElement.innerHTML = `
            <span>${task.name} - ${new Date(task.date).toLocaleString()}</span>
            <button class="magical-button" onclick="toggleTaskStatus(${task.id})">
                ${task.status === 'ongoing' ? '🔮 Completed' : '✨ Completed'}
            </button>
            <button class="magical-button" onclick="editTask(${task.id})">✏️ Edit</button>
            <button class="magical-button cancel" onclick="deleteTask(${task.id})">🗑 Delete</button>
        `;

        if (task.priority === 'high') {
            highPriorityContainer.appendChild(taskElement);
        } else {
            lowPriorityContainer.appendChild(taskElement);
        }
    });
}

function updateHistory() {
    const historyContainer = document.getElementById('taskHistory');
    historyContainer.innerHTML = '';

    history.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-history-item';
        taskElement.innerHTML = `
            <span>${task.name} - ${new Date(task.date).toLocaleString()}</span>
            <button class="magical-button cancel" onclick="deleteHistoryTask(${task.id})">🗑 Delete</button>
        `;
        historyContainer.appendChild(taskElement);
    });
}

function updateCalendar() {
    const calendar = document.getElementById('calendarGrid');
    calendar.innerHTML = '';

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    
    for (let i = 0; i < firstDayIndex; i++) {
        calendar.appendChild(createCalendarDay(''));
    }

    
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const currentDate = new Date(today.getFullYear(), today.getMonth(), date);
        
       
        const dayTasks = tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return taskDate.toDateString() === currentDate.toDateString();
        });

       
        const completedTasks = history.filter((task) => {
            const taskDate = new Date(task.date);
            return taskDate.toDateString() === currentDate.toDateString();
        });

        const dayElement = createCalendarDay(date, dayTasks, completedTasks);
        dayElement.onclick = () => showDayTasks(date, dayTasks, completedTasks);
        calendar.appendChild(dayElement);
    }
}

function createCalendarDay(date, dayTasks = [], completedTasks = []) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    
 
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'calendar-date';
    dateDisplay.textContent = date;
    day.appendChild(dateDisplay);

    if (date !== '') { 
        const totalTasks = dayTasks.length + completedTasks.length;
        
        if (totalTasks > 0) {
          
            const progressContainer = document.createElement('div');
            progressContainer.className = 'day-progress';

         
            const taskCount = document.createElement('div');
            taskCount.className = 'task-count';
            taskCount.textContent = `${completedTasks.length}/${totalTasks}`;
            progressContainer.appendChild(taskCount);

            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progressPercentage = (completedTasks.length / totalTasks) * 100;
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = `${progressPercentage}%`;
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);

            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'task-indicators';

            dayTasks.forEach(task => {
                const dot = document.createElement('span');
                dot.className = `task-dot ongoing ${task.priority}-priority`;
                dot.title = `${task.name} (in progress)`;
                tasksContainer.appendChild(dot);
            });

            completedTasks.forEach(task => {
                const dot = document.createElement('span');
                dot.className = `task-dot completed ${task.priority}-priority`;
                dot.title = `${task.name} (completed)`;
                tasksContainer.appendChild(dot);
            });

            progressContainer.appendChild(tasksContainer);
            day.appendChild(progressContainer);
        }
    }

    return day;
}

function showDayTasks(date, dayTasks, completedTasks) {
    const modal = document.getElementById('dayTasksModal');
    const modalContent = document.getElementById('modalContent');
    modal.style.display = 'block';

    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), date);
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    modalContent.innerHTML = `<h3>Tasks for ${formattedDate}</h3>`;

    const ongoingCount = dayTasks.length;
    const completedCount = completedTasks.length;
    const totalTasks = ongoingCount + completedCount;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

   
    modalContent.innerHTML += `
        <div class="task-statistics">
            <div class="stat-item">
                <strong>Total Tasks:</strong> ${totalTasks}
            </div>
            <div class="stat-item">
                <strong>Tasks Left:</strong> ${ongoingCount}
            </div>
            <div class="stat-item">
                <strong>Completed:</strong> ${completedCount}
            </div>
            <div class="stat-item">
                <strong>Completion Rate:</strong> ${completionRate}%
            </div>
        </div>
    `;

   
    if (dayTasks.length > 0) {
        modalContent.innerHTML += '<h4>Tasks In Progress:</h4>';
        const ongoingTasksList = document.createElement('div');
        ongoingTasksList.className = 'tasks-list';
        
        dayTasks.forEach(task => {
            ongoingTasksList.innerHTML += `
                <div class="task-item ${task.priority}-priority">
                    <span class="task-name">${task.name}</span>
                    <span class="task-priority">${task.priority} priority</span>
                </div>
            `;
        });
        modalContent.appendChild(ongoingTasksList);
    }


    if (completedTasks.length > 0) {
        modalContent.innerHTML += '<h4>Completed Tasks:</h4>';
        const completedTasksList = document.createElement('div');
        completedTasksList.className = 'tasks-list';
        
        completedTasks.forEach(task => {
            completedTasksList.innerHTML += `
                <div class="task-item completed ${task.priority}-priority">
                    <span class="task-name">${task.name}</span>
                    <span class="task-priority">${task.priority} priority</span>
                </div>
            `;
        });
        modalContent.appendChild(completedTasksList);
    }

    
    if (totalTasks === 0) {
        modalContent.innerHTML += '<p class="no-tasks">No tasks scheduled for this day</p>';
    }
}

function closeModal() {
    document.getElementById('dayTasksModal').style.display = 'none';
}