//processeditor=new processEditor();

function processEditor(){
	/*this is parent class for processEditor*/
	
	var nodes=[];	//all nodes
	
	var vars=["money","days","people"];	//all judging variety
	
	//reviewers=[];	//all reviewer id
	/*all reviewer id.also donates nodes id.
	 *have "start" and "end" node in initial
	 */
	var reviewers=["lll","ppp","jjj","rrr","start","end"];
	
	var c=get("canvas");
	var ctx=c.getContext("2d");
	
	/*2 dimension array storing all edges.
	 *2 keys for from node id and to node id
	 */
	var edges=[];
	for (var i=0;i<reviewers.length;i++)
	{
		edges[reviewers[i]]=[];
	}
	
	var subWin="";		//handle for sub window.only one sub window allowed any time
	
	var that=this;
	var canvasWidth=get("canvas").width,canvasHeight=get("canvas").height;
	this.nodeWidth=0,this.nodeHeight=0;
	
	this.initial=function(){
		this.createNode("start");		
		this.createNode("end");
		nodeWidth=get("start").offsetWidth;
		nodeHeight=get("start").offsetHeight;
		get("start").style.top=(canvasHeight/2)+"px";
		get("end").style.top=(canvasHeight/2)+"px";get("end").style.left=(canvasWidth-nodeWidth)+"px";
	}
	
	this.nodeClick=function(id){		
		/*public handle for all nodes' onclick function.
		 *change all nodes' by simply save nodeClick function
		 *before ,then make nodeClick=yourFunction.after this
		 *you can restore nodeClick by nodeClick=before
		 */
	}
	
	this.createNode=function(reviewer){
		/*create a new node into data structures and render to webpage*/
		log(reviewer);
		reviewers.splice(reviewers.indexOf(reviewer),1);	//delete reviewer
		var handle=document.createElement("div");	//create new node
		handle.id=reviewer;
		handle.className="processNode";
		handle.onclick=function(){
			that.nodeClick(handle.id);				//bind public onclick func
		}
		handle.innerHTML+="<div>"+reviewer+"</div>";
		handle.style.top="20px";handle.style.left="20px";
		get("editArea").appendChild(handle);		//render node to page
		dragElement(handle);	//make div draggable
		nodes.push(new node(handle.offsetLeft,handle.offsetTop,handle.id,reviewer));
	}
	
	this.addNode=function(){
		/*function after click add node button*/
		if (reviewers.length==0){
			alert("no more reviewers!");
			return;
		}
		subWin=window.open("","select reviewer","width=200,height=100");
		subWin.document.write("<div>select reviewer:</div>\
									<select id='reviewerSelect'>");
		log("reviewers:"+reviewers);
		for (var i=0;i<reviewers.length;i++)
		{
			subWin.document.write("<option value='"+reviewers[i]+"'>"+reviewers[i]+"</option>");
		}
		subWin.document.write("</select>");
		subWin.document.write("<button onclick='window.close();'>确定</button>");
		var that=this;				//handle of this in sub function
		/*after close reviewer window,append new node*/
		subWin.onbeforeunload=function(){
			var reviewer=subWin.document.getElementById("reviewerSelect").value;	//get selected reviewer
			//this.createNode(reviewer);
			that.createNode(reviewer);
		}
	}
	
	
	this.clearEdges=function(){
		/*erase edges before by redraw the lines with
		 *white line,however traces will last if not use 
		 *bigger line width.also,line cap need be erased with
		 *small white squre
		 */
		ctx.clearRect(0,0,c.width,c.height);return;
		var side=2,left1,left2,top1,top2;
		for (var i in edges)
		{
			for (var j in edges[i])
			{
				that.lineNodeToNode(i,j,ctx,"white","8");
				//clear end points of black edge with squre
				left1=get(i).offsetLeft,top1=get(i).offsetTop;
				left2=get(j).offsetLeft,top2=get(j).offsetTop;
				ctx.clearRect(left1-side,top1-side,left1+side,top1+side);
				ctx.clearRect(left2-side,top2-side,left2+side,top2+side);
			}
		}
	//	log("clear ok");
	}
	
	this.reDrawEdges=function(){
		/*after move node,add edge,delete edge,delete node,
		 *call this func to redraw all edges
		 */
		
//		ctx.clearRect(0,0,c.width,c.height);
		
		for (var i in edges)
		{
			for (var j in edges[i])
			{
				that.lineNodeToNode(i,j,ctx);
				if (edges[i][j].varName){
					centerVarText(i,j);		//keep text position centered
				}
			}
		}
	//	log("draw ok");
	}
	
	this.lineNodeToNode=function(from,to,ctx,style="rgba(90, 125, 174, 0.4)",width="6"){
		/*draw line from node with name from to node with name to*/
		ctx.strokeStyle=style;
		ctx.lineWidth=width;
		//ctx.lineCap="butt";
		ctx.beginPath();
		from=get(from);to=get(to);
		ctx.moveTo(from.offsetLeft+nodeWidth/2,from.offsetTop+nodeHeight/2);
		ctx.lineTo(to.offsetLeft+nodeWidth/2,to.offsetTop+nodeHeight/2);
		ctx.stroke();
	}
	
	this.addNormalEdge=function(){
		/*function after click addedge button*/
		this.createEdge("","","");
	}
	
	this.addVarEdge=function(){
		/*function after click addVarEdge button.
		 *get variety info before create edge
		 */
		subWin=window.open("","add variety edge","width=200,height=200");
		var newWin=subWin;
		var newWinText="<div>select variety:</div>\
								<select id='varietySelect'>";
		for (var i=0;i<vars.length;i++)
			newWinText+="<option value='"+vars[i]+"'>"+vars[i]+"</option>";
		newWinText+="</select>\
					<div>variety lower bound<input id='varietyLow' value='0'/></div>\
					<div>variety higher bound<input id='varietyHi' value='100'/></div>\
					<button onclick='window.close()' class='submitBut'>提交</button>\
					";
		newWin.document.write(newWinText);
		newWin.onbeforeunload=function(){
			//newWin.get=util.get;
			/*load info from subWin*/
			that.createEdge(newWin.document.getElementById("varietySelect").value,
							newWin.document.getElementById("varietyLow").value,
							newWin.document.getElementById("varietyHi").value);
		}
	}
	
	this.createEdge=function(varName,varLow,varHi){
		log(varName+" "+varLow+" "+varHi);
		
		var selected=[];				//store two selected node
		var beffunc=that.nodeClick;		//save onclick function before
		this.clearUp=function(){
			/*restore selected node css if unselect nodes or all nodes selected*/
			for (var i=0;i<selected.length;i++)
			{
				var tmp=get(selected[i]);
				tmp.className="processNode";	//restore css before
			}
			selected.splice(0,selected.length);
			that.nodeClick=beffunc;
		};
		that.nodeClick=function(id){
			if (selected.indexOf(id)>-1){
				/*node already selected,then go down unselect all nodes*/
				that.clearUp();
			}
			else{
				/*new selected node,*/
				selected.push(id);
				get(id).className="processNodeSelected";
				if (selected.length==1)	return;
				/*already 2 nodes selected,add edge and finish*/
				if (edges[selected[0]][selected[1]]||edges[selected[1]][selected[0]]){
					alert("edge already exist!");
					that.clearUp();
					return;
				}
				edges[selected[0]][selected[1]]=new edge(varName,varLow,varHi);
				if (varName!=""){
					/*create judging variety text on edge*/
					var newText=document.createElement("div");
					newText.id=textId(selected[0],selected[1]);
					newText.className="varietyText";
					newText.innerHTML=varLow+" <= "+varName+" <= "+varHi;
					
					log("new variety edge:"+newText.id+" "+newText.innerHTML);
					get("editArea").appendChild(newText);
					centerVarText(selected[0],selected[1]);		//make text center
				}
				that.reDrawEdges();
				//that.lineNodeToNode(selected[0],selected[1],ctx,"blue");
				that.clearUp();
			}
		}
	}
	
	this.submit=function(){
		var jstr={};
		jstr.nodes=[];
		for (var i in nodes)
			jstr.nodes.push(nodes[i].reviewer);
		jstr.edges=[];
		for (var i in edges)
		{
			for (var j in edges[i])
			{
				var tmp={
					from:i,
					to:j,
					varName:edges[i][j].varName,
					varLow:edges[i][j].varLow,
					varHi:edges[i][j].varHi,
				};
				jstr.edges.push(tmp);
			}
		}
		jstr=JSON.stringify(jstr);
		log(jstr);
	}
}

function centerVarText(node1,node2){
	/*make vareity text along the edge center between nodes*/
	var id=textId(node1,node2);
	get(id).style.top=Math.floor((get(node1).offsetTop+get(node2).offsetTop+nodeHeight-get(id).offsetHeight)/2)-5+"px";
	get(id).style.left=Math.floor((get(node1).offsetLeft+get(node2).offsetLeft+nodeWidth-get(id).offsetWidth)/2)+"px";
}

function textId(node1,node2){
	/*return id of text of judging variety edge*/
	return "text"+node1+"&"+node2;
}

function node(x,y,id,reviewer){
	/*x,y for node's horizonal&vertical coordinate,
	 *id for node's id,reviewer for node's reviewer's id
	 */
	this.x=x,this.y=y,this.id=id,this.reviewer=reviewer;
}

function edge(varName,varLow,varHi){
	/*id of two nodes,the optional variety's name
	 *and lower&higher bound of var.
	 *edges stored in public array
	 */
	this.varName=varName,
	this.varLow=varLow,this.varHi=varHi;
}