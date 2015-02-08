    var treeData={
        "name":"flare",
        "children":[
            {
                "name":"Hello"
            },
            {
                "name":"World"
            }
        ]
};

var width = 960,
    height = 500;

var tree = d3.layout.tree()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");

  var nodes = tree.nodes(treeData),
      links = tree.links(nodes);

  var link = svg.selectAll("path.link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("stroke-width", 1.5)
      .attr("d", diagonal);


  var node = svg.selectAll("g.node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });

d3.select(self.frameElement).style("height", height + "px");