/*
 * @author Josh Walker
 *
 * @Version 1.0
 * @Date 02 February 2016
 *
 * Creates new plots
 * Allows plotting of specific PID data vs. time
 * Allows user to set time between updates
 * Allows user to choose number of points to plot
 * Allows user to add and remove plots
 *
 * @Dependencies talker.js
 *
 * @UsedBy combined.html
 */


//Returns an array no longer than totalPoints, taken from the end of the array
//@param array: array to take slice of
//@param name: Unused
//@param totalPoints: The largest array that can be returned
function getDataSlice(array, name, totalPoints) {
    if (!array.length) {
        array = [0,0];
    }
    
    if (array.length < totalPoints) {
        return array;
    }
    return array.slice(array.length - totalPoints);
}

//Returns how often graph is updated
//Changes how often a graph is updated
//DOES NOT CHANGE HOW OFTEN talker.js READS DATA
//
//@param inputID: Which input box is changed
function changeUpdateInterval(inputID) {
    var v = $("#" + inputID).val();
    
    if (v && !isNaN(+v)) {
        updateInterval = +v;
        
        if (updateInterval < 1) {
            updateInterval = 1;
        } else if (updateInterval > 2000) {
            updateInterval = 2000;
        }
        
        $("#" + inputID).val("" + updateInterval);
        return updateInterval
    }
}

//Returns how many data points to plot
//Changes how many data points are plotted
// Does not allow < 1 or >2000 points
//
//@param inputID: Which input box is changed
function changeNumDataToPlot(inputID) {
    var v = $("#" + inputID).val();
    
    if (v && !isNaN(+v)) {
        numDataToPlot = +v;
        
        if (numDataToPlot < 1) {
            numDataToPlot = 1;
        } else if (numDataToPlot > 2000) {
            numDataToPlot = 2000;
        }
        
        $("#" + inputID).val("" + numDataToPlot);
        return numDataToPlot
    }
}

//Creates a new, self-contained plot.
//collective ID is "plotDiv" + plotNum
//plot ID is "placeholder" + plotNum
//All relevant fields and plot-specific events are generated here
//Should not be called until there is something to plot
function newPlot(plotNum) {
    var divID = "plotDiv".concat(plotNum);
    
    var headerID = "graphing".concat(plotNum);
    var headerText = "Currently graphing ";
    
    var plotID = "placeholder".concat(plotNum);
    var plotClass = "demo-placeholder";
    var style = "padding: 0px; position: relative;";
    var width = '"1636"';
    var height = '"826"';
    
    var updateIntervalID = "updateInterval".concat(plotNum);
    var updateIntervalStyle = "text-align: right; width:5em";
    var updateInterval = 30;
    
    var numDataToPlotID = "num2Plot".concat(plotNum);
    var numDataToPlotStyle = "text-align: right; width:5em";
    var numDataToPlot = 30;
    
    var removeButtonID = "removeButton".concat(plotNum);
    var removeButtonType = "button";
        
    var choosePlotDataID = "choosePlotData".concat(plotNum);
    var choosePlotDataClass = "choosePlotData";
    var dataToPlot = graphableData[0]; //represents which y value to plot, given by resArray[dataToPlot]
    
    var buttonClass = "ChooseData".concat(plotNum);
    var buttonID = [], buttonName = [];
    buttonID[0] = "data0".concat(plotNum), buttonName[0] = "Data Set 0";
    buttonID[1] = "data1".concat(plotNum), buttonName[1] = "Data Set 1";
    
    localPlotData = getDataSlice(inputPIDVars[dataToPlot], dataToPlot, numDataToPlot);
    
    // Create html elements for plot
    $("#demo-container").append($("<div id=" + divID + "></div>")); //container for new plot
    
    $("#" + divID).append($(""    //Plot Title
        + "<p id=" + headerID + "> " + headerText + " " + graphableData[0]
        + "</div>"));
    
    $("#" + divID).append($(""    //new plot canvas area
        + "<div id=" + plotID + " class=" + plotClass + " style=" + style + " width=" + width + " height=" + height
        + "></div>"));
    
    $("#" + divID).append($(""  //update interval button
        +"<p>Time between updates: "
        +"<input id=" + updateIntervalID + " type=\"text\" value=\"\" style=" + updateIntervalStyle + ">"
        +"milliseconds</p>"));
    
    $("#" + divID).append($(""  //Number Data Plotted Input Field
        +"<p>Num points to plot: "
        +"<input id=" + numDataToPlotID + " type=\"text\" value=" + numDataToPlot
        +" style=" + numDataToPlotStyle + ">"
        +"milliseconds</p>"));
    
    $("#" + divID).append($(""  //remove plot button
        +"<button type=" + removeButtonType + " id = " + removeButtonID + ">Remove Plot"
        +"</button>"));
    
    $("#" + divID).append($(""    //BUTTONS to Choose what to plot
        +"<div id=" + choosePlotDataID + " class=" + choosePlotDataClass + " style=\"width:5em; height:5em\">"
        +"</div>"));
    
        for (data in graphableData) {//Create a button to plot any data that can be plotted
            var dataName = graphableData[data];
            dataID = dataName.concat(plotNum);
            $("#" + choosePlotDataID).append($(""
                +"<button type=\"button\" + id=" + dataID + " class = " + buttonClass + ">" + dataName
                +"</button>"));
        }

    //Create Plot variable
    var plot = $.plot("#" + plotID, [localPlotData], {
        series: {
            shadowSize: 0	// Drawing is faster without shadows
        },
                
        //Currently all default values
        yaxis: {
            
        },
          
        //Turns milliseconds since epoch into formatted time
        //Minutes:Seconds
        xaxis: {
            mode: "time",
            timeformat: "%M:%S",
        }
    });
    
    //Handle all real-time events
    $(document).ready(function() {
                      
        //Change how often singular plot is updated
        $("#" + updateIntervalID).val(updateInterval).change(function () {
            updateInterval = changeUpdateInterval(updateIntervalID);
        });
        
        //Change how much data points to plot
        $("#" + numDataToPlotID).val(numDataToPlot).change(function () {
            numDataToPlot = changeNumDataToPlot(numDataToPlotID);
        });
            
        //Delete the plot
        $("#" + removeButtonID).click(function() {
            $("#" + divID).remove();
        });
                
        //Change which data field is plotted
        $("." + buttonClass).click(function () {
            dataToPlot = this.innerHTML;
            document.getElementById(headerID).innerHTML = headerText + " " + this.innerHTML;
        });
        
        //"Homemade" event. When signaled that there is new data, make a new button and handler for it
        $("body").on("NewData", function() {
            var dataName = graphableData[graphableData.length - 1];
            dataID = dataName.concat(plotNum);
            $("#" + choosePlotDataID).append($(""
                +"<button type=\"button\" + id=" + dataID + " class = " + buttonClass
                +" onclick='setDataToPlot(this.innerHTML)'>" + dataName
                +"</button>"));
                     
            $("." + buttonClass).click(function () {
                dataToPlot = this.innerHTML;
                document.getElementById(headerID).innerHTML = headerText + " " + this.innerHTML;
            });
        });
        
        //Update the graph. Bring in new data points, reset axes, call itself
        function update() {
            localPlotData = getDataSlice(inputPIDVars[dataToPlot], dataToPlot, numDataToPlot);
            
            if(!stopThings) {
                plot.setData([localPlotData]);
                plot.setupGrid();
                plot.draw();
            }
            
            setTimeout(update, updateInterval);
        }
                      
        //Trigger initial plotting cycle
        update();
    });
}