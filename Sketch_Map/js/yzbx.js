//author: yzbx

/*
pointNum: dataEvent.length
Points: dataRoler
srcName: Na[0]
desName: Na[1]
函数用途：将每个事件点对应到二进制数 00(No src,No des),01(no src,des),10(src,no des),11(src,des)
函数结果：返回所有事件点对应的二进制数

*/
function point2value(pointNum,Points,srcName,desName)
{
	console.log("pointNum is "+pointNum);
	var pointValue=new Array(pointNum);
	for(var i=0;i<pointNum;i++)
	{
		pointValue[i]=0;
	}
	var number;
	for(var i=0;i<Points.length;i++)
	{
		number=Points[i].number-1;		//json 中从1开始，这里从0开始
		if(Points[i].name==srcName)
		{
			pointValue[number]=pointValue[number]|1;
		}
		
		//srcName 可能即 desName
		if(Points[i].name==desName)
		{
			pointValue[number]=pointValue[number]|2;
		}
	}
	return pointValue; 
}

/*
pointValue: 每个事件点对应的二进制数组
path: 不考虑人物对应时的路径
这个函数用来检查路径是否合法，并不打算用,因为先检查边可以加快计算速度
*/
function checkPath(path,pointValue)
{
	var a=10;
	var b=0;
	for(var i=0;i<path.length;i++)
	{
		b=path[i];
		if(a&b)	a=b;
		else return false;
	}
	
	return true;
}

/*
pointNum: dataEvent.length
Points: dataRoler
Nu:	Event number
Na: roler name
timeManEdgeArray: 	dataLines 时间人物线的数组
timeManPathArray: 时间人物路径数组
使用条件：des>src， （des<src 则解为空，des=src 则解为Nu[0]）
返回结果：人物在事件中的所有合法路径
*/
function getTimeLinePath(Nu,Na,timeManEdgeArray,pointNum,Points)
{
	var m=Nu[1]-Nu[0]+1;
	if(m<2){
		console.log("请确保调用着Nu[1]>Nu[0]");
		return;
	}
	
	var edgeMatrix=new Array(Nu[1]-Nu[0]+1);		//the edge for dfs, [src,des,length]
	for(var i=0;i<Nu[1]-Nu[0]+1;i++)
	{
		edgeMatrix[i]=new Array(Nu[1]-Nu[0]+1);
	}
	for(var i=0;i<m;i++)
	{
		for(var j=0;j<m;j++)
		{
			edgeMatrix[i][j]=0;
		}
	}
	
	var pathSet=new Array(); 	//save the path of timeManPath
	var tmpPath=[];	//tmp path for dfs;
	var stack=[];	//stack for dfs
	var src=Nu[0];
	var des=Nu[1];
	var s,e,i,sp,bsp,tmpPoint,oldsp;
	var branchNum=[];
	//des > src
	var pointValue=point2value(pointNum,Points,Na[0],Na[1]);
	//console.log("pointValue is "+pointValue);
	
	for(i=0;i<timeManEdgeArray.length;i++)
	{
		s=timeManEdgeArray[i].s;
		e=timeManEdgeArray[i].e;
		
		//if(s>=src&&e<=des)
		if(pointValue[s]&pointValue[e]){
			if(s>=src && e<=des)
			{
				/*
				edge.push(s);
				edge.push(e);
				
				if(timeManEdgeArray[i].name==Na[0])	edge.push(1);
				else edge.push(2);
				edge.push(timeManEdgeArray[i].name);
				*/
				edgeMatrix[s-src][e-src]=1;
			}		
		}	
	}
	
	
	console.log("src: "+src+"des: "+des);
	console.log("srcName: "+Na[0]+"desName: "+Na[1]);
	console.log("pointValue: "+pointValue);
	console.log("edgeMatrix: ");
	for(var i=0;i<m;i++)
	{
		console.log(edgeMatrix[i]);
	}
	
	
	sp=0;
	stack.push(src);
	sp=sp+1;

	bsp=0;
	while(sp!=0)
	{
		oldsp=sp;
		sp=sp-1;
		tmpPoint=stack[sp];
		stack.pop();
		
		if(bsp >0 ){
			branchNum[bsp-1]=branchNum[bsp-1]-1;
		}
		
		tmpPath.push(tmpPoint);

		for(var j=0;j<m;j++)
		{
			if(edgeMatrix[tmpPoint-src][j]==1)
			{
				if(j<m-1)
				{
					stack.push(src+j);
					sp=sp+1;
				}
				else if(j==m-1)
				{
					var path=new Array();
					console.log("find path :");
					for(var k=0;k<tmpPath.length;k++)
					{
						var edge=new Array(3);
						edge[0]=tmpPath[k];
						if(k+1<tmpPath.length) edge[1]=tmpPath[k+1];
						else edge[1]=des;
						
						if(Na[0]==Na[1])	edge[2]=1;	//如果是同一人，则只有一种情况
						else {
							edge[2]=(pointValue[edge[0]]&pointValue[edge[1]]);
						}
						//edge[2]=pointValue[edge[0]]&pointValue[edge[1]];
						path.push(edge);
						
						console.log(edge);
					}
					
					pathSet.push(path);
				}
			}
		}
		
		
		if(sp<oldsp)
		{
			tmpPath.pop();
			
			while(branchNum[bsp-1]==0)
			{
				tmpPath.pop();
				branchNum.pop();
				bsp=bsp-1;
			}
		}
		else{
			
			branchNum.push(sp-oldsp+1);
			bsp=bsp+1;
		}
	}
	
	//将时间联系路径细化为时间人物联系路径
	//当路径中出线连续的边时，将产生新的路径
	var a,b;
	var flag=true;		//记录路径转换是否全部完成
	var timeManPathArray=pathSet;	//时间人物联系路径, 格式[src number,des number,type(0=出错,1=src-src,2=des-des,3=src-src+des-des)]
	
	while(flag){
		flag=false;
		
		for(var i=0;i<timeManPathArray.length;i++)
		{
			//var timeManPath=timeManPathArray[i];
			console.log("timeManPathArray.length is "+timeManPathArray.length);
			for(var j=0;j<timeManPathArray[i].length;j++)
			{
				if(timeManPathArray[i][j][2]==3){
					var tmpPath=new Array();
					for(var k=0;k<timeManPathArray[i].length;k++)
					{
						var tmpEdge=new Array(3);
						tmpEdge[0]=timeManPathArray[i][k][0];
						tmpEdge[1]=timeManPathArray[i][k][1];
						tmpEdge[2]=timeManPathArray[i][k][2];
						
						tmpPath.push(tmpEdge);
					}
					
					timeManPathArray[i][j][2]=1;
					//console.log("xxxxx type is "+timeManPathArray[i][j][2]);
					//timeManPathArray[i][j][2]=1;
					tmpPath[j][2]=2;
					
					timeManPathArray.push(tmpPath);
					console.log("tmpPath "+timeManPathArray.length+" is :");
					for(var k=0;k<tmpPath.length;k++)
					{
						console.log(tmpPath[k]);
					}
					
					
					flag=true;
				}
			}
		}
	}
	
	for(var i=0;i<timeManPathArray.length;i++)
	{
		console.log("the path "+i+" is :");
		for(var j=0;j<timeManPathArray[i].length;j++)
		{
			console.log(timeManPathArray[i][j]);
		}
	}
	return timeManPathArray;
}

