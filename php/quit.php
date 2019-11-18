<?php
session_start();
	unset($_SESSION['userid']);
echo <<<script
<script>
    window.location.href='../login.html';
</script>
script;

?>