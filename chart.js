
function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  d3.select("#selDataset").on("change", function(){optionChanged(d3.select("#selDataset").node().value)})
  // Use the list of sample names to populate the select options
  d3.json("samples.json", function(data){
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  var dropdownmenu=d3.select("#selDataset");
  var dataset=dropdownmenu.property("value");
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json", function(data){
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
	
	var gaugedata ={
		value: result["wfreq"],
		title: {text:"scrubs per week"},
		type: "indicator",
		mode: "gauge+number",
		gauge: {
			bar: {color: "black"},
			axis: {range: [null,10]},
			steps: [
			{range:[0,2],color:"red"},
			{range:[2,4],color:"orange"},
			{range:[4,6],color:"yellow"},
			{range:[6,8],color:"lime"},
			{range:[8,10],color:"green"}
			]
		}
	};
	var gaugelayout ={
		title: "Belly button washing frequency"
	};
	Plotly.newPlot("plotArea3",[gaugedata],gaugelayout);	
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json", function(data){
    // 3. Create a variable that holds the samples array. 
	var samples=data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
	var object=samples.filter(obj => obj.id == sample);
	
    //  5. Create a variable that holds the first sample in the array.
	var object2=object[0];
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
	var otu_ids=object.map(x => x.otu_ids)[0];
	var otu_labels=object.map(x => x.otu_labels)[0];
	var sample_values=object.map(x => x.sample_values)[0];
  //console.log(otu_labels);
	
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
	
    var yticks = otu_ids.slice(0,10).map(otuids=>`otu ${otuids}`).reverse();
	var values = sample_values.slice(0,10).reverse();
	  console.log(yticks);
	 

    // 8. Create the trace for the bar chart. 
    var barData = {x: values, y: yticks, type: "bar", orientation: "h"};
    // 9. Create the layout for the bar chart. 
    var barLayout = {
		title:"Top 10 Bacteria Cultures Found"
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plotArea",[barData],barLayout);
	
	var barData2 = {x: otu_ids, y: sample_values, text: otu_labels, mode: "markers", marker: {size: sample_values, color: otu_ids}};
	var barLayout2 = {
		title:"Bacteria cultures per sample"
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plotArea2",[barData2],barLayout2);
  });
}
