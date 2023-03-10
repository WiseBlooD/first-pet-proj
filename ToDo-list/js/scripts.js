let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodosDiv = document.querySelector(".completed-todos");
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos");
const anything = document.getElementById("");
//получаем todo список при первой загрузке
window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }
  render();
};

// получаем введенный в input контент
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode === 13) {
    addTodo(value);

    todoInput.value = "";
    todoInput.focus();
  }
};

//добавляем todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });
  saveAndRender();
}

// remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

//маркируем завершенное
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }
    return todo;
  });
  saveAndRender();
}

//маркируем незавершенное
function marAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }
    return todo;
  });
  saveAndRender();
}

// сохраняем в localstorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//render
function render() {
  let uncompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);

  completedTodosDiv.innerHTML = "";
  uncompletedTodosDiv.innerHTML = "";

  if (uncompletedTodos.length > 0) {
    uncompletedTodos.forEach((todo) => {
      uncompletedTodosDiv.append(createTodoElement(todo));
    });
  } else {
    uncompletedTodosDiv.innerHTML = `<div class='empty'> Нет незавершенных задач</div>`;
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'> Завершены (${completedTodos.length} / ${todoItems.length}) </div>`;

    completedTodos.forEach((todo) => {
      completedTodosDiv.append(createTodoElement(todo));
    });
  }
}

// save and render
function saveAndRender() {
  save();
  render();
}

// create todo list item
function createTodoElement(todo) {
  // создаем туду лист контейнер
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data-id", todo.id);
  todoDiv.className = "todo-item";

  // создаем туду итем текст
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  //checkbox for list
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    e.target.checked ? markAsCompleted(id) : marAsUncompleted(id);
  };

  // delete btnn for list
  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = ` <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-x"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
  </svg>`;
  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
