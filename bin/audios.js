(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
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
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
}
var Main = function() {
	haxe.Log.trace("MonoSynth",{ fileName : "Main.hx", lineNumber : 45, className : "Main", methodName : "new"});
	this.keyboardNotes = new utils.KeyboardNotes();
	this.keyboardInput = new utils.KeyboardInput(this.keyboardNotes);
	this.monoSynthUI = new synth.ui.MonoSynthUI(this.keyboardNotes);
	this.initAudio();
	this.initKeyboardInputs();
	this.monoSynthUI.ready.addOnce($bind(this,this.uiReady));
};
Main.__name__ = true;
Main.main = function() {
	js.Browser.window.onload = function(e) {
		haxe.Log.trace("onLoad",{ fileName : "Main.hx", lineNumber : 190, className : "Main", methodName : "main"});
		Main.createContext();
		if(Main.context == null) js.Browser.window.alert("Web Audio API not supported - try a different/better browser"); else Main.instance = new Main();
	};
	js.Browser.window.onbeforeunload = function(e) {
		haxe.Log.trace("unLoad",{ fileName : "Main.hx", lineNumber : 202, className : "Main", methodName : "main"});
		Main.instance.dispose();
		Main.instance = null;
		Main.context = null;
	};
}
Main.createContext = function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	var c;
	try {
		c = new AudioContext();
	} catch( err ) {
		haxe.Log.trace("Error creating an AudioContext",{ fileName : "Main.hx", lineNumber : 218, className : "Main", methodName : "createContext", customParams : [err]});
		c = null;
	}
	Main.context = c;
}
Main.prototype = {
	dispose: function() {
		this.crusher = null;
		this.monoSynth.dispose();
		this.monoSynth = null;
		this.keyboardInput.dispose();
		this.keyboardInput = null;
	}
	,initMonoSynth: function(destination) {
		this.monoSynth = new synth.MonoSynth(destination);
		this.monoSynth.set_oscillatorType(2);
		this.monoSynth.osc_portamentoTime = .05;
		this.monoSynth.adsr_attackTime = .05;
		this.monoSynth.adsr_decayTime = 1;
		this.monoSynth.adsr_sustain = 0.5;
		this.monoSynth.adsr_releaseTime = .2;
	}
	,initKeyboardInputs: function() {
		var _g = this;
		var handleNoteOff = function() {
			_g.monoSynth.noteOff(Main.context.currentTime);
		};
		var handleNoteOn = function(i) {
			var f = _g.keyboardNotes.noteFreq.noteIndexToFrequency(i);
			_g.monoSynth.noteOn(Main.context.currentTime,f,.8,!_g.monoSynth.noteIsOn);
		};
		this.monoSynthUI.keyboard.keyDown.add(handleNoteOn);
		this.monoSynthUI.keyboard.keyUp.add(function(i) {
			if(_g.keyboardInput.hasNotes()) handleNoteOn(_g.keyboardInput.lastNote()); else handleNoteOff();
		});
		this.keyboardInput.noteOn.add(handleNoteOn);
		this.keyboardInput.noteOff.add(function() {
			if(_g.monoSynthUI.keyboard.keyIsDown()) handleNoteOn(_g.monoSynthUI.keyboard.heldKey); else handleNoteOff();
		});
		this.keyboardInput.keyDown.add((function(f1,a2) {
			return function(a1) {
				return f1(a1,a2);
			};
		})(($_=this.monoSynthUI.keyboard,$bind($_,$_.setNoteState)),true));
		this.keyboardInput.keyUp.add((function(f2,a21) {
			return function(a1) {
				return f2(a1,a21);
			};
		})(($_=this.monoSynthUI.keyboard,$bind($_,$_.setNoteState)),false));
	}
	,initAudio: function() {
		this.crusher = new synth.processor.Crusher(Main.context,null,Main.context.destination);
		this.crusher.set_bits(4);
		this.initMonoSynth(this.crusher.node);
	}
	,onModuleSliderChange: function(id,value) {
		haxe.Log.trace("" + id + ": " + value,{ fileName : "Main.hx", lineNumber : 66, className : "Main", methodName : "onModuleSliderChange"});
		var now = Main.context.currentTime;
		var m = this.monoSynth;
		if(id.indexOf("osc-") == 0) switch(id) {
		case "osc-shape":
			m.set_oscillatorType(value | 0);
			break;
		case "osc-slide":
			m.osc_portamentoTime = value;
			break;
		} else if(id.indexOf("filter-") == 0) switch(id) {
		case "filter-type":
			m.biquad.type = value | 0;
			break;
		case "filter-freq":
			m.filterFrequency = (Math.exp(value) - 1) / 2.718281828459045 / 0.6321205588285577;
			break;
		case "filter-res":
			m.filterQ = value;
			break;
		case "filter-gain":
			m.filterGain = (Math.exp(value) - 1) / 2.718281828459045 / 0.6321205588285577;
			break;
		case "filter-env-range":
			m.filterEnvRange = (Math.exp(value) - 1) / 2.718281828459045 / 0.6321205588285577;
			break;
		case "filter-env-attack":
			m.filterEnvAttack = value;
			break;
		case "filter-env-release":
			m.filterEnvRelease = value;
			break;
		} else if(id.indexOf("adsr-") == 0) switch(id) {
		case "adsr-attack":
			m.adsr_attackTime = value;
			break;
		case "adsr-decay":
			m.adsr_decayTime = value;
			break;
		case "adsr-sustain":
			m.adsr_sustain = value;
			break;
		case "adsr-release":
			m.adsr_releaseTime = value;
			break;
		} else if(id.indexOf("out-") == 0) switch(id) {
		case "out-gain":
			m.setOutputGain((Math.exp(value) - 1) / 2.718281828459045 / 0.6321205588285577);
			break;
		}
	}
	,uiReady: function() {
		var _g = 0, _g1 = this.monoSynthUI.modules;
		while(_g < _g1.length) {
			var module = _g1[_g];
			++_g;
			module.sliderChange.add($bind(this,this.onModuleSliderChange));
		}
	}
}
var IMap = function() { }
IMap.__name__ = true;
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
var haxe = {}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new haxe.ds.StringMap();
	this.params = new haxe.ds.StringMap();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(me.responseData = r.responseText); else if(s == null) me.onError("Failed to connect or resolve host"); else switch(s) {
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
}
haxe.Log = function() { }
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe._Template = {}
haxe._Template.TemplateExpr = { __ename__ : true, __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
haxe.Template.__name__ = true;
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e3 = this.makeExpr(l);
			return function() {
				return -e3();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
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
}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
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
js.Browser = function() { }
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
}
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
	,removeAll: function() {
		this.slots = msignal.SlotList.NIL;
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,add: function(listener) {
		return this.registerListener(listener);
	}
}
msignal.Signal0 = function() {
	msignal.Signal.call(this);
};
msignal.Signal0.__name__ = true;
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot0(this,listener,once,priority);
	}
	,dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
});
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
}
msignal.Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot0.__name__ = true;
msignal.Slot0.__super__ = msignal.Slot;
msignal.Slot0.prototype = $extend(msignal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
});
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
}
var synth = {}
synth.MonoSynth = function(destination) {
	this.filterEnvRelease = 1;
	this.filterEnvAttack = .1;
	this.filterEnvRange = 1;
	this.filterGain = 1;
	this.filterQ = 10;
	this.filterFrequency = .001;
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
		this1.frequency.value = $this.filterFrequency;
		this1.Q.value = $this.filterQ;
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
	dispose: function() {
		this.adsr = null;
		this.osc = null;
		this.biquad = null;
		this.outputGain = null;
		this.osc = null;
	}
	,noteOff: function(when) {
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
			var releaseDuration = this.filterEnvRelease;
			this.biquad.frequency.cancelScheduledValues(when);
			this.biquad.frequency.setValueAtTime(this.biquad.frequency.value,when);
			this.biquad.frequency.exponentialRampToValueAtTime(this.filterFrequency * 6000,when + releaseDuration);
			when + releaseDuration;
			this.noteIsOn = false;
		}
	}
	,noteOn: function(when,freq,velocity,retrigger) {
		if(retrigger == null) retrigger = false;
		if(velocity == null) velocity = 1;
		var portamentoTime = this.osc_portamentoTime;
		this.osc[this.oscType].frequency.cancelScheduledValues(when);
		if(portamentoTime > 0 && !retrigger && freq != this.osc[this.oscType].frequency.value) {
			this.osc[this.oscType].frequency.setValueAtTime(this.osc[this.oscType].frequency.value,when);
			this.osc[this.oscType].frequency.exponentialRampToValueAtTime(freq,when + portamentoTime);
		} else this.osc[this.oscType].frequency.setValueAtTime(freq,when);
		if(!this.noteIsOn || retrigger) {
			var attackTime = this.adsr_attackTime, sustainLevel = this.adsr_sustain;
			this.adsr.gain.cancelScheduledValues(when);
			if(retrigger) this.adsr.gain.setValueAtTime(0,when);
			this.adsr.gain.setTargetAtTime(velocity,when,1 - 1 / Math.exp(attackTime));
			if(sustainLevel != 1.0) this.adsr.gain.setTargetAtTime(velocity * sustainLevel,when + attackTime,1 - 1 / Math.exp(this.adsr_decayTime));
			var start = this.filterFrequency * 6000;
			var dest = start + this.filterEnvRange * 8000;
			var startFreq = start;
			haxe.Log.trace(startFreq,{ fileName : "ADSR.hx", lineNumber : 35, className : "synth._ADSR.BiquadEnvelope_Impl_", methodName : "trigger", customParams : [dest]});
			startFreq = retrigger?startFreq:this.biquad.frequency.value;
			this.biquad.frequency.cancelScheduledValues(when);
			this.biquad.frequency.setValueAtTime(startFreq,when);
			this.biquad.frequency.exponentialRampToValueAtTime(dest,when + this.filterEnvAttack);
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
}
synth.processor = {}
synth.processor.Crusher = function(context,input,destination) {
	this.tempRight = 0;
	this.tempLeft = 0;
	this.sampleCount = 0;
	this.set_bits(8);
	this.node = (function($this) {
		var $r;
		var this1;
		this1 = (function($this) {
			var $r;
			try {
				$r = context.createScriptProcessor();
			} catch( err ) {
				$r = context.createScriptProcessor(2048);
			}
			return $r;
		}($this));
		if(input != null) input.connect(this1);
		if(destination != null) this1.connect(destination);
		$r = this1;
		return $r;
	}(this));
	this.node.onaudioprocess = $bind(this,this.crusherImpl);
};
synth.processor.Crusher.__name__ = true;
synth.processor.Crusher.prototype = {
	crusherImpl: function(e) {
		var inL = e.inputBuffer.getChannelData(0);
		var inR = e.inputBuffer.getChannelData(1);
		var outL = e.outputBuffer.getChannelData(0);
		var outR = e.outputBuffer.getChannelData(1);
		var n = outR.length;
		var e1 = this.exp;
		var ie = this.iexp;
		var samplesPerCycle = 2;
		var ditherLevel = .25;
		var dL = .5;
		var dR = .5;
		var l = 0, r = 0;
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			if(this.sampleCount >= samplesPerCycle) {
				this.sampleCount = 0;
				if(ditherLevel > 0) {
					dL = 0.5 - ditherLevel * Math.random();
					dR = 0.5 - ditherLevel * Math.random();
				} else dL = dR = 0.5;
				l = this.tempLeft = ie * (e1 * inL[i] + dL | 0);
				r = this.tempRight = ie * (e1 * inR[i] + dR | 0);
			} else {
				l = this.tempLeft;
				r = this.tempRight;
			}
			outL[i] = l;
			outR[i] = r;
			this.sampleCount++;
		}
	}
	,set_bits: function(value) {
		if(this._bits != value) {
			this.exp = Math.pow(2,value);
			this.iexp = 1 / this.exp;
		}
		return this._bits = value;
	}
}
synth.ui = {}
synth.ui.KeyboardUI = function(keyboardNotes) {
	this.keyboardNotes = keyboardNotes;
	this.keyDown = new msignal.Signal1();
	this.keyUp = new msignal.Signal1();
	this.ocataves = 2;
};
synth.ui.KeyboardUI.__name__ = true;
synth.ui.KeyboardUI.prototype = {
	getUIKeyNoteData: function(octaveShift,octaveCount) {
		if(octaveCount == null) octaveCount = 2;
		if(octaveShift == null) octaveShift = 2;
		octaveShift = octaveShift < 0?0:octaveShift > 4?4:octaveShift;
		var i = this.keyboardNotes.noteFreq.noteNameToIndex("C-2") + octaveShift * 12;
		var out = [];
		var _g = 0;
		while(_g < octaveCount) {
			var oct = _g++;
			out.push({ index : i + 12 * oct, hasSharp : true});
			out.push({ index : i + 2 + 12 * oct, hasSharp : true});
			out.push({ index : i + 4 + 12 * oct, hasSharp : false});
			out.push({ index : i + 5 + 12 * oct, hasSharp : true});
			out.push({ index : i + 7 + 12 * oct, hasSharp : true});
			out.push({ index : i + 9 + 12 * oct, hasSharp : true});
			out.push({ index : i + 11 + 12 * oct, hasSharp : false});
		}
		return out;
	}
	,setKeyIsDown: function(key,isDown) {
		if(key != null) {
			var className = key.getAttribute("data-classname");
			key.className = isDown?"key " + className + " " + className + "-hover":"key " + className;
		}
	}
	,setNoteState: function(index,isDown) {
		this.setKeyIsDown(this.noteIndexToKey.get(index),isDown);
	}
	,onKeyMouse: function(e) {
		e.stopImmediatePropagation();
		var node = e.target;
		var noteIndex = Std.parseInt(node.getAttribute("data-noteindex"));
		switch(e.type) {
		case "mouseover":
			if(this.pointerDown) {
				this.setKeyIsDown(node,true);
				this.heldKey = noteIndex;
				this.keyDown.dispatch(noteIndex);
			}
			break;
		case "mousedown":case "touchstart":
			this.pointerDown = true;
			this.setKeyIsDown(node,true);
			this.heldKey = noteIndex;
			this.keyDown.dispatch(noteIndex);
			break;
		case "mouseup":case "mouseout":case "touchend":
			if(this.heldKey != -1 && this.heldKey == noteIndex) {
				this.heldKey = -1;
				this.pointerDown = !(e.type == "mouseup" || e.type == "touchend");
				this.setKeyIsDown(node,false);
				this.keyUp.dispatch(noteIndex);
			}
			break;
		}
	}
	,setup: function(keyboardKeys) {
		this.keyboardKeys = keyboardKeys;
		this.noteIndexToKey = new haxe.ds.IntMap();
		var n = keyboardKeys.length;
		var keyWidth = this.ocataves == 1?123:this.ocataves == 2?60:this.ocataves == 3?39.5:30;
		var keyHeight = this.ocataves == 1?200:this.ocataves == 2?180:this.ocataves == 3?150:128;
		var marginRight = this.ocataves == 1?5:this.ocataves == 2?4:this.ocataves == 3?3:2;
		var _g = 0;
		while(_g < keyboardKeys.length) {
			var key = keyboardKeys[_g];
			++_g;
			key.addEventListener("mousedown",$bind(this,this.onKeyMouse));
			key.addEventListener("mouseup",$bind(this,this.onKeyMouse));
			key.addEventListener("mouseout",$bind(this,this.onKeyMouse));
			key.addEventListener("mouseover",$bind(this,this.onKeyMouse));
			var k = key;
			if(k.className.indexOf("natural") != -1) {
				k.style.width = "" + keyWidth + "px";
				k.style.height = "" + keyHeight + "px";
				k.style.marginRight = "" + marginRight + "px";
			}
			var k1 = key;
			this.noteIndexToKey.set(Std.parseInt(k1.getAttribute("data-noteindex")),k1);
		}
		this.heldKey = -1;
		this.pointerDown = false;
	}
	,getKeyboardData: function(octaveShift,octaveCount) {
		if(octaveCount == null) octaveCount = 2;
		if(octaveShift == null) octaveShift = 2;
		this.ocataves = octaveCount;
		return { visible : true, keys : this.getUIKeyNoteData(octaveShift,octaveCount)};
	}
	,keyIsDown: function() {
		return this.heldKey != -1;
	}
}
synth.ui.ModuleUI = function() {
	this.controls = [];
	this.sliderChange = new msignal.Signal2();
};
synth.ui.ModuleUI.__name__ = true;
synth.ui.ModuleUI.setupFromNodes = function(nodes) {
	var modules = [];
	var _g = 0;
	while(_g < nodes.length) {
		var node = nodes[_g];
		++_g;
		var module = new synth.ui.ModuleUI();
		var e = node;
		var _g1 = 0, _g2 = node.childNodes;
		while(_g1 < _g2.length) {
			var n = _g2[_g1];
			++_g1;
			if(n.nodeType == 1) {
				var control = synth.ui.ModuleUI.createControl(n);
				if(control != null) module.addControl(control);
			}
		}
		modules.push(module);
	}
	return modules;
}
synth.ui.ModuleUI.createControl = function(control) {
	if(control.className.indexOf("slider") != -1) {
		var input = control.getElementsByTagName("input").item(0);
		var settings = { title : input.getAttribute("title"), type : input.getAttribute("type"), min : Std.parseFloat(input.getAttribute("min")), max : Std.parseFloat(input.getAttribute("max")), step : Std.parseFloat(input.getAttribute("step")), defaultValue : Std.parseFloat(input.getAttribute("value"))};
		var range = new synth.ui.RangeControl(input,settings);
		return range;
	}
	return null;
}
synth.ui.ModuleUI.prototype = {
	onRangeChange: function(e,index) {
		e.stopPropagation();
		var control = this.controls[index];
		var value = Std.parseFloat(control.input.value);
		this.sliderChange.dispatch(control.id,value);
	}
	,addControl: function(control) {
		var n = this.controls.length;
		control.input.addEventListener("change",(function(f,a1) {
			return function(e) {
				return f(e,a1);
			};
		})($bind(this,this.onRangeChange),n));
		this.controls.push(control);
	}
}
synth.ui.RangeControl = function(input,settings) {
	this.input = input;
	this.settings = settings;
	this.id = input.id;
};
synth.ui.RangeControl.__name__ = true;
synth.ui.MonoSynthUI = function(keyboardNotes) {
	this.ready = new msignal.Signal0();
	this.keyboard = new synth.ui.KeyboardUI(keyboardNotes);
	this.modules = new Array();
	this.loadTemplate();
};
synth.ui.MonoSynthUI.__name__ = true;
synth.ui.MonoSynthUI.prototype = {
	setupControls: function(container) {
		this.modules = synth.ui.ModuleUI.setupFromNodes(container.getElementsByClassName("module"));
		this.keyboard.setup(container.getElementsByClassName("key"));
	}
	,getModuleData: function() {
		return { visible : true, osc : { visible : true}, adsr : { visible : true}, filter : { visible : true}, outGain : { visible : true}};
	}
	,renderTemplate: function() {
		var data = { modules : this.getModuleData(), keyboard : this.keyboard.getKeyboardData(2,3)};
		var markup = this.template.execute(data);
		var container = new DOMParser().parseFromString(markup,"text/html").getElementById("container");
		while(js.Browser.document.body.firstChild != null) js.Browser.document.body.removeChild(js.Browser.document.body.firstChild);
		js.Browser.document.body.appendChild(container);
		this.setupControls(container);
		this.ready.dispatch();
	}
	,templateLoaded: function(data) {
		this.template = new haxe.Template(data);
		this.renderTemplate();
	}
	,loadTemplate: function() {
		var http = new haxe.Http("synth.tpl");
		http.async = true;
		http.onError = function(err) {
			haxe.Log.trace("Error loading synth ui-template: " + err,{ fileName : "MonoSynthUI.hx", lineNumber : 37, className : "synth.ui.MonoSynthUI", methodName : "loadTemplate"});
		};
		http.onData = $bind(this,this.templateLoaded);
		http.request();
	}
}
var utils = {}
utils.KeyboardInput = function(keyNotes) {
	this.heldNotes = [];
	this.noteOn = new msignal.Signal1();
	this.noteOff = new msignal.Signal0();
	this.keyDown = new msignal.Signal1();
	this.keyUp = new msignal.Signal1();
	this.keyToNote = keyNotes.keycodeToNoteIndex;
	js.Browser.document.addEventListener("keydown",$bind(this,this.handleKeyDown));
	js.Browser.document.addEventListener("keyup",$bind(this,this.handleKeyUp));
};
utils.KeyboardInput.__name__ = true;
utils.KeyboardInput.prototype = {
	dispose: function() {
		this.heldNotes = null;
		this.keyToNote = null;
		this.keyDown.removeAll();
		this.keyDown = null;
		this.keyUp.removeAll();
		this.keyUp = null;
		this.noteOn.removeAll();
		this.noteOn = null;
		this.noteOff.removeAll();
		this.noteOff = null;
		js.Browser.document.removeEventListener("keydown",$bind(this,this.handleKeyDown));
		js.Browser.document.removeEventListener("keyup",$bind(this,this.handleKeyUp));
	}
	,handleKeyUp: function(e) {
		var n = this.heldNotes.length;
		if(n > 0) {
			var i = Lambda.indexOf(this.heldNotes,this.keyToNote.get(e.keyCode));
			if(i != -1) {
				var off = this.heldNotes.splice(i,1)[0];
				var n1 = this.heldNotes.length;
				this.keyUp.dispatch(off);
				if(this.heldNotes.length == 0) this.noteOff.dispatch(); else this.noteOn.dispatch(this.heldNotes[this.heldNotes.length - 1]);
			}
		}
	}
	,handleKeyDown: function(e) {
		if(this.keyToNote.exists(e.keyCode)) {
			var noteIndex = this.keyToNote.get(e.keyCode);
			var i = Lambda.indexOf(this.heldNotes,noteIndex);
			if(i == -1) {
				this.noteOn.dispatch(noteIndex);
				this.keyDown.dispatch(noteIndex);
				this.heldNotes.push(noteIndex);
			}
		}
	}
	,lastNote: function() {
		return (this.heldNotes.length > 0?this.heldNotes.length:-1) > 0?this.heldNotes[(this.heldNotes.length > 0?this.heldNotes.length:-1) - 1]:-1;
	}
	,hasNotes: function() {
		return (this.heldNotes.length > 0?this.heldNotes.length:-1) > 0;
	}
}
utils.KeyboardNotes = function() {
	this.noteFreq = new utils.NoteFrequencyUtil();
	this.keycodeToNoteFreq = new haxe.ds.IntMap();
	this.keycodeToNoteIndex = new haxe.ds.IntMap();
	this.keycodeToNoteIndex.set(90,this.noteFreq.noteNameToIndex("C0"));
	this.keycodeToNoteIndex.set(83,this.noteFreq.noteNameToIndex("C#0"));
	this.keycodeToNoteIndex.set(88,this.noteFreq.noteNameToIndex("D0"));
	this.keycodeToNoteIndex.set(68,this.noteFreq.noteNameToIndex("D#0"));
	this.keycodeToNoteIndex.set(67,this.noteFreq.noteNameToIndex("E0"));
	this.keycodeToNoteIndex.set(86,this.noteFreq.noteNameToIndex("F0"));
	this.keycodeToNoteIndex.set(71,this.noteFreq.noteNameToIndex("F#0"));
	this.keycodeToNoteIndex.set(66,this.noteFreq.noteNameToIndex("G0"));
	this.keycodeToNoteIndex.set(72,this.noteFreq.noteNameToIndex("G#0"));
	this.keycodeToNoteIndex.set(78,this.noteFreq.noteNameToIndex("A0"));
	this.keycodeToNoteIndex.set(74,this.noteFreq.noteNameToIndex("A#0"));
	this.keycodeToNoteIndex.set(77,this.noteFreq.noteNameToIndex("B0"));
	this.keycodeToNoteIndex.set(81,this.noteFreq.noteNameToIndex("C1"));
	this.keycodeToNoteIndex.set(50,this.noteFreq.noteNameToIndex("C#1"));
	this.keycodeToNoteIndex.set(87,this.noteFreq.noteNameToIndex("D1"));
	this.keycodeToNoteIndex.set(51,this.noteFreq.noteNameToIndex("D#1"));
	this.keycodeToNoteIndex.set(69,this.noteFreq.noteNameToIndex("E1"));
	this.keycodeToNoteIndex.set(82,this.noteFreq.noteNameToIndex("F1"));
	this.keycodeToNoteIndex.set(53,this.noteFreq.noteNameToIndex("F#1"));
	this.keycodeToNoteIndex.set(84,this.noteFreq.noteNameToIndex("G1"));
	this.keycodeToNoteIndex.set(54,this.noteFreq.noteNameToIndex("G#1"));
	this.keycodeToNoteIndex.set(89,this.noteFreq.noteNameToIndex("A1"));
	this.keycodeToNoteIndex.set(55,this.noteFreq.noteNameToIndex("A#1"));
	this.keycodeToNoteIndex.set(85,this.noteFreq.noteNameToIndex("B1"));
	this.keycodeToNoteIndex.set(73,this.noteFreq.noteNameToIndex("C2"));
	this.keycodeToNoteIndex.set(57,this.noteFreq.noteNameToIndex("C#2"));
	this.keycodeToNoteIndex.set(79,this.noteFreq.noteNameToIndex("D2"));
	this.keycodeToNoteIndex.set(48,this.noteFreq.noteNameToIndex("D#2"));
	this.keycodeToNoteIndex.set(80,this.noteFreq.noteNameToIndex("E2"));
	this.keycodeToNoteIndex.set(219,this.noteFreq.noteNameToIndex("F2"));
	this.keycodeToNoteIndex.set(187,this.noteFreq.noteNameToIndex("F#2"));
	this.keycodeToNoteIndex.set(221,this.noteFreq.noteNameToIndex("G2"));
	this.keycodeToNoteFreq.set(90,this.keycodeToNoteIndex.get(90));
	this.keycodeToNoteFreq.set(83,this.keycodeToNoteIndex.get(83));
	this.keycodeToNoteFreq.set(88,this.keycodeToNoteIndex.get(88));
	this.keycodeToNoteFreq.set(68,this.keycodeToNoteIndex.get(68));
	this.keycodeToNoteFreq.set(67,this.keycodeToNoteIndex.get(67));
	this.keycodeToNoteFreq.set(86,this.keycodeToNoteIndex.get(86));
	this.keycodeToNoteFreq.set(71,this.keycodeToNoteIndex.get(71));
	this.keycodeToNoteFreq.set(66,this.keycodeToNoteIndex.get(66));
	this.keycodeToNoteFreq.set(72,this.keycodeToNoteIndex.get(72));
	this.keycodeToNoteFreq.set(78,this.keycodeToNoteIndex.get(78));
	this.keycodeToNoteFreq.set(74,this.keycodeToNoteIndex.get(74));
	this.keycodeToNoteFreq.set(77,this.keycodeToNoteIndex.get(77));
	this.keycodeToNoteFreq.set(81,this.keycodeToNoteIndex.get(81));
	this.keycodeToNoteFreq.set(50,this.keycodeToNoteIndex.get(50));
	this.keycodeToNoteFreq.set(87,this.keycodeToNoteIndex.get(87));
	this.keycodeToNoteFreq.set(51,this.keycodeToNoteIndex.get(51));
	this.keycodeToNoteFreq.set(69,this.keycodeToNoteIndex.get(69));
	this.keycodeToNoteFreq.set(82,this.keycodeToNoteIndex.get(82));
	this.keycodeToNoteFreq.set(53,this.keycodeToNoteIndex.get(53));
	this.keycodeToNoteFreq.set(84,this.keycodeToNoteIndex.get(84));
	this.keycodeToNoteFreq.set(54,this.keycodeToNoteIndex.get(54));
	this.keycodeToNoteFreq.set(89,this.keycodeToNoteIndex.get(89));
	this.keycodeToNoteFreq.set(55,this.keycodeToNoteIndex.get(55));
	this.keycodeToNoteFreq.set(85,this.keycodeToNoteIndex.get(85));
	this.keycodeToNoteFreq.set(73,this.keycodeToNoteIndex.get(73));
	this.keycodeToNoteFreq.set(57,this.keycodeToNoteIndex.get(57));
	this.keycodeToNoteFreq.set(79,this.keycodeToNoteIndex.get(79));
	this.keycodeToNoteFreq.set(48,this.keycodeToNoteIndex.get(48));
	this.keycodeToNoteFreq.set(80,this.keycodeToNoteIndex.get(80));
	this.keycodeToNoteFreq.set(219,this.keycodeToNoteIndex.get(219));
	this.keycodeToNoteFreq.set(187,this.keycodeToNoteIndex.get(187));
	this.keycodeToNoteFreq.set(221,this.keycodeToNoteIndex.get(221));
};
utils.KeyboardNotes.__name__ = true;
utils.NoteFrequencyUtil = function() {
	if(utils.NoteFrequencyUtil.pitchNames == null) {
		utils.NoteFrequencyUtil.pitchNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
		utils.NoteFrequencyUtil.altPitchNames = [null,"Db#",null,"Eb",null,null,"Gb",null,"Ab",null,"Bb",null];
	}
	this.noteFrequencies = [];
	this.noteNames = [];
	this._octaveMiddleC = 3;
	this.set_tuningBase(440.0);
};
utils.NoteFrequencyUtil.__name__ = true;
utils.NoteFrequencyUtil.prototype = {
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
		var noteName = utils.NoteFrequencyUtil.pitchNames[pitch] + octave;
		if(utils.NoteFrequencyUtil.altPitchNames[pitch] != null) noteName += "/" + utils.NoteFrequencyUtil.altPitchNames[pitch] + octave;
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
String.__name__ = true;
Array.__name__ = true;
msignal.SlotList.NIL = new msignal.SlotList(null,null);
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
