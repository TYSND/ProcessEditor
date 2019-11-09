function get(id){
	return document.getElementById(id);
}

function openSubWin(innerHtml,beforeUnloadFunc){
	var subWin=document.createElement("div");
	subWin.style="	width:"+window.outerWidth+"px;height:"+window.outerHeight+"px;\
					position:fixed;background:rgba(15, 19, 66, 0.55);top:0;left:0;";
	subWin.innerHTML="<div class='bar' style='height:auto;width:30%;margin-left:auto;margin-right:auto;'>"+innerHtml+
					"<div><button class='submitBut' id='subWinBut'>提交</button></div>"+"</div>";
	document.body.appendChild(subWin);
	subWin.childNodes[0].style.marginTop=(window.outerHeight-subWin.childNodes[0].offsetHeight*2)/2+"px";
	//log((window.innerHeight-subWin.offsetHeight)/2);
	//subWin.childNodes[0].style.marginTop="300px";
	get("subWinBut").onclick=function(){
		beforeUnloadFunc();
		document.body.removeChild(subWin);
	};
}

function geturlpara(nowurl,paraname){
	if (nowurl.indexOf(paraname)==-1)	return "";
	var begin=nowurl.indexOf(paraname)+paraname.length+1;
	var end=nowurl.indexOf("&",begin);
	/*最后一个参数*/
	if (end==-1)	end=nowurl.length;
	return nowurl.substr(begin,end-begin);
}

function log(str){
	console.log(str);
}

var util={
	get:function(id){
		return document.getElementById(id);
	},

	geturlpara:function(nowurl,paraname){
		if (nowurl.indexOf(paraname)==-1)	return "";
		var begin=nowurl.indexOf(paraname)+paraname.length+1;
		var end=nowurl.indexOf("&",begin);
		/*最后一个参数*/
		if (end==-1)	end=nowurl.length;
		return nowurl.substr(begin,end-begin);
	},

	log:function(str){
		console.log(str);
	}
};