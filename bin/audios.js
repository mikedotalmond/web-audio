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
	monoSynthTest: function() {
		var keys = new utils.KeyboardNotes();
		var noteFreq = keys.keycodeToNoteFreq;
		var heldKeys = [];
		var mono = new synth.MonoSynth(Main.context.destination);
		mono.set_oscillatorType(1);
		mono.adsr_attackTime = .01;
		mono.adsr_sustain = 1;
		mono.adsr_releaseTime = .2;
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
		var input = $this.biquad;
		var this1;
		this1 = context.createGain();
		this1.gain.value = 0;
		if(input != null) input.connect(this1);
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
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
