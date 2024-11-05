import { addFunction } from "./add.js";
import { deleteFunction } from "./delete.js";
import { editFunction } from "./edit.js";
import { moveFunction } from "./move.js";

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

let currentElement = "";
let initialX = 0,
  initialY = 0;
let todoCount = 0;

function getLocalTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Sắp xếp lại danh sách theo thứ tự index trước khi hiển thị
  todos.sort((a, b) => a.index - b.index);

  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.draggable = true; // Thêm thuộc tính draggable
    todoDiv.addEventListener("dragstart", dragStart, false);
    todoDiv.addEventListener("dragover", dragOver, false);
    todoDiv.addEventListener("drop", drop, false);
    todoDiv.addEventListener("touchstart", dragStart, false);
    todoDiv.addEventListener("touchmove", drop, false);
    // todoDiv.classList.add(todo.color);
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Hiển thị thời gian tạo to-do
    // Kiểm tra xem đã có span thời gian hay chưa
    if (!todoDiv.querySelector(".created-time")) {
      const timeSpan = document.createElement("span");
      timeSpan.classList.add("created-time"); // Thêm class để nhận diện
      timeSpan.style.fontSize = "15px";
      timeSpan.style.color = "gray";
      timeSpan.innerText = " (Cre at: " + todo.time + ")";
      todoDiv.appendChild(timeSpan);
    }

    // Khôi phục màu sắc
    if (todo.color) {
      todoDiv.style.backgroundColor = todo.color;
    }
    // Khôi phục trạng thái hoàn thành
    if (todo.completed) {
      todoDiv.classList.add("completed");
    }

    // Tạo lại các nút trạng thái
    createStatusButtons(todoDiv, todo.text);

    // Tạo nút Edit
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    // Xử lý sự kiện nhấn nút Edit
    editButton.addEventListener("click", () => {
      editTodo(todoDiv, newTodo);
    });

    // Tạo nút hoàn thành và nút xóa
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //xóa
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
  });
}
function createStatusButtons(todoDiv, todoText) {
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("status-buttons");

  const greenButton = document.createElement("button");
  greenButton.classList.add("green-btn");
  greenButton.innerHTML = "O";
  greenButton.style.backgroundColor = "lightgreen";
  greenButton.addEventListener("click", () => {
    todoDiv.style.backgroundColor = "lightgreen";
    updateLocalTodoColor(todoText, "lightgreen");
  });

  const blueButton = document.createElement("button");
  blueButton.classList.add("blue-btn");
  blueButton.innerHTML = "O";
  blueButton.style.backgroundColor = "lightblue";
  blueButton.addEventListener("click", () => {
    todoDiv.style.backgroundColor = "lightblue";
    updateLocalTodoColor(todoText, "lightblue");
  });

  const yellowButton = document.createElement("button");
  yellowButton.classList.add("yellow-btn");
  yellowButton.innerHTML = "O";
  yellowButton.style.backgroundColor = "lightyellow";
  yellowButton.addEventListener("click", () => {
    todoDiv.style.backgroundColor = "lightyellow";
    updateLocalTodoColor(todoText, "lightyellow");
  });

  statusDiv.appendChild(greenButton);
  statusDiv.appendChild(blueButton);
  statusDiv.appendChild(yellowButton);
  todoDiv.appendChild(statusDiv);
}

function filterTodo(e) {
  const todos = todoList.children;
  // Sử dụng children thay vì childNodes
  Array.from(todos).forEach(function (todo) {
    // Chuyển NodeList thành mảng để dùng forEach
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "incomplete":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function filterByColor(color) {
  const todos = document.querySelectorAll(".todo"); // Lấy tất cả các to-do từ danh sách

  todos.forEach(function (todo) {
    const todoColor = todo.style.backgroundColor; // Lấy màu nền của to-do
    if (color === "all") {
      todo.style.display = "flex"; // Hiển thị tất cả các to-do
    } else if (todoColor === color) {
      todo.style.display = "flex"; // Hiển thị các to-do có màu đã chọn
    } else {
      todo.style.display = "none"; // Ẩn các to-do không đúng màu
    }
  });
}

function updateLocalTodoText(oldText, newText) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((todo) => {
    if (todo.text === oldText) {
      todo.text = newText; // Cập nhật nội dung mới
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos)); // Lưu lại localStorage
}

// Thêm sự kiện cho các nút màu
document
  .querySelector(".green-btn")
  .addEventListener("click", () => filterByColor("lightgreen"));
document
  .querySelector(".blue-btn")
  .addEventListener("click", () => filterByColor("lightblue"));
document
  .querySelector(".yellow-btn")
  .addEventListener("click", () => filterByColor("lightyellow"));
document
  .querySelector(".white-btn")
  .addEventListener("click", () => filterByColor("all")); // Hiển thị tất cả các to-do

function updateLocalTodoColor(todoText, color) {
  let todos =
    // if (localStorage.getItem("todos") === null) {
    //   todos = [];
    // } else {
    //   todos =
    JSON.parse(localStorage.getItem("todos")) || [];
  // }

  todos.forEach((todo) => {
    if (todo.text === todoText) {
      todo.color = color; // Cập nhật màu mới
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodoCompletion(todoText, completed) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((todo) => {
    if (todo.text === todoText) {
      todo.completed = completed; // Cập nhật trạng thái hoàn thành
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Thêm sự kiện cho các nút lọc theo trạng thái (all, completed, incomplete)
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};
