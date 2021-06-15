export default class EventTarget{
	constructor(){
		this._subscribers = {all:[]};
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
		//TODO promises
		let event = new this.constructor.Event(type,this.getEventStatus(),this);
		if(type === 'error'){
			for(let _type in this._subscribers){
				let arr = this._subscribers[_type].filter(function(obj){
					if(obj.error) obj.error(event);
					if(obj.error) return !obj.once;
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
		if (!this._subscribers[type]){return;}
		this._subscribers[type] = this._subscribers[type].filter(f);
		return event;
	}
	static Event = class Event{ //TODO overhaul event inheritance
		constructor(type,data,target){
			this.type = type;
			this.data = data;
			this.target = target;
		}
	}
	getEventStatus(){ //TODO ????
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
}
