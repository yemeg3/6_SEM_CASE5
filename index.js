const fs = require('fs');


class Task {
  constructor(description) {
    this.description = description;
    this.completed = false;
  }

  markAsCompleted() {
    this.completed = true;
  }
}

class TaskList {
  constructor() {
    this.tasks = [];
  }

  addTask(description) {
    const task = new Task(description);
    this.tasks.push(task);
  }

  deleteTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    }
  }

  displayTasks() {
    console.log('Все задачи:');
    this.tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.description} [${task.completed ? 'Выполнена' : 'Не выполнена'}]`);
    });
  }

  displayCompletedTasks() {
    console.log('Выполненные задачи:');
    this.tasks.forEach((task, index) => {
      if (task.completed) {
        console.log(`${index + 1}. ${task.description}`);
      }
    });
  }

  markTaskAsCompleted(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks[index].markAsCompleted();
    }
  }

  saveToFile(filename) {
    const data = JSON.stringify(this.tasks);
    fs.writeFileSync(filename, data, 'utf8');
  }

  loadFromFile(filename) {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      const tasks = JSON.parse(data);
      this.tasks = tasks.map(task => {
        const t = new Task(task.description);
        t.completed = task.completed;
        return t;
      });
    }
  }
}


const taskList = new TaskList();
const filename = 'tasks.json';


taskList.loadFromFile(filename);


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const showMenu = () => {
  console.log('\nМенеджер задач');
  console.log('1. Добавить задачу');
  console.log('2. Удалить задачу');
  console.log('3. Показать все задачи');
  console.log('4. Показать выполненные задачи');
  console.log('5. Отметить задачу как выполненную');
  console.log('6. Сохранить и выйти');
  console.log('7. Выйти без сохранения');
  console.log('Введите ваш выбор: ');
};

const handleUserInput = (input) => {
  switch (input.trim()) {
    case '1':
      readline.question('Введите описание задачи: ', description => {
        taskList.addTask(description);
        showMenu();
      });
      break;
    case '2':
      readline.question('Введите номер задачи для удаления: ', num => {
        taskList.deleteTask(parseInt(num) - 1);
        showMenu();
      });
      break;
    case '3':
      taskList.displayTasks();
      showMenu();
      break;
    case '4':
      taskList.displayCompletedTasks();
      showMenu();
      break;
    case '5':
      readline.question('Введите номер задачи для отметки как выполненной: ', num => {
        taskList.markTaskAsCompleted(parseInt(num) - 1);
        showMenu();
      });
      break;
    case '6':
      taskList.saveToFile(filename);
      console.log('Задачи сохранены. Выход...');
      readline.close();
      break;
    case '7':
      console.log('Выход без сохранения...');
      readline.close();
      break;
    default:
      console.log('Неверный выбор, пожалуйста, попробуйте снова.');
      showMenu();
  }
};

showMenu();
readline.on('line', handleUserInput);
