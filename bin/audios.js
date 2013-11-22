(function () { "use strict";
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
	this.timerId = -1;
	this.monoSynthTest();
};
Main.__name__ = true;
Main.main = function() {
	Main.createContext();
	if(Main.context == null) js.Browser.window.alert("Web Audio API not supported - try a better browser"); else Main.instance = new Main();
}
Main.createContext = function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	try {
		Main.context = new AudioContext();
	} catch( err ) {
		haxe.Log.trace("Error creating an AudioContext",{ fileName : "Main.hx", lineNumber : 169, className : "Main", methodName : "createContext", customParams : [err]});
		Main.context = null;
	}
}
Main.prototype = {
	bufferSourceTest: function() {
		var url = "test.ogg";
		var req = new XMLHttpRequest();
		req.open("GET",url,true);
		req.responseType = "arraybuffer";
		req.onload = function(e) {
			haxe.Log.trace("loaded: " + req.status,{ fileName : "Main.hx", lineNumber : 117, className : "Main", methodName : "bufferSourceTest"});
			Main.context.decodeAudioData(req.response,function(buffer) {
				haxe.Log.trace("decoded to buffer...",{ fileName : "Main.hx", lineNumber : 123, className : "Main", methodName : "bufferSourceTest"});
				haxe.Log.trace("duration:" + buffer.duration + ", gain:" + buffer.gain + ", numberOfChannels:" + buffer.numberOfChannels + ", sampleRate:" + buffer.sampleRate + ", length:" + buffer.length,{ fileName : "Main.hx", lineNumber : 124, className : "Main", methodName : "bufferSourceTest"});
				var bufferSource = Main.context.createBufferSource();
				bufferSource.buffer = buffer;
				bufferSource.connect(Main.context.destination);
				bufferSource.start(Main.context.currentTime + .5);
				return true;
			},function(buffer) {
				haxe.Log.trace("error decoding to buffer",{ fileName : "Main.hx", lineNumber : 135, className : "Main", methodName : "bufferSourceTest"});
				return false;
			});
		};
		req.send();
	}
	,scriptProcessorTest: function() {
		var node;
		try {
			node = Main.context.createScriptProcessor();
		} catch( err ) {
			node = Main.context.createScriptProcessor(2048);
		}
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			var n = output.length;
			var _g = 0;
			while(_g < n) {
				var i = _g++;
				output[i] = Math.random() - .5;
			}
		};
		node.connect(Main.context.destination);
	}
	,monoSynthTest: function() {
		var keys = new utils.KeyboardNotes();
		var noteFreq = keys.keycodeToNoteFreq;
		var heldKeys = [];
		var mono = new synth.MonoSynth(Main.context.destination);
		mono.set_oscillatorType(2);
		mono.osc_portamentoTime = .1;
		js.Browser.document.addEventListener("keydown",function(e) {
			var i = Lambda.indexOf(heldKeys,e.keyCode);
			if(i == -1) {
				if(noteFreq.exists(e.keyCode)) {
					mono.noteOn(Main.context.currentTime,noteFreq.get(e.keyCode),.66);
					heldKeys.push(e.keyCode);
				}
			}
		});
		js.Browser.document.addEventListener("keyup",function(e) {
			heldKeys.splice(Lambda.indexOf(heldKeys,e.keyCode),1)[0];
			if(heldKeys.length == 0) mono.noteOff(Main.context.currentTime); else mono.noteOn(Main.context.currentTime,noteFreq.get(heldKeys[heldKeys.length - 1]),.66);
		});
	}
	,__class__: Main
}
var IMap = function() { }
IMap.__name__ = true;
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
var synth = {}
synth._ADSR = {}
synth._ADSR.ADSR_Impl_ = function() { }
synth._ADSR.ADSR_Impl_.__name__ = true;
synth._ADSR.ADSR_Impl_._new = function(context,input,destination) {
	var this1;
	this1 = context.createGain();
	this1.gain.value = 0;
	if(input != null) input.connect(this1);
	if(destination != null) this1.connect(destination);
	return this1;
}
synth._ADSR.ADSR_Impl_.trigger = function(this1,when,level,attackTime,decayTime,sustainLevel,retrigger) {
	if(retrigger == null) retrigger = false;
	if(sustainLevel == null) sustainLevel = 1.0;
	if(decayTime == null) decayTime = 0.001;
	if(attackTime == null) attackTime = 0.2;
	if(level == null) level = 1.0;
	if(when == null) when = .0;
	this1.gain.cancelScheduledValues(when);
	this1.gain.setValueAtTime(retrigger?0:this1.gain.value,when);
	this1.gain.setTargetAtTime(level,when,1 - 1 / Math.exp(attackTime));
	if(sustainLevel != 1.0) this1.gain.setTargetAtTime(level * sustainLevel,when + attackTime,1 - 1 / Math.exp(decayTime));
}
synth._ADSR.ADSR_Impl_.release = function(this1,when,releaseDuration) {
	if(releaseDuration == null) releaseDuration = .5;
	if(when == null) when = .0;
	var er = Math.exp(releaseDuration);
	this1.gain.cancelScheduledValues(when);
	this1.gain.setTargetAtTime(0,when,1 - 1 / er);
	return when + er;
}
synth._ADSR.ADSR_Impl_.rExp = function(this1,v) {
	return 1 - 1 / Math.exp(v);
}
synth.MonoSynth = function(destination) {
	this.oscType = 0;
	this.noteIsOn = false;
	this.osc_portamentoTime = 0;
	this.adsr_sustain = .44;
	this.adsr_releaseTime = .25;
	this.adsr_decayTime = 0.2;
	this.adsr_attackTime = .1;
	var context = destination.context;
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
	this.adsr = (function($this) {
		var $r;
		var this1;
		this1 = context.createGain();
		this1.gain.value = 0;
		if(destination != null) this1.connect(destination);
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
				$this.adsr.gain.setTargetAtTime(0,when,1 - 1 / er);
				$r = when + er;
				return $r;
			}(this)));
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
			this.adsr.gain.setValueAtTime(retrigger?0:this.adsr.gain.value,when);
			this.adsr.gain.setTargetAtTime(velocity,when,1 - 1 / Math.exp(attackTime));
			if(sustainLevel != 1.0) this.adsr.gain.setTargetAtTime(velocity * sustainLevel,when + attackTime,1 - 1 / Math.exp(this.adsr_decayTime));
		}
		this.noteIsOn = true;
	}
	,set_oscillatorType: function(type) {
		switch(type) {
		case 0:case 1:case 3:case 2:
			this.noteOff(0);
			this.osc[this.oscType].disconnect(0);
			this.oscType = type;
			this.osc[this.oscType].connect(this.adsr,0);
			break;
		}
		return this.oscType;
	}
	,get_oscillatorType: function() {
		return this.oscType;
	}
	,get_currentOscillatorNode: function() {
		return this.osc[this.oscType];
	}
	,get_currentOscillator: function() {
		return this.osc[this.oscType];
	}
	,__class__: synth.MonoSynth
}
synth._Oscillator = {}
synth._Oscillator.Oscillator_Impl_ = function() { }
synth._Oscillator.Oscillator_Impl_.__name__ = true;
synth._Oscillator.Oscillator_Impl_._new = function(context,destination,type) {
	if(type == null) type = 0;
	var this1;
	this1 = context.createOscillator();
	this1.frequency.value = 440;
	this1.type = type;
	this1.start(0);
	if(destination != null) this1.connect(destination);
	return this1;
}
synth._Oscillator.Oscillator_Impl_.trigger = function(this1,when,freq,portamentoTime) {
	if(portamentoTime == null) portamentoTime = 0;
	if(freq == null) freq = 440;
	this1.frequency.cancelScheduledValues(when);
	if(portamentoTime > 0 && freq != this1.frequency.value) {
		this1.frequency.setValueAtTime(this1.frequency.value,when);
		this1.frequency.exponentialRampToValueAtTime(freq,when + portamentoTime);
	} else this1.frequency.setValueAtTime(freq,when);
}
synth._Oscillator.Oscillator_Impl_.release = function(this1,when) {
	this1.frequency.cancelScheduledValues(when);
}
var utils = {}
utils.Keyboard = function() { }
utils.Keyboard.__name__ = true;
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
utils.NoteFrequency.rateFromNote = function(note,cents,root) {
	return (12 + note + cents * 0.01 - root) * (1 / 12);
}
utils.NoteFrequency.noteFromRate = function(rate,root) {
	return root + rate * 12 | 0;
}
utils.NoteFrequency.rateFromFrequency = function(frequency,rootFrequency) {
	return frequency / rootFrequency;
}
utils.NoteFrequency.prototype = {
	set_octaveMiddleC: function(value) {
		this._octaveMiddleC = value;
		this.reset();
		return value;
	}
	,get_octaveMiddleC: function() {
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
	,frequencyToNote: function(frequency) {
		return 12 * (Math.log(frequency * this.invTuningBase) * 1.4426950408889634) + 57;
	}
	,indexToFrequency: function(index) {
		return this.get_tuningBase() * Math.pow(2,(index - 69.0) * (1 / 12));
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
	,noteIndexToName: function(index) {
		if(index >= 0 && index < 128) return this.noteNames[index];
		return null;
	}
	,frequencyToNoteIndex: function(frequency) {
		return 12 * (Math.log(frequency * this.invTuningBase) * 1.4426950408889634) + 57 | 0;
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
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
synth._Oscillator.Oscillator_Impl_.SINE = 0;
synth._Oscillator.Oscillator_Impl_.SQUARE = 1;
synth._Oscillator.Oscillator_Impl_.SAWTOOTH = 2;
synth._Oscillator.Oscillator_Impl_.TRIANGLE = 3;
utils.Keyboard.A = 65;
utils.Keyboard.B = 66;
utils.Keyboard.C = 67;
utils.Keyboard.D = 68;
utils.Keyboard.E = 69;
utils.Keyboard.F = 70;
utils.Keyboard.G = 71;
utils.Keyboard.H = 72;
utils.Keyboard.I = 73;
utils.Keyboard.J = 74;
utils.Keyboard.K = 75;
utils.Keyboard.L = 76;
utils.Keyboard.M = 77;
utils.Keyboard.N = 78;
utils.Keyboard.O = 79;
utils.Keyboard.P = 80;
utils.Keyboard.Q = 81;
utils.Keyboard.R = 82;
utils.Keyboard.S = 83;
utils.Keyboard.T = 84;
utils.Keyboard.U = 85;
utils.Keyboard.V = 86;
utils.Keyboard.W = 87;
utils.Keyboard.X = 88;
utils.Keyboard.Y = 89;
utils.Keyboard.Z = 90;
utils.Keyboard.ALTERNATE = 18;
utils.Keyboard.BACKQUOTE = 192;
utils.Keyboard.BACKSLASH = 220;
utils.Keyboard.BACKSPACE = 8;
utils.Keyboard.CAPS_LOCK = 20;
utils.Keyboard.COMMA = 188;
utils.Keyboard.COMMAND = 15;
utils.Keyboard.CONTROL = 17;
utils.Keyboard.DELETE = 46;
utils.Keyboard.DOWN = 40;
utils.Keyboard.END = 35;
utils.Keyboard.ENTER = 13;
utils.Keyboard.EQUAL = 187;
utils.Keyboard.ESCAPE = 27;
utils.Keyboard.F1 = 112;
utils.Keyboard.F2 = 113;
utils.Keyboard.F3 = 114;
utils.Keyboard.F4 = 115;
utils.Keyboard.F5 = 116;
utils.Keyboard.F6 = 117;
utils.Keyboard.F7 = 118;
utils.Keyboard.F8 = 119;
utils.Keyboard.F9 = 120;
utils.Keyboard.F10 = 121;
utils.Keyboard.F11 = 122;
utils.Keyboard.F12 = 123;
utils.Keyboard.F13 = 124;
utils.Keyboard.F14 = 125;
utils.Keyboard.F15 = 126;
utils.Keyboard.HOME = 36;
utils.Keyboard.INSERT = 45;
utils.Keyboard.LEFT = 37;
utils.Keyboard.LEFTBRACKET = 219;
utils.Keyboard.MINUS = 189;
utils.Keyboard.NUMBER_0 = 48;
utils.Keyboard.NUMBER_1 = 49;
utils.Keyboard.NUMBER_2 = 50;
utils.Keyboard.NUMBER_3 = 51;
utils.Keyboard.NUMBER_4 = 52;
utils.Keyboard.NUMBER_5 = 53;
utils.Keyboard.NUMBER_6 = 54;
utils.Keyboard.NUMBER_7 = 55;
utils.Keyboard.NUMBER_8 = 56;
utils.Keyboard.NUMBER_9 = 57;
utils.Keyboard.NUMPAD = 21;
utils.Keyboard.NUMPAD_0 = 96;
utils.Keyboard.NUMPAD_1 = 97;
utils.Keyboard.NUMPAD_2 = 98;
utils.Keyboard.NUMPAD_3 = 99;
utils.Keyboard.NUMPAD_4 = 100;
utils.Keyboard.NUMPAD_5 = 101;
utils.Keyboard.NUMPAD_6 = 102;
utils.Keyboard.NUMPAD_7 = 103;
utils.Keyboard.NUMPAD_8 = 104;
utils.Keyboard.NUMPAD_9 = 105;
utils.Keyboard.NUMPAD_ADD = 107;
utils.Keyboard.NUMPAD_DECIMAL = 110;
utils.Keyboard.NUMPAD_DIVIDE = 111;
utils.Keyboard.NUMPAD_ENTER = 108;
utils.Keyboard.NUMPAD_MULTIPLY = 106;
utils.Keyboard.NUMPAD_SUBTRACT = 109;
utils.Keyboard.PAGE_DOWN = 34;
utils.Keyboard.PAGE_UP = 33;
utils.Keyboard.PERIOD = 190;
utils.Keyboard.QUOTE = 222;
utils.Keyboard.RIGHT = 39;
utils.Keyboard.RIGHTBRACKET = 221;
utils.Keyboard.SEMICOLON = 186;
utils.Keyboard.SHIFT = 16;
utils.Keyboard.SLASH = 191;
utils.Keyboard.SPACE = 32;
utils.Keyboard.TAB = 9;
utils.Keyboard.UP = 38;
utils.NoteFrequency.defaultTuning = 440.0;
utils.NoteFrequency.LOG2E = 1.4426950408889634;
utils.NoteFrequency.Twelveth = 1 / 12;
utils.NoteFrequency.centExp = 1 / 1200;
Main.main();
})();
