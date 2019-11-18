<?php
	$mail = new PHPMailer;
	$mail->setFrom('buddyoj@163.com');
	$mail->addAddress($email);
	//邮件主题
	$mail->Subject = 'BuddyOJ-Reminder email';
	//邮件内容
	$mail->CharSet='UTF-8';
	$mail->Body = 'Dear '.$nick.',your application to '.$fname.'(fieldid='.$fieldid.') has been approved, please login to confirm.';
	//$mail->Body = "=?utf-8?B?" . base64_encode('Dear '.$nick.',your application to '.$fname.'(fieldid='.$fieldid.') has been approved, please login to confirm.') . "?=";
	$mail->IsSMTP();
	$mail->SMTPSecure = 'ssl';
	$mail->Host = 'smtp.163.com';
	$mail->SMTPAuth = true;
	$mail->Port = 465;

	//你的邮箱地址，即（一）中你申请的邮箱
	$mail->Username = "buddyoj@163.com";

	//注意！此处的密码并非登录密码，而是（一）中提到的授权码！
	$mail->Password = 'abcABC2000527';

	//下面这条语句最好加上，以防ssl未认证通过
	$mail->SMTPOptions = array(
		'ssl' => array(
			'verify_peer' => false,
			'verify_peer_name' => false,
			'allow_self_signed' => true
		)
	);

	if(!$mail->send()) 
	{
	  echo 'Email is not sent.';
	  echo 'Email error: ' . $mail->ErrorInfo;
	exit();
	} 

?>