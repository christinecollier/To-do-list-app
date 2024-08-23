// Gets current date and time
// const date = new Date();

// let minutes = date.getMinutes();
// let hours = date.getHours();
// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();

// let currentDate = `${day}-${month}-${year} ${hours}:${minutes}`;
// document.getElementById("month").textContent = currentDate;

// function date(){
//   let month = document.getElementById("month");
//   let day = document.getElementById("day");
//   let weekday = document.getElementById("weekday");

//   let currentDate = new Date();
//   month.innerHTML = currentDate.getMonth() + 1;
//   day.innerHTML = currentDate.getDate();
//   weekday.innerHTML = currentDate.getDay();
// }
// setInterval(function(){
//   date();
// },60000);


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
