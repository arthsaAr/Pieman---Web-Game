// Written on | Windows 10 OS | VS Code Editor | Live Server Ran on Opera GX Browser - PieMan Web Game

$(document).ready(function()                                                            //using this Jquery method to only run rest of the code if all the DOM objects are fully loaded
{
    var score = 0;                                                                      //initializing the score to 0 at the beggining of our game
    var pelletTimeout;
    var pellettimer = 15000;                                                            //initializing the lifespan for out pellets to 15 seconds at the beggining of the game
    var pelletdecreasing = 0.95;                                                        //initializing 0.95 to the pelletdecreasing so that we can later use it to reduce the lifespan by 95% for the future pellets
    var gameover = false;
    var activepellets = 0;                                                              //checking how many active pellets are currently in the screen

    $('.pellet').hide();                                                                //hiding my .pellet class at the beggining of the game from the screen
    $('.pellet').first().remove();                                                      //removing the first element of the .pellet class which always appears at the top left corner of the screen by default


    function pelletspawn(ifeaten)                                                       //function for spawining the pellets by passing a boolean value 'ifeaten'
    {
        if(ifeaten)                                                                     //running the spawning condition only if 'ifeaten' is true
        {
            var pellet = $('<div class="pellet"></div>');                               //storing the div element with class pellet to the var pellet
            //adding the left and top property to the css of .pellet class.
            pellet.css({
                'left': Math.random() * ($(window).width() - 10),                       //setting the left(value) position of the pellet at a random location withrespect to the width of the window
                'top': Math.random() * ($(window).height() - 10)                        //setting the top(value) position of the pellet at a random location withrespect to the height of the window
                });
    
        $('.PieGame').append(pellet);                                                   //adding the changed values of the left and top properties of a new pellet spawned to our main piegame
        activepellets++;                                                                //increasing the active pellets on the screen after each append function runs
        //setting the time for the newly spawned pellet so that it disappears after fixed amount of time
        pelletTimeout = setTimeout(function() {
            pellet.remove();                                                            //removing the pellet when time is finished
            activepellets--;                                                            //decreasing the activepellets count from the screen when any pellet is removed after their lifespan ends
            checkgameover();                                                            //also checking if the game is over, incase there is no more pellets left in the screen which will ultimately trigger the gameover
        }, pellettimer);                                                                //pellettimer is the total time our pellet will remain in the screen
        };
    };

    pelletspawn(false);                                                                 //setting the pelletspawn to false at the beggining to avoid any extra/unnecessary spawn of the pellets

    //function to check if the game is over
    function checkgameover() {
        if (pellettimer <= 0 || $('.pellet').length === 0)                              //checking if the game is over if the pellet timer reduces to less than 0 and there are no more pellets getting spawned on the screen
        {
            clearInterval(moveID);                                                      //stopping the continous change of images on the pieman after the game is over
            clearInterval(intervalID);                                                  //
            $('.pelletCount').text('GAME OVER!!! - FINAL SCORE: ' + score);             //adding the gameover text and final score to the text of class pelletcount after the game is over
            //modifying the css of the class .pelletcount to aligh the text to the center of the screen and stop everything in the screen to pause where they currently are
            $('.pelletCount').css({
                'display': 'flex',
                'justify-content': 'center',
                'top': '50%',
                'left': '50%',
                'z-index': '9999'
            });
            //setting the gameover to true after finishing all the needed change for the game over and screen pauses
            gameover = true;
        }
    };

    function scoreupdate()                                                              //function to continously update the score when the pieman eats any pellet in the screen
    {
        $('.pelletCount').text('Pellet Count: ' + score);                               //changing the text of the class .pelletcount by updating the score each time
    };

    //function to update and change some elements when piecharacter eats any pellet on the screen
    function eatPellet() {

        score++;                                                                        //increasing the score by 1 each time pieman eats ay pellet
        scoreupdate();                                                                  //updating the score as soon as the new score is found
        pellettimer*= pelletdecreasing;                                                 //decreasing the pellettimer/lifespan of the pellet by 95% for the next future pellet that is going to spawn
        pelletspawn(true);                                                              //spawning 1st pellet after pieman eats any pellet
        pelletspawn(true);                                                              //spawning 1st pellet after pieman eats any pellet
    };

    //function to check for collision of our pieman with the pellets
    function pelletCollision() {
        var pieChr = $('#piechr');                                                      //assigning the div element with id of piechr to our variable pieChr
        var pellet = $('.pellet');                                                      //assigning the div element with class pellet to our pellet variable
        //running a condition for each of the pellet
        pellet.each(function() {
            var pellets = $(this);
            var pieChrPos = {
                x: pieChr.offset().left + pieChr.width() / 2,
                y: pieChr.offset().top + pieChr.height() / 2
            };                                                                          //finding the center of the pieman and taking it's x and y coordinated respectively by taking average of the distance of pieman from left and the inner width of the pieman

            var pelletPos = {
                x: pellets.offset().left + pellets.width() /2,
                y: pellets.offset().top + pellet.height() / 2
            };                                                                          //finding the center of the pellet and taking it's x and y coordinated respectively by taking average of the distance of pellet from left and the inner width of the pellet

            var distance = Math.sqrt(Math.pow(pieChrPos.x - pelletPos.x, 2) + Math.pow(pieChrPos.y - pelletPos.y, 2));      //finding the distance between two coordinates of pieman and pellet using distance between two points formula i.e rootunder(x2-x1)^2+(y2-y2)2

            if ( distance < pieChr.width() / 2 + pellets.width() / 2)                   //creating a condition to check if distance is less than sum of radius of pellet and pieman
            {
                pellets.remove();                                                       //removing the pellet if the collision is detected and pellet is eaten by the pieman
                eatPellet();                                                            //running the eatpellet function that we created earlier after the pellet is removed and again two new pellets are created
            }
        });
    };

var intervalID;                                                                         //creatine intervalID to store the continously changing images in the pieman in specific direction of the keypress
var moveID;                                                                             //creating a moveID variable for storing the continous movement of the pieman

function moveleft()                                                                     //creating moveleft function to continously move the pieman in left direction  
{
    clearInterval(moveID);                                                              //clering any old interval if exists before running a new setinterval function for specific direction
    
    //moving my pieman with an id piechr by 10px distance in left direction every 100ms using the setInterval() function
    moveID = setInterval(function() {
        var pieChr = $('#piechr');
        var position = pieChr.position();
        var dist = 10;
        pieChr.css('left', Math.max(position.left - dist, 0));
        pelletCollision();
    }, 100);
};

function moveup()                                                                       //creating moveup function to continously move the pieman in upward direction
{
    clearInterval(moveID);                                                              //clearing any old interval if exists before running a new setinterval function for specific direction
    
    //moving my pieman with an id piechr by 10px distance in upward direction every 100ms using the setInterval() function
    moveID = setInterval(function() {
        var pieChr = $('#piechr');
        var position = pieChr.position();
        var dist = 10;
    pieChr.css('top', Math.max(position.top - dist, 0));
    pelletCollision();
    }, 100);
};

function moveright()                                                                    //creating moveright function to continously move the pieman in right direction
{
    clearInterval(moveID);                                                              //clearing any old interval if exists before running a new setinterval function for specific direction
    
    //moving my pieman with an id piechr by 10px distance to right direction every 100ms using the setInterval() function
    moveID = setInterval(function() {
        var pieChr = $('#piechr');
        var position = pieChr.position();
        var dist = 10;
    pieChr.css('left', Math.min(position.left + dist, $(window).width() - 50));
    pelletCollision();
    }, 100);
};

function movedown()                                                                     //creating movedown function to continously move the pieman in downward direction
{
    clearInterval(moveID);                                                              //clearing any old interval if exists before running a new setinterval function for specific direction
    
    //moving my pieman with an id piechr by 10px distance to down direction every 100ms using the setInterval() function
    moveID = setInterval(function() {
        var pieChr = $('#piechr');
        var position = pieChr.position();
        var dist = 10;
    pieChr.css('top', Math.min(position.top + dist, $(window).height() - 50));
    pelletCollision();
    }, 100);
};

    $(document).keydown(function(e)                                                     //attaching an event handler to the keydown event of the document object containing information about which keys are pressed
    {
        if(gameover) return;                                                            //if our game is already over, returning nothing to the game window so that the game pauses and we display our ending message
        clearInterval(intervalID);                                                      //clearing interval with 'intervalID' value to stop changing images if this function was initially running
        clearInterval(moveID);                                                          //clearning interval with 'moveID' value to stop moving the pieman in anydirection if it was initially moving

        var pieChr = $('#piechr');                                                      //assighning pieman to the piechr variable
        var position = pieChr.position();                                               //assigning the position of my pieman to the position variable for making it easy to update the position later in the event handler
        var dist = 10;                                                                  //initializing the distance of 10 to my dist variable 


        switch (e.keyCode)                                                              //creating a switch condition for running a specific code when a certain key is pressed in keyboard
        {
            case 37:                                                                    //Case for left direction
                pieChr.css('left', Math.max(position.left - dist, 0));
               //making an array and storing the names of all the left images that i want to loop through to create an animation effect in my pieman
                var imageleft = ["Left01.PNG", "Left02.PNG", "Left03.PNG", "Left04.PNG", "Left05.PNG", "Left06.PNG", "Left07.PNG", "Left08.PNG", "Left09.PNG", "Left10.PNG", "Left11.PNG", "Left12.PNG",];
                var currentIndexL = 0;                                                  //Setting currentindex for the array with left faced images to 0 to start the loop from the first image
                intervalID = setInterval(function() {
                    //condition for looping through all the items of imageleft array and use those respective images as background for our pieman when left key is pressed
                    if( currentIndexL == imageleft.length) {
                        currentIndexL = 0;
                    }
                    pieChr.css('background-image', 'url("images/' + imageleft[currentIndexL++] + '")')
                }, 70);                                                                 //running the imagechanging loop(setinterval() function) in a fixed interval of 70ms to change the image and loop through the array for different images

                moveleft();                                                             //once the image starts to change in fixed interval, calling moveleft function to move the pieman in the left direction when left arrow key is pressed
                break;                                                                  //breaking out of the case
            case 38:                                                                    //Case for Up direction
                pieChr.css('top', Math.max(position.top - dist, 0));
               //making an array and storing the names of all the Upward images that i want to loop through to create an animation effect in my pieman
                var imageup = ["Up01.PNG", "Up02.PNG", "Up03.PNG", "Up04.PNG", "Up05.PNG", "Up06.PNG", "Up07.PNG", "Up08.PNG", "Up09.PNG", "Up10.PNG", "Up11.PNG", "Up12.PNG"];
                var currentIndexU = 0;                                                  //Setting currentindex for the array with Upward faced images to 0 to start the loop from the first image
                intervalID = setInterval(function() {
                    //condition for looping through all the items of imageup array and use those respective images as background for our pieman when Up key is pressed
                    if( currentIndexU == imageup.length) {
                        currentIndexU = 0;
                    }
                    pieChr.css('background-image', 'url("images/' + imageup[currentIndexU++] + '")')
                }, 70);                                                                 //running the imagechanging loop(setinterval() function) in a fixed interval of 70ms to change the image and loop through the array for different images
                
                moveup();                                                               //once the image starts to change in fixed interval, calling moveup function to move the pieman in the upward direction when up arrow key is pressed
                break;                                                                  //breaking out of the case
            case 39:                                                                    //Case for Right direction
                pieChr.css('left', Math.min(position.left + dist, $(window).width() - 50));
                //making an array and storing the names of all the Right turned images that i want to loop through to create an animation effect in my pieman
                    var imageright = ["Right01.PNG", "Right02.PNG", "Right03.PNG", "Right04.PNG", "Right05.PNG", "Right06.PNG", "Right07.PNG", "Right08.PNG", "Right09.PNG", "Right10.PNG", "Right11.PNG", "Right12.PNG"];
                    var currentIndexR = 0;                                              //Setting currentindex for the array with right faced images to 0 to start the loop from the first image
                    intervalID = setInterval(function() {
                        //condition for looping through all the items of imageright array and use those respective images as background for our pieman when right key is pressed
                        if( currentIndexR == imageright.length) {
                            currentIndexR = 0;
                        }
                        pieChr.css('background-image', 'url("images/' + imageright[currentIndexR++] + '")')
                    }, 70);                                                             //running the imagechanging loop(setinterval() function) in a fixed interval of 70ms to change the image and loop through the array for different images

                    moveright();                                                        //once the image starts to change in fixed interval, calling moveright function to move the pieman in the right direction when right arrow key is pressed
                break;                                                                  //breaking out of the case
            case 40:                                                                    //Case for Down direction
                pieChr.css('top', Math.min(position.top + dist, $(window).height() - 50));
               //making an array and storing the names of all the Down turning images that i want to loop through to create an animation effect in my pieman
                var imagedown = ["Down01.PNG", "Down02.PNG", "Down03.PNG", "Down04.PNG", "Down05.PNG", "Down06.PNG", "Down07.PNG", "Down08.PNG", "Down09.PNG", "Down10.PNG", "Down11.PNG", "Down12.PNG"];
                var currentIndexD = 0;                                                  //Setting currentindex for the array with down faced images to 0 to start the loop from the first image
                intervalID = setInterval(function() {
                    //condition for looping through all the items of imagedown array and use those respective images as background for our pieman when down key is pressed
                    if( currentIndexD == imagedown.length) {
                        currentIndexD = 0;
                    }
                    pieChr.css('background-image', 'url("images/' + imagedown[currentIndexD++] + '")')
                }, 70);                                                                 //running the imagechanging loop(setinterval() function) in a fixed interval of 70ms to change the image and loop through the array for different images

                movedown();                                                             //once the image starts to change in fixed interval, calling movedown function to move the pieman in the downward direction when down arrow key is pressed
                break;                                                                  //breaking out of the case        
        }

        pelletCollision();                                                              //checking for any collisions after the pieman starts to move in the key press direction
    });

    pelletspawn(true);                                                                  //running pellet spawn function to spawn a pellet at the begginig of the game by passing true parameter to the function
    scoreupdate();                                                                      //updating the score if our pieman ate any pellets 
});
