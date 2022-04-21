<?php
	function error($message,$code=500){
		if(isset($socket)) socket_close($socket);
		http_response_code($code);
		exit($message);
	}
	$track = json_decode(file_get_contents('php://input'), true);
	$url = $track["src"];
	if(empty($url) or filter_var($url, FILTER_VALIDATE_URL) === FALSE) error("invalid URL!");
	
	$result = '';
	$address = 'localhost';
	$port = 4200;
	$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
	if(!$socket) error('Unable to create socket!');
	if(!socket_connect($socket, $address, $port)) error('Unable to connect to socket!');
	if(!socket_write($socket, $url, 2048)) error('Failed to write to socket!');
	while($chunk = socket_read($socket, 2048)){
		if(!$chunk) error('Failed to read from socket!');
		$result .= $chunk;
	}
	socket_close($socket);
	if(empty($result) or filter_var($result, FILTER_VALIDATE_URL) === FALSE) error('Unable to resolve URL!');
	
	$track["src"] = $result;
	echo json_encode($track);
?>
