<?php
	require 'php/dblogin.php';
	$pid=$_GET['processid'];
	$arr=Array();
	$pmemres=mysqli_query($con,"
		select userid from processmember
		where
		processid=$pid and usersta>0
	;");
	if(!$pmemres)
	{
		echo '';
		exit();
	}
	while($pmemrow=mysqli_fetch_array($pmemres))
	{
		$uid=$pmemrow['userid'];
		$nickres=mysqli_query($con,"
			select nick from userinfo
			where
			userid=$uid
		;");
		if(!$nickres)
		{
			echo "";
			exit();
		}
		$nickrow=mysqli_fetch_array($nickres);
		$nick=$nickrow['nick'];
		
		$tmpu=Array();
		$tmpu['id']=$uid;
		$tmpu['name']=$nick;
		$arr['users'][]=$tmpu;
	}
		
	$psmres=mysqli_query($con,"
		select * from procstameaning
		where
		processid=$pid
	;");
	if(!$psmres)
	{
		echo "";
		exit();
	}
	
	while($psmrow=mysqli_fetch_array($psmres))
	{
		$usta=$psmrow['usersta'];
		$pos=$psmrow['meaning'];
		if($pos=="start"||$pos=="end") continue;
		//echo $usta.' '.$pos.'<br/>';
		$pmemres=mysqli_query($con,"
			select userid from processmember
			where
			processid=$pid and usersta=$usta
		;");
		if(!$pmemres)
		{
			echo '';
			exit();
		}
		$pmemrow=mysqli_fetch_array($pmemres);
		$uid=$pmemrow['userid'];
		if($uid!="")
		{
			$nickres=mysqli_query($con,"
				select nick from userinfo
				where
				userid=$uid
			;");
			if(!$nickres)
			{
				echo "";
				exit();
			}
			$nickrow=mysqli_fetch_array($nickres);
			$nick=$nickrow['nick'];
		}
		else
		{
			$nick="";
		}
		
		
		$tmpp=Array();
		$tmpp['pos']=$pos;
		$tmpp['userid']=$uid;
		$arr['positions'][]=$tmpp;
	}
	$json=json_encode($arr);
	echo $json;
	
?>