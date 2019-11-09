<?php
	$aid=$_GET['applyid'];
	$arr=Array();
	require 'dblogin.php';
	$pidres=mysqli_query($con,"
		select processid from applyinfo
		where
		applyid=$aid
	;");
	if(!$pidres)
	{
		echo 'apply error';
		exit();
	}
	$pidrow=mysqli_fetch_array($pidres);
	$pid=$pidrow['processid'];
	
	$nodesres=mysqli_query($con,"
		select usersta,meaning from procstameaning
		where
		processid=$pid
	;");
	if(!$nodesres)
	{
		echo 'nodes error';
		exit();
	}
	$tmpnodes=Array();
	while($nodesrow=mysqli_fetch_array($nodesres))
	{
		$tmpnodes[$nodesrow['usersta']]=$nodesrow['meaning'];
		array_push($arr['nodes'],$nodesrow['meaning']);
	}
	$edgeres=mysqli_query($con,"
		select * from allapplyedge
		where
		applyid=$aid
	;");
	if(!$edgeres)
	{
		echo 'edge error';
		exit();
	}
	while($edgerow=mysqli_fetch_array($edgeres))
	{
		$tmpedge=Array();
		$fs=$edgerow['fromusersta'];
		$ts=$edgerow['tousersta'];
		$pvres=mysqli_query($con,"
			select variety,leftval,rightval from processedge
			where
			processid=$pid
			and fromusersta=$fs
			and tousersta=$ts
		;");
		if(!$pvres)
		{
			echo 'pv error';
			exit();
		}
		$pvrow=mysqli_fetch_array($pvres);
		$tmpedge['from']=$tmpnodes[$edgerow['fromusersta']];
		$tmpedge['to']=$tmpnodes[$edgerow['tousersta']];
		$tmpedge['varName']=$pvrow['variety'];
		$tmpedge['varLow']=$pvrow['leftval'];
		$tmpedge['varHi']=$pvrow['rightval'];
		$tmpedge['status']=$edgerow['res'];
		
		array_push($arr['edges'],$tmpedge);
	}
	
	$json=json_encode($arr);
?>