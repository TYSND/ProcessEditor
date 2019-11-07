<?php
require 'dblogin.php';
//mysqli_begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
//mysqli_query("START TRANSACTION");
$res1=mysqli_query($con,"
delete from processinfo;
;");
$res2=mysqli_query($con,"
delete from procstameaning;
;");
$res3=mysqli_query($con,"
delete from processedge;
;");
$res4=mysqli_query($con,"
delete from processvariety;
;");
echo 'success';
?>