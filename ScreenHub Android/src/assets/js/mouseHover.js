'use strict'

var cursor = document.querySelector(".follow-div");

document.addEventListener("mousemove", (e) => {

  var x = e.clientX;
  var y = e.clientY;

  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  
})