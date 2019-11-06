function get(id){
	return document.getElementById(id);
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