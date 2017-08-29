const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODO_LIST_ID = 'todo_list';

const list = document.getElementById(TODO_LIST_ID);

function addTodo(data) {
    list.innerText += data;
}

function getTodos() {
   const xhr = new XMLHttpRequest();
   xhr.open('GET', '/api/todos', true);
   xhr.onreadystatechange = function () {
       if (xhr.readyState === RESPONSE_DONE) {
           if (xhr.status === STATUS_OK) {
                addTodo(xhr.responseText);
           }
       }
   };
   xhr.send();
}
