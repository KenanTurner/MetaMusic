<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}

	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	libxml_clear_errors();
	$h1 = $doc->getElementsByTagName("script");
	$album = array();
	//echo count($h1);
	foreach ($h1 as $h) {
		$tmp = $h->getAttribute('data-tralbum');
		if($tmp==NULL){
			continue;
		}
		$tmpJson = json_decode($tmp,true);
		foreach($tmpJson["trackinfo"] as $x){
			$track = array();
			$track["src"] = $x["file"]["mp3-128"];
			$track["title"] = $x["title"];
			array_push($album, $track);
		}
		//echo trim($tmpJson["trackinfo"][0]["file"]["mp3-128"]);
	}
	echo json_encode($album);
?>
