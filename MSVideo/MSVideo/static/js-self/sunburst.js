var width = $("#sunbrust").width(),
    height = 600,
    radius = Math.min(width, height) / 2;

var sunbrust_x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var sunbrust_y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20c();

var svg = d3.select("#sunbrust").append("svg")
    .attr("width", width)
    .attr("height", height+100)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.name;
  });

svg.call(tip);

var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunbrust_x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunbrust_x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, sunbrust_y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, sunbrust_y(d.y + d.dy)); });

var pie_color = d3.scale.ordinal()
	.domain(["object1", "object2", "object3", "object4", "object5", "object6", "object7", "object8", "object9", "object10", "object11","object12","object13","object14","object15","object16","object17"])
	.range(["#004529","#006837","#238443","#41ab5d","#78c679","#addd8e","#d9f0a3","#f7fcb9","#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#7fcdbb","#1d91c0","#225ea8","#253494","#081d58"]);

// Keep track of the node that is currently being displayed as the root.
var node;
var root;

function drawSunburst(data) {
  node = data;
  var path = svg.datum(data).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) {
            if(!d.children)
                return pie_color(d.name);
            else
                return color((d.children ? d : d.parent).name);
            })
      .on("click", sunbrust_click)
      .on("mouseover", sunbrust_mouseOver)
      .on("mouseout",sunbrust_mouseout)
      .each(stash);

  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };

    path
        .data(partition.value(value).nodes)
        .transition()
        .duration(1000)
        .attrTween("d", arcTweenData);
  });

  function sunbrust_click(d) {
    console.log(d);
    console.log(node);
    node = d;
    path.transition()
      .duration(1000)
      .attrTween("d", arcTweenZoom(d));

    update_Axis_chart(d);
  }
  function sunbrust_mouseOver(d,i)
  {
    d3.select("#sunbrust").selectAll("path").style("opacity",0.3);
    d3.select(this).style("opacity",1);
    tip.show(d);
  }
  function sunbrust_mouseout(d,i)
  {
    d3.selectAll("path").style("opacity",0.8);
    tip.hide(d);
  }
}

d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// When switching data: interpolate the arcs in data space.
function arcTweenData(a, i) {
  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  function tween(t) {
    var b = oi(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  }
  if (i == 0) {
   // If we are on the first arc, adjust the x domain to match the root node
   // at the current zoom level. (We only need to do this once.)
    var xd = d3.interpolate(sunbrust_x.domain(), [node.x, node.x + node.dx]);
    return function(t) {
      x.domain(xd(t));
      return tween(t);
    };
  } else {
    return tween;
  }
}

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
  var xd = d3.interpolate(sunbrust_x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(sunbrust_y.domain(), [d.y, 1]),
      yr = d3.interpolate(sunbrust_y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { sunbrust_x.domain(xd(t)); sunbrust_y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function searchObject(obj)
    {
        var dataset = new Array();
        var x_max= new Date(2015,1,1,0,0);
        var y_max= -1;
        for(var i=0;i<root.children.length;i++)
        {
            for(var j=0;j<root.children[i].children.length;j++)
            {
                if(root.children[i].children[j].name==obj.name)
                {
                    var tmp = root.children[i].children[j];
                    if(tmp.times>1)
                    {
                        for(var k=0;k<tmp.times;k++)
                        {
                            var d = new Array();
                            d.push(new Date(tmp.data[k][0],tmp.data[k][1],tmp.data[k][2],tmp.data[k][3],tmp.data[k][4]));
                            d.push(i+1);
                             dataset.push(d);
                        }
                    }
                    else
                    {
                        d=new Array();
                        d.push(new Date(tmp.data[0],tmp.data[1],tmp.data[2],tmp.data[3],tmp.data[4]));
                        d.push(i+1);
                         dataset.push(d);
                    }

                }
            }
        }
        dataset.sort(function(a,b){
            return a[0]>b[0]?1:-1;
        });
        return dataset;
    }

 function update_Axis_chart(d)
    {
        if( d.parent && d.children)
        {
//            var pie_title= new Array();
            var pie_dataset= new Array();
            axis();
            var final=new Array();
            for(var i=0;i<d.children.length;i++)
            {
                var pie_d = {label:"",value:0};
                pie_d.value = d.children[i].times;
                pie_d.label = d.children[i].name;
                pie_dataset.push(pie_d);
//                pie_dataset.push(d.children[i].times);
//                pie_title.push(d.children[i].name);
                var path_data={id:0,data:[]};
                path_data.id = d.children[i].name.charAt(d.children[i].name.length-1);
                path_data.data = searchObject(d.children[i]);
                addPath(path_data);
                final = final.concat(path_data.data);
            }
            update_pie(pie_dataset);
//            drawChar(pie_dataset);
            addDot(final)
        }
        if(d.parent && (!d.children && !d._children))
        {
            var pie_title = new Array();
            var pie_dataset = new Array();
            for(var i=0;i<root.children.length;i++)
            {
                for(var j=0;j<root.children[i].children.length;j++)
                {
                    if(root.children[i].children[j].name==d.name)
                    {
                        pie_title.push(root.children[i].name);
                        pie_dataset.push(root.children[i].children[j].times);
                    }
                }
            }
//            update_pie(pie_dataset,pie_title);
            drawChar(pie_dataset);
            axis();
            var path_data={id:0,data:[]};
            path_data.id = d.name.charAt(d.name.length-1);
            path_data.data = searchObject(d);
            addPath(path_data);
            addDot(path_data.data);
        }
    }
// 获取数据
// var url = "../get_data/";
//            $.ajax({
//                url:url,
//                type:'GET',
//                dataType:'json',
//                success:function(response)
//                {
//                    if(response.result=='success')
//                    {
//                        treeData = response.data;
//                        drawSunburst(treeData);
//                    }
//                    else
//                        console.log("Fail");
//                }
//            });