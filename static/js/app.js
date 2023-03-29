// Load the data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  // Get the dropdown menu element
  var select = d3.select("#selDataset");
  
  // Add the options to the dropdown menu
  var options = select.selectAll("option")
    .data(data.names)
    .enter()
    .append("option")
    .text(function(d) { return d; })
    .attr("value", function(d) { return d; });
  
  // Initialize the chart with the first option
  updateChart(data.names[0], data);
  
  function updateChart(sample, data) {
    // Find the selected sample in the data
    var sampleData = data.samples.find(function(d) {
      return d.id === sample;
    });
    
    // Get the top 10 OTUs
    var topOTUs = sampleData.otu_ids.slice(0, 10).reverse();
    var topValues = sampleData.sample_values.slice(0, 10).reverse();
    var topLabels = sampleData.otu_labels.slice(0, 10).reverse();
    
    // Update the sample metadata
    var metadata = data.metadata.find(function(d) {
      return d.id === parseInt(sample);
    });
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
    Object.entries(metadata).forEach(function([key, value]) {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
    
    // Create the bar chart
    var trace1 = {
      x: topValues,
      y: topOTUs.map(function(d) { return "OTU " + d; }),
      text: topLabels,
      type: "bar",
      orientation: "h"
    };
    
    var layout = {
      title: "Top 10 OTUs for Sample " + sample,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
    
    Plotly.newPlot("chart", [trace1], layout);
    
    // Create the bubble chart
    buildBubbleChart(sampleData);
  }

  
  // Define the optionChanged function
  function optionChanged(sample) {
    updateChart(sample, data);
    buildBubbleChart(data.samples.find(function(d) {
      return d.id === sample;
    }));
  }
  
  // Add an event listener to the dropdown menu
  select.on("change", function() {
    var sample = d3.select(this).property("value");
    optionChanged(sample);
  });
});

function buildBubbleChart(sampleData) {
  var trace = {
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: 'markers',
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: 'Earth'
    }
  };

  var data = [trace];

  var layout = {
    xaxis: {
      title: 'OTU ID'
    },
    showlegend: false,
    height: 500,
    width: 1000
  };

  Plotly.newPlot('bubble', data, layout);
}
