<?php
	session_start();
	$uid=$_SESSION['userid'];
	$pid=$_POST['processid'];
	$aname=$_POST['applyname'];
	$areason=$_POST['applyreason'];
	
	require 'dblogin.php';
	$aidres=mysqli_query($con,"
		select max(applyid) as maid
		from applyinfo
	;");
	if(!$aidres)
	{
		echo 'applyid error';
		exit();
	}
	$cdt=new \DateTime();
	$cdt=$cdt->format("Y-m-d H:i:s");
mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
mysqli_autocommit($con,FALSE);	
	$aidrow=mysqli_fetch_array($aidres);
	$maid=$aidrow['maid'];
	$aid=$maid+1;
	
	$flag=1;
	
	$ainfores=mysqli_query($con,"
		insert into applyinfo
		values
		($aid,$uid,$pid,'{$aname}','{$areason}')
	;");
	$flag=$flag&$ainfores;
	$aresres=mysqli_query($con,"
		insert into applyres
		values
		($aid,0)
	;");
	$flag=$flag&$aresres;
	$var=Array();
	$pvres=mysqli_query($con,"
		select variety from processvariety
		where
		processid=$pid
	;");
	$flag&=$pvres;
	while($pvrow=mysqli_fetch_array($pvres))
	{
		$v=$pvrow['variety'];
		$vv=$_POST[$v]
		$var[$v]=$vv;
		$avres=mysqli_query($con,"
			insert into applyvariety
			values
			($aid,'{$v}',$vv)
		;");
		$flag&=$avres;
	}
	$peres=mysqli_query($con,"
		select * from processedge
		where
		processid=$pid
	;");
	$flag&=$peres;
	$startres=mysqli_query($con,"
		select usersta from procstameaning
		where
		processid=$pid and meaning='start'
	;");
	$flag&=$startres;
	$startrow=mysqli_fetch_array($startres);
	$startsta=$startrow['usersta'];
	while($perow=mysqli_fetch_array($peres))
	{
		$f=$perow['fromusersta'];
		$t=$perow['tousersta'];
		$v=$perow['variety'];
		$l=$perow['leftval'];
		$r=$perow['rightval'];
		$res=0;
		if($f==$startsta)	$res=1;
		if($v=="")
		{
			$aeres=mysqli_query($con,"
				insert into allapplyedge
				values
				($aid,$f,$t,$res,'{$cdt}')
			;");
			$flag&=$aeres;
		}
		else
		{
			if($l<=$var[$v]&&$r>=$var[$v])
			{
				$aeres=mysqli_query($con,"
					insert into allapplyedge
					values
					($aid,$f,$t,$res,'{$cdt}')
				;");
				$flag&=$aeres;
			}
		}
		
	}

if($flag)
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