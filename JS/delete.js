function removeLocalTodos(todo) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const todoIndex = todo.children[0].innerText;
  const newTodos = todos.filter(function (storedTodo) {
    return storedTodo.text !== todoIndex; // Lọc ra các to-do không trùng text
  });

  localStorage.setItem("todos", JSON.stringify(newTodos));
}
