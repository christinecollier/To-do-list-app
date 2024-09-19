// Gets current time (hours and minutes)
function time(){
  let hrs = document.getElementById("hrs");
  let min = document.getElementById("min");

  let currentTime = new Date();
  hrs.innerHTML = currentTime.getHours().toString().padStart(2, '0');
  min.innerHTML = currentTime.getMinutes().toString().padStart(2, '0');
}
setInterval(function(){
  time();
},1000);


//Side-pane toggle functionality
// const toggleMenu = document.querySelector('.alternative-menu');
// const sidepane = document.querySelector('.side-pane');

// toggleMenu.addEventListener("click", function () {
//   sidepane.classList.toggle("show-sidepane");
// });


// var btn = document.querySelector('.alternative-menu');
// var btnst = true;
// btn.onclick = function() {
//   if(btnst == true) {
//     document.getElementById('side-pane').classList.add('show-sidepane');
//     btnst = false;
//   }else if(btnst == false) {
//     document.getElementById('side-pane').classList.remove('show-sidepane');
//     btnst = true;
//   }
// }

//Retrieve todo from local storage
let todo = JSON.parse(localStorage.getItem("todo")) || [];         //Turns string into object in a list/create a new list

const taskInput = document.getElementById("task-input-box");
const detailsInput = document.getElementById("details-input-box");
const highPriority = document.querySelector(".high-priority");
const midPriority = document.querySelector(".mid-priority");
const lowPriority = document.querySelector(".low-priority");
const deadlineInput = document.getElementById("deadline");
const addButton = document.querySelector(".task-btn-expanded");
const welcomeRight = document.getElementById("right-grid-welcome");
const todoList = document.getElementById("right-list-container");
// const deleteButton = document.querySelector(".delete-button");

//Remove RHS welcome when task container is not empty.
function checkWelcomeRight() {
  todo.length === 0 ? '' : welcomeRight.style.display = 'none'; 
}

//Initialize 
document.addEventListener("DOMContentLoaded", function() {        //Listen to events on the entire loaded DOM content
  addButton.addEventListener("click", addTask);                   //Run 'addTask' function when addButton is clicked
  taskInput.addEventListener("keydown", function (event) {        //Listen for any keyboard action. Pass the keydown as an event -> passed into the function as an argument
    if (event.key === "Enter") {
      event.preventDefault()                                      //Prevent the 'Enter' btn triggering a page reload/other default behaviour
      addTask();                                                  //Call the 'addTask' function
      checkWelcomeRight();
    }
  });
  // deleteButton.addEventListener("click", deleteTask);
  displayTasks();
  checkWelcomeRight();
}); 

