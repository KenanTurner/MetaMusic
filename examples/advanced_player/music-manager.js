/**
 * @fileoverview music-manager is a javascript library enabling the user
 *    to control playback of html audio files along with youtube and
 *    soundcloud links.
 */
 
/*** musicManager class */
class musicManager {
	/**
	 * initializes the musicManager object
	 * @constructor
	 * @param {Dict<string:Dict<string:string>>} data Dictionary that contains all folders, tracks and sources.
	 *     ex: {'folder1':{'track1':'src1'}}
	 * @param {Dict<string:string>=} trackType Dictionary that contains the sources and their respective types.
	 *     Allowed types: 'skipped', 'liked'. Ex: {'src1':'liked','src2':'skipped'}
	 * @param {string=} htmlAudioId id of the html audio element
	 * @param {string=} scAudioId id of the soundcloud iframe element
	 * @param {string=} ytAudioId id of the youtube div element
	 * @param {string=} scApiJs location of local soundcloud api file. If not specified, it will be imported.
	 * @param {string=} ytApiJs location of local youtube api file. If not specified, it will be imported.
	 */
	constructor(data,trackType={},htmlAudioId="html-player",scAudioId="sc-player",ytAudioId="yt-player",scApiJs="https://w.soundcloud.com/player/api.js",ytApiJs="https://www.youtube.com/iframe_api"){
		this._myTimer; //controls YT updateTime
		/**
		 * current volume from 0 to 1
		 * @type {number}
		 */
		this.currentVol=1; // 0 to 1
		/**
		 * A dict containing the folder, track, source, and filetype.
		 *     Ex: {'folder':'tmpFolder','track':'track1','src':'music/track1.mp3','filetype':'HTML'}
		 * @type {Dict<string:string>}
		 */
		this.currentlyPlaying = {}; //1d Dict: folder,trackName,src,filetype
		/**
		 * current duration of song. If set to zero, the duration has yet to be set.
		 * @type {number}
		 */
		this.currentDuration = 0; //set by setDuration
		/**
		 * current playback time in seconds
		 * @type {number}
		 */
		this.currentTime = 0; //set by updateTime
		
		/**
		 * Controlled with togglePlay();
		 * @type {boolean}
		 */
		this._isPlaying 	 = false; //currently Playing Songs
		/**
		 * Controlled with toggleShuffle();
		 * @type {boolean}
		 */
		this._isShuffling    = false; //currently Shuffling Songs
		/**
		 * Controlled with toggleLoop();
		 * @type {boolean}
		 */
		this._isLooping      = false; //currently Looping Songs
		/**
		 * Controlled with togglePlayLiked();
		 * @type {boolean}
		 */
		this._isPlayingLiked = false; //currently Playing Liked Songs
		/**
		 * Controlled with toggleShuffleAll();
		 * @type {boolean}
		 */
		this._isShufflingAll = false; //currently Shuffling All Songs
		
		/**
		 * Contains all folders, tracks and sources.
		 *     Ex: {'folder1':{'track1':'src1','track2':'src2'}}
		 * @type {Dict<string:Dict<string:string>>}
		 */
		this.data = data;
		/**
		 * Dictionary containing the src and its respective type.
		 *     Allowed types: 'skipped','liked'
		 *     Ex: {'src1':'liked','src2':'skipped'}
		 * @type {Dict<string:string>}
		 */
		this.trackType = trackType;
		/**
		 * A shuffled version of this.data. Folders are in the same order.
		 *     Ex: {'folder1':{'track2':'src2','track1':'src1'}}
		 * @type {Dict<string:Dict<string:string>>}
		 */
		this.shuffled = {};
		for(var folder in this.data){
			let tmp = {}
			let copy = JSON.parse(JSON.stringify(this.data[folder]));
			let copyKey = Object.keys(copy);
			let copyVal = Object.values(copy);
			copyVal = musicManager.shuffleArray(copyVal);
			for(let i = 0; i < copyKey.length; i++) {
				tmp[musicManager.getKeyByValue(copy,copyVal[i])] = copyVal[i];
			}
			this.shuffled[folder] = tmp;
		}
		
		/**
		 * html audio object. https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
		 * @type {object}
		 */
		this._htmlAudio = document.getElementById(htmlAudioId);
		var self = this;
		this._htmlAudio.addEventListener("ended", function() {
			if(!self._isLooping){
				self.findNextTrack(1);
			}else{
				if(self._isPlaying){
					self.play();
				}else{
					self.findNextTrack(0);
				}
			}
		});
		this._htmlAudio.addEventListener("timeupdate", function() {
			self._updateTime(self._htmlAudio.currentTime);
		});
		
		/**
		 * soundcloud widget object. https://developers.soundcloud.com/docs/api/html5-widget
		 * @type {object}
		 */
		this._SCAudio;
		/**
		 * youtube iframe object. https://developers.google.com/youtube/iframe_api_reference
		 * @type {object}
		 */
		this._YTAudio;
		
		//select the first folder and track
		this.currentlyPlaying['folder'] = Object.keys(this.data)[0];
		this.currentlyPlaying['track'] = Object.keys(this.data[this.currentlyPlaying['folder']])[0];
		
		//load YT and SC javascript files
		var self = this; //loadScript has its own scope
		musicManager.loadScript(ytApiJs, function() {
			console.log("Youtube Api has been loaded");
			self._loadYT(self,ytAudioId); //create the YT obj when script has loaded
		});
		musicManager.loadScript(scApiJs, function() {
			console.log("Soundcloud Api has been loaded");
			self._loadSC(self,scAudioId); //create the SC obj when script has loaded
		});
	}
	
