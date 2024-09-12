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
const toggleMenu = document.querySelector('.alternative-menu');
const sidepane = document.querySelector('.side-pane');

toggleMenu.addEventListener("click", function () {
  sidepane.classList.toggle("show-sidepane");
});


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
const deadlineInput = document.getElementById("deadline");
const addButton = document.querySelector(".task-btn-expanded");
const todoList = document.getElementById("right-list-container");
// const deleteButton = document.querySelector(".delete-btn");

//Initialize 
document.addEventListener("DOMContentLoaded", function() {        //Listen to events on the entire loaded DOM content
  addButton.addEventListener("click", addTask);                   //Run 'addTask' function when addButton is clicked
  taskInput.addEventListener("keydown", function (event) {        //Listen for any keyboard action. Pass the keydown as an event -> passed into the function as an argument
    if (event.key === "Enter") {
      event.preventDefault()                                      //Prevent the 'Enter' btn triggering a page reload/other default behaviour
      addTask();                                                  //Call the 'addTask' function
    }
  });
  // deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
}); 

function addTask() {
  const newTask = taskInput.value.trim();                         //Extract task title input + remove trailing white-space
  const newTaskDetails = detailsInput.value.trim();
  const deadline = deadlineInput.value;
  if (newTask !== "") {                                           //If the task input is not blank
    todo.push({
      'task-title': newTask,
      'task-description': newTaskDetails,
      deadline: deadline,
      disabled: false                                             //Every new task is enabled by default
    });
    saveToLocalStorage();                                        //A (not in-built) function that saves to local storage
    taskInput.value = "";
    detailsInput.value = "";

    // let currentDate = new Date();
    // date.innerHTML = currentDate.getDate();
    // month.innerHTML = currentDate.getMonth();
    // year.innerHtml = currentDate.getFullYear();
    // deadlineInput.value = `${date}/${month}/${year}`;
    deadlineInput.value = "";
    displayTasks();
  } else {
    alert("Please enter a task.");
  }
}

function deleteAllTasks() {
  // some logic
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const taskContainer = document.createElement("li"); 
    taskContainer.innerHTML = `
      <div class="task-container">
        <div class="task-row-1">
          <input type="checkbox" class="check-circle" id="input-${index}" ${item.disabled ? "checked" : ""}>
          <div id="todo-${index}" class="task-title ${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">
            ${item['task-title']};
          </div>
        </div>
        <div class="task-row-2">
          <div id="description-${index}" class="task-details ${item.disabled ? ".disabled-caption" : ""}" onclick="editTask(${index})">
            ${item['task-description']};
          </div>
          <div id="date-${index}" class="deadline-output ${item.disabled ? ".disabled-caption" : ""}" onclick="editTask(${index}])">
          ${item.deadline};
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

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}
  
function editTask() {
  // some logic
}

// // Gets task input and creates a new task as a list item
// function addTask() {
//   const taskInputBox = document.getElementById("task-input-box").value;
//   const detailsInputBox = document.getElementById("details-input-box").value;
//   const rightListContainer = document.getElementById("right-list-container");
//   const deadlineInput = document.getElementById("deadline").value;
 
//   if(document.getElementById("right-list-container").value == "") {
//     document.getElementById("right-grid-welcome").hidden = false;           //Hide welcome picture when new task is added
//   }
//   else{
//     document.getElementById("right-grid-welcome").hidden = true;            //Shows welcome picture when task list is empty
//   }
    
//   // rightListContainer.style.display = rightListContainer.style.display === 'none' ? rightListContainer.style.display === 'visible' : rightListContainer.style.display === 'visible';
//   const taskContainer = document.createElement("li");     //Create a new li called 'taskContainer'
//   rightListContainer.appendChild(taskContainer);          //Add 'taskContainer' to rightListContainer
//   taskContainer.setAttribute('class','task-container');   //Set class = task-container

//   const taskRow1 = document.createElement("div");        
//   taskContainer.appendChild(taskRow1);          
//   taskRow1.setAttribute('class','task-row-1');   

//   const taskRow2 = document.createElement("div");        
//   taskContainer.appendChild(taskRow2);          
//   taskRow2.setAttribute('class','task-row-2');   
  
//   const checkCircle = document.createElement("div");      //Create checkCircle as div
//   taskRow1.appendChild(checkCircle);                      //Add the checkCircle to the rightListContainer
//   checkCircle.setAttribute('class','check-circle')        //Set class of new div to 'check-circle'

//   const taskTitle = document.createElement("div");        //Create a new div called 'task'
//   taskRow1.appendChild(taskTitle);                        //Add 'task' to rightListContainer
//   taskTitle.textContent = taskInputBox;                   //Set content of 'task' to whatever is in the input box
//   taskTitle.setAttribute('class','task-title');           //Set class


//   //Add code here for adding details/deadline infor to taskRow2
//   const taskDetails = document.createElement("div");      //Details input box
//   taskRow2.appendChild(taskDetails);                        
//   taskDetails.textContent = detailsInputBox;                
//   taskDetails.setAttribute('class','task-details');           

//   const deadline = document.createElement("div");         //Deadline
//   taskRow2.appendChild(deadline);
//   deadline.textContent = deadlineInput;
//   deadline.setAttribute('class', 'deadline-output');
// } 

// function showSidepane() {
//   document.getElementsByClassName("side-pane").hidden = false;
// }
