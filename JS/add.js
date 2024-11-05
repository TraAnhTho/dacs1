function addTodo(event) {
  event.preventDefault();
  const todoDiv = document.createElement("div");
  console.log(todoDiv);
  todoDiv.classList.add("todo");
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  console.log(todoInput.value);
  console.log(newTodo);

  const todoText = todoInput.value.trim();
  if (todoText === "") {
    alert("Mời nhập thông tin");
    return;
  }

  if (todoInput.value != "") {
    console.log("chay if");
    newTodo.classList.add("todo-item");
    todoCount++;

    todoDiv.appendChild(newTodo);

    //
    todoDiv.draggable = true;
    todoDiv.addEventListener("dragstart", dragStart, false);
    todoDiv.addEventListener("dragover", dragOver, false);
    todoDiv.addEventListener("drop", drop, false);
    todoDiv.addEventListener("touchstart", dragStart, false);
    todoDiv.addEventListener("touchmove", drop, false);

    //
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    //
    const formattedTime =
      (day < 10 ? "0" : "") +
      day +
      "/" +
      (month < 10 ? "0" : "") +
      month +
      "/" +
      year +
      " " +
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds;

    const todoData = {
      text: todoText,
      time: formattedTime,
      color: "white",
      completed: false,
    };

    saveLocalTodos(todoData);

    // Tạo và hiển thị các phần tử khác cho to-do (nút trạng thái, thời gian, v.v.)
    createStatusButtons(todoDiv, todoText);

    //
    const timeSpan = document.createElement("span");
    timeSpan.style.fontSize = "15px";
    timeSpan.style.color = "gray";
    timeSpan.innerText = " (Cre at: " + formattedTime + ")";
    todoDiv.appendChild(timeSpan);

    // Lưu cả nội dung và thời gian vào localStorage
    saveLocalTodos({ text: todoInput.value, time: formattedTime });

    // Lấy màu đã chọn
    const selectedColor = "white"; // Hoặc lấy màu mặc định nếu không chọn
    todoDiv.classList.add(selectedColor); // Thêm class màu cho to-do

    // Tạo div chứa các nút trạng thái
    const statusDiv = document.createElement("div");
    statusDiv.classList.add("status-buttons");

    const greenButton = document.createElement("button");
    greenButton.classList.add("green-btn");
    greenButton.innerHTML = "O";
    greenButton.style.backgroundColor = "lightgreen"; // Gắn màu cho nút

    statusDiv.appendChild(greenButton);

    const blueButton = document.createElement("button");
    blueButton.classList.add("blue-btn");
    blueButton.style.backgroundColor = "lightblue"; // Gắn màu cho nút
    blueButton.innerHTML = "O";

    statusDiv.appendChild(blueButton);

    const yellowButton = document.createElement("button");
    yellowButton.classList.add("yellow-btn");
    yellowButton.style.backgroundColor = "lightyellow"; // Gắn màu cho nút

    yellowButton.innerHTML = "O";

    statusDiv.appendChild(yellowButton);

    todoDiv.appendChild(statusDiv); // Thêm div trạng thái vào to-do item

    greenButton.addEventListener("click", () => {
      alert("Task marked as completed!");
      todoDiv.style.backgroundColor = "lightgreen"; // Đổi màu của todo
      updateLocalTodoColor(todoInput.value, "lightgreen"); // Lưu màu vào localStorage
    });

    blueButton.addEventListener("click", () => {
      alert("Blue button clicked!");
      todoDiv.style.backgroundColor = "lightblue"; // Đổi màu của todo
      updateLocalTodoColor(todoInput.value, "lightblue"); // Lưu màu vào localStorage
    });

    yellowButton.addEventListener("click", () => {
      alert("Yellow button clicked!");
      todoDiv.style.backgroundColor = "lightyellow"; // Đổi màu của todo
      updateLocalTodoColor(todoInput.value, "lightyellow"); // Lưu màu vào localStorage
    });

    //ADDING TO LOCAL STORAGE
    // Tạo nút Edit
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    // Xử lý sự kiện nhấn nút Edit
    editButton.addEventListener("click", () => {
      editTodo(todoDiv, newTodo);
    });
    // saveLocalTodos(todoInput.value);
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";
    saveLocalTodos({ text: todoInput.value, color: selectedColor });
  } else if (todoInput.value == "") {
    alert("mời nhạpa thông tin");
    console.log("chay else");
  }
}

function deleteCheck(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("slide");

    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const todoText = todo.children[0].innerText; // Lấy nội dung công việc
    updateLocalTodoCompletion(todoText, todo.classList.contains("completed"));
  }
}

function saveLocalTodos(todo) {
  if (todo.text.trim() === "") return; // Ngăn lưu nếu nội dung trống

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Tìm xem to-do này đã có trong danh sách chưa (dựa trên text)
  const existingTodoIndex = todos.findIndex(
    (storedTodo) => storedTodo.text === todo.text
  );

  if (existingTodoIndex > -1) {
    // Cập nhật to-do đã tồn tại
    todos[existingTodoIndex] = {
      text: todo.text,
      time: todo.time,
      color: todo.color || "",
      completed: todo.completed || false,
      index: todo.index || todos.length, // Đặt thứ tự nếu không có
    };
  } else {
    // Thêm mới to-do
    todos.push({
      text: todo.text,
      time: todo.time,
      color: todo.color || "",
      completed: todo.completed || false,
      index: todo.index || todos.length,
    });
  }

  localStorage.setItem("todos", JSON.stringify(todos));
}
// Hàm tạo và thêm to-do mới với màu sắc
function addTodoItem(text, color) {
  const todoItem = document.createElement("li"); // Tạo thẻ <li> mới
  todoItem.classList.add("todo-item", color); // Thêm class 'todo-item' và class màu sắc
  todoItem.textContent = text; // Nội dung của to-do

  // Thêm to-do vào danh sách
  document.querySelector(".todo-list").appendChild(todoItem);
}
addTodoItem("Task 1 - ALL - white", "white");
addTodoItem("Task 2 - deadline dài - green", "lightgreen");
addTodoItem("Task 3 - deadline ngắn - blue", "lightblue");
addTodoItem("Task 4 - Quan trọng - yellow", "lightyellow");

// Hàm thêm to-do mới với dữ liệu từ input
document
  .querySelector(".todo-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn refresh trang khi submit form

    const todoText = document.querySelector(".todo-input").value; // Lấy nội dung từ input
    const color = "green"; // Hoặc bạn có thể thêm logic để chọn màu cho to-do

    addTodoItem(todoText, color); // Gọi hàm tạo to-do với màu
  });
//
window.addEventListener("DOMContentLoaded", (event) => {
  filterByColor("all");
});
