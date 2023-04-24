var viewscores, time, main, start; // element IDs
var question = -1; // used to track current question (-1 = never started, -2 = completed but never saved score)
var timer = 0; // used to track timer
var timerInterval; // setInterval will be passed here

// Question and Answer bank
const qaBank = [
				{"question": "Commonly used data types DO Not Include:", "choices": ["strings", "booleans", "alerts", "numbers"], "answer": "alerts"},
				{"question": "The condition in an if / else statement is enclosed with _________.", "choices": ["quotes", "curly braces", "parenthesis", "square brackets"], "answer": "parenthesis"},
				{"question": "Arrays in Javascript can be used to store _________.", "choices": ["numbers and strings", "other arrays", "booleans", "all of the above"], "answer": "all of the above"},
				{"question": "String values must be enclosed within _______ when being assigned to variables.", "choices": ["commas", "curly braces", "quotes", "parenthesis"], "answer": "quotes"},
				{"question": "A very useful tool used during development and debugging for printing content to the debugger is:", "choices": ["Javascript", "terminal/bash", "for loops", "console.log"], "answer": "console.log"}
				]

// Initializing function
function init(){
	viewscores = getID("viewscores");
	time = getID("time");
	main = getID("main");
	start = getID("start");
	
	localStorage.setItem("highscores", "");
	
	viewscores.addEventListener("click", viewHighscores);
	start.addEventListener("click", function(){
		runQuiz(false);
	});
}

// Helper function for getting elements using IDs
function getID(_id){
	return document.getElementById(_id);
}

// Helper functions for Updating, Appending, and Resetting the main UI
function updateMain(_html){
	main.innerHTML = _html;
}

function appendMain(_html){
	main.innerHTML += _html;
}

function resetMain(){
	let htmlHome = '<h2>Coding Quiz Challenge</h2>';
	htmlHome += '<p>Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!</p>';
	htmlHome += '<input id="start" class="button" type="button" value="Start Quiz" />';
	
	timer = 0;
	question = -1;
	updateMain(htmlHome);
	time.textContent = timer;
	
	start = getID("start");
	start.addEventListener("click", function(){
		runQuiz(false);
	});
}

function runQuiz(_result){
	if(question == -1){
		question = 0;
		timer = 75;
		runTimer();
	}
	
	if(question != qaBank.length){
		loadQuestion(question);
		if(_result != false){
			appendMain(_result);
		}
	}else{
		endQuiz(_result);
	}
}

function endQuiz(_result){
	clearInterval(timerInterval);
	let htmlDone = '<h2 class="quiz-header">All done!</h2>';
	htmlDone += '<div class="done">';
	htmlDone += '<p>Your final score is '+ timer +'.</p>';
	htmlDone += '<div class="initial-area"><div class="initial-head">Enter initials:</div><input id="initial" class="initial-input" type="text" /><input class="button" type="button" value="Submit" onclick="saveHighscore();"/></div>';
	htmlDone += '</div>';
	
	question = -2;
	updateMain(htmlDone);
	
	if(_result != false){
		appendMain(_result);
	}
}

function runTimer(){
	time.textContent = timer;
	timerInterval = setInterval(function(){
	  if(timer <= 0){
		clearInterval(timerInterval);
		timer = 0;
		time.textContent = timer;
		endQuiz(false);
		return;
	  }
	  timer -= 1;
	  time.textContent = timer;
	}, 1000);
}

function loadQuestion(_x){
	let htmlChoices = '<h2 class="quiz-header">'+ qaBank[_x].question +'</h2>';
	
	for(var y = 0; y < qaBank[_x].choices.length; y++){
		let choice = (y+1) + ". " + qaBank[_x].choices[y]
		htmlChoices += '<input class="button choice" type="button" value="'+ choice +'" onclick="score(\''+ qaBank[_x].choices[y] +'\');"/>';
	}
	
	updateMain(htmlChoices);
}

function score(_answer){
	let htmlResult;
	if(qaBank[question].answer == _answer){
		htmlResult = '<div class="result">Correct!</div>';
	}else{
		timer -= 10;
		if(timer < 0){
			timer = 0;
		}
		time.textContent = timer;
		htmlResult = '<div class="result">Wrong!</div>';
	}
	
	question += 1;
	runQuiz(htmlResult);
}

function saveHighscore(){
	let initial = getID("initial");
	let highscore = initial.value + " - " + timer;
	
	if(localStorage.getItem("highscores") == ""){
		localStorage.setItem("highscores", highscore);
	}else{
		localStorage.setItem("highscores", localStorage.getItem("highscores") + "," + highscore);
	}
	
	question = -1;
	viewHighscores();
}

function viewHighscores(){
	clearInterval(timerInterval);
	let scores = localStorage.getItem("highscores").split(',');
	let htmlScores = '<h2 class="quiz-header highscore-header">High scores</h2>';
	
	for(var x = 0; x < scores.length; x++){
		if(scores[x] != ""){
			let score = (x+1) + ". " + scores[x];
			htmlScores += '<div class="highscore">'+ score +'</div>';
		}
	}
	
	htmlScores += '<div class="highscore-btnarea">';
	htmlScores += '<input class="button" type="button" value="Go back" onclick="exitHighscores();" />'
	htmlScores += '<input class="button button2" type="button" value="Clear high scores" onclick="clearHighscores();" />';
	htmlScores += '</div>';
	
	updateMain(htmlScores);
	document.getElementsByClassName("top-area")[0].style.display = "none";
}

function clearHighscores(){
	let highscores = document.getElementsByClassName('highscore');
	
	while(highscores[0]){
		highscores[0].remove();
	}
	
	localStorage.setItem("highscores", "");
}

function exitHighscores(){
	document.getElementsByClassName("top-area")[0].style.display = "flex";
	
	if(question == -1){
		resetMain();
	}else if(question == -2){
		endQuiz(false);
	}else{
		runTimer();
		runQuiz(false);
	}
}