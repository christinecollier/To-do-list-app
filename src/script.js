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
          <div id="todo-${index}" class="task-title ${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">
            ${item['task-title']}
          </div>
        </div>
        <div class="task-row-2">
          <div id="description-${index}" class="task-details ${item.disabled ? ".disabled-caption" : ""}" onclick="editTask(${index})">
            ${item['shorter-description']}
          </div>
          <div id="date-${index}" class="deadline-output ${item.disabled ? ".disabled-caption" : ""}" onclick="editTask(${index}])">
            ${item.deadline}
          </div>
          <div id="priority-${index}" class="priority-output ${item.disabled ? "disabled-caption" : ""}" onclick="editTask(${index})">
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

function editTask(index) {
  // const todoItem = document.getElementById(`todo-${index}`);
  // const existingTaskTitle = todo[index].text;
}

function saveTask(index) {
  //some logic
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
  let modalDocked = document.querySelector('.edit-task-container-docked');
  let modalFloat = document.querySelector('.edit-task-container-modal');
  let blurFilter = document.querySelector('.blur-filter');
  modalDocked.style.display = 'none';
  modalFloat.style.display = 'none';
  blurFilter.style.display = 'none';
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function viewTask(index) {
  const wholeDocument = document.querySelector('.grid-container');
  const leftContainer = document.querySelector('.left-container')
  const blurFilter = document.createElement('div');
  blurFilter.setAttribute('class', 'blur-filter');

  if (document.querySelector('.edit-task-container-docked') === null) {
    let editTaskContainerDocked = document.createElement('div');
    editTaskContainerDocked.setAttribute('class', 'edit-task-container-docked');
    let editTaskContainerModal = document.createElement('div'); 
    editTaskContainerModal.setAttribute('class', 'edit-task-container-modal');

    wholeDocument.appendChild(blurFilter);
    leftContainer.appendChild(editTaskContainerDocked);
    blurFilter.appendChild(editTaskContainerModal);

    todo.forEach((item, index) => {
      let taskTitle = item['task-title'];
      let taskDescription = item['task-description'];
      let taskPrioritySymbol = item['task-priority'];
      let taskPriorityLabel = item['task-priority-label'];
      let deadline = item.deadline;

      editTaskContainerDocked.innerHTML = `
      <div class="edit-task-title" onclick="editTask(${index})">
        ${taskTitle}
      </div>
      <div class="edit-task-description" onclick="editTask(${index})">
        ${taskDescription}
      </div>
      <div class="edit-deadline" onclick="editTask(${index})">
        Deadline: ${deadline}
      </div>
      <div class="priority-save-delete-wrapper">
        <div class="edit-priority-wrapper" onclick="editTask(${index})">
          <span>${taskPrioritySymbol}</span>
        </div>
        <button id="save-${index}" class="save-button" onclick="saveTask(${index})">
          Save
        </button>
        <button id="delete-${index}" class="delete-button" onclick="deleteTask(${index})">
          Delete
        </button>
      </div>
      `;
      let editpriorityColor = item['priority-color'];
      editTaskContainerDocked.querySelector('.edit-priority-wrapper').style.background = editpriorityColor;
      editTaskContainerModal.innerHTML = editTaskContainerDocked.innerHTML;
    });
  } else {
    console.log('Check conditional statement for displaying modal')
  }
}
