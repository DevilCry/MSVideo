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
function getRolersNumPerEvent(dataRoler,dataEvent){
	var RolersNumPerEvent=[];
	var a;
	for(var i=0;i<dataEvent.length;i++)
	{
		a=new Array(2);
		a[0]=0;
		a[1]=0;
		RolersNumPerEvent.push(a);
	}
	
	var num;
	for(var i=0;i<dataRoler.length;i++)
	{
		num=dataRoler[i].number-1;
		RolersNumPerEvent[num][0]=RolersNumPerEvent[num][0]+1;
	}
	
	return RolersNumPerEvent;
}

function getRolerPos(dataRoler,rolersPerEvent,eventpos)
{
	var num,theta,x,y;
	var set;
	var RolerPos=[];
	var radius=20;
	for(var i=0;i<dataRoler.length;i++)
	{
		num=dataRoler[i].number-1;
		
		theta=2*Math.PI*rolersPerEvent[num][1]/rolersPerEvent[num][0];
		//x=eventpos[2*num]+radius*Math.cos(theta)+15;
		//y=eventpos[2*num]+radius*Math.sin(theta)+45;
		x=radius*Math.cos(theta);
		y=radius*Math.sin(theta);
		//console.log("x y theta is "+x+" "+y+" "+theta);
		set=new Array(2);
		set[0]=x;
		set[1]=y;
		RolerPos.push(set);
		rolersPerEvent[num][1]=rolersPerEvent[num][1]+1;
	}
	
	return RolerPos;
}

//var backgroundColorSet=["#0000ff","#00ff00","#ff0000","#ffff00"];//青，绿，
//var backgroundColors=[3,1,0,2,1,2,2,0,2,1,1,0,3,2,3,1,0,2,1,2,2,0,2,1,1,0,3,2];
var backgroundColorSet=["#000000","#9FB7D8","#61BAE4","#EBA570","#0093CC","#6272A9","#9FB7D8","#61BAE4","#9592BC","#EBAF92","#9FB7D8","#F8C300","#0093CC","#EBA570","#E9811A"];
var reflection=[0,   2,0,0,5,0,  0,14,0,0,0,  9,0,0,1,4,  3,6,11,7,8,  12,13,10,0];
//var backgroundColors=[4,1,4,4,1,  4,4,1,4,4,  4,1,4,4,1,  1,1,1,1,1,  1,1,1,1];
//event=[1:13]  <==>   index=[+14,+1,+16,+15,+4,  +17,+19,+20,+11,+23,  +18,+21,+22,+7]
var cnt=0;
var dataMap,dataRoler,dataLine,datalines,dataEvent;

