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

## Browser Compatibility

- IE 1.1+
- Edge 8.3+
- Firefox 7.8+
- Chrome 8.3+
- Mobile Chrome 8.1+
- Android Browser 8.1+
- Safari 13.1+*
- Mobile Safari 13.5+
- Opera 12.0+  
**Note: for mobile safari to work with soundcloud, the desktop version of the site must be requested.*  

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
- To add a track use `.data['folderName']['trackName'] = 'SRC'`  
*Note: All Youtube links must be the video ID. Ex: rY-FJvRqK0E. A standard link will not work.*  

For advanced functionality, see the examples section.  

## Live Demo

* [Simple Player](https://coolspykee.github.io/music-manager/simple_player/index.html)
* [Advanced Player](https://coolspykee.github.io/music-manager/advanced_player/index.html)
* [Fancy Player](https://coolspykee.github.io/music-manager/fancy_player/index.html)

## Help

[github pages](https://coolspykee.github.io/music-manager/index.html)

## License
[MIT](/LICENSE)
