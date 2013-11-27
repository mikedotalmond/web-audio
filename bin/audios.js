(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
var Main = function() {
	var _g = this;
	this.initMonoSynth();
	this.keyboardInput = new utils.KeyboardInput();
	this.keyboardInput.noteOff.add(($_=this.monoSynth,$bind($_,$_.noteOff)));
	this.keyboardInput.noteOn.add(function(freq,velocity) {
		_g.monoSynth.noteOn(Main.context.currentTime,freq,velocity);
	});
};
Main.__name__ = true;
Main.main = function() {
	Main.createContext();
	if(Main.context == null) js.Browser.window.alert("Web Audio API not supported - try a different/better browser"); else Main.instance = new Main();
}
Main.createContext = function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	var c;
	try {
		c = new AudioContext();
	} catch( err ) {
		haxe.Log.trace("Error creating an AudioContext",{ fileName : "Main.hx", lineNumber : 83, className : "Main", methodName : "createContext", customParams : [err]});
		c = null;
	}
	Main.context = c;
}
Main.prototype = {
	initMonoSynth: function() {
		this.monoSynth = new synth.MonoSynth(Main.context.destination);
		this.monoSynth.set_oscillatorType(1);
		this.monoSynth.setOutputGain(.4);
		this.monoSynth.adsr_attackTime = .01;
		this.monoSynth.adsr_sustain = 0.5;
		this.monoSynth.adsr_releaseTime = .2;
	}
	,__class__: Main
}
var IMap = function() { }
IMap.__name__ = true;
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
var haxe = {}
haxe.Log = function() { }
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0, _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
js.Browser.__name__ = true;
var msignal = {}
msignal.Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
msignal.Signal.__name__ = true;
msignal.Signal.prototype = {
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw "You cannot addOnce() then add() the same listener without removing the relationship first.";
		return false;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,add: function(listener) {
		return this.registerListener(listener);
	}
	,__class__: msignal.Signal
}
msignal.Signal1 = function(type) {
	msignal.Signal.call(this,[type]);
};
msignal.Signal1.__name__ = true;
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot1(this,listener,once,priority);
	}
	,dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
