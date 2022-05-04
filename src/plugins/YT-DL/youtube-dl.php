<?php
	function error($message,$code=500){
		if(isset($socket)) socket_close($socket);
		http_response_code($code);
		exit($message);
	}
	$track = json_decode(file_get_contents('php://input'), true);
	$url = $track["src"];
	if(empty($url) or filter_var($url, FILTER_VALIDATE_URL) === FALSE) error("invalid URL!");
	
	$args = ["python3 -m yt-dlp","'".json_encode($track)."'"];
	passthru(join(" ",$args));
?>
