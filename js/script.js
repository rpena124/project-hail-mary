
// adding event listner to the window so that it loads when all the elements are available to load
window.addEventListener('load',function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    //Drawing context, a built in object that contians all the methods and properties that allow us to draw and animate colors shapes and other HTML graphics.
    const ctx = canvas.getContext('2d');
    //setup the canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

} )