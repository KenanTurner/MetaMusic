function uploadTrack(){
	folder = document.getElementById("folder").value;
	track = document.getElementById("track").value;
	src = document.getElementById("src").value;
	if(!folder || !track || !src){
		alert('All fields need to be filled out');
		return;
	}
	mm.addTrack(folder,track,src);
	generateHTML(mm.data);
	updateTrackDisplay();
	setLocalStorage('data',mm.data,true);
}

function removeTrack(){
	if(Object.keys(mm.data).length === 0){
		mm.addTrack('Rick Astley','Never Gonna Hit Those Notes','https://www.youtube.com/watch?v=lXMskKTw3Bc');
	}
	generateHTML(mm.data);
	updateTrackDisplay();
	setLocalStorage('data',mm.data,true);
}

function resetUploadedTracks(){
	mm.data = {'Youtube Folder':{'Kero Kero Bonito - Flamingo':'rY-FJvRqK0E','You Reposted in the Wrong Dimmadome':'SBxpeuxUiOA'},
			'Soundcloud Folder':{'SCV 2018':'https://soundcloud.com/dneeltd/santa-clara-vanguard-2018-babylon-finals','Mercure Rétrograde':'https://soundcloud.com/agnes-aves/mercure-retrograde-w-agnes-aves-200520-lyl-radio'},
			'HTML Folder':{'Mars':'https://upload.wikimedia.org/wikipedia/commons/8/85/Holst-_mars.ogg','Mercury':'https://upload.wikimedia.org/wikipedia/commons/8/89/Holst_The_Planets_Mercury.ogg'}};
	generateHTML(mm.data);
	updateTrackDisplay();
	setLocalStorage('data',mm.data,true)
}

function userClick(e) {
	// calculate the normalized position clicked
	var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
	var clickTime = clickPosition * mm.currentDuration;

	// move the playhead to the correct position
	mm.fastForward(clickTime - mm.currentTime);
}

function clearClassName(name){
	var els = Array.from(document.getElementsByClassName(name));
	els.forEach.call(els, function(ele) {
		ele.classList.remove(name);
	});
}

function toggleCollapse(name){
	var ul = document.getElementById(name);
	if(ul.style["display"] == "none"){
		ul.style = 'list-style-type:square;';
	}else{
		ul.style = 'list-style-type:square; display: none;';
	}
}

function collapseAll(){
	for(var folder in mm.data) {
		var ul = document.getElementById(folder);
		ul.style = 'list-style-type:square; display: none;';
	}
}

function expandAll(){
	for(var folder in mm.data) {
		var ul = document.getElementById(folder);
		ul.style = 'list-style-type:square;';
	}
}

function updateVolume(){
	document.getElementById('vol-control').value = mm.currentVol;
}

function updateTitle(bool){
	if(bool){
		document.title = mm.currentlyPlaying['track'] + '//' + mm.currentlyPlaying['folder'];
	}else{
		document.title = title;
	}
}
		
function updateTrackDisplay(){
	clearClassName('liked');
	clearClassName('skipped');
	document.getElementById('currentTrack').innerText = mm.currentlyPlaying['track'];
	document.getElementById('currentFolder').innerText = mm.currentlyPlaying['folder'];
	switch(mm.trackType[mm.currentlyPlaying['src']]){
		case "liked": //highlight liked tracks
			document.getElementById("currentTrack").classList.add("liked");
			document.getElementById("likeTrackBtn").textContent = "Unlike Track";
			break;
		default:
			document.getElementById("currentTrack").className = "";
			document.getElementById("likeTrackBtn").textContent = "Like Track";
			break;
	}
	
	Object.keys(mm.trackType).forEach(function(src){
		switch(mm.trackType[src]){
			case "liked":
				try{document.getElementById(src).classList.add("liked");}catch{}
				break;
			case "skipped":
				try{document.getElementById(src).classList.add("skipped");}catch{}
				break;
			default:
				try{document.getElementById(src).className = "";}catch{}
				break;
		}
	});
	setLocalStorage('trackType',mm.trackType,true)
}

function hasFocus(){
	var folder = document.getElementById("folder");
	var track = document.getElementById("track");
	var src = document.getElementById("src");
	if(document.activeElement === src || document.activeElement === track || document.activeElement === folder){
		return true;
	}
}

