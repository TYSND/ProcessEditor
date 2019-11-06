<?php
	session_start();
	$uid=$_SESSION['userid'];
	require 'dblogin.php';
	
	$jstr=$_POST['jstr'];
	$pname='default';
	
	
	//可能需要roll back
	$pidres=mysqli_query($con,"
		select max(processid) as mpid from processinfo
	;");
	$pidrow=mysqli_fetch_array($pidres);
	$pid=$pidrow['pid']+1;
	$stares=mysqli_query($con,"
		insert into processinfo
		values
		($pid,'{$pname}',$uid)
	;");
	
	$arr=json_decode($json,true);
	
	foreach($arr['nodes'] as $ankey=>$anval)
	{
		$noderes=mysqli_query($con,"
			insert into procstameaning
			values
			($pid,$ankey+1,'{$anval}')
		;");
		
	}
	
	foreach($arr['edges'] as $aekey=>$aeval)
	{
		$f=$aeval['from'];
		$t=$aeval['to'];
		$vname=$aeval['varName'];
		$vl=$aeval['varLow'];
		$vh=$aeval['varHi'];
		//这里可能有问题，有数据之后再改
		if($vname!="")
		{
			$varres=mysqli_query($con,"
				insert into processvariety
				values
				($pid,'{$vname}')
			;");
		}
		$peres=mysqli_query($con,"
			insert into processedge
			values
			($pid,$f,$t,'{$vname}',$vl,$vh)
		;");
	}
	
?>