import { v4 as uuidV4 } from 'uuid'

type Todo = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date
}

const listElement = document.querySelector<HTMLUListElement>('#list')
const formElement = document.querySelector<HTMLFormElement>('#todo-form')
const inputElement = document.querySelector<HTMLInputElement>('#todo-title')
const templateElement = document.querySelector<HTMLTemplateElement>('#todo-item-template')
const LOCAL_STORAGE_KEY = 'TYPESCRIPT_TODO_LIST'
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_KEY}-todos`
let todos: Todo[] = loadTodos()

todos.forEach(renderTodo)
console.log(listElement)

formElement?.addEventListener('submit', e => {
  e.preventDefault()
  if (inputElement?.value === '' || inputElement?.value == null) return
  const newTodo: Todo = {
    id: uuidV4(),
    title: inputElement.value,
    completed: false,
    createdAt: new Date()
  }
  todos.push(newTodo)
  saveTodos()
  renderTodo(newTodo)
  inputElement.value = ''
})

function renderTodo(todo: Todo) {
  if (templateElement == null) return console.error('No Todo Template')
  const templateClone = templateElement.content.cloneNode(true) as HTMLTemplateElement
  const listItemElement = templateClone.querySelector<HTMLLIElement>('.todo-item')
  const checkboxElement = templateClone.querySelector<HTMLInputElement>('[data-todo-item-checkbox]')
  const textElement = templateClone.querySelector<HTMLTextAreaElement>('[data-todo-item-text]')
  const buttonElement = templateClone.querySelector<HTMLButtonElement>('[data-button-delete]')
  if (listItemElement == null || checkboxElement == null || textElement == null || buttonElement == null) return
  listItemElement.dataset.todoId = todo.id
  checkboxElement.checked = todo.completed
  textElement.innerText = todo.title
  buttonElement.innerText = 'Delete'
  listElement?.append(templateClone)

  checkboxElement.addEventListener('change', () => {
    todo.completed = checkboxElement.checked
    saveTodos()
  })

  buttonElement.addEventListener('click', e => {
    const parent = (e.target as HTMLElement).closest('.todo-item')
    todos = todos.filter(t => t.id !== todo.id)
    parent?.remove()
    saveTodos()
  })
}

function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

function loadTodos(): Todo[] {
  const todosJSON = localStorage.getItem(TODOS_STORAGE_KEY)
  if (todosJSON == null) return []
  return JSON.parse(todosJSON)
}