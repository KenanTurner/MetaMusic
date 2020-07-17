# Advanced Player

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
- Saves the user's preferences
- Saves the uploaded tracks

The formatting is from fancy.css.  
All user interaction is controlled display.js.  
Any user data is stored with HTML local storage, courtesy of localStorage.js.  
Both the Youtube and Soundcloud APIs are included.  

*Note: All Youtube links must be the video ID. Ex: rY-FJvRqK0E. A standard link will not work.*  

## Live Demos
* [Simple Player](https://coolspykee.github.io/music-manager/simple_player/index.html)
* [Advanced Player](https://coolspykee.github.io/music-manager/advanced_player/index.html)
* [Fancy Player](https://coolspykee.github.io/music-manager/fancy_player/index.html)
