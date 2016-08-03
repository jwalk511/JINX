var inputPIDVars = {'time' : []};
var graphableData = [];
var stopThings = false;

$(document).ready(function() {
    var graphableDataEvent = jQuery.Event("NewData");

    var eventSourceAddress = "http://localhost:8888/sse.php";   //Address of server side events (sse.php)
                                                                //change when needed
    $.ajaxSetup({	// Disable caching of AJAX responses
        cache: false
    });
                  
                  
    var timestamp = 0									//used to detect when file was updated*/
    var objDiv = document.getElementById("terminal");	//used to scroll to bottom of terminal
    //var evtSource = new EventSource(eventSourceAddress);	//server side events

    /*
    evtSource.addEventListener("ping", function(e) {
        if(!stopThings){
            var obj = JSON.parse(e.data);
            //newElement.innerHTML = "SSE: " + obj.PID;
            addTerminal(obj.PID.time, "robo", objDiv);
            addTerminal(obj.PID.Error, "robo", objDiv);
                               
        }
    }, false);
    */
  
    $('#freezeButton').click(function() {
        console.log(1);
            if (document.getElementById("freezeButton").innerHTML == "FREEZE") {
                console.log(2);
                                           //evtSource.close();
                stopThings = true;
                document.getElementById("freezeButton").innerHTML = "UNFREEZE";
            } else {
                console.log(3);
                //evtSource = new EventSource("http://localhost:8888/sse.php");
                document.getElementById("freezeButton").innerHTML = "FREEZE";
                stopThings = false;
            }
        });

    function getJSON(){
        $.getJSON('../assets/json/jason.json', function(data) {
            if(data.PID.time != timestamp) {
                  handlePIDData(data.PID);
            }
        });
    }
                  
    function handlePIDData(PID) {
        if (!stopThings) {
            addTerminal(PID.string, "robo", objDiv);
        }
        timestamp = PID.time;
        time = new Date().getTime();
        for (PIDVar in PID) {
            if(!(PIDVar in inputPIDVars)) {
                inputPIDVars[PIDVar] = [];
                if (jQuery.type(PID[PIDVar]) == "number") {
                    graphableData.push(PIDVar);
                    jQuery("body").trigger(graphableDataEvent);
                }
                //console.log(graphableData);
                //console.log(1);
            }
            inputPIDVars[PIDVar].push([time, PID[PIDVar]]);
            //console.log(inputPIDVars);
        }
    }

  
    placeholder()
    function placeholder(){
        getJSON();
        setTimeout(placeholder, 100);	//REMOVE used to append random data to terminal

    }

});
