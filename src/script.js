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
  let priorityLabel;
  let priorityColor;

  if (priority == null || priority.value === 'no-priority') {
    prioritySymbol = '';
    priorityLabel = '';
    priorityColor = '';
  } else if (priority.value === 'Important') {
    prioritySymbol = '!';
    priorityLabel = priority.value;
    priorityColor = "var(--priority-pink)"
  } else if (priority.value === 'Ask about') {
    prioritySymbol = '?';
    priorityLabel = priority.value;
    priorityColor = "var(--priority-green)"
  } else if (priority.value === 'Starred') {
    prioritySymbol = '\u2605';
    priorityLabel = priority.value;
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
      <div class="task-container">
        <div class="task-row-1">
          <input type="checkbox" class="check-circle" id="input-${index}" ${item.disabled ? "checked" : ""}>
          <div id="todo-${index}" class="task-title ${item.disabled ? "disabled" : ""}" onclick="viewTask(${index})">
            ${item['task-title']}
          </div>
        </div>
        <div class="task-row-2" onclick="viewTask(${index})">
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
  const existingTitleCheckContainer = document.getElementById(`title-check-${index}`);
  const existingTitleContainer = document.getElementById(`modal-task-title-${index}`);
  const existingTitleText = todo[index]['task-title'];
  const newTitleContainer = document.createElement('input');
  newTitleContainer.setAttribute('class', 'new-task-title');
  newTitleContainer.maxLength = 40;
  newTitleContainer.value =  existingTitleText;

  existingTitleCheckContainer.replaceChild(newTitleContainer, existingTitleContainer);
  todo[index]['task-title'] = newTitleContainer.value;

  newTitleContainer.focus();
  const saveBtn = document.querySelector('.save-button');
  saveBtn.style.display = 'flex';
  const deleteBtn = document.querySelector('.delete-button');
  deleteBtn.style.marginLeft = '0';

  newTitleContainer.addEventListener('blur', function () {
    newTitleContainer.style.border = 'none';
    function saveAndClose() {
      const saveButton = document.getElementById(`save-${index}`);
      saveButton.addEventListener('click', function () {
        const updatedTitle = newTitleContainer.value.trim();
        if (updatedTitle) {
          todo[index]['task-title'] === updatedTitle;
          saveToLocalStorage();
        } else {
          newTitleContainer.value =  existingTitleText;
        }
        saveToLocalStorage();
        displayTasks();
        viewTask();
      });
    }
    if (newTitleContainer.value === "") {
      newTitleContainer.value = existingTitleText;
      saveAndClose();
    } else {
      saveAndClose();
    }
  });
}

function editDescription(index) {
  const modalContainer = document.getElementById(`docked-task-container-${index}`);
  const existingDescriptionContainer = document.getElementById(`modal-task-description-${index}`);
  const existingDescriptionText = todo[index]['task-description'];
  const newDescriptionContainer = document.createElement('div');
  newDescriptionContainer.setAttribute('class', 'new-task-description-container');
  const newDescriptionTextarea = document.createElement('textarea');
  newDescriptionTextarea.setAttribute('class', 'new-task-description');
  newDescriptionTextarea.maxLength = 130;

  newDescriptionTextarea.value =  existingDescriptionText;
  modalContainer.replaceChild(newDescriptionContainer, existingDescriptionContainer);
  newDescriptionContainer.appendChild(newDescriptionTextarea);
  todo[index]['task-description'] = newDescriptionTextarea.value;
  newDescriptionTextarea.focus();

  const saveBtn = document.querySelector('.save-button');
  saveBtn.style.display = 'flex';
  const deleteBtn = document.querySelector('.delete-button');
  deleteBtn.style.marginLeft = '0';

  newDescriptionTextarea.addEventListener('blur', function() {
    function saveAndClose() {
      const saveButton = document.getElementById(`save-${index}`);
      saveButton.addEventListener('click', function () {
        const updatedDescription = newDescriptionTextarea.value.trim();
        if (updatedDescription) {
          todo[index]['task-description'] = updatedDescription;
          saveToLocalStorage();
        } else {
          newDescriptionTextarea.value =  existingDescriptionText;
        }
        saveToLocalStorage();
        displayTasks();
        exitModal();
      });
    }
    if (newDescriptionTextarea.value === "") {
      newDescriptionTextarea.value = existingDescriptionText;
      saveAndClose();
    } else {
      saveAndClose();
    }
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
        <div class="edit-title-check-container" id="title-check-${index}">
          <div id="modal-task-title-${index}" class="edit-task-title" onclick="editTitle(${index})">
            ${taskTitle}
          </div>
          ${todoItem.disabled ? `<div id="check-${index}" class="edit-check">\u2713</div>` : ''}
        </div>
        <div id="modal-task-description-${index}" class="edit-task-description" onclick="editDescription(${index})">
          ${taskDescription}
        </div>
        <div id="modal-deadline-${index}" class="edit-deadline">
          ${deadline !== "" ? `Deadline: ${deadline}` : ""}
        </div>
        <div class="priority-save-delete-wrapper">
          <div id="modal-priority-${index}" class="edit-priority-wrapper">
            <span>${taskPriorityLabel}</span>
          </div>
          <button id="save-${index}" class="save-button">
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
