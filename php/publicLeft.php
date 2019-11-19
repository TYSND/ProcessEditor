<?php
	require 'dblogin.php';
	$uid=$_SESSION['userid'];
	$mynickres=mysqli_query($con,"
		select nick from userinfo
		where
		userid=$uid
	;");
	if(!$mynickres)
	{
		$mynick="empty";
	}
	$mynickrow=mysqli_fetch_array($mynickres);
	$mynick=$mynickrow['nick'];
echo <<<publiccode
		<h1>流程管理系统</h1>
	<lBody>
		<div id="navigatorBar">
			<h2 style="margin-left:10%;">导航</h2>
			<div class="" style="width:100%">
				<a href="myApply.html"><div class="navBarItem">我的申请</div></a>
				<a href="myCheck.html"><div class="navBarItem">我的审批</div></a>
				<a href="myProcess.html"><div class="navBarItem">我的流程</div></a>
			</div>
		</div>
		<div class="bar titlefont" style="width:95%;text-align:center;">
			欢迎,$mynick
		</div>
		<button class="submitBut" onclick="location.href=\'php/quit.php\'" style="width:100%;margin:5px 0 5px 0">
			退出登录
		</button>
	</lBody>
publiccode;
?>