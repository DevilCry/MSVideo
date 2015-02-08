

var Axis_margin = {top: 50, right: 100, bottom: 50, left: 100},
    Axis_width = $(".coordinate").width() - Axis_margin.left - Axis_margin.right,
    Axis_height = $("div.coordinate").height() - Axis_margin.top - Axis_margin.bottom;

var coor_svg  = d3.select(".coordinate").append("svg")
                     .attr("width", Axis_width + Axis_margin.left + Axis_margin.right)
                     .attr("height", Axis_height + Axis_margin.top + Axis_margin.bottom)
                     .append("g")
                     .attr("transform", "translate(" + Axis_margin.left + "," + Axis_margin.top + ")");
var line;



function drawChar(data)
{
    var x = d3.scale.linear()
        .domain([0, d3.max(data,function(d){return d.value;})])
        .range([0, 200]);

    $(".chartBar").remove();
    d3.select("#chart")
      .selectAll("div")
        .data(data)
        .enter().append("div")
        .attr("class","chartBar")
        .style("width", function(d) { return x(parseInt(d.value)) + "px"; })
        .text(function(d) { return d.value; });
}
//  var svg;
//  var line;
function axis()
{
$(".coordinate svg").remove();


//var margin = {top: 20, right: 30, bottom: 30, left: 40},
//    width = 960 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;

coor_svg  = d3.select(".coordinate").append("svg")
                     .attr("width", Axis_width + Axis_margin.left + Axis_margin.right)
                     .attr("height", Axis_height +Axis_margin.top + Axis_margin.bottom)
                     .append("g")
                     .attr("transform", "translate(" + Axis_margin.left + "," + Axis_margin.top + ")");

var x = d3.time.scale()
    .domain([new Date(2015, 1, 23,0), new Date(2015, 1, 23,0,1440)])
    .range([0, Axis_width]);

var y = d3.scale.linear()
    .domain([0, 6])
    .range([Axis_height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });


coor_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + Axis_height + ")")
    .call(xAxis);

coor_svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
}
function addPath(d)
{
coor_svg.append("path")
    .attr("class", "line")
    .attr("d", line(d.data))
    .style("stroke",color(d.id))
    .on("click",pathOver)
    .on("mouseOut",pathOut);
}
function addDot(data)
{
coor_svg.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5);
}
function pathOver(d)
{
    d3.select("#obj_img")
      .append("img")
      .attr("xlink:href",function(d){
      var a = document.createElement('A');
      a.href = static_url+"images/obj1.png";
      return a.href;
//        return static_url+"images/obj1.png";
      })
      .attr()
      .attr("width",50)
      .attr("height",50);


}
function pathOut(d)
{
    $("#obj_img img").remove();
}
drawChar([4, 8, 15, 16, 23, 42]);
//updataAxis([[new Date(2015,1,23,0,10),1],
//            [new Date(2015,1,23,0,400),2]]);
axis();
addPath({
            id:1,
            data:[[new Date(2015,1,23,0,10),1],
                  [new Date(2015,1,23,0,400),2]]});
addDot([[new Date(2015,1,23,0,10),1],
                  [new Date(2015,1,23,0,400),2]]);