/*
timeline: 所有的时间线
timepath: 选中的某条时间路径（注意，不是所有时间路径timeLinePath）
timevalue: 是否显示路径的标志
//已停用

function getTimeLineValue(timeline,timepath)
{
	var timevalue=[];
	
	for(var i=0;i<timeline.length;i++){
		timevalue.push(0);
		for(var j=0;j<timepath.length-1;j++)
		{
			if(timeline[i].s==timepath[j]&&timeline[i].e==timepath[j+1])	timevalue[i]=1;
		}
	}
	
	return timevalue;
}
*/
/*
timeManLineArray: datalines,时间人物线数组
timeManPath: d,时间人物联系路径
nameArray: Na, Na[0]为src name, Na[1]为des name
timeManValueArray: 是否显示时间人物线的标志
*/
function getTimeManValueArray(timeManLineArray,timeManPath,nameArray)
{
	var timeManValueArray=new Array(timeManLineArray.length);
	
	for(var i=0;i<timeManLineArray.length;i++)
	{
		timeManValueArray[i]=0;
		for(var j=0;j<timeManPath.length;j++)
		{
			//var timeManEdge=timeManPath[j];
			if(timeManLineArray[i].s==timeManPath[j][0]&&timeManLineArray[i].e==timeManPath[j][1]&&
				timeManLineArray[i].name==nameArray[timeManPath[j][2]-1])
				{
					timeManValueArray[i]=1;
					break;
				}
		}
	}
	
	return timeManValueArray;
}

/*
//显示路径
if(cnt==2&&Nu[0]<Nu[1])
{
	var pointNum=dataEvent.length;
	var timeManPathArray=getTimeLinePath(Nu,Na,dataLine,pointNum,dataRoler)
	
	//显示路径
	d3.selectAll("button#no")
	.data(timeManPathArray)
	.enter()
	.append("button")
	.attr("id","no")
	.text(function(d,i){
		return "路径"+i;
	})
	.on("click",function(d){
		//d 为某条时间线路径
		//g.selectAll("path.time").attr("display","none");
		g.selectAll("path.spot").attr("display","none");
		
		//var timevalue=getTimeLineValue(dataLine,d);
		//console.log("time value is "+timevalue);
		//dateLines 时间人物线， dataLine 时间线
		var timeManValueArray=getTimeManValueArray(dataLines,d,Na);
		
		g.selectAll("path.spot")
			.data(timeManValueArray)
			.attr("display",function(d){
				if(d==0) return "none";
				else return "block";
			});
	});
}
        
*/