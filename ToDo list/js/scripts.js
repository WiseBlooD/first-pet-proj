const todoInput = document.querySelector(".todo__input");
const completedTodosDiv = document.querySelector(".completed__todos");
const uncompletedTodosDiv = document.querySelector(".uncompleted__todos");
let todoItems = [];
//Получаем туду при первой загрузке

window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }

  render();
};

// добавляем todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });

  saveAndRender();
}

// получаем контент в инпуте

todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode === 13) {
    //13 = Enter
    addTodo(value);

    todoInput.value = "";
    todoInput.focus();
  }
};

// удаляем todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

// помечаем при завершнии todo
function markAsComplete(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }

    return todo;
  });
  saveAndRender();
}

// помечаем когда не завершено
function markAsUncompleted(id) {
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

// Render
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
    uncompletedTodosDiv.innerHTML = `<div class='empty'>Нет незавершенных задач</div>`;
  }
  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed__title'>Завершенные(${completedTodos.length}) / ${todoItems.length}</div>`;
  }
  completedTodos.forEach((todo) => {
    completedTodosDiv.append(createTodoElement(todo));
  });
}

//save and render

function saveAndRender() {
  save();
  render();
}

// create todo list item
function createTodoElement(todo) {
  //делаем контейнер todo list
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data__id", todo.id);
  todoDiv.className = "todo__item";

  // делаем todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  //checkbox for list
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest(".todo__item").dataset.id;
    e.target.checked ? markAsComplete(id) : markAsUncompleted(id);
  };

  // кнопка удаления для списка
  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<svg
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
    let id = e.target.closest(".todo__item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
