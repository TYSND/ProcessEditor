<?php
require 'dblogin.php';
mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
mysqli_autocommit($con,FALSE);
//mysqli_query("START TRANSACTION");
$res1=mysqli_query($con,"
insert into applyres
values
(1,1);
;");
echo '$res1 '.$res1.' ';
$res2=mysqli_query($con,"
insert into applyres
values
(1,2);
;");
echo '$res2 '.$res2.' ';
if($res1&&$res2)
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

$res3=mysqli_query($con,"
insert into applyres
values
(4,1);
;");

$res4=mysqli_query($con,"
	select * from applyres
;");
$row4=mysqli_fetch_array($res4);
echo $row4['applyid'].' '.$row4['res'].'<br/>'; 
?>