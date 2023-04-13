//game elements
var character = document.getElementById("character");
var game = document.getElementById("game");

//game variables
var interval;
var both = 0; //for avoiding pressing of both keys at the same time
var counter=0;
var currentBlocks = [];
var speed = 0.5;
var score = 0;
var temp = 0;
var charSpeed = 2;
var blocks;

function moveLeft(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left > 0){ //limits the ball path
        character.style.left = left - charSpeed + "px";
    }
}

function moveRight(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left < 380){ //limits the ball path
        character.style.left = left + charSpeed + "px";
    }
}

addEventListener('keydown', function (event) {
    if(both == 0){
        both++;
        if(event.key === "ArrowLeft"){
            interval = setInterval(moveLeft,1);
        }
        if(event.key === "ArrowRight"){
            interval = setInterval(moveRight,1);
        }
    }
});

addEventListener("keyup", () => {
    clearInterval(interval);
    both = 0;
});

function startGame(){
    setInterval(() => {
        var blockLast = document.getElementById("block"+(counter-1));
        var holeLast = document.getElementById("hole"+(counter-1));

        //getting previous blocks and holes position inorder to create new ones
        if(counter>0){
            var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
            var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
        }

        //creating new blocks and holes
        if(blockLastTop < 380 || counter==0){
            var block = document.createElement("div");
            var hole = document.createElement("div");
            block.setAttribute("class","block");
            hole.setAttribute("class","hole");
            block.setAttribute("id","block"+counter);
            hole.setAttribute("id","hole"+counter);

            block.style.top = blockLastTop + 100 + "px";
            hole.style.top = holeLastTop + 100 + "px";

            var random = Math.floor(Math.random() * 360);
            hole.style.left = random + "px";

            game.appendChild(block);
            game.appendChild(hole);

            currentBlocks.push(counter);
            counter++;
        }

        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        var drop = 0;
        
        //Game over
        if(characterTop < 5){
            window.alert('! Game Over !\nYour Score: '+score)
            clearInterval(blocks);
            window.location.reload();
        }
        
        for(var i=0;i<currentBlocks.length;i++){
            let current = currentBlocks[i];        

            let iblock = document.getElementById("block"+current);
            let ihole = document.getElementById("hole"+current);

            //getting the blocks and hole's respective position
            let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
            let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));

            //updating the position of the blockes and hole
            iblock.style.top = iblockTop - speed + "px";
            ihole.style.top = iblockTop - speed + "px";

            //removing them from the screen
            if(iblockTop < -25){
                currentBlocks.shift();
                iblock.remove();
                ihole.remove();
            }
            
            //checks where the ball is on the block
            if(iblockTop - 20 < characterTop && iblockTop > characterTop){
                drop++;

                //how smoothly the ball will be dropped near the hole and checks whether the ball is on the hole
                if(iholeLeft <= characterLeft && iholeLeft + 20 >= characterLeft){
                    drop = 0;
                    
                    //condition to increase score
                    var diff = Math.floor(parseInt(ihole.style.top) - speed) - (characterTop - charSpeed);
                    temp++;

                    if((diff <= (charSpeed + 1)) && (temp >= (7 - (charSpeed - 1)))){
                        score++;
                        temp = 0;
                        
                        //increasing score every five point
                        for(var i=5; i<=score; i+=5){
                            if((score%5 == 0) && (score >= i) && (score < (i+5))){
                                speed = speed + 0.1;
                            }
                        }

                        //increasing character speed after every 25 points
                        if(score%25 == 0){
                            charSpeed++;
                        }
                    }
                }
            }
            
            //slides the character on the blocks
            if(drop == 0){
                if(characterTop < 425){
                    character.style.top = characterTop + charSpeed + "px";
                }
            }

            //moves the character upwards
            else{
                temp=0;
                character.style.top = characterTop - speed + "px";
            }
        }
    }, 1);
    
}

startGame()
