
// adding event listner to the window so that it loads when all the elements are available to load
window.addEventListener('load',function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    //Drawing context, a built in object that contians all the methods and properties that allow us to draw and animate colors shapes and other HTML graphics.
    const ctx = canvas.getContext('2d');
    //setup the canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

    //<==========Classes===========>

    /*
    This class will keep track of specified user inputs ie. arrow keys, this class be used ino ther 
    classes so it needs to be declaired first.
    */
    class InputHandler{

    }

    /*This will handle player lasers*/ 
    class Projectile{

    }
    /*deal with falling screws and bolts that some from damaged enemy */ 
    class Particle{

    }

    /*Player class will control the main character, it will control player sprite sheet.
        its good practise to make the sprite the same height and width that they will be displayed
        in the game.
    */ 
    class Player{
        constructor(game){
            this.game =game;
            this.width = 120;
            this.height = 190;
            this.x=20;
            this.y=100;
            this.speedY=0;
        }

        //update() methods is to move the player around
        update(){
            this.y += this.speedY;
        }

        //draw method to draw graphics representing the player.
        //First we are using the .fillRect to respent the player
        draw(context){
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    /*Enermy class will be the main blueprint handling many different enemy types*/ 
    class Enemy{

    }

    /*handle individul background layers in our paralax seamless scrolling multilayerbackground */ 
    class Layer{

    }
    /*Background will pull all animated layers together to animate the entire game world*/ 
    class Background{

    }

    /* UI class will draw score, timer and other information tha needs be displayed for the user*/
    class UI{

    }

    /* Game class will bring all logic together */
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
        }
        update(){
            this.player.update();
        }
        draw(context){
            this.player.draw(context);
        }
    }

    //Instantiating a new instance of Game 
    const game = new Game(canvas.width, canvas.height);
    
    //animation loop
    /* requestAnimationFrame() method: tells the browser that we wish to perform an animation and it request that the browser
    calls a specified function to update an animation before the next repaint. So it takes in the method you want animate before the next
    repaint. We are passing the animet which is the name of the paren to create an endless animation loop*/
    function animate(){
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
} )