<?php

$subject = trim($_POST["form_subject"]);

$from_name  = "PathSoft";
$from_email = "example@mail.com";
$to_email   = $from_email;

if($_POST["Name"] != '') { 

	$from_name = trim($_POST["Name"]);

}

if($_POST["Email"] != '') { 

	$from_email = trim($_POST["Email"]); 

}

$c = true;

foreach ( $_POST as $key => $value ) {

	if ( $value != "" && $key != "form_subject" ) {

		$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
		";

	}

}

$message = "<table style='width: 100%;'>$message</table>";

$headers  = "Content-type: text/html; charset=utf-8 \r\n"; 
$headers .= "From: " . $from_name . " <" . $from_email . ">\r\n";
$headers .= "Reply-To: " . $from_email . "\r\n";

mail($to_email, $subject, $message, $headers );