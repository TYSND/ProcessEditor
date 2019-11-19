<?php
	require 'dblogin.php';
	$pid=$_POST['processid'];
	$jstr=$_POST['jstr'];
echo $jstr;
echo '<br/>';
//exit();
	$arr=json_decode($jstr,true);
mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
mysqli_autocommit($con,FALSE); 
$res=1;
	foreach($arr['positions'] as $akey=>$aval)
	{
		$upos=$aval['pos'];
		$uid=$aval['userid'];
		if($uid=="")	continue;
		$pmres=mysqli_query($con,"
			select usersta from procstameaning
			where
			processid=$pid and meaning='{$upos}'
		;");
		$res&=$pmres;
		$pmrow=mysqli_fetch_array($pmres);
		$usta=$pmrow['usersta'];
		
		$inpmres=mysqli_query($con,"
			update processmember set usersta=$usta
			where
			processid=$pid and userid=$uid
		;");
		$res&=$inpmres;
	}
if($res)
{
	mysqli_commit($con);
	echo 'success'.'<br/>';
	echo '<script>location.href="../index.html";</script>';
}
else
{
	mysqli_rollback($con);
	echo 'error'.'<br/>';
}	
mysqli_autocommit($con,TRUE); 
?>