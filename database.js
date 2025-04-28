const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Database module loaded, attempting connection...');
// Create or connect to the database
const db = new sqlite3.Database(path.join(__dirname, 'todos.db'), (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create the todos table if it doesn't exist
db.serialize(() => {
  console.log('Setting up todos table...');
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'low',
      isComplete BOOLEAN NOT NULL DEFAULT 0,
      isFun BOOLEAN NOT NULL DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table: ', err.message);
    } else {
      console.log('Todos table ready.');
    }
  });
});

db.get('SELECT sqlite_version()', (err, row) => {
  if (err) {
    console.error('Error executing test query: ', err.message);
  } else {
    console.log('SQLite version: ', row['sqlite_version()']);
    console.log('Database is fully operational');
  }
});

module.exports = db;