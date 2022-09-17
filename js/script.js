
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
        constructor(game){
            this.game = game;
            //We use the pointer function so that it will never forget that we use handler inside constuctor 
            window.addEventListener('keydown', e => {
                if(((e.key === 'ArrowUp') ||
                    (e.key === 'ArrowDown') ||
                    (e.key === 'ArrowLeft') ||
                    (e.key === 'ArrowRight'))
                && this.game.keys.indexOf(e.key) === -1){
                    //if they upkey is pressed and the upkey if not already in the array then it will push
                    this.game.keys.push(e.key);
                }
                else if (e.key === ' '){
                    this.game.player.shootTop();
                }

            })
            window.addEventListener('keyup', e =>{
            //indexOf() method returns the first index at which a given element can be found in the array,
            //or it will return -1 if the element is not present.
                if(this.game.keys.indexOf(e.key) > -1){
                    //if there is an instance of the key we will use the splice methods to remove it
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1)
                }

            })
        }
    }

    /*This will handle player lasers*/ 
    class Projectile{
        constructor(game, x , y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width =3;
            this.height =3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            //We are ensuring that the enemy is not destoyed outside the frame so we are macking the range 80% of the sceen.
            if(this.x > this.game.width*0.8) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
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
            this.speedY= 0;
            this.maxSpeed =3;
            this.projectiles =[];
        }

        //update() methods is to move the player around
        update(){
            if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            //We want all elements marked for deletion equal to false, .filter creates a new array 
            this.projectiles = this.projectiles.filter(projectiles => !this.projectiles.markedForDeletion)
        }
 
        //draw method to draw graphics representing the player.
        //First we are using the .fillRect to respent the player
        draw(context){
            context.fillStyle = 'black';
            context.fillRect(this.x, this.y, this.width, this.height)
            this.projectiles.forEach(projectile =>{
                projectile.draw(context);
            });
        }
        shootTop(){
            if(this.game.ammo > 0 ){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30))
                this.game.ammo--;
            }
        }
    }

    /*Enermy class will be the main blueprint handling many different enemy types*/ 
    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random()* - 1.5 - 0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
        }
        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'black'
            context.font = '20px Helvetica'
            context.fillText(this.lives, this.x, this.y);
        }
    }
    //Angler1 is a subclass of the Enemy class
    class Angler1 extends Enemy{
        constructor(game){
            super(game);
            this.width =228 * 0.2;
            this.height = 169 * 0.2;
            this.y = Math.random()* (this.game.height*0.9 - this.height);
        }

    }

    /*handle individul background layers in our paralax seamless scrolling multilayerbackground */ 
    class Layer{

    }
    /*Background will pull all animated layers together to animate the entire game world*/ 
    class Background{

    }

    /* UI class will draw score, timer and other information tha needs be displayed for the user*/
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize =25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
        draw(context){
            //.save method saves the lates canvas state, used with .restore method below.
            context.save();
            context.fillStyle = this.color;
            context.shadowOffSetX = 2;
            context.shadowOffSetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px' + this.fontFamily;
            //Score
            context.fillText('Score: '+ this.game.score, 20, 40);
            //this will draw a small bar with the amount of amo we currently have left

            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            //Game Over message
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.gameWinningScore){
                    message1 = 'You Win!';
                    message2 = 'Well done!';
                }
                else{
                    message1 = 'You Lose!';
                    message2 = 'Try again next time!';
                }
                context.font = '50px' + this.fontFamily;
                context.fillText(message1, this.game.width* 0.5, this.game.height*0.5-40);
                context.font = '25px' + this.fontFamily;
                context.fillText(message2, this.game.width* 0.5, this.game.height*0.5+40);
            } 
            //.restore restores the most resently store canvas state, used with .save method above
            context.restore();
        } 
    }

    /* Game class will bring all logic together */
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys=[];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore =10;
        }
        update(deltaTime){
            this.player.update();
            if (this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            }
            else{
                this.ammoTimer += deltaTime;
            }
           
            //will cycle through the enemy array and call the update method which will mark them for deletion
            this.enemies.forEach(enemy =>{
                enemy.update();

                //this comparison statment calles the collision function and if they are colliding markes them for deletion
                if(this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion= true;
                }
                this.player.projectiles.forEach(projectile =>{
                    if(this.checkCollision(projectile,enemy))
                    enemy.lives--;
                    projectile.markedForDeletion = true;
                    if(enemy.lives <=0){
                        enemy.markedForDeletion = true;
                        this.score += enemy.score;
                        if(this.score > this.winningScore) this.gameOver = true;
                    }
                })
            });
            // Will filter out all enemy objects that have markedforDeletion to true
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            //this is creating enemys if enemy timer is greater than the interval else stop and reset the timer.
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0 ;
            }
            else{
                this.enemyTimer += deltaTime;
            }
      
        }
        draw(context){
            this.player.draw(context);
            this.ui.draw(context)
            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });
        }
        addEnemy(){
            this.enemies.push(new Angler1(this));
        }
        checkCollision(rect1,rect2){
            return(
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            )
        }
        
    }

    //Instantiating a new instance of Game 
    const game = new Game(canvas.width, canvas.height);
    
    //We are working with the delta time to so that periodic events will run around the same time in an old or new machine.
    //lastTime variable will store the value of ths time stamp of the previous animation loop.
    let lastTime = 0;

    //animation loop
    /* requestAnimationFrame() method: tells the browser that we wish to perform an animation and it request that the browser
    calls a specified function to update an animation before the next repaint. So it takes in the method yo su want animate before the next
    repaint. We are passing the animet which is the name of the paren to create an endless animation loop*/
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        // This makes it so that the object travels down the page without leaving a trail of its old positions
        //So its deleting the previous rectangle.
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);

        //this method automatically passed a time stamp as an arguent the function it calls
        requestAnimationFrame(animate);
    }
    animate(0);
} )