function userClick(e) {
	// calculate the normalized position clicked
	var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
	var clickTime = clickPosition * mm.currentDuration;

	// move the playhead to the correct position
	mm.fastForward(clickTime - mm.currentTime);
}
		
function updateTrackDisplay(currentlyPlaying){
	document.getElementById('currentTrack').innerText = currentlyPlaying['track'];
	document.getElementById('currentFolder').innerText = currentlyPlaying['folder'];
}



function updateTrackTime(currentTime){
	//console.log(currentTime);
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
	//console.log(currentDuration);
	dur = document.getElementById('currentDur');
	dur.innerText = fancyTimeFormat(currentDuration);
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
