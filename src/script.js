// Gets current date and time
// const date = new Date();

// let minutes = date.getMinutes();
// let hours = date.getHours();
// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();

// let currentDate = `${day}-${month}-${year} ${hours}:${minutes}`;
// document.getElementById("date-time").textContent = currentDate;


function time(){
    var date = new Date();    
    var time = date.toLocaleTimeString();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var day = date.toLocaleDateString('en-US',options);
    document.getElementById('time').innerHTML = time;
    document.getElementById('day').innerHTML = day;
  }
  setInterval(function(){
    time();
  },1000);