var eventpos,rolerPos,rolersPerEvent;
//绘制地图
//g.attr("stoke",rgb(0,0,0))
//	.attr("fill",rgb(0,0,255));
d3.json("json//Geo.json", function(error, root) {
    if (error)
        return console.error(error);
    //console.log(root.Ma.geometries);
    dataMap = root.Ma.geometries;
    g.selectAll("path.background")
        .data(dataMap)
        .enter()
        .append("path")
        .attr("stroke",function(d,i){
			//console.log("*********************"+i);
            //return "#0000ff";
			return "white";
			//return backgroundColorSet[backgroundColors[i]];
			//stroke-width:0.197238;stroke-dasharray:0.986192 0.591715 0.197238 0.591715
        })
        .attr("stroke-width",1)
        .attr("class","background")
        .attr("fill", function(d,i){
            //return color(i);
			return backgroundColorSet[reflection[i]];
        })
		//.attr("opacity",1)
		//.attr("full-opacity",1)
		//.attr("fill-rule","evenodd")
		.attr("stroke-width",1)
		.attr("stroke-dasharray",0.986192,0.591715,0.197238,0.591715)
        .attr("d", path )
    //绘制情节线
	//style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:10;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:30,30;stroke-dashoffset:0"
    dataLines = root.LINES.geometries;
    g.selectAll("path.spot")
        .data(dataLines)
        .enter()
        .append("path")
        .attr("stroke", function(d){return color(Nam(d.name))})
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("class","spot")
		.attr("border-style","double")
		.attr("stroke-dasharray",3,3)
		.attr("stroke-dashoffset",0)
        .attr("d", path);

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
	eventpos=new Array(2*dataEvent.length);
    g.selectAll("image.event")
        .data(dataEvent)
        .enter()
        .append("svg:image")
        .attr("class", "event")
        .attr("xlink:href", function(d,i){
			if(i==0)	return "SVG\\Event"+14+".svg";
			//console.log("image.event i is "+i);
			return "SVG\\Event"+i+".svg";
			//return "pic\\EVENT.png"
		})
        .attr("x", function(d,i){
			var num=d.number-1;
			//console.log("dataEvent.number "+num);
			if(i==1) {
				eventpos[2*num]=projection (d.coordinates)[0]-10-15+15;
			}
			else eventpos[2*num]=projection (d.coordinates)[0]-10-15;
			return eventpos[2*num];
			})
        .attr("y",function(d,i){
			var num=d.number-1;
			if(i==1) eventpos[2*num+1]= projection (d.coordinates)[1]-10-53+25;
			else eventpos[2*num+1]=projection (d.coordinates)[1]-10-53;
			return eventpos[2*num+1];
		})
        .attr("width", 50)
        .attr("height", 100)
		//.translate([-61.695,-106.195])
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
		/*
    g.selectAll("text.event")
        .data(dataEvent)
        .enter()
        .append("text")
        .attr("class", "event")
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})
        .text(function(d){return "事件"+ d.number})
        .style("font-size","10px");
		*/
	
	
    //绘制角色点
    dataRoler = root.Points.geometries;
	rolersPerEvent=getRolersNumPerEvent(dataRoler,dataEvent);
	//console.log("rolersPerEvent is "+rolersPerEvent);
	//for(var i=0;i<eventpos.length;i=i+2)
		//console.log("eventpos is "+eventpos[i]+" "+eventpos[i+1]);
	rolerPos=getRolerPos(dataRoler,rolersPerEvent,eventpos);
	//for(var i=0;i<rolerPos.length;i=i+1)
		//console.log("rolersPos is "+rolerPos[i][0]+" "+rolerPos[i][1]);
	var r=20;
    g.selectAll("image.circle")
        .data(dataRoler)
        .enter()
        .append("svg:image")
        .attr("class", "circle")
        .attr("xlink:href", function(d){
			//return "pic\\"+d.name+".png"}
			//rolersPerEvent[d.number-1][1]=rolersPerEvent[d.number-1][1]+1;
			//console.log("0 and 1 is "+rolersPerEvent[d.number-1][0]+"  "+rolersPerEvent[d.number-1][1]);
			return "SVG\\"+d.name+".svg"}
		)
        .attr("x", function(d,i){
			 //console.log("x is "+projection (d.coordinates)[0]-10);
			 //return projection (d.coordinates)[0]-10
			 //var theta=2*Math.PI*rolersPerEvent[d.number-1][1]/rolersPerEvent[d.number-1][0];
			 //var x=eventpos[2*d.number]+r*Math.cos(theta);
			 //console.log("xxx is "+x+" theta is "+theta+"d.number is "+d.number);
			 //return rolerPos[i][0];
			 return eventpos[2*d.number-2]+rolerPos[i][0];
			})
        .attr("y",function(d,i){
			//return projection (d.coordinates)[1]-10
			//var theta=2*Math.PI*rolersPerEvent[d.number-1][1]/rolersPerEvent[d.number-1][0];
			//var y=eventpos[2*d.number]+r*Math.sin(theta);
			//console.log("yyy is "+y+" theta is "+theta);
			//return rolerPos[i][1];
			return eventpos[2*d.number-1]+rolerPos[i][1]+25;
			})
        .attr("width", 50)
        .attr("height", 50)
        .attr("display","none")
        .on("click",function(d,i){
            Na[cnt]= d.name;
            Nu[cnt]= d.number;
			var index=i;
            d3.select(this)
                .attr("x", function (d) {
		
					return eventpos[2*Nu[cnt]-2]+rolerPos[index][0]-25;
                    //return projection(d.coordinates)[0] - 20;
                })
                .attr("y", function (d) {
					//return this-20;
					return eventpos[2*Nu[cnt]-1]+rolerPos[index][1];
					//return eventpos[2*Nu[cnt]-1]+rolerPos[index][1]+25;
                    //return projection(d.coordinates)[1] - 20;
                })
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "choose");
            cnt = cnt + 1;
			
			//console.log(d.name+d.number);
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
        /*.attr("class", "circle")
        .attr("xlink:href", function(d){return "pic\\"+d.name+".png"})
        .attr("x", function(d){return projection (d.coordinates)[0]-10})
        .attr("y",function(d){return projection (d.coordinates)[1]-10})*/
		.attr("x", function(d,i){
			 return eventpos[2*d.number-2]+rolerPos[i][0];
			})
        .attr("y",function(d,i){
			return eventpos[2*d.number-1]+rolerPos[i][1]+25;
			})
        .attr("width", 50)
        .attr("height", 50);
	g.selectAll("path.spot")
        .data(dataLines)
		.attr("display","block")
        .attr("stroke", function(d){return color(Nam(d.name))});
		
	g.selectAll("path.timeMan").remove();
		
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



