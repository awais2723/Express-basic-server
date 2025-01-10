const express = require('express');
const app = express();
const tasks = []; // Global array for task storage

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Rendering Routes
app.get('/', (req, res) => {
    res.render('index'); // Render the main page
});

app.get('/addTask', (req, res) => {
    res.render('addTask'); // Render the "Add Task" page
});

app.get('/editTask/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (task) {
        res.render('editTask', { task }); // Render the "Edit Task" page with task data
    } else {
        res.status(404).send('Task not found'); // Handle case when task ID is invalid
    }
});

// API Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks); // Return all tasks as JSON
});

app.post('/api/tasks', (req, res) => {
    const { name, description } = req.body;
    const newTask = { id: Date.now(), name, description, status: 'To Do' };
    tasks.push(newTask);
    res.json(newTask); // Return the newly added task as JSON
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const task = tasks.find(task => task.id === parseInt(id));
    if (task) {
        task.name = name;
        task.description = description;
        res.json(task); // Return the updated task as JSON
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === parseInt(id));
    if (task) {
        task.status = 'Done';
        res.json(task); // Return the updated task as JSON
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(task => task.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1);
        res.json(deletedTask); // Return the deleted task as JSON
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});




// API Documentation Route
app.get('/api/docs', (req, res) => {
    const routes = [
        {
            method: 'GET',
            path: '/',
            description: 'Render the main page of the app.',
        },
        {
            method: 'GET',
            path: '/addTask',
            description: 'Render the page to add a new task.',
        },
        {
            method: 'GET',
            path: '/editTask/:id',
            description: 'Render the page to edit a task by ID.',
        },
        {
            method: 'GET',
            path: '/api/tasks',
            description: 'Retrieve all tasks as a JSON array.',
        },
        {
            method: 'POST',
            path: '/api/tasks',
            description: 'Create a new task. Requires `name` and `description` in the request body.',
        },
        {
            method: 'PUT',
            path: '/api/tasks/:id',
            description: 'Update a task by ID. Requires `name` and `description` in the request body.',
        },
        {
            method: 'PATCH',
            path: '/api/tasks/:id',
            description: 'Mark a task as "Done" by updating its status.',
        },
        {
            method: 'DELETE',
            path: '/api/tasks/:id',
            description: 'Delete a task by ID.',
        },
    ];

    res.json({
        message: 'API Endpoints Documentation',
        routes,
    });
});


// Start the server

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
