
document.getElementById('displayTodos').addEventListener('click', async () => {
  displayTodos();

  // const response = await fetch('/todos'); // fetch is asynchronous operation
  // const todos = await response.json(); // parsing response from serving is also asynchronous 
  // document.getElementById('todoDisplay').textContent = JSON.stringify(todos, null, 2)
});

document.getElementById('submitTodo').addEventListener('click', async () => {
  const name = document.getElementById('todoName').value;
  const priority = document.getElementById('todoPriority').value || 'low';
  const isFunInput = document.getElementById('todoIsFun').value;
  const isFun = isFunInput.toLowerCase() === 'true';

  const todo = { name, priority, isFun };

  try {
    const response = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('todoName').value = '';
      document.getElementById('todoPriority').value = '';
      document.getElementById('todoIsFun').value = '';
      displayTodos();
      alert(`Todo added successfully!`);
    } else {
      alert(`Failed to add todo: ${result.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('deleteTodo').addEventListener('click', async () => {
  const id = document.getElementById('todoIdToDelete').value;
  if (!id.trim()) {
    alert('Please enter an ID to delete');
    return;
  }
  
  try {
    const response = await fetch(`/todos/${id}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
    document.getElementById('todoIdToDelete').value = '';
    displayTodos();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

async function displayTodos() {
  try {
    const response = await fetch('/todos');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const todos = await response.json();
    const todoDisplay = document.getElementById('todoDisplay');
    
    if (todos.length > 0) {
      todoDisplay.textContent = JSON.stringify(todos, null, 2);
    } else {
      todoDisplay.textContent = "No todos available.";
    }
  } catch (error) {
    document.getElementById('todoDisplay').textContent = `Error loading todos: ${error.message}`;
  }
}