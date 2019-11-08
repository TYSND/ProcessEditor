<?php
	session_start();
	$uid=$_SESSION['userid'];
	require 'dblogin.php';
	
	$jstr=$_POST['jstr'];
	$pname='default';
	
	//echo $jstr;
	
	//可能需要roll back
	$pidres=mysqli_query($con,"
		select max(processid) as mpid from processinfo
	;");
	$pidrow=mysqli_fetch_array($pidres);
	$pid=$pidrow['mpid']+1;
//echo '$pid '.$pid.'<br/>';	
	//$sql="insert into processinfo values ($pid,'{$pname}',$uid);";
	//echo $sql;
mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
mysqli_autocommit($con,FALSE); 
	$res=mysqli_query($con,"insert into processinfo values ($pid,'{$pname}',$uid);");
//echo 'info '.$res.'<br/>';
	$arr=json_decode($jstr,true);
	
	
//print_r($arr);
	$cnt=2;
	$staarr=Array();
	foreach($arr['nodes'] as $ankey=>$anval)
	{
//echo $cnt.' '.$anval.'<br/>';
		$res1=mysqli_query($con,"insert into procstameaning values ($pid,$cnt,'{$anval}');");
//echo '$res1 '.$res1;
		$res=$res&$res1;
//echo $anval.' '.$res.'<br/>';
$staarr[$anval]=$cnt;
		$cnt++;
	}
	
	foreach($arr['edges'] as $aekey=>$aeval)
	{
		$fn=$aeval['from'];
		$tn=$aeval['to'];
		$f=$staarr[$fn];
		$t=$staarr[$tn];
		$vname=$aeval['varName'];
		$vl=$aeval['varLow'];
		$vh=$aeval['varHi'];
//echo $f.' '.$t.' '.$vname.' '.$vl.' '.$vh.'<br/>';
		//这里可能有问题，有数据之后再改
		if($vname!="")
		{
			//echo $f.' '.$t.' '.$vname.' '.$vl.' '.$vh.'<br/>';
			$res1=mysqli_query($con,"insert into processvariety values ($pid,'{$vname}');");
			$res=$res&$res1;
//echo $f.' '.$t.' '.$vname.' '.$vl.' '.$vh.' '.$res.'<br/>';

			$res1=mysqli_query($con,"insert into processedge values ($pid,$f,$t,'{$vname}',$vl,$vh);");
			$res=$res&$res1;
//echo 'edge var'.$res.'<br/>';

		}
		else
		{
			$res1=mysqli_query($con,"insert into processedge (processid,fromusersta,tousersta) values ($pid,$f,$t);");
			$res=$res&$res1;
//echo 'edge '.$res.'<br/>';
		}
	}
	// if(mysqli_commit($con))
	// {
		// echo 'success';
	// }
	// else
	// {
		// mysqli_rollback($con);
		// echo 'error';
	// }
	
	if($res)
	{
		mysqli_commit($con);
		echo 'success'.'<br/>';
	}
	else
	{
		mysqli_rollback($con);
		echo 'error'.'<br/>';
	}	
	mysqli_autocommit($con,TRUE); 
?>