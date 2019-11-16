<?php
	session_start();
	require 'dblogin.php';
	$uid=$_SESSION['userid'];
	$aid=$_GET['applyid'];
	$res=$_GET['res'];

	$ainfores=mysqli_query($con,"
		select * from applyinfo
		where
		applyid=$aid
	;");
	if(!$ainfores)
	{
		echo 'apply is error!';
		exit();
	}
	$ainforow=mysqli_fetch_array($ainfores);
	$pid=$ainforow['processid'];
	$appuid=$ainforow['userid'];//申请人id
	$aname=$ainforow['applyname'];
	
	$mystares=mysqli_query($con,"
		select usersta from processmember
		where
		processid=$pid and userid=$uid
	;");
	if(!$mystares)
	{
		echo 'my sta error';
		exit();
	}
	$mystarow=mysqli_fetch_array($mystares);
	$mysta=$mystarow['usersta'];
	/*
		0 待审核 
		1 通过
		2 不通过
		先判断applyres中这个申请是否已被拒绝
		判断res是通过还是不通过，如果不通过，则不必进行下面的更新
		再判断$res是通过还是不通过
		如果通过，则更新所有出边的结果为通过，并检查所有出边到达的节点，是否要提醒，如果要，就发邮件，如果下个点是end，那么申请通过，提醒申请人
		如果拒绝，则更新所有出边的结果为拒绝，并更新applyres表中，该申请的res为不通过
	*/
	$aresres=mysqli_query($con,"
		select res from applyres
		where
		applyid=$aid
	;");
	$aresrow=mysqli_fetch_array($aresres);
	if($aresrow['res']==2)
	{
		echo 'over';
		exit();
	}
	$cdt=new \DateTime();
	$cdt=$cdt->format("Y-m-d H:i:s");
	if($res==2)
	{
		mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		mysqli_autocommit($con,FALSE);
		$upres1=mysqli_query($con,"
			update applyres
			set res=2
			where applyid=$aid
		;");
		$upres2=mysqli_query($con,"
			update allapplyedge
			set res=2,checktime='{$cdt}'
			where
			applyid=$aid and fromusersta=$mysta
		;");
		if($upres1&&$upres2)
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
	}
	else if($res==1)
	{
		mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		mysqli_autocommit($con,FALSE);
		$flag=1;
		$upres=mysqli_query($con,"
			update allapplyedge
			set res=1,checktime='{$cdt}'
			where
			applyid=$aid and fromusersta=$mysta
		;");
		$flag=$flag&$upres;
echo 'update allapplyedge '.$flag.'<br/>';
		$nxtres=mysqli_query($con,"
			select tousersta from allapplyedge
			where
			applyid=$aid and fromusersta=$mysta
		;");
		$flag=$flag&$nxtres;
echo 'select nxt '.$flag.'<br/>';
		while($nxtrow=mysqli_fetch_array($nxtres))
		{
			$nxt=$nxtrow['tousersta'];
			//查询nxt点的所有入边是否都通过，若都通过，则提醒nxt
			$indres=mysqli_query($con,"
				select count(*) as ind from allapplyedge
				where
				applyid=$aid and tousersta=$nxt
			;");
			$flag=$flag&$indres;
echo 'select nxt ind '.$flag.'<br/>';
			$indrow=mysqli_fetch_array($indres);
			
			$indokres=mysqli_query($con,"
				select count(*) as ind from allapplyedge
				where
				applyid=$aid and tousersta=$nxt and res=1
			;");
			$flag=$flag&$indokres;
echo 'select nxt ok ind '.$flag.'<br/>';
			$indokrow=mysqli_fetch_array($indokres);
			
			if($indrow['ind']==$indokrow['ind'])
			{
				$nxtmeanres=mysqli_query($con,"
					select meaning from procstameaning
					where
					processid=$pid and usersta=$nxt
				;");
				$flag=$flag&$nxtmeanres;
echo 'select nxt sta mean '.$flag.'<br/>';				
				$nxtmeanrow=mysqli_fetch_array($nxtmeanres);
				if($nxtmeanrow['meaning']=='end')
				{
					$upres1=mysqli_query($con,"
						update applyres
						set res=1
						where applyid=$aid
					;");
					$flag=$flag&$upres1;
					//提醒申请人申请已通过
					$aemailres=mysqli_query($con,"
						select email from userinfo
						where
						userid=$appuid
					;");
					$flag=$flag&$aemailres;
					$aemailrow=mysqli_fetch_array($aemailres);
					$email=$aemailrow['email'];
					
					//send email.......
				}
				else
				{
					//提请nxt对应的审核人，有一个申请自己审核
					$nuidres=mysqli_query($con,"
						select userid from processmemeber
						where
						processid=$pid and usersta=$nxt
					;");
					$flag=$flag&$nuidres;
echo 'select nxt user '.$flag.'<br/>';					
					$nuidrow=mysqli_fetch_array($nuidres);
					$nuid=$nuidrow['userid'];
					$nemailres=mysqli_query($con,"
						select email from userinfo
						where
						userid=$nuid
					;");
					$flag=$flag&$nemailres;
echo 'select nxt email '.$flag.'<br/>';
					$nemailrow=mysqli_fetch_array($nemailres);
					$email=$nemailrow['email'];
					
					//send email.......
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
	}
?>