<?php
	$con=mysqli_connect("localhost","******","******");
	if (!$con)
	{
		die('Could not connect: ' . mysqli_error());
	}
	mysqli_select_db($con,"proceditor");
	mysqli_set_charset($con,"utf8");
?>