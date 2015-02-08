var svg = d3.select("#bing")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = $("#bing").with(),
    height = 300,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var pie_color = d3.scale.ordinal()
	.domain(["object1", "object2", "object3", "object4", "object5", "object6", "object7", "object8", "object9", "object10", "object11","object12","object13","object14","object15","object16","object17"])
	.range(["#004529","#006837","#238443","#41ab5d","#78c679","#addd8e","#d9f0a3","#f7fcb9","#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#7fcdbb","#1d91c0","#225ea8","#253494","#081d58"]);

//function randomData (){
//	var labels = color.domain();
//	return labels.map(function(label){
//		return { label: label, value: Math.random() }
//	});
//}

//change(randomData());
//
//d3.select(".randomize")
//	.on("click", function(){
//		change(randomData());
//	});

function pie_mouseover(d)
{
    d3.select(this)
          .attr("fill","yellow");
}
function pie_mouseout(d,i)
{
    d3.select(this)
          .attr("fill",pie_color(d.data.label));
}
function pie_click(d)
{
    var char_data= new array();
    for(var i=0;i<root.children.length();i++)
    {
        for(var j=0;j<root.children[i].children.length;j++)
        {
            if(root.children[i].children[j].name==d.label)
            {
                var chart_d = {label:"",value:0};
                chart_d.label = root.children[i].name;
                chart_d.value = root.children[i].children[j].times;
                chart_data.push(chart_d);
            }
        }
    }
    drawChar(chart_data);
}
function Pie_change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return pie_color(d.data.label); })
		.attr("class", "slice")
		.on("mouseover",pie_mouseover)
		.on("mouseout", pie_mouseout);

	slice
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
};