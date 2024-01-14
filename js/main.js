// Находим элементы на странице
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')

let tasks = []

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

// Функция добавления задачи
function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault()

    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Добавляем новую задачу в массив задач
    tasks.push(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    // Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
}

// Функция удаления задачи
function deleteTask(event) {

    // Проверяем что клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return

    const parentNode = event.target.closest('.list-group-item')

    // Удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== +parentNode.id)

    saveToLocalStorage()

    // Удаляем задачу из разметки
    parentNode.remove()

    checkEmptyList()
}

// Функция выполнения задачи
function doneTask(event) {

    // Проверяем что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return

    const parentNode = event.target.closest('.list-group-item')

    // Получаем задачу из массива задач
    const task = tasks.find((task) => task.id == parentNode.id)

    // Проставялем признаку done обратное значение
    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
}

// Функция проверки пустоты массива задач
function checkEmptyList() {

    if (tasks.length == 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>
        `

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}

// Сохранение массива задачи в localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Отображение записи в списке задач
function renderTask(task) {
    // Формируем CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    // Формируем разметку новой задачи
    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>
    `

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}