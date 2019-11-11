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
$res5=mysqli_query($con,"
delete from processmember;
;");
$res6=mysqli_query($con,"
delete from allapplyedge;
;");
$res7=mysqli_query($con,"
delete from applyinfo;
;");
$res8=mysqli_query($con,"
delete from applyres;
;");
$res9=mysqli_query($con,"
delete from applyvariety;
;");
echo 'success';
?>