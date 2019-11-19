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
		$vv=$_POST[$v];
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
	echo '<script>location.href="../index.html";</script>';
}
else
{
	mysqli_rollback($con);
	echo 'error'.'<br/>';
}
mysqli_autocommit($con,TRUE);
//循环将入度，出度为0的点删除（除start和end），直至没有相应的点
$stop=false;
//$cnt=20;
$vis=Array();
while(1)
{
	//echo $cnt.'<br/>';
	//$cnt--;
	//if($cnt==0)	break;
	if($stop)	break;
	$stop=true;
	//delete all nodes that indegree==0 with all edges that fromusersta=this node
	$ind0res=mysqli_query($con,"
		select usersta from procstameaning a
		where
		processid=$pid and
		usersta!=2 and usersta!=3 and
		(select count(*) from allapplyedge where applyid=$aid and tousersta=a.usersta)=0
	;");
	if(!$ind0res)
	{
		echo 'indegree error';
		exit();
	}
	//echo 'ind////////////////';
	while($ind0row=mysqli_fetch_array($ind0res))
	{
		//$stop=false;
		$usta=$ind0row['usersta'];
		if($usta=="")
		{
			//$stop=false;
			break;
		}
		if(in_array($usta,$vis))
		{
			continue;
		}
		array_push($vis,$usta);
		//echo $usta;
		$stop=false;
		$dres=mysqli_query($con,"
			delete from allapplyedge
			where
			applyid=$aid and fromusersta=$usta
		;");
		if(!$dres)
		{
			echo 'indegree delete error';
			exit();
		}
	}
	//echo '/////////////';
	//echo '<br/>';
	
	//delete all nodes that outdegree==0 with all edges that tousersta=this node
	$outd0res=mysqli_query($con,"
		select usersta from procstameaning a
		where
		processid=$pid and
		usersta!=2 and usersta!=3 and
		(select count(*) from allapplyedge where applyid=$aid and fromusersta=a.usersta)=0
	;");
	if(!$outd0res)
	{
		echo 'outdegree error';
		exit();
	}
	
//echo 'out///////////////////////////////';
	while($outd0row=mysqli_fetch_array($outd0res))
	{
		
		$usta=$outd0row['usersta'];
		if($usta=="")
		{
			//$stop=false;
			break;
		}
		if(in_array($usta,$vis))
		{
			continue;
		}
		array_push($vis,$usta);
		//echo $usta;
		$stop=false;
		$dres=mysqli_query($con,"
			delete from allapplyedge
			where
			applyid=$aid and tousersta=$usta
		;");
		if(!$dres)
		{
			echo 'outdegree delete error';
			exit();
		}
	}
//echo '///////////////////';
//echo '<br/>';
/*

select usersta from procstameaning a
where
processid=1 and 
usersta!=2 and usersta!=3 and
(select count(*) from allapplyedge where applyid=1 and tousersta=a.usersta)=0


select usersta from procstameaning a
where
processid=1 and 
usersta!=2 and usersta!=3 and
(select count(*) from allapplyedge where applyid=1 and fromusersta=a.usersta)=0

*/
}


?>