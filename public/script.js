//___NETWORK CONSTANTS____
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const CONTENT_TYPE = 'content-type';
const RESPONSE_TYPE_URLENCODED = 'application/x-www-form-urlencoded';

//___HTML CONSTANTS___
//LISTS
const TODO_LIST_ACTIVE = 'list_active';
const TODO_LIST_COMPLETED = 'list_completed';
const TODO_LIST_DELETED = 'list_deleted';
//COL
const TODO_COL_COMPLETE = 'col_complete';
const TODO_COL_DELETE = 'col_delete';
//BUTTONS
const BUTTONS_ACTIVE = 'buttons_active';
const BUTTONS_COMPLETE = 'buttons_complete';
const BUTTON_COMPLETED = 'button_completed';
const BUTTON_DELETED = 'button_deleted';
//INPUT
const INPUT_NEW_TODO_ID = 'inputNewToDo';
//ATTRIBUTES
const ATTR_STYLE = 'style';
const ATTR_ID = '_ID';
const ATTR_ONCLICK = 'onclick';
//VISIBILITY STATE
const STATE_HIDDEN = 'visibility:hidden;';
const STATE_VISIBLE = '';
const STATE_GONE = 'display : none;';
//LIST HEADERS
const LISTACTIVE_HTML_HEAD = '<li style="background: GREEN; color: white"><b>ACTIVE</b></li>';
const LISTCOMPLETE_HTML_HEAD = `<li style='background: BLACK; color: white'>
                                    <b>COMPLETED</b>
                                    <span style="position: absolute; right : 0px; margin-right: 25px;"
                                          onclick='hideCompleted();'>Hide</span>
                                </li>`;
const LISTDELETED_HTML_HEAD = `<li style='background: RED; color: white'>
                                    <b>DELETED</b>
                                    <span style="position: absolute; right : 0px; margin-right: 25px;"
                                          onclick='hideDeleted();'>Hide</span>
                                </li>`;

//___SCRIPT VARIABLES__
const listActive = document.getElementById(TODO_LIST_ACTIVE);
const listCompleted = document.getElementById(TODO_LIST_COMPLETED);
const listDeleted = document.getElementById(TODO_LIST_DELETED);

const colCompleted = document.getElementById(TODO_COL_COMPLETE);
const colDeleted = document.getElementById(TODO_COL_DELETE);

const buttonsActive = document.getElementById(BUTTONS_ACTIVE);
const buttonsComplete = document.getElementById(BUTTONS_COMPLETE);

const buttonShowCompleted = document.getElementById(BUTTON_COMPLETED);
const buttonShowDeleted = document.getElementById(BUTTON_DELETED);

const SELECTED_ACTIVE = {};
const SELECTED_COMPLETE = {};

let totalActiveSelected = 0;
let totalCompleteSelected = 0;

function getButton(innerText, onClickArgs) {
    const elementButton = document.createElement('button');
    elementButton.innerText = innerText;
    elementButton.setAttribute(ATTR_ONCLICK, onClickArgs);
    return elementButton;
}

function createToDo(id, data) {
    switch (data.status) {
        case 'ACTIVE' : {
            return `<li><input type='checkbox' ${ATTR_ID}=${id}
            onclick='handleActiveCheckboxClick(this)'/> ${data.title}</li>`;
        }
        case 'COMPLETE' : {
            return `<li><input type='checkbox' ${ATTR_ID}=${id}
            onclick='handleCompleteCheckboxClick(this)'/> ${data.title}</li>`;
        } 
        case 'DELETED' : {
            return `<li>${data.title}</li>`;
        }
        default : return '';
    }
}

function handleActiveCheckboxClick(checkbox) {
    if (checkbox.checked) {
        ++totalActiveSelected;
        SELECTED_ACTIVE[checkbox.getAttribute(ATTR_ID)] = true;
    } else {
        --totalActiveSelected;
        SELECTED_ACTIVE[checkbox.getAttribute(ATTR_ID)] = false;
    }
    if (totalActiveSelected > 0) {
        buttonsActive.setAttribute(ATTR_STYLE, STATE_VISIBLE);
    } else {
        buttonsActive.setAttribute(ATTR_STYLE, STATE_HIDDEN);
    }
}

function handleCompleteCheckboxClick(checkbox) {
    if (checkbox.checked) {
        ++totalCompleteSelected;
        SELECTED_COMPLETE[checkbox.getAttribute(ATTR_ID)] = true;
    } else {
        --totalCompleteSelected;
        SELECTED_COMPLETE[checkbox.getAttribute(ATTR_ID)] = false;
    }
    if (totalCompleteSelected > 0) {
        buttonsComplete.setAttribute(ATTR_STYLE, STATE_VISIBLE);
    } else {
        buttonsComplete.setAttribute(ATTR_STYLE, STATE_HIDDEN);
    }
}

