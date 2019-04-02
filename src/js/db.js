(function () {
  window.todoDB = (function() {
    var tDB = {};
    var datastore = null;

    tDB._init = function() {
      window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
      window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      if (!window.indexedDB) {
        console.error("Your browser doesn't support a stable version of IndexedDB.");
        return;
      }
    }

    tDB.onerror = function(e) {
      console.log('Error in database...', e);
    }

    /**
     * Open a connection to the datastore.
     */
    tDB.open = function(name, version) {
      // Open a connection to the datastore.
      return new Promise(function(resolve, reject) {
        var request = indexedDB.open(name, version);

        // Handle datastore upgrades.
        request.onupgradeneeded = function(e) {
          var db = e.target.result;

          e.target.transaction.onerror = tDB.onerror;

          // Delete the old datastore.
          if (db.objectStoreNames.contains(name)) {
            db.deleteObjectStore(name);
          }

          // Create a new datastore.
          var store = db.createObjectStore(name, {
            keyPath: 'timestamp'
          });
        };

        // Handle successful datastore access.
        request.onsuccess = function(e) {
          console.log('db', e);
          // Get a reference to the DB.
          datastore = e.target.result;

          // Execute the callback.
          // callback();
          resolve(e);
        };

        // Handle errors when opening the datastore.
        request.onerror = tDB.onerror;
      });
    };

    /**
     * Create a new todo item.
     */
    tDB.createTodo = function(text, callback) {
      return new Promise(function(resolve, reject) {
        // Get a reference to the db.
        var db = datastore;

        // Initiate a new transaction.
        var transaction = db.transaction(['todos'], 'readwrite');

        // Get the datastore.
        var objStore = transaction.objectStore('todos');

        // Create a timestamp for the todo item.
        var timestamp = new Date().getTime();

        // Create an object for the todo item.
        var todo = {
          'text': text,
          'timestamp': timestamp
        };

        // Create the datastore request.
        var requestAdd = objStore.add(todo);

        // Handle a successful datastore add.
        requestAdd.onsuccess = function(e) {
          console.log('Record created successfully...', e);
          // Execute the callback function.
          // callback(todo);
          resolve(e);
        };

        // Handle errors.
        requestAdd.onerror = tDB.onerror;
      });
    };

    /**
     * Fetch all of the todo items in the datastore.
     */
    tDB.fetchTodos = function() {
      return new Promise(function(resolve, reject) {
        var db = datastore;
        var transaction = db.transaction(['todos'], 'readwrite');
        var objStore = transaction.objectStore('todos');

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = objStore.openCursor(keyRange);

        var todos = [];

        transaction.oncomplete = function(e) {
          console.log('Records fetched successfully...', todos);
          resolve(todos);
        };

        cursorRequest.onsuccess = function(e) {
          var result = e.target.result;

          if (!!result == false) {
            console.log("No more entries!");
            return;
          }

          todos.push(result.value);

          result.continue();
        };

        cursorRequest.onerror = tDB.onerror;
      });
    };

    /**
     * Fetch a todo item.
     */
    tDB.fetchTodo = function(id) {
      return new Promise(function(resolve, reject) {
        var db = datastore;
        var transaction = db.transaction(['todos'], 'readwrite');
        var objStore = transaction.objectStore('todos');

        var requestGet = objStore.get(id);

        requestGet.onsuccess = function(e) {
          console.log('Record fetched successfully...', e);
          resolve(e);
        };

        requestGet.onerror = tDB.onerror;
      });
    }

    /**
     * Update a todo item.
     */
    tDB.updateTodo = function(id, text) {
      return new Promise(function(resolve, reject) {

        tDB.fetchTodo(id).then(function(e) {
          var data = e.target.result;
          if (data !== undefined) {
            data.text = text;

            var db = datastore;
            var transaction = db.transaction(['todos'], 'readwrite');
            var objStore = transaction.objectStore('todos');

            var requestPut = objStore.put(data);

            requestPut.onsuccess = function(e) {
              console.log('Record updated successfully...', e);
              resolve(e);
            };

            requestPut.onerror = tDB.onerror;
          }
        });
      });
    }

    /**
     * Delete a todo item.
     */
    tDB.deleteTodo = function(id) {
      return new Promise(function(resolve, reject) {
        var db = datastore;
        var transaction = db.transaction(['todos'], 'readwrite');
        var objStore = transaction.objectStore('todos');

        var requestDelete = objStore.delete(id);

        requestDelete.onsuccess = function(e) {
          // callback();
          console.log('Record deleted successfully...', e);
          resolve(e);
        };

        requestDelete.onerror = tDB.onerror;
      });
    };

    /**
     * IndexedDB limit output syntax similar to LIMIT 10, 5;
     */
    tDB.limitRecords = function(pageSize, skipCount) {
      return new Promise(function(resolve, reject) {
        var db = datastore;
        var transaction = db.transaction(['todos'], 'readwrite');
        var objStore = transaction.objectStore('todos');

        var idx = 0;
        var requestLimit = objStore.openCursor();

        requestLimit.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            if (skipCount <= idx && idx < pageSize + skipCount) {
              console.log('Cursor is in the range ', cursor);
              ++idx;

              if (idx >= pageSize + skipCount + 1) {
                // we have all data we requested
                // abort the transaction
                transaction.abort();
              } else {
                // continue iteration
                cursor.continue();
              }
            }
          }

          resolve();
        }

        requestLimit.onerror = tDB.onerror;
      });
    };

    // Export the tDB object.
    tDB._init();
    return tDB;
  })();

})();
