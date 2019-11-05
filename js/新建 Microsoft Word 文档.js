function processEditor(){
	/*this is parent class for processEditor.
	 */
	this.cnt=0;		//unique id for nodes,increase after new node
	this.nodes=[];	//all nodes
	/*2 dimension array storing all edges.
	 *2 keys for from node id and to node id
	 */
	this.edges=[];
	
	this.vars=[];	//all judging variety
	this.reviewers=[];	//all reviewer id
	
	this.addNode=function(){
		var handle="",id=cnt;	//HTML node id
		cnt++;
		var reviewer;
		/*
		todo:
			open sub window and fill reviewer;
			create new div and drag;
			after drag,update x,y coordinate;
			*/
		var top=get(handle).offsetTop,left=get(handle).offsetLeft;
		nodes.push(new node(left,top,id,reviewer));
	}
	
	this.addEdge=function(){
		var from,to;	//id of two nodes
		/*
		todo:
			get first node's id;
			get second node's id;
			check two node's edge valid or not;
			*/
		edges[from][to]=new edge(from,to,"","","");
		reDrawEdges();
	}
	
	this.addEdgeWithVar=function(){
		var from,to,varName,varLow,varHi;	//id of two nodes
		/*
		todo:
			get first node's id;
			get second node's id;
			get judging variety's name and lower&higher bound;
			check two node's edge valid or not;
			*/
		edges[from][to]=new edge(from,to,varName,varLow,varHi);
		reDrawEdges();
	}
}

function node(x,y,id,reviewer){
	/*x,y for node's horizonal&vertical coordinate,
	 *id for node's id,reviewer for node's reviewer's id
	 */
	this.x=x,this.y=y,this.id=id,this.reviewer=reviewer;
}

function edge(from,to,varName,varLow,varHi){
	/*id of two nodes,the optional variety's name
	 *and lower&higher bound of var.
	 *edges stored in public array
	 */
	this.from=from,this.to=to,this.varName=varName,
	this.varLow=varLow,this.varHi=varHi;
}