	/**
	 * Creates _SCAudio object
	 * @param {object} obj object for _SCAudio to be added to
	 * @param {string} id id of the soundcloud iframe element
	 */
	_loadSC(obj,id){ //creates _SCAudio
		obj._SCAudio = SC.Widget(id);
			obj._SCAudio.bind(SC.Widget.Events.FINISH, function() {
				if(!obj._isLooping){
					obj.findNextTrack();
				}else{
					if(obj._isPlaying){
						obj.play();
					}else{
						obj.findNextTrack(0);
					}
				}
			});
			obj._SCAudio.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
				obj._updateTime(data['currentPosition']/1000);
			});
		console.log('Soundcloud is ready');
	}
	
	/**
	 * Creates _YTAudio object
	 * @param {object} obj object for _YTAudio to be added to
	 * @param {string} id id of the youtube div element
	 */
	_loadYT(obj,id){ //creates _YTAudio
		window.YT.ready(function() {
			obj._YTAudio = new window.YT.Player(id, {
				height: "144",
				width: "100%",
				playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
				videoId: ""
			});
			obj._YTAudio.addEventListener('onStateChange','_globalYTEvent')
			obj._YTAudio.addEventListener('onReady','_globalYTReady')
		});
		
	}
	
	/**
	 * Handles all youtube events
	 * @param {object} event
	 */
	_YTEvent(event) {
		if (event.data == 0) { //ENDED
			if(!this._isLooping){
				this.findNextTrack();
			}else{
				if(this.isPlaying){
					this.play();
				}else{
					this.findNextTrack(0);
				}
			}
		}
		if (event.data == 1){ //PLAYING
			this._setDuration(this._YTAudio.getDuration());
			var self = this; //keep a copy to use later
			this._myTimer = setInterval(function(){
				self._updateTime(self._YTAudio.getCurrentTime()); //manually call updateTime
			}, 100); // 100 ms
		}
		if (event.data != 1){
			clearInterval(this._myTimer); //stop calling updateTime
		}
	}
	
	/**
	 * Plays the currently selected track
	 * @returns {Dict}    this.currentlyPlaying
	 */
	play(){
		let self = this;
		switch(this.currentlyPlaying['filetype']){
			case "HTML":
				this._htmlAudio.play();
				this._getHTMLAudioDuration(this.currentlyPlaying['src'], function (duration) {
					self._setDuration(duration);
				});
				break;
			case "SC":
				this._SCAudio.bind(SC.Widget.Events.READY, function() {
					self._SCAudio.getDuration(function(duration){
						self._setDuration(duration/1000);
					});
					self._SCAudio.play();
				});
				break;
			case "YT":
				this._YTAudio.playVideo();
				break;
		}
		this._isPlaying=true;
		//playBtn.textContent = "Pause";
		//document.title = currentlyPlaying[0] + " // " + currentlyPlaying[1];
		return this.currentlyPlaying;
	}
	
	/**
	 * Pauses the currently selected track
	 * @returns {Dict}    this.currentlyPlaying
	 */
	pause(){
		this._htmlAudio.pause();
		this._YTAudio.pauseVideo();
		this._SCAudio.pause();
		this._isPlaying=false;
		//playBtn.textContent = "Play";
		//document.title = title;
		return this.currentlyPlaying;
	}
	
	/**
	 * toggles the playing of tracks
	 * @returns {boolean}    this._isPlaying
	 */
	togglePlay(){
		if(this._isPlaying){
			this.pause();
		}else{
			this.play();
		}
		return this._isPlaying;
	}
	
	/**
	 * Sets the folder, track, src, and filetype of this.currentlyPlaying.
	 *     Continues playing if not paused.
	 * @param {string=} folder Folder to be played
	 * @param {string=} trackName Track to be played
	 * @returns {Dict}    this.currentlyPlaying
	 */
	_setTrack(folder=this.currentlyPlaying['folder'],trackName=this.currentlyPlaying['track']){
		this.currentlyPlaying['folder'] = folder;
		this.currentlyPlaying['track'] = trackName;
		let src = this.data[folder][trackName];
		let filetype = musicManager.getFiletype(src);
		this.currentlyPlaying['src'] = src;
		this.currentlyPlaying['filetype'] = filetype;
		
		this._stopPlaying(); //stop currently playing track
		switch(this.currentlyPlaying['filetype']){
			case "HTML":
				this._htmlAudio.src = src;
				break;
			case "SC": //the long string appended makes soundcloud load the absolute minimum
				this._SCAudio.load(src+"&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=false&visual=false&start_track=0&callback=true");
				break;
			case "YT":
				this._YTAudio.cueVideoById(src, 0);
				break;
		}
		//displayTrack();
		if(this._isPlaying){
			this.play();
		}
		//console.log(this.currentlyPlaying);
		return this.currentlyPlaying;
		
	}
	
	/**
	 * Recursively finds the next track to play. If entire folder is skipped, move onto the next folder.
	 * @param {number=} step Direction for search for next track.
	 * @param {boolean=} hasCheckedFolder Whether the folder is completely skipped or not.
	 * @returns {Dict}    this.currentlyPlaying
	 */
	findNextTrack(step=1,hasCheckedFolder=false){
		if(this._isShufflingAll){ //shuffling all songs
			var tmp = this._getRandomTrack();
			this.currentlyPlaying['folder'] = tmp['folder'];
			this.currentlyPlaying['track'] = tmp['track'];
		}
		
		if(this._isPlayingLiked){ //play only liked songs
			let songIndex = Object.keys(this._likedTracks).indexOf(this.currentlyPlaying['src']);
			songIndex += step;
			if(songIndex >= Object.keys(this._likedTracks).length){
				songIndex = 0;
				this.pause();
			}
			if(songIndex < 0){
				songIndex = Object.keys(this._likedTracks).length-1;
			}
			this.currentlyPlaying['folder'] = Object.values(this._likedTracks)[songIndex]['folder'];
			this.currentlyPlaying['track'] = Object.values(this._likedTracks)[songIndex]['track'];
			return this._setTrack();
		}else if(!hasCheckedFolder && !this._isShufflingAll){ //check folder first unless shuffling all
			if(this._checkFolder(this.currentlyPlaying['folder'])){
				//skip to next folder
				return this.findNextFolder(1);
			}else{
				//try and find the track this time
				return this.findNextTrack(step,hasCheckedFolder=true);
			}
		}else{
			let trackNames = Object.keys(this.data[this.currentlyPlaying['folder']]);
			let songIndex = trackNames.indexOf(this.currentlyPlaying['track']);
			if(this._isShuffling){
				trackNames = Object.keys(this.shuffled[this.currentlyPlaying['folder']]);
				songIndex = trackNames.indexOf(this.currentlyPlaying['track']);
			}
			songIndex += step;
			if(step==0){
				step=1;
			}
			if(songIndex >= trackNames.length){
				songIndex = 0;
				if(!this._isShufflingAll){ //don't pause if shuffling all tracks
					this.pause();
				}
			}
			if(songIndex < 0){
				songIndex = trackNames.length-1;
			}
			let src = this.data[this.currentlyPlaying['folder']][trackNames[songIndex]];
			if(this._isShuffling){
				//shuffling sources
				src = this.shuffled[this.currentlyPlaying['folder']][trackNames[songIndex]];
			}
			this.currentlyPlaying['track'] = trackNames[songIndex];
			if(this.trackType[src] == "skipped"){
				//track has been skipped
				return this.findNextTrack(step,hasCheckedFolder=true);
			}else{
				//found a non-skipped song
				return this._setTrack();
			}
		}
	}
	
	/**
	 * Recursively finds the folder to play. If entire folder is skipped, move onto the next folder.
	 * @param {number=} step Direction for search for next folder.
	 * @returns {Dict}    this.currentlyPlaying
	 */
	findNextFolder(step=1){
		let folderNames = Object.keys(this.data);
		let folderIndex = folderNames.indexOf(this.currentlyPlaying['folder']);
		folderIndex += step;
		if(folderIndex >= folderNames.length){
			folderIndex=0;
		}
		if(folderIndex < 0){
			folderIndex = folderNames.length-1;
		}
		if(this._checkFolder(folderNames[folderIndex])){
			console.log("Entire Folder Is Skipped");
			this.currentlyPlaying['folder'] = folderNames[folderIndex];
			this.findNextFolder(step);
		}else{
			this.currentlyPlaying['folder'] = folderNames[folderIndex];
			this.currentlyPlaying['track'] = Object.keys(this.data[folderNames[folderIndex]])[0];
			return this.findNextTrack(0,true);
		}
	}
	
	/**
	 * Controls skipping forwards and backwards
	 * @param {number} timeStep The amount in seconds to skip forwards or backwards.
	 * @returns {number}    this.currentTime
	 */
	fastForward(timeStep){
		let self = this;
		switch(this.currentlyPlaying['filetype']){
			case "HTML":
				this._htmlAudio.currentTime+=timeStep;
				return this._updateTime(this._htmlAudio.currentTime);
				break;
			case "SC":
				this._SCAudio.getPosition(function(currentTimeSC){
					currentTimeSC += (timeStep*1000);
					self._SCAudio.seekTo(currentTimeSC);
					return self._updateTime(currentTimeSC/1000);
				});
				break;
			case "YT":
				if(this.currentDuration!=0){ //Wait till video is loaded
					let currentPos = this._YTAudio.getCurrentTime();
					currentPos+=timeStep;
					this._YTAudio.seekTo(currentPos,true);
					return this._updateTime(currentPos);
				}
				break;
		}
		
	}
	
	/**
	 * Controls the volume. Values range from 0 to 1.
	 * @param {number} step The amount to change volume by
	 * @param {boolean=} force Set volume directly
	 * @returns {number}    this.currentVol
	 */
	changeVolume(step,force=false){
		this.currentVol+=step;
		if(force){
			this.currentVol = step;
		}
		if(this.currentVol>1){
			this.currentVol=1;
		}
		if(this.currentVol<0){
			this.currentVol=0;
		}
		
		this._htmlAudio.volume=this.currentVol;
		this._YTAudio.setVolume(this.currentVol*100);
		this._SCAudio.setVolume(this.currentVol*100);
		return this.currentVol;
	}
	
	/**
	 * Stops all currently playing tracks. Does not change this._isPlaying.
	 *    Use pause() or togglePlay() instead.
	 */
	_stopPlaying(){
		this._htmlAudio.pause();
		this._YTAudio.pauseVideo();
		this._SCAudio.pause();
		this._setDuration(0);
		this._updateTime(0);
	}
	
	/**
	 * Toggles looping a singular track.
	 * @returns {boolean}    this._isLooping
	 */
	toggleLoop(){
		if(this._isLooping){
			this._isLooping = false;
			//document.getElementById("loopBtn").textContent = "Loop";
			//document.getElementById("loopBtn").className = "";
		}else{
			this._isLooping = true;
			//document.getElementById("loopBtn").textContent = "Stop Looping";
			//document.getElementById("loopBtn").className = "pressed";
		}
		return this._isLooping;
	}
	
	/**
	 * Toggles shuffling all songs within a folder
	 * @returns {boolean}    this.isShuffling
	 */
	toggleShuffle(){
		if(this._isShuffling){
			this._isShuffling = false;
			//document.getElementById("shuffleBtn").textContent = "Shuffle";
			//document.getElementById("shuffleBtn").className = "";
			this.currentlyPlaying['track'] = Object.keys(this.data[this.currentlyPlaying['folder']])[0];
			this.findNextTrack(0);
		}else{
			this._isShuffling = true;
			if(this._isShufflingAll){
				this.toggleShuffleAll();
			}
			if(this._isPlayingLiked){
				this.toggleLikedTracks();
			}
			//document.getElementById("shuffleBtn").textContent = "Stop Shuffling";
			//document.getElementById("shuffleBtn").className = "pressed";
			this.currentlyPlaying['track'] = Object.keys(this.shuffled[this.currentlyPlaying['folder']])[0];
			this.findNextTrack(0);
		}
		return this._isShuffling;
	}
	
	/**
	 * Toggles shuffling all tracks in all folders
	 * @returns {boolean}    this._isShufflingAll
	 */
	toggleShuffleAll(){
		if(this._isShufflingAll){
			this._isShufflingAll = false;
			//document.getElementById("shuffleAllBtn").textContent = "Shuffle All";
			//document.getElementById("shuffleAllBtn").className = "";
		}else{
			this._isShufflingAll = true;
			if(this._isShuffling){
				this.toggleShuffle();
			}
			if(this._isPlayingLiked){
				this._toggleLikedTracks();
			}
			//document.getElementById("shuffleAllBtn").textContent = "Stop Shuffling";
			//document.getElementById("shuffleAllBtn").className = "pressed";
			this.findNextTrack(0);
		}
		return this._isShufflingAll;
	}
	
	/**
	 * Toggles playing of only liked tracks.
	 * @returns {boolean}    this._isPlayingLiked
	 */
	toggleLikedTracks(){
		if(this._isPlayingLiked){
			this._isPlayingLiked = false;
			//document.getElementById("likeBtn").textContent = "Liked Tracks";
			//document.getElementById("likeBtn").className = "";
			this.currentlyPlaying['track'] = Object.keys(this.data[this.currentlyPlaying['folder']])[0];
			this.findNextTrack(0);
		}else{
			if(this._isShufflingAll){
				this.toggleShuffleAll();
			}
			if(this._isShuffling){
				this.toggleShuffle();
			}
			var nothingToSee = true;
			this._likedTracks = {};
			let tmp = [];
			for(var src in this.trackType) { //generate likedTracks
				if(this.trackType[src] == "liked"){
					nothingToSee = false;
					for(var folder in this.data){
						var trackName = musicManager.getKeyByValue(this.data[folder],src);
						if(trackName){
							this._likedTracks[src] = {'folder':folder,'track':trackName};
						}
					}
					
				}
			}
			if(!nothingToSee){
				this._isPlayingLiked = true;
				this._likedTracks = musicManager.shuffleDict(this._likedTracks);
				//document.getElementById("likeBtn").textContent = "Stop Playing";
				//document.getElementById("likeBtn").className = "pressed";
				this.currentlyPlaying['src'] = Object.keys(this._likedTracks)[0];
				this.findNextTrack(0,true);
			}else{
				alert("Zero tracks have been liked. Like a track to get started!")
			}
		}
		return this._isPlayingLiked;
	}
	
	/**
	 * Sets a tracks type. Setting it again removes the type, unless force == true.
	 * @param	{string} type type to be set. Must be one of two: 'skipped','liked'
	 * @param	{boolean=} force whether to force set the type
	 * @param	{string} src src for track. Defaults to current track
	 * @returns {Dict<string:string>}    this.trackType
	 */
	setTrackType(type,force=false,src=this.currentlyPlaying['src']){
		if(this.trackType[src]==type && !force){
			delete this.trackType[src];
		}else{
			this.trackType[src] = type;
			if(src==this.currentlyPlaying['src'] && type=='skipped'){
				this.findNextTrack(1);
			}
		}
		return this.trackType;
	}
	
	/**
	 * https://stackoverflow.com/a/41245574. Finds html audio duration and executes callback.
	 */
	_getHTMLAudioDuration(url, next) {
		var _player = new Audio(url);
		_player.addEventListener("durationchange", function (e) {
			if (this.duration!=Infinity) {
			   var duration = this.duration
			   _player.remove();
			   next(duration);
			};
		}, false);      
		_player.load();
		_player.currentTime = 24*60*60; //fake big time
		_player.volume = 0;
		_player.play();
		//waiting...
	};
	
	
	/**
	 * Sets the duration of the current track.
	 * @param {number} duration
	 * @returns {number}    this.currentDuration
	 */
	_setDuration(duration){
		this.currentDuration = duration;
		return this.currentDuration;
		//dur = document.getElementById('currentDur');
		//dur.innerText = fancyTimeFormat(duration);
	}
	
	/**
	 * Sets the current playback time in seconds
	 * @param {number} time
	 * @returns {number}    this.currentTime
	 */
	_updateTime(time){
		this.currentTime = time;
		return this.currentTime;
		/*bar = document.getElementById('bar');
		if(currentDuration==0){ //prevents division by zero
			bar.style.width = "0px";
		}else{
			bar.style.width = parseInt(((currentTime / currentDuration) * document.getElementById('progress').clientWidth), 10) + "px";
		}
		pos = document.getElementById('currentPos');
		pos.innerText = fancyTimeFormat(currentTime);
		*/
	}
	
	/**
	 * Checks folder to see if all tracks have been skipped.
	 * @param {string} folder Folder to be checked
	 * @returns {boolean}    Whether entire folder is skipped or not.
	 */
	_checkFolder(folder){
		var allSkipped = true;
		var self = this;
		Object.keys(this.data[folder]).forEach(function(track){
			if(self.trackType[self.data[folder][track]] != 'skipped'){
				allSkipped = false;
				//break;
			}
		});
		return allSkipped;
	}
	
	/**
	 * Gets a random track from all available tracks.
	 * @returns {Dict<string:string>}    Dictionary of {'folder':'exFolder','track':'exTrack'}
	 */
	_getRandomTrack(){
		var folderIndex = Math.floor(Math.random() * Object.keys(this.data).length);
		var trackIndex = Math.floor(Math.random() * Object.keys(this.data[Object.keys(this.data)[folderIndex]]).length);
		return {'folder':Object.keys(this.data)[folderIndex],'track':Object.keys(this.data[Object.keys(this.data)[folderIndex]])[trackIndex]};
	}
	
	
	/**
	 * Returns the filetype of the given source.
	 * @param {string} src Source of file
	 * @returns {string}    One of three: 'HTML','SC','YT'
	 */
	static getFiletype(src){
		let filetype = src.split('.').pop().split('/')[0];
		switch(filetype){
			case "flac":
			case "mp3":
			case "mp4":
			case "adts":
			case "ogg":
			case "wav":
				return "HTML";
				break;
			case "com":
				return "SC";
				break;
			default:
				return "YT";
		}
	}
	
	/**
	 * https://stackoverflow.com/a/28191966. Gets key by value.
	 * @param {object} object
	 * @param {object} value
	 * @returns {object}    key
	 */
	static getKeyByValue(object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}
	
	/**
	 * Shuffles 1d arrays.
	 * @param {Array<number>} array
	 * @param {number=} times Number of times to shuffle
	 * @param {number=} count Keeps track of number of shuffles
	 * @returns {Array<number>}    The shuffled array
	 */
	static shuffleArray(array,times=1,count=1){
		for (var i = 0; i < array.length; i++){
			const j = Math.floor(Math.random() * i);
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		if(count<times){ //do it two times
			return musicManager.shuffleArray(array,times,count+=1);
		}
		return array;
	}
	
	/**
	 * Shuffles 2d arrays
	 * @param {Array<number>} array
	 * @returns {Array<number>}    The shuffled array
	 */
	static shuffle2dArray(array){
		for (var i = 0; i < array.length; i++){
			array[i] = musicManager.shuffleArray(array[i]);
		}
		return array;
	}
	
	/**
	 * Shuffles Dictionarys while keeping key:value pairs
	 * @param {Dict<object:object>} object
	 * @returns {Dict<object:object>}    The shuffled Dict
	 */
	static shuffleDict(object){
		let tmp = {};
		let copyKey = Object.keys(object);
		let copyVal = Object.values(object);
		copyVal = musicManager.shuffleArray(copyVal);
		for(let i = 0; i < copyKey.length; i++) {
			tmp[musicManager.getKeyByValue(object,copyVal[i])] = copyVal[i];
		}
		return tmp;
	}
	
	/**
	 * https://stackoverflow.com/a/950146. Loads the specified script
	 * @param {string} url
	 * @param {object} callback
	 */
	static loadScript(url, callback){
		// Adding the script tag to the head as suggested before
		var head = document.head;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
		script.onreadystatechange = callback;
		script.onload = callback;

		// Fire the loading
		head.appendChild(script);
	}
}

//Youtube calls event functions in a global scope
/**
 * Youtube calls events in global scope. This function catches it and
 *     sends it to all musicManager objects available.
 * @param {object} event
 */
function _globalYTEvent(event){
	for(var key in window) {
		  if (window[key] instanceof musicManager) {
			  //console.log(window[key]);
			  window[key]._YTEvent(event);
		  }
	}
}

/**
 * Youtube calls the ready event in global scope. This function catches it and
 *     _setTrack of all musicManager objects available.
 * @param {object} event
 */
function _globalYTReady(event){
	console.log('Youtube is ready');
	for(var key in window) {
		  if (window[key] instanceof musicManager) {
			  //console.log(window[key]);
			  window[key]._setTrack();
		  }
	}
}