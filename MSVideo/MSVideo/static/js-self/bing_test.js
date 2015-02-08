var width = $("#bing").width();
var height = width;
var radius = width/2;
var pie_dataset = [5,10,25,45,15];
var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d){
                        return d.value;
                    });

var svg = d3.select("#bing").append("svg")
                           .attr("width",width)
                           .attr("height",height);

var outRadius = width /2.8;
var innerRadius = width / 8;
var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outRadius);
var outerArc = d3.svg.arc()
                      .outerRadius(outRadius*1.15)
                      .innerRadius(innerRadius*1.15);

var color = d3.scale.category10();

var gAll = svg.append("g")
              .attr("transform","translate("+outRadius*1.5+","+1.5*outRadius+")");
var arcs_enter;
function update_pie(pie_dataset)
{
    $(".arc").remove();
    var pie_data = pie(pie_dataset);
    var arcs = gAll.selectAll(".arc")
               .data(pie_data,function(d){return d.data.label;});

    arcs_enter = arcs.enter()
               .append("g")
               .attr("class","arc")
               .each(function(d){
                d.dx=0;
                d.dy=0;
               });



var tempWidth,tempHeight,atan;
arcs_enter.append("path")
    .attr("fill",function(d,i){
      return color(i);
    })
    .attr("d",function (d) {
        return arc(d);
    })
//    .on("mouseover",pie_mouseover)
//    .on("mouseout",pie_mouseout)
    .on("click",pie_click);

arcs_enter.append("text")
    .attr("transform",function(d){
      return "translate("+arc.centroid(d)+")";
    })
    .attr("fill","white")
    .attr("font-size","25px")
    .attr("text-anchor","middle")
    .text(function(d, i){
      return d.value;
//      return pie_textset[i];
    });
    function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

arcs_enter.append("text")
           .attr("class","title")
           .attr("font-size","25px")
           .text(function(d, i){
                return d.data.label;
           })
           .attr("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                //this._current = interpolate(0);
                    var d2 = interpolate(1);
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
           })
           .style("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
//			return function(t) {
				var d2 = interpolate(1);
				return midAngle(d2) < Math.PI ? "start":"end";
//			};
		    });

arcs_enter.append("polyline")
           .attr("points",function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
//			this._current = interpolate(0);
			var pos = outerArc.centroid(d);
			pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
			return [arc.centroid(d), outerArc.centroid(d), pos];
		});
}



function pie_click(d,i)
{
    var x = arc.centroid(d)[0];
    var y = arc.centroid(d)[1];
    atan =Math.atan2(Math.abs(y),Math.abs(x))*360/(2*Math.PI);
    if(x<=0&&y>0)
      atan = 180+atan;
    if(x<=0&&y<0)
      atan = (180-atan);

    //旋转角度
    gAll.transition()
        .duration(500)
        .attr("transform","translate("+outRadius+","+1.5*outRadius+") rotate("+atan+")");
    arcs_enter.attr("transform","translate(0,0)");

    d3.select(this.parentNode)
      .attr("transform",function(d){
        var dis = 10; //移动的距离
        var tmpTan = Math.abs(y/x);
        var new_x = dis/Math.sqrt(tmpTan*tmpTan+1);
        var new_y = 0;
        if(x<0)
        {
          new_x = -new_x;
        }
        new_y = (new_x+x)*(y/x)-y;
        return "translate("+new_x+","+new_y+")"
      });
}
update_pie(pie_dataset);

//设置地图
//var map = L.map('map-container').setView([51.505, -0.09], 13);
//
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//      maxZoom: 18,
//      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://openstreetmap.org">Openstreetmap</a>'
//    }).addTo(map);
//
//L.polygon([
//      [51.509, -0.08],
//      [51.503, -0.06],
//      [51.51, -0.047]
//    ]).addTo(map).bindPopup("I am a polygon.");
//
//  var popup = L.popup();
//  map.on('click', onMapClick);
//
//var marker_data = [{"x":"51.5","y":"-0.09"}];
//var circle_data = [{"x":"51.508","y":"-0.11","r":"500"}];
//var polygon_data = [[{"x":"51.509","y":"-0.08"},{"x":"51.503","y":"-0.06"},{"x":"51.51","y":"-0.047"}]];
//
//var markers = new Array();
//var circles = new Array();
//var polygons = new Array();
//
//for(i=0;i<marker_data.length;i++)
//{
//   var lamMarker = new L.marker([marker_data[i].x,marker_data[i].y])
//                        .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();;
//   markers.push(lamMarker);
//   //map.addLayer(markers[i]);
//}
//
//for(i=0;i<circle_data.length;i++)
//{
//    var circle = L.circle([circle_data[i].x,circle_data[i].y],circle_data[i].r,{
//      color: 'red',
//      fillColor: '#f03',
//      fillOpacity: 0.5
//    });
//    circles.push(circle);
//    //map.addLayer(circles[i]);
//}
//
//
////对应的响应函数
//function onMapClick(e) {
//  popup
//    .setLatLng(e.latlng)
//    .setContent("You clicked the map at " + e.latlng.toString())
//    .openOn(map);
//}