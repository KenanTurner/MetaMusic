# Music Manager

A simple javascript library for playing music

## Description

music-manager is a javascript library enabling the user to control playback of html audio files along with youtube and soundcloud links.

## Dependencies

[Youtube embed api](https://www.youtube.com/iframe_api)  
[Soundcloud embed api](https://w.soundcloud.com/player/api.js)  
*Note: Dependencies are automatically installed if the JS file is not found. See Installation.*

## Features

- Simple to use for playing various types of files
- easy installation
- Lightweight with minimal external dependencies
- shuffling per folder
- skipping tracks
- liked tracks playlist


## Installation

First, import the JS file  
*Note: Dependencies will be imported when music manager is initialized.*
```
<script type="text/javascript" src="music-manager.min.js"></script>
```
Next, add the HTML, Youtube, and Soundcloud embeds. Then create the music manager object.
```
<div style="display: none;"> <!-- hides the embeds from the user -->
	<audio id="html-player" src="" preload="none" controls="true" preload="metadata"></audio> <!--html audio-->
	<div id="yt-player"></div> <!--Youtube embed-->
	<iframe id="sc-player" width="100%" height="144" scrolling="no" frameborder="no" allow="autoplay"
	  src="https://w.soundcloud.com/player/?url=;"> <!--Soundcloud embed-->
	</iframe>
	<script>
	    <!--music manager object must be created after embeds have been loaded -->
		window.mm = new musicManager(
			{'Youtube Folder':{'Kero Kero Bonito - Flamingo':'rY-FJvRqK0E','You Reposted in the Wrong Dimmadome':'SBxpeuxUiOA'},
			'Soundcloud Folder':{'SCV 2018':'https://soundcloud.com/dneeltd/santa-clara-vanguard-2018-babylon-finals','Mercure Rétrograde':'https://soundcloud.com/agnes-aves/mercure-retrograde-w-agnes-aves-200520-lyl-radio'},
			'HTML Folder':{'Mars':'https://upload.wikimedia.org/wikipedia/commons/8/85/Holst-_mars.ogg','Mercury':'https://upload.wikimedia.org/wikipedia/commons/8/89/Holst_The_Planets_Mercury.ogg'}}
		);
	</script>
</div>
```


## Usage

- To start and stop playing use `.togglePlay()`  
- To move to the next track use `.findNextTrack(1)`  
- To move to the previous folder use `.findNextFolder(-1)`  
- To fast Forward ten seconds use `.fastForward(10)`  
- To decrease the volume by 50% use `.changeVolume(-0.5)`  
For advanced functionality, see the examples section.  

## Help

[github pages](https://coolspykee.github.io/music-manager/index.html)

## License
[MIT](/LICENSE)