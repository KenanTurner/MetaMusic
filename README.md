# MetaMusic

Play HTML audio, Youtube, Soundcloud, and Bandcamp with a single javascript library!

## Description

MetaMusic is an open source javascript library which enables the playback of various internet music sources through the use of metadata.

## Dependencies

None :)

## Features

- Modular design
- Plugin support
- Custom event handling
- Flexible data structure
- Standard JSON for metadata

## Browser Compatibility

- [ES6 as a baseline](https://caniuse.com/es6)

## Installation

Download the lastest release from the [releases tab](/https://github.com/KenanTurner/MetaMusic/releases).  
Place the extracted files in the project folder.

## Usage

Import MetaMusic and any required plugins
```
import MetaMusic from './MetaMusic/src/meta-music.js';
import HTML from './MetaMusic/src/plugins/HTML/html.js';
```
Next, enable the plugins
```
MetaMusic.players = {HTML};
```
Finally, create the MetaMusic instance
```
let mm = new MetaMusic();
```
Then wait for the instance to be ready before calling any methods
```
await mm.waitForEvent('ready');
//mm is ready to go
```
Once the instance is ready, all methods can be used. Here is a quick example of loading a track and immediately playing it.
```
let track = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
await mm.waitForEvent('ready');
await mm.load(track);
await mm.play();
```
Here is the complete code.
```
import MetaMusic from './MetaMusic/src/meta-music.js';
import HTML from './MetaMusic/src/plugins/HTML/html.js';

MetaMusic.players = {HTML};
let mm = new MetaMusic();

let track = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
await mm.waitForEvent('ready');
await mm.load(track);
await mm.play();
```

For advanced functionality, see the [examples section](https://github.com/KenanTurner/MetaMusic/tree/master/examples)

## Live Demo

- [Simple](https://kenanturner.github.io/MetaMusic/examples/simple/)
- [Plugins](https://kenanturner.github.io/MetaMusic/examples/plugins/)
- [Queue](https://kenanturner.github.io/MetaMusic/examples/queue/)
- [Album](https://kenanturner.github.io/MetaMusic/examples/album/)

## License
[Mozilla Public License Version 2.0](/LICENSE.txt)