function addTask() {
  const newTask = taskInput.value.trim();                         //Extract task title input + remove trailing white-space
  let newTaskDetails = detailsInput.value.trim();
  newTaskDetails === "" ? newTaskDetails = "" : "";
  let deadline = deadlineInput.value;
  deadline === "" ? deadline = "" : "";
  const priority = document.querySelector('input[name="priority"]:checked');
  let prioritySymbol;
  let priorityColor;
  let priorityLabel = priority.value;
  if (priority == null) {
    prioritySymbol = "";
  } else if (priority.value === 'Important') {
    prioritySymbol = '!';
    priorityColor = "var(--priority-pink)"
  } else if (priority.value === 'Ask about') {
    prioritySymbol = '?';
    priorityColor = "var(--priority-green)"
  } else if (priority.value === 'Starred') {
    prioritySymbol = '\u2605';
    priorityColor = "var(--priority-yellow)"
  }
  if (newTask !== "") {                                           //If the task input is not blank
    todo.push({
      'task-title': newTask,
      'task-description': newTaskDetails,
      'task-priority': prioritySymbol,
      'task-priority-label': priorityLabel,
      'priority-color': priorityColor,
      deadline: deadline,
      disabled: false                                             //Every new task is enabled by default
    });
    saveToLocalStorage();                                        //A (not in-built) function that saves to local storage
    taskInput.value = "";
    detailsInput.value = "";
    displayTasks();
    checkWelcomeRight();
    let priority = document.querySelector('input[name="priority"]');
    priority.checked = 'false';
  } else {
    alert("Enter a title for your task.");
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    if (item['task-description'] === "") {
      let shortTaskDescription = " ";
      item['shorter-description'] = shortTaskDescription;
    } else if (item['task-description'].length > 72) {
      let shortTaskDescription = `${item['task-description'].slice(0, 68)}...`;
      item['shorter-description'] = shortTaskDescription;
    } else {
      let shortTaskDescription = item['task-description'];
      item['shorter-description'] = shortTaskDescription;
    }
    const taskContainer = document.createElement("li"); 
    taskContainer.setAttribute('class', 'task-list-item')
    taskContainer.innerHTML = `
      <div class="task-container" onclick="viewTask(${index})">
        <div class="task-row-1">
          <input type="checkbox" class="check-circle" id="input-${index}" ${item.disabled ? "checked" : ""}>
          <div id="todo-${index}" class="task-title ${item.disabled ? "disabled" : ""}">
            ${item['task-title']}
          </div>
        </div>
        <div class="task-row-2">
          <div id="description-${index}" class="task-details ${item.disabled ? ".disabled-caption" : ""}">
            ${item['shorter-description']}
          </div>
          <div id="date-${index}" class="deadline-output ${item.disabled ? ".disabled-caption" : ""}">
            ${item.deadline}
          </div>
          <div id="priority-${index}" class="priority-output ${item.disabled ? "disabled-caption" : ""}">
          </div>
        </div>
      </div>
    `;
    let priorityColor = item['priority-color'];
    taskContainer.querySelector('.priority-output').style.background = priorityColor;
    taskContainer.querySelector(".check-circle").addEventListener("change", () => {
      toggleTask(index);                       //Toggle the task that has been checked off
    });
    todoList.appendChild(taskContainer);       //Add all of the newly created elements to todoList
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function editTitle(index) {
//Edit task title
  const existingTitle = document.querySelector('.edit-task-title');
  const newTitle = document.createElement('input');
  newTitle.value = todo[index]['task-title'];
  console.log(`${existingTitle} is the existing title`)
  existingTitle.replaceWith(newTitle);

  newTitle.focus();
  newTitle.addEventListener('blur', function () {
    const updatedTitle = newTitle.textContent.trim();
    if (updatedTitle) {
      todo[index]['task-title'] === updatedTitle;
      saveToLocalStorage();
    }
    displayTasks();
    viewTask();
  });
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function exitModal() {
  let gridContainer = document.querySelector('.grid-container');
  let leftContainer = document.querySelector('.left-container');
  let modalDocked = document.querySelector('.edit-task-modal-docked');
  let blurFilter = document.querySelector('.blur-filter');

  leftContainer.removeChild(modalDocked);
  gridContainer.removeChild(blurFilter);
}

function saveTask(index) {
  //some logic
  exitModal();
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
  exitModal();
}

function viewTask(index) {
  const wholeDocument = document.querySelector('.grid-container');
  const leftContainer = document.querySelector('.left-container')
  const blurFilter = document.createElement('div');
  blurFilter.setAttribute('class', 'blur-filter');

  if (document.querySelector('.edit-task-modal-docked') === null) {
    function createNewModal(index) {
      let editTaskModalDocked = document.createElement('div');
      editTaskModalDocked.setAttribute('class', 'edit-task-modal-docked');
      editTaskModalDocked.setAttribute('id', `docked-task-container-${index}`)

      let editTaskModalFloat = document.createElement('div'); 
      editTaskModalFloat.setAttribute('class', 'floating-task-modal-float');
      editTaskModalFloat.setAttribute('id', `floating-task-container-${index}`)

      wholeDocument.appendChild(blurFilter);
      leftContainer.appendChild(editTaskModalDocked);
      blurFilter.appendChild(editTaskModalFloat);
      let todoItem = todo[index];
      let taskTitle = todoItem['task-title'];
      let taskDescription = todoItem['task-description'];
      let taskPriorityLabel = todoItem['task-priority-label'];
      let deadline = todoItem.deadline;

      editTaskModalDocked.innerHTML = `
      <div id="modal-task-title-${index}" class="edit-task-title" onclick="editTitle(${index})">
        ${taskTitle}
      </div>
      <div id="modal-task-description-${index}" class="edit-task-description">
        ${taskDescription}
      </div>
      <div id="modal-deadline-${index}" class="edit-deadline">
        ${deadline !== "" ? `Deadline: ${deadline}` : ""}
      </div>
      <div class="priority-save-delete-wrapper">
        <div id="modal-priority-${index}" class="edit-priority-wrapper">
          <span>${taskPriorityLabel}</span>
        </div>
        <button id="save-${index}" class="save-button" onclick="saveTask(${index})">
          Save
        </button>
        <button id="delete-${index}" class="delete-button" onclick="deleteTask(${index})">
          Delete
        </button>
      </div>
    `;
    let editPriorityColor = todoItem['priority-color'];
    editTaskModalDocked.querySelector('.edit-priority-wrapper').style.background = editPriorityColor;
    editTaskModalFloat.innerHTML = editTaskModalDocked.innerHTML;
    let editTaskDescription = document.querySelector('.edit-task-description');
      if (taskDescription !== "") {
        editTaskDescription.style.margin = "1rem 0"
      } 
    }
    createNewModal(index);
  } else {
    let existingModalDocked = document.querySelector('.edit-task-modal-docked');
    let existingBlurFilter = document.querySelector('.blur-filter');
    let leftContainer = document.querySelector('.left-container');
    let gridContainer = document.querySelector('.grid-container');

    leftContainer.removeChild(existingModalDocked)
    gridContainer.removeChild(existingBlurFilter);
    viewTask(index)
  }
}
