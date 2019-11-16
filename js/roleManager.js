function roleManager(){
	/*store position->userid*/
	var posi={};
	/*store this process users' id->name*/
	var users={};
	/*store id of users not assigned*/
	var lastUsers=[];
	/*public null option node,appended to reseted selects*/
	var nullOpt=createOpt(" --- 空 --- ","","none");
	/*public handle */
	var that=this;
	function createOpt(innerhtml,value,selected){
		var tmp=document.createElement("option");
		tmp.text=innerhtml;
		tmp.value=value;
		tmp.selected=selected;
		return tmp;
	}
	
	this.initial=function(jstr){
		log("users "+users.length);
		log(users);
		/*use jstr Json object to initialize posi[] and users[]*/
		get('submitBut').addEventListener('click',that.submit);
		
		for (var i=0;i<jstr.users.length;i++){
			log(i+" new users:"+jstr.users[i].id+"  name:"+jstr.users[i].name);
			users[jstr.users[i].id]=jstr.users[i].name;
			log(users.length);
			lastUsers.push(jstr.users[i].id);
		}
		for (var i in jstr.positions){
			posi[jstr.positions[i].pos]=jstr.positions[i].userid;
			if (jstr.positions[i].userid!=null)
				that.assignPos(jstr.positions[i].pos,jstr.positions[i].userid);
			get(jstr.positions[i].pos).addEventListener("click",that.genOptFor);
			get(jstr.positions[i].pos).addEventListener("change",that.assignPos);
		}
		
		log(users);
		log(lastUsers);
		log(posi);
	}
	
	this.assignPos=function(e){
		var select=e.target;
		var selectId=select.id;
		if (posi[selectId]!="")
			lastUsers.push(posi[selectId]);
		if (select.value!="")
			lastUsers.splice(lastUsers.indexOf(select.value),1);
		posi[selectId]=select.value;
		//select.addEventListener("click",that.genOptFor);
		log("assignPos");
		log(select.value);
		log(lastUsers);
	}
	
	this.resetSelect=function(selectId){
		var select=get(selectId);
		if (select.value=="")	//already null
			return;
		/*restore selected user to lastUsers array*/
		lastUsers.push(select.value);
		while(select.options.length>0)
			select.options.remove(0);
		select.options.add(nullOpt,0);
		select.value="";
		posi[selectId]="";
		log("reset");
		log("options:");log(select.options.length);
		log("lastUsers:");log(lastUsers);
	}
	
	
	//warning:this is buggy!!!
	this.genOptFor=function(e){
		/*when user click role's select,let users not
		 *selected and the null option be this select's options
		 */
		log("genOptFor");
		var h=e.target,valueBef=h.value;
		log(h);
		if (h.tagName=="OPTION")
			return;
		var newUser=lastUsers.slice(0);	//make a copy,not a reference
		newUser.push("");
		if (h.value!="")
			newUser.push(h.value);
		log("newUser:");
		log(newUser);
		/*remove select's options not in lastusers*/
		for (var i=0;i<h.options.length;i++){
			var uid=h.options[i].value;
			if (lastUsers.indexOf(uid)==-1){
				h.options.remove(i);
				i--;
			}
			else{
				newUser.splice(newUser.indexOf(uid),1);
			}
		}
		log(newUser);
		/*insert lastusers not in select's options*/
		h.options.add(nullOpt,0);
		newUser.splice(newUser.indexOf(""),1);
		newUser.sort(function(a,b){
			return a-b;
		});
		for (var i=0;i<newUser.length;i++){
				var tmp=createOpt(users[newUser[i]],newUser[i],"");
				h.options.add(tmp);
			}
		h.value=valueBef;		//restore selected value
		log("aft:");
		log(lastUsers);
	}
	
	this.submit=function(){
		var jstr={
			positions:[],
		};
		for (var key in posi){
			jstr.positions.push(
				{
					pos:key,
					userid:posi[key],
				}
			);
		}
		log(jstr);
		var form=document.createElement("form");
		form.type="hidden";
		form.method='POST';
		form.action='php/manage.php';
		document.body.appendChild(form);
		form.appendChild(hiddenInput("jstr",jstr));
		form.appendChild(hiddenInput("processid",geturlpara(location.href,"processid")));
		form.submit();
	}
}