msignal.Signal2.__name__ = true;
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot2(this,listener,once,priority);
	}
	,dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal2
});
msignal.Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal.Slot.__name__ = true;
msignal.Slot.prototype = {
	set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,remove: function() {
		this.signal.remove(this.listener);
	}
	,__class__: msignal.Slot
}
msignal.Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot1.__name__ = true;
msignal.Slot1.__super__ = msignal.Slot;
msignal.Slot1.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal.Slot1
});
msignal.Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot2.__name__ = true;
msignal.Slot2.__super__ = msignal.Slot;
msignal.Slot2.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal.Slot2
});
msignal.SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal.SlotList.NIL != null) throw "Parameters head and tail are null. Use the NIL element instead.";
		this.nonEmpty = false;
	} else if(head == null) throw "Parameter head cannot be null."; else {
		this.head = head;
		this.tail = tail == null?msignal.SlotList.NIL:tail;
		this.nonEmpty = true;
	}
};
msignal.SlotList.__name__ = true;
msignal.SlotList.prototype = {
	find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
	}
	,__class__: msignal.SlotList
}
var synth = {}
synth.MonoSynth = function(destination) {
	this.oscType = 0;
	this.noteIsOn = false;
	this.osc_portamentoTime = 0;
	this.adsr_sustain = .44;
	this.adsr_releaseTime = .25;
	this.adsr_decayTime = 0.2;
	this.adsr_attackTime = .1;
	var context = destination.context;
	this.outputGain = context.createGain();
	this.outputGain.gain.value = 1;
	this.outputGain.connect(destination);
	this.osc = [];
	this.osc[0] = (function($this) {
		var $r;
		var this1;
		this1 = context.createOscillator();
		this1.frequency.value = 440;
		this1.type = 0;
		this1.start(0);
		$r = this1;
		return $r;
	}(this));
	this.osc[1] = (function($this) {
		var $r;
		var this1;
		this1 = context.createOscillator();
		this1.frequency.value = 440;
		this1.type = 1;
		this1.start(0);
		$r = this1;
		return $r;
	}(this));
	this.osc[3] = (function($this) {
		var $r;
		var this1;
		this1 = context.createOscillator();
		this1.frequency.value = 440;
		this1.type = 3;
		this1.start(0);
		$r = this1;
		return $r;
	}(this));
	this.osc[2] = (function($this) {
		var $r;
		var this1;
		this1 = context.createOscillator();
		this1.frequency.value = 440;
		this1.type = 2;
		this1.start(0);
		$r = this1;
		return $r;
	}(this));
	this.biquad = (function($this) {
		var $r;
		var this1;
		this1 = context.createBiquadFilter();
		this1.type = 0;
		this1.frequency.value = 200;
		this1.Q.value = 10;
		this1.gain.value = 0;
		$r = this1;
		return $r;
	}(this));
	this.adsr = (function($this) {
		var $r;
		var input = $this.biquad, destination1 = $this.outputGain;
		var this1;
		this1 = context.createGain();
		this1.gain.value = 0;
		if(input != null) input.connect(this1);
		if(destination1 != null) this1.connect(destination1);
		$r = this1;
		return $r;
	}(this));
	this.set_oscillatorType(0);
};
synth.MonoSynth.__name__ = true;
synth.MonoSynth.prototype = {
	noteOff: function(when) {
		if(this.noteIsOn) {
			this.osc[this.oscType].frequency.cancelScheduledValues((function($this) {
				var $r;
				var er = Math.exp($this.adsr_releaseTime);
				$this.adsr.gain.cancelScheduledValues(when);
				$this.adsr.gain.setValueAtTime($this.adsr.gain.value,when);
				$this.adsr.gain.setTargetAtTime(0,when,1 - 1 / er);
				$r = when + er;
				return $r;
			}(this)));
			this.biquad.frequency.cancelScheduledValues(when);
			this.biquad.frequency.setValueAtTime(this.biquad.frequency.value,when);
			this.biquad.frequency.exponentialRampToValueAtTime(200,when + .25);
			when + .25;
			this.noteIsOn = false;
		}
	}
	,noteOn: function(when,freq,velocity,retrigger) {
		if(retrigger == null) retrigger = false;
		if(velocity == null) velocity = 1;
		var portamentoTime = this.osc_portamentoTime;
		this.osc[this.oscType].frequency.cancelScheduledValues(when);
		if(portamentoTime > 0 && freq != this.osc[this.oscType].frequency.value) {
			this.osc[this.oscType].frequency.setValueAtTime(this.osc[this.oscType].frequency.value,when);
			this.osc[this.oscType].frequency.exponentialRampToValueAtTime(freq,when + portamentoTime);
		} else this.osc[this.oscType].frequency.setValueAtTime(freq,when);
		if(!this.noteIsOn || retrigger) {
			var attackTime = this.adsr_attackTime, sustainLevel = this.adsr_sustain;
			this.adsr.gain.cancelScheduledValues(when);
			if(retrigger) this.adsr.gain.setValueAtTime(0,when);
			this.adsr.gain.setTargetAtTime(velocity,when,1 - 1 / Math.exp(attackTime));
			if(sustainLevel != 1.0) this.adsr.gain.setTargetAtTime(velocity * sustainLevel,when + attackTime,1 - 1 / Math.exp(this.adsr_decayTime));
			var startFreq = 200;
			startFreq = retrigger?startFreq:this.biquad.frequency.value;
			this.biquad.frequency.cancelScheduledValues(when);
			this.biquad.frequency.setValueAtTime(startFreq,when);
			this.biquad.frequency.exponentialRampToValueAtTime(8000,when + .3);
		}
		this.noteIsOn = true;
	}
	,setOutputGain: function(value,when) {
		if(when == null) when = 0;
		this.outputGain.gain.cancelScheduledValues(when);
		this.outputGain.gain.setValueAtTime(value,when);
	}
	,set_oscillatorType: function(type) {
		switch(type) {
		case 0:case 1:case 3:case 2:
			this.noteOff(0);
			this.osc[this.oscType].disconnect(0);
			this.oscType = type;
			this.osc[this.oscType].connect(this.biquad,0);
			break;
		}
		return this.oscType;
	}
	,__class__: synth.MonoSynth
}
var utils = {}
utils.KeyboardInput = function() {
	this.heldKeys = [];
	this.keyNotes = new utils.KeyboardNotes();
	this.noteOn = new msignal.Signal2();
	this.noteOff = new msignal.Signal1();
	js.Browser.document.addEventListener("keydown",$bind(this,this.handleKeyDown));
	js.Browser.document.addEventListener("keyup",$bind(this,this.handleKeyUp));
};
utils.KeyboardInput.__name__ = true;
utils.KeyboardInput.prototype = {
	handleKeyUp: function(e) {
		this.heldKeys.splice(Lambda.indexOf(this.heldKeys,e.keyCode),1)[0];
		if(this.heldKeys.length == 0) this.noteOff.dispatch(0); else this.noteOn.dispatch(this.keyNotes.keycodeToNoteFreq.get(this.heldKeys[this.heldKeys.length - 1]),.66);
	}
	,handleKeyDown: function(e) {
		var i = Lambda.indexOf(this.heldKeys,e.keyCode);
		if(i == -1) {
			var nf = this.keyNotes.keycodeToNoteFreq;
			if(nf.exists(e.keyCode)) {
				this.noteOn.dispatch(nf.get(e.keyCode),.66);
				this.heldKeys.push(e.keyCode);
			}
		}
	}
	,__class__: utils.KeyboardInput
}
utils.KeyboardNotes = function() {
	this.noteFreq = new utils.NoteFrequency();
	this.keycodeToNoteFreq = new haxe.ds.IntMap();
	this.keycodeToNoteFreq.set(90,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C2")));
	this.keycodeToNoteFreq.set(83,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C#2")));
	this.keycodeToNoteFreq.set(88,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D2")));
	this.keycodeToNoteFreq.set(68,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D#2")));
	this.keycodeToNoteFreq.set(67,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("E2")));
	this.keycodeToNoteFreq.set(86,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("F2")));
	this.keycodeToNoteFreq.set(71,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("F#2")));
	this.keycodeToNoteFreq.set(66,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("G2")));
	this.keycodeToNoteFreq.set(72,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("G#2")));
	this.keycodeToNoteFreq.set(78,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("A2")));
	this.keycodeToNoteFreq.set(74,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("A#2")));
	this.keycodeToNoteFreq.set(77,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("B2")));
	this.keycodeToNoteFreq.set(81,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C3")));
	this.keycodeToNoteFreq.set(50,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C#3")));
	this.keycodeToNoteFreq.set(87,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D3")));
	this.keycodeToNoteFreq.set(51,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D#3")));
	this.keycodeToNoteFreq.set(69,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("E3")));
	this.keycodeToNoteFreq.set(82,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("F3")));
	this.keycodeToNoteFreq.set(53,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("F#3")));
	this.keycodeToNoteFreq.set(84,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("G3")));
	this.keycodeToNoteFreq.set(54,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("G#3")));
	this.keycodeToNoteFreq.set(89,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("A3")));
	this.keycodeToNoteFreq.set(55,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("A#3")));
	this.keycodeToNoteFreq.set(85,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("B3")));
	this.keycodeToNoteFreq.set(73,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C4")));
	this.keycodeToNoteFreq.set(57,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("C#4")));
	this.keycodeToNoteFreq.set(79,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D4")));
	this.keycodeToNoteFreq.set(48,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("D#4")));
	this.keycodeToNoteFreq.set(80,this.noteFreq.noteIndexToFrequency(this.noteFreq.noteNameToIndex("E4")));
};
utils.KeyboardNotes.__name__ = true;
utils.KeyboardNotes.prototype = {
	__class__: utils.KeyboardNotes
}
utils.NoteFrequency = function() {
	if(utils.NoteFrequency.pitchNames == null) {
		utils.NoteFrequency.pitchNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
		utils.NoteFrequency.altPitchNames = [null,"Db#",null,"Eb",null,null,"Gb",null,"Ab",null,"Bb",null];
	}
	this.noteFrequencies = [];
	this.noteNames = [];
	this._octaveMiddleC = 3;
	this.set_tuningBase(440.0);
};
utils.NoteFrequency.__name__ = true;
utils.NoteFrequency.prototype = {
	get_octaveMiddleC: function() {
		return this._octaveMiddleC;
	}
	,set_tuningBase: function(value) {
		this._tuningBase = value;
		this.invTuningBase = 1.0 / (this._tuningBase * 0.5);
		this.reset();
		return this._tuningBase;
	}
	,get_tuningBase: function() {
		return this._tuningBase;
	}
	,indexToName: function(index) {
		var pitch = index % 12;
		var octave = (index * (1 / 12) | 0) - (5 - this.get_octaveMiddleC());
		var noteName = utils.NoteFrequency.pitchNames[pitch] + octave;
		if(utils.NoteFrequency.altPitchNames[pitch] != null) noteName += "/" + utils.NoteFrequency.altPitchNames[pitch] + octave;
		return noteName;
	}
	,noteNameToIndex: function(name) {
		var hasAlternate = name.indexOf("/");
		if(hasAlternate != -1) name = name.substring(0,hasAlternate);
		var s;
		var i = this.noteNames.length;
		while(--i > -1) {
			s = this.noteNames[i];
			if(s.indexOf(name) > -1) return i;
		}
		return -1;
	}
	,noteIndexToFrequency: function(index,cents) {
		if(cents == null) cents = 0;
		if(index >= 0 && index < 128) {
			if(cents == 0) return this.noteFrequencies[index]; else if(cents < 0) return this.noteFrequencies[index] / Math.pow(2,-cents * (1 / 1200)); else return this.noteFrequencies[index] * Math.pow(2,cents * (1 / 1200));
		}
		return Math.NaN;
	}
	,reset: function() {
		var _g = 0;
		while(_g < 128) {
			var i = _g++;
			this.noteNames[i] = this.indexToName(i);
			this.noteFrequencies[i] = this.get_tuningBase() * Math.pow(2,(i - 69.0) * (1 / 12));
		}
	}
	,__class__: utils.NoteFrequency
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
msignal.SlotList.NIL = new msignal.SlotList(null,null);
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
