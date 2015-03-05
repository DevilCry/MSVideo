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
	var pointValue=new Array(pointNum);
	for(var i=0;i<pointNum;i++)
	{
		pointValue[i]=0;
	}
	var number;
	for(var i=0;i<Points.length;i++)
	{
		number=Points[i].number;
		if(Points[i].name==srcName)
		{
			pointValue[number]=pointValue[number]|2;
		}
		
		//srcName 可能即 desName
		if(Points[i].name==desName)
		{
			pointValue[number]=pointValue[number]|1;
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
dataLine: 	情节线
使用条件：des>src， （des<src 则解为空，des=src 则解为Nu[0]）
返回结果：人物在事件中的所有合法路径
*/
function getTimeLinePath(Nu,Na,dataLine,pointNum,Points)
{
	var edge=new Array();		//the edge for dfs, [src,des,length]
	var timeLinePath=new Array(); 	//save the path of timeLine
	var tmpPath=[];	//tmp path for dfs;
	var stack=[];	//stack for dfs
	var src=Nu[0];
	var des=Nu[1];
	var s,e,i,sp,bsp,tmpPoint,oldsp;
	var branchNum=[];
	//des > src
	var pointValue=point2value(pointNum,Points,Na[0],Na[1]);
	
	for(i=0;i<dataLine.length;i++)
	{
		s=dataLine[i].s;
		e=dataLine[i].e;
		if(pointValue[s]&pointValue[e]){
			edge.push(s);
			edge.push(e);
			edge.push(dataLine[i].len);
		}	
	}
	
	console.log("pointValue: "+pointValue);
	console.log("src: "+src+"des: "+des);
	console.log("edge: "+edge);
	console.log("srcName: "+Na[0]+"desName: "+Na[1]);
	
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

		for(i=0;i<edge.length;i=i+3)
		{
			if(edge[i+0]==tmpPoint)
			{
				var tmp=edge[i+1];
				if(tmp< des)
				{
					stack.push(tmp);
					sp=sp+1;
				}
				else if(tmp==des)
				{
					var tmp=new Array();
					for(var j=0;j<tmpPath.length;j++)
					{
						tmp.push(tmpPath[j]);
					}
					tmp.push(des);
					console.log("path is "+tmp);
					timeLinePath.push(tmp);
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

	return timeLinePath;
}

/*
timeline: 所有的时间线
timepath: 选中的某条时间路径（注意，不是所有时间路径timeLinePath）
timevalue: 是否显示路径的标志
*/
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