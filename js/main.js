const todoForm = document.querySelector('#todoForm');
const todoList = document.querySelector('#todoList');
const todoInput = document.querySelector('#todoInput');
const todoEmpty = document.querySelector('.todo__emptyList');

let todoArray = [];

todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', handleTaskClick);

if (localStorage.getItem('task')) {
    todoArray = JSON.parse(localStorage.getItem('task'));
    todoArray.forEach((task, index) => generateHTML(task, index + 1));
}

checkEmptyList();

function addTask(event) {
    event.preventDefault();

    const inputValue = todoInput.value.trim();

    if (!inputValue) { return; }

    const taskInfo = {
        id: Date.now(),
        taskText: inputValue,
        done: false
    };

    todoArray.push(taskInfo);

    saveToLocalStorage();
    generateHTML(taskInfo, todoArray.length);
    todoInput.value = '';
    todoInput.focus();
    checkEmptyList();
}

function handleTaskClick(event) {
    const target = event.target;

    if (target.classList.contains('todo__button')) {
        const action = target.dataset.action;
        const parentTask = target.closest('.todo__item');
        const taskId = +parentTask.id;
        const taskIndex = todoArray.findIndex(task => task.id === taskId);

        if (action === 'done') {
            todoArray[taskIndex].done = !todoArray[taskIndex].done;
            target.classList.toggle('buttonColor');
            parentTask.querySelector('.todo__text').classList.toggle('todo__text-done');
        } 
        else if (action === 'delete') {
            todoArray.splice(taskIndex, 1);
            parentTask.remove();
            checkEmptyList();
        }

        saveToLocalStorage();
    }
}

function generateHTML(data, index) {
    const cssClass = data.done ? 'todo__text todo__text-done' : 'todo__text';
    const taskHtml = `<li id="${data.id}" class="todo__item">
                        <span class="${cssClass}">${index}. ${data.taskText}</span>
                        <div class="todo__buttons-wrapper">
                            <button class="todo__button ${data.done ? 'buttonColor' : ''}" data-action="done">
                                <img src="./images/icons/check-big-svgrepo-com.svg" alt="" class="todo__button-image">
                            </button>
                            <button class="todo__button" data-action="delete">
                                <img id="cross" src="./images/icons/cross-small-svgrepo-com.svg" alt="" class="todo__button-image">
                            </button>
                        </div>
                    </li>`;
    todoList.insertAdjacentHTML('beforeend', taskHtml);
}

function checkEmptyList() {
    // Проверка, есть ли сохраненные задачи
    if (todoArray.length === 0) {
        const emptyListHtml = `<div id="emptyList" class="todo__emptyList">Your list is empty 😉</div>`;
        todoList.insertAdjacentHTML('afterbegin', emptyListHtml);
    } else {
        const emptyEl = document.querySelector('#emptyList');
        if (emptyEl) { emptyEl.remove(); }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('task', JSON.stringify(todoArray));
}