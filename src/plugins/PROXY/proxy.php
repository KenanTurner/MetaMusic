<?php
	$track = json_decode(file_get_contents('php://input'), true);
	$url = $track["src"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	
	sleep(1);
	
	$track["src"] = "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3f/Gustav_Holst_-_the_planets%2C_op._32_-_iv._jupiter%2C_the_bringer_of_jollity.ogg/Gustav_Holst_-_the_planets%2C_op._32_-_iv._jupiter%2C_the_bringer_of_jollity.ogg.mp3";
	echo json_encode($track);
?>
