var d3;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    height = +svg.attr("height") - margin.left - margin.right,
    width = +svg.attr("width") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var z = d3.scaleOrdinal()
    .range(["#50c978", "#bc4966", "#7e5da3", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var t;

d3.csv("data.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  y.domain(data.map(function(d) { return d.Milestone; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.Milestone); })
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)
      .attr("x", y(y.ticks().pop()) + 0.5)
      .attr("dx", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Tests");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
  
  /* ===== HOVER EFFECTS =====*/  
  
  /* the tooltip div */
  var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

  g.on('mouseover', function(d){    
    tooltip.transition().duration(200)		
      .style("opacity", .9);
    
    d3.select(this)
      .select('rect')
      .transition().duration(250)
      .style('fill', '#ffadfd'); 
    
    var xPosition = d3.mouse[0] - 15;
    var yPosition = d3.mouse[1] - 25;

    tooltip.html(d.Amount + " tests")
      .style("left", (xPosition) + "px") // move tooltip to d.event.pageX
      .style("top", (yPosition) + "px"); // move tooltip to d.event.pageY         
  })
  
  g.on('mouseout', function(d){  
    tooltip.transition().duration(500)		
      .style("opacity", 0);
    
    d3.select(this)
      .select('rect')
      .transition().duration(400)
      .style('fill', function(d){
        return setBarColors(d);      
    });
  })
});

/* ===== BAR COLORS =====*/ 

function setBarColors (d,i) {
    var colors = ['#50c978', '#bc4966', '#7e5da3', '#9e9e9e', '#64b5f6','#4dd0e1','#4fc3f7','#4db6ac','#0283AF','#7EBC89','#00187B'];
    return colors[i];
};