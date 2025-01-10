// Load tasks and display them in the table on the index page
function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tableBody = $('#taskTableBody');
            tableBody.empty();
            tasks.forEach(task => {
                const statusBadge = task.status === 'Done'
                    ? '<span class="badge badge-success">Done</span>'
                    : '<span class="badge badge-warning">To Do</span>';
                const row = `
                    <tr data-id="${task.id}">
                        <td>${task.name}</td>
                        <td>${task.description}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-success btn-sm mark-done">Mark Done</button>
                            <a href="/editTask/${task.id}" class="btn btn-warning btn-sm">Edit</a>
                            <button class="btn btn-danger btn-sm delete-task">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        });
}

// Handle "Mark Done" button click
$(document).on('click', '.mark-done', function () {
    const taskId = $(this).closest('tr').data('id');
    fetch(`/api/tasks/${taskId}`, { method: 'PATCH' })
        .then(response => {
            if (response.ok) {
                loadTasks();
            } else {
                alert('Failed to mark task as done.');
            }
        });
});

// Handle "Delete" button click
$(document).on('click', '.delete-task', function () {
    const taskId = $(this).closest('tr').data('id');
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    loadTasks();
                } else {
                    alert('Failed to delete task.');
                }
            });
    }
});

// Handle form submission for adding a new task
function bindAddTaskFormSubmit() {
    $('#addTaskForm').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const taskData = {
            name: $('#name').val(),
            description: $('#description').val(),
        };

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'; // Redirect to the home page
            } else {
                alert('Failed to add task. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
}

// Handle form submission for editing a task
function bindEditTaskFormSubmit(taskId) {
    $('#editTaskForm').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const updatedTaskData = {
            name: $('#name').val(),
            description: $('#description').val(),
        };

        fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTaskData),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'; // Redirect to the home page
            } else {
                alert('Failed to update task. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
}
