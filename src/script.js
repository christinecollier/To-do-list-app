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
// const priorityInput = document.getElementById("priority-row")
const deadlineInput = document.getElementById("deadline");
const addButton = document.querySelector(".task-btn-expanded");
const welcomeRight = document.getElementById("right-grid-welcome");
const todoList = document.getElementById("right-list-container");
// const deleteButton = document.querySelector(".delete-button");

//Remove RHS welcome when task container is not empty.
function checkWelcomeRight() {
  todo.length === 0 ? '' : welcomeRight.style.display = 'none'; 
}

function changeTaskContainerWidth() {
  let taskListItem = document.getElementsByClassName("task-list-item");
  if (todo.length > 1) {
    taskListItem.classList.add('narrow');
  }
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
  const newTaskDetails = detailsInput.value.trim();
  // const priority = priorityInput.value;
  const deadline = deadlineInput.value;
  if (newTask !== "") {                                           //If the task input is not blank
    todo.push({
      'task-title': newTask,
      'task-description': newTaskDetails,
      // 'task-priority': priority,
      deadline: deadline,
      disabled: false                                             //Every new task is enabled by default
    });
    saveToLocalStorage();                                        //A (not in-built) function that saves to local storage
    taskInput.value = "";
    detailsInput.value = "";
    displayTasks();
    checkWelcomeRight();
    // closeEditTask()
  } else {
    alert("Enter a title for your task.");
  }
}

function deleteTask() {
  // some logic
  // checkWelcomeRight();
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    if (item['task-description'] === "") {
      let shortTaskDescription = " ";
      todo[index]['shorter-description'] = shortTaskDescription;
    } else if (item['task-description'] !== "" && item['task-description'].length > 72) {
      let shortTaskDescription = `${item['task-description'].slice(0, 68)}...`;
      todo[index]['shorter-description'] = shortTaskDescription;
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
        </div>
      </div>
    `;
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

function saveTask(index) {
  //some logic
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function viewTask(index) {
  const wholeDocument = document.querySelector('.grid-container');
  const leftContainer = document.querySelector('.left-container')
  const blurFilter = document.createElement('div');
  blurFilter.setAttribute('class', 'blur-filter');

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
    // let taskPriority = item['task-priority'];
    let deadline = item.deadline;

    editTaskContainerDocked.innerHTML = `
    <div class="edit-task-title">
      ${taskTitle}
    </div>
    <div class="edit-task-description">
      ${taskDescription}
    </div>
    <div class="edit-deadline">
      Deadline: ${deadline}
    </div>
    <button id="save-${index}" class="save-button" onclick="saveTask(${index})">
      Save
    </button>
    <button id="delete-${index}" class="delete-button" onclick="deleteTask(${index})">
      Delete
    </button>
    </div>
    `;
    editTaskContainerModal.innerHTML = editTaskContainerDocked.innerHTML;
  });
}

function closeEditTask() {
  //if mouse clicks 'close' button or task is 'saved'
  //remove the container from the DOM
  // editTaskContainer.remove();
}

function editTask() {
  // some logic
}

if (todoList === "") {
  welcomeRight.style.display = 'block'; 
} 

// // Gets task input and creates a new task as a list item
// function addTask() {
//   if(document.getElementById("right-list-container").value == "") {
//     document.getElementById("right-grid-welcome").hidden = false;
//   }
//   else{ 
//     document.getElementById("right-grid-welcome").hidden = true;
//   }
// } 

// function showSidepane() {
//   document.getElementsByClassName("side-pane").hidden = false;
// }
