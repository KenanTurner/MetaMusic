export default class EventTarget{
	constructor(is_ready=true){
		this._subscribers = {all:[]};
		this._ready = is_ready;
	}
	subscribe(type,f,options) {
		if(typeof f != "function") throw new Error("Callback must be a function");
		let obj = {callback:f}
		if(options) obj.once = options.once;
		if(options) obj.error = options.error;
		if (!this._subscribers[type]) {
			this._subscribers[type] = []; //creates the event list
		}
		this._subscribers[type].push(obj);
		if(type == 'ready' && this._ready) this._publish('ready');
	}
	unsubscribe(type,f,options){
		if(typeof f != "function") throw new Error("Callback must be a function");
		let obj = {callback:f}
		if(options) obj.once = options.once;
		if(options) obj.error = options.error;
		if(this._subscribers[type]){
			var subs = this._subscribers[type].filter(function(item){
				return item === obj;
			});
			this._subscribers[type] = subs;
		}
	}
	_publish(type,data){
		if(!this._ready) return;
		let event = new this.constructor.Event(type,this.getStatus(),this);
		if(data) event.data = data;
		if(Promise.prototype.isPrototypeOf(event.data)){ //Kludge?
			return event.data.then(function(o){
				return this._publish(type,o);
			}.bind(this));
		}
		if(type === 'error'){
			for(let _type in this._subscribers){
				let arr = this._subscribers[_type].filter(function(obj){
					if(obj.error) obj.error(event);
					if(obj.error) return !obj.once;
					return true;
				});
				this._subscribers[_type] = arr;
			}
		}
		let f = function(obj){
			obj.callback(event);
			return !obj.once;
		}
		if(type !== 'all'){
			this._subscribers['all'] = this._subscribers['all'].filter(f);
		}
		if (!this._subscribers[type]){return event;}
		this._subscribers[type] = this._subscribers[type].filter(f);
		return event;
	}
	getStatus(){ //TODO rename?
		return undefined;
	}
	waitForEvent(type) {
		return new Promise(function(resolve, reject) {
			this.subscribe(type,resolve,{once:true,error:reject});
		}.bind(this));
	}
	chain(f,...args){ //easy promise chaining
		return function(evt){
			return this[f](...args);
		}.bind(this)
	}
	static Event = class Event{ //TODO overhaul event inheritance
		constructor(type,data,target){
			this.type = type;
			this.data = data;
			this.target = target;
		}
	}
}
