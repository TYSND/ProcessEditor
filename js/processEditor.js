//processeditor=new processEditor();
function processEditor(){
	/*this is parent class for processEditor*/
	this.processTitle="";
	var nodes=[];	//all nodes
	
	var vars=[];	//all judging variety
	
	/*all reviewer id.also donates nodes id.
	 *have "start" and "end" node in initial
	 */
	var reviewers=[];
	
	var c=get("canvas");
	var ctx=c.getContext("2d");
	
	var nodeWidth=40,nodeHeight=32;
	/*2 dimension array storing all edges.
	 *2 keys for from node id and to node id
	 */
	var edges=[];
	
	var that=this;
	var canvasWidth=get("canvas").width,canvasHeight=get("canvas").height;
	
	
	this.subWin={
		/*object store all subWin's function*/
		addVar:function(){
			var varArea=document.getElementById('varArea');
			var varInput=document.getElementById('varInput');
			var newVar=document.createElement('div');
			newVar.innerHTML=varInput.value;
			varInput.value='';
			newVar.className='category fl';
			varArea.appendChild(newVar);
		},
		addReviewer:function(){
			var reviewerArea=document.getElementById('reviewerArea');
			var reviewerInput=document.getElementById('reviewerInput');
			var newReviewer=document.createElement('div');
			newReviewer.innerHTML=reviewerInput.value;
			reviewerInput.value='';
			newReviewer.className='category fl';
			reviewerArea.appendChild(newReviewer);
		},
	}
	
	this.initial=function(){
		/*add default start&end node*/
		this.createNode("start");
		this.createNode("end");
		nodeWidth=get("start").offsetWidth;
		nodeHeight=get("start").offsetHeight;
		get("start").style.top=(canvasHeight/2)+"px";
		get("end").style.top=(canvasHeight/2)+"px";get("end").style.left=(canvasWidth-nodeWidth)+"px";
		openSubWin(`
					<div>
						输入流程标题<input type='text' id='processTitle'/>
					</div>
					<div>
						输入变量<input id='varInput'/>
					<button onclick='processeditor.subWin.addVar();'>添加变量</button>
					</div>
					<div id='varArea' style='width:80%'></div>
					<div class='killFloat'></div>
					<div>
						输入审核人<input id='reviewerInput'/>
					<button onclick='processeditor.subWin.addReviewer();'>添加审核人</button>
					</div>
					<div id='reviewerArea' style='width:80%'></div>
					<div class='killFloat'></div>
					`,
					function(){
						log(vars);
						that.processTitle=get("processTitle").value;
						/*push inputed varietys into array*/
						var varArea=get('varArea');
						for (var i=0;i<varArea.childNodes.length;i++){
							log("child node:"+varArea.childNodes[i]);
							vars.push(varArea.childNodes[i].innerHTML);
						}
						log("varietys:"+vars);
						/*push inputed reviewers into array*/
						var reviewerArea=get('reviewerArea');
						for (var i=0;i<reviewerArea.childNodes.length;i++){
							log("child node:"+reviewerArea.childNodes[i]);
							reviewers.push(reviewerArea.childNodes[i].innerHTML);
						}
						log("reviewers:"+reviewers);
						/*initial edegs array*/
						edges["start"]=[]
						edges["end"]=[];
						for (var i=0;i<reviewers.length;i++)
						{
							edges[reviewers[i]]=[];
						}
					}
				);
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
		subWinStr="<div class='titlefont'>select reviewer:</div>\
						<select id='reviewerSelect'>";
		log("reviewers:"+reviewers);
		for (var i=0;i<reviewers.length;i++)
		{
			subWinStr+="<option value='"+reviewers[i]+"'>"+reviewers[i]+"</option>";
		}
		subWinStr+="</select>";
		/*after close reviewer window,append new node*/
		openSubWin(subWinStr,function(){
				var reviewer=get("reviewerSelect").value;	//get selected reviewer
				that.createNode(reviewer);
			}
		);
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
		/*color for different status edges*/
		var color=["rgba(90, 125, 174, 0.4)","rgba(61, 198, 61, 0.51)","rgba(217, 118, 118, 0.61)"];
		for (var i in edges)
		{
			for (var j in edges[i])
			{
				if (edges[i][j].status!=undefined){
					
					that.lineNodeToNode(i,j,ctx,color[edges[i][j].status]);
				}
				else	that.lineNodeToNode(i,j,ctx);
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
		var newWinText="<div>select variety:</div>\
								<select id='varietySelect'>";
		for (var i=0;i<vars.length;i++)
			newWinText+="<option value='"+vars[i]+"'>"+vars[i]+"</option>";
		newWinText+="</select>\
					<div>variety lower bound<input id='varietyLow' value='0'/></div>\
					<div>variety higher bound<input id='varietyHi' value='100'/></div>\
					";
		openSubWin(newWinText,function(){
				//newWin.get=util.get;
				/*load info from subWin*/
					that.createEdge(document.getElementById("varietySelect").value,
								document.getElementById("varietyLow").value,
								document.getElementById("varietyHi").value
								);
				}
			);
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
				that.clearEdges();
				that.reDrawEdges();
				//that.lineNodeToNode(selected[0],selected[1],ctx,"blue");
				that.clearUp();
			}
		}
	}
	
	this.submit=function(){
		/*submit JSON string*/
		var jstr={};
		jstr.title=that.processTitle;
		jstr.nodes=[];
		jstr.vars=[];
		for (var i in vars)
			jstr.vars.push(vars[i]);
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
		/*create hidden form and submit*/
		var myForm=document.createElement("form"),myInput=document.createElement("input");
		myForm.style.visibility="hidden";
		myForm.action="php/createProcess.php";
		myForm.method="POST";
		
		myInput.style.visibility="hidden";
		myInput.type="TEXT";
		myInput.name="jstr";
		myInput.value=jstr;
		
		myForm.appendChild(myInput);
		log(myInput.value);
		get("editArea").appendChild(myForm);
		myForm.submit();
		get("editArea").removeChild(myForm);
	}
	
	
	this.drawApply=function(jstr){
		/*function only used in showApply.html.
		 *jstr:JSON object store graph structure.
		 *jstr generated by PHP
		 */
		for (var i in jstr.nodes){
			log("nodes:"+jstr.nodes[i]);
			//nodes.push(jstr.nodes[i]);
			nodes[jstr.nodes[i]]={};
			edges[jstr.nodes[i]]=[];
		}
		for (var i in jstr.edges){
			edges[jstr.edges[i].from][jstr.edges[i].to]={
				varName:jstr.edges[i].varName,
				varLow:jstr.edges[i].varLow,
				varHi:jstr.edges[i].varHi,
				status:jstr.edges[i].status,
			};
			if (jstr.edges[i].varName!=null){
				/*create judging variety text on edge*/
				var newText=document.createElement("div");
				newText.id=textId(jstr.edges[i].from,jstr.edges[i].to);
				newText.className="varietyText";
				newText.innerHTML=jstr.edges[i].varLow+" <= "+jstr.edges[i].varName+" <= "+jstr.edges[i].varHi;
				
				log("new variety edge:"+newText.id+" "+newText.innerHTML);
				get("editArea").appendChild(newText);
				//centerVarText(selected[0],selected[1]);		//make text center
			}
		}
		nodes["start"].depth=0;
		/*store nodes with depth as index*/
		var depth=[];
		depth[0]=["start"];
		var q=["start"];
		while(q.length>0){
			var now=q.shift();
			for (var i in edges[now]){
				if (nodes[i].depth==undefined){
					nodes[i].depth=nodes[now].depth+1;
					if (depth[nodes[i].depth]==undefined)
						depth[nodes[i].depth]=[];
					depth[nodes[i].depth].push(i);
					q.push(i);
				}
			}
		}
		
		var maxLayer=0;		//max num of nodes in same depth
		for (var dep in depth)
			maxLayer=Math.max(maxLayer,depth[dep].length);
		
		log("maxLayer:"+maxLayer);
		/*draw nodes in depth as layer*/
		for (var dep in depth){
			var x=(canvasWidth*0.9)/(depth.length-1)*dep+canvasWidth*0.02;
			for (var i in depth[dep]){
				
				log("node:"+depth[dep][i]+" depth:"+dep+" ind:"+i);
				
				var y;
				if (maxLayer==1)	y=0.5*canvasHeight;
				//else	y=(0.5-((depth[dep].length-1)/2+i)*0.7/(maxLayer-1))*canvasHeight;
				else y=0.5*canvasHeight-0.7*canvasHeight*(depth[dep].length-1)/(maxLayer-1)/2+0.7*canvasHeight*i/(maxLayer-1);
				log(y);
				var handle=document.createElement("div");	//create new node
				handle.id=depth[dep][i];
				handle.className="processNode";
				handle.innerHTML+="<div>"+handle.id+"</div>";
				handle.style.top=y+"px";handle.style.left=x+"px";
				get("editArea").appendChild(handle);		//render node to page
			}
		}
		that.reDrawEdges();
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
}
