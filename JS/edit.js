function editTodo(todoDiv, newTodo) {
  // Tạo một input để thay đổi nội dung
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = newTodo.innerText; // Hiển thị nội dung hiện tại

  // Thay thế nội dung hiện tại bằng input
  todoDiv.replaceChild(editInput, newTodo);

  // Tạo nút lưu (Save)
  const saveButton = document.createElement("button");
  saveButton.innerHTML = '<i class="fa-solid fa-save"></i>';
  saveButton.classList.add("save-btn");
  todoDiv.appendChild(saveButton);

  // Khi người dùng nhấn Save
  saveButton.addEventListener("click", () => {
    const updatedText = editInput.value.trim(); // Lấy nội dung mới và loại bỏ khoảng trắng thừa
    // const updatedText = editInput.value; // Lấy nội dung mới

    if (updatedText) {
      const oldText = newTodo.innerText; // Lấy nội dung cũ để cập nhật localStorage
      newTodo.innerText = updatedText; // Cập nhật nội dung trên giao diện
      todoDiv.replaceChild(newTodo, editInput); // Trả lại thẻ <li> sau khi chỉnh sửa
      todoDiv.removeChild(saveButton); // Xóa nút Save sau khi hoàn thành

      // Cập nhật lại localStorage với nội dung mới
      updateLocalTodoText(oldText, updatedText);
    } else {
      alert("Nội dung không được để trống!");
    }
  });
}

function saveEdit(updatedText, todoDiv) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoIndex = Array.from(todoList.children).indexOf(todoDiv); // Lấy vị trí to-do trong danh sách

  // Cập nhật nội dung mới cho to-do tương ứng
  todos[todoIndex].text = updatedText;

  // Cập nhật localStorage với thông tin mới
  localStorage.setItem("todos", JSON.stringify(todos));

  // Cập nhật lại giao diện
  const newTodo = document.createElement("li");
  newTodo.innerText = updatedText;
  newTodo.classList.add("todo-item");

  // Thay input bằng nội dung mới
  todoDiv.replaceChild(newTodo, todoDiv.querySelector(".edit-input"));
}