function refreshList(data) {
    let listActiveHTML = LISTACTIVE_HTML_HEAD;
    let listCompletedHTML = LISTCOMPLETE_HTML_HEAD;
    let listDeletedHTML = LISTDELETED_HTML_HEAD;
    for (const key of Object.keys(data)) {
        const todoElement = createToDo(key, data[key]);
        console.log(data);
        switch (data[key].status) {
            case 'ACTIVE' : {
                listActiveHTML += todoElement;
                break;
            }
            case 'COMPLETE' : {
                listCompletedHTML += todoElement;
                break;
            }
            case 'DELETED' : {
                listDeletedHTML += todoElement;
                break;
            }
            default : break;
        }
    }
    listActive.innerHTML = listActiveHTML;
    listCompleted.innerHTML = listCompletedHTML;
    listDeleted.innerHTML = listDeletedHTML;
}

function getTodos() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/todos', true);
    xhr.onreadystatechange = function () {
       if (xhr.readyState === RESPONSE_DONE) {
           if (xhr.status === STATUS_OK) {
                refreshList(JSON.parse(xhr.responseText));
           }
       }
    };
    xhr.send();
}

function postTodo() {
    const title = document.getElementById(INPUT_NEW_TODO_ID).value;
    console.log(title);
    const data = `todoTitle= ${encodeURI(title)}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/todos', true);
    xhr.setRequestHeader(CONTENT_TYPE, RESPONSE_TYPE_URLENCODED);
    xhr.onreadystatechange = function () {
       if (xhr.readyState === RESPONSE_DONE) {
           if (xhr.status === STATUS_OK) {
               refreshList(JSON.parse(xhr.responseText));
           }
       }
    };
    xhr.send(data);
}

function putToDo(id, status) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/todos/${status}/${id}`, true);
    xhr.onreadystatechange = function () {
       if (xhr.readyState === RESPONSE_DONE) {
           if (xhr.status === STATUS_OK) {
               refreshList(JSON.parse(xhr.responseText));
           }
       }
    };
    xhr.send();
}

function deleteToDo(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/todos/${id}`, true);
    xhr.onreadystatechange = function () {
       if (xhr.readyState === RESPONSE_DONE) {
           if (xhr.status === STATUS_OK) {
               refreshList(JSON.parse(xhr.responseText));
           }
       }
    };
    xhr.send();
}

function onComplete() {
    for (const key of Object.keys(SELECTED_ACTIVE)) {
        if (SELECTED_ACTIVE[key]) {
            putToDo(key, 'COMPLETE');
            SELECTED_ACTIVE[key] = false;
        }
    }
    buttonsActive.setAttribute(ATTR_STYLE, STATE_HIDDEN);
}

function onDeleteActive () {
    for (const key of Object.keys(SELECTED_ACTIVE)) {
        if (SELECTED_ACTIVE[key]) {
            deleteToDo(key);
            SELECTED_ACTIVE[key] = false;
        }
    }
    buttonsActive.setAttribute(ATTR_STYLE, STATE_HIDDEN);
}

function onActivate() {
    for (const key of Object.keys(SELECTED_COMPLETE)) {
        if (SELECTED_COMPLETE[key]) {
            putToDo(key, 'ACTIVE');
            SELECTED_COMPLETE[key] = false;
        }
    }
    buttonsComplete.setAttribute(ATTR_STYLE, STATE_HIDDEN);
}

function onDeleteComplete() {
    for (const key of Object.keys(SELECTED_COMPLETE)) {
        if (SELECTED_COMPLETE[key]) {
            deleteToDo(key);
            SELECTED_COMPLETE[key] = false;
        }
    }
    buttonsComplete.setAttribute(ATTR_STYLE, STATE_HIDDEN);
}

function hideCompleted() {
    colCompleted.setAttribute(ATTR_STYLE, STATE_GONE);
    buttonShowCompleted.setAttribute(ATTR_STYLE, STATE_VISIBLE);
}

function showCompleted() {
    colCompleted.setAttribute(ATTR_STYLE, STATE_VISIBLE);
    buttonShowCompleted.setAttribute(ATTR_STYLE, STATE_GONE);
}

function hideDeleted() {
    colDeleted.setAttribute(ATTR_STYLE, STATE_GONE);
    buttonShowDeleted.setAttribute(ATTR_STYLE, STATE_VISIBLE);
}

function showDeleted() {
    colDeleted.setAttribute(ATTR_STYLE, STATE_VISIBLE);
    buttonShowDeleted.setAttribute(ATTR_STYLE, STATE_GONE);
}
window.onload = getTodos;
