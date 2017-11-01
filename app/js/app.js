(function () {
  window.onload = function() {
    // TODO: App Code goes here.
    // Display the todo items.
    var dbName = 'todos', dbVersion = 1;
    var dbConnection = todoDB.open(dbName, dbVersion);
    dbConnection.then(function (response) {
      refreshTodos();
      testFetch();
    });

    // Get references to the form elements.
    var newTodoForm = document.getElementById('new-todo-form');
    var newTodoInput = document.getElementById('new-todo');

    // Handle new todo item form submissions.
    newTodoForm.onsubmit = function() {
      // Get the todo text.
      var text = newTodoInput.value;

      // Check to make sure the text is not blank (or just spaces).
      if (text.replace(/ /g,'') != '') {
        // Create the todo item.
        todoDB.createTodo(text).then(function(todo) {
          console.log(todo);
          refreshTodos();
        });
      }

      // Reset the input field.
      newTodoInput.value = '';

      // Don't send the form.
      return false;
    };

    // Update the list of todo items.
    function refreshTodos() {
      todoDB.fetchTodos().then(function(todos) {
        var todoList = document.getElementById('todo-items');
        todoList.innerHTML = '';

        for(var i = 0; i < todos.length; i++) {
          // Read the todo items backwards (most recent first).
          var todo = todos[(todos.length - 1 - i)];

          var li = document.createElement('li');
          li.id = 'todo-' + todo.timestamp;
          var checkbox = document.createElement('input');
          checkbox.type = "checkbox";
          checkbox.className = "todo-checkbox";
          checkbox.setAttribute("data-id", todo.timestamp);

          li.appendChild(checkbox);

          var span = document.createElement('span');
          span.innerHTML = todo.text;

          li.appendChild(span);

          todoList.appendChild(li);

          // Setup an event listener for the checkbox.
          checkbox.addEventListener('click', function(e) {
            var id = parseInt(e.target.getAttribute('data-id'));

            todoDB.deleteTodo(id, refreshTodos).then(function (todo) {
              console.log(todo);
              refreshTodos();
            });
          });
        }

      });
    }

    function testFetch() {
      var testId = 1501764466395;
      todoDB.fetchTodo(testId).then(function(e) {
        var data = e.target.result;
        console.log(data);
        todoDB.updateTodo(testId, 'ggg').then(function(e) {
          console.log(e.target);
          refreshTodos();
        });

      });

      if (!window.localStorage.getItem('tempTest')) {
        window.localStorage.setItem('tempTest', 'value');
      }
    }

  };

})();
