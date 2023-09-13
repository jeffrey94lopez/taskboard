let draggedTask = null;

function drag(event) {
    draggedTask = event.target.closest('.kanban-task');
    event.dataTransfer.setData('text/plain', '');
}

function drop(event) {
    event.preventDefault();
    if (event.target.classList.contains('kanban-column')) {
        event.target.appendChild(draggedTask);
    } else if (event.target.closest('.kanban-column')) {
        event.target.closest('.kanban-column').appendChild(draggedTask);
    }
    updateTaskCount();
}

function allowDrop(event) {
    event.preventDefault();
}

function editTaskTitle(taskElement) {
    const titleElement = taskElement.querySelector('.task-title');
    const originalText = titleElement.textContent;
    editElementText(titleElement, originalText);
}

function editTaskDescription(descElement) {
    const originalText = descElement.textContent;
    editElementText(descElement, originalText);
}

function editElementText(element) {
    const originalText = element.textContent;
    element.textContent = ''; 
    const inputElement = document.createElement('textarea');
    inputElement.value = originalText;
    inputElement.addEventListener('blur', function() {
        element.textContent = inputElement.value || originalText;
        element.ondblclick = function() { editElementText(element); };
    });
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            element.textContent = inputElement.value || originalText;
            element.ondblclick = function() { editElementText(element); };
        }
    });
    element.appendChild(inputElement);
    inputElement.focus();
    // Detener propagación para evitar conflictos con otros eventos de doble clic.
    element.addEventListener('dblclick', function(e) {
        e.stopPropagation();
    });
}

function addTask(columnElement) {
    const newTask = document.createElement('div');
    newTask.className = 'kanban-task card p-2 mb-2';
    newTask.draggable = true;
    newTask.ondragstart = drag;

    const titleElement = document.createElement('div');
    titleElement.className = 'task-title';
    titleElement.textContent = 'Nueva tarea';
    titleElement.ondblclick = function() { editElementText(titleElement); };
    newTask.appendChild(titleElement);

    const descElement = document.createElement('div');
    descElement.className = 'task-description';
    descElement.textContent = 'Descripción aquí...';
    descElement.ondblclick = function() { editElementText(descElement); };
    newTask.appendChild(descElement);

    columnElement.appendChild(newTask);
    updateTaskCount();
}

function updateTaskCount() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        const count = column.querySelectorAll('.kanban-task').length;
        const span = column.querySelector('.task-count');
        span.textContent = `(${count})`;
    });
}