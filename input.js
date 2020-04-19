
document.addEventListener('mousemove', function(event){
  inputData.mouse.x = event.clientX;
  inputData.mouse.y = event.clientY;

});
document.addEventListener('mousedown',function(event){
  if(event.button == 0)
    inputData.lmb = true;
  if(event.button == 2)
    event.preventDefault();
    inputData.rmb = true;
});
document.addEventListener('mouseup',function(event){
  if(event.button == 1)
    inputData.mmb = false;
  if(event.button == 0)
    inputData.lmb = false;
  if(event.button == 2)
    inputData.rmb = false;
});
document.addEventListener('keydown',function(event){
  switch(event.keyCode){
    case 87: //W
      inputData.up = true;
      event.preventDefault();
      break;
    case 83: //s
      inputData.down = true;
      break;
    case 65: //A
      inputData.left = true;
      break;
    case 68: //D
      inputData.right = true;
      break;
    case 32: //space
      if(active==false) reset();
  }
});
document.addEventListener('keyup',function(event){
  switch(event.keyCode){
    case 87: //W
      inputData.up = false;
      break;
    case 83: //S
      inputData.down = false;
      break;
    case 65: //A
      inputData.left = false;
      break;
    case 68: //D
      inputData.right = false;
      break;
  }
});
