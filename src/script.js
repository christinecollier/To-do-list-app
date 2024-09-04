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

// let btn = document.querySelector("#task-btn");
// let welcome = document.querySelector("#right-grid-welcome");
// btn.addEventListener("click", e => {  
//   welcome.classList.add("removed");
// });
// welcome.addEventListener("transitionend", () => 
// {
//   welcome.remove();
// })

// Gets task input and creates a new task as a list item
function addTask() {
  const taskInputBox = document.getElementById("task-input-box").value;
  const rightListContainer = document.getElementById("right-list-container");
  const deadlineInput = document.getElementById("deadline").value;
 
  if(document.getElementById("right-list-container").value == "") {
    document.getElementById("right-grid-welcome").hidden = false;           //Hide welcome picture when new task is added
  }
  else{
    document.getElementById("right-grid-welcome").hidden = true;            //Shows welcome picture when task list is empty
  }
  
  // document.getElementById("task-input-box").textContent = "";
  // document.getElementsByClassName("details-input-box").value = "";
  
  const taskContainer = document.createElement("li");     //Create a new li called 'taskContainer'
  rightListContainer.appendChild(taskContainer);          //Add 'taskContainer' to rightListContainer
  taskContainer.setAttribute('class','task-container');   //Set class = task-container

  const taskRow1 = document.createElement("div");        
  taskContainer.appendChild(taskRow1);          
  taskRow1.setAttribute('class','task-row-1');   

  const taskRow2 = document.createElement("div");        
  taskContainer.appendChild(taskRow2);          
  taskRow2.setAttribute('class','task-row-2');   
  
  const checkCircle = document.createElement("div");      //Create checkCircle as div
  taskRow1.appendChild(checkCircle);                      //Add the checkCircle to the rightListContainer
  checkCircle.setAttribute('class','check-circle')        //Set class of new div to 'check-circle'

  const taskTitle = document.createElement("div");        //Create a new div called 'task'
  taskRow1.appendChild(taskTitle);                        //Add 'task' to rightListContainer
  taskTitle.textContent = taskInputBox;                   //Set content of 'task' to whatever is in the input box
  taskTitle.setAttribute('class','task-title');           //Set class


  //Add code here for adding details/deadline infor to taskRow2
  const deadline = document.createElement("div");
  taskRow2.appendChild(deadline);
  deadline.textContent = deadlineInput;
  deadline.setAttribute('class', 'deadline-output');
} 

function showSidepane() {
  document.getElementsByClassName("side-pane").hidden = false;
}
