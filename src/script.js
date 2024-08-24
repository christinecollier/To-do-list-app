// Gets current time (hours and minutes)
function time(){
  let hrs = document.getElementById("hrs");
  let min = document.getElementById("min");

  let currentTime = new Date();
  hrs.innerHTML = currentTime.getHours();
  min.innerHTML = currentTime.getMinutes().toString().padStart(2, '0');
}
setInterval(function(){
  time();
},1000);


// function addTask() {
// const taskInputBox = document.getElementsByClassName("task-input-box");
// const rightListContainer = document.getElementsByClassName("right-list-container");

//   if(taskInputBox.value === '') {
//     alert("Task title empty");
//   }
//   else {
//     let li = document.createElement('li');
//     document.getElementsByClassName("task-1").textContent = taskInputBox;
//     document.
//   }
// }


function addTask() {
const taskInputBox = document.getElementById("task-input-box").value;
const rightListContainer = document.getElementById("right-list-container");
const task = document.createElement("li");
rightListContainer.appendChild(task);
task.textContent = taskInputBox;
}
// function checkUncheck() {
//   const button = document.getElementsByTagName('button').style.backgroundColor = '#7733ff';
// }

