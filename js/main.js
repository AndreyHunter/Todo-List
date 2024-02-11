const todoForm = document.querySelector('#todoForm');
const todoList = document.querySelector('#todoList');
const todoInput = document.querySelector('#todoInput');
const todoEmpty = document.querySelector('.todo__emptyList');


let todoArray = [];

todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', deleteTask);
todoList.addEventListener('click', doneTask);

if (localStorage.getItem('task')) {
    todoArray = JSON.parse(localStorage.getItem('task'))
    todoArray.forEach((task, index) => generateHTML(task, index + 1));
}

checkEmptyList();

function addTask(event) {
    event.preventDefault();

    const InputValule = todoInput.value;

    const taskInfo = {
        id: Date.now(),
        taskText: InputValule,
        done: false
    };

    if (InputValule === '') {return;}

    todoArray.push(taskInfo);

    saveToLocalStorage()
    generateHTML(taskInfo, todoArray.length);
    todoInput.value = '';
    todoInput.focus();
    checkEmptyList()
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') {return;}
     
    const parentEl = event.target.closest('li');
    const id = +parentEl.id;

    const index = todoArray.findIndex(task => task.id === id);
    todoArray.splice(index, 1);

    todoList.innerHTML = '';

    todoArray.forEach((task, index) => generateHTML(task, index + 1));

    saveToLocalStorage()
    parentEl.remove();
    checkEmptyList()
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') {return;}

    const parentEl = event.target.closest('li');
    const id = +parentEl.id;

    const task = todoArray.find(task => task.id === id);
    task.done = !task.done;

    saveToLocalStorage()
    const todoText = parentEl.querySelector('.todo__text');
    todoText.classList.toggle('todo__text-done');
    event.target.classList.toggle('buttonColor');
}

function generateHTML(data, index) {
    const cssClass = data.done ? 'todo__text todo__text-done' : 'todo__text';

        const taskHtml = `<li id="${data.id}" class="todo__item">
                            <span class="${cssClass}">${index}. ${data.taskText}</span>
                            <div class="todo__buttons-wrapper">
                                <button class="todo__button" data-action="done">
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
    if (todoArray.length === 0) {
        const emptyListHtml = `<div id="emptyList" class="todo__emptyList">Your list is empty 😉</div>`;
        todoList.insertAdjacentHTML('afterbegin', emptyListHtml);
    }

    if (todoArray.length > 0) {
        const EmptyEl = document.querySelector('#emptyList');
        EmptyEl ? EmptyEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('task', JSON.stringify(todoArray));
}