var commandInput = 1000;	//text to insert in terminal from user/ send to robot
var arrayOfCommands = [""];
var upArrow = 38;
var downArrow = 40;
var enterKey = 13;
var arrayIndex = 0;
 
function addTerminal(line, Class, terminalObject) {	//append text to the terminal
    var time = new Date()
    var formatTime = time.getMinutes() + ":" + time.getSeconds();
    //console.log(formatTime);
    $("#terminal").append($("<div class = " + Class + ">" + formatTime + "$ " + line + "</div>"));	//Insert text into terminal
    if (terminalObject.scrollHeight - terminalObject.scrollTop <= 325) {  //If already near bottom of div
        terminalObject.scrollTop = terminalObject.scrollHeight;	//Scroll to bottom of div
    }
}
 
function submitTerminal(terminalObject) {	//Submits command to terminal from input line
    addTerminal(commandInput, "command", terminalObject)
    arrayOfCommands = arrayOfCommands.reverse();
    arrayOfCommands[arrayOfCommands.length - 1] = commandInput;
    arrayOfCommands.push("");
    arrayOfCommands = arrayOfCommands.reverse();
    
    terminalObject.scrollTop = terminalObject.scrollHeight;	//Scroll to bottom of div
    document.getElementById("commandLine").value = "";
    arrayIndex = 0;
}

$(document).ready(function(){
    var commandLine = document.getElementById("commandLine");
    var date = new Date();
    var prevSubmitTime = date.getTime();
    var objDiv = document.getElementById("terminal");	//used to scroll to bottom of terminal
                  
    $('#commandLine').keyup(function(event){	//if input key is 'enter'
        if (event.keyCode == enterKey) {
            var date = new Date();
            submitTime = date.getTime();
                            
            //if (submitTime - prevSubmitTime > 1000){//Restrict to 1 submit per second
                submitTerminal(objDiv);
                prevSubmitTime = submitTime;
            //}
        }
                            
        if (event.keyCode == upArrow) {
            if (arrayIndex < arrayOfCommands.length - 1) {
                arrayIndex += 1;
                commandLine.value = arrayOfCommands[arrayIndex];
            }
        }
                            
        if (event.keyCode == downArrow) {
            if (arrayIndex > 0) {
                arrayIndex -= 1;
                commandLine.value = arrayOfCommands[arrayIndex];
            }
        }
    });
                  
    $('#commandLine').change(function(){	//Upon update in prompt, save text
        commandInput = this.value;
    });
                  
    $('#terminalButton').click(function() {
        submitTerminal(objDiv);
    });
                  
});