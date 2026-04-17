<?php
$host = 'ssl://smtp.gmail.com';
$port = 465;
$socket = fsockopen($host, $port, $errno, $errstr, 15);
if (!$socket) die('Error: ' . $errstr);
$resp = '';
$getResponse = function($s) {
    $r = '';
    while ($line = fgets($s, 515)) {
        $r .= $line;
        if (substr($line, 3, 1) == ' ') break;
    }
    return $r;
};
$resp .= "GREETING: \n" . $getResponse($socket);
fputs($socket, "EHLO localhost\r\n"); $resp .= "EHLO:\n" . $getResponse($socket);
fputs($socket, "AUTH LOGIN\r\n"); $resp .= "AUTH:\n" . $getResponse($socket);
fputs($socket, base64_encode("austral.cadmin@gmail.com")."\r\n"); $resp .= "USER:\n" . $getResponse($socket);
fputs($socket, base64_encode("rbyk xfwv penr hkkf")."\r\n"); $resp .= "PASS:\n" . $getResponse($socket);
fputs($socket, "MAIL FROM: <austral.cadmin@gmail.com>\r\n"); $resp .= "MAIL FROM:\n" . $getResponse($socket);
fputs($socket, "RCPT TO: <austral.cadmin@gmail.com>\r\n"); $resp .= "RCPT TO:\n" . $getResponse($socket);
fputs($socket, "DATA\r\n"); $resp .= "DATA:\n" . $getResponse($socket);
fputs($socket, "Subject: Test\r\n\r\nTest.\r\n.\r\n"); $resp .= "CONTENT:\n" . $getResponse($socket);
fputs($socket, "QUIT\r\n"); $resp .= "QUIT:\n" . $getResponse($socket);
echo $resp;
?>