function keyUp(event){
	if(hasFocus()){
		return;
	}
	if(event.which == 32) { //play pause: space
		mm.togglePlay();
	}
	if(event.which == 77) { //mute: m
		if(mm.currentVol>0){
			mm.changeVolume(0,true);
		}else{
			mm.changeVolume(1,true);
		}
	}
	if(event.which == 39) { //rewind forward: ->
		mm.fastForward(10);
	}
	if(event.which == 37) { //rewind forward: <-
		mm.fastForward(-10);
	}
	if(event.which == 38) { //vol up down: ^
		mm.changeVolume(0.1);
	}
	if(event.which == 40) { //vol up down: Down
		mm.changeVolume(-0.1);
	}
	if(event.which == 76) { //loop: L
		mm.toggleLoop();
	}
	if(event.which == 188) { //skip track: <
		mm.findNextTrack(-1);
	}
	if(event.which == 190) { //skip track: >
		mm.findNextTrack(1);
	}
	if(event.which == 219) { //skip folder: [
		mm.findNextFolder(-1);
	}
	if(event.which == 221) { //skip folder: ]
		mm.findNextFolder(1);
	}
	if(event.which == 83) { //shuffle: S
		mm.toggleShuffle();
	}
	if(event.which == 65) { //shuffle all: A
		mm.toggleShuffleAll();
	}
	if(event.which == 85) { //Upvote song
		mm.setTrackType('liked');
	}
	if(event.which == 88) { //X to xterminate song
		mm.setTrackType('skipped',force=true);
	}
	if(event.which == 69) { //E to expand all
		expandAll();
	}
	if(event.which == 67) { //C to collapse all
		collapseAll();
	}
	if(event.which == 80) { //p to play liked
		mm.toggleLikedTracks();
	}
}

function updateTrackTime(currentTime){
	bar = document.getElementById('bar');
	if(mm.currentDuration==0){ //prevents division by zero
		bar.style.width = "0px";
	}else{
		bar.style.width = parseInt(((currentTime / mm.currentDuration) * document.getElementById('progress').clientWidth), 10) + "px";
	}
	pos = document.getElementById('currentPos');
	pos.innerText = fancyTimeFormat(currentTime);
}

function updateTrackDuration(currentDuration){
	dur = document.getElementById('currentDur');
	dur.innerText = fancyTimeFormat(currentDuration);
}

function updateBtn(bool,btn,trueText,falseText){
	if(bool){
		btn.textContent = trueText;
		btn.className = "pressed";
	}else{
		btn.textContent = falseText;
		btn.className = "";
	}
}

function escapeQuotes(str){
	return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

//https://stackoverflow.com/a/11486026
function fancyTimeFormat(duration){   
	// Hours, minutes and seconds
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}


function generateHTML(data){
	document.getElementById('content').innerHTML = "";
		//Generate html here
	var folders = document.createElement("ul");
	document.getElementById('content').appendChild(folders);
	Object.keys(data).forEach(function (item1) {
		let folderName = document.createElement('button');
		folders.appendChild(folderName);
		folderName.innerHTML += item1;
		style = document.createAttribute("class");
		style.value = "folderButton";
		folderName.setAttributeNode(style);
		onClick = document.createAttribute("onclick");
		onClick.value = 'toggleCollapse("'+escapeQuotes(item1)+'");';
		folderName.setAttributeNode(onClick);
		
		let tracks = document.createElement("ul");
		style = document.createAttribute("style");
		style.value = "list-style-type:square;";
		tracks.setAttributeNode(style);
		id = document.createAttribute("id");
		id.value = item1;
		tracks.setAttributeNode(id);
		
		Object.keys(data[item1]).forEach(function (item2) {
			let track = document.createElement('li');
			style = document.createAttribute("class");
			style.value = "trackLI";
			track.setAttributeNode(style);
			tracks.appendChild(track);
			
			//track btn
			let trackBtn = document.createElement('button');
			style = document.createAttribute("class");
			style.value = "trackButton";
			trackBtn.setAttributeNode(style);
			onClick = document.createAttribute("onclick");
			onClick.value = 'mm.findTrack("'+escapeQuotes(item1)+'","'+escapeQuotes(item2)+'");';
			trackBtn.setAttributeNode(onClick);
			id = document.createAttribute("id");
			id.value = data[item1][item2];
			trackBtn.setAttributeNode(id);
			trackBtn.innerHTML += item2;
			
			//remove btn
			let removeBtn = document.createElement('button');
			removeBtn.innerHTML += "remove";
			style = document.createAttribute("class");
			style.value = "removeBtn";
			removeBtn.setAttributeNode(style);
			onClick = document.createAttribute("onclick");
			onClick.value = 'mm.removeTrack("'+escapeQuotes(item1)+'","'+escapeQuotes(item2)+'");';
			removeBtn.setAttributeNode(onClick);
			
			//skip btn
			let skipBtn = document.createElement('button');
			skipBtn.innerHTML += "skip";
			style = document.createAttribute("class");
			style.value = "skipLikeBtn";
			skipBtn.setAttributeNode(style);
			onClick = document.createAttribute("onclick");
			onClick.value = 'mm.setTrackType("skipped",false,"'+escapeQuotes(data[item1][item2])+'");';
			skipBtn.setAttributeNode(onClick);
			
			//like Btn
			let likeBtn = document.createElement('button');
			likeBtn.innerHTML += "like";
			style = document.createAttribute("class");
			style.value = "skipLikeBtn";
			likeBtn.setAttributeNode(style);
			onClick = document.createAttribute("onclick");
			onClick.value = 'mm.setTrackType("liked",false,"'+escapeQuotes(data[item1][item2])+'");';
			likeBtn.setAttributeNode(onClick);
			
			track.appendChild(trackBtn);
			track.appendChild(removeBtn);
			track.appendChild(skipBtn);
			track.appendChild(likeBtn);
		});
		
		folders.appendChild(tracks);

		
	});
}
