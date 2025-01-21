import "./style.css";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const input = document.getElementById("todo-text") as HTMLInputElement;
const addButton = document.getElementById("button") as HTMLButtonElement;
const todoContainer = document.getElementById("todo-container") as HTMLDivElement;
let todos: Todo[] = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")!) : [];

renderTodos(todos);
// Skapa ny todo
function addTodo(): void {
  const id = Math.floor(Math.random() * (1000000000000000 + 1) + 1);
  const text = input.value.trim();
  const done = false;

  const newTodo = { id: id, text: text, done: done };

  if (text !== "") {
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(todos);
    input.value = "";
  }
}

// Knapp, lägger till todo i lista
addButton.addEventListener("click", addTodo);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addButton.click();
  }
});

// Visa listan av todos
function renderTodos(todoList: Todo[]) {
  todoContainer.innerHTML = "";

  todoList.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("data-id", todo.id.toString());

    todoDiv.innerHTML = `<p class="todo-text ${todo.done ? "todo-done" : ""}">${todo.text}</p>
            <div class="todo-buttons">
              <button class="todo-edit">Edit</button>
              <button class="todo-delete">Delete</button>
            </div>`;

    todoContainer.appendChild(todoDiv);
  });
}

// Ta bort/stryka över todo/redigera todo
document.addEventListener("click", function (e) {
  const target = e.target as HTMLElement;

  // Delete
  if (target.closest(".todo-delete")) {
    const todoElement = target.closest(".todo") as HTMLDivElement;
    const todoId = Number(todoElement.dataset.id);
    const index = todos.findIndex((todo) => todo.id === todoId);
    if (index > -1) {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos(todos);
    }
  }

  // Edit
  if (target.closest(".todo-edit")) {
    const todoElement = target.closest(".todo") as HTMLDivElement;
    const todoId = Number(todoElement.dataset.id);
    const todo = todos.find((t) => t.id === todoId);
    const todoButtons = todoElement.querySelector(".todo-buttons") as HTMLDivElement;

    // Byter ut knapparna mot input och done-knapp
    todoButtons.innerHTML = `<input class="edit-input"></input>
    <button class="button-done">Done</button>`;
    const doneButton = document.querySelector(".button-done") as HTMLButtonElement;
    const textInput = document.querySelector(".edit-input") as HTMLInputElement;

    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
      if (button !== doneButton) {
        button.disabled = true;
      }
    });

    doneButton?.addEventListener("click", function () {
      const newText: string = textInput.value;
      if (todo) {
        if (newText.trim() !== "") {
          todo.text = newText;
          todo.done = false;
          localStorage.setItem("todos", JSON.stringify(todos));
          renderTodos(todos);
        }
      }
    });

    textInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        doneButton.click();
      }
    });
  }

  // Done-stryk
  if (
    target.closest(".todo") &&
    !target.closest(".todo-edit") &&
    !target.closest(".button-done") &&
    !target.closest(".edit-input")
  ) {
    const todoElement = target.closest(".todo") as HTMLDivElement;
    const todoId = Number(todoElement.dataset.id);
    const index: Todo | undefined = todos.find((todo) => todo.id === todoId);

    if (index) {
      index.done = !index.done;
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos(todos);
    }
  }
});

// Ta bort alla todos
const deleteAll = document.getElementById("delete-all") as HTMLButtonElement;
deleteAll.addEventListener("click", function () {
  todos = [];
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
});
