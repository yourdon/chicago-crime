// variables of interest (VOI) for the final plot
var voi = ["Police Personnel", "Arrests", "Total Incidents", 
                  "Homicides", "Arsons"]

// rounding function to be used later                  
var round = d3.format(".2f");

// set up page
var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set up axes
var xTicks = d3.range(2001, 2010+1)
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height,0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom")
    .tickFormat(d3.format([,])).tickValues(xTicks)
var yAxis = d3.svg.axis().scale(y).orient("left")
    .tickFormat(d3.format(".0f"));

// set up color
var color = d3.scale.category10();

// set up svg 
var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up tooltips
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load, transform, and plot data
d3.csv("data/crime_deviations.csv", function(error, data) {
    
 	  data.forEach(function(d) {
      d["Year"] = +d["Year"];
      d["Police Personnel"] = +d["Police Personnel"];
      d["Homicides"] = +d["HOMICIDE"];
      d["Arsons"] = +d["ARSON"];
      d["Arrests"] = +d["ARRESTS"];
      d["Total Incidents"] = +d["ALL"];
  	});

    color.domain(d3.keys(data[0]).filter(function(key) {return key in voi;}));

    // set up domains
	  x.domain([d3.min(data, function(d) {return d.Year;}) - 1, 
              d3.max(data, function(d) {return d.Year;}) + 1]);
    y.domain([d3.min(data, function(d) {return d["Arsons"]; }) - 3,
              d3.max(data, function(d) {return d["Arsons"]; }) + 3]);

    // x-axis
  	svg.append("g")
      		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(xAxis)
    	.append("text")
      		.attr("class", "label")
      		.attr("x", width)
      		.attr("y", -6)
      		.style("text-anchor", "end")
      		.text("Year");

    // y-axis
  	svg.append("g")
      		.attr("class", "y axis")
      		.call(yAxis)
    	.append("text")
     		.attr("class", "label")
     		.attr("transform", "rotate(-90)")
    		.attr("y", 6)
        .attr("x", 10)
   		  .attr("dy", ".71em")
   		  .style("text-anchor", "end")
   		  .text("% deviation from decade mean");

    // callback function for plotting points and adding tooltips
	  var plot = function(j) {
  		svg.selectAll(".dot" + j)
      			.data(data)
    		.enter().append("circle")
      			.attr("class", "dot")
      			.attr("r", 4.5)
      			.attr("cx", function(d) {return x(d["Year"]); })
      			.attr("cy", function(d) {return y(d[voi[j]]); })
      			.style("fill", function(d) { return color(voi[j]);}) 
      		.on("mouseover", function(d) {
      			tooltip.transition()
               		.duration(200)
               		.style("opacity", .9);
          		tooltip.html("Year: " + d.Year + "<br/>"
          			+ voi[j] + " (deviation from decade mean): " +
                  round(d[voi[j]]) + "%")
               		.style("left", (d3.event.pageX - 2) + "px")
               		.style("top", (d3.event.pageY - 53) + "px");
     		 	})
      		.on("mouseout", function(d) {
          		tooltip.transition()
               		.duration(500)
               		.style("opacity", 0);
      			});
      		
      	var lineFunction = d3.svg.line()
      		.x(function(d) { return x(d["Year"]); })
      		.y(function(d) { return y(d[voi[j]]); })
      		.interpolate("linear");

      	svg.append("path")
      		.attr("d", lineFunction(data))
            .attr("stroke", "darkgrey")
            .attr("stroke-width", 1)
            .attr("fill", "none");
    }; 

    // iterate through the different line types and plot data points for each
    for (j = 0; j < voi.length; j++) {
    	plot(j);
    };

    // create legend
    var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
              return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

});