# Fancy Player

This is a fancy and complex implementation of music-manager.  
All it does is create the music-manager object, and subscribes to a few events.  
What it can do:  
- Play/Pause
- Fast Forward/Rewind
- Next/Last Track
- Next/Last Folder
- Volume Up/Volume Down
- Like/Dislike Track
- Reset Tracks based on type
- Looping
- Shuffling
- Shuffling all tracks
- Liked playlist
- Display track and folder
- Display current time and duration
- Display progress bar
- Seekable progress bar
- Volume control slider
- Generate HTML from data
- Collapse/Expand folders
- Tracks can be clicked on
- Additional controls for liking/skipping
- Adding tracks/folders in real time
- Removing tracks/folders in real time
- Saves the user's preferences
- Saves the uploaded tracks  
Also has support for keyboard controls:  
- next track: >
- previous track: <
- next folder: ]
- previous folder: \[
- play/pause: space
- mute/unmute: m
- fast forward: right
- rewind: left
- Volume up: up
- Volume down: down
- loop: l
- shuffle: s
- shuffle all: a
- like track: u
- skip tack: x
- play liked tracks: p
- collapse all: c
- expand all: e

The formatting is from fancy.css.  
All user interaction is controlled display.js.  
Any user data is stored with HTML local storage, courtesy of localStorage.js.  
Both the Youtube and Soundcloud APIs are included.  

## Live Demo

* [Simple Player](https://kenanturner.github.io/music-manager/simple_player/index.html)
* [Advanced Player](https://kenanturner.github.io/music-manager/advanced_player/index.html)
* [Fancy Player](https://kenanturner.github.io/music-manager/fancy_player/index.html)
