function dragStart(e) {
  initialX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
  initialY = isTouchDevice() ? e.touches[0].clientY : e.clientY;
  currentElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

// Thêm sự kiện khi người dùng bắt đầu kéo
todoList.addEventListener("dragstart", function (e) {
  if (e.target.classList.contains("todo")) {
    e.target.classList.add("dragging");
  }
});

// Thêm sự kiện khi người dùng kết thúc kéo
todoList.addEventListener("dragend", function (e) {
  if (e.target.classList.contains("todo")) {
    e.target.classList.remove("dragging");
    updateLocalTodoOrder(); // Cập nhật lại thứ tự sau khi kéo
  }
});

// Sự kiện kéo và thả
todoList.addEventListener("dragover", function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoList, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    todoList.appendChild(draggable);
  } else {
    todoList.insertBefore(draggable, afterElement);
  }
});

// Hàm hỗ trợ kéo và thả (xác định vị trí giữa các to-do)
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Cập nhật thứ tự trong localStorage sau khi kéo thả
function updateLocalTodoOrder() {
  const todos = [];
  const todoElements = todoList.querySelectorAll(".todo");

  todoElements.forEach((todoDiv, index) => {
    const text = todoDiv.querySelector("li").innerText;
    const time = todoDiv.querySelector("span").innerText;
    const color = todoDiv.style.backgroundColor || "";
    const completed = todoDiv.classList.contains("completed");

    todos.push({
      text: text,
      time: time,
      color: color,
      completed: completed,
      index: index, // Lưu thứ tự mới
    });
  });

  // Lưu danh sách đã sắp xếp vào localStorage
  localStorage.setItem("todos", JSON.stringify(todos));
}

const drop = (e) => {
  e.preventDefault();
  let newX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
  let newY = isTouchDevice() ? e.touches[0].clientY : e.clientY;

  let targetElement = document.elementFromPoint(newX, newY);

  if (targetElement && targetElement.classList.contains("todo")) {
    let currentPosition = Array.from(todoList.children).indexOf(currentElement);
    let targetPosition = Array.from(todoList.children).indexOf(targetElement);

    if (currentPosition < targetPosition) {
      targetElement.insertAdjacentElement("afterend", currentElement);
    } else {
      targetElement.insertAdjacentElement("beforebegin", currentElement);
    }

    // Sau khi kéo thả xong, lưu thứ tự vào localStorage
    updateLocalTodoOrder();
  }

  initialX = newX;
  initialY = newY;
};
