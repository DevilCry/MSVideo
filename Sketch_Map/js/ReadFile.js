var width  = 1250;
var height = 850;
var Na=[];
var Nu=[];
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");
var projection = d3.geo.mercator()
    .center([117, 26])
    .scale(800)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 12])
    .on("zoom", zoomed);
var color = d3.scale.category20();
var displayrolers=[true,true,true,true,true,true,true,true,true,true,true,true,true,true];
var g = svg.append("g");
svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);
svg.call(zoom)
    .call(zoom.event);

var Nam=function(d){
    switch (d)
    {
        case "Apoc": return 0;
        case "Neo": return 1;
        case "Trinity": return 2;
        case "Morpheus": return 3;
        case "Dozer": return 4;
        case "Cypher": return 5;
        case "Oracle": return 6;
        case "Robots": return 7;
        case "Mouse": return 8;
        case "Switch": return 9;
        case "Tank": return 10;
        case "Smith": return 11;
        case "Brown": return 12;
        case "Jones": return 13;


    }
};
var cnt=0;
var dataMap,dataRoler,dataLine,datalines,dataEvent;
//绘制地图
d3.json("json//Geo.json", function(error, root) {
    if (error)
        return console.error(error);
    console.log(root.Ma.geometries);
    dataMap = root.Ma.geometries;
    g.selectAll("path.background")
        .data(dataMap)
        .enter()
        .append("path")
        .attr("stroke","#000")
        .attr("stroke-width",1)
        .attr("class","background")
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d", path )
    //绘制情节线
    dataLines = root.LINES.geometries;
    g.selectAll("path.spot")
        .data(dataLines)
        .enter()
        .append("path")
        .attr("stroke", function(d){return color(Nam(d.name))})
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("class","spot")
        .attr("d", path)

    //绘制时间线
    dataLine = root.TimeLine.geometries;
    g.selectAll("path.time")
        .data(dataLine)
        .enter()
        .append("path")
        .attr("stroke", "black")
        .attr("stroke-width", function(d){
            return d.len+2;
        })
        .attr("fill", "none")
        .attr("class","time")
        .attr("d", path)
        .on("mousedown", function (d, i, e) {
            d3.select(this)
                .attr("display", "none")
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("display","block")
        });

    //绘制事件点
    dataEvent = root.Event.geometries;
    g.selectAll("image.event")
        .data(dataEvent)
        .enter()
        .append("svg:image")
        .attr("class", "event")
        .attr("xlink:href", function(d){return "pic\\EVENT.png"})
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})
        .attr("width", 20)
        .attr("height", 20)
        .on("mouseover", function (d, i, e) {
            var xPosition=parseFloat(d3.event.x);
            var yPosition=parseFloat(d3.event.y);

            d3.select("#tooltip")
                .style("left",xPosition+"px")
                .style("top",yPosition+"px")
                .select("#value")
                .text(d.number);
        })
        .on("click",function(d)
        {
            var str="http://localhost:63342/Sketch_Map/video/";
            str+= d.number+".mp4";
            clicked(str, d.number);
        });
    g.selectAll("text.event")
        .data(dataEvent)
        .enter()
        .append("text")
        .attr("class", "event")
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})
        .text(function(d){return "事件"+ d.number})
        .style("font-size","10px");
    //绘制角色点
    dataRoler = root.Points.geometries;
    g.selectAll("image.circle")
        .data(dataRoler)
        .enter()
        .append("svg:image")
        .attr("class", "circle")
        .attr("xlink:href", function(d){return "pic\\"+d.name+".png"})
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})
        .attr("width", 20)
        .attr("height", 20)
        .attr("display","none")
        .on("click",function(d,i){
            Na[cnt]= d.name;
            Nu[cnt]= d.number;
            d3.select(this)
                .attr("x", function (d) {
                    return projection(d.coordinates)[0] - 20;
                })
                .attr("y", function (d) {
                    return projection(d.coordinates)[1] - 20;
                })
                .attr("width", 40)
                .attr("height", 40)
                .attr("class", "choose");
            cnt = cnt + 1;
			
			console.log(d.name+d.number);
		});
});

//放大缩小
function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    if(zoom.scale()<2)
        g.selectAll("path.time").attr("display","block");
    else
        g.selectAll("path.time").attr("display","none");
    if(zoom.scale()<2)
    {
        g.selectAll("image.circle").attr("display","none");
        g.selectAll("image.choose").attr("display", "none");
    }
    else {
        g.selectAll("image.circle").attr("display", function (d) {
            var result=checkdis(d);
            return result;});
        g.selectAll("image.choose").attr("display", "block");
    }
}
//查询路径函数
function process(d) {
    g.selectAll("path.spot")
        .attr("display",function(d){
            if(d.name==Na[0]&& d.s>Nu[0]&& d.e<Na[1])
                return "block";
        })


}
function clicked(str,num) {
    var player=document.getElementById("player");
    var ppl=document.getElementById("pp");
    if (player.style.visibility == "hidden") {
        player.style.visibility="visible";
        d3.selectAll("video").attr("src", str);
        ppl.poster="http://localhost:63342/Sketch_Map/pic/"+ num+"-01.jpg";
    }
    else if(pp.src!=str) {
        pp.src = str;
        ppl.poster = "http://localhost:63342/Sketch_Map/pic/" + num + "-01.jpg";
    }
    else {
        player.style.visibility = "hidden";
        d3.selectAll("video").attr("src", "");
    }

}
function setvalue()
{
    if(cnt==0)
    return;
    displayrolers=[false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    for(var i=0;i<cnt;i++)
    {
        displayrolers[Nam(Na[i])]=true;
    }
}
function checkdis(d) {
    if (displayrolers[Nam(d.name)])
    return "block";

    else

        return "none";

}
function resets()
{
    Na=[];
    Nu=[]
    cnt=0;
    g.selectAll("image.choose")
        .attr("class","circle");
    g.selectAll("image.circle")
        .data(dataRoler)
        .attr("class", "circle")
        .attr("xlink:href", function(d){return "pic\\"+d.name+".png"})
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})
        .attr("width", 20)
        .attr("height", 20);
	g.selectAll("path.spot")
        .data(dataLines)
		.attr("display","block")
        .attr("stroke", function(d){return color(Nam(d.name))});
		
    displayrolers=[true,true,true,true,true,true,true,true,true,true,true,true,true,true];
    if(zoom.scale()<2)
        g.selectAll("path.time").attr("display","block");
    else
        g.selectAll("path.time").attr("display","none");
    if(zoom.scale()<2)
    {
        g.selectAll("image.circle").attr("display","none");
        g.selectAll("image.choose").attr("display", "none");
    }
    else {
        g.selectAll("image.circle").attr("display", function (d) {
            var result=checkdis(d);
            return result;});
        g.selectAll("image.choose").attr("display", "block");
    }
}



