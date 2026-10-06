const STORAGE_KEY = 'focus-board-tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const totalCount = document.getElementById('total-count');
const remainingCount = document.getElementById('remaining-count');
const doneCount = document.getElementById('done-count');
const clearDoneButton = document.getElementById('clear-done');

const loadTasks = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
};

let tasks = loadTasks();

if (tasks.length === 0) {
  tasks = [
    { id: crypto.randomUUID(), text: 'Review project plan', done: false },
    { id: crypto.randomUUID(), text: 'Write the next task', done: true },
    { id: crypto.randomUUID(), text: 'Take a 10-minute break', done: false },
  ];
}

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateSummary = () => {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const remaining = total - done;

  totalCount.textContent = String(total);
  remainingCount.textContent = String(remaining);
  doneCount.textContent = String(done);
};

const renderTasks = () => {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.done ? ' done' : ''}`;

    const main = document.createElement('div');
    main.className = 'task-main';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'task-toggle';
    toggle.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
    toggle.addEventListener('click', () => {
      task.done = !task.done;
      saveTasks();
      render();
    });

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'task-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Delete task: ${task.text}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      render();
    });

    main.appendChild(toggle);
    main.appendChild(text);
    item.appendChild(main);
    item.appendChild(remove);
    taskList.appendChild(item);
  });

  updateSummary();
};

const render = () => {
  renderTasks();
};

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  taskInput.value = "";
  saveTasks();
  render();
  taskInput.focus();
});

clearDoneButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
});

render();
