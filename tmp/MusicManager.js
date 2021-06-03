export default class MusicManager{
	constructor(...classes) {
		this.queue = new MusicManager.Queue();
		this.players = {};
		let self = this;
		classes.forEach(function(clas){
			self.players[clas._id] = new clas();
		});
		this.currently_playing;
	}
	enqueue(track){
		this.players.enqueue(track);
	}
	dequeue(track){
		this.players.dequeue();
	}
	static Queue = class Queue extends Array {
		enqueue(val) {
			this.push(val);
		}

		dequeue() {
			return this.shift();
		}

		peek() {
			return this[0];
		}

		isEmpty() {
			return this.length === 0;
		}
	}
}
