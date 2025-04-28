// server.js
// A simple Express.js backend for a Todo list API

const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

console.log('Loading database module...');
const db  = require(path.join(__dirname, 'database.js'));
console.log('Database module import completed');

// Middleware to parse JSON requests
app.use(express.json());

// TODO ➡️  Middleware to inlcude static content from 'public' folder
//app.use(express.static('public')); 
app.use(express.static(path.join(__dirname, 'public'))); // requires importing path 

// TODO ➡️ serve index.html from 'public' at the '/' path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// TODO ➡️ GET all todo items at the '/todos' path
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      console.error('Error fetching todos: ', err.message);
      res.status(500).json({ message: 'Failed to fetch todos' });
    }

    res.json(rows);
  });
});



// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching todo:', err.message);
      return res.status(500).json({ message: 'Failed to fetch todo' });
    }
    
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  });
});

// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority, isFun } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const priorityValue = priority || 'low';
  const isFunValue = isFun === true || isFun === 'true' ? 1 : 0;

  db.run(
    'INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, 0, ?)',
    [name, priorityValue, isFunValue],
    function(err) {
      if (err) {
        console.error('Error inserting todo:', err.message);
        return res.status(500).json({ message: 'Failed to add todo' });
      }

      const newTodo = {
        id: this.lastID,
        name,
        priority: priorityValue,
        isComplete: false,
        isFun: isFunValue === 1
      };
      
      res.status(201).json(newTodo);
    }
  );
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Deleting todo with id: ', id);

  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting todo:', err.message);
      return res.status(500).json({ message: 'Failed to delete todo' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    
    res.json({ message: `Todo with id ${id} deleted successfully` });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log("server is running on port 3000 :)");
});