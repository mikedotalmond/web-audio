(function () { "use strict";
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEof = function(c) {
	return c != c;
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !js_Boot.isClass(cl)) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !js_Boot.isEnum(e)) return null;
	return e;
};
Type.enumIndex = function(e) {
	return e[1];
};
var XmlType = $hxClasses["XmlType"] = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe_xml_Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe_ds_StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n1 = this.x[k1];
				k1++;
				if(n1.nodeType == Xml.Element && n1._nodeName == name) {
					this.cur = k1;
					return n1;
				}
			}
			return null;
		}};
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
	,__properties__: {set_nodeValue:"set_nodeValue",set_nodeName:"set_nodeName",get_nodeName:"get_nodeName"}
};
var audio_parameter_Parameter = function(name,defaultValue,mapping) {
	this.change = new flambe_util_Signal1();
	this.observers = new haxe_ds_ObjectMap();
	this.name = name;
	this.mapping = mapping;
	this.setDefault(defaultValue);
};
$hxClasses["audio.parameter.Parameter"] = audio_parameter_Parameter;
audio_parameter_Parameter.__name__ = true;
audio_parameter_Parameter.prototype = {
	setDefault: function(value,normalised) {
		if(normalised == null) normalised = false;
		var nv;
		if(normalised) {
			nv = value;
			value = this.mapping.map(nv);
		} else nv = this.mapping.mapInverse(value);
		this.normalisedDefaultValue = nv;
		this.defaultValue = value;
		this.setValue(nv,true);
	}
	,setValue: function(value,normalised,forced) {
		if(forced == null) forced = false;
		if(normalised == null) normalised = false;
		var nv;
		if(normalised) nv = value; else nv = this.mapping.mapInverse(value);
		if(forced || nv != this.normalisedValue) {
			this.normalisedValue = nv;
			this.change.emit(this);
		}
	}
	,setToDefault: function() {
		this.setValue(this.normalisedDefaultValue,true);
	}
	,getValue: function(normalised) {
		if(normalised == null) normalised = false;
		if(normalised) return this.normalisedValue;
		return this.mapping.map(this.normalisedValue);
	}
	,addObservers: function(observers,triggerImmediately,once) {
		if(once == null) once = false;
		if(triggerImmediately == null) triggerImmediately = false;
		var _g = 0;
		while(_g < observers.length) {
			var observer = observers[_g];
			++_g;
			this.addObserver(observer,triggerImmediately,once);
		}
	}
	,addObserver: function(observer,triggerImmediately,once) {
		if(once == null) once = false;
		if(triggerImmediately == null) triggerImmediately = false;
		if(!this.observers.exists(observer)) {
			var conn = this.change.connect($bind(observer,observer.onParameterChange));
			if(once) conn.once(); else this.observers.set(observer,conn);
		}
		if(triggerImmediately) observer.onParameterChange(this);
	}
	,removeObserver: function(o) {
		if(this.observers.exists(o)) {
			this.observers.get(o).dispose();
			this.observers.remove(o);
		}
	}
	,__class__: audio_parameter_Parameter
};
var audio_parameter_ParameterObserver = function() { };
$hxClasses["audio.parameter.ParameterObserver"] = audio_parameter_ParameterObserver;
audio_parameter_ParameterObserver.__name__ = true;
audio_parameter_ParameterObserver.prototype = {
	__class__: audio_parameter_ParameterObserver
};
var audio_parameter_mapping_Mapping = function() { };
$hxClasses["audio.parameter.mapping.Mapping"] = audio_parameter_mapping_Mapping;
audio_parameter_mapping_Mapping.__name__ = true;
audio_parameter_mapping_Mapping.prototype = {
	__class__: audio_parameter_mapping_Mapping
};
var audio_parameter_mapping_MapBool = function() {
	this.max = 1;
	this.min = 0;
};
$hxClasses["audio.parameter.mapping.MapBool"] = audio_parameter_mapping_MapBool;
audio_parameter_mapping_MapBool.__name__ = true;
audio_parameter_mapping_MapBool.__interfaces__ = [audio_parameter_mapping_Mapping];
audio_parameter_mapping_MapBool.prototype = {
	map: function(normalizedValue) {
		if(normalizedValue > 0.5) return 1; else return 0;
	}
	,mapInverse: function(value) {
		if(value == 1) return 1; else return 0;
	}
	,__class__: audio_parameter_mapping_MapBool
};
var audio_parameter_mapping_MapType = $hxClasses["audio.parameter.mapping.MapType"] = { __ename__ : true, __constructs__ : ["BOOL","INT","FLOAT","FLOAT_EXPONENTIAL"] };
audio_parameter_mapping_MapType.BOOL = ["BOOL",0];
audio_parameter_mapping_MapType.BOOL.__enum__ = audio_parameter_mapping_MapType;
audio_parameter_mapping_MapType.INT = ["INT",1];
audio_parameter_mapping_MapType.INT.__enum__ = audio_parameter_mapping_MapType;
audio_parameter_mapping_MapType.FLOAT = ["FLOAT",2];
audio_parameter_mapping_MapType.FLOAT.__enum__ = audio_parameter_mapping_MapType;
audio_parameter_mapping_MapType.FLOAT_EXPONENTIAL = ["FLOAT_EXPONENTIAL",3];
audio_parameter_mapping_MapType.FLOAT_EXPONENTIAL.__enum__ = audio_parameter_mapping_MapType;
var audio_parameter_mapping_MapFactory = function() { };
$hxClasses["audio.parameter.mapping.MapFactory"] = audio_parameter_mapping_MapFactory;
audio_parameter_mapping_MapFactory.__name__ = true;
audio_parameter_mapping_MapFactory.getMapping = function(type,min,max) {
	if(max == null) max = 1.0;
	if(min == null) min = .0;
	switch(Type.enumIndex(type)) {
	case 0:
		return new audio_parameter_mapping_MapBool();
	case 1:
		return new audio_parameter_mapping_MapIntLinear(Std["int"](min),Std["int"](max));
	case 2:
		return new audio_parameter_mapping_MapFloatLinear(min,max);
	case 3:
		return new audio_parameter_mapping_MapFloatExponential(min,max);
	}
	return null;
};
var audio_parameter_mapping_MapFloatExponential = function(min,max) {
	if(max == null) max = 1.0;
	if(min == null) min = .0;
	this.min = min;
	this.max = max;
	this._t2 = 0;
	if(min <= 0) this._t2 = 1 + min * -1;
	this._min = min + this._t2;
	this._max = max + this._t2;
	this._t0 = Math.log(this._max / this._min);
	this._t1 = 1.0 / this._t0;
};
$hxClasses["audio.parameter.mapping.MapFloatExponential"] = audio_parameter_mapping_MapFloatExponential;
audio_parameter_mapping_MapFloatExponential.__name__ = true;
audio_parameter_mapping_MapFloatExponential.__interfaces__ = [audio_parameter_mapping_Mapping];
audio_parameter_mapping_MapFloatExponential.prototype = {
	map: function(normalisedValue) {
		return this._min * Math.exp(normalisedValue * this._t0) - this._t2;
	}
	,mapInverse: function(value) {
		return Math.log((value + this._t2) / this._min) * this._t1;
	}
	,__class__: audio_parameter_mapping_MapFloatExponential
};
var audio_parameter_mapping_MapFloatLinear = function(min,max) {
	if(max == null) max = 1;
	if(min == null) min = 0;
	this.min = min;
	this.max = max;
};
$hxClasses["audio.parameter.mapping.MapFloatLinear"] = audio_parameter_mapping_MapFloatLinear;
audio_parameter_mapping_MapFloatLinear.__name__ = true;
audio_parameter_mapping_MapFloatLinear.__interfaces__ = [audio_parameter_mapping_Mapping];
audio_parameter_mapping_MapFloatLinear.prototype = {
	get_range: function() {
		return this.max - this.min;
	}
	,map: function(normalisedValue) {
		return this.min + normalisedValue * this.get_range();
	}
	,mapInverse: function(value) {
		return (value - this.min) / this.get_range();
	}
	,__class__: audio_parameter_mapping_MapFloatLinear
	,__properties__: {get_range:"get_range"}
};
var audio_parameter_mapping_MapIntLinear = function(min,max) {
	if(max == null) max = 1;
	if(min == null) min = 0;
	this.min = min;
	this.max = max;
};
$hxClasses["audio.parameter.mapping.MapIntLinear"] = audio_parameter_mapping_MapIntLinear;
audio_parameter_mapping_MapIntLinear.__name__ = true;
audio_parameter_mapping_MapIntLinear.__interfaces__ = [audio_parameter_mapping_Mapping];
audio_parameter_mapping_MapIntLinear.prototype = {
	get_range: function() {
		return this.max - this.min;
	}
	,map: function(normalisedValue) {
		return Math.round(this.min + normalisedValue * this.get_range());
	}
	,mapInverse: function(value) {
		return (value - this.min) / this.get_range();
	}
	,__class__: audio_parameter_mapping_MapIntLinear
	,__properties__: {get_range:"get_range"}
};
var flambe_util_Disposable = function() { };
$hxClasses["flambe.util.Disposable"] = flambe_util_Disposable;
flambe_util_Disposable.__name__ = true;
var flambe_Component = function() { };
$hxClasses["flambe.Component"] = flambe_Component;
flambe_Component.__name__ = true;
flambe_Component.__interfaces__ = [flambe_util_Disposable];
flambe_Component.prototype = {
	onAdded: function() {
	}
	,onRemoved: function() {
	}
	,onUpdate: function(dt) {
	}
	,dispose: function() {
		if(this.owner != null) this.owner.remove(this);
	}
	,get_name: function() {
		return null;
	}
	,init: function(owner,next) {
		this.owner = owner;
		this.next = next;
	}
	,setNext: function(next) {
		this.next = next;
	}
	,__class__: flambe_Component
	,__properties__: {get_name:"get_name"}
};
var flambe_Entity = function() {
	this.firstComponent = null;
	this.next = null;
	this.firstChild = null;
	this.parent = null;
	this._compMap = { };
};
$hxClasses["flambe.Entity"] = flambe_Entity;
flambe_Entity.__name__ = true;
flambe_Entity.__interfaces__ = [flambe_util_Disposable];
flambe_Entity.prototype = {
	add: function(component) {
		if(component.owner != null) component.owner.remove(component);
		var name = component.get_name();
		var prev = this.getComponent(name);
		if(prev != null) this.remove(prev);
		this._compMap[name] = component;
		var tail = null;
		var p = this.firstComponent;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		if(tail != null) tail.setNext(component); else this.firstComponent = component;
		component.init(this,null);
		component.onAdded();
		return this;
	}
	,remove: function(component) {
		var prev = null;
		var p = this.firstComponent;
		while(p != null) {
			var next = p.next;
			if(p == component) {
				if(prev == null) this.firstComponent = next; else prev.init(this,next);
				delete(this._compMap[p.get_name()]);
				p.onRemoved();
				p.init(null,null);
				return true;
			}
			prev = p;
			p = next;
		}
		return false;
	}
	,getComponent: function(name) {
		return this._compMap[name];
	}
	,addChild: function(entity,append) {
		if(append == null) append = true;
		if(entity.parent != null) entity.parent.removeChild(entity);
		entity.parent = this;
		if(append) {
			var tail = null;
			var p = this.firstChild;
			while(p != null) {
				tail = p;
				p = p.next;
			}
			if(tail != null) tail.next = entity; else this.firstChild = entity;
		} else {
			entity.next = this.firstChild;
			this.firstChild = entity;
		}
		return this;
	}
	,removeChild: function(entity) {
		var prev = null;
		var p = this.firstChild;
		while(p != null) {
			var next = p.next;
			if(p == entity) {
				if(prev == null) this.firstChild = next; else prev.next = next;
				p.parent = null;
				p.next = null;
				return;
			}
			prev = p;
			p = next;
		}
	}
	,disposeChildren: function() {
		while(this.firstChild != null) this.firstChild.dispose();
	}
	,dispose: function() {
		if(this.parent != null) this.parent.removeChild(this);
		while(this.firstComponent != null) this.firstComponent.dispose();
		this.disposeChildren();
	}
	,toString: function() {
		return this.toStringImpl("");
	}
	,toStringImpl: function(indent) {
		var output = "";
		var p = this.firstComponent;
		while(p != null) {
			output += p.get_name();
			if(p.next != null) output += ", ";
			p = p.next;
		}
		output += "\n";
		var u2514 = String.fromCharCode(9492);
		var u241c = String.fromCharCode(9500);
		var u2500 = String.fromCharCode(9472);
		var u2502 = String.fromCharCode(9474);
		var p1 = this.firstChild;
		while(p1 != null) {
			var last = p1.next == null;
			output += indent + (last?u2514:u241c) + u2500 + u2500 + " ";
			output += p1.toStringImpl(indent + (last?" ":u2502) + "   ");
			p1 = p1.next;
		}
		return output;
	}
	,__class__: flambe_Entity
};
var flambe_util_PackageLog = function() { };
$hxClasses["flambe.util.PackageLog"] = flambe_util_PackageLog;
flambe_util_PackageLog.__name__ = true;
var flambe_platform_Platform = function() { };
$hxClasses["flambe.platform.Platform"] = flambe_platform_Platform;
flambe_platform_Platform.__name__ = true;
flambe_platform_Platform.prototype = {
	__class__: flambe_platform_Platform
};
var flambe_platform_html_HtmlPlatform = function() {
};
$hxClasses["flambe.platform.html.HtmlPlatform"] = flambe_platform_html_HtmlPlatform;
flambe_platform_html_HtmlPlatform.__name__ = true;
flambe_platform_html_HtmlPlatform.__interfaces__ = [flambe_platform_Platform];
flambe_platform_html_HtmlPlatform.prototype = {
	init: function() {
		var _g = this;
		flambe_platform_html_HtmlUtil.fixAndroidMath();
		var canvas = null;
		try {
			canvas = js_Browser.get_window().flambe.canvas;
		} catch( error ) {
		}
		flambe_util_Assert.that(canvas != null,"Could not find a Flambe canvas! Are you embedding with flambe.js?");
		canvas.setAttribute("tabindex","0");
		canvas.style.outlineStyle = "none";
		canvas.style.webkitTapHighlightColor = "transparent";
		canvas.setAttribute("moz-opaque","true");
		this._stage = new flambe_platform_html_HtmlStage(canvas);
		this._pointer = new flambe_platform_BasicPointer();
		this._mouse = new flambe_platform_html_HtmlMouse(this._pointer,canvas);
		this._renderer = this.createRenderer(canvas);
		this.mainLoop = new flambe_platform_MainLoop();
		this.musicPlaying = false;
		this._canvas = canvas;
		this._container = canvas.parentElement;
		this._container.style.overflow = "hidden";
		this._container.style.position = "relative";
		this._container.style.msTouchAction = "none";
		var lastTouchTime = 0;
		var onMouse = function(event) {
			if(event.timeStamp - lastTouchTime < 1000) return;
			var bounds = canvas.getBoundingClientRect();
			var x = _g.getX(event,bounds);
			var y = _g.getY(event,bounds);
			var _g1 = event.type;
			switch(_g1) {
			case "mousedown":
				if(event.target == canvas) {
					event.preventDefault();
					_g._mouse.submitDown(x,y,event.button);
					canvas.focus();
				}
				break;
			case "mousemove":
				_g._mouse.submitMove(x,y);
				break;
			case "mouseup":
				_g._mouse.submitUp(x,y,event.button);
				break;
			case "mousewheel":case "DOMMouseScroll":
				var velocity;
				if(event.type == "mousewheel") velocity = event.wheelDelta / 40; else velocity = -event.detail;
				if(_g._mouse.submitScroll(x,y,velocity)) event.preventDefault();
				break;
			}
		};
		js_Browser.get_window().addEventListener("mousedown",onMouse,false);
		js_Browser.get_window().addEventListener("mousemove",onMouse,false);
		js_Browser.get_window().addEventListener("mouseup",onMouse,false);
		canvas.addEventListener("mousewheel",onMouse,false);
		canvas.addEventListener("DOMMouseScroll",onMouse,false);
		canvas.addEventListener("contextmenu",function(event1) {
			event1.preventDefault();
		},false);
		var standardTouch = typeof(js_Browser.get_window().ontouchstart) != "undefined";
		var msTouch = 'msMaxTouchPoints' in window.navigator && (window.navigator.msMaxTouchPoints > 1);
		if(standardTouch || msTouch) {
			var basicTouch = new flambe_platform_BasicTouch(this._pointer,standardTouch?4:js_Browser.get_navigator().msMaxTouchPoints);
			this._touch = basicTouch;
			var onTouch = function(event2) {
				var changedTouches;
				if(standardTouch) changedTouches = event2.changedTouches; else changedTouches = [event2];
				var bounds1 = event2.target.getBoundingClientRect();
				lastTouchTime = event2.timeStamp;
				var _g2 = event2.type;
				switch(_g2) {
				case "touchstart":case "MSPointerDown":case "pointerdown":
					event2.preventDefault();
					if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) flambe_platform_html_HtmlUtil.hideMobileBrowser();
					var _g11 = 0;
					while(_g11 < changedTouches.length) {
						var touch = changedTouches[_g11];
						++_g11;
						var x1 = _g.getX(touch,bounds1);
						var y1 = _g.getY(touch,bounds1);
						var id = Std["int"](standardTouch?touch.identifier:touch.pointerId);
						basicTouch.submitDown(id,x1,y1);
					}
					break;
				case "touchmove":case "MSPointerMove":case "pointermove":
					event2.preventDefault();
					var _g12 = 0;
					while(_g12 < changedTouches.length) {
						var touch1 = changedTouches[_g12];
						++_g12;
						var x2 = _g.getX(touch1,bounds1);
						var y2 = _g.getY(touch1,bounds1);
						var id1 = Std["int"](standardTouch?touch1.identifier:touch1.pointerId);
						basicTouch.submitMove(id1,x2,y2);
					}
					break;
				case "touchend":case "touchcancel":case "MSPointerUp":case "pointerup":
					var _g13 = 0;
					while(_g13 < changedTouches.length) {
						var touch2 = changedTouches[_g13];
						++_g13;
						var x3 = _g.getX(touch2,bounds1);
						var y3 = _g.getY(touch2,bounds1);
						var id2 = Std["int"](standardTouch?touch2.identifier:touch2.pointerId);
						basicTouch.submitUp(id2,x3,y3);
					}
					break;
				}
			};
			if(standardTouch) {
				canvas.addEventListener("touchstart",onTouch,false);
				canvas.addEventListener("touchmove",onTouch,false);
				canvas.addEventListener("touchend",onTouch,false);
				canvas.addEventListener("touchcancel",onTouch,false);
			} else {
				canvas.addEventListener("MSPointerDown",onTouch,false);
				canvas.addEventListener("MSPointerMove",onTouch,false);
				canvas.addEventListener("MSPointerUp",onTouch,false);
			}
		} else this._touch = new flambe_platform_DummyTouch();
		var oldErrorHandler = js_Browser.get_window().onerror;
		js_Browser.get_window().onerror = function(message,url,line) {
			flambe_System.uncaughtError.emit(message);
			if(oldErrorHandler != null) return oldErrorHandler(message,url,line); else return false;
		};
		var hiddenApi = flambe_platform_html_HtmlUtil.loadExtension("hidden",js_Browser.get_document());
		if(hiddenApi.value != null) {
			var onVisibilityChanged = function(_) {
				flambe_System.hidden.set__(Reflect.field(js_Browser.get_document(),hiddenApi.field));
			};
			onVisibilityChanged(null);
			js_Browser.get_document().addEventListener(hiddenApi.prefix + "visibilitychange",onVisibilityChanged,false);
		} else {
			var onPageTransitionChange = function(event3) {
				flambe_System.hidden.set__(event3.type == "pagehide");
			};
			js_Browser.get_window().addEventListener("pageshow",onPageTransitionChange,false);
			js_Browser.get_window().addEventListener("pagehide",onPageTransitionChange,false);
		}
		flambe_System.hidden.get_changed().connect(function(hidden,_1) {
			if(!hidden) _g._skipFrame = true;
		});
		this._skipFrame = false;
		this._lastUpdate = flambe_platform_html_HtmlUtil.now();
		var requestAnimationFrame = flambe_platform_html_HtmlUtil.loadExtension("requestAnimationFrame").value;
		if(requestAnimationFrame != null) {
			var performance = js_Browser.get_window().performance;
			var hasPerfNow = performance != null && flambe_platform_html_HtmlUtil.polyfill("now",performance);
			if(hasPerfNow) this._lastUpdate = performance.now(); else flambe_Log.warn("No monotonic timer support, falling back to the system date");
			var updateFrame = null;
			updateFrame = function(now) {
				_g.update(hasPerfNow?performance.now():now);
				requestAnimationFrame(updateFrame,canvas);
			};
			requestAnimationFrame(updateFrame,canvas);
		} else {
			flambe_Log.warn("No requestAnimationFrame support, falling back to setInterval");
			js_Browser.get_window().setInterval(function() {
				_g.update(flambe_platform_html_HtmlUtil.now());
			},16);
		}
		new flambe_platform_DebugLogic(this);
		if(flambe_platform_html_HtmlCatapultClient.canUse()) this._catapult = new flambe_platform_html_HtmlCatapultClient(); else this._catapult = null;
		flambe_Log.info("Initialized HTML platform",["renderer",this._renderer.get_type()]);
	}
	,loadAssetPack: function(manifest) {
		return new flambe_platform_html_HtmlAssetPackLoader(this,manifest).promise;
	}
	,getStage: function() {
		return this._stage;
	}
	,createLogHandler: function(tag) {
		if(flambe_platform_html_HtmlLogHandler.isSupported()) return new flambe_platform_html_HtmlLogHandler(tag);
		return null;
	}
	,getTime: function() {
		return flambe_platform_html_HtmlUtil.now() / 1000;
	}
	,getCatapultClient: function() {
		return this._catapult;
	}
	,update: function(now) {
		var dt = (now - this._lastUpdate) / 1000;
		this._lastUpdate = now;
		if(flambe_System.hidden.get__()) return;
		if(this._skipFrame) {
			this._skipFrame = false;
			return;
		}
		this.mainLoop.update(dt);
		this.mainLoop.render(this._renderer);
	}
	,getPointer: function() {
		return this._pointer;
	}
	,getMouse: function() {
		return this._mouse;
	}
	,getTouch: function() {
		return this._touch;
	}
	,getKeyboard: function() {
		var _g1 = this;
		if(this._keyboard == null) {
			this._keyboard = new flambe_platform_BasicKeyboard();
			var onKey = function(event) {
				var _g = event.type;
				switch(_g) {
				case "keydown":
					if(_g1._keyboard.submitDown(event.keyCode)) event.preventDefault();
					break;
				case "keyup":
					_g1._keyboard.submitUp(event.keyCode);
					break;
				}
			};
			this._canvas.addEventListener("keydown",onKey,false);
			this._canvas.addEventListener("keyup",onKey,false);
		}
		return this._keyboard;
	}
	,getRenderer: function() {
		return this._renderer;
	}
	,getX: function(event,bounds) {
		return (event.clientX - bounds.left) * this._stage.get_width() / bounds.width;
	}
	,getY: function(event,bounds) {
		return (event.clientY - bounds.top) * this._stage.get_height() / bounds.height;
	}
	,createRenderer: function(canvas) {
		try {
			var gl = js_html__$CanvasElement_CanvasUtil.getContextWebGL(canvas,{ alpha : false, depth : false, failIfMajorPerformanceCaveat : true});
			if(gl != null) {
				if(flambe_platform_html_HtmlUtil.detectSlowDriver(gl)) flambe_Log.warn("Detected a slow WebGL driver, falling back to canvas"); else return new flambe_platform_html_WebGLRenderer(this._stage,gl);
			}
		} catch( _ ) {
		}
		return new flambe_platform_html_CanvasRenderer(canvas);
		flambe_Log.error("No renderer available!");
		return null;
	}
	,__class__: flambe_platform_html_HtmlPlatform
};
var flambe_util_Value = function(value,listener) {
	this._value = value;
	if(listener != null) this._changed = new flambe_util_Signal2(listener); else this._changed = null;
};
$hxClasses["flambe.util.Value"] = flambe_util_Value;
flambe_util_Value.__name__ = true;
flambe_util_Value.prototype = {
	watch: function(listener) {
		listener(this._value,this._value);
		return this.get_changed().connect(listener);
	}
	,get__: function() {
		return this._value;
	}
	,set__: function(newValue) {
		var oldValue = this._value;
		if(newValue != oldValue) {
			this._value = newValue;
			if(this._changed != null) this._changed.emit(newValue,oldValue);
		}
		return newValue;
	}
	,get_changed: function() {
		if(this._changed == null) this._changed = new flambe_util_Signal2();
		return this._changed;
	}
	,toString: function() {
		return "" + Std.string(this._value);
	}
	,__class__: flambe_util_Value
	,__properties__: {get_changed:"get_changed",set__:"set__",get__:"get__"}
};
var flambe_util_SignalConnection = function(signal,listener) {
	this._next = null;
	this._signal = signal;
	this._listener = listener;
	this.stayInList = true;
};
$hxClasses["flambe.util.SignalConnection"] = flambe_util_SignalConnection;
flambe_util_SignalConnection.__name__ = true;
flambe_util_SignalConnection.__interfaces__ = [flambe_util_Disposable];
flambe_util_SignalConnection.prototype = {
	once: function() {
		this.stayInList = false;
		return this;
	}
	,dispose: function() {
		if(this._signal != null) {
			this._signal.disconnect(this);
			this._signal = null;
		}
	}
	,__class__: flambe_util_SignalConnection
};
var flambe_util_SignalBase = function(listener) {
	if(listener != null) this._head = new flambe_util_SignalConnection(this,listener); else this._head = null;
	this._deferredTasks = null;
};
$hxClasses["flambe.util.SignalBase"] = flambe_util_SignalBase;
flambe_util_SignalBase.__name__ = true;
flambe_util_SignalBase.prototype = {
	hasListeners: function() {
		return this._head != null;
	}
	,connectImpl: function(listener,prioritize) {
		var _g = this;
		var conn = new flambe_util_SignalConnection(this,listener);
		if(this.dispatching()) this.defer(function() {
			_g.listAdd(conn,prioritize);
		}); else this.listAdd(conn,prioritize);
		return conn;
	}
	,disconnect: function(conn) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.listRemove(conn);
		}); else this.listRemove(conn);
	}
	,defer: function(fn) {
		var tail = null;
		var p = this._deferredTasks;
		while(p != null) {
			tail = p;
			p = p.next;
		}
		var task = new flambe_util__$SignalBase_Task(fn);
		if(tail != null) tail.next = task; else this._deferredTasks = task;
	}
	,willEmit: function() {
		flambe_util_Assert.that(!this.dispatching());
		var snapshot = this._head;
		this._head = flambe_util_SignalBase.DISPATCHING_SENTINEL;
		return snapshot;
	}
	,didEmit: function(head) {
		this._head = head;
		var snapshot = this._deferredTasks;
		this._deferredTasks = null;
		while(snapshot != null) {
			snapshot.fn();
			snapshot = snapshot.next;
		}
	}
	,listAdd: function(conn,prioritize) {
		if(prioritize) {
			conn._next = this._head;
			this._head = conn;
		} else {
			var tail = null;
			var p = this._head;
			while(p != null) {
				tail = p;
				p = p._next;
			}
			if(tail != null) tail._next = conn; else this._head = conn;
		}
	}
	,listRemove: function(conn) {
		var prev = null;
		var p = this._head;
		while(p != null) {
			if(p == conn) {
				var next = p._next;
				if(prev == null) this._head = next; else prev._next = next;
				return;
			}
			prev = p;
			p = p._next;
		}
	}
	,dispatching: function() {
		return this._head == flambe_util_SignalBase.DISPATCHING_SENTINEL;
	}
	,__class__: flambe_util_SignalBase
};
var flambe_util_Signal2 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal2"] = flambe_util_Signal2;
flambe_util_Signal2.__name__ = true;
flambe_util_Signal2.__super__ = flambe_util_SignalBase;
flambe_util_Signal2.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1,arg2) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl(arg1,arg2);
		}); else this.emitImpl(arg1,arg2);
	}
	,emitImpl: function(arg1,arg2) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1,arg2);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal2
});
var flambe_util_Signal1 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal1"] = flambe_util_Signal1;
flambe_util_Signal1.__name__ = true;
flambe_util_Signal1.__super__ = flambe_util_SignalBase;
flambe_util_Signal1.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function(arg1) {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl(arg1);
		}); else this.emitImpl(arg1);
	}
	,emitImpl: function(arg1) {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener(arg1);
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal1
});
var flambe_animation_AnimatedFloat = function(value,listener) {
	this._behavior = null;
	flambe_util_Value.call(this,value,listener);
};
$hxClasses["flambe.animation.AnimatedFloat"] = flambe_animation_AnimatedFloat;
flambe_animation_AnimatedFloat.__name__ = true;
flambe_animation_AnimatedFloat.__super__ = flambe_util_Value;
flambe_animation_AnimatedFloat.prototype = $extend(flambe_util_Value.prototype,{
	set__: function(value) {
		this._behavior = null;
		return flambe_util_Value.prototype.set__.call(this,value);
	}
	,update: function(dt) {
		if(this._behavior != null) {
			flambe_util_Value.prototype.set__.call(this,this._behavior.update(dt));
			if(this._behavior.isComplete()) this._behavior = null;
		}
	}
	,animateTo: function(to,seconds,easing) {
		this.set_behavior(new flambe_animation_Tween(this._value,to,seconds,easing));
	}
	,animateBy: function(by,seconds,easing) {
		this.set_behavior(new flambe_animation_Tween(this._value,this._value + by,seconds,easing));
	}
	,set_behavior: function(behavior) {
		this._behavior = behavior;
		this.update(0);
		return behavior;
	}
	,__class__: flambe_animation_AnimatedFloat
	,__properties__: $extend(flambe_util_Value.prototype.__properties__,{set_behavior:"set_behavior"})
});
var flambe_System = function() { };
$hxClasses["flambe.System"] = flambe_System;
flambe_System.__name__ = true;
flambe_System.__properties__ = {get_keyboard:"get_keyboard",get_touch:"get_touch",get_mouse:"get_mouse",get_pointer:"get_pointer",get_stage:"get_stage",get_time:"get_time"}
flambe_System.init = function() {
	if(!flambe_System._calledInit) {
		flambe_System._platform.init();
		flambe_System._calledInit = true;
	}
};
flambe_System.loadAssetPack = function(manifest) {
	flambe_System.assertCalledInit();
	return flambe_System._platform.loadAssetPack(manifest);
};
flambe_System.createLogger = function(tag) {
	return new flambe_util_Logger(flambe_System._platform.createLogHandler(tag));
};
flambe_System.get_time = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getTime();
};
flambe_System.get_stage = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getStage();
};
flambe_System.get_pointer = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getPointer();
};
flambe_System.get_mouse = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getMouse();
};
flambe_System.get_touch = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getTouch();
};
flambe_System.get_keyboard = function() {
	flambe_System.assertCalledInit();
	return flambe_System._platform.getKeyboard();
};
flambe_System.assertCalledInit = function() {
	flambe_util_Assert.that(flambe_System._calledInit,"You must call System.init() first");
};
var flambe_util_Logger = function(handler) {
	this._handler = handler;
};
$hxClasses["flambe.util.Logger"] = flambe_util_Logger;
flambe_util_Logger.__name__ = true;
flambe_util_Logger.prototype = {
	info: function(text,fields) {
		this.log(flambe_util_LogLevel.Info,text,fields);
	}
	,warn: function(text,fields) {
		this.log(flambe_util_LogLevel.Warn,text,fields);
	}
	,error: function(text,fields) {
		this.log(flambe_util_LogLevel.Error,text,fields);
	}
	,log: function(level,text,fields) {
		if(this._handler == null) return;
		if(text == null) text = "";
		if(fields != null) text = flambe_util_Strings.withFields(text,fields);
		this._handler.log(level,text);
	}
	,__class__: flambe_util_Logger
};
var flambe_Log = function() { };
$hxClasses["flambe.Log"] = flambe_Log;
flambe_Log.__name__ = true;
flambe_Log.info = function(text,args) {
	flambe_Log.logger.info(text,args);
};
flambe_Log.warn = function(text,args) {
	flambe_Log.logger.warn(text,args);
};
flambe_Log.error = function(text,args) {
	flambe_Log.logger.error(text,args);
};
flambe_Log.__super__ = flambe_util_PackageLog;
flambe_Log.prototype = $extend(flambe_util_PackageLog.prototype,{
	__class__: flambe_Log
});
var flambe_SpeedAdjuster = function() {
	this._realDt = 0;
};
$hxClasses["flambe.SpeedAdjuster"] = flambe_SpeedAdjuster;
flambe_SpeedAdjuster.__name__ = true;
flambe_SpeedAdjuster.__super__ = flambe_Component;
flambe_SpeedAdjuster.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "SpeedAdjuster_10";
	}
	,onUpdate: function(dt) {
		if(this._realDt > 0) {
			dt = this._realDt;
			this._realDt = 0;
		}
		this.scale.update(dt);
	}
	,__class__: flambe_SpeedAdjuster
});
var flambe_animation_Behavior = function() { };
$hxClasses["flambe.animation.Behavior"] = flambe_animation_Behavior;
flambe_animation_Behavior.__name__ = true;
flambe_animation_Behavior.prototype = {
	__class__: flambe_animation_Behavior
};
var flambe_animation_Ease = function() { };
$hxClasses["flambe.animation.Ease"] = flambe_animation_Ease;
flambe_animation_Ease.__name__ = true;
flambe_animation_Ease.linear = function(t) {
	return t;
};
flambe_animation_Ease.quadOut = function(t) {
	return t * (2 - t);
};
flambe_animation_Ease.quartOut = function(t) {
	return 1 - --t * t * t * t;
};
var flambe_animation_Tween = function(from,to,seconds,easing) {
	this._from = from;
	this._to = to;
	this._duration = seconds;
	this.elapsed = 0;
	if(easing != null) this._easing = easing; else this._easing = flambe_animation_Ease.linear;
};
$hxClasses["flambe.animation.Tween"] = flambe_animation_Tween;
flambe_animation_Tween.__name__ = true;
flambe_animation_Tween.__interfaces__ = [flambe_animation_Behavior];
flambe_animation_Tween.prototype = {
	update: function(dt) {
		this.elapsed += dt;
		if(this.elapsed >= this._duration) return this._to; else return this._from + (this._to - this._from) * this._easing(this.elapsed / this._duration);
	}
	,isComplete: function() {
		return this.elapsed >= this._duration;
	}
	,__class__: flambe_animation_Tween
};
var flambe_asset_Asset = function() { };
$hxClasses["flambe.asset.Asset"] = flambe_asset_Asset;
flambe_asset_Asset.__name__ = true;
flambe_asset_Asset.__interfaces__ = [flambe_util_Disposable];
flambe_asset_Asset.prototype = {
	__class__: flambe_asset_Asset
};
var flambe_asset_AssetFormat = $hxClasses["flambe.asset.AssetFormat"] = { __ename__ : true, __constructs__ : ["WEBP","JXR","PNG","JPG","GIF","DDS","PVR","PKM","MP3","M4A","OPUS","OGG","WAV","Data"] };
flambe_asset_AssetFormat.WEBP = ["WEBP",0];
flambe_asset_AssetFormat.WEBP.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JXR = ["JXR",1];
flambe_asset_AssetFormat.JXR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PNG = ["PNG",2];
flambe_asset_AssetFormat.PNG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.JPG = ["JPG",3];
flambe_asset_AssetFormat.JPG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.GIF = ["GIF",4];
flambe_asset_AssetFormat.GIF.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.DDS = ["DDS",5];
flambe_asset_AssetFormat.DDS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PVR = ["PVR",6];
flambe_asset_AssetFormat.PVR.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.PKM = ["PKM",7];
flambe_asset_AssetFormat.PKM.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.MP3 = ["MP3",8];
flambe_asset_AssetFormat.MP3.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.M4A = ["M4A",9];
flambe_asset_AssetFormat.M4A.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OPUS = ["OPUS",10];
flambe_asset_AssetFormat.OPUS.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.OGG = ["OGG",11];
flambe_asset_AssetFormat.OGG.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.WAV = ["WAV",12];
flambe_asset_AssetFormat.WAV.__enum__ = flambe_asset_AssetFormat;
flambe_asset_AssetFormat.Data = ["Data",13];
flambe_asset_AssetFormat.Data.__enum__ = flambe_asset_AssetFormat;
var flambe_asset_AssetEntry = function(name,url,format,bytes) {
	this.name = name;
	this.url = url;
	this.format = format;
	this.bytes = bytes;
};
$hxClasses["flambe.asset.AssetEntry"] = flambe_asset_AssetEntry;
flambe_asset_AssetEntry.__name__ = true;
flambe_asset_AssetEntry.prototype = {
	__class__: flambe_asset_AssetEntry
};
var flambe_asset_AssetPack = function() { };
$hxClasses["flambe.asset.AssetPack"] = flambe_asset_AssetPack;
flambe_asset_AssetPack.__name__ = true;
flambe_asset_AssetPack.__interfaces__ = [flambe_util_Disposable];
flambe_asset_AssetPack.prototype = {
	__class__: flambe_asset_AssetPack
};
var flambe_asset_File = function() { };
$hxClasses["flambe.asset.File"] = flambe_asset_File;
flambe_asset_File.__name__ = true;
flambe_asset_File.__interfaces__ = [flambe_asset_Asset];
flambe_asset_File.prototype = {
	__class__: flambe_asset_File
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = true;
js_Browser.__properties__ = {get_navigator:"get_navigator",get_location:"get_location",get_document:"get_document",get_window:"get_window"}
js_Browser.get_window = function() {
	return window;
};
js_Browser.get_document = function() {
	return window.document;
};
js_Browser.get_location = function() {
	return window.location;
};
js_Browser.get_navigator = function() {
	return window.navigator;
};
js_Browser.getLocalStorage = function() {
	try {
		var s = js_Browser.get_window().localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
};
js_Browser.getSessionStorage = function() {
	try {
		var s = js_Browser.get_window().sessionStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
};
var flambe_asset_Manifest = function() {
	this._remoteBase = null;
	this._localBase = null;
	this._entries = [];
};
$hxClasses["flambe.asset.Manifest"] = flambe_asset_Manifest;
flambe_asset_Manifest.__name__ = true;
flambe_asset_Manifest.fromAssets = function(packName,required) {
	if(required == null) required = true;
	var packData = Reflect.field(haxe_rtti_Meta.getType(flambe_asset_Manifest).assets[0],packName);
	if(packData == null) {
		if(required) throw flambe_util_Strings.withFields("Missing asset pack",["name",packName]);
		return null;
	}
	var manifest = new flambe_asset_Manifest();
	manifest.set_localBase("assets");
	var _g = 0;
	while(_g < packData.length) {
		var asset = packData[_g];
		++_g;
		var name = asset.name;
		var path = packName + "/" + name + "?v=" + Std.string(asset.md5);
		var format = flambe_asset_Manifest.inferFormat(name);
		if(format != flambe_asset_AssetFormat.Data) name = flambe_util_Strings.removeFileExtension(name);
		manifest.add(name,path,asset.bytes,format);
	}
	return manifest;
};
flambe_asset_Manifest.inferFormat = function(url) {
	var extension = flambe_util_Strings.getUrlExtension(url);
	if(extension != null) {
		var _g = extension.toLowerCase();
		switch(_g) {
		case "gif":
			return flambe_asset_AssetFormat.GIF;
		case "jpg":case "jpeg":
			return flambe_asset_AssetFormat.JPG;
		case "jxr":case "wdp":
			return flambe_asset_AssetFormat.JXR;
		case "png":
			return flambe_asset_AssetFormat.PNG;
		case "webp":
			return flambe_asset_AssetFormat.WEBP;
		case "dds":
			return flambe_asset_AssetFormat.DDS;
		case "pvr":
			return flambe_asset_AssetFormat.PVR;
		case "pkm":
			return flambe_asset_AssetFormat.PKM;
		case "m4a":
			return flambe_asset_AssetFormat.M4A;
		case "mp3":
			return flambe_asset_AssetFormat.MP3;
		case "ogg":
			return flambe_asset_AssetFormat.OGG;
		case "opus":
			return flambe_asset_AssetFormat.OPUS;
		case "wav":
			return flambe_asset_AssetFormat.WAV;
		}
	} else flambe_Log.warn("No file extension for asset, it will be loaded as data",["url",url]);
	return flambe_asset_AssetFormat.Data;
};
flambe_asset_Manifest.prototype = {
	add: function(name,url,bytes,format) {
		if(bytes == null) bytes = 0;
		if(format == null) format = flambe_asset_Manifest.inferFormat(url);
		var entry = new flambe_asset_AssetEntry(name,url,format,bytes);
		this._entries.push(entry);
		return entry;
	}
	,iterator: function() {
		return HxOverrides.iter(this._entries);
	}
	,getFullURL: function(entry) {
		var basePath;
		if(this.get_remoteBase() != null && flambe_asset_Manifest._supportsCrossOrigin) basePath = this.get_remoteBase(); else basePath = this.get_localBase();
		if(basePath != null) return flambe_util_Strings.joinPath(basePath,entry.url); else return entry.url;
	}
	,get_localBase: function() {
		return this._localBase;
	}
	,set_localBase: function(localBase) {
		if(localBase != null) flambe_util_Assert.that(!StringTools.startsWith(localBase,"http://") && !StringTools.startsWith(localBase,"https://"),"localBase must be a path on the same domain, NOT starting with http(s)://");
		return this._localBase = localBase;
	}
	,get_remoteBase: function() {
		return this._remoteBase;
	}
	,__class__: flambe_asset_Manifest
	,__properties__: {get_remoteBase:"get_remoteBase",set_localBase:"set_localBase",get_localBase:"get_localBase"}
};
var flambe_camera_Camera = function(container) {
	this.container = container;
	this.behaviours = new Array();
	this.change = new flambe_util_Signal0();
	this.visibleBounds = new flambe_math_Rectangle();
	this._targetX = .0;
	this._targetY = .0;
	this._panX = .0;
	this._panY = .0;
	this._rotation = .0;
	this._zoom = 1.0;
	this.invalidated = true;
};
$hxClasses["flambe.camera.Camera"] = flambe_camera_Camera;
flambe_camera_Camera.__name__ = true;
flambe_camera_Camera.__super__ = flambe_Component;
flambe_camera_Camera.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Camera_7";
	}
	,onAdded: function() {
		this.container = this.owner;
		this.rootSprite = this.container.getComponent("Sprite_0");
		if(this.rootSprite == null) throw "Uh-oh! No Sprite found in the container Entity " + Std.string(this.container);
		this.owner.add(this.controller = new flambe_camera_CameraController(this));
		this.stageResized = flambe_System.get_stage().resize.connect($bind(this,this.onStageResized),true);
		this.onStageResized();
	}
	,onRemoved: function() {
		this.reset();
		var _g = 0;
		var _g1 = this.behaviours;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.dispose();
		}
		this.behaviours = null;
		if(this.controller != null) {
			this.controller.dispose();
			this.controller = null;
		}
		if(this.stageResized != null) {
			this.stageResized.dispose();
			this.stageResized = null;
		}
		this.rootSprite = null;
		this.container = null;
	}
	,onUpdate: function(dt) {
		var w = this.stageCentreX;
		var h = this.stageCentreY;
		var _g = 0;
		var _g1 = this.behaviours;
		while(_g < _g1.length) {
			var behaviour = _g1[_g];
			++_g;
			behaviour.update(dt);
		}
		if(this.invalidated) {
			this.rootSprite.anchorX.set__(this._targetX - this._panX);
			this.rootSprite.anchorY.set__(this._targetY - this._panY);
			this.rootSprite.rotation.set__(this._rotation);
			this.rootSprite.setScale(this._zoom);
			this.rootSprite.x.set__(w);
			this.rootSprite.y.set__(h);
			var left = this.rootSprite.anchorX.get__() - w / this._zoom;
			var top = this.rootSprite.anchorY.get__() - h / this._zoom;
			this.visibleBounds.set(left,top,this.stageWidth / this._zoom,this.stageHeight / this._zoom);
			var _g2 = 0;
			var _g11 = this.behaviours;
			while(_g2 < _g11.length) {
				var behaviour1 = _g11[_g2];
				++_g2;
				behaviour1.postUpdate();
			}
			this.invalidated = false;
			this.change.emit();
		}
	}
	,onStageResized: function() {
		this.stageWidth = flambe_System.get_stage().get_width();
		this.stageHeight = flambe_System.get_stage().get_height();
		this.stageCentreX = this.stageWidth / 2;
		this.stageCentreY = this.stageHeight / 2;
		this.invalidated = true;
	}
	,reset: function() {
		this.set_zoom(1);
		this.set_targetX(0);
		this.set_targetY(0);
		this.set_panX(this.set_panY(this.set_rotation(0.0)));
		this.invalidated = true;
		this.controller.setToCurrent();
		return this;
	}
	,get_zoom: function() {
		return this._zoom;
	}
	,set_zoom: function(value) {
		this.invalidated = this.invalidated || value != this._zoom;
		return this._zoom = value;
	}
	,get_rotation: function() {
		return this._rotation;
	}
	,set_rotation: function(value) {
		this.invalidated = this.invalidated || value != this._rotation;
		return this._rotation = value;
	}
	,get_targetX: function() {
		return this._targetX;
	}
	,set_targetX: function(value) {
		this.invalidated = this.invalidated || value != this._targetX;
		return this._targetX = value;
	}
	,get_targetY: function() {
		return this._targetY;
	}
	,set_targetY: function(value) {
		this.invalidated = this.invalidated || value != this._targetY;
		return this._targetY = value;
	}
	,get_panX: function() {
		return this._panX;
	}
	,set_panX: function(value) {
		this.invalidated = this.invalidated || value != this._panX;
		return this._panX = value;
	}
	,get_panY: function() {
		return this._panY;
	}
	,set_panY: function(value) {
		this.invalidated = this.invalidated || value != this._panY;
		return this._panY = value;
	}
	,__class__: flambe_camera_Camera
	,__properties__: $extend(flambe_Component.prototype.__properties__,{set_panY:"set_panY",get_panY:"get_panY",set_panX:"set_panX",get_panX:"get_panX",set_targetY:"set_targetY",get_targetY:"get_targetY",set_targetX:"set_targetX",get_targetX:"get_targetX",set_rotation:"set_rotation",get_rotation:"get_rotation",set_zoom:"set_zoom",get_zoom:"get_zoom"})
});
var flambe_camera_CameraController = function(camera) {
	this.camera = null;
	this.camera = camera;
};
$hxClasses["flambe.camera.CameraController"] = flambe_camera_CameraController;
flambe_camera_CameraController.__name__ = true;
flambe_camera_CameraController.__super__ = flambe_Component;
flambe_camera_CameraController.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "CameraController_6";
	}
	,onAdded: function() {
		this.panX = new flambe_animation_AnimatedFloat(this.camera.get_panX());
		this.panY = new flambe_animation_AnimatedFloat(this.camera.get_panY());
		this.targetX = new flambe_animation_AnimatedFloat(this.camera.get_targetX());
		this.targetY = new flambe_animation_AnimatedFloat(this.camera.get_targetY());
		this.zoom = new flambe_animation_AnimatedFloat(this.camera.get_zoom());
		this.rotation = new flambe_animation_AnimatedFloat(this.camera.get_rotation());
	}
	,onUpdate: function(dt) {
		this.panX.update(dt);
		this.panY.update(dt);
		this.targetX.update(dt);
		this.targetY.update(dt);
		this.zoom.update(dt);
		this.rotation.update(dt);
		this.camera.set_panX(this.panX.get__());
		this.camera.set_panY(this.panY.get__());
		this.camera.set_targetX(this.targetX.get__());
		this.camera.set_targetY(this.targetY.get__());
		this.camera.set_zoom(this.zoom.get__());
		this.camera.set_rotation(this.rotation.get__());
	}
	,onRemoved: function() {
		this.camera = null;
		this.panX = null;
		this.panY = null;
		this.targetX = null;
		this.targetY = null;
		this.zoom = null;
		this.rotation = null;
	}
	,setToCurrent: function() {
		this.panX.set__(this.camera.get_panX());
		this.panY.set__(this.camera.get_panY());
		this.targetX.set__(this.camera.get_targetX());
		this.targetY.set__(this.camera.get_targetY());
		this.zoom.set__(this.camera.get_zoom());
		this.rotation.set__(this.camera.get_rotation());
	}
	,__class__: flambe_camera_CameraController
});
var flambe_camera_behaviours_CameraControlBehaviour = function(camera) {
	this._enabled = false;
	this.camera = camera;
	this.controller = camera.controller;
};
$hxClasses["flambe.camera.behaviours.CameraControlBehaviour"] = flambe_camera_behaviours_CameraControlBehaviour;
flambe_camera_behaviours_CameraControlBehaviour.__name__ = true;
flambe_camera_behaviours_CameraControlBehaviour.prototype = {
	update: function(dt) {
	}
	,postUpdate: function() {
	}
	,dispose: function() {
		this.set_enabled(false);
		this.controller = null;
		this.camera = null;
	}
	,set_enabled: function(value) {
		return this._enabled = value;
	}
	,__class__: flambe_camera_behaviours_CameraControlBehaviour
	,__properties__: {set_enabled:"set_enabled"}
};
var flambe_camera_behaviours_MouseControlBehaviour = function(camera,bounds) {
	this.mouseMoved = false;
	this.y = .0;
	this.x = .0;
	this.lastY = .0;
	this.lastX = .0;
	this.bounds = bounds;
	flambe_camera_behaviours_CameraControlBehaviour.call(this,camera);
};
$hxClasses["flambe.camera.behaviours.MouseControlBehaviour"] = flambe_camera_behaviours_MouseControlBehaviour;
flambe_camera_behaviours_MouseControlBehaviour.__name__ = true;
flambe_camera_behaviours_MouseControlBehaviour.__super__ = flambe_camera_behaviours_CameraControlBehaviour;
flambe_camera_behaviours_MouseControlBehaviour.prototype = $extend(flambe_camera_behaviours_CameraControlBehaviour.prototype,{
	validatePanX: function(dx) {
		if(this._enabled && this.bounds != null) {
			if(dx < 0) {
				if(this.camera.visibleBounds.get_right() - this.bounds.get_right() > 0) return 0;
			} else if(dx > 0) {
				if(this.camera.visibleBounds.get_left() - this.bounds.get_left() < 0) return 0;
			}
		}
		return dx;
	}
	,validatePanY: function(dy) {
		if(this._enabled && this.bounds != null) {
			if(dy < 0) {
				if(this.camera.visibleBounds.get_bottom() - this.bounds.get_bottom() > 0) return 0;
			} else if(dy > 0) {
				if(this.camera.visibleBounds.get_top() - this.bounds.get_top() < 0) return 0;
			}
		}
		return dy;
	}
	,update: function(dt) {
		if(this.mouseMoved) {
			this.mouseMoved = false;
			var c = this.controller;
			var z = c.zoom.get__();
			var dx = (this.x - this.lastX) / z;
			var dy = (this.y - this.lastY) / z;
			this.lastX = this.x;
			this.lastY = this.y;
			var _g = c.panX;
			_g.set__(_g.get__() + this.validatePanX(dx));
			var _g1 = c.panY;
			_g1.set__(_g1.get__() + this.validatePanY(dy));
		}
	}
	,onMouseDown: function(e) {
		if(this._enabled) {
			var m = flambe_System.get_mouse();
			if(e.button == flambe_input_MouseButton.Right || e.button == flambe_input_MouseButton.Left && flambe_System.get_keyboard().isDown(flambe_input_Key.Space)) {
				this.lastX = e.viewX;
				this.lastY = e.viewY;
				this.mouseDownConnection.dispose();
				this.mouseDownConnection = null;
				this.mouseMoveConnection = m.move.connect($bind(this,this.onMouseMove));
				this.mouseUpConnection = m.up.connect($bind(this,this.onMouseUp));
			}
		}
	}
	,onMouseUp: function(e) {
		this.mouseUpConnection.dispose();
		this.mouseUpConnection = null;
		this.mouseMoveConnection.dispose();
		this.mouseMoveConnection = null;
		if(this._enabled) this.mouseDownConnection = flambe_System.get_mouse().down.connect($bind(this,this.onMouseDown));
	}
	,onMouseMove: function(e) {
		if(this._enabled) {
			this.mouseMoved = true;
			this.x = e.viewX;
			this.y = e.viewY;
		}
	}
	,onMouseScroll: function(direction) {
		if(this._enabled) {
			var c = this.controller;
			if(flambe_System.get_keyboard().isDown(flambe_input_Key.Shift)) c.rotation.animateBy(direction > 0?-22.5:22.5,.25,flambe_animation_Ease.quadOut); else {
				var z;
				z = c.zoom.get__() * (direction > 0?1.2:0.8);
				if(z != c.zoom.get__()) c.zoom.animateTo(z,.25,flambe_animation_Ease.quadOut);
			}
		}
	}
	,setupControl: function() {
		var m = flambe_System.get_mouse();
		this.mouseDownConnection = m.down.connect($bind(this,this.onMouseDown));
		this.mouseScrollConnection = m.scroll.connect($bind(this,this.onMouseScroll));
	}
	,removeControl: function() {
		if(this.mouseMoveConnection != null) {
			this.mouseMoveConnection.dispose();
			this.mouseMoveConnection = null;
		}
		if(this.mouseScrollConnection != null) {
			this.mouseScrollConnection.dispose();
			this.mouseScrollConnection = null;
		}
		if(this.mouseDownConnection != null) {
			this.mouseDownConnection.dispose();
			this.mouseDownConnection = null;
		}
		if(this.mouseUpConnection != null) {
			this.mouseUpConnection.dispose();
			this.mouseUpConnection = null;
		}
	}
	,set_enabled: function(value) {
		if(!value && this._enabled) {
			this.removeControl();
			this._enabled = false;
		} else if(flambe_System.get_mouse().get_supported() && value && !this._enabled) {
			this.setupControl();
			this._enabled = true;
		}
		return this._enabled;
	}
	,__class__: flambe_camera_behaviours_MouseControlBehaviour
});
var flambe_camera_behaviours_ZoomLimitBehaviour = function(camera,min,max) {
	this.min = min;
	this.max = max;
	flambe_camera_behaviours_CameraControlBehaviour.call(this,camera);
};
$hxClasses["flambe.camera.behaviours.ZoomLimitBehaviour"] = flambe_camera_behaviours_ZoomLimitBehaviour;
flambe_camera_behaviours_ZoomLimitBehaviour.__name__ = true;
flambe_camera_behaviours_ZoomLimitBehaviour.__super__ = flambe_camera_behaviours_CameraControlBehaviour;
flambe_camera_behaviours_ZoomLimitBehaviour.prototype = $extend(flambe_camera_behaviours_CameraControlBehaviour.prototype,{
	update: function(dt) {
		if(this._enabled) {
			var z = Math.min(Math.max(this.min,this.camera._zoom),this.max);
			if(this.camera._zoom != z) this.camera._zoom = this.controller.zoom.set__(z);
		}
	}
	,__class__: flambe_camera_behaviours_ZoomLimitBehaviour
});
var flambe_math_Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["flambe.math.Point"] = flambe_math_Point;
flambe_math_Point.__name__ = true;
flambe_math_Point.prototype = {
	toString: function() {
		return "(" + this.x + "," + this.y + ")";
	}
	,__class__: flambe_math_Point
};
var flambe_display_Sprite = function() {
	this.scissor = null;
	this.blendMode = null;
	var _g = this;
	this._flags = 1 | 2 | 8 | 128;
	this._localMatrix = new flambe_math_Matrix();
	var dirtyMatrix = function(_,_1) {
		_g._flags = flambe_util_BitSets.add(_g._flags,4 | 8);
	};
	this.x = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.y = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.rotation = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.scaleX = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.scaleY = new flambe_animation_AnimatedFloat(1,dirtyMatrix);
	this.anchorX = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.anchorY = new flambe_animation_AnimatedFloat(0,dirtyMatrix);
	this.alpha = new flambe_animation_AnimatedFloat(1);
	this.tintR = new flambe_animation_AnimatedFloat(1);
	this.tintG = new flambe_animation_AnimatedFloat(1);
	this.tintB = new flambe_animation_AnimatedFloat(1);
};
$hxClasses["flambe.display.Sprite"] = flambe_display_Sprite;
flambe_display_Sprite.__name__ = true;
flambe_display_Sprite.hitTest = function(entity,x,y) {
	var sprite = entity.getComponent("Sprite_0");
	if(sprite != null) {
		if(!flambe_util_BitSets.containsAll(sprite._flags,1 | 2)) return null;
		if(sprite.getLocalMatrix().inverseTransform(x,y,flambe_display_Sprite._scratchPoint)) {
			x = flambe_display_Sprite._scratchPoint.x;
			y = flambe_display_Sprite._scratchPoint.y;
		}
		var scissor = sprite.scissor;
		if(scissor != null && !scissor.contains(x,y)) return null;
	}
	var result = flambe_display_Sprite.hitTestBackwards(entity.firstChild,x,y);
	if(result != null) return result;
	if(sprite != null && sprite.containsLocal(x,y)) return sprite; else return null;
};
flambe_display_Sprite.render = function(entity,g) {
	var sprite = entity.getComponent("Sprite_0");
	if(sprite != null) {
		var alpha = sprite.alpha.get__();
		if(!sprite.get_visible() || alpha <= 0) return;
		var tintR = sprite.tintR.get__();
		var tintG = sprite.tintG.get__();
		var tintB = sprite.tintB.get__();
		g.save();
		g.setTint(sprite.tintR.get__(),sprite.tintG.get__(),sprite.tintB.get__());
		if(alpha < 1) g.multiplyAlpha(alpha);
		if(sprite.blendMode != null) g.setBlendMode(sprite.blendMode);
		var matrix = sprite.getLocalMatrix();
		var m02 = matrix.m02;
		var m12 = matrix.m12;
		if(sprite.get_pixelSnapping()) {
			m02 = Math.round(m02);
			m12 = Math.round(m12);
		}
		g.transform(matrix.m00,matrix.m10,matrix.m01,matrix.m11,m02,m12);
		var scissor = sprite.scissor;
		if(scissor != null) g.applyScissor(scissor.x,scissor.y,scissor.width,scissor.height);
		sprite.draw(g);
	}
	var director = entity.getComponent("Director_8");
	if(director != null) {
		var scenes = director.occludedScenes;
		var _g = 0;
		while(_g < scenes.length) {
			var scene = scenes[_g];
			++_g;
			flambe_display_Sprite.render(scene,g);
		}
	}
	var p = entity.firstChild;
	while(p != null) {
		var next = p.next;
		flambe_display_Sprite.render(p,g);
		p = next;
	}
	if(sprite != null) g.restore();
};
flambe_display_Sprite.hitTestBackwards = function(entity,x,y) {
	if(entity != null) {
		var result = flambe_display_Sprite.hitTestBackwards(entity.next,x,y);
		if(result != null) return result; else return flambe_display_Sprite.hitTest(entity,x,y);
	}
	return null;
};
flambe_display_Sprite.__super__ = flambe_Component;
flambe_display_Sprite.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Sprite_0";
	}
	,setTint: function(r,g,b,durtaion,ease) {
		if(durtaion == null) durtaion = 0;
		if(durtaion <= 0) {
			this.tintR.set__(r);
			this.tintG.set__(g);
			this.tintB.set__(b);
		} else {
			this.tintR.animateTo(r,durtaion,ease);
			this.tintG.animateTo(g,durtaion,ease);
			this.tintB.animateTo(b,durtaion,ease);
		}
		return this;
	}
	,getNaturalWidth: function() {
		return 0;
	}
	,getNaturalHeight: function() {
		return 0;
	}
	,containsLocal: function(localX,localY) {
		return localX >= 0 && localX < this.getNaturalWidth() && localY >= 0 && localY < this.getNaturalHeight();
	}
	,getLocalMatrix: function() {
		if(flambe_util_BitSets.contains(this._flags,4)) {
			this._flags = flambe_util_BitSets.remove(this._flags,4);
			this._localMatrix.compose(this.x.get__(),this.y.get__(),this.scaleX.get__(),this.scaleY.get__(),flambe_math_FMath.toRadians(this.rotation.get__()));
			this._localMatrix.translate(-this.anchorX.get__(),-this.anchorY.get__());
		}
		return this._localMatrix;
	}
	,centerAnchor: function() {
		this.anchorX.set__(this.getNaturalWidth() / 2);
		this.anchorY.set__(this.getNaturalHeight() / 2);
		return this;
	}
	,setXY: function(x,y) {
		this.x.set__(x);
		this.y.set__(y);
		return this;
	}
	,setAlpha: function(alpha) {
		this.alpha.set__(alpha);
		return this;
	}
	,setScale: function(scale) {
		this.scaleX.set__(scale);
		this.scaleY.set__(scale);
		return this;
	}
	,setScaleXY: function(scaleX,scaleY) {
		this.scaleX.set__(scaleX);
		this.scaleY.set__(scaleY);
		return this;
	}
	,disablePointer: function() {
		this.set_pointerEnabled(false);
		return this;
	}
	,disablePixelSnapping: function() {
		this.set_pixelSnapping(false);
		return this;
	}
	,onAdded: function() {
		if(flambe_util_BitSets.contains(this._flags,256)) this.connectHover();
	}
	,onRemoved: function() {
		if(this._hoverConnection != null) {
			this._hoverConnection.dispose();
			this._hoverConnection = null;
		}
	}
	,onUpdate: function(dt) {
		this.x.update(dt);
		this.y.update(dt);
		this.rotation.update(dt);
		this.scaleX.update(dt);
		this.scaleY.update(dt);
		this.tintR.update(dt);
		this.tintG.update(dt);
		this.tintB.update(dt);
		this.alpha.update(dt);
		this.anchorX.update(dt);
		this.anchorY.update(dt);
	}
	,draw: function(g) {
	}
	,getParentSprite: function() {
		if(this.owner == null) return null;
		var entity = this.owner.parent;
		while(entity != null) {
			var sprite = entity.getComponent("Sprite_0");
			if(sprite != null) return sprite;
			entity = entity.parent;
		}
		return null;
	}
	,get_pointerDown: function() {
		if(this._pointerDown == null) this._pointerDown = new flambe_util_Signal1();
		return this._pointerDown;
	}
	,get_pointerMove: function() {
		if(this._pointerMove == null) this._pointerMove = new flambe_util_Signal1();
		return this._pointerMove;
	}
	,get_pointerUp: function() {
		if(this._pointerUp == null) this._pointerUp = new flambe_util_Signal1();
		return this._pointerUp;
	}
	,get_pointerOut: function() {
		if(this._pointerOut == null) this._pointerOut = new flambe_util_Signal1();
		return this._pointerOut;
	}
	,connectHover: function() {
		var _g = this;
		if(this._hoverConnection != null) return;
		this._hoverConnection = flambe_System.get_pointer().move.connect(function(event) {
			var hit = event.hit;
			while(hit != null) {
				if(hit == _g) return;
				hit = hit.getParentSprite();
			}
			if(_g._pointerOut != null && flambe_util_BitSets.contains(_g._flags,256)) _g._pointerOut.emit(event);
			_g._flags = flambe_util_BitSets.remove(_g._flags,256);
			_g._hoverConnection.dispose();
			_g._hoverConnection = null;
		});
	}
	,get_visible: function() {
		return flambe_util_BitSets.contains(this._flags,1);
	}
	,set_pointerEnabled: function(pointerEnabled) {
		this._flags = flambe_util_BitSets.set(this._flags,2,pointerEnabled);
		return pointerEnabled;
	}
	,get_pixelSnapping: function() {
		return flambe_util_BitSets.contains(this._flags,128);
	}
	,set_pixelSnapping: function(pixelSnapping) {
		this._flags = flambe_util_BitSets.set(this._flags,128,pixelSnapping);
		return pixelSnapping;
	}
	,onPointerDown: function(event) {
		this.onHover(event);
		if(this._pointerDown != null) this._pointerDown.emit(event);
	}
	,onPointerMove: function(event) {
		this.onHover(event);
		if(this._pointerMove != null) this._pointerMove.emit(event);
	}
	,onHover: function(event) {
		if(flambe_util_BitSets.contains(this._flags,256)) return;
		this._flags = flambe_util_BitSets.add(this._flags,256);
		if(this._pointerIn != null || this._pointerOut != null) {
			if(this._pointerIn != null) this._pointerIn.emit(event);
			this.connectHover();
		}
	}
	,onPointerUp: function(event) {
		{
			var _g = event.source;
			switch(Type.enumIndex(_g)) {
			case 1:
				var point = _g[2];
				if(this._pointerOut != null && flambe_util_BitSets.contains(this._flags,256)) this._pointerOut.emit(event);
				this._flags = flambe_util_BitSets.remove(this._flags,256);
				if(this._hoverConnection != null) {
					this._hoverConnection.dispose();
					this._hoverConnection = null;
				}
				break;
			default:
			}
		}
		if(this._pointerUp != null) this._pointerUp.emit(event);
	}
	,__class__: flambe_display_Sprite
	,__properties__: $extend(flambe_Component.prototype.__properties__,{set_pixelSnapping:"set_pixelSnapping",get_pixelSnapping:"get_pixelSnapping",set_pointerEnabled:"set_pointerEnabled",get_visible:"get_visible",get_pointerOut:"get_pointerOut",get_pointerUp:"get_pointerUp",get_pointerMove:"get_pointerMove",get_pointerDown:"get_pointerDown"})
});
var flambe_display_FillSprite = function(color,width,height) {
	flambe_display_Sprite.call(this);
	this.color = color;
	this.width = new flambe_animation_AnimatedFloat(width);
	this.height = new flambe_animation_AnimatedFloat(height);
};
$hxClasses["flambe.display.FillSprite"] = flambe_display_FillSprite;
flambe_display_FillSprite.__name__ = true;
flambe_display_FillSprite.__super__ = flambe_display_Sprite;
flambe_display_FillSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		g.fillRect(this.color,0,0,this.width.get__(),this.height.get__());
	}
	,getNaturalWidth: function() {
		return this.width.get__();
	}
	,getNaturalHeight: function() {
		return this.height.get__();
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.width.update(dt);
		this.height.update(dt);
	}
	,__class__: flambe_display_FillSprite
});
var flambe_camera_view_CameraBackgroundFill = function(color,camera) {
	flambe_display_FillSprite.call(this,color,1,1);
	this.camera = camera;
	this.onStageResize();
};
$hxClasses["flambe.camera.view.CameraBackgroundFill"] = flambe_camera_view_CameraBackgroundFill;
flambe_camera_view_CameraBackgroundFill.__name__ = true;
flambe_camera_view_CameraBackgroundFill.__super__ = flambe_display_FillSprite;
flambe_camera_view_CameraBackgroundFill.prototype = $extend(flambe_display_FillSprite.prototype,{
	onAdded: function() {
		this.centerAnchor();
		this.updateConnection = this.camera.change.connect($bind(this,this.updateBackground));
		this.resizeConnection = flambe_System.get_stage().resize.connect($bind(this,this.onStageResize));
		this.onStageResize();
	}
	,onUpdate: function(dt) {
		if(this.needsUpdate) {
			var z = this.camera.get_zoom();
			var pad = Math.min(32 / z,512);
			this.setScaleXY((this.stageWidth + pad) / z,(this.stageHeight + pad) / z);
			var x;
			var y;
			var rs = this.camera.rootSprite;
			x = rs.anchorX.get__() - rs.x.get__() + this.stageCentreX;
			y = rs.anchorY.get__() - rs.y.get__() + this.stageCentreY;
			this.setXY(x,y);
			this.needsUpdate = false;
		}
	}
	,onStageResize: function() {
		this.stageWidth = flambe_System.get_stage().get_width();
		this.stageHeight = flambe_System.get_stage().get_height();
		this.stageCentreX = this.stageWidth / 2;
		this.stageCentreY = this.stageHeight / 2;
		this.updateBackground();
	}
	,updateBackground: function() {
		this.needsUpdate = true;
	}
	,onRemoved: function() {
		if(this.camera != null) this.camera = null;
		if(this.updateConnection != null) {
			this.updateConnection.dispose();
			this.updateConnection = null;
		}
		if(this.resizeConnection != null) {
			this.resizeConnection.dispose();
			this.resizeConnection = null;
		}
		flambe_display_FillSprite.prototype.onRemoved.call(this);
	}
	,__class__: flambe_camera_view_CameraBackgroundFill
});
var flambe_display_BlendMode = $hxClasses["flambe.display.BlendMode"] = { __ename__ : true, __constructs__ : ["Normal","Add","Mask","Copy"] };
flambe_display_BlendMode.Normal = ["Normal",0];
flambe_display_BlendMode.Normal.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Add = ["Add",1];
flambe_display_BlendMode.Add.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Mask = ["Mask",2];
flambe_display_BlendMode.Mask.__enum__ = flambe_display_BlendMode;
flambe_display_BlendMode.Copy = ["Copy",3];
flambe_display_BlendMode.Copy.__enum__ = flambe_display_BlendMode;
var flambe_display_Glyph = function(charCode) {
	this._kernings = null;
	this.xAdvance = 0;
	this.yOffset = 0;
	this.xOffset = 0;
	this.page = null;
	this.height = 0;
	this.width = 0;
	this.y = 0;
	this.x = 0;
	this.charCode = charCode;
};
$hxClasses["flambe.display.Glyph"] = flambe_display_Glyph;
flambe_display_Glyph.__name__ = true;
flambe_display_Glyph.prototype = {
	draw: function(g,destX,destY) {
		if(this.width > 0) g.drawSubTexture(this.page,destX + this.xOffset,destY + this.yOffset,this.x,this.y,this.width,this.height);
	}
	,getKerning: function(nextCharCode) {
		if(this._kernings != null) return Std["int"](this._kernings.get(nextCharCode)); else return 0;
	}
	,setKerning: function(nextCharCode,amount) {
		if(this._kernings == null) this._kernings = new haxe_ds_IntMap();
		this._kernings.set(nextCharCode,amount);
	}
	,__class__: flambe_display_Glyph
};
var flambe_display_Font = function(pack,name) {
	this.name = name;
	this._pack = pack;
	this._file = pack.getFile(name + ".fnt");
	this.reload();
	this._lastReloadCount = this._file.get_reloadCount().get__();
};
$hxClasses["flambe.display.Font"] = flambe_display_Font;
flambe_display_Font.__name__ = true;
flambe_display_Font.prototype = {
	layoutText: function(text,align,wrapWidth,letterSpacing,lineSpacing) {
		if(lineSpacing == null) lineSpacing = 0;
		if(letterSpacing == null) letterSpacing = 0;
		if(wrapWidth == null) wrapWidth = 0;
		if(align == null) align = flambe_display_TextAlign.Left;
		return new flambe_display_TextLayout(this,text,align,wrapWidth,letterSpacing,lineSpacing);
	}
	,getGlyph: function(charCode) {
		return this._glyphs.get(charCode);
	}
	,checkReload: function() {
		var reloadCount = this._file.get_reloadCount().get__();
		if(this._lastReloadCount != reloadCount) {
			this._lastReloadCount = reloadCount;
			this.reload();
		}
		return reloadCount;
	}
	,reload: function() {
		this._glyphs = new haxe_ds_IntMap();
		this._glyphs.set(flambe_display_Font.NEWLINE.charCode,flambe_display_Font.NEWLINE);
		var parser = new flambe_display__$Font_ConfigParser(this._file.toString());
		var pages = new haxe_ds_IntMap();
		var idx = this.name.lastIndexOf("/");
		var basePath;
		if(idx >= 0) basePath = HxOverrides.substr(this.name,0,idx + 1); else basePath = "";
		var $it0 = parser.keywords();
		while( $it0.hasNext() ) {
			var keyword = $it0.next();
			switch(keyword) {
			case "info":
				var $it1 = parser.pairs();
				while( $it1.hasNext() ) {
					var pair = $it1.next();
					var _g = pair.key;
					switch(_g) {
					case "size":
						this.size = pair.getInt();
						break;
					}
				}
				break;
			case "common":
				var $it2 = parser.pairs();
				while( $it2.hasNext() ) {
					var pair1 = $it2.next();
					var _g1 = pair1.key;
					switch(_g1) {
					case "lineHeight":
						this.lineHeight = pair1.getInt();
						break;
					}
				}
				break;
			case "page":
				var pageId = 0;
				var file = null;
				var $it3 = parser.pairs();
				while( $it3.hasNext() ) {
					var pair2 = $it3.next();
					var _g2 = pair2.key;
					switch(_g2) {
					case "id":
						pageId = pair2.getInt();
						break;
					case "file":
						file = pair2.getString();
						break;
					}
				}
				var value = this._pack.getTexture(basePath + flambe_util_Strings.removeFileExtension(file));
				pages.set(pageId,value);
				break;
			case "char":
				var glyph = null;
				var $it4 = parser.pairs();
				while( $it4.hasNext() ) {
					var pair3 = $it4.next();
					var _g3 = pair3.key;
					switch(_g3) {
					case "id":
						glyph = new flambe_display_Glyph(pair3.getInt());
						break;
					case "x":
						glyph.x = pair3.getInt();
						break;
					case "y":
						glyph.y = pair3.getInt();
						break;
					case "width":
						glyph.width = pair3.getInt();
						break;
					case "height":
						glyph.height = pair3.getInt();
						break;
					case "page":
						var key = pair3.getInt();
						glyph.page = pages.get(key);
						break;
					case "xoffset":
						glyph.xOffset = pair3.getInt();
						break;
					case "yoffset":
						glyph.yOffset = pair3.getInt();
						break;
					case "xadvance":
						glyph.xAdvance = pair3.getInt();
						break;
					}
				}
				this._glyphs.set(glyph.charCode,glyph);
				break;
			case "kerning":
				var first = null;
				var second = 0;
				var amount = 0;
				var $it5 = parser.pairs();
				while( $it5.hasNext() ) {
					var pair4 = $it5.next();
					var _g4 = pair4.key;
					switch(_g4) {
					case "first":
						var key1 = pair4.getInt();
						first = this._glyphs.get(key1);
						break;
					case "second":
						second = pair4.getInt();
						break;
					case "amount":
						amount = pair4.getInt();
						break;
					}
				}
				if(first != null && amount != 0) first.setKerning(second,amount);
				break;
			}
		}
	}
	,__class__: flambe_display_Font
};
var flambe_display_TextAlign = $hxClasses["flambe.display.TextAlign"] = { __ename__ : true, __constructs__ : ["Left","Center","Right"] };
flambe_display_TextAlign.Left = ["Left",0];
flambe_display_TextAlign.Left.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Center = ["Center",1];
flambe_display_TextAlign.Center.__enum__ = flambe_display_TextAlign;
flambe_display_TextAlign.Right = ["Right",2];
flambe_display_TextAlign.Right.__enum__ = flambe_display_TextAlign;
var flambe_display_TextLayout = function(font,text,align,wrapWidth,letterSpacing,lineSpacing) {
	this.lines = 0;
	var _g = this;
	this._font = font;
	this._glyphs = [];
	this._offsets = [];
	this._lineOffset = Math.round(font.lineHeight + lineSpacing);
	this.bounds = new flambe_math_Rectangle();
	var lineWidths = [];
	var ll = text.length;
	var _g1 = 0;
	while(_g1 < ll) {
		var ii = _g1++;
		var charCode = StringTools.fastCodeAt(text,ii);
		var glyph = font.getGlyph(charCode);
		if(glyph != null) this._glyphs.push(glyph); else flambe_Log.warn("Requested a missing character from font",["font",font.name,"charCode",charCode]);
	}
	var lastSpaceIdx = -1;
	var lineWidth = 0.0;
	var lineHeight = 0.0;
	var newline = font.getGlyph(10);
	var addLine = function() {
		_g.bounds.width = flambe_math_FMath.max(_g.bounds.width,lineWidth);
		_g.bounds.height += lineHeight;
		lineWidths[_g.lines] = lineWidth;
		lineWidth = 0;
		lineHeight = 0;
		++_g.lines;
	};
	var ii1 = 0;
	while(ii1 < this._glyphs.length) {
		var glyph1 = this._glyphs[ii1];
		this._offsets[ii1] = Math.round(lineWidth);
		var wordWrap = wrapWidth > 0 && lineWidth + glyph1.width > wrapWidth;
		if(wordWrap || glyph1 == newline) {
			if(wordWrap) {
				if(lastSpaceIdx >= 0) {
					this._glyphs[lastSpaceIdx] = newline;
					lineWidth = this._offsets[lastSpaceIdx];
					ii1 = lastSpaceIdx;
				} else this._glyphs.splice(ii1,0,newline);
			}
			lastSpaceIdx = -1;
			lineHeight = this._lineOffset;
			addLine();
		} else {
			if(glyph1.charCode == 32) lastSpaceIdx = ii1;
			lineWidth += glyph1.xAdvance + letterSpacing;
			lineHeight = flambe_math_FMath.max(lineHeight,glyph1.height + glyph1.yOffset);
			if(ii1 + 1 < this._glyphs.length) {
				var nextGlyph = this._glyphs[ii1 + 1];
				lineWidth += glyph1.getKerning(nextGlyph.charCode);
			}
		}
		++ii1;
	}
	addLine();
	var lineY = 0.0;
	var alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[0],wrapWidth);
	var top = 1.79769313486231e+308;
	var bottom = -1.79769313486231e+308;
	var line = 0;
	var ii2 = 0;
	var ll1 = this._glyphs.length;
	while(ii2 < ll1) {
		var glyph2 = this._glyphs[ii2];
		if(glyph2.charCode == 10) {
			lineY += this._lineOffset;
			++line;
			alignOffset = flambe_display_TextLayout.getAlignOffset(align,lineWidths[line],wrapWidth);
		}
		this._offsets[ii2] += alignOffset;
		var glyphY = lineY + glyph2.yOffset;
		top = flambe_math_FMath.min(top,glyphY);
		bottom = flambe_math_FMath.max(bottom,glyphY + glyph2.height);
		++ii2;
	}
	this.bounds.x = flambe_display_TextLayout.getAlignOffset(align,this.bounds.width,wrapWidth);
	this.bounds.y = top;
	this.bounds.height = bottom - top;
};
$hxClasses["flambe.display.TextLayout"] = flambe_display_TextLayout;
flambe_display_TextLayout.__name__ = true;
flambe_display_TextLayout.getAlignOffset = function(align,lineWidth,totalWidth) {
	switch(Type.enumIndex(align)) {
	case 0:
		return 0;
	case 2:
		return totalWidth - lineWidth;
	case 1:
		return Math.round((totalWidth - lineWidth) / 2);
	}
};
flambe_display_TextLayout.prototype = {
	draw: function(g) {
		var y = 0.0;
		var ii = 0;
		var ll = this._glyphs.length;
		while(ii < ll) {
			var glyph = this._glyphs[ii];
			if(glyph.charCode == 10) y += this._lineOffset; else {
				var x = this._offsets[ii];
				glyph.draw(g,x,y);
			}
			++ii;
		}
	}
	,__class__: flambe_display_TextLayout
};
var flambe_display__$Font_ConfigParser = function(config) {
	this._configText = config;
	this._keywordPattern = new EReg("([A-Za-z]+)(.*)","");
	this._pairPattern = new EReg("([A-Za-z]+)=(\"[^\"]*\"|[^\\s]+)","");
};
$hxClasses["flambe.display._Font.ConfigParser"] = flambe_display__$Font_ConfigParser;
flambe_display__$Font_ConfigParser.__name__ = true;
flambe_display__$Font_ConfigParser.advance = function(text,expr) {
	var m = expr.matchedPos();
	return HxOverrides.substr(text,m.pos + m.len,text.length);
};
flambe_display__$Font_ConfigParser.prototype = {
	keywords: function() {
		var _g = this;
		var text = this._configText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._keywordPattern);
			_g._pairText = _g._keywordPattern.matched(2);
			return _g._keywordPattern.matched(1);
		}, hasNext : function() {
			return _g._keywordPattern.match(text);
		}};
	}
	,pairs: function() {
		var _g = this;
		var text = this._pairText;
		return { next : function() {
			text = flambe_display__$Font_ConfigParser.advance(text,_g._pairPattern);
			return new flambe_display__$Font_ConfigPair(_g._pairPattern.matched(1),_g._pairPattern.matched(2));
		}, hasNext : function() {
			return _g._pairPattern.match(text);
		}};
	}
	,__class__: flambe_display__$Font_ConfigParser
};
var flambe_display__$Font_ConfigPair = function(key,value) {
	this.key = key;
	this._value = value;
};
$hxClasses["flambe.display._Font.ConfigPair"] = flambe_display__$Font_ConfigPair;
flambe_display__$Font_ConfigPair.__name__ = true;
flambe_display__$Font_ConfigPair.prototype = {
	getInt: function() {
		return Std.parseInt(this._value);
	}
	,getString: function() {
		if(StringTools.fastCodeAt(this._value,0) != 34) return null;
		return HxOverrides.substr(this._value,1,this._value.length - 2);
	}
	,__class__: flambe_display__$Font_ConfigPair
};
var flambe_display_Graphics = function() { };
$hxClasses["flambe.display.Graphics"] = flambe_display_Graphics;
flambe_display_Graphics.__name__ = true;
flambe_display_Graphics.prototype = {
	__class__: flambe_display_Graphics
};
var flambe_display_ImageSprite = function(texture) {
	flambe_display_Sprite.call(this);
	this.texture = texture;
};
$hxClasses["flambe.display.ImageSprite"] = flambe_display_ImageSprite;
flambe_display_ImageSprite.__name__ = true;
flambe_display_ImageSprite.__super__ = flambe_display_Sprite;
flambe_display_ImageSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		if(this.texture != null) g.drawTexture(this.texture,0,0);
	}
	,getNaturalWidth: function() {
		if(this.texture != null) return this.texture.get_width(); else return 0;
	}
	,getNaturalHeight: function() {
		if(this.texture != null) return this.texture.get_height(); else return 0;
	}
	,__class__: flambe_display_ImageSprite
});
var flambe_display_NineSlice = function(parts) {
	this._y = 0;
	this._x = 0;
	this._height = 0;
	this._width = 0;
	this.parts = parts;
	if(parts.length != 9) throw "Expected exactly 9 parts, but got " + parts.length;
	this.xOffset = parts[8].getNaturalWidth();
	this.yOffset = parts[8].getNaturalHeight();
	this.minWidth = this.xOffset + this.xOffset + 1;
	this.minHeight = this.yOffset + this.yOffset + 1;
	this._width = this.minWidth;
	this._height = this.minHeight;
	this.set_x(this.set_y(0));
};
$hxClasses["flambe.display.NineSlice"] = flambe_display_NineSlice;
flambe_display_NineSlice.__name__ = true;
flambe_display_NineSlice.fromSubTexture = function(t,xOffset,yOffset,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(yOffset == null) yOffset = 0;
	if(xOffset == null) xOffset = 0;
	if(xOffset < 1) xOffset = Math.round(t.get_width() / 2);
	if(yOffset < 1) yOffset = Math.round(t.get_height() / 2);
	var xMid = Math.round(t.get_width() / 2);
	var yMid = Math.round(t.get_height() / 2);
	var parentTexture = t.get_parent();
	var nineSlice = new flambe_display_NineSlice([new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + xMid,t.get_y(),1,yOffset)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + xMid,t.get_y() + yMid,1,1)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + xMid,t.get_y() + t.get_height() - yOffset,1,yOffset)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + t.get_width() - xOffset,t.get_y(),xOffset,yOffset)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + t.get_width() - xOffset,t.get_y() + yMid,xOffset,1)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x() + t.get_width() - xOffset,t.get_y() + t.get_height() - yOffset,xOffset,yOffset)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x(),t.get_y(),xOffset,yOffset)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x(),t.get_y() + yMid,xOffset,1)),new flambe_display_ImageSprite(parentTexture.subTexture(t.get_x(),t.get_y() + t.get_height() - yOffset,xOffset,yOffset))]);
	if(width > 0) nineSlice.set_width(width);
	if(height > 0) nineSlice.set_height(height);
	return nineSlice;
};
flambe_display_NineSlice.__super__ = flambe_Component;
flambe_display_NineSlice.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "NineSlice_5";
	}
	,onAdded: function() {
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			this.owner.addChild(new flambe_Entity().add(part));
		}
	}
	,setTint: function(r,g,b) {
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			part.setTint(r,g,b);
		}
	}
	,set_width: function(value) {
		var w;
		if(value < this.minWidth) w = this.minWidth; else w = value;
		var scale = w - this.minWidth;
		this.parts[0].scaleX.set__(this.parts[1].scaleX.set__(this.parts[2].scaleX.set__(scale)));
		this.parts[3].x.set__(this.parts[4].x.set__(this.parts[5].x.set__(this._x + w - this.xOffset - 1)));
		return this._width = w;
	}
	,set_height: function(value) {
		var h;
		if(value < this.minHeight) h = this.minHeight; else h = value;
		var scale = h - this.minHeight;
		this.parts[1].scaleY.set__(this.parts[4].scaleY.set__(this.parts[7].scaleY.set__(scale)));
		this.parts[2].y.set__(this.parts[5].y.set__(this.parts[8].y.set__(this._y + h - this.yOffset - 1)));
		return this._height = h;
	}
	,set_x: function(value) {
		this.parts[0].x.set__(this.parts[1].x.set__(this.parts[2].x.set__(value + this.xOffset)));
		this.parts[3].x.set__(this.parts[4].x.set__(this.parts[5].x.set__(value + this._width - this.xOffset - 1)));
		this.parts[6].x.set__(this.parts[7].x.set__(this.parts[8].x.set__(value)));
		return this._x = value;
	}
	,set_y: function(value) {
		this.parts[0].y.set__(this.parts[3].y.set__(this.parts[6].y.set__(value)));
		this.parts[1].y.set__(this.parts[4].y.set__(this.parts[7].y.set__(value + this.yOffset)));
		this.parts[2].y.set__(this.parts[5].y.set__(this.parts[8].y.set__(value + this._height - this.yOffset - 1)));
		return this._y = value;
	}
	,__class__: flambe_display_NineSlice
	,__properties__: $extend(flambe_Component.prototype.__properties__,{set_y:"set_y",set_x:"set_x",set_height:"set_height",set_width:"set_width"})
});
var flambe_display_Orientation = $hxClasses["flambe.display.Orientation"] = { __ename__ : true, __constructs__ : ["Portrait","Landscape"] };
flambe_display_Orientation.Portrait = ["Portrait",0];
flambe_display_Orientation.Portrait.__enum__ = flambe_display_Orientation;
flambe_display_Orientation.Landscape = ["Landscape",1];
flambe_display_Orientation.Landscape.__enum__ = flambe_display_Orientation;
var flambe_display_StarlingSpriteSheet = function() { };
$hxClasses["flambe.display.StarlingSpriteSheet"] = flambe_display_StarlingSpriteSheet;
flambe_display_StarlingSpriteSheet.__name__ = true;
flambe_display_StarlingSpriteSheet.parse = function(atlasXml,texture) {
	var map = new haxe_ds_StringMap();
	var $it0 = atlasXml.elements();
	while( $it0.hasNext() ) {
		var el = $it0.next();
		if(el.get_nodeName() == "TextureAtlas") {
			var textures = el.elementsNamed("SubTexture");
			while( textures.hasNext() ) {
				var sub = textures.next();
				var name = sub.get("name");
				var value = texture.subTexture(Std.parseInt(sub.get("x")),Std.parseInt(sub.get("y")),Std.parseInt(sub.get("width")),Std.parseInt(sub.get("height")));
				map.set(name,value);
			}
		}
	}
	return map;
};
var flambe_display_Texture = function() { };
$hxClasses["flambe.display.Texture"] = flambe_display_Texture;
flambe_display_Texture.__name__ = true;
flambe_display_Texture.__interfaces__ = [flambe_asset_Asset];
flambe_display_Texture.prototype = {
	__class__: flambe_display_Texture
};
var flambe_display_SubTexture = function() { };
$hxClasses["flambe.display.SubTexture"] = flambe_display_SubTexture;
flambe_display_SubTexture.__name__ = true;
flambe_display_SubTexture.__interfaces__ = [flambe_display_Texture];
flambe_display_SubTexture.prototype = {
	__class__: flambe_display_SubTexture
};
var flambe_display_TextSprite = function(font,text) {
	if(text == null) text = "";
	this._lastReloadCount = -1;
	this._layout = null;
	var _g = this;
	flambe_display_Sprite.call(this);
	this._font = font;
	this._text = text;
	this._align = flambe_display_TextAlign.Left;
	this._flags = flambe_util_BitSets.add(this._flags,64);
	var dirtyText = function(_,_1) {
		_g._flags = flambe_util_BitSets.add(_g._flags,64);
	};
	this.wrapWidth = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.letterSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
	this.lineSpacing = new flambe_animation_AnimatedFloat(0,dirtyText);
};
$hxClasses["flambe.display.TextSprite"] = flambe_display_TextSprite;
flambe_display_TextSprite.__name__ = true;
flambe_display_TextSprite.__super__ = flambe_display_Sprite;
flambe_display_TextSprite.prototype = $extend(flambe_display_Sprite.prototype,{
	draw: function(g) {
		this.updateLayout();
		this._layout.draw(g);
	}
	,getNaturalWidth: function() {
		this.updateLayout();
		if(this.wrapWidth.get__() > 0) return this.wrapWidth.get__(); else return this._layout.bounds.width;
	}
	,getNaturalHeight: function() {
		this.updateLayout();
		var paddedHeight = this._layout.lines * (this._font.lineHeight + this.lineSpacing.get__());
		var boundsHeight = this._layout.bounds.height;
		return flambe_math_FMath.max(paddedHeight,boundsHeight);
	}
	,containsLocal: function(localX,localY) {
		this.updateLayout();
		return this._layout.bounds.contains(localX,localY);
	}
	,set_text: function(text) {
		if(text != this._text) {
			this._text = text;
			this._flags = flambe_util_BitSets.add(this._flags,64);
		}
		return text;
	}
	,get_font: function() {
		return this._font;
	}
	,updateLayout: function() {
		var reloadCount = this._font.checkReload();
		if(reloadCount != this._lastReloadCount) {
			this._lastReloadCount = reloadCount;
			this._flags = flambe_util_BitSets.add(this._flags,64);
		}
		if(flambe_util_BitSets.contains(this._flags,64)) {
			this._flags = flambe_util_BitSets.remove(this._flags,64);
			this._layout = this.get_font().layoutText(this._text,this._align,this.wrapWidth.get__(),this.letterSpacing.get__(),this.lineSpacing.get__());
		}
	}
	,onUpdate: function(dt) {
		flambe_display_Sprite.prototype.onUpdate.call(this,dt);
		this.wrapWidth.update(dt);
		this.letterSpacing.update(dt);
		this.lineSpacing.update(dt);
	}
	,__class__: flambe_display_TextSprite
	,__properties__: $extend(flambe_display_Sprite.prototype.__properties__,{get_font:"get_font",set_text:"set_text"})
});
var flambe_input_Key = $hxClasses["flambe.input.Key"] = { __ename__ : true, __constructs__ : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Number0","Number1","Number2","Number3","Number4","Number5","Number6","Number7","Number8","Number9","Numpad0","Numpad1","Numpad2","Numpad3","Numpad4","Numpad5","Numpad6","Numpad7","Numpad8","Numpad9","NumpadAdd","NumpadDecimal","NumpadDivide","NumpadEnter","NumpadMultiply","NumpadSubtract","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","Left","Up","Right","Down","Alt","Backquote","Backslash","Backspace","CapsLock","Comma","Command","Control","Delete","End","Enter","Equals","Escape","Home","Insert","LeftBracket","Minus","PageDown","PageUp","Period","Quote","RightBracket","Semicolon","Shift","Slash","Space","Tab","Menu","Search","Unknown"] };
flambe_input_Key.A = ["A",0];
flambe_input_Key.A.__enum__ = flambe_input_Key;
flambe_input_Key.B = ["B",1];
flambe_input_Key.B.__enum__ = flambe_input_Key;
flambe_input_Key.C = ["C",2];
flambe_input_Key.C.__enum__ = flambe_input_Key;
flambe_input_Key.D = ["D",3];
flambe_input_Key.D.__enum__ = flambe_input_Key;
flambe_input_Key.E = ["E",4];
flambe_input_Key.E.__enum__ = flambe_input_Key;
flambe_input_Key.F = ["F",5];
flambe_input_Key.F.__enum__ = flambe_input_Key;
flambe_input_Key.G = ["G",6];
flambe_input_Key.G.__enum__ = flambe_input_Key;
flambe_input_Key.H = ["H",7];
flambe_input_Key.H.__enum__ = flambe_input_Key;
flambe_input_Key.I = ["I",8];
flambe_input_Key.I.__enum__ = flambe_input_Key;
flambe_input_Key.J = ["J",9];
flambe_input_Key.J.__enum__ = flambe_input_Key;
flambe_input_Key.K = ["K",10];
flambe_input_Key.K.__enum__ = flambe_input_Key;
flambe_input_Key.L = ["L",11];
flambe_input_Key.L.__enum__ = flambe_input_Key;
flambe_input_Key.M = ["M",12];
flambe_input_Key.M.__enum__ = flambe_input_Key;
flambe_input_Key.N = ["N",13];
flambe_input_Key.N.__enum__ = flambe_input_Key;
flambe_input_Key.O = ["O",14];
flambe_input_Key.O.__enum__ = flambe_input_Key;
flambe_input_Key.P = ["P",15];
flambe_input_Key.P.__enum__ = flambe_input_Key;
flambe_input_Key.Q = ["Q",16];
flambe_input_Key.Q.__enum__ = flambe_input_Key;
flambe_input_Key.R = ["R",17];
flambe_input_Key.R.__enum__ = flambe_input_Key;
flambe_input_Key.S = ["S",18];
flambe_input_Key.S.__enum__ = flambe_input_Key;
flambe_input_Key.T = ["T",19];
flambe_input_Key.T.__enum__ = flambe_input_Key;
flambe_input_Key.U = ["U",20];
flambe_input_Key.U.__enum__ = flambe_input_Key;
flambe_input_Key.V = ["V",21];
flambe_input_Key.V.__enum__ = flambe_input_Key;
flambe_input_Key.W = ["W",22];
flambe_input_Key.W.__enum__ = flambe_input_Key;
flambe_input_Key.X = ["X",23];
flambe_input_Key.X.__enum__ = flambe_input_Key;
flambe_input_Key.Y = ["Y",24];
flambe_input_Key.Y.__enum__ = flambe_input_Key;
flambe_input_Key.Z = ["Z",25];
flambe_input_Key.Z.__enum__ = flambe_input_Key;
flambe_input_Key.Number0 = ["Number0",26];
flambe_input_Key.Number0.__enum__ = flambe_input_Key;
flambe_input_Key.Number1 = ["Number1",27];
flambe_input_Key.Number1.__enum__ = flambe_input_Key;
flambe_input_Key.Number2 = ["Number2",28];
flambe_input_Key.Number2.__enum__ = flambe_input_Key;
flambe_input_Key.Number3 = ["Number3",29];
flambe_input_Key.Number3.__enum__ = flambe_input_Key;
flambe_input_Key.Number4 = ["Number4",30];
flambe_input_Key.Number4.__enum__ = flambe_input_Key;
flambe_input_Key.Number5 = ["Number5",31];
flambe_input_Key.Number5.__enum__ = flambe_input_Key;
flambe_input_Key.Number6 = ["Number6",32];
flambe_input_Key.Number6.__enum__ = flambe_input_Key;
flambe_input_Key.Number7 = ["Number7",33];
flambe_input_Key.Number7.__enum__ = flambe_input_Key;
flambe_input_Key.Number8 = ["Number8",34];
flambe_input_Key.Number8.__enum__ = flambe_input_Key;
flambe_input_Key.Number9 = ["Number9",35];
flambe_input_Key.Number9.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad0 = ["Numpad0",36];
flambe_input_Key.Numpad0.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad1 = ["Numpad1",37];
flambe_input_Key.Numpad1.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad2 = ["Numpad2",38];
flambe_input_Key.Numpad2.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad3 = ["Numpad3",39];
flambe_input_Key.Numpad3.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad4 = ["Numpad4",40];
flambe_input_Key.Numpad4.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad5 = ["Numpad5",41];
flambe_input_Key.Numpad5.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad6 = ["Numpad6",42];
flambe_input_Key.Numpad6.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad7 = ["Numpad7",43];
flambe_input_Key.Numpad7.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad8 = ["Numpad8",44];
flambe_input_Key.Numpad8.__enum__ = flambe_input_Key;
flambe_input_Key.Numpad9 = ["Numpad9",45];
flambe_input_Key.Numpad9.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadAdd = ["NumpadAdd",46];
flambe_input_Key.NumpadAdd.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadDecimal = ["NumpadDecimal",47];
flambe_input_Key.NumpadDecimal.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadDivide = ["NumpadDivide",48];
flambe_input_Key.NumpadDivide.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadEnter = ["NumpadEnter",49];
flambe_input_Key.NumpadEnter.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadMultiply = ["NumpadMultiply",50];
flambe_input_Key.NumpadMultiply.__enum__ = flambe_input_Key;
flambe_input_Key.NumpadSubtract = ["NumpadSubtract",51];
flambe_input_Key.NumpadSubtract.__enum__ = flambe_input_Key;
flambe_input_Key.F1 = ["F1",52];
flambe_input_Key.F1.__enum__ = flambe_input_Key;
flambe_input_Key.F2 = ["F2",53];
flambe_input_Key.F2.__enum__ = flambe_input_Key;
flambe_input_Key.F3 = ["F3",54];
flambe_input_Key.F3.__enum__ = flambe_input_Key;
flambe_input_Key.F4 = ["F4",55];
flambe_input_Key.F4.__enum__ = flambe_input_Key;
flambe_input_Key.F5 = ["F5",56];
flambe_input_Key.F5.__enum__ = flambe_input_Key;
flambe_input_Key.F6 = ["F6",57];
flambe_input_Key.F6.__enum__ = flambe_input_Key;
flambe_input_Key.F7 = ["F7",58];
flambe_input_Key.F7.__enum__ = flambe_input_Key;
flambe_input_Key.F8 = ["F8",59];
flambe_input_Key.F8.__enum__ = flambe_input_Key;
flambe_input_Key.F9 = ["F9",60];
flambe_input_Key.F9.__enum__ = flambe_input_Key;
flambe_input_Key.F10 = ["F10",61];
flambe_input_Key.F10.__enum__ = flambe_input_Key;
flambe_input_Key.F11 = ["F11",62];
flambe_input_Key.F11.__enum__ = flambe_input_Key;
flambe_input_Key.F12 = ["F12",63];
flambe_input_Key.F12.__enum__ = flambe_input_Key;
flambe_input_Key.F13 = ["F13",64];
flambe_input_Key.F13.__enum__ = flambe_input_Key;
flambe_input_Key.F14 = ["F14",65];
flambe_input_Key.F14.__enum__ = flambe_input_Key;
flambe_input_Key.F15 = ["F15",66];
flambe_input_Key.F15.__enum__ = flambe_input_Key;
flambe_input_Key.Left = ["Left",67];
flambe_input_Key.Left.__enum__ = flambe_input_Key;
flambe_input_Key.Up = ["Up",68];
flambe_input_Key.Up.__enum__ = flambe_input_Key;
flambe_input_Key.Right = ["Right",69];
flambe_input_Key.Right.__enum__ = flambe_input_Key;
flambe_input_Key.Down = ["Down",70];
flambe_input_Key.Down.__enum__ = flambe_input_Key;
flambe_input_Key.Alt = ["Alt",71];
flambe_input_Key.Alt.__enum__ = flambe_input_Key;
flambe_input_Key.Backquote = ["Backquote",72];
flambe_input_Key.Backquote.__enum__ = flambe_input_Key;
flambe_input_Key.Backslash = ["Backslash",73];
flambe_input_Key.Backslash.__enum__ = flambe_input_Key;
flambe_input_Key.Backspace = ["Backspace",74];
flambe_input_Key.Backspace.__enum__ = flambe_input_Key;
flambe_input_Key.CapsLock = ["CapsLock",75];
flambe_input_Key.CapsLock.__enum__ = flambe_input_Key;
flambe_input_Key.Comma = ["Comma",76];
flambe_input_Key.Comma.__enum__ = flambe_input_Key;
flambe_input_Key.Command = ["Command",77];
flambe_input_Key.Command.__enum__ = flambe_input_Key;
flambe_input_Key.Control = ["Control",78];
flambe_input_Key.Control.__enum__ = flambe_input_Key;
flambe_input_Key.Delete = ["Delete",79];
flambe_input_Key.Delete.__enum__ = flambe_input_Key;
flambe_input_Key.End = ["End",80];
flambe_input_Key.End.__enum__ = flambe_input_Key;
flambe_input_Key.Enter = ["Enter",81];
flambe_input_Key.Enter.__enum__ = flambe_input_Key;
flambe_input_Key.Equals = ["Equals",82];
flambe_input_Key.Equals.__enum__ = flambe_input_Key;
flambe_input_Key.Escape = ["Escape",83];
flambe_input_Key.Escape.__enum__ = flambe_input_Key;
flambe_input_Key.Home = ["Home",84];
flambe_input_Key.Home.__enum__ = flambe_input_Key;
flambe_input_Key.Insert = ["Insert",85];
flambe_input_Key.Insert.__enum__ = flambe_input_Key;
flambe_input_Key.LeftBracket = ["LeftBracket",86];
flambe_input_Key.LeftBracket.__enum__ = flambe_input_Key;
flambe_input_Key.Minus = ["Minus",87];
flambe_input_Key.Minus.__enum__ = flambe_input_Key;
flambe_input_Key.PageDown = ["PageDown",88];
flambe_input_Key.PageDown.__enum__ = flambe_input_Key;
flambe_input_Key.PageUp = ["PageUp",89];
flambe_input_Key.PageUp.__enum__ = flambe_input_Key;
flambe_input_Key.Period = ["Period",90];
flambe_input_Key.Period.__enum__ = flambe_input_Key;
flambe_input_Key.Quote = ["Quote",91];
flambe_input_Key.Quote.__enum__ = flambe_input_Key;
flambe_input_Key.RightBracket = ["RightBracket",92];
flambe_input_Key.RightBracket.__enum__ = flambe_input_Key;
flambe_input_Key.Semicolon = ["Semicolon",93];
flambe_input_Key.Semicolon.__enum__ = flambe_input_Key;
flambe_input_Key.Shift = ["Shift",94];
flambe_input_Key.Shift.__enum__ = flambe_input_Key;
flambe_input_Key.Slash = ["Slash",95];
flambe_input_Key.Slash.__enum__ = flambe_input_Key;
flambe_input_Key.Space = ["Space",96];
flambe_input_Key.Space.__enum__ = flambe_input_Key;
flambe_input_Key.Tab = ["Tab",97];
flambe_input_Key.Tab.__enum__ = flambe_input_Key;
flambe_input_Key.Menu = ["Menu",98];
flambe_input_Key.Menu.__enum__ = flambe_input_Key;
flambe_input_Key.Search = ["Search",99];
flambe_input_Key.Search.__enum__ = flambe_input_Key;
flambe_input_Key.Unknown = function(keyCode) { var $x = ["Unknown",100,keyCode]; $x.__enum__ = flambe_input_Key; return $x; };
var flambe_input_KeyboardEvent = function() {
	this.init(0,null);
};
$hxClasses["flambe.input.KeyboardEvent"] = flambe_input_KeyboardEvent;
flambe_input_KeyboardEvent.__name__ = true;
flambe_input_KeyboardEvent.prototype = {
	init: function(id,key) {
		this.id = id;
		this.key = key;
	}
	,__class__: flambe_input_KeyboardEvent
};
var flambe_input_MouseButton = $hxClasses["flambe.input.MouseButton"] = { __ename__ : true, __constructs__ : ["Left","Middle","Right","Unknown"] };
flambe_input_MouseButton.Left = ["Left",0];
flambe_input_MouseButton.Left.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Middle = ["Middle",1];
flambe_input_MouseButton.Middle.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Right = ["Right",2];
flambe_input_MouseButton.Right.__enum__ = flambe_input_MouseButton;
flambe_input_MouseButton.Unknown = function(buttonCode) { var $x = ["Unknown",3,buttonCode]; $x.__enum__ = flambe_input_MouseButton; return $x; };
var flambe_input_MouseCursor = $hxClasses["flambe.input.MouseCursor"] = { __ename__ : true, __constructs__ : ["Default","Button","None"] };
flambe_input_MouseCursor.Default = ["Default",0];
flambe_input_MouseCursor.Default.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.Button = ["Button",1];
flambe_input_MouseCursor.Button.__enum__ = flambe_input_MouseCursor;
flambe_input_MouseCursor.None = ["None",2];
flambe_input_MouseCursor.None.__enum__ = flambe_input_MouseCursor;
var flambe_input_MouseEvent = function() {
	this.init(0,0,0,null);
};
$hxClasses["flambe.input.MouseEvent"] = flambe_input_MouseEvent;
flambe_input_MouseEvent.__name__ = true;
flambe_input_MouseEvent.prototype = {
	init: function(id,viewX,viewY,button) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.button = button;
	}
	,__class__: flambe_input_MouseEvent
};
var flambe_input_EventSource = $hxClasses["flambe.input.EventSource"] = { __ename__ : true, __constructs__ : ["Mouse","Touch"] };
flambe_input_EventSource.Mouse = function(event) { var $x = ["Mouse",0,event]; $x.__enum__ = flambe_input_EventSource; return $x; };
flambe_input_EventSource.Touch = function(point) { var $x = ["Touch",1,point]; $x.__enum__ = flambe_input_EventSource; return $x; };
var flambe_input_PointerEvent = function() {
	this.init(0,0,0,null,null);
};
$hxClasses["flambe.input.PointerEvent"] = flambe_input_PointerEvent;
flambe_input_PointerEvent.__name__ = true;
flambe_input_PointerEvent.prototype = {
	init: function(id,viewX,viewY,hit,source) {
		this.id = id;
		this.viewX = viewX;
		this.viewY = viewY;
		this.hit = hit;
		this.source = source;
		this._stopped = false;
	}
	,__class__: flambe_input_PointerEvent
};
var flambe_input_TouchPoint = function(id) {
	this.id = id;
	this._source = flambe_input_EventSource.Touch(this);
};
$hxClasses["flambe.input.TouchPoint"] = flambe_input_TouchPoint;
flambe_input_TouchPoint.__name__ = true;
flambe_input_TouchPoint.prototype = {
	init: function(viewX,viewY) {
		this.viewX = viewX;
		this.viewY = viewY;
	}
	,__class__: flambe_input_TouchPoint
};
var flambe_math_FMath = function() { };
$hxClasses["flambe.math.FMath"] = flambe_math_FMath;
flambe_math_FMath.__name__ = true;
flambe_math_FMath.toRadians = function(degrees) {
	return degrees * 3.141592653589793 / 180;
};
flambe_math_FMath.max = function(a,b) {
	if(a > b) return a; else return b;
};
flambe_math_FMath.min = function(a,b) {
	if(a < b) return a; else return b;
};
var flambe_math_Matrix = function() {
	this.identity();
};
$hxClasses["flambe.math.Matrix"] = flambe_math_Matrix;
flambe_math_Matrix.__name__ = true;
flambe_math_Matrix.multiply = function(lhs,rhs,result) {
	if(result == null) result = new flambe_math_Matrix();
	var a = lhs.m00 * rhs.m00 + lhs.m01 * rhs.m10;
	var b = lhs.m00 * rhs.m01 + lhs.m01 * rhs.m11;
	var c = lhs.m00 * rhs.m02 + lhs.m01 * rhs.m12 + lhs.m02;
	result.m00 = a;
	result.m01 = b;
	result.m02 = c;
	a = lhs.m10 * rhs.m00 + lhs.m11 * rhs.m10;
	b = lhs.m10 * rhs.m01 + lhs.m11 * rhs.m11;
	c = lhs.m10 * rhs.m02 + lhs.m11 * rhs.m12 + lhs.m12;
	result.m10 = a;
	result.m11 = b;
	result.m12 = c;
	return result;
};
flambe_math_Matrix.prototype = {
	set: function(m00,m10,m01,m11,m02,m12) {
		this.m00 = m00;
		this.m01 = m01;
		this.m02 = m02;
		this.m10 = m10;
		this.m11 = m11;
		this.m12 = m12;
	}
	,identity: function() {
		this.set(1,0,0,1,0,0);
	}
	,compose: function(x,y,scaleX,scaleY,rotation) {
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		this.set(cos * scaleX,sin * scaleX,-sin * scaleY,cos * scaleY,x,y);
	}
	,translate: function(x,y) {
		this.m02 += this.m00 * x + this.m01 * y;
		this.m12 += this.m11 * y + this.m10 * x;
	}
	,invert: function() {
		var det = this.determinant();
		if(det == 0) return false;
		this.set(this.m11 / det,-this.m01 / det,-this.m10 / det,this.m00 / det,(this.m01 * this.m12 - this.m11 * this.m02) / det,(this.m10 * this.m02 - this.m00 * this.m12) / det);
		return true;
	}
	,transformArray: function(points,length,result) {
		var ii = 0;
		while(ii < length) {
			var x = points[ii];
			var y = points[ii + 1];
			result[ii++] = x * this.m00 + y * this.m01 + this.m02;
			result[ii++] = x * this.m10 + y * this.m11 + this.m12;
		}
	}
	,determinant: function() {
		return this.m00 * this.m11 - this.m01 * this.m10;
	}
	,inverseTransform: function(x,y,result) {
		var det = this.determinant();
		if(det == 0) return false;
		x -= this.m02;
		y -= this.m12;
		result.x = (x * this.m11 - y * this.m01) / det;
		result.y = (y * this.m00 - x * this.m10) / det;
		return true;
	}
	,clone: function(result) {
		if(result == null) result = new flambe_math_Matrix();
		result.set(this.m00,this.m10,this.m01,this.m11,this.m02,this.m12);
		return result;
	}
	,toString: function() {
		return this.m00 + " " + this.m01 + " " + this.m02 + " \\ " + this.m10 + " " + this.m11 + " " + this.m12;
	}
	,__class__: flambe_math_Matrix
};
var flambe_math_Rectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.set(x,y,width,height);
};
$hxClasses["flambe.math.Rectangle"] = flambe_math_Rectangle;
flambe_math_Rectangle.__name__ = true;
flambe_math_Rectangle.prototype = {
	set: function(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	,contains: function(x,y) {
		x -= this.x;
		if(this.width >= 0) {
			if(x < 0 || x > this.width) return false;
		} else if(x > 0 || x < this.width) return false;
		y -= this.y;
		if(this.height >= 0) {
			if(y < 0 || y > this.height) return false;
		} else if(y > 0 || y < this.height) return false;
		return true;
	}
	,clone: function(result) {
		if(result == null) result = new flambe_math_Rectangle();
		result.set(this.x,this.y,this.width,this.height);
		return result;
	}
	,equals: function(other) {
		return this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height;
	}
	,toString: function() {
		return "(" + this.x + "," + this.y + " " + this.width + "x" + this.height + ")";
	}
	,get_left: function() {
		return this.x;
	}
	,get_top: function() {
		return this.y;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,get_bottom: function() {
		return this.y + this.height;
	}
	,__class__: flambe_math_Rectangle
	,__properties__: {get_bottom:"get_bottom",get_right:"get_right",get_top:"get_top",get_left:"get_left"}
};
var flambe_platform_BasicAsset = function() {
	this._reloadCount = null;
	this._disposed = false;
};
$hxClasses["flambe.platform.BasicAsset"] = flambe_platform_BasicAsset;
flambe_platform_BasicAsset.__name__ = true;
flambe_platform_BasicAsset.__interfaces__ = [flambe_asset_Asset];
flambe_platform_BasicAsset.prototype = {
	assertNotDisposed: function() {
		flambe_util_Assert.that(!this._disposed,"Asset cannot be used after being disposed");
	}
	,reload: function(asset) {
		this.dispose();
		this._disposed = false;
		this.copyFrom(asset);
		var _g = this.get_reloadCount();
		_g.set__(_g.get__() + 1);
	}
	,dispose: function() {
		if(!this._disposed) {
			this._disposed = true;
			this.onDisposed();
		}
	}
	,copyFrom: function(asset) {
		flambe_util_Assert.fail();
	}
	,onDisposed: function() {
		flambe_util_Assert.fail();
	}
	,get_reloadCount: function() {
		if(this._reloadCount == null) this._reloadCount = new flambe_util_Value(0);
		return this._reloadCount;
	}
	,__class__: flambe_platform_BasicAsset
	,__properties__: {get_reloadCount:"get_reloadCount"}
};
var flambe_platform_BasicAssetPackLoader = function(platform,manifest) {
	var _g = this;
	this.manifest = manifest;
	this._platform = platform;
	this.promise = new flambe_util_Promise();
	this._bytesLoaded = new haxe_ds_StringMap();
	this._pack = new flambe_platform__$BasicAssetPackLoader_BasicAssetPack(manifest,this);
	var entries = Lambda.array(manifest);
	if(entries.length == 0) this.handleSuccess(); else {
		var groups = new haxe_ds_StringMap();
		var _g1 = 0;
		while(_g1 < entries.length) {
			var entry = entries[_g1];
			++_g1;
			var group = groups.get(entry.name);
			if(group == null) {
				group = [];
				groups.set(entry.name,group);
			}
			group.push(entry);
		}
		this._assetsRemaining = Lambda.count(groups);
		var $it0 = groups.iterator();
		while( $it0.hasNext() ) {
			var group1 = $it0.next();
			var group2 = [group1];
			this.pickBestEntry(group2[0],(function(group2) {
				return function(bestEntry) {
					if(bestEntry != null) {
						var url = manifest.getFullURL(bestEntry);
						try {
							_g.loadEntry(url,bestEntry);
						} catch( error ) {
							_g.handleError(bestEntry,"Unexpected error: " + Std.string(error));
						}
						var _g11 = _g.promise;
						_g11.set_total(_g11.get_total() + bestEntry.bytes);
					} else {
						var badEntry = group2[0][0];
						if(flambe_platform_BasicAssetPackLoader.isAudio(badEntry.format)) {
							flambe_Log.warn("Could not find a supported audio format to load",["name",badEntry.name]);
							_g.handleLoad(badEntry,flambe_platform_DummySound.getInstance());
						} else _g.handleError(badEntry,"Could not find a supported format to load");
					}
				};
			})(group2));
		}
	}
	var catapult = this._platform.getCatapultClient();
	if(catapult != null) catapult.add(this);
};
$hxClasses["flambe.platform.BasicAssetPackLoader"] = flambe_platform_BasicAssetPackLoader;
flambe_platform_BasicAssetPackLoader.__name__ = true;
flambe_platform_BasicAssetPackLoader.removeUrlParams = function(url) {
	var query = url.indexOf("?");
	if(query > 0) return HxOverrides.substr(url,0,query); else return url;
};
flambe_platform_BasicAssetPackLoader.isAudio = function(format) {
	switch(Type.enumIndex(format)) {
	case 8:case 9:case 10:case 11:case 12:
		return true;
	default:
		return false;
	}
};
flambe_platform_BasicAssetPackLoader.prototype = {
	reload: function(url) {
		var _g = this;
		var baseUrl = flambe_platform_BasicAssetPackLoader.removeUrlParams(url);
		var foundEntry = null;
		var $it0 = this.manifest.iterator();
		while( $it0.hasNext() ) {
			var entry = $it0.next();
			if(baseUrl == flambe_platform_BasicAssetPackLoader.removeUrlParams(entry.url)) {
				foundEntry = entry;
				break;
			}
		}
		if(foundEntry != null) this.getAssetFormats(function(formats) {
			if(formats.indexOf(foundEntry.format) >= 0) {
				var entry1 = new flambe_asset_AssetEntry(foundEntry.name,url,foundEntry.format,0);
				_g.loadEntry(_g.manifest.getFullURL(entry1),entry1);
			}
		});
	}
	,pickBestEntry: function(entries,fn) {
		var onFormatsAvailable = function(formats) {
			var _g = 0;
			while(_g < formats.length) {
				var format = formats[_g];
				++_g;
				var _g1 = 0;
				while(_g1 < entries.length) {
					var entry = entries[_g1];
					++_g1;
					if(entry.format == format) {
						fn(entry);
						return;
					}
				}
			}
			fn(null);
		};
		this.getAssetFormats(onFormatsAvailable);
	}
	,loadEntry: function(url,entry) {
		flambe_util_Assert.fail();
	}
	,getAssetFormats: function(fn) {
		flambe_util_Assert.fail();
	}
	,handleLoad: function(entry,asset) {
		if(this._pack.disposed) return;
		this.handleProgress(entry,entry.bytes);
		var map;
		var _g = entry.format;
		switch(Type.enumIndex(_g)) {
		case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
			map = this._pack.textures;
			break;
		case 8:case 9:case 10:case 11:case 12:
			map = this._pack.sounds;
			break;
		case 13:
			map = this._pack.files;
			break;
		}
		var oldAsset = map.get(entry.name);
		if(oldAsset != null) {
			flambe_Log.info("Reloaded asset",["url",entry.url]);
			oldAsset.reload(asset);
		} else {
			map.set(entry.name,asset);
			this._assetsRemaining -= 1;
			if(this._assetsRemaining == 0) this.handleSuccess();
		}
	}
	,handleProgress: function(entry,bytesLoaded) {
		this._bytesLoaded.set(entry.name,bytesLoaded);
		var bytesTotal = 0;
		var $it0 = this._bytesLoaded.iterator();
		while( $it0.hasNext() ) {
			var bytes = $it0.next();
			bytesTotal += bytes;
		}
		this.promise.set_progress(bytesTotal);
	}
	,handleSuccess: function() {
		this.promise.set_result(this._pack);
	}
	,handleError: function(entry,message) {
		flambe_Log.warn("Error loading asset pack",["error",message,"url",entry.url]);
		this.promise.error.emit(flambe_util_Strings.withFields(message,["url",entry.url]));
	}
	,handleTextureError: function(entry) {
		this.handleError(entry,"Failed to create texture. Is the GPU context unavailable?");
	}
	,__class__: flambe_platform_BasicAssetPackLoader
};
var flambe_platform__$BasicAssetPackLoader_BasicAssetPack = function(manifest,loader) {
	this.disposed = false;
	this._manifest = manifest;
	this.loader = loader;
	this.textures = new haxe_ds_StringMap();
	this.sounds = new haxe_ds_StringMap();
	this.files = new haxe_ds_StringMap();
};
$hxClasses["flambe.platform._BasicAssetPackLoader.BasicAssetPack"] = flambe_platform__$BasicAssetPackLoader_BasicAssetPack;
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__name__ = true;
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.__interfaces__ = [flambe_asset_AssetPack];
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.warnOnExtension = function(path) {
	var ext = flambe_util_Strings.getFileExtension(path);
	if(ext != null && ext.length == 3) flambe_Log.warn("Requested asset \"" + path + "\" should not have a file extension," + " did you mean \"" + flambe_util_Strings.removeFileExtension(path) + "\"?");
};
flambe_platform__$BasicAssetPackLoader_BasicAssetPack.prototype = {
	getTexture: function(name,required) {
		if(required == null) required = true;
		this.assertNotDisposed();
		flambe_platform__$BasicAssetPackLoader_BasicAssetPack.warnOnExtension(name);
		var texture = this.textures.get(name);
		if(texture == null && required) throw flambe_util_Strings.withFields("Missing texture",["name",name]);
		return texture;
	}
	,getFile: function(name,required) {
		if(required == null) required = true;
		this.assertNotDisposed();
		var file = this.files.get(name);
		if(file == null && required) throw flambe_util_Strings.withFields("Missing file",["name",name]);
		return file;
	}
	,assertNotDisposed: function() {
		flambe_util_Assert.that(!this.disposed,"AssetPack cannot be used after being disposed");
	}
	,__class__: flambe_platform__$BasicAssetPackLoader_BasicAssetPack
};
var flambe_platform_BasicFile = function(content) {
	flambe_platform_BasicAsset.call(this);
	this._content = content;
};
$hxClasses["flambe.platform.BasicFile"] = flambe_platform_BasicFile;
flambe_platform_BasicFile.__name__ = true;
flambe_platform_BasicFile.__interfaces__ = [flambe_asset_File];
flambe_platform_BasicFile.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicFile.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	toString: function() {
		this.assertNotDisposed();
		return this._content;
	}
	,copyFrom: function(that) {
		this._content = that._content;
	}
	,onDisposed: function() {
		this._content = null;
	}
	,__class__: flambe_platform_BasicFile
});
var flambe_subsystem_KeyboardSystem = function() { };
$hxClasses["flambe.subsystem.KeyboardSystem"] = flambe_subsystem_KeyboardSystem;
flambe_subsystem_KeyboardSystem.__name__ = true;
flambe_subsystem_KeyboardSystem.prototype = {
	__class__: flambe_subsystem_KeyboardSystem
};
var flambe_platform_BasicKeyboard = function() {
	this.down = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this.backButton = new flambe_util_Signal0();
	this._keyStates = new haxe_ds_IntMap();
};
$hxClasses["flambe.platform.BasicKeyboard"] = flambe_platform_BasicKeyboard;
flambe_platform_BasicKeyboard.__name__ = true;
flambe_platform_BasicKeyboard.__interfaces__ = [flambe_subsystem_KeyboardSystem];
flambe_platform_BasicKeyboard.prototype = {
	get_supported: function() {
		return true;
	}
	,isDown: function(key) {
		return this.isCodeDown(flambe_platform_KeyCodes.toKeyCode(key));
	}
	,isCodeDown: function(keyCode) {
		return this._keyStates.exists(keyCode);
	}
	,submitDown: function(keyCode) {
		if(keyCode == 16777238) {
			if(this.backButton.hasListeners()) {
				this.backButton.emit();
				return true;
			}
			return false;
		}
		if(!this.isCodeDown(keyCode)) {
			this._keyStates.set(keyCode,true);
			flambe_platform_BasicKeyboard._sharedEvent.init(flambe_platform_BasicKeyboard._sharedEvent.id + 1,flambe_platform_KeyCodes.toKey(keyCode));
			this.down.emit(flambe_platform_BasicKeyboard._sharedEvent);
		}
		return true;
	}
	,submitUp: function(keyCode) {
		if(this.isCodeDown(keyCode)) {
			this._keyStates.remove(keyCode);
			flambe_platform_BasicKeyboard._sharedEvent.init(flambe_platform_BasicKeyboard._sharedEvent.id + 1,flambe_platform_KeyCodes.toKey(keyCode));
			this.up.emit(flambe_platform_BasicKeyboard._sharedEvent);
		}
	}
	,__class__: flambe_platform_BasicKeyboard
	,__properties__: {get_supported:"get_supported"}
};
var flambe_subsystem_MouseSystem = function() { };
$hxClasses["flambe.subsystem.MouseSystem"] = flambe_subsystem_MouseSystem;
flambe_subsystem_MouseSystem.__name__ = true;
flambe_subsystem_MouseSystem.prototype = {
	__class__: flambe_subsystem_MouseSystem
};
var flambe_platform_BasicMouse = function(pointer) {
	this._pointer = pointer;
	this._source = flambe_input_EventSource.Mouse(flambe_platform_BasicMouse._sharedEvent);
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this.scroll = new flambe_util_Signal1();
	this._x = 0;
	this._y = 0;
	this._cursor = flambe_input_MouseCursor.Default;
	this._buttonStates = new haxe_ds_IntMap();
};
$hxClasses["flambe.platform.BasicMouse"] = flambe_platform_BasicMouse;
flambe_platform_BasicMouse.__name__ = true;
flambe_platform_BasicMouse.__interfaces__ = [flambe_subsystem_MouseSystem];
flambe_platform_BasicMouse.prototype = {
	get_supported: function() {
		return true;
	}
	,isDown: function(button) {
		return this.isCodeDown(flambe_platform_MouseCodes.toButtonCode(button));
	}
	,submitDown: function(viewX,viewY,buttonCode) {
		if(!this.isCodeDown(buttonCode)) {
			this._buttonStates.set(buttonCode,true);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitDown(viewX,viewY,this._source);
			this.down.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitMove: function(viewX,viewY) {
		this.prepare(viewX,viewY,null);
		this._pointer.submitMove(viewX,viewY,this._source);
		this.move.emit(flambe_platform_BasicMouse._sharedEvent);
	}
	,submitUp: function(viewX,viewY,buttonCode) {
		if(this.isCodeDown(buttonCode)) {
			this._buttonStates.remove(buttonCode);
			this.prepare(viewX,viewY,flambe_platform_MouseCodes.toButton(buttonCode));
			this._pointer.submitUp(viewX,viewY,this._source);
			this.up.emit(flambe_platform_BasicMouse._sharedEvent);
		}
	}
	,submitScroll: function(viewX,viewY,velocity) {
		this._x = viewX;
		this._y = viewY;
		if(!this.scroll.hasListeners()) return false;
		this.scroll.emit(velocity);
		return true;
	}
	,isCodeDown: function(buttonCode) {
		return this._buttonStates.exists(buttonCode);
	}
	,prepare: function(viewX,viewY,button) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicMouse._sharedEvent.init(flambe_platform_BasicMouse._sharedEvent.id + 1,viewX,viewY,button);
	}
	,__class__: flambe_platform_BasicMouse
	,__properties__: {get_supported:"get_supported"}
};
var flambe_subsystem_PointerSystem = function() { };
$hxClasses["flambe.subsystem.PointerSystem"] = flambe_subsystem_PointerSystem;
flambe_subsystem_PointerSystem.__name__ = true;
flambe_subsystem_PointerSystem.prototype = {
	__class__: flambe_subsystem_PointerSystem
};
var flambe_platform_BasicPointer = function(x,y,isDown) {
	if(isDown == null) isDown = false;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
	this._x = x;
	this._y = y;
	this._isDown = isDown;
};
$hxClasses["flambe.platform.BasicPointer"] = flambe_platform_BasicPointer;
flambe_platform_BasicPointer.__name__ = true;
flambe_platform_BasicPointer.__interfaces__ = [flambe_subsystem_PointerSystem];
flambe_platform_BasicPointer.prototype = {
	submitDown: function(viewX,viewY,source) {
		if(this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = true;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity.getComponent("Sprite_0");
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerDown(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.down.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitMove: function(viewX,viewY,source) {
		if(viewX == this._x && viewY == this._y) return;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity.getComponent("Sprite_0");
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerMove(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.move.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,submitUp: function(viewX,viewY,source) {
		if(!this._isDown) return;
		this.submitMove(viewX,viewY,source);
		this._isDown = false;
		var chain = [];
		var hit = flambe_display_Sprite.hitTest(flambe_System.root,viewX,viewY);
		if(hit != null) {
			var entity = hit.owner;
			do {
				var sprite = entity.getComponent("Sprite_0");
				if(sprite != null) chain.push(sprite);
				entity = entity.parent;
			} while(entity != null);
		}
		this.prepare(viewX,viewY,hit,source);
		var _g = 0;
		while(_g < chain.length) {
			var sprite1 = chain[_g];
			++_g;
			sprite1.onPointerUp(flambe_platform_BasicPointer._sharedEvent);
			if(flambe_platform_BasicPointer._sharedEvent._stopped) return;
		}
		this.up.emit(flambe_platform_BasicPointer._sharedEvent);
	}
	,prepare: function(viewX,viewY,hit,source) {
		this._x = viewX;
		this._y = viewY;
		flambe_platform_BasicPointer._sharedEvent.init(flambe_platform_BasicPointer._sharedEvent.id + 1,viewX,viewY,hit,source);
	}
	,__class__: flambe_platform_BasicPointer
};
var flambe_platform_BasicTexture = function(root,width,height) {
	this._y = 0;
	this._x = 0;
	this._parent = null;
	this.rootY = 0;
	this.rootX = 0;
	flambe_platform_BasicAsset.call(this);
	this.root = root;
	this._width = width;
	this._height = height;
};
$hxClasses["flambe.platform.BasicTexture"] = flambe_platform_BasicTexture;
flambe_platform_BasicTexture.__name__ = true;
flambe_platform_BasicTexture.__interfaces__ = [flambe_display_SubTexture];
flambe_platform_BasicTexture.__super__ = flambe_platform_BasicAsset;
flambe_platform_BasicTexture.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	subTexture: function(x,y,width,height) {
		var sub = this.root.createTexture(width,height);
		sub._parent = this;
		sub._x = x;
		sub._y = y;
		sub.rootX = this.rootX + x;
		sub.rootY = this.rootY + y;
		return sub;
	}
	,copyFrom: function(that) {
		this.root.copyFrom(that.root);
		this._width = that._width;
		this._height = that._height;
		flambe_util_Assert.that(this.rootX == that.rootX && this.rootY == that.rootY && this._x == that._x && this._y == that._y);
	}
	,onDisposed: function() {
		if(this._parent == null) this.root.dispose();
	}
	,get_reloadCount: function() {
		return this.root.get_reloadCount();
	}
	,get_parent: function() {
		return this._parent;
	}
	,get_x: function() {
		return this._x;
	}
	,get_y: function() {
		return this._y;
	}
	,get_width: function() {
		return this._width;
	}
	,get_height: function() {
		return this._height;
	}
	,__class__: flambe_platform_BasicTexture
	,__properties__: $extend(flambe_platform_BasicAsset.prototype.__properties__,{get_height:"get_height",get_width:"get_width",get_y:"get_y",get_x:"get_x",get_parent:"get_parent"})
});
var flambe_subsystem_TouchSystem = function() { };
$hxClasses["flambe.subsystem.TouchSystem"] = flambe_subsystem_TouchSystem;
flambe_subsystem_TouchSystem.__name__ = true;
flambe_subsystem_TouchSystem.prototype = {
	__class__: flambe_subsystem_TouchSystem
};
var flambe_platform_BasicTouch = function(pointer,maxPoints) {
	if(maxPoints == null) maxPoints = 4;
	this._pointer = pointer;
	this._maxPoints = maxPoints;
	this._pointMap = new haxe_ds_IntMap();
	this._points = [];
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
$hxClasses["flambe.platform.BasicTouch"] = flambe_platform_BasicTouch;
flambe_platform_BasicTouch.__name__ = true;
flambe_platform_BasicTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_BasicTouch.prototype = {
	get_supported: function() {
		return true;
	}
	,submitDown: function(id,viewX,viewY) {
		if(!this._pointMap.exists(id)) {
			var point = new flambe_input_TouchPoint(id);
			point.init(viewX,viewY);
			this._pointMap.set(id,point);
			this._points.push(point);
			if(this._pointerTouch == null) {
				this._pointerTouch = point;
				this._pointer.submitDown(viewX,viewY,point._source);
			}
			this.down.emit(point);
		}
	}
	,submitMove: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			if(this._pointerTouch == point) this._pointer.submitMove(viewX,viewY,point._source);
			this.move.emit(point);
		}
	}
	,submitUp: function(id,viewX,viewY) {
		var point = this._pointMap.get(id);
		if(point != null) {
			point.init(viewX,viewY);
			this._pointMap.remove(id);
			HxOverrides.remove(this._points,point);
			if(this._pointerTouch == point) {
				this._pointerTouch = null;
				this._pointer.submitUp(viewX,viewY,point._source);
			}
			this.up.emit(point);
		}
	}
	,__class__: flambe_platform_BasicTouch
	,__properties__: {get_supported:"get_supported"}
};
var flambe_platform_CatapultClient = function() {
	this._loaders = [];
};
$hxClasses["flambe.platform.CatapultClient"] = flambe_platform_CatapultClient;
flambe_platform_CatapultClient.__name__ = true;
flambe_platform_CatapultClient.prototype = {
	add: function(loader) {
		if(loader.manifest.get_localBase() == "assets") this._loaders.push(loader);
	}
	,onError: function(cause) {
		flambe_Log.warn("Unable to connect to Catapult",["cause",cause]);
	}
	,onMessage: function(message) {
		var message1 = JSON.parse(message);
		var _g = message1.type;
		switch(_g) {
		case "file_changed":
			var url = message1.name + "?v=" + message1.md5;
			url = StringTools.replace(url,"\\","/");
			var _g1 = 0;
			var _g2 = this._loaders;
			while(_g1 < _g2.length) {
				var loader = _g2[_g1];
				++_g1;
				loader.reload(url);
			}
			break;
		case "restart":
			this.onRestart();
			break;
		}
	}
	,onRestart: function() {
		flambe_util_Assert.fail();
	}
	,__class__: flambe_platform_CatapultClient
};
var flambe_platform_DebugLogic = function(platform) {
	var _g = this;
	this._platform = platform;
	platform.getKeyboard().down.connect(function(event) {
		if(event.key == flambe_input_Key.O && platform.getKeyboard().isDown(flambe_input_Key.Control)) {
			if(_g.toggleOverdrawGraphics()) flambe_Log.info("Enabled overdraw visualizer, press Ctrl-O again to disable");
		}
	});
};
$hxClasses["flambe.platform.DebugLogic"] = flambe_platform_DebugLogic;
flambe_platform_DebugLogic.__name__ = true;
flambe_platform_DebugLogic.prototype = {
	toggleOverdrawGraphics: function() {
		var renderer = this._platform.getRenderer();
		if(this._savedGraphics != null) {
			renderer.graphics = this._savedGraphics;
			this._savedGraphics = null;
		} else if(renderer.graphics != null) {
			this._savedGraphics = renderer.graphics;
			renderer.graphics = new flambe_platform_OverdrawGraphics(this._savedGraphics);
			return true;
		}
		return false;
	}
	,__class__: flambe_platform_DebugLogic
};
var flambe_sound_Sound = function() { };
$hxClasses["flambe.sound.Sound"] = flambe_sound_Sound;
flambe_sound_Sound.__name__ = true;
flambe_sound_Sound.__interfaces__ = [flambe_asset_Asset];
var flambe_platform_DummySound = function() {
	flambe_platform_BasicAsset.call(this);
	this._playback = new flambe_platform_DummyPlayback(this);
};
$hxClasses["flambe.platform.DummySound"] = flambe_platform_DummySound;
flambe_platform_DummySound.__name__ = true;
flambe_platform_DummySound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_DummySound.getInstance = function() {
	if(flambe_platform_DummySound._instance == null) flambe_platform_DummySound._instance = new flambe_platform_DummySound();
	return flambe_platform_DummySound._instance;
};
flambe_platform_DummySound.__super__ = flambe_platform_BasicAsset;
flambe_platform_DummySound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	copyFrom: function(asset) {
	}
	,onDisposed: function() {
	}
	,__class__: flambe_platform_DummySound
});
var flambe_sound_Playback = function() { };
$hxClasses["flambe.sound.Playback"] = flambe_sound_Playback;
flambe_sound_Playback.__name__ = true;
flambe_sound_Playback.__interfaces__ = [flambe_util_Disposable];
var flambe_platform_DummyPlayback = function(sound) {
	this._sound = sound;
	this.volume = new flambe_animation_AnimatedFloat(0);
	this._complete = new flambe_util_Value(true);
};
$hxClasses["flambe.platform.DummyPlayback"] = flambe_platform_DummyPlayback;
flambe_platform_DummyPlayback.__name__ = true;
flambe_platform_DummyPlayback.__interfaces__ = [flambe_sound_Playback];
flambe_platform_DummyPlayback.prototype = {
	__class__: flambe_platform_DummyPlayback
};
var flambe_platform_DummyTouch = function() {
	this.down = new flambe_util_Signal1();
	this.move = new flambe_util_Signal1();
	this.up = new flambe_util_Signal1();
};
$hxClasses["flambe.platform.DummyTouch"] = flambe_platform_DummyTouch;
flambe_platform_DummyTouch.__name__ = true;
flambe_platform_DummyTouch.__interfaces__ = [flambe_subsystem_TouchSystem];
flambe_platform_DummyTouch.prototype = {
	get_supported: function() {
		return false;
	}
	,__class__: flambe_platform_DummyTouch
	,__properties__: {get_supported:"get_supported"}
};
var flambe_platform_EventGroup = function() {
	this._entries = [];
};
$hxClasses["flambe.platform.EventGroup"] = flambe_platform_EventGroup;
flambe_platform_EventGroup.__name__ = true;
flambe_platform_EventGroup.__interfaces__ = [flambe_util_Disposable];
flambe_platform_EventGroup.prototype = {
	addListener: function(dispatcher,type,listener) {
		dispatcher.addEventListener(type,listener,false);
		this._entries.push(new flambe_platform__$EventGroup_Entry(dispatcher,type,listener));
	}
	,addDisposingListener: function(dispatcher,type,listener) {
		var _g = this;
		this.addListener(dispatcher,type,function(event) {
			_g.dispose();
			listener(event);
		});
	}
	,dispose: function() {
		var _g = 0;
		var _g1 = this._entries;
		while(_g < _g1.length) {
			var entry = _g1[_g];
			++_g;
			entry.dispatcher.removeEventListener(entry.type,entry.listener,false);
		}
		this._entries = [];
	}
	,__class__: flambe_platform_EventGroup
};
var flambe_platform__$EventGroup_Entry = function(dispatcher,type,listener) {
	this.dispatcher = dispatcher;
	this.type = type;
	this.listener = listener;
};
$hxClasses["flambe.platform._EventGroup.Entry"] = flambe_platform__$EventGroup_Entry;
flambe_platform__$EventGroup_Entry.__name__ = true;
flambe_platform__$EventGroup_Entry.prototype = {
	__class__: flambe_platform__$EventGroup_Entry
};
var flambe_platform_InternalGraphics = function() { };
$hxClasses["flambe.platform.InternalGraphics"] = flambe_platform_InternalGraphics;
flambe_platform_InternalGraphics.__name__ = true;
flambe_platform_InternalGraphics.__interfaces__ = [flambe_display_Graphics];
flambe_platform_InternalGraphics.prototype = {
	__class__: flambe_platform_InternalGraphics
};
var flambe_subsystem_RendererSystem = function() { };
$hxClasses["flambe.subsystem.RendererSystem"] = flambe_subsystem_RendererSystem;
flambe_subsystem_RendererSystem.__name__ = true;
flambe_subsystem_RendererSystem.prototype = {
	__class__: flambe_subsystem_RendererSystem
};
var flambe_platform_InternalRenderer = function() { };
$hxClasses["flambe.platform.InternalRenderer"] = flambe_platform_InternalRenderer;
flambe_platform_InternalRenderer.__name__ = true;
flambe_platform_InternalRenderer.__interfaces__ = [flambe_subsystem_RendererSystem];
flambe_platform_InternalRenderer.prototype = {
	__class__: flambe_platform_InternalRenderer
};
var flambe_platform_KeyCodes = function() { };
$hxClasses["flambe.platform.KeyCodes"] = flambe_platform_KeyCodes;
flambe_platform_KeyCodes.__name__ = true;
flambe_platform_KeyCodes.toKey = function(keyCode) {
	switch(keyCode) {
	case 65:
		return flambe_input_Key.A;
	case 66:
		return flambe_input_Key.B;
	case 67:
		return flambe_input_Key.C;
	case 68:
		return flambe_input_Key.D;
	case 69:
		return flambe_input_Key.E;
	case 70:
		return flambe_input_Key.F;
	case 71:
		return flambe_input_Key.G;
	case 72:
		return flambe_input_Key.H;
	case 73:
		return flambe_input_Key.I;
	case 74:
		return flambe_input_Key.J;
	case 75:
		return flambe_input_Key.K;
	case 76:
		return flambe_input_Key.L;
	case 77:
		return flambe_input_Key.M;
	case 78:
		return flambe_input_Key.N;
	case 79:
		return flambe_input_Key.O;
	case 80:
		return flambe_input_Key.P;
	case 81:
		return flambe_input_Key.Q;
	case 82:
		return flambe_input_Key.R;
	case 83:
		return flambe_input_Key.S;
	case 84:
		return flambe_input_Key.T;
	case 85:
		return flambe_input_Key.U;
	case 86:
		return flambe_input_Key.V;
	case 87:
		return flambe_input_Key.W;
	case 88:
		return flambe_input_Key.X;
	case 89:
		return flambe_input_Key.Y;
	case 90:
		return flambe_input_Key.Z;
	case 48:
		return flambe_input_Key.Number0;
	case 49:
		return flambe_input_Key.Number1;
	case 50:
		return flambe_input_Key.Number2;
	case 51:
		return flambe_input_Key.Number3;
	case 52:
		return flambe_input_Key.Number4;
	case 53:
		return flambe_input_Key.Number5;
	case 54:
		return flambe_input_Key.Number6;
	case 55:
		return flambe_input_Key.Number7;
	case 56:
		return flambe_input_Key.Number8;
	case 57:
		return flambe_input_Key.Number9;
	case 96:
		return flambe_input_Key.Numpad0;
	case 97:
		return flambe_input_Key.Numpad1;
	case 98:
		return flambe_input_Key.Numpad2;
	case 99:
		return flambe_input_Key.Numpad3;
	case 100:
		return flambe_input_Key.Numpad4;
	case 101:
		return flambe_input_Key.Numpad5;
	case 102:
		return flambe_input_Key.Numpad6;
	case 103:
		return flambe_input_Key.Numpad7;
	case 104:
		return flambe_input_Key.Numpad8;
	case 105:
		return flambe_input_Key.Numpad9;
	case 107:
		return flambe_input_Key.NumpadAdd;
	case 110:
		return flambe_input_Key.NumpadDecimal;
	case 111:
		return flambe_input_Key.NumpadDivide;
	case 108:
		return flambe_input_Key.NumpadEnter;
	case 106:
		return flambe_input_Key.NumpadMultiply;
	case 109:
		return flambe_input_Key.NumpadSubtract;
	case 112:
		return flambe_input_Key.F1;
	case 113:
		return flambe_input_Key.F2;
	case 114:
		return flambe_input_Key.F3;
	case 115:
		return flambe_input_Key.F4;
	case 116:
		return flambe_input_Key.F5;
	case 117:
		return flambe_input_Key.F6;
	case 118:
		return flambe_input_Key.F7;
	case 119:
		return flambe_input_Key.F8;
	case 120:
		return flambe_input_Key.F9;
	case 121:
		return flambe_input_Key.F10;
	case 122:
		return flambe_input_Key.F11;
	case 123:
		return flambe_input_Key.F12;
	case 37:
		return flambe_input_Key.Left;
	case 38:
		return flambe_input_Key.Up;
	case 39:
		return flambe_input_Key.Right;
	case 40:
		return flambe_input_Key.Down;
	case 18:
		return flambe_input_Key.Alt;
	case 192:
		return flambe_input_Key.Backquote;
	case 220:
		return flambe_input_Key.Backslash;
	case 8:
		return flambe_input_Key.Backspace;
	case 20:
		return flambe_input_Key.CapsLock;
	case 188:
		return flambe_input_Key.Comma;
	case 15:
		return flambe_input_Key.Command;
	case 17:
		return flambe_input_Key.Control;
	case 46:
		return flambe_input_Key.Delete;
	case 35:
		return flambe_input_Key.End;
	case 13:
		return flambe_input_Key.Enter;
	case 187:
		return flambe_input_Key.Equals;
	case 27:
		return flambe_input_Key.Escape;
	case 36:
		return flambe_input_Key.Home;
	case 45:
		return flambe_input_Key.Insert;
	case 219:
		return flambe_input_Key.LeftBracket;
	case 189:
		return flambe_input_Key.Minus;
	case 34:
		return flambe_input_Key.PageDown;
	case 33:
		return flambe_input_Key.PageUp;
	case 190:
		return flambe_input_Key.Period;
	case 222:
		return flambe_input_Key.Quote;
	case 221:
		return flambe_input_Key.RightBracket;
	case 186:
		return flambe_input_Key.Semicolon;
	case 16:
		return flambe_input_Key.Shift;
	case 191:
		return flambe_input_Key.Slash;
	case 32:
		return flambe_input_Key.Space;
	case 9:
		return flambe_input_Key.Tab;
	case 16777234:
		return flambe_input_Key.Menu;
	case 16777247:
		return flambe_input_Key.Search;
	}
	return flambe_input_Key.Unknown(keyCode);
};
flambe_platform_KeyCodes.toKeyCode = function(key) {
	switch(Type.enumIndex(key)) {
	case 0:
		return 65;
	case 1:
		return 66;
	case 2:
		return 67;
	case 3:
		return 68;
	case 4:
		return 69;
	case 5:
		return 70;
	case 6:
		return 71;
	case 7:
		return 72;
	case 8:
		return 73;
	case 9:
		return 74;
	case 10:
		return 75;
	case 11:
		return 76;
	case 12:
		return 77;
	case 13:
		return 78;
	case 14:
		return 79;
	case 15:
		return 80;
	case 16:
		return 81;
	case 17:
		return 82;
	case 18:
		return 83;
	case 19:
		return 84;
	case 20:
		return 85;
	case 21:
		return 86;
	case 22:
		return 87;
	case 23:
		return 88;
	case 24:
		return 89;
	case 25:
		return 90;
	case 26:
		return 48;
	case 27:
		return 49;
	case 28:
		return 50;
	case 29:
		return 51;
	case 30:
		return 52;
	case 31:
		return 53;
	case 32:
		return 54;
	case 33:
		return 55;
	case 34:
		return 56;
	case 35:
		return 57;
	case 36:
		return 96;
	case 37:
		return 97;
	case 38:
		return 98;
	case 39:
		return 99;
	case 40:
		return 100;
	case 41:
		return 101;
	case 42:
		return 102;
	case 43:
		return 103;
	case 44:
		return 104;
	case 45:
		return 105;
	case 46:
		return 107;
	case 47:
		return 110;
	case 48:
		return 111;
	case 49:
		return 108;
	case 50:
		return 106;
	case 51:
		return 109;
	case 52:
		return 112;
	case 53:
		return 113;
	case 54:
		return 114;
	case 55:
		return 115;
	case 56:
		return 116;
	case 57:
		return 117;
	case 58:
		return 118;
	case 59:
		return 119;
	case 60:
		return 120;
	case 61:
		return 121;
	case 62:
		return 122;
	case 63:
		return 123;
	case 64:
		return 124;
	case 65:
		return 125;
	case 66:
		return 126;
	case 67:
		return 37;
	case 68:
		return 38;
	case 69:
		return 39;
	case 70:
		return 40;
	case 71:
		return 18;
	case 72:
		return 192;
	case 73:
		return 220;
	case 74:
		return 8;
	case 75:
		return 20;
	case 76:
		return 188;
	case 77:
		return 15;
	case 78:
		return 17;
	case 79:
		return 46;
	case 80:
		return 35;
	case 81:
		return 13;
	case 82:
		return 187;
	case 83:
		return 27;
	case 84:
		return 36;
	case 85:
		return 45;
	case 86:
		return 219;
	case 87:
		return 189;
	case 88:
		return 34;
	case 89:
		return 33;
	case 90:
		return 190;
	case 91:
		return 222;
	case 92:
		return 221;
	case 93:
		return 186;
	case 94:
		return 16;
	case 95:
		return 191;
	case 96:
		return 32;
	case 97:
		return 9;
	case 98:
		return 16777234;
	case 99:
		return 16777247;
	case 100:
		var keyCode = key[2];
		return keyCode;
	}
};
var flambe_platform_MainLoop = function() {
	this._tickables = [];
};
$hxClasses["flambe.platform.MainLoop"] = flambe_platform_MainLoop;
flambe_platform_MainLoop.__name__ = true;
flambe_platform_MainLoop.updateEntity = function(entity,dt) {
	var speed = entity.getComponent("SpeedAdjuster_10");
	if(speed != null) {
		speed._realDt = dt;
		dt *= speed.scale.get__();
		if(dt <= 0) {
			speed.onUpdate(dt);
			return;
		}
	}
	var p = entity.firstComponent;
	while(p != null) {
		var next = p.next;
		p.onUpdate(dt);
		p = next;
	}
	var p1 = entity.firstChild;
	while(p1 != null) {
		var next1 = p1.next;
		flambe_platform_MainLoop.updateEntity(p1,dt);
		p1 = next1;
	}
};
flambe_platform_MainLoop.prototype = {
	update: function(dt) {
		if(dt <= 0) {
			flambe_Log.warn("Zero or negative time elapsed since the last frame!",["dt",dt]);
			return;
		}
		if(dt > 1) dt = 1;
		var ii = 0;
		while(ii < this._tickables.length) {
			var t = this._tickables[ii];
			if(t == null || t.update(dt)) this._tickables.splice(ii,1); else ++ii;
		}
		flambe_System.volume.update(dt);
		flambe_platform_MainLoop.updateEntity(flambe_System.root,dt);
	}
	,render: function(renderer) {
		var graphics = renderer.graphics;
		if(graphics != null) {
			renderer.willRender();
			flambe_display_Sprite.render(flambe_System.root,graphics);
			renderer.didRender();
		}
	}
	,__class__: flambe_platform_MainLoop
};
var flambe_platform_MathUtil = function() { };
$hxClasses["flambe.platform.MathUtil"] = flambe_platform_MathUtil;
flambe_platform_MathUtil.__name__ = true;
flambe_platform_MathUtil.nextPowerOfTwo = function(n) {
	var p = 1;
	while(p < n) p <<= 1;
	return p;
};
var flambe_platform_MouseCodes = function() { };
$hxClasses["flambe.platform.MouseCodes"] = flambe_platform_MouseCodes;
flambe_platform_MouseCodes.__name__ = true;
flambe_platform_MouseCodes.toButton = function(buttonCode) {
	switch(buttonCode) {
	case 0:
		return flambe_input_MouseButton.Left;
	case 1:
		return flambe_input_MouseButton.Middle;
	case 2:
		return flambe_input_MouseButton.Right;
	}
	return flambe_input_MouseButton.Unknown(buttonCode);
};
flambe_platform_MouseCodes.toButtonCode = function(button) {
	switch(Type.enumIndex(button)) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	case 3:
		var buttonCode = button[2];
		return buttonCode;
	}
};
var flambe_platform_OverdrawGraphics = function(impl) {
	this._impl = impl;
};
$hxClasses["flambe.platform.OverdrawGraphics"] = flambe_platform_OverdrawGraphics;
flambe_platform_OverdrawGraphics.__name__ = true;
flambe_platform_OverdrawGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_OverdrawGraphics.prototype = {
	save: function() {
		this._impl.save();
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		this._impl.transform(m00,m10,m01,m11,m02,m12);
	}
	,multiplyAlpha: function(factor) {
	}
	,setBlendMode: function(blendMode) {
	}
	,applyScissor: function(x,y,width,height) {
		this._impl.applyScissor(x,y,width,height);
	}
	,restore: function() {
		this._impl.restore();
	}
	,drawTexture: function(texture,destX,destY) {
		this.drawRegion(destX,destY,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		this.drawRegion(destX,destY,sourceW,sourceH);
	}
	,fillRect: function(color,x,y,width,height) {
		this.drawRegion(x,y,width,height);
	}
	,willRender: function() {
		this._impl.willRender();
		this._impl.save();
		this._impl.setBlendMode(flambe_display_BlendMode.Add);
	}
	,didRender: function() {
		this._impl.restore();
		this._impl.didRender();
	}
	,onResize: function(width,height) {
		this._impl.onResize(width,height);
	}
	,setTint: function(r,g,b) {
		this._impl.setTint(r,g,b);
	}
	,drawRegion: function(x,y,width,height) {
		this._impl.fillRect(1052680,x,y,width,height);
	}
	,__class__: flambe_platform_OverdrawGraphics
};
var flambe_platform_TextureRoot = function() { };
$hxClasses["flambe.platform.TextureRoot"] = flambe_platform_TextureRoot;
flambe_platform_TextureRoot.__name__ = true;
flambe_platform_TextureRoot.prototype = {
	__class__: flambe_platform_TextureRoot
};
var flambe_platform_Tickable = function() { };
$hxClasses["flambe.platform.Tickable"] = flambe_platform_Tickable;
flambe_platform_Tickable.__name__ = true;
flambe_platform_Tickable.prototype = {
	__class__: flambe_platform_Tickable
};
var flambe_platform_html_CanvasGraphics = function(canvas,alpha) {
	this._firstDraw = false;
	this._canvasCtx = canvas.getContext("2d",{ alpha : alpha});
};
$hxClasses["flambe.platform.html.CanvasGraphics"] = flambe_platform_html_CanvasGraphics;
flambe_platform_html_CanvasGraphics.__name__ = true;
flambe_platform_html_CanvasGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_html_CanvasGraphics.prototype = {
	save: function() {
		this._canvasCtx.save();
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		this._canvasCtx.transform(m00,m10,m01,m11,m02,m12);
	}
	,restore: function() {
		this._canvasCtx.restore();
	}
	,drawTexture: function(texture,destX,destY) {
		this.drawSubTexture(texture,destX,destY,0,0,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.drawSubTexture(texture,destX,destY,sourceX,sourceY,sourceW,sourceH);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var texture1 = texture;
		var root = texture1.root;
		root.assertNotDisposed();
		this._canvasCtx.drawImage(root.image,Std["int"](texture1.rootX + sourceX),Std["int"](texture1.rootY + sourceY),Std["int"](sourceW),Std["int"](sourceH),Std["int"](destX),Std["int"](destY),Std["int"](sourceW),Std["int"](sourceH));
	}
	,fillRect: function(color,x,y,width,height) {
		if(this._firstDraw) {
			this._firstDraw = false;
			this._canvasCtx.globalCompositeOperation = "copy";
			this.fillRect(color,x,y,width,height);
			this._canvasCtx.globalCompositeOperation = "source-over";
			return;
		}
		var hex = (16777215 & color).toString(16);
		while(hex.length < 6) hex = "0" + Std.string(hex);
		this._canvasCtx.fillStyle = "#" + Std.string(hex);
		this._canvasCtx.fillRect(Std["int"](x),Std["int"](y),Std["int"](width),Std["int"](height));
	}
	,multiplyAlpha: function(factor) {
		this._canvasCtx.globalAlpha *= factor;
	}
	,setBlendMode: function(blendMode) {
		var op;
		switch(Type.enumIndex(blendMode)) {
		case 0:
			op = "source-over";
			break;
		case 1:
			op = "lighter";
			break;
		case 2:
			op = "destination-in";
			break;
		case 3:
			op = "copy";
			break;
		}
		this._canvasCtx.globalCompositeOperation = op;
	}
	,applyScissor: function(x,y,width,height) {
		this._canvasCtx.beginPath();
		this._canvasCtx.rect(Std["int"](x),Std["int"](y),Std["int"](width),Std["int"](height));
		this._canvasCtx.clip();
	}
	,willRender: function() {
		this._firstDraw = true;
	}
	,didRender: function() {
	}
	,onResize: function(width,height) {
	}
	,setTint: function(r,g,b) {
	}
	,__class__: flambe_platform_html_CanvasGraphics
};
var flambe_platform_html_CanvasRenderer = function(canvas) {
	this.graphics = new flambe_platform_html_CanvasGraphics(canvas,false);
	this._hasGPU = new flambe_util_Value(true);
};
$hxClasses["flambe.platform.html.CanvasRenderer"] = flambe_platform_html_CanvasRenderer;
flambe_platform_html_CanvasRenderer.__name__ = true;
flambe_platform_html_CanvasRenderer.__interfaces__ = [flambe_platform_InternalRenderer];
flambe_platform_html_CanvasRenderer.prototype = {
	get_type: function() {
		return flambe_subsystem_RendererType.Canvas;
	}
	,createTextureFromImage: function(image) {
		var root = new flambe_platform_html_CanvasTextureRoot(flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES?flambe_platform_html_HtmlUtil.createCanvas(image):image);
		return root.createTexture(root.width,root.height);
	}
	,getCompressedTextureFormats: function() {
		return [];
	}
	,createCompressedTexture: function(format,data) {
		flambe_util_Assert.fail();
		return null;
	}
	,willRender: function() {
		this.graphics.willRender();
	}
	,didRender: function() {
		this.graphics.didRender();
	}
	,__class__: flambe_platform_html_CanvasRenderer
	,__properties__: {get_type:"get_type"}
};
var flambe_platform_html_CanvasTexture = function(root,width,height) {
	flambe_platform_BasicTexture.call(this,root,width,height);
};
$hxClasses["flambe.platform.html.CanvasTexture"] = flambe_platform_html_CanvasTexture;
flambe_platform_html_CanvasTexture.__name__ = true;
flambe_platform_html_CanvasTexture.__super__ = flambe_platform_BasicTexture;
flambe_platform_html_CanvasTexture.prototype = $extend(flambe_platform_BasicTexture.prototype,{
	__class__: flambe_platform_html_CanvasTexture
});
var flambe_platform_html_CanvasTextureRoot = function(image) {
	this._graphics = null;
	this.updateCount = 0;
	flambe_platform_BasicAsset.call(this);
	this.image = image;
	this.width = image.width;
	this.height = image.height;
};
$hxClasses["flambe.platform.html.CanvasTextureRoot"] = flambe_platform_html_CanvasTextureRoot;
flambe_platform_html_CanvasTextureRoot.__name__ = true;
flambe_platform_html_CanvasTextureRoot.__interfaces__ = [flambe_platform_TextureRoot];
flambe_platform_html_CanvasTextureRoot.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_CanvasTextureRoot.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	createTexture: function(width,height) {
		return new flambe_platform_html_CanvasTexture(this,width,height);
	}
	,dirtyContents: function() {
		++this.updateCount;
	}
	,copyFrom: function(that) {
		this.image = that.image;
		this._graphics = that._graphics;
		this.dirtyContents();
	}
	,onDisposed: function() {
		this.image = null;
		this._graphics = null;
	}
	,__class__: flambe_platform_html_CanvasTextureRoot
});
var flambe_platform_html_HtmlAssetPackLoader = function(platform,manifest) {
	flambe_platform_BasicAssetPackLoader.call(this,platform,manifest);
};
$hxClasses["flambe.platform.html.HtmlAssetPackLoader"] = flambe_platform_html_HtmlAssetPackLoader;
flambe_platform_html_HtmlAssetPackLoader.__name__ = true;
flambe_platform_html_HtmlAssetPackLoader.detectImageFormats = function(fn) {
	var formats = [flambe_asset_AssetFormat.PNG,flambe_asset_AssetFormat.JPG,flambe_asset_AssetFormat.GIF];
	var formatTests = 2;
	var checkRemaining = function() {
		--formatTests;
		if(formatTests == 0) fn(formats);
	};
	var webp;
	var _this = js_Browser.get_document();
	webp = _this.createElement("img");
	webp.onload = webp.onerror = function(_) {
		if(webp.width == 1) formats.unshift(flambe_asset_AssetFormat.WEBP);
		checkRemaining();
	};
	webp.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
	var jxr;
	var _this1 = js_Browser.get_document();
	jxr = _this1.createElement("img");
	jxr.onload = jxr.onerror = function(_1) {
		if(jxr.width == 1) formats.unshift(flambe_asset_AssetFormat.JXR);
		checkRemaining();
	};
	jxr.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2jckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA==";
};
flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats = function() {
	var audio;
	var _this = js_Browser.get_document();
	audio = _this.createElement("audio");
	if(audio == null || $bind(audio,audio.canPlayType) == null) {
		flambe_Log.warn("Audio is not supported at all in this browser!");
		return [];
	}
	var blacklist = new EReg("\\b(iPhone|iPod|iPad|Android|Windows Phone)\\b","");
	var userAgent = js_Browser.get_navigator().userAgent;
	if(!flambe_platform_html_WebAudioSound.get_supported() && blacklist.match(userAgent)) {
		flambe_Log.warn("HTML5 audio is blacklisted for this browser",["userAgent",userAgent]);
		return [];
	}
	var types = [{ format : flambe_asset_AssetFormat.M4A, mimeType : "audio/mp4; codecs=mp4a"},{ format : flambe_asset_AssetFormat.MP3, mimeType : "audio/mpeg"},{ format : flambe_asset_AssetFormat.OPUS, mimeType : "audio/ogg; codecs=opus"},{ format : flambe_asset_AssetFormat.OGG, mimeType : "audio/ogg; codecs=vorbis"},{ format : flambe_asset_AssetFormat.WAV, mimeType : "audio/wav"}];
	var result = [];
	var _g = 0;
	while(_g < types.length) {
		var type = types[_g];
		++_g;
		var canPlayType = "";
		try {
			canPlayType = audio.canPlayType(type.mimeType);
		} catch( _ ) {
		}
		if(canPlayType != "") result.push(type.format);
	}
	return result;
};
flambe_platform_html_HtmlAssetPackLoader.supportsBlob = function() {
	if(flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport) {
		flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = false;
		if(new EReg("\\bSilk\\b","").match(js_Browser.get_navigator().userAgent)) return false;
		if(js_Browser.get_window().Blob == null) return false;
		var xhr = new XMLHttpRequest();
		xhr.open("GET",".",true);
		if(xhr.responseType != "") return false;
		xhr.responseType = "blob";
		if(xhr.responseType != "blob") return false;
		flambe_platform_html_HtmlAssetPackLoader._URL = flambe_platform_html_HtmlUtil.loadExtension("URL").value;
	}
	return flambe_platform_html_HtmlAssetPackLoader._URL != null && flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL != null;
};
flambe_platform_html_HtmlAssetPackLoader.__super__ = flambe_platform_BasicAssetPackLoader;
flambe_platform_html_HtmlAssetPackLoader.prototype = $extend(flambe_platform_BasicAssetPackLoader.prototype,{
	loadEntry: function(url,entry) {
		var _g1 = this;
		var _g = entry.format;
		switch(Type.enumIndex(_g)) {
		case 0:case 1:case 2:case 3:case 4:
			var image;
			var _this = js_Browser.get_document();
			image = _this.createElement("img");
			var events = new flambe_platform_EventGroup();
			events.addDisposingListener(image,"load",function(_) {
				if(image.width > 1024 || image.height > 1024) flambe_Log.warn("Images larger than 1024px on a side will prevent GPU acceleration" + " on some platforms (iOS)",["url",url,"width",image.width,"height",image.height]);
				if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) flambe_platform_html_HtmlAssetPackLoader._URL.revokeObjectURL(image.src);
				var texture = _g1._platform.getRenderer().createTextureFromImage(image);
				if(texture != null) _g1.handleLoad(entry,texture); else _g1.handleTextureError(entry);
			});
			events.addDisposingListener(image,"error",function(_1) {
				_g1.handleError(entry,"Failed to load image");
			});
			if(flambe_platform_html_HtmlAssetPackLoader.supportsBlob()) this.downloadBlob(url,entry,function(blob) {
				image.src = flambe_platform_html_HtmlAssetPackLoader._URL.createObjectURL(blob);
			}); else image.src = url;
			break;
		case 5:case 6:case 7:
			this.downloadArrayBuffer(url,entry,function(buffer) {
				var texture1 = _g1._platform.getRenderer().createCompressedTexture(entry.format,null);
				if(texture1 != null) _g1.handleLoad(entry,texture1); else _g1.handleTextureError(entry);
			});
			break;
		case 8:case 9:case 10:case 11:case 12:
			if(flambe_platform_html_WebAudioSound.get_supported()) this.downloadArrayBuffer(url,entry,function(buffer1) {
				flambe_platform_html_WebAudioSound.ctx.decodeAudioData(buffer1,function(decoded) {
					_g1.handleLoad(entry,new flambe_platform_html_WebAudioSound(decoded));
				},function() {
					flambe_Log.warn("Couldn't decode Web Audio, ignoring this asset",["url",url]);
					_g1.handleLoad(entry,flambe_platform_DummySound.getInstance());
				});
			}); else {
				var audio;
				var _this1 = js_Browser.get_document();
				audio = _this1.createElement("audio");
				audio.preload = "auto";
				var ref = ++flambe_platform_html_HtmlAssetPackLoader._mediaRefCount;
				if(flambe_platform_html_HtmlAssetPackLoader._mediaElements == null) flambe_platform_html_HtmlAssetPackLoader._mediaElements = new haxe_ds_IntMap();
				flambe_platform_html_HtmlAssetPackLoader._mediaElements.set(ref,audio);
				var events1 = new flambe_platform_EventGroup();
				events1.addDisposingListener(audio,"canplaythrough",function(_2) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					_g1.handleLoad(entry,new flambe_platform_html_HtmlSound(audio));
				});
				events1.addDisposingListener(audio,"error",function(_3) {
					flambe_platform_html_HtmlAssetPackLoader._mediaElements.remove(ref);
					var code = audio.error.code;
					if(code == 3 || code == 4) {
						flambe_Log.warn("Couldn't decode HTML5 audio, ignoring this asset",["url",url,"code",code]);
						_g1.handleLoad(entry,flambe_platform_DummySound.getInstance());
					} else _g1.handleError(entry,"Failed to load audio: " + audio.error.code);
				});
				events1.addListener(audio,"progress",function(_4) {
					if(audio.buffered.length > 0 && audio.duration > 0) {
						var progress = audio.buffered.end(0) / audio.duration;
						_g1.handleProgress(entry,Std["int"](progress * entry.bytes));
					}
				});
				audio.src = url;
				audio.load();
			}
			break;
		case 13:
			this.downloadText(url,entry,function(text) {
				_g1.handleLoad(entry,new flambe_platform_BasicFile(text));
			});
			break;
		}
	}
	,getAssetFormats: function(fn) {
		var _g = this;
		if(flambe_platform_html_HtmlAssetPackLoader._supportedFormats == null) {
			flambe_platform_html_HtmlAssetPackLoader._supportedFormats = new flambe_util_Promise();
			flambe_platform_html_HtmlAssetPackLoader.detectImageFormats(function(imageFormats) {
				flambe_platform_html_HtmlAssetPackLoader._supportedFormats.set_result(_g._platform.getRenderer().getCompressedTextureFormats().concat(imageFormats).concat(flambe_platform_html_HtmlAssetPackLoader.detectAudioFormats()).concat([flambe_asset_AssetFormat.Data]));
			});
		}
		flambe_platform_html_HtmlAssetPackLoader._supportedFormats.get(fn);
	}
	,downloadArrayBuffer: function(url,entry,onLoad) {
		this.download(url,entry,"arraybuffer",onLoad);
	}
	,downloadBlob: function(url,entry,onLoad) {
		this.download(url,entry,"blob",onLoad);
	}
	,downloadText: function(url,entry,onLoad) {
		this.download(url,entry,"text",onLoad);
	}
	,download: function(url,entry,responseType,onLoad) {
		var _g = this;
		var xhr = null;
		var start = null;
		var intervalId = 0;
		var hasInterval = false;
		var clearRetryInterval = function() {
			if(hasInterval) {
				hasInterval = false;
				js_Browser.get_window().clearInterval(intervalId);
			}
		};
		var retries = 3;
		var maybeRetry = function() {
			--retries;
			if(retries >= 0) {
				flambe_Log.warn("Retrying asset download",["url",entry.url]);
				start();
				return true;
			}
			return false;
		};
		start = function() {
			clearRetryInterval();
			if(xhr != null) xhr.abort();
			xhr = new XMLHttpRequest();
			xhr.open("GET",url,true);
			xhr.responseType = responseType;
			var lastProgress = 0.0;
			xhr.onprogress = function(event) {
				if(!hasInterval) {
					hasInterval = true;
					intervalId = js_Browser.get_window().setInterval(function() {
						if(xhr.readyState != 4 && flambe_platform_html_HtmlUtil.now() - lastProgress > 5000) {
							if(!maybeRetry()) {
								clearRetryInterval();
								_g.handleError(entry,"Download stalled");
							}
						}
					},1000);
				}
				lastProgress = flambe_platform_html_HtmlUtil.now();
				_g.handleProgress(entry,event.loaded);
			};
			xhr.onerror = function(_) {
				if(xhr.status != 0 || !maybeRetry()) {
					clearRetryInterval();
					_g.handleError(entry,"HTTP error " + xhr.status);
				}
			};
			xhr.onload = function(_1) {
				var response = xhr.response;
				if(response == null) response = xhr.responseText;
				clearRetryInterval();
				onLoad(response);
			};
			xhr.send();
		};
		start();
	}
	,__class__: flambe_platform_html_HtmlAssetPackLoader
});
var flambe_platform_html_HtmlCatapultClient = function() {
	var _g = this;
	flambe_platform_CatapultClient.call(this);
	this._socket = new WebSocket("ws://" + js_Browser.get_location().host);
	this._socket.onerror = function(event) {
		_g.onError("unknown");
	};
	this._socket.onopen = function(event1) {
		flambe_Log.info("Catapult connected");
	};
	this._socket.onmessage = function(event2) {
		_g.onMessage(event2.data);
	};
};
$hxClasses["flambe.platform.html.HtmlCatapultClient"] = flambe_platform_html_HtmlCatapultClient;
flambe_platform_html_HtmlCatapultClient.__name__ = true;
flambe_platform_html_HtmlCatapultClient.canUse = function() {
	return Reflect.hasField(js_Browser.get_window(),"WebSocket");
};
flambe_platform_html_HtmlCatapultClient.__super__ = flambe_platform_CatapultClient;
flambe_platform_html_HtmlCatapultClient.prototype = $extend(flambe_platform_CatapultClient.prototype,{
	onRestart: function() {
		js_Browser.get_window().top.location.reload();
	}
	,__class__: flambe_platform_html_HtmlCatapultClient
});
var flambe_util_LogHandler = function() { };
$hxClasses["flambe.util.LogHandler"] = flambe_util_LogHandler;
flambe_util_LogHandler.__name__ = true;
flambe_util_LogHandler.prototype = {
	__class__: flambe_util_LogHandler
};
var flambe_platform_html_HtmlLogHandler = function(tag) {
	this._tagPrefix = tag + ": ";
};
$hxClasses["flambe.platform.html.HtmlLogHandler"] = flambe_platform_html_HtmlLogHandler;
flambe_platform_html_HtmlLogHandler.__name__ = true;
flambe_platform_html_HtmlLogHandler.__interfaces__ = [flambe_util_LogHandler];
flambe_platform_html_HtmlLogHandler.isSupported = function() {
	return typeof console == "object" && console.info != null;
};
flambe_platform_html_HtmlLogHandler.prototype = {
	log: function(level,message) {
		message = this._tagPrefix + message;
		switch(Type.enumIndex(level)) {
		case 0:
			console.info(message);
			break;
		case 1:
			console.warn(message);
			break;
		case 2:
			console.error(message);
			break;
		}
	}
	,__class__: flambe_platform_html_HtmlLogHandler
};
var flambe_platform_html_HtmlMouse = function(pointer,canvas) {
	flambe_platform_BasicMouse.call(this,pointer);
	this._canvas = canvas;
};
$hxClasses["flambe.platform.html.HtmlMouse"] = flambe_platform_html_HtmlMouse;
flambe_platform_html_HtmlMouse.__name__ = true;
flambe_platform_html_HtmlMouse.__super__ = flambe_platform_BasicMouse;
flambe_platform_html_HtmlMouse.prototype = $extend(flambe_platform_BasicMouse.prototype,{
	__class__: flambe_platform_html_HtmlMouse
});
var flambe_platform_html_HtmlSound = function(audioElement) {
	flambe_platform_BasicAsset.call(this);
	this.audioElement = audioElement;
};
$hxClasses["flambe.platform.html.HtmlSound"] = flambe_platform_html_HtmlSound;
flambe_platform_html_HtmlSound.__name__ = true;
flambe_platform_html_HtmlSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_HtmlSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_HtmlSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	copyFrom: function(that) {
		this.audioElement = that.audioElement;
	}
	,onDisposed: function() {
		this.audioElement = null;
	}
	,__class__: flambe_platform_html_HtmlSound
});
var flambe_subsystem_StageSystem = function() { };
$hxClasses["flambe.subsystem.StageSystem"] = flambe_subsystem_StageSystem;
flambe_subsystem_StageSystem.__name__ = true;
flambe_subsystem_StageSystem.prototype = {
	__class__: flambe_subsystem_StageSystem
};
var flambe_platform_html_HtmlStage = function(canvas) {
	var _g = this;
	this._canvas = canvas;
	this.resize = new flambe_util_Signal0();
	this.scaleFactor = flambe_platform_html_HtmlStage.computeScaleFactor();
	if(this.scaleFactor != 1) {
		flambe_Log.info("Reversing device DPI scaling",["scaleFactor",this.scaleFactor]);
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform-origin","top left");
		flambe_platform_html_HtmlUtil.setVendorStyle(this._canvas,"transform","scale(" + 1 / this.scaleFactor + ")");
	}
	if(flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER) {
		js_Browser.get_window().addEventListener("orientationchange",function(_) {
			flambe_platform_html_HtmlUtil.callLater($bind(_g,_g.hideMobileBrowser),200);
		},false);
		this.hideMobileBrowser();
	}
	js_Browser.get_window().addEventListener("resize",$bind(this,this.onWindowResize),false);
	this.onWindowResize(null);
	this.orientation = new flambe_util_Value(null);
	if(js_Browser.get_window().orientation != null) {
		js_Browser.get_window().addEventListener("orientationchange",$bind(this,this.onOrientationChange),false);
		this.onOrientationChange(null);
	}
	this.fullscreen = new flambe_util_Value(false);
	flambe_platform_html_HtmlUtil.addVendorListener(js_Browser.get_document(),"fullscreenchange",function(_1) {
		_g.updateFullscreen();
	},false);
	flambe_platform_html_HtmlUtil.addVendorListener(js_Browser.get_document(),"fullscreenerror",function(_2) {
		flambe_Log.warn("Error when requesting fullscreen");
	},false);
	this.updateFullscreen();
};
$hxClasses["flambe.platform.html.HtmlStage"] = flambe_platform_html_HtmlStage;
flambe_platform_html_HtmlStage.__name__ = true;
flambe_platform_html_HtmlStage.__interfaces__ = [flambe_subsystem_StageSystem];
flambe_platform_html_HtmlStage.computeScaleFactor = function() {
	var devicePixelRatio = js_Browser.get_window().devicePixelRatio;
	if(devicePixelRatio == null) devicePixelRatio = 1;
	var canvas;
	var _this = js_Browser.get_document();
	canvas = _this.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var backingStorePixelRatio = flambe_platform_html_HtmlUtil.loadExtension("backingStorePixelRatio",ctx).value;
	if(backingStorePixelRatio == null) backingStorePixelRatio = 1;
	var scale = devicePixelRatio / backingStorePixelRatio;
	var screenWidth = js_Browser.get_window().screen.width;
	var screenHeight = js_Browser.get_window().screen.height;
	if(scale * screenWidth > 1136 || scale * screenHeight > 1136) return 1;
	return scale;
};
flambe_platform_html_HtmlStage.prototype = {
	get_width: function() {
		return this._canvas.width;
	}
	,get_height: function() {
		return this._canvas.height;
	}
	,requestFullscreen: function(enable) {
		if(enable == null) enable = true;
		if(enable) {
			var documentElement = js_Browser.get_document().documentElement;
			var requestFullscreen = flambe_platform_html_HtmlUtil.loadFirstExtension(["requestFullscreen","requestFullScreen"],documentElement).value;
			if(requestFullscreen != null) Reflect.callMethod(documentElement,requestFullscreen,[]);
		} else {
			var cancelFullscreen = flambe_platform_html_HtmlUtil.loadFirstExtension(["cancelFullscreen","cancelFullScreen"],js_Browser.get_document()).value;
			if(cancelFullscreen != null) Reflect.callMethod(js_Browser.get_document(),cancelFullscreen,[]);
		}
	}
	,onWindowResize: function(_) {
		var container = this._canvas.parentElement;
		var rect = container.getBoundingClientRect();
		this.resizeCanvas(rect.width,rect.height);
	}
	,resizeCanvas: function(width,height) {
		var scaledWidth = this.scaleFactor * width;
		var scaledHeight = this.scaleFactor * height;
		if(this._canvas.width == scaledWidth && this._canvas.height == scaledHeight) return false;
		this._canvas.width = Std["int"](scaledWidth);
		this._canvas.height = Std["int"](scaledHeight);
		this.resize.emit();
		return true;
	}
	,hideMobileBrowser: function() {
		var _g = this;
		var mobileAddressBar = 100;
		var htmlStyle = js_Browser.get_document().documentElement.style;
		htmlStyle.height = js_Browser.get_window().innerHeight + mobileAddressBar + "px";
		htmlStyle.width = js_Browser.get_window().innerWidth + "px";
		htmlStyle.overflow = "visible";
		flambe_platform_html_HtmlUtil.callLater(function() {
			flambe_platform_html_HtmlUtil.hideMobileBrowser();
			flambe_platform_html_HtmlUtil.callLater(function() {
				htmlStyle.height = js_Browser.get_window().innerHeight + "px";
				_g.onWindowResize(null);
			},100);
		});
	}
	,onOrientationChange: function(_) {
		var value = flambe_platform_html_HtmlUtil.orientation(js_Browser.get_window().orientation);
		this.orientation.set__(value);
	}
	,updateFullscreen: function() {
		var state = flambe_platform_html_HtmlUtil.loadFirstExtension(["fullscreen","fullScreen","isFullScreen"],js_Browser.get_document()).value;
		this.fullscreen.set__(state == true);
	}
	,__class__: flambe_platform_html_HtmlStage
	,__properties__: {get_height:"get_height",get_width:"get_width"}
};
var flambe_platform_html_HtmlUtil = function() { };
$hxClasses["flambe.platform.html.HtmlUtil"] = flambe_platform_html_HtmlUtil;
flambe_platform_html_HtmlUtil.__name__ = true;
flambe_platform_html_HtmlUtil.callLater = function(func,delay) {
	if(delay == null) delay = 0;
	js_Browser.get_window().setTimeout(func,delay);
};
flambe_platform_html_HtmlUtil.hideMobileBrowser = function() {
	js_Browser.get_window().scrollTo(1,0);
};
flambe_platform_html_HtmlUtil.loadExtension = function(name,obj) {
	if(obj == null) obj = js_Browser.get_window();
	var extension = Reflect.field(obj,name);
	if(extension != null) return { prefix : "", field : name, value : extension};
	var capitalized = name.charAt(0).toUpperCase() + HxOverrides.substr(name,1,null);
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		var field = prefix + capitalized;
		var extension1 = Reflect.field(obj,field);
		if(extension1 != null) return { prefix : prefix, field : field, value : extension1};
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.loadFirstExtension = function(names,obj) {
	var _g = 0;
	while(_g < names.length) {
		var name = names[_g];
		++_g;
		var extension = flambe_platform_html_HtmlUtil.loadExtension(name,obj);
		if(extension.field != null) return extension;
	}
	return { prefix : null, field : null, value : null};
};
flambe_platform_html_HtmlUtil.polyfill = function(name,obj) {
	if(obj == null) obj = js_Browser.get_window();
	var value = flambe_platform_html_HtmlUtil.loadExtension(name,obj).value;
	if(value == null) return false;
	Reflect.setField(obj,name,value);
	return true;
};
flambe_platform_html_HtmlUtil.setVendorStyle = function(element,name,value) {
	var style = element.style;
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		style.setProperty("-" + prefix + "-" + name,value);
	}
	style.setProperty(name,value);
};
flambe_platform_html_HtmlUtil.addVendorListener = function(dispatcher,type,listener,useCapture) {
	var _g = 0;
	var _g1 = flambe_platform_html_HtmlUtil.VENDOR_PREFIXES;
	while(_g < _g1.length) {
		var prefix = _g1[_g];
		++_g;
		dispatcher.addEventListener(prefix + type,listener,useCapture);
	}
	dispatcher.addEventListener(type,listener,useCapture);
};
flambe_platform_html_HtmlUtil.orientation = function(angle) {
	switch(angle) {
	case -90:case 90:
		return flambe_display_Orientation.Landscape;
	default:
		return flambe_display_Orientation.Portrait;
	}
};
flambe_platform_html_HtmlUtil.now = function() {
	return Date.now();
};
flambe_platform_html_HtmlUtil.createEmptyCanvas = function(width,height) {
	var canvas;
	var _this = js_Browser.get_document();
	canvas = _this.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};
flambe_platform_html_HtmlUtil.createCanvas = function(source) {
	var canvas = flambe_platform_html_HtmlUtil.createEmptyCanvas(source.width,source.height);
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.globalCompositeOperation = "copy";
	ctx.drawImage(source,0,0);
	ctx.restore();
	return canvas;
};
flambe_platform_html_HtmlUtil.detectSlowDriver = function(gl) {
	var windows = js_Browser.get_navigator().platform.indexOf("Win") >= 0;
	if(windows) {
		var chrome = js_Browser.get_window().chrome != null;
		if(chrome) {
			var _g = 0;
			var _g1 = gl.getSupportedExtensions();
			while(_g < _g1.length) {
				var ext = _g1[_g];
				++_g;
				if(ext.indexOf("WEBGL_compressed_texture") >= 0) return false;
			}
			return true;
		}
	}
	return false;
};
flambe_platform_html_HtmlUtil.fixAndroidMath = function() {
	if(js_Browser.get_navigator().userAgent.indexOf("Linux; U; Android 4") >= 0) {
		flambe_Log.warn("Monkey patching around Android sin/cos bug");
		var sin = Math.sin;
		var cos = Math.cos;
		Math.sin = function(x) {
			if(x == 0) return 0; else return sin(x);
		};
		Math.cos = function(x1) {
			if(x1 == 0) return 1; else return cos(x1);
		};
	}
};
var flambe_platform_html_WebAudioSound = function(buffer) {
	flambe_platform_BasicAsset.call(this);
	this.buffer = buffer;
};
$hxClasses["flambe.platform.html.WebAudioSound"] = flambe_platform_html_WebAudioSound;
flambe_platform_html_WebAudioSound.__name__ = true;
flambe_platform_html_WebAudioSound.__interfaces__ = [flambe_sound_Sound];
flambe_platform_html_WebAudioSound.__properties__ = {get_supported:"get_supported"}
flambe_platform_html_WebAudioSound.get_supported = function() {
	if(flambe_platform_html_WebAudioSound._detectSupport) {
		flambe_platform_html_WebAudioSound._detectSupport = false;
		var AudioContext = flambe_platform_html_HtmlUtil.loadExtension("AudioContext").value;
		if(AudioContext != null) {
			flambe_platform_html_WebAudioSound.ctx = new AudioContext();
			flambe_platform_html_WebAudioSound.gain = flambe_platform_html_WebAudioSound.createGain();
			flambe_platform_html_WebAudioSound.gain.connect(flambe_platform_html_WebAudioSound.ctx.destination);
			flambe_System.volume.watch(function(volume,_) {
				flambe_platform_html_WebAudioSound.gain.gain.value = volume;
			});
		}
	}
	return flambe_platform_html_WebAudioSound.ctx != null;
};
flambe_platform_html_WebAudioSound.createGain = function() {
	if(flambe_platform_html_WebAudioSound.ctx.createGain != null) return flambe_platform_html_WebAudioSound.ctx.createGain(); else return flambe_platform_html_WebAudioSound.ctx.createGainNode();
};
flambe_platform_html_WebAudioSound.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_WebAudioSound.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	copyFrom: function(that) {
		this.buffer = that.buffer;
	}
	,onDisposed: function() {
		this.buffer = null;
	}
	,__class__: flambe_platform_html_WebAudioSound
});
var flambe_platform_html_WebGLBatcher = function(gl) {
	this._backbufferHeight = 0;
	this._backbufferWidth = 0;
	this._dataOffset = 0;
	this._maxQuads = 0;
	this._quads = 0;
	this._pendingSetScissor = false;
	this._currentRenderTarget = null;
	this._currentTexture = null;
	this._currentShader = null;
	this._currentBlendMode = null;
	this._lastScissor = null;
	this._lastTexture = null;
	this._lastShader = null;
	this._lastRenderTarget = null;
	this._lastBlendMode = null;
	this._gl = gl;
	gl.clearColor(0,0,0,0);
	gl.enable(3042);
	gl.pixelStorei(37441,1);
	this._vertexBuffer = gl.createBuffer();
	gl.bindBuffer(34962,this._vertexBuffer);
	this._quadIndexBuffer = gl.createBuffer();
	gl.bindBuffer(34963,this._quadIndexBuffer);
	this._drawTextureShader = new flambe_platform_shader_DrawTextureGL(gl);
	this._drawTextureWithTintShader = new flambe_platform_shader_DrawTextureWithTintGL(gl);
	this._drawPatternShader = new flambe_platform_shader_DrawPatternGL(gl);
	this._drawTintedPatternShader = new flambe_platform_shader_DrawTintedPatternGL(gl);
	this._fillRectShader = new flambe_platform_shader_FillRectGL(gl);
	this.resize(16);
};
$hxClasses["flambe.platform.html.WebGLBatcher"] = flambe_platform_html_WebGLBatcher;
flambe_platform_html_WebGLBatcher.__name__ = true;
flambe_platform_html_WebGLBatcher.prototype = {
	resizeBackbuffer: function(width,height) {
		this._gl.viewport(0,0,width,height);
		this._backbufferWidth = width;
		this._backbufferHeight = height;
	}
	,willRender: function() {
	}
	,didRender: function() {
		this.flush();
	}
	,bindTexture: function(texture) {
		this.flush();
		this._lastTexture = null;
		this._currentTexture = null;
		this._gl.bindTexture(3553,texture);
	}
	,deleteTexture: function(texture) {
		if(this._lastTexture != null && this._lastTexture.root == texture) {
			this.flush();
			this._lastTexture = null;
			this._currentTexture = null;
		}
		this._gl.deleteTexture(texture.nativeTexture);
	}
	,deleteFramebuffer: function(texture) {
		if(texture == this._lastRenderTarget) {
			this.flush();
			this._lastRenderTarget = null;
			this._currentRenderTarget = null;
		}
		this._gl.deleteFramebuffer(texture.framebuffer);
	}
	,prepareDrawTintedTexture: function(renderTarget,blendMode,scissor,texture) {
		if(texture != this._lastTexture) {
			this.flush();
			this._lastTexture = texture;
		}
		return this.prepareQuad(8,renderTarget,blendMode,scissor,this._drawTextureWithTintShader);
	}
	,prepareFillRect: function(renderTarget,blendMode,scissor) {
		return this.prepareQuad(6,renderTarget,blendMode,scissor,this._fillRectShader);
	}
	,prepareQuad: function(elementsPerVertex,renderTarget,blendMode,scissor,shader) {
		if(renderTarget != this._lastRenderTarget) {
			this.flush();
			this._lastRenderTarget = renderTarget;
		}
		if(blendMode != this._lastBlendMode) {
			this.flush();
			this._lastBlendMode = blendMode;
		}
		if(shader != this._lastShader) {
			this.flush();
			this._lastShader = shader;
		}
		if(scissor != null || this._lastScissor != null) {
			if(scissor == null || this._lastScissor == null || !this._lastScissor.equals(scissor)) {
				this.flush();
				if(scissor != null) this._lastScissor = scissor.clone(this._lastScissor); else this._lastScissor = null;
				this._pendingSetScissor = true;
			}
		}
		if(this._quads >= this._maxQuads) this.resize(this._maxQuads << 1);
		++this._quads;
		var offset = this._dataOffset;
		this._dataOffset += elementsPerVertex << 2;
		return offset;
	}
	,flush: function() {
		if(this._quads < 1) return;
		if(this._lastRenderTarget != this._currentRenderTarget) this.bindRenderTarget(this._lastRenderTarget);
		if(this._lastBlendMode != this._currentBlendMode) {
			var _g = this._lastBlendMode;
			switch(Type.enumIndex(_g)) {
			case 0:
				this._gl.blendFunc(1,771);
				break;
			case 1:
				this._gl.blendFunc(1,1);
				break;
			case 2:
				this._gl.blendFunc(0,770);
				break;
			case 3:
				this._gl.blendFunc(1,0);
				break;
			}
			this._currentBlendMode = this._lastBlendMode;
		}
		if(this._pendingSetScissor) {
			if(this._lastScissor != null) {
				this._gl.enable(3089);
				this._gl.scissor(Std["int"](this._lastScissor.x),Std["int"](this._lastScissor.y),Std["int"](this._lastScissor.width),Std["int"](this._lastScissor.height));
			} else this._gl.disable(3089);
			this._pendingSetScissor = false;
		}
		if(this._lastTexture != this._currentTexture) {
			this._gl.bindTexture(3553,this._lastTexture.root.nativeTexture);
			this._currentTexture = this._lastTexture;
		}
		if(this._lastShader != this._currentShader) {
			this._lastShader.useProgram();
			this._lastShader.prepare();
			this._currentShader = this._lastShader;
		}
		if(this._lastShader == this._drawPatternShader || this._lastShader == this._drawTintedPatternShader) {
			var texture = this._lastTexture;
			var root = texture.root;
			this._lastShader.setRegion(texture.rootX / root.width,texture.rootY / root.height,texture.get_width() / root.width,texture.get_height() / root.height);
		}
		this._gl.bufferData(34962,this.data.subarray(0,this._dataOffset),35040);
		this._gl.drawElements(4,6 * this._quads,5123,0);
		this._quads = 0;
		this._dataOffset = 0;
	}
	,resize: function(maxQuads) {
		this.flush();
		if(maxQuads > 1024) return;
		this._maxQuads = maxQuads;
		this.data = new Float32Array(maxQuads * 4 * 8);
		this._gl.bufferData(34962,this.data.length * 4,35040);
		var indices = new Uint16Array(6 * maxQuads);
		var _g = 0;
		while(_g < maxQuads) {
			var ii = _g++;
			indices[ii * 6 + 0] = ii * 4 + 0;
			indices[ii * 6 + 1] = ii * 4 + 1;
			indices[ii * 6 + 2] = ii * 4 + 2;
			indices[ii * 6 + 3] = ii * 4 + 2;
			indices[ii * 6 + 4] = ii * 4 + 3;
			indices[ii * 6 + 5] = ii * 4 + 0;
		}
		this._gl.bufferData(34963,indices,35044);
	}
	,bindRenderTarget: function(texture) {
		if(texture != null) {
			this._gl.bindFramebuffer(36160,texture.framebuffer);
			this._gl.viewport(0,0,texture.width,texture.height);
		} else {
			this._gl.bindFramebuffer(36160,null);
			this._gl.viewport(0,0,this._backbufferWidth,this._backbufferHeight);
		}
		this._currentRenderTarget = texture;
		this._lastRenderTarget = texture;
	}
	,__class__: flambe_platform_html_WebGLBatcher
};
var flambe_platform_html_WebGLGraphics = function(batcher,renderTarget) {
	this._stateList = null;
	this._inverseProjection = null;
	if(flambe_platform_html_WebGLGraphics._scratchQuadArray == null) flambe_platform_html_WebGLGraphics._scratchQuadArray = new Float32Array(8);
	this._batcher = batcher;
	this._renderTarget = renderTarget;
};
$hxClasses["flambe.platform.html.WebGLGraphics"] = flambe_platform_html_WebGLGraphics;
flambe_platform_html_WebGLGraphics.__name__ = true;
flambe_platform_html_WebGLGraphics.__interfaces__ = [flambe_platform_InternalGraphics];
flambe_platform_html_WebGLGraphics.prototype = {
	save: function() {
		var current = this._stateList;
		var state = this._stateList.next;
		if(state == null) {
			state = new flambe_platform_html__$WebGLGraphics_DrawingState();
			state.prev = current;
			current.next = state;
		}
		current.matrix.clone(state.matrix);
		state.alpha = current.alpha;
		state.tintR = current.tintR;
		state.tintG = current.tintG;
		state.tintB = current.tintB;
		state.blendMode = current.blendMode;
		if(current.scissor != null) state.scissor = current.scissor.clone(state.scissor); else state.scissor = null;
		this._stateList = state;
	}
	,transform: function(m00,m10,m01,m11,m02,m12) {
		var state = this.getTopState();
		flambe_platform_html_WebGLGraphics._scratchMatrix.set(m00,m10,m01,m11,m02,m12);
		flambe_math_Matrix.multiply(state.matrix,flambe_platform_html_WebGLGraphics._scratchMatrix,state.matrix);
	}
	,restore: function() {
		flambe_util_Assert.that(this._stateList.prev != null,"Can't restore without a previous save");
		this._stateList = this._stateList.prev;
	}
	,drawTexture: function(texture,x,y) {
		this.drawSubTexture(texture,x,y,0,0,texture.get_width(),texture.get_height());
	}
	,drawSubTexture: function(texture,destX,destY,sourceX,sourceY,sourceW,sourceH) {
		var state = this.getTopState();
		var texture1 = texture;
		var root = texture1.root;
		root.assertNotDisposed();
		var pos = this.transformQuad(destX,destY,sourceW,sourceH);
		var rootWidth = root.width;
		var rootHeight = root.height;
		var u1 = (texture1.rootX + sourceX) / rootWidth;
		var v1 = (texture1.rootY + sourceY) / rootHeight;
		var u2 = u1 + sourceW / rootWidth;
		var v2 = v1 + sourceH / rootHeight;
		var alpha = state.alpha;
		var tintR = state.tintR;
		var tintG = state.tintG;
		var tintB = state.tintB;
		var offset = this._batcher.prepareDrawTintedTexture(this._renderTarget,state.blendMode,state.scissor,texture1);
		var data = this._batcher.data;
		data[offset] = pos[0];
		data[++offset] = pos[1];
		data[++offset] = u1;
		data[++offset] = v1;
		data[++offset] = alpha;
		data[++offset] = tintR;
		data[++offset] = tintG;
		data[++offset] = tintB;
		data[++offset] = pos[2];
		data[++offset] = pos[3];
		data[++offset] = u2;
		data[++offset] = v1;
		data[++offset] = alpha;
		data[++offset] = tintR;
		data[++offset] = tintG;
		data[++offset] = tintB;
		data[++offset] = pos[4];
		data[++offset] = pos[5];
		data[++offset] = u2;
		data[++offset] = v2;
		data[++offset] = alpha;
		data[++offset] = tintR;
		data[++offset] = tintG;
		data[++offset] = tintB;
		data[++offset] = pos[6];
		data[++offset] = pos[7];
		data[++offset] = u1;
		data[++offset] = v2;
		data[++offset] = alpha;
		data[++offset] = tintR;
		data[++offset] = tintG;
		data[++offset] = tintB;
	}
	,fillRect: function(color,x,y,width,height) {
		var state = this.getTopState();
		var pos = this.transformQuad(x,y,width,height);
		var r = (color & 16711680) / 16711680;
		var g = (color & 65280) / 65280;
		var b = (color & 255) / 255;
		var a = state.alpha;
		var offset = this._batcher.prepareFillRect(this._renderTarget,state.blendMode,state.scissor);
		var data = this._batcher.data;
		data[offset] = pos[0];
		data[++offset] = pos[1];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[2];
		data[++offset] = pos[3];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[4];
		data[++offset] = pos[5];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
		data[++offset] = pos[6];
		data[++offset] = pos[7];
		data[++offset] = r;
		data[++offset] = g;
		data[++offset] = b;
		data[++offset] = a;
	}
	,multiplyAlpha: function(factor) {
		this.getTopState().alpha *= factor;
	}
	,setBlendMode: function(blendMode) {
		this.getTopState().blendMode = blendMode;
	}
	,setTint: function(r,g,b) {
		this.getTopState().tintR = r;
		this.getTopState().tintG = g;
		this.getTopState().tintB = b;
	}
	,applyScissor: function(x,y,width,height) {
		var state = this.getTopState();
		var rect = flambe_platform_html_WebGLGraphics._scratchQuadArray;
		rect[0] = x;
		rect[1] = y;
		rect[2] = x + width;
		rect[3] = y + height;
		state.matrix.transformArray(rect,4,rect);
		this._inverseProjection.transformArray(rect,4,rect);
		x = rect[0];
		y = rect[1];
		width = rect[2] - x;
		height = rect[3] - y;
		if(width < 0) {
			x += width;
			width = -width;
		}
		if(height < 0) {
			y += height;
			height = -height;
		}
		state.applyScissor(x,y,width,height);
	}
	,willRender: function() {
		this._batcher.willRender();
	}
	,didRender: function() {
		this._batcher.didRender();
	}
	,onResize: function(width,height) {
		this._stateList = new flambe_platform_html__$WebGLGraphics_DrawingState();
		var flip;
		if(this._renderTarget != null) flip = -1; else flip = 1;
		this._stateList.matrix.set(2 / width,0,0,flip * -2 / height,-1,flip);
		this._inverseProjection = new flambe_math_Matrix();
		this._inverseProjection.set(2 / width,0,0,2 / height,-1,-1);
		this._inverseProjection.invert();
	}
	,getTopState: function() {
		return this._stateList;
	}
	,transformQuad: function(x,y,width,height) {
		var x2 = x + width;
		var y2 = y + height;
		var pos = flambe_platform_html_WebGLGraphics._scratchQuadArray;
		pos[0] = x;
		pos[1] = y;
		pos[2] = x2;
		pos[3] = y;
		pos[4] = x2;
		pos[5] = y2;
		pos[6] = x;
		pos[7] = y2;
		this.getTopState().matrix.transformArray(pos,8,pos);
		return pos;
	}
	,__class__: flambe_platform_html_WebGLGraphics
};
var flambe_platform_html__$WebGLGraphics_DrawingState = function() {
	this.next = null;
	this.prev = null;
	this.scissor = null;
	this.matrix = new flambe_math_Matrix();
	this.alpha = 1;
	this.tintR = 1.0;
	this.tintG = 1.0;
	this.tintB = 1.0;
	this.blendMode = flambe_display_BlendMode.Normal;
};
$hxClasses["flambe.platform.html._WebGLGraphics.DrawingState"] = flambe_platform_html__$WebGLGraphics_DrawingState;
flambe_platform_html__$WebGLGraphics_DrawingState.__name__ = true;
flambe_platform_html__$WebGLGraphics_DrawingState.prototype = {
	applyScissor: function(x,y,width,height) {
		if(this.scissor != null) {
			var x1 = flambe_math_FMath.max(this.scissor.x,x);
			var y1 = flambe_math_FMath.max(this.scissor.y,y);
			var x2 = flambe_math_FMath.min(this.scissor.x + this.scissor.width,x + width);
			var y2 = flambe_math_FMath.min(this.scissor.y + this.scissor.height,y + height);
			x = x1;
			y = y1;
			width = x2 - x1;
			height = y2 - y1;
		} else this.scissor = new flambe_math_Rectangle();
		this.scissor.set(Math.round(x),Math.round(y),Math.round(width),Math.round(height));
	}
	,__class__: flambe_platform_html__$WebGLGraphics_DrawingState
};
var flambe_platform_html_WebGLRenderer = function(stage,gl) {
	var _g = this;
	this._hasGPU = new flambe_util_Value(true);
	this.gl = gl;
	gl.canvas.addEventListener("webglcontextlost",function(event) {
		event.preventDefault();
		flambe_Log.warn("WebGL context lost");
		_g._hasGPU.set__(false);
	},false);
	gl.canvas.addEventListener("webglcontextrestore",function(event1) {
		flambe_Log.warn("WebGL context restored");
		_g.init();
		_g._hasGPU.set__(true);
	},false);
	stage.resize.connect($bind(this,this.onResize));
	this.init();
};
$hxClasses["flambe.platform.html.WebGLRenderer"] = flambe_platform_html_WebGLRenderer;
flambe_platform_html_WebGLRenderer.__name__ = true;
flambe_platform_html_WebGLRenderer.__interfaces__ = [flambe_platform_InternalRenderer];
flambe_platform_html_WebGLRenderer.prototype = {
	get_type: function() {
		return flambe_subsystem_RendererType.WebGL;
	}
	,createTextureFromImage: function(image) {
		if(this.gl.isContextLost()) return null;
		var root = new flambe_platform_html_WebGLTextureRoot(this,image.width,image.height);
		root.uploadImageData(image);
		return root.createTexture(image.width,image.height);
	}
	,getCompressedTextureFormats: function() {
		return [];
	}
	,createCompressedTexture: function(format,data) {
		if(this.gl.isContextLost()) return null;
		flambe_util_Assert.fail();
		return null;
	}
	,willRender: function() {
		this.graphics.willRender();
	}
	,didRender: function() {
		this.graphics.didRender();
	}
	,onResize: function() {
		var width = this.gl.canvas.width;
		var height = this.gl.canvas.height;
		this.batcher.resizeBackbuffer(width,height);
		this.graphics.onResize(width,height);
	}
	,init: function() {
		this.batcher = new flambe_platform_html_WebGLBatcher(this.gl);
		this.graphics = new flambe_platform_html_WebGLGraphics(this.batcher,null);
		this.onResize();
	}
	,__class__: flambe_platform_html_WebGLRenderer
	,__properties__: {get_type:"get_type"}
};
var flambe_platform_html_WebGLTexture = function(root,width,height) {
	flambe_platform_BasicTexture.call(this,root,width,height);
};
$hxClasses["flambe.platform.html.WebGLTexture"] = flambe_platform_html_WebGLTexture;
flambe_platform_html_WebGLTexture.__name__ = true;
flambe_platform_html_WebGLTexture.__super__ = flambe_platform_BasicTexture;
flambe_platform_html_WebGLTexture.prototype = $extend(flambe_platform_BasicTexture.prototype,{
	__class__: flambe_platform_html_WebGLTexture
});
var flambe_platform_html_WebGLTextureRoot = function(renderer,width,height) {
	this._graphics = null;
	this.framebuffer = null;
	flambe_platform_BasicAsset.call(this);
	this._renderer = renderer;
	this.width = flambe_math_FMath.max(2,flambe_platform_MathUtil.nextPowerOfTwo(width));
	this.height = flambe_math_FMath.max(2,flambe_platform_MathUtil.nextPowerOfTwo(height));
	var gl = renderer.gl;
	this.nativeTexture = gl.createTexture();
	renderer.batcher.bindTexture(this.nativeTexture);
	gl.texParameteri(3553,10242,33071);
	gl.texParameteri(3553,10243,33071);
	gl.texParameteri(3553,10240,9729);
	gl.texParameteri(3553,10241,9728);
};
$hxClasses["flambe.platform.html.WebGLTextureRoot"] = flambe_platform_html_WebGLTextureRoot;
flambe_platform_html_WebGLTextureRoot.__name__ = true;
flambe_platform_html_WebGLTextureRoot.__interfaces__ = [flambe_platform_TextureRoot];
flambe_platform_html_WebGLTextureRoot.drawBorder = function(canvas,width,height) {
	var ctx = canvas.getContext("2d");
	ctx.drawImage(canvas,width - 1,0,1,height,width,0,1,height);
	ctx.drawImage(canvas,0,height - 1,width,1,0,height,width,1);
};
flambe_platform_html_WebGLTextureRoot.__super__ = flambe_platform_BasicAsset;
flambe_platform_html_WebGLTextureRoot.prototype = $extend(flambe_platform_BasicAsset.prototype,{
	createTexture: function(width,height) {
		return new flambe_platform_html_WebGLTexture(this,width,height);
	}
	,uploadImageData: function(image) {
		this.assertNotDisposed();
		if(this.width != image.width || this.height != image.height) {
			var resized = flambe_platform_html_HtmlUtil.createEmptyCanvas(this.width,this.height);
			resized.getContext("2d").drawImage(image,0,0);
			flambe_platform_html_WebGLTextureRoot.drawBorder(resized,image.width,image.height);
			image = resized;
		}
		this._renderer.batcher.bindTexture(this.nativeTexture);
		var gl = this._renderer.gl;
		gl.texImage2D(3553,0,6408,6408,5121,image);
	}
	,copyFrom: function(that) {
		this.nativeTexture = that.nativeTexture;
		this.framebuffer = that.framebuffer;
		this.width = that.width;
		this.height = that.height;
		this._graphics = that._graphics;
	}
	,onDisposed: function() {
		var batcher = this._renderer.batcher;
		batcher.deleteTexture(this);
		if(this.framebuffer != null) batcher.deleteFramebuffer(this);
		this.nativeTexture = null;
		this.framebuffer = null;
		this._graphics = null;
	}
	,__class__: flambe_platform_html_WebGLTextureRoot
});
var flambe_platform_shader_ShaderGL = function(gl,vertSource,fragSource) {
	fragSource = ["#ifdef GL_ES","precision mediump float;","#endif"].join("\n") + "\n" + fragSource;
	this._gl = gl;
	this._program = gl.createProgram();
	gl.attachShader(this._program,flambe_platform_shader_ShaderGL.createShader(gl,35633,vertSource));
	gl.attachShader(this._program,flambe_platform_shader_ShaderGL.createShader(gl,35632,fragSource));
	gl.linkProgram(this._program);
	gl.useProgram(this._program);
	if(!gl.getProgramParameter(this._program,35714)) flambe_Log.error("Error linking shader program",["log",gl.getProgramInfoLog(this._program)]);
};
$hxClasses["flambe.platform.shader.ShaderGL"] = flambe_platform_shader_ShaderGL;
flambe_platform_shader_ShaderGL.__name__ = true;
flambe_platform_shader_ShaderGL.createShader = function(gl,type,source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader,35713)) {
		var typeName;
		if(type == 35633) typeName = "vertex"; else typeName = "fragment";
		flambe_Log.error("Error compiling " + typeName + " shader",["log",gl.getShaderInfoLog(shader)]);
	}
	return shader;
};
flambe_platform_shader_ShaderGL.prototype = {
	useProgram: function() {
		this._gl.useProgram(this._program);
	}
	,prepare: function() {
		flambe_util_Assert.fail("abstract");
	}
	,getAttribLocation: function(name) {
		var loc = this._gl.getAttribLocation(this._program,name);
		flambe_util_Assert.that(loc >= 0,"Missing attribute",["name",name]);
		return loc;
	}
	,getUniformLocation: function(name) {
		var loc = this._gl.getUniformLocation(this._program,name);
		flambe_util_Assert.that(loc != null,"Missing uniform",["name",name]);
		return loc;
	}
	,__class__: flambe_platform_shader_ShaderGL
};
var flambe_platform_shader_DrawPatternGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","uniform lowp sampler2D u_texture;","uniform mediump vec4 u_region;","void main (void) {","gl_FragColor = texture2D(u_texture, u_region.xy + mod(v_uv, u_region.zw)) * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.u_texture = this.getUniformLocation("u_texture");
	this.u_region = this.getUniformLocation("u_region");
	this.setTexture(0);
};
$hxClasses["flambe.platform.shader.DrawPatternGL"] = flambe_platform_shader_DrawPatternGL;
flambe_platform_shader_DrawPatternGL.__name__ = true;
flambe_platform_shader_DrawPatternGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawPatternGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 5 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,4 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_DrawPatternGL
});
var flambe_platform_shader_DrawTintedPatternGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","attribute lowp vec3 a_tint;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","varying lowp vec3 v_tint;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","v_tint = a_tint;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","varying lowp vec3 v_tint;","uniform lowp sampler2D u_texture;","uniform mediump vec4 u_region;","void main (void) {","vec4 temp = texture2D(u_texture, u_region.xy + mod(v_uv, u_region.zw));","temp.xyz *= v_tint;","gl_FragColor = temp * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.a_tint = this.getAttribLocation("a_tint");
	this.u_texture = this.getUniformLocation("u_texture");
	this.u_region = this.getUniformLocation("u_region");
	this.setTexture(0);
};
$hxClasses["flambe.platform.shader.DrawTintedPatternGL"] = flambe_platform_shader_DrawTintedPatternGL;
flambe_platform_shader_DrawTintedPatternGL.__name__ = true;
flambe_platform_shader_DrawTintedPatternGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawTintedPatternGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,setRegion: function(x,y,width,height) {
		this._gl.uniform4f(this.u_region,x,y,width,height);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		this._gl.enableVertexAttribArray(this.a_tint);
		var bytesPerFloat = 4;
		var stride = bytesPerFloat << 3;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,bytesPerFloat * 2);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,bytesPerFloat * 4);
		this._gl.vertexAttribPointer(this.a_tint,3,5126,false,stride,bytesPerFloat * 5);
	}
	,__class__: flambe_platform_shader_DrawTintedPatternGL
});
var flambe_platform_shader_DrawTextureGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","uniform lowp sampler2D u_texture;","void main (void) {","gl_FragColor = texture2D(u_texture, v_uv) * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.u_texture = this.getUniformLocation("u_texture");
	this.setTexture(0);
};
$hxClasses["flambe.platform.shader.DrawTextureGL"] = flambe_platform_shader_DrawTextureGL;
flambe_platform_shader_DrawTextureGL.__name__ = true;
flambe_platform_shader_DrawTextureGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawTextureGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 5 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,4 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_DrawTextureGL
});
var flambe_platform_shader_DrawTextureWithTintGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute mediump vec2 a_uv;","attribute lowp float a_alpha;","attribute lowp vec3 a_tint;","varying mediump vec2 v_uv;","varying lowp float v_alpha;","varying lowp vec3 v_tint;","void main (void) {","v_uv = a_uv;","v_alpha = a_alpha;","v_tint = a_tint;","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying mediump vec2 v_uv;","varying lowp float v_alpha;","varying lowp vec3 v_tint;","uniform lowp sampler2D u_texture;","void main (void) {","vec4 temp = texture2D(u_texture, v_uv);","temp.xyz *= v_tint;","gl_FragColor = temp * v_alpha;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_uv = this.getAttribLocation("a_uv");
	this.a_alpha = this.getAttribLocation("a_alpha");
	this.a_tint = this.getAttribLocation("a_tint");
	this.u_texture = this.getUniformLocation("u_texture");
	this.setTexture(0);
};
$hxClasses["flambe.platform.shader.DrawTextureWithTintGL"] = flambe_platform_shader_DrawTextureWithTintGL;
flambe_platform_shader_DrawTextureWithTintGL.__name__ = true;
flambe_platform_shader_DrawTextureWithTintGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_DrawTextureWithTintGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	setTexture: function(unit) {
		this._gl.uniform1i(this.u_texture,unit);
	}
	,prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_uv);
		this._gl.enableVertexAttribArray(this.a_alpha);
		this._gl.enableVertexAttribArray(this.a_tint);
		var bytesPerFloat = 4;
		var stride = bytesPerFloat << 3;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_uv,2,5126,false,stride,bytesPerFloat * 2);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,bytesPerFloat * 4);
		this._gl.vertexAttribPointer(this.a_tint,3,5126,false,stride,bytesPerFloat * 5);
	}
	,__class__: flambe_platform_shader_DrawTextureWithTintGL
});
var flambe_platform_shader_FillRectGL = function(gl) {
	flambe_platform_shader_ShaderGL.call(this,gl,["attribute highp vec2 a_pos;","attribute lowp vec3 a_rgb;","attribute lowp float a_alpha;","varying lowp vec4 v_color;","void main (void) {","v_color = vec4(a_rgb*a_alpha, a_alpha);","gl_Position = vec4(a_pos, 0, 1);","}"].join("\n"),["varying lowp vec4 v_color;","void main (void) {","gl_FragColor = v_color;","}"].join("\n"));
	this.a_pos = this.getAttribLocation("a_pos");
	this.a_rgb = this.getAttribLocation("a_rgb");
	this.a_alpha = this.getAttribLocation("a_alpha");
};
$hxClasses["flambe.platform.shader.FillRectGL"] = flambe_platform_shader_FillRectGL;
flambe_platform_shader_FillRectGL.__name__ = true;
flambe_platform_shader_FillRectGL.__super__ = flambe_platform_shader_ShaderGL;
flambe_platform_shader_FillRectGL.prototype = $extend(flambe_platform_shader_ShaderGL.prototype,{
	prepare: function() {
		this._gl.enableVertexAttribArray(this.a_pos);
		this._gl.enableVertexAttribArray(this.a_rgb);
		this._gl.enableVertexAttribArray(this.a_alpha);
		var bytesPerFloat = 4;
		var stride = 6 * bytesPerFloat;
		this._gl.vertexAttribPointer(this.a_pos,2,5126,false,stride,0 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_rgb,3,5126,false,stride,2 * bytesPerFloat);
		this._gl.vertexAttribPointer(this.a_alpha,1,5126,false,stride,5 * bytesPerFloat);
	}
	,__class__: flambe_platform_shader_FillRectGL
});
var flambe_scene_Director = function() {
	this._transitor = null;
};
$hxClasses["flambe.scene.Director"] = flambe_scene_Director;
flambe_scene_Director.__name__ = true;
flambe_scene_Director.__super__ = flambe_Component;
flambe_scene_Director.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Director_8";
	}
	,onAdded: function() {
		this.owner.addChild(this._root);
	}
	,onRemoved: function() {
		this.completeTransition();
		var _g = 0;
		var _g1 = this.scenes;
		while(_g < _g1.length) {
			var scene = _g1[_g];
			++_g;
			scene.dispose();
		}
		this.scenes = [];
		this.occludedScenes = [];
		this._root.dispose();
	}
	,onUpdate: function(dt) {
		if(this._transitor != null && this._transitor.update(dt)) this.completeTransition();
	}
	,get_topScene: function() {
		var ll = this.scenes.length;
		if(ll > 0) return this.scenes[ll - 1]; else return null;
	}
	,show: function(scene) {
		var events = scene.getComponent("Scene_9");
		if(events != null) events.shown.emit();
	}
	,invalidateVisibility: function() {
		var ii = this.scenes.length;
		while(ii > 0) {
			var scene = this.scenes[--ii];
			var comp = scene.getComponent("Scene_9");
			if(comp == null || comp.opaque) break;
		}
		if(this.scenes.length > 0) this.occludedScenes = this.scenes.slice(ii,this.scenes.length - 1); else this.occludedScenes = [];
		var scene1 = this.get_topScene();
		if(scene1 != null) this.show(scene1);
	}
	,completeTransition: function() {
		if(this._transitor != null) {
			this._transitor.complete();
			this._transitor = null;
			this.invalidateVisibility();
		}
	}
	,__class__: flambe_scene_Director
	,__properties__: $extend(flambe_Component.prototype.__properties__,{get_topScene:"get_topScene"})
});
var flambe_scene__$Director_Transitor = function() { };
$hxClasses["flambe.scene._Director.Transitor"] = flambe_scene__$Director_Transitor;
flambe_scene__$Director_Transitor.__name__ = true;
flambe_scene__$Director_Transitor.prototype = {
	update: function(dt) {
		return this._transition.update(dt);
	}
	,complete: function() {
		this._transition.complete();
		this._onComplete();
	}
	,__class__: flambe_scene__$Director_Transitor
};
var flambe_scene_Scene = function() { };
$hxClasses["flambe.scene.Scene"] = flambe_scene_Scene;
flambe_scene_Scene.__name__ = true;
flambe_scene_Scene.__super__ = flambe_Component;
flambe_scene_Scene.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "Scene_9";
	}
	,__class__: flambe_scene_Scene
});
var flambe_scene_Transition = function() { };
$hxClasses["flambe.scene.Transition"] = flambe_scene_Transition;
flambe_scene_Transition.__name__ = true;
flambe_scene_Transition.prototype = {
	update: function(dt) {
		return true;
	}
	,complete: function() {
	}
	,__class__: flambe_scene_Transition
};
var flambe_subsystem_RendererType = $hxClasses["flambe.subsystem.RendererType"] = { __ename__ : true, __constructs__ : ["Stage3D","WebGL","Canvas"] };
flambe_subsystem_RendererType.Stage3D = ["Stage3D",0];
flambe_subsystem_RendererType.Stage3D.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.WebGL = ["WebGL",1];
flambe_subsystem_RendererType.WebGL.__enum__ = flambe_subsystem_RendererType;
flambe_subsystem_RendererType.Canvas = ["Canvas",2];
flambe_subsystem_RendererType.Canvas.__enum__ = flambe_subsystem_RendererType;
var flambe_util_Assert = function() { };
$hxClasses["flambe.util.Assert"] = flambe_util_Assert;
flambe_util_Assert.__name__ = true;
flambe_util_Assert.that = function(condition,message,fields) {
	if(!condition) flambe_util_Assert.fail(message,fields);
};
flambe_util_Assert.fail = function(message,fields) {
	var error = "Assertion failed!";
	if(message != null) error += " " + message;
	if(fields != null) error = flambe_util_Strings.withFields(error,fields);
	throw error;
};
var flambe_util_BitSets = function() { };
$hxClasses["flambe.util.BitSets"] = flambe_util_BitSets;
flambe_util_BitSets.__name__ = true;
flambe_util_BitSets.add = function(bits,mask) {
	return bits | mask;
};
flambe_util_BitSets.remove = function(bits,mask) {
	return bits & ~mask;
};
flambe_util_BitSets.contains = function(bits,mask) {
	return (bits & mask) != 0;
};
flambe_util_BitSets.containsAll = function(bits,mask) {
	return (bits & mask) == mask;
};
flambe_util_BitSets.set = function(bits,mask,enabled) {
	if(enabled) return flambe_util_BitSets.add(bits,mask); else return flambe_util_BitSets.remove(bits,mask);
};
var flambe_util_LogLevel = $hxClasses["flambe.util.LogLevel"] = { __ename__ : true, __constructs__ : ["Info","Warn","Error"] };
flambe_util_LogLevel.Info = ["Info",0];
flambe_util_LogLevel.Info.__enum__ = flambe_util_LogLevel;
flambe_util_LogLevel.Warn = ["Warn",1];
flambe_util_LogLevel.Warn.__enum__ = flambe_util_LogLevel;
flambe_util_LogLevel.Error = ["Error",2];
flambe_util_LogLevel.Error.__enum__ = flambe_util_LogLevel;
var flambe_util_Promise = function() {
	this.success = new flambe_util_Signal1();
	this.error = new flambe_util_Signal1();
	this.progressChanged = new flambe_util_Signal0();
	this.hasResult = false;
	this._progress = 0;
	this._total = 0;
};
$hxClasses["flambe.util.Promise"] = flambe_util_Promise;
flambe_util_Promise.__name__ = true;
flambe_util_Promise.prototype = {
	set_result: function(result) {
		if(this.hasResult) throw "Promise result already assigned";
		this._result = result;
		this.hasResult = true;
		this.success.emit(result);
		return result;
	}
	,get: function(fn) {
		if(this.hasResult) {
			fn(this._result);
			return null;
		}
		return this.success.connect(fn).once();
	}
	,get_progress: function() {
		return this._progress;
	}
	,set_progress: function(progress) {
		if(this._progress != progress) {
			this._progress = progress;
			this.progressChanged.emit();
		}
		return progress;
	}
	,set_total: function(total) {
		if(this._total != total) {
			this._total = total;
			this.progressChanged.emit();
		}
		return total;
	}
	,get_total: function() {
		return this._total;
	}
	,__class__: flambe_util_Promise
	,__properties__: {get_total:"get_total",set_total:"set_total",set_progress:"set_progress",get_progress:"get_progress",set_result:"set_result"}
};
var flambe_util_Signal0 = function(listener) {
	flambe_util_SignalBase.call(this,listener);
};
$hxClasses["flambe.util.Signal0"] = flambe_util_Signal0;
flambe_util_Signal0.__name__ = true;
flambe_util_Signal0.__super__ = flambe_util_SignalBase;
flambe_util_Signal0.prototype = $extend(flambe_util_SignalBase.prototype,{
	connect: function(listener,prioritize) {
		if(prioritize == null) prioritize = false;
		return this.connectImpl(listener,prioritize);
	}
	,emit: function() {
		var _g = this;
		if(this.dispatching()) this.defer(function() {
			_g.emitImpl();
		}); else this.emitImpl();
	}
	,emitImpl: function() {
		var head = this.willEmit();
		var p = head;
		while(p != null) {
			p._listener();
			if(!p.stayInList) p.dispose();
			p = p._next;
		}
		this.didEmit(head);
	}
	,__class__: flambe_util_Signal0
});
var flambe_util__$SignalBase_Task = function(fn) {
	this.next = null;
	this.fn = fn;
};
$hxClasses["flambe.util._SignalBase.Task"] = flambe_util__$SignalBase_Task;
flambe_util__$SignalBase_Task.__name__ = true;
flambe_util__$SignalBase_Task.prototype = {
	__class__: flambe_util__$SignalBase_Task
};
var flambe_util_Strings = function() { };
$hxClasses["flambe.util.Strings"] = flambe_util_Strings;
flambe_util_Strings.__name__ = true;
flambe_util_Strings.getFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,dot + 1,null); else return null;
};
flambe_util_Strings.removeFileExtension = function(fileName) {
	var dot = fileName.lastIndexOf(".");
	if(dot > 0) return HxOverrides.substr(fileName,0,dot); else return fileName;
};
flambe_util_Strings.getUrlExtension = function(url) {
	var question = url.lastIndexOf("?");
	if(question >= 0) url = HxOverrides.substr(url,0,question);
	var slash = url.lastIndexOf("/");
	if(slash >= 0) url = HxOverrides.substr(url,slash + 1,null);
	return flambe_util_Strings.getFileExtension(url);
};
flambe_util_Strings.joinPath = function(base,relative) {
	if(base.length > 0 && StringTools.fastCodeAt(base,base.length - 1) != 47) base += "/";
	return base + relative;
};
flambe_util_Strings.withFields = function(message,fields) {
	var ll = fields.length;
	if(ll > 0) {
		if(message.length > 0) message += " ["; else message += "[";
		var ii = 0;
		while(ii < ll) {
			if(ii > 0) message += ", ";
			var name = fields[ii];
			var value = fields[ii + 1];
			if(Std["is"](value,Error)) {
				var stack = value.stack;
				if(stack != null) value = stack;
			}
			message += name + "=" + Std.string(value);
			ii += 2;
		}
		message += "]";
	}
	return message;
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = true;
haxe_ds_ObjectMap.__interfaces__ = [IMap];
haxe_ds_ObjectMap.assignId = function(obj) {
	return obj.__id__ = ++haxe_ds_ObjectMap.count;
};
haxe_ds_ObjectMap.getId = function(obj) {
	return obj.__id__;
};
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || haxe_ds_ObjectMap.assignId(key);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[haxe_ds_ObjectMap.getId(key)];
	}
	,exists: function(key) {
		return this.h.__keys__[haxe_ds_ObjectMap.getId(key)] != null;
	}
	,remove: function(key) {
		var id = haxe_ds_ObjectMap.getId(key);
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function() { };
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = true;
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_rtti_Meta = function() { };
$hxClasses["haxe.rtti.Meta"] = haxe_rtti_Meta;
haxe_rtti_Meta.__name__ = true;
haxe_rtti_Meta.getType = function(t) {
	var meta = t.__meta__;
	if(meta == null || meta.obj == null) return { }; else return meta.obj;
};
var haxe_xml_Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe_xml_Parser;
haxe_xml_Parser.__name__ = true;
haxe_xml_Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe_xml_Parser.doParse(str,0,doc);
	return doc;
};
haxe_xml_Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = StringTools.fastCodeAt(str,p);
	var buf = new StringBuf();
	while(!StringTools.isEof(c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.toString() + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && StringTools.fastCodeAt(str,p + 1) == 93 && StringTools.fastCodeAt(str,p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(StringTools.fastCodeAt(str,p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(StringTools.fastCodeAt(str,p + 1) == 68 || StringTools.fastCodeAt(str,p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(StringTools.fastCodeAt(str,p + 1) != 45 || StringTools.fastCodeAt(str,p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!haxe_xml_Parser.isValidChar(c)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!haxe_xml_Parser.isValidChar(c)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == StringTools.fastCodeAt(str,start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe_xml_Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!haxe_xml_Parser.isValidChar(c)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && StringTools.fastCodeAt(str,p + 1) == 45 && StringTools.fastCodeAt(str,p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && StringTools.fastCodeAt(str,p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(StringTools.fastCodeAt(s,0) == 35) {
					var i;
					if(StringTools.fastCodeAt(s,1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe_xml_Parser.escapes.exists(s)) buf.add("&" + s + ";"); else buf.add(haxe_xml_Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.toString() + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
haxe_xml_Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
};
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = true;
js_Boot.isClass = function(o) {
	return o.__name__;
};
js_Boot.isEnum = function(e) {
	return e.__ename__;
};
js_Boot.getClass = function(o) {
	if(Std["is"](o,Array)) return Array; else return o.__class__;
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (js_Boot.isClass(o) || js_Boot.isEnum(o))) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js_Boot.__string_rec(o[i],s); else str += js_Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
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
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
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
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
var js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = true;
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
var webaudio_Main = function() {
	console.log("MonoSynth");
	this.keyboardNotes = new webaudio_utils_KeyboardNotes(1);
	this.keyboardInputs = new webaudio_utils_KeyboardInput(this.keyboardNotes);
};
$hxClasses["webaudio.Main"] = webaudio_Main;
webaudio_Main.__name__ = true;
webaudio_Main.main = function() {
	flambe_System.init();
	var noAudio = js_Browser.get_document().getElementById("noWebAudio");
	if(flambe_platform_html_WebAudioSound.get_supported()) {
		noAudio.parentNode.removeChild(noAudio);
		webaudio_Main.audioContext = flambe_platform_html_WebAudioSound.ctx;
		webaudio_Main.instance = new webaudio_Main();
		webaudio_PreloadMain.init("bootstrap",($_=webaudio_Main.instance,$bind($_,$_.assetsReady)),5925240);
	} else {
		noAudio.className = "";
		throw "Could not create AudioContext. Sorry, but it looks like your browser does not support the Web-Audio APIs ;(";
	}
};
webaudio_Main.prototype = {
	assetsReady: function(pack) {
		webaudio_synth_ui_Fonts.setup(pack);
		this.stageWidth = flambe_System.get_stage().get_width();
		this.stageHeight = flambe_System.get_stage().get_height();
		this.setupFlambe(pack);
		this.monoSynthUI = new webaudio_synth_ui_MonoSynthUI(this.textureAtlas,this.keyboardNotes);
		this.scene.addChild(new flambe_Entity().add(this.monoSynthUI));
		this.monoSynth = new webaudio_synth_MonoSynth(webaudio_Main.audioContext.destination,this.keyboardNotes.noteFreq);
		this.initControl();
	}
	,setupFlambe: function(pack) {
		var xml = Xml.parse(pack.getFile("sprites.xml").toString());
		var texture = pack.getTexture("sprites");
		this.textureAtlas = flambe_display_StarlingSpriteSheet.parse(xml,texture);
		flambe_System.root.addChild(this.scene = new flambe_Entity());
		flambe_System.root.addChild(this.ui = new flambe_Entity());
		this.ui.add(this.uiContainer = new flambe_display_Sprite());
		this.stageWidth = flambe_System.get_stage().get_width();
		this.stageHeight = flambe_System.get_stage().get_height();
		this.sceneContainer = new flambe_display_Sprite();
		this.camera = new flambe_camera_Camera();
		this.scene.add(this.sceneContainer).add(this.camera).addChild(this.sceneBackgroundLayer = new flambe_Entity()).addChild(this.sceneContentLayer = new flambe_Entity()).addChild(this.sceneUILayer = new flambe_Entity());
		this.cameraMouseControl = new flambe_camera_behaviours_MouseControlBehaviour(this.camera);
		this.camera.behaviours.push(this.cameraMouseControl);
		this.cameraMouseControl.set_enabled(true);
		this.cameraZoomLimit = new flambe_camera_behaviours_ZoomLimitBehaviour(this.camera,.25,1);
		this.camera.behaviours.push(this.cameraZoomLimit);
		this.cameraZoomLimit.set_enabled(true);
		this.camera.controller.zoom.set__(1);
		this.scene.addChild(new flambe_Entity().add(new flambe_camera_view_CameraBackgroundFill(6710886,this.camera)),false);
		flambe_System.get_stage().resize.connect($bind(this,this.onResize));
	}
	,initControl: function() {
		var _g = this;
		this.settings = new webaudio_synth_data_Settings();
		this.paramSerialiser = new webaudio_synth_data_ParameterSerialiser(this.settings);
		var observers = [this.monoSynth,this.paramSerialiser];
		this.initKeyboardInputs();
		this.monoSynthUI.output.outputLevel.value.addObservers(observers,true);
		var pb = this.monoSynthUI.output.pitchBend;
		pb.returnToDefault = true;
		pb.labelFormatter = function(val) {
			return pb.defaultLabelFormatter(val * _g.monoSynth.pitchBendRange / 100);
		};
		pb.value.addObservers(observers,true);
		var osc = this.monoSynthUI.oscillators;
		osc.osc0Type.value.addObservers(observers,true);
		osc.osc0Level.value.addObservers(observers,true);
		osc.osc0Pan.value.addObservers(observers,true);
		osc.osc0Slide.value.addObservers(observers,true);
		osc.osc0Random.value.addObservers(observers,true);
		osc.osc0Detune.value.addObservers(observers,true);
		osc.osc1Type.value.addObservers(observers,true);
		osc.osc1Level.value.addObservers(observers,true);
		osc.osc1Pan.value.addObservers(observers,true);
		osc.osc1Slide.value.addObservers(observers,true);
		osc.osc1Random.value.addObservers(observers,true);
		osc.osc1Detune.value.addObservers(observers,true);
		osc.oscPhase.value.addObservers(observers,true);
		var adsr = this.monoSynthUI.adsr;
		adsr.attack.value.addObservers(observers,true);
		adsr.decay.value.addObservers(observers,true);
		adsr.sustain.value.addObservers(observers,true);
		adsr.release.value.addObservers(observers,true);
		var filter = this.monoSynthUI.filter;
		filter.type.value.addObservers(observers,true);
		filter.frequency.value.addObservers(observers,true);
		filter.Q.value.addObservers(observers,true);
		filter.attack.value.addObservers(observers,true);
		filter.release.value.addObservers(observers,true);
		filter.range.value.addObservers(observers,true);
		var distortion = this.monoSynthUI.distortion;
		distortion.pregain.value.addObservers(observers,true);
		distortion.waveshaperAmount.value.addObservers(observers,true);
		distortion.bits.value.addObservers(observers,true);
		distortion.rateReduction.value.addObservers(observers,true);
		var delay = this.monoSynthUI.delay;
		delay.level.value.addObservers(observers,true);
		delay.time.value.addObservers(observers,true);
		delay.feedback.value.addObservers(observers,true);
		delay.lfpFreq.value.addObservers(observers,true);
		delay.lfpQ.value.addObservers(observers,true);
		this.paramSerialiser.restoreSession();
	}
	,onKeyDown: function(e) {
		var code = flambe_platform_KeyCodes.toKeyCode(e.key);
		this.activeKeys[code] = true;
		var _g = e.key;
		switch(Type.enumIndex(_g)) {
		case 83:
			flambe_System.get_stage().requestFullscreen(false);
			break;
		case 5:case 62:
			flambe_System.get_stage().requestFullscreen();
			break;
		case 46:
			this.camera.controller.zoom.animateBy(.2,.25,flambe_animation_Ease.quadOut);
			break;
		case 51:
			this.camera.controller.zoom.animateBy(-.2,.25,flambe_animation_Ease.quadOut);
			break;
		case 52:
			console.log(this.paramSerialiser.serialise());
			break;
		case 53:
			this.paramSerialiser.randomiseAll();
			break;
		case 54:
			this.paramSerialiser.resetAll();
			break;
		default:
			if(!(this.keyIsDown(17) || this.keyIsDown(18))) this.keyboardInputs.onQwertyKeyDown(code);
		}
	}
	,onKeyUp: function(e) {
		var code = flambe_platform_KeyCodes.toKeyCode(e.key);
		this.activeKeys[code] = false;
		this.keyboardInputs.onQwertyKeyUp(code);
	}
	,initKeyboardInputs: function() {
		var _g = this;
		if(flambe_System.get_keyboard().get_supported()) {
			var this1;
			this1 = new Array(256);
			this.activeKeys = this1;
			var _g1 = 0;
			var _g2 = this.activeKeys.length;
			while(_g1 < _g2) {
				var i = _g1++;
				this.activeKeys[i] = false;
			}
			flambe_System.get_keyboard().up.connect($bind(this,this.onKeyUp));
			flambe_System.get_keyboard().down.connect($bind(this,this.onKeyDown));
		}
		this.monoSynthUI.keyboard.keyDown.connect(($_=this.keyboardInputs,$bind($_,$_.onNoteKeyDown)));
		this.monoSynthUI.keyboard.keyUp.connect(($_=this.keyboardInputs,$bind($_,$_.onNoteKeyUp)));
		var handleNoteOn = function(noteIndex) {
			var f = _g.keyboardNotes.noteFreq.noteIndexToFrequency(noteIndex);
			_g.monoSynth.noteOn(webaudio_Main.audioContext.currentTime,f,.8,!_g.monoSynth.noteIsOn);
			_g.monoSynthUI.keyboard.setNoteState(noteIndex,true);
		};
		var handleNoteOff = function(noteIndex1) {
			_g.monoSynthUI.keyboard.setNoteState(noteIndex1,false);
			if(_g.keyboardInputs.get_noteCount() > 0) handleNoteOn(_g.keyboardInputs.get_lastNote()); else _g.monoSynth.noteOff(webaudio_Main.audioContext.currentTime);
		};
		this.keyboardInputs.noteOn.connect(handleNoteOn);
		this.keyboardInputs.noteOff.connect(handleNoteOff);
	}
	,keyIsDown: function(code) {
		return this.activeKeys[code];
	}
	,onResize: function() {
		this.stageWidth = flambe_System.get_stage().get_width();
		this.stageHeight = flambe_System.get_stage().get_height();
	}
	,__class__: webaudio_Main
};
var webaudio_PreloadMain = function() { };
$hxClasses["webaudio.PreloadMain"] = webaudio_PreloadMain;
webaudio_PreloadMain.__name__ = true;
webaudio_PreloadMain.init = function(packName,complete,loadBarColour) {
	if(loadBarColour == null) loadBarColour = 0;
	var bar = new flambe_display_FillSprite(loadBarColour,1,flambe_System.get_stage().get_height());
	flambe_System.root.add(bar);
	var loader = flambe_System.loadAssetPack(flambe_asset_Manifest.fromAssets(packName));
	loader.progressChanged.connect(function() {
		var v = loader.get_progress() / loader.get_total();
		bar.width.animateTo(v * flambe_System.get_stage().get_width(),.25,flambe_animation_Ease.quadOut);
		bar.height.set__(flambe_System.get_stage().get_height());
	});
	loader.success.connect(function(ass) {
		console.log("success!");
		bar.width.animateTo(flambe_System.get_stage().get_width(),.25,flambe_animation_Ease.quadOut);
		haxe_Timer.delay(function() {
			complete(ass);
			bar.dispose();
		},250);
	}).once();
	loader.error.connect(function(err) {
		bar.color = 16711680;
		complete(null);
		throw err;
	});
};
var webaudio_synth_MonoSynth = function(destination,freqUtil) {
	this.osc1Freq = 440;
	this.osc0Freq = 440;
	this.noteFreq = 440;
	this._osc1_detuneCents = 0;
	this._osc0_detuneCents = 0;
	this._pitchBend = 0;
	this._phase = 0;
	this.pitchBendRange = 1200;
	this.osc1_randomCents = 0;
	this.osc1_portamentoTime = 0;
	this.osc0_randomCents = 0;
	this.osc0_portamentoTime = 0;
	this.noteIsOn = false;
	this.freqUtil = freqUtil;
	this.context = destination.context;
	this.outputGain = this.context.createGain();
	this.outputGain.connect(destination);
	this.outputGain.gain.value = 1;
	this.delay = new webaudio_synth_processor_FeedbackDelay(this.context);
	this.delay.get_output().connect(this.outputGain);
	this.filter = new webaudio_synth_processor_BiquadFilter(webaudio_synth_processor_FilterType.LOWPASS,null,null,this.context);
	this.filter.biquad.connect(this.delay.get_input());
	this.filter.biquad.connect(this.outputGain);
	this.distortionGroup = new webaudio_synth_processor_DistortionGroup(this.context);
	this.distortionGroup.get_output().connect(this.filter.biquad);
	this.adsr = new webaudio_synth_generator_ADSR(this.context,null,this.distortionGroup.get_input());
	this.setupOscillators();
};
$hxClasses["webaudio.synth.MonoSynth"] = webaudio_synth_MonoSynth;
webaudio_synth_MonoSynth.__name__ = true;
webaudio_synth_MonoSynth.__interfaces__ = [audio_parameter_ParameterObserver];
webaudio_synth_MonoSynth.prototype = {
	setupOscillators: function() {
		this.phaseDelay = this.context.createDelay(1 / this.freqUtil.noteIndexToFrequency(0));
		this.phaseDelay.connect(this.adsr.node,0);
		var this1;
		this1 = this.context.createPanner();
		this1.panningModel = "equalpower";
		var x = 0 * 3.141592653589793 / 2;
		var z = x + 3.141592653589793 / 2;
		if(z > 3.141592653589793 / 2) z = 3.141592653589793 - z;
		this1.setPosition(Math.sin(x),0,Math.sin(z));
		0;
		if(null != null) null.connect(this1);
		if(null != null) this1.connect(null);
		this.osc0Pan = this1;
		var this11;
		this11 = this.context.createPanner();
		this11.panningModel = "equalpower";
		var x1 = 0 * 3.141592653589793 / 2;
		var z1 = x1 + 3.141592653589793 / 2;
		if(z1 > 3.141592653589793 / 2) z1 = 3.141592653589793 - z1;
		this11.setPosition(Math.sin(x1),0,Math.sin(z1));
		0;
		if(null != null) null.connect(this11);
		if(null != null) this11.connect(null);
		this.osc1Pan = this11;
		this.osc0Pan.connect(this.phaseDelay);
		this.osc1Pan.connect(this.adsr.node);
		this.osc0Level = this.context.createGain();
		this.osc1Level = this.context.createGain();
		this.osc0Level.connect(this.osc0Pan);
		this.osc1Level.connect(this.osc1Pan);
		this.osc0 = new webaudio_synth_generator_OscillatorGroup(this.context,this.osc0Level);
		this.osc1 = new webaudio_synth_generator_OscillatorGroup(this.context,this.osc1Level);
	}
	,noteOn: function(when,freq,velocity,retrigger) {
		if(retrigger == null) retrigger = false;
		if(velocity == null) velocity = 1;
		this.noteFreq = this.osc0Freq = this.osc1Freq = freq;
		var detune0 = this._osc0_detuneCents;
		var detune1 = this._osc1_detuneCents;
		if(this.osc0_randomCents > 0) detune0 += this.osc0_randomCents * (Math.random() - .5);
		if(this.osc1_randomCents > 0) detune1 += this.osc1_randomCents * (Math.random() - .5);
		if(this._pitchBend != 0) {
			var pbCents = this._pitchBend * this.pitchBendRange;
			detune0 += pbCents;
			detune1 += pbCents;
		}
		if(detune0 != 0) this.osc0Freq = this.freqUtil.detuneFreq(this.osc0Freq,detune0);
		if(detune1 != 0) this.osc1Freq = this.freqUtil.detuneFreq(this.osc1Freq,detune1);
		var p = 1 / this.osc0Freq * this._phase;
		this.phaseDelay.delayTime.cancelScheduledValues(when);
		if(this.osc0_portamentoTime > 0) {
			if(p > 0) {
				this.phaseDelay.delayTime.setValueAtTime(this.phaseDelay.delayTime.value,when);
				this.phaseDelay.delayTime.exponentialRampToValueAtTime(p,when + this.osc0_portamentoTime);
			} else this.phaseDelay.delayTime.setValueAtTime(p,when);
		} else this.phaseDelay.delayTime.setValueAtTime(p,when);
		var this1 = this.osc0.get_oscillator();
		var freq1 = this.osc0Freq;
		var portamentoTime = this.osc0_portamentoTime;
		this1.frequency.cancelScheduledValues(when);
		if(portamentoTime > 0 && !retrigger && freq1 != this1.frequency.value) {
			this1.frequency.setValueAtTime(this1.frequency.value,when);
			this1.frequency.exponentialRampToValueAtTime(freq1,when + portamentoTime);
		} else this1.frequency.setValueAtTime(freq1,when);
		var this11 = this.osc1.get_oscillator();
		var freq2 = this.osc1Freq;
		var portamentoTime1 = this.osc1_portamentoTime;
		this11.frequency.cancelScheduledValues(when);
		if(portamentoTime1 > 0 && !retrigger && freq2 != this11.frequency.value) {
			this11.frequency.setValueAtTime(this11.frequency.value,when);
			this11.frequency.exponentialRampToValueAtTime(freq2,when + portamentoTime1);
		} else this11.frequency.setValueAtTime(freq2,when);
		if(!this.noteIsOn || retrigger) {
			this.adsr.on(when,velocity,retrigger);
			this.filter.on(when,retrigger);
		}
		this.noteIsOn = true;
	}
	,noteOff: function(when) {
		if(this.noteIsOn) {
			var r = this.adsr.off(when);
			this.filter.off(when);
			var this1 = this.osc0.get_oscillator();
			this1.frequency.cancelScheduledValues(r);
			var this11 = this.osc1.get_oscillator();
			this11.frequency.cancelScheduledValues(r);
			this.phaseDelay.delayTime.cancelScheduledValues(r);
			this.noteIsOn = false;
		}
	}
	,onParameterChange: function(parameter) {
		console.log("[MonoSynth] " + parameter.name + " - value:" + parameter.getValue() + ", normalised:" + parameter.getValue(true));
		var now = this.context.currentTime;
		var val = parameter.getValue();
		var _g = parameter.name;
		switch(_g) {
		case "outputLevel":
			this.outputGain.gain.setValueAtTime(val,now);
			break;
		case "osc0Type":
			this.osc0.set_type(Std["int"](val));
			break;
		case "osc0Level":
			this.osc0Level.gain.setValueAtTime(val,now);
			break;
		case "osc0Pan":
			var x = val * 3.141592653589793 / 2;
			var z = x + 3.141592653589793 / 2;
			if(z > 3.141592653589793 / 2) z = 3.141592653589793 - z;
			this.osc0Pan.setPosition(Math.sin(x),0,Math.sin(z));
			val;
			break;
		case "osc0Slide":
			this.osc0_portamentoTime = val;
			break;
		case "osc0Detune":
			this.set_osc0_detuneCents(Std["int"](val));
			break;
		case "osc0Random":
			this.osc0_randomCents = val;
			break;
		case "osc1Type":
			this.osc1.set_type(Std["int"](val));
			break;
		case "osc1Level":
			this.osc1Level.gain.setValueAtTime(val,now);
			break;
		case "osc1Pan":
			var x1 = val * 3.141592653589793 / 2;
			var z1 = x1 + 3.141592653589793 / 2;
			if(z1 > 3.141592653589793 / 2) z1 = 3.141592653589793 - z1;
			this.osc1Pan.setPosition(Math.sin(x1),0,Math.sin(z1));
			val;
			break;
		case "osc1Slide":
			this.osc1_portamentoTime = val;
			break;
		case "osc1Detune":
			this.set_osc1_detuneCents(Std["int"](val));
			break;
		case "osc1Random":
			this.osc1_randomCents = val;
			break;
		case "oscPhase":
			this.set_phase(val);
			break;
		case "pitchBend":
			this.set_pitchBend(-val);
			break;
		case "adsrAttack":
			this.adsr.attack = val;
			break;
		case "adsrDecay":
			this.adsr.decay = val;
			break;
		case "adsrSustain":
			this.adsr.sustain = val;
			break;
		case "adsrRelease":
			this.adsr.release = val;
			break;
		case "filterType":
			this.filter.set_type(Std["int"](val) == 0?webaudio_synth_processor_FilterType.LOWPASS:webaudio_synth_processor_FilterType.HIGHPASS);
			break;
		case "filterFrequency":
			this.filter.set_frequency(val);
			break;
		case "filterQ":
			this.filter.set_q(val);
			break;
		case "filterAttack":
			this.filter.envAttack = val;
			break;
		case "filterRelease":
			this.filter.envRelease = val;
			break;
		case "filterRange":
			this.filter.envRange = val;
			break;
		case "distortionPregain":
			this.distortionGroup.pregain.gain.setValueAtTime(1 + val,now);
			break;
		case "distortionWaveshaperAmount":
			var value = val;
			if(value < -1.0) value = -1.0; else if(value > 1.0) value = 1.0; else value = value;
			webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$.getDistortionCurve(value,this.distortionGroup.waveshaper.curve);
			value;
			break;
		case "distortionBits":
			this.distortionGroup.crusher.set_bits(val);
			break;
		case "distortionRateReduction":
			this.distortionGroup.crusher.set_rateReduction(val);
			break;
		case "delayTime":
			this.delay.get_time().setValueAtTime(val,now);
			break;
		case "delayLevel":
			this.delay.get_level().setValueAtTime(val,now);
			break;
		case "delayFeedback":
			this.delay.get_feedback().setValueAtTime(val,now);
			break;
		case "delayLFPFreq":
			this.delay.get_lpfFrequency().setValueAtTime(val,now);
			break;
		case "delayLFPQ":
			this.delay.get_lpfQ().setValueAtTime(val,now);
			break;
		}
	}
	,set_phase: function(value) {
		var now = this.context.currentTime;
		this.phaseDelay.delayTime.cancelScheduledValues(now);
		this.phaseDelay.delayTime.setValueAtTime(1 / this.noteFreq * value,now);
		return this._phase = value;
	}
	,set_pitchBend: function(value) {
		if(value < -1.0) value = -1.0; else if(value > 1.0) value = 1.0; else value = value;
		if(this.noteIsOn) {
			var dP = (value - this._pitchBend) * this.pitchBendRange;
			var f0 = this.freqUtil.detuneFreq(this.osc0Freq,dP);
			var f1 = this.freqUtil.detuneFreq(this.osc1Freq,dP);
			var now = this.context.currentTime;
			((function($this) {
				var $r;
				var this1 = $this.osc0.get_oscillator();
				$r = this1;
				return $r;
			}(this))).frequency.cancelScheduledValues(now);
			((function($this) {
				var $r;
				var this11 = $this.osc0.get_oscillator();
				$r = this11;
				return $r;
			}(this))).frequency.exponentialRampToValueAtTime(f0,now + 0.016666666666666666);
			((function($this) {
				var $r;
				var this12 = $this.osc1.get_oscillator();
				$r = this12;
				return $r;
			}(this))).frequency.cancelScheduledValues(now);
			((function($this) {
				var $r;
				var this13 = $this.osc1.get_oscillator();
				$r = this13;
				return $r;
			}(this))).frequency.exponentialRampToValueAtTime(f1,now + 0.016666666666666666);
			this.osc0Freq = f0;
			this.osc1Freq = f1;
		}
		return this._pitchBend = value;
	}
	,set_osc0_detuneCents: function(value) {
		if(value < -100) value = -100; else if(value > 100) value = 100; else value = value;
		if(this.noteIsOn) {
			var dt = value - this._osc0_detuneCents;
			var f = this.freqUtil.detuneFreq(this.osc0Freq,dt);
			var now = this.context.currentTime;
			((function($this) {
				var $r;
				var this1 = $this.osc0.get_oscillator();
				$r = this1;
				return $r;
			}(this))).frequency.cancelScheduledValues(now);
			((function($this) {
				var $r;
				var this11 = $this.osc0.get_oscillator();
				$r = this11;
				return $r;
			}(this))).frequency.exponentialRampToValueAtTime(f,now + 0.016666666666666666);
			this.osc0Freq = f;
		}
		return this._osc0_detuneCents = value;
	}
	,set_osc1_detuneCents: function(value) {
		if(value < -100) value = -100; else if(value > 100) value = 100; else value = value;
		if(this.noteIsOn) {
			var dt = value - this._osc1_detuneCents;
			var f = this.freqUtil.detuneFreq(this.osc1Freq,dt);
			var now = this.context.currentTime;
			((function($this) {
				var $r;
				var this1 = $this.osc1.get_oscillator();
				$r = this1;
				return $r;
			}(this))).frequency.cancelScheduledValues(now);
			((function($this) {
				var $r;
				var this11 = $this.osc1.get_oscillator();
				$r = this11;
				return $r;
			}(this))).frequency.exponentialRampToValueAtTime(f,now + 0.016666666666666666);
			this.osc1Freq = f;
		}
		return this._osc1_detuneCents = value;
	}
	,__class__: webaudio_synth_MonoSynth
	,__properties__: {set_osc1_detuneCents:"set_osc1_detuneCents",set_osc0_detuneCents:"set_osc0_detuneCents",set_pitchBend:"set_pitchBend",set_phase:"set_phase"}
};
var webaudio_synth_data_ParameterSerialiser = function(settings) {
	var _g = this;
	this.settings = settings;
	this.map = new haxe_ds_StringMap();
	js_Browser.get_window().addEventListener("beforeunload",function(e) {
		_g.storeSession();
	});
};
$hxClasses["webaudio.synth.data.ParameterSerialiser"] = webaudio_synth_data_ParameterSerialiser;
webaudio_synth_data_ParameterSerialiser.__name__ = true;
webaudio_synth_data_ParameterSerialiser.__interfaces__ = [audio_parameter_ParameterObserver];
webaudio_synth_data_ParameterSerialiser.prototype = {
	restoreSession: function() {
		var session = this.settings.getSessionData("monosynth_sessionParameters");
		if(session != null) {
			console.log("Restoring parameters from previous session...");
			this.deserialise(session);
		}
	}
	,storeSession: function() {
		this.settings.setSessionData("monosynth_sessionParameters",this.serialise());
	}
	,onParameterChange: function(parameter) {
		if(!this.map.exists(parameter.name)) this.map.set(parameter.name,parameter);
	}
	,resetAll: function() {
		var $it0 = this.map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			this.map.get(key).setToDefault();
		}
	}
	,randomiseAll: function(amount) {
		if(amount == null) amount = 1;
		var $it0 = this.map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var p = this.map.get(key);
			var v = p.getValue(true);
			v += (Math.random() - .5) * amount * 2;
			if(v < 0) v = -v; else if(v > 1) v = v - 1; else v = v;
			p.setValue(v,true);
		}
	}
	,serialise: function() {
		var out = { };
		var $it0 = this.map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			Reflect.setField(out,key,this.map.get(key).normalisedValue);
		}
		return JSON.stringify(out);
	}
	,deserialise: function(data,setAsDefault) {
		if(setAsDefault == null) setAsDefault = false;
		var input = JSON.parse(data);
		var _g = 0;
		var _g1 = Reflect.fields(input);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			if(this.map.exists(field)) {
				var value = Std.parseFloat(Reflect.field(input,field));
				if(setAsDefault) this.map.get(field).setDefault(value,true); else this.map.get(field).setValue(value,true);
			}
		}
	}
	,__class__: webaudio_synth_data_ParameterSerialiser
};
var webaudio_synth_data_Settings = function() {
	this.local = js_Browser.getLocalStorage();
	this.session = js_Browser.getSessionStorage();
};
$hxClasses["webaudio.synth.data.Settings"] = webaudio_synth_data_Settings;
webaudio_synth_data_Settings.__name__ = true;
webaudio_synth_data_Settings.prototype = {
	setSessionData: function(name,data) {
		this.session.setItem(name,data);
	}
	,getSessionData: function(name) {
		return this.session.getItem(name);
	}
	,__class__: webaudio_synth_data_Settings
};
var webaudio_synth_generator_ADSR = function(context,input,destination) {
	this.release = .25;
	this.sustain = .44;
	this.decay = 0.2;
	this.attack = .1;
	var this1;
	this1 = context.createGain();
	this1.gain.value = 0;
	if(input != null) input.connect(this1);
	if(destination != null) this1.connect(destination);
	this.node = this1;
};
$hxClasses["webaudio.synth.generator.ADSR"] = webaudio_synth_generator_ADSR;
webaudio_synth_generator_ADSR.__name__ = true;
webaudio_synth_generator_ADSR.prototype = {
	on: function(when,level,retrigger) {
		if(retrigger == null) retrigger = false;
		if(level == null) level = 1.0;
		if(when == null) when = .0;
		var this1 = this.node;
		var attackTime = this.attack;
		var decayTime = this.decay;
		var sustainLevel = this.sustain;
		if(attackTime < 0.0001) attackTime = 0.0001; else attackTime = attackTime;
		if(decayTime < 0.0001) decayTime = 0.0001; else decayTime = decayTime;
		this1.gain.cancelScheduledValues(when);
		if(retrigger) this1.gain.setValueAtTime(this1.gain.value,when);
		this1.gain.setTargetAtTime(level,when,Math.log(attackTime + 1.0) / 4.605170185988092);
		if(sustainLevel != 1.0) {
			if(decayTime > 0) this1.gain.setTargetAtTime(level * sustainLevel,when + attackTime,Math.log(decayTime + 1.0) / 4.605170185988092); else this1.gain.setValueAtTime(level * sustainLevel,when + attackTime);
		}
	}
	,off: function(when) {
		if(when == null) when = .0;
		var this1 = this.node;
		var releaseDuration = this.release;
		if(releaseDuration < 0.0001) releaseDuration = 0.0001; else releaseDuration = releaseDuration;
		this1.gain.cancelScheduledValues(when);
		this1.gain.setValueAtTime(this1.gain.value,when);
		this1.gain.setTargetAtTime(0,when,Math.log(releaseDuration + 1.0) / 4.605170185988092);
		return when + releaseDuration;
	}
	,__class__: webaudio_synth_generator_ADSR
};
var webaudio_synth_generator_OscillatorType = function() { };
$hxClasses["webaudio.synth.generator.OscillatorType"] = webaudio_synth_generator_OscillatorType;
webaudio_synth_generator_OscillatorType.__name__ = true;
webaudio_synth_generator_OscillatorType.get = function(type) {
	switch(type) {
	case webaudio_synth_generator_OscillatorType.SINE:
		return OscillatorTypeShim.SINE;
	case webaudio_synth_generator_OscillatorType.SQUARE:
		return OscillatorTypeShim.SQUARE;
	case webaudio_synth_generator_OscillatorType.SAWTOOTH:
		return OscillatorTypeShim.SAWTOOTH;
	case webaudio_synth_generator_OscillatorType.TRIANGLE:
		return OscillatorTypeShim.TRIANGLE;
	case webaudio_synth_generator_OscillatorType.CUSTOM:
		return OscillatorTypeShim.CUSTOM;
	default:
		return null;
	}
};
var webaudio_synth_generator_OscillatorGroup = function(context,output) {
	this.osc = new haxe_ds_IntMap();
	var value;
	var this1;
	this1 = context.createOscillator();
	this1.frequency.value = 440;
	this1.type = webaudio_synth_generator_OscillatorType.get(webaudio_synth_generator_OscillatorType.SINE);
	this1.start(0);
	if(null != null) this1.connect(null);
	value = this1;
	this.osc.set(webaudio_synth_generator_OscillatorType.SINE,value);
	var value1;
	var this2;
	this2 = context.createOscillator();
	this2.frequency.value = 440;
	this2.type = webaudio_synth_generator_OscillatorType.get(webaudio_synth_generator_OscillatorType.SQUARE);
	this2.start(0);
	if(null != null) this2.connect(null);
	value1 = this2;
	this.osc.set(webaudio_synth_generator_OscillatorType.SQUARE,value1);
	var value2;
	var this3;
	this3 = context.createOscillator();
	this3.frequency.value = 440;
	this3.type = webaudio_synth_generator_OscillatorType.get(webaudio_synth_generator_OscillatorType.SAWTOOTH);
	this3.start(0);
	if(null != null) this3.connect(null);
	value2 = this3;
	this.osc.set(webaudio_synth_generator_OscillatorType.SAWTOOTH,value2);
	var value3;
	var this4;
	this4 = context.createOscillator();
	this4.frequency.value = 440;
	this4.type = webaudio_synth_generator_OscillatorType.get(webaudio_synth_generator_OscillatorType.TRIANGLE);
	this4.start(0);
	if(null != null) this4.connect(null);
	value3 = this4;
	this.osc.set(webaudio_synth_generator_OscillatorType.TRIANGLE,value3);
	this._type = 0;
	this._output = output;
	this.connected = false;
};
$hxClasses["webaudio.synth.generator.OscillatorGroup"] = webaudio_synth_generator_OscillatorGroup;
webaudio_synth_generator_OscillatorGroup.__name__ = true;
webaudio_synth_generator_OscillatorGroup.prototype = {
	set_type: function(value) {
		if(this._type != value || !this.connected) {
			this.connected = true;
			((function($this) {
				var $r;
				var this1 = $this.osc.get($this._type);
				$r = this1;
				return $r;
			}(this))).disconnect(0);
			((function($this) {
				var $r;
				var this2 = $this.osc.get(value);
				$r = this2;
				return $r;
			}(this))).connect(this.get_output());
		}
		return this._type = value;
	}
	,get_output: function() {
		return this._output;
	}
	,get_oscillator: function() {
		return this.osc.get(this._type);
	}
	,__class__: webaudio_synth_generator_OscillatorGroup
	,__properties__: {get_oscillator:"get_oscillator",get_output:"get_output",set_type:"set_type"}
};
var webaudio_synth_processor_BiquadFilter = function(type,freq,q,context,input,destination) {
	if(q == null) q = 1.0;
	if(freq == null) freq = 8000.0;
	this.envRelease = 1;
	this.envAttack = .1;
	this.envRange = 1;
	this._frequency = freq;
	this._q = q;
	this._gain = 1.0;
	var this1;
	this1 = context.createBiquadFilter();
	this1.type = webaudio_synth_processor_FilterType.get(type);
	this1.frequency.value = freq;
	this1.Q.value = q;
	this1.gain.value = 0;
	if(input != null) input.connect(this1);
	if(destination != null) this1.connect(destination);
	this.biquad = this1;
};
$hxClasses["webaudio.synth.processor.BiquadFilter"] = webaudio_synth_processor_BiquadFilter;
webaudio_synth_processor_BiquadFilter.__name__ = true;
webaudio_synth_processor_BiquadFilter.prototype = {
	on: function(when,retrigger) {
		if(retrigger == null) retrigger = false;
		var dest = Math.min(this._frequency + this.envRange * (8000 - this._frequency),8000);
		var this1 = this.biquad;
		var attackTime = this.envAttack;
		if(attackTime < 0.0001) attackTime = 0.0001; else attackTime = attackTime;
		this1.frequency.cancelScheduledValues(when);
		if(retrigger) this1.frequency.setValueAtTime(this._frequency,when); else this1.frequency.setValueAtTime(this1.frequency.value,when);
		this1.frequency.exponentialRampToValueAtTime(dest,when + attackTime);
	}
	,off: function(when) {
		var this1 = this.biquad;
		var releaseDuration = this.envRelease;
		if(releaseDuration < 0.0001) releaseDuration = 0.0001; else releaseDuration = releaseDuration;
		this1.frequency.cancelScheduledValues(when);
		this1.frequency.setValueAtTime(this1.frequency.value,when);
		this1.frequency.setTargetAtTime(this._frequency,when,Math.log(releaseDuration + 1.0) / 4.605170185988092);
		return when + releaseDuration;
	}
	,set_frequency: function(value) {
		var ctx = this.biquad.context;
		var nyquist = ctx.sampleRate / 2;
		var now = ctx.currentTime;
		if(value < 10) value = 10; else if(value > nyquist) value = nyquist; else value = value;
		this.biquad.frequency.cancelScheduledValues(now);
		this.biquad.frequency.setValueAtTime(value,now);
		return this._frequency = value;
	}
	,set_q: function(value) {
		if(value < 0.0001) value = 0.0001; else if(value > 1000) value = 1000; else value = value;
		var now = this.biquad.context.currentTime;
		this.biquad.Q.cancelScheduledValues(now);
		this.biquad.Q.setValueAtTime(value,now);
		return this._q = value;
	}
	,set_type: function(value) {
		return this.biquad.type = webaudio_synth_processor_FilterType.get(value);
	}
	,__class__: webaudio_synth_processor_BiquadFilter
	,__properties__: {set_type:"set_type",set_q:"set_q",set_frequency:"set_frequency"}
};
var webaudio_synth_processor_FilterType = function() { };
$hxClasses["webaudio.synth.processor.FilterType"] = webaudio_synth_processor_FilterType;
webaudio_synth_processor_FilterType.__name__ = true;
webaudio_synth_processor_FilterType.get = function(type) {
	switch(type) {
	case webaudio_synth_processor_FilterType.ALLPASS:
		return FilterTypeShim.ALLPASS;
	case webaudio_synth_processor_FilterType.BANDPASS:
		return FilterTypeShim.BANDPASS;
	case webaudio_synth_processor_FilterType.HIGHPASS:
		return FilterTypeShim.HIGHPASS;
	case webaudio_synth_processor_FilterType.HIGHSHELF:
		return FilterTypeShim.HIGHSHELF;
	case webaudio_synth_processor_FilterType.LOWPASS:
		return FilterTypeShim.LOWPASS;
	case webaudio_synth_processor_FilterType.LOWSHELF:
		return FilterTypeShim.LOWSHELF;
	case webaudio_synth_processor_FilterType.NOTCH:
		return FilterTypeShim.NOTCH;
	case webaudio_synth_processor_FilterType.PEAKING:
		return FilterTypeShim.PEAKING;
	default:
		return null;
	}
};
var webaudio_synth_processor_Crusher = function(context,input,destination) {
	this.tempRight = 0;
	this.tempLeft = 0;
	this.sampleCount = 0;
	this.context = context;
	this.sampleRate = context.sampleRate;
	this.set_bits(24);
	this.set_rateReduction(1);
	var this1;
	try {
		this1 = context.createScriptProcessor();
	} catch( err ) {
		this1 = context.createScriptProcessor(4096);
	}
	if(input != null) input.connect(this1);
	if(destination != null) this1.connect(destination);
	this.node = this1;
	this.node.onaudioprocess = $bind(this,this.crusherImpl);
};
$hxClasses["webaudio.synth.processor.Crusher"] = webaudio_synth_processor_Crusher;
webaudio_synth_processor_Crusher.__name__ = true;
webaudio_synth_processor_Crusher.prototype = {
	crusherImpl: function(e) {
		var inL = e.inputBuffer.getChannelData(0);
		var inR = e.inputBuffer.getChannelData(1);
		var outL = e.outputBuffer.getChannelData(0);
		var outR = e.outputBuffer.getChannelData(1);
		var n = outR.length;
		var e1 = this.exp;
		var ie = this.iexp;
		var ditherLevel = .002;
		var dL = 0;
		var dR = 0;
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.sampleCount++;
			if(this.sampleCount >= this.samplesPerCycle) {
				this.sampleCount = 0;
				dL = ditherLevel * (Math.random() - .5);
				dR = ditherLevel * (Math.random() - .5);
				this.tempLeft = ie * Std["int"](e1 * inL[i] + dL);
				this.tempRight = ie * Std["int"](e1 * inR[i] + dR);
			}
			outL[i] = this.tempLeft;
			outR[i] = this.tempRight;
		}
	}
	,set_bits: function(value) {
		if(value < 1) value = 1; else if(value > 24) value = 24; else value = value;
		if(this._bits != value) {
			this.exp = Math.pow(2,value);
			this.iexp = 1 / this.exp;
		}
		return this._bits = value;
	}
	,set_rateReduction: function(value) {
		if(value < 1) value = 1; else if(value > 16) value = 16; else value = value;
		return this.samplesPerCycle = this._rateReduction = value;
	}
	,__class__: webaudio_synth_processor_Crusher
	,__properties__: {set_rateReduction:"set_rateReduction",set_bits:"set_bits"}
};
var webaudio_synth_processor_DistortionGroup = function(context) {
	this.pregain = context.createGain();
	var input = this.pregain;
	var this1;
	this1 = context.createWaveShaper();
	this1.curve = new Float32Array(Std["int"](context.sampleRate));
	this1.oversample = "none";
	var value = 0;
	if(value < -1.0) value = -1.0; else if(value > 1.0) value = 1.0; else value = value;
	webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$.getDistortionCurve(value,this1.curve);
	value;
	if(input != null) input.connect(this1);
	if(null != null) this1.connect(null);
	this.waveshaper = this1;
	this.crusher = new webaudio_synth_processor_Crusher(context,this.waveshaper);
};
$hxClasses["webaudio.synth.processor.DistortionGroup"] = webaudio_synth_processor_DistortionGroup;
webaudio_synth_processor_DistortionGroup.__name__ = true;
webaudio_synth_processor_DistortionGroup.prototype = {
	get_input: function() {
		return this.pregain;
	}
	,get_output: function() {
		return this.crusher.node;
	}
	,__class__: webaudio_synth_processor_DistortionGroup
	,__properties__: {get_output:"get_output",get_input:"get_input"}
};
var webaudio_synth_processor_FeedbackDelay = function(context,maxDelay) {
	if(maxDelay == null) maxDelay = 1.0;
	this._level = context.createGain();
	this._feedback = context.createGain();
	this._delay = context.createDelay(maxDelay);
	this._level.gain.value = .25;
	this._feedback.gain.value = .5;
	this._lpf = context.createBiquadFilter();
	this._lpf.type = FilterTypeShim.LOWPASS;
	this._lpf.frequency.value = 4000;
	this._lpf.Q.value = 1;
	this._level.connect(this._delay);
	this._delay.connect(this._lpf);
	this._lpf.connect(this._feedback);
	this._feedback.connect(this._delay);
};
$hxClasses["webaudio.synth.processor.FeedbackDelay"] = webaudio_synth_processor_FeedbackDelay;
webaudio_synth_processor_FeedbackDelay.__name__ = true;
webaudio_synth_processor_FeedbackDelay.prototype = {
	get_time: function() {
		return this._delay.delayTime;
	}
	,get_level: function() {
		return this._level.gain;
	}
	,get_feedback: function() {
		return this._feedback.gain;
	}
	,get_lpfFrequency: function() {
		return this._lpf.frequency;
	}
	,get_lpfQ: function() {
		return this._lpf.Q;
	}
	,get_input: function() {
		return this._level;
	}
	,get_output: function() {
		return this._delay;
	}
	,__class__: webaudio_synth_processor_FeedbackDelay
	,__properties__: {get_output:"get_output",get_input:"get_input",get_lpfQ:"get_lpfQ",get_lpfFrequency:"get_lpfFrequency",get_feedback:"get_feedback",get_level:"get_level",get_time:"get_time"}
};
var webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$ = function() { };
$hxClasses["webaudio.synth.processor._Waveshaper.WaveShaper_Impl_"] = webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$;
webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$.__name__ = true;
webaudio_synth_processor__$Waveshaper_WaveShaper_$Impl_$.getDistortionCurve = function(amount,target) {
	if(amount == null) amount = .0;
	if(amount < -1.0 || amount > 1.0) throw "RangeError";
	var curve;
	if(target == null) curve = new Float32Array(44100); else curve = target;
	var n = curve.length;
	var k = 2 * amount / (1 - amount);
	var x;
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		x = -1 + (i + i) / n;
		curve[i] = (1.0 + k) * x / (1.0 + k * Math.abs(x));
	}
	return curve;
};
var webaudio_synth_ui_Fonts = function() { };
$hxClasses["webaudio.synth.ui.Fonts"] = webaudio_synth_ui_Fonts;
webaudio_synth_ui_Fonts.__name__ = true;
webaudio_synth_ui_Fonts.setup = function(pack) {
	webaudio_synth_ui_Fonts.Prime13 = new flambe_display_Font(pack,"font/Prime13");
	webaudio_synth_ui_Fonts.Prime14 = new flambe_display_Font(pack,"font/Prime14");
	webaudio_synth_ui_Fonts.Prime24 = new flambe_display_Font(pack,"font/Prime24");
	webaudio_synth_ui_Fonts.Prime22 = new flambe_display_Font(pack,"font/Prime22");
	webaudio_synth_ui_Fonts.Prime20 = new flambe_display_Font(pack,"font/Prime20");
	webaudio_synth_ui_Fonts.Prime32 = new flambe_display_Font(pack,"font/Prime32");
};
webaudio_synth_ui_Fonts.getField = function(font,text,colour) {
	if(colour == null) colour = 0;
	if(text == null) text = "Pack my box with five dozen liquor jugs.";
	var r = (colour >> 16 & 255) / 255;
	var g = (colour >> 8 & 255) / 255;
	var b = (colour & 255) / 255;
	var tf = new flambe_display_TextSprite(font,text);
	tf.set_pixelSnapping(true);
	tf.set_pointerEnabled(false);
	tf.setTint(r,g,b);
	return tf;
};
var webaudio_synth_ui_KeySprite = function(texture,noteIndex,isSharp) {
	this.noteIndex = noteIndex;
	this.isSharp = isSharp;
	flambe_display_ImageSprite.call(this,texture);
};
$hxClasses["webaudio.synth.ui.KeySprite"] = webaudio_synth_ui_KeySprite;
webaudio_synth_ui_KeySprite.__name__ = true;
webaudio_synth_ui_KeySprite.__super__ = flambe_display_ImageSprite;
webaudio_synth_ui_KeySprite.prototype = $extend(flambe_display_ImageSprite.prototype,{
	__class__: webaudio_synth_ui_KeySprite
});
var webaudio_synth_ui_KeyboardUI = function(keyboardNotes,textureAtlas) {
	this.keyboardNotes = keyboardNotes;
	this.keyDown = new flambe_util_Signal1();
	this.keyUp = new flambe_util_Signal1();
	this.whiteKeyTexture = textureAtlas.get("WhiteKey");
	this.blackKeyTexture = textureAtlas.get("BlackKey");
};
$hxClasses["webaudio.synth.ui.KeyboardUI"] = webaudio_synth_ui_KeyboardUI;
webaudio_synth_ui_KeyboardUI.__name__ = true;
webaudio_synth_ui_KeyboardUI.__super__ = flambe_Component;
webaudio_synth_ui_KeyboardUI.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "KeyboardUI_1";
	}
	,onAdded: function() {
		this.container = this.owner.getComponent("Sprite_0");
		var keyData = this.getKeysData(this.keyboardNotes.startOctave,4);
		this.noteIndexToKey = new haxe_ds_IntMap();
		var keyWidth = 40;
		var keyHeight = 164;
		var marginRight = 1;
		var keyX = 0;
		var keyY = 0;
		this.owner.addChild(this.naturals = new flambe_Entity());
		this.owner.addChild(this.sharps = new flambe_Entity());
		var _g = 0;
		while(_g < keyData.length) {
			var key = keyData[_g];
			++_g;
			var i = key.index;
			var spr;
			spr = new webaudio_synth_ui_KeySprite(this.whiteKeyTexture,i,false);
			spr.x.set__(keyX);
			spr.y.set__(keyY);
			this.noteIndexToKey.set(i,spr);
			this.naturals.addChild(new flambe_Entity().add(spr));
			spr.get_pointerOut().connect($bind(this,this.onKeyPointerOut));
			spr.get_pointerMove().connect($bind(this,this.onKeyPointerMove));
			spr.get_pointerDown().connect($bind(this,this.onKeyPointerDown));
			spr.get_pointerUp().connect($bind(this,this.onKeyPointerUp));
			if(key.hasSharp) {
				spr = new webaudio_synth_ui_KeySprite(this.blackKeyTexture,i + 1,true);
				spr.x.set__(keyX + 26);
				spr.y.set__(keyY);
				this.noteIndexToKey.set(i + 1,spr);
				this.sharps.addChild(new flambe_Entity().add(spr));
				spr.get_pointerOut().connect($bind(this,this.onKeyPointerOut));
				spr.get_pointerMove().connect($bind(this,this.onKeyPointerMove));
				spr.get_pointerDown().connect($bind(this,this.onKeyPointerDown));
				spr.get_pointerUp().connect($bind(this,this.onKeyPointerUp));
			}
			keyX += keyWidth + marginRight;
		}
		this.heldKey = -1;
	}
	,onKeyPointerOut: function(e) {
		var key = e.hit;
		if(!Std["is"](key,webaudio_synth_ui_KeySprite)) {
			if(this.heldKey != -1) {
				this.setKeyIsDown(this.getKeyForNote(this.heldKey),false);
				this.pointerDown = false;
				this.keyUp.emit(this.heldKey);
				this.heldKey = -1;
			}
		}
	}
	,onKeyPointerMove: function(e) {
		this.pointerDown = flambe_System.get_mouse().get_supported() && flambe_System.get_mouse().isDown(flambe_input_MouseButton.Left) || !flambe_System.get_mouse().get_supported() && flambe_System.get_touch().get_supported();
		if(this.pointerDown) {
			var key = e.hit;
			if(this.heldKey != key.noteIndex) {
				this.setKeyIsDown(key,true);
				this.keyDown.emit(key.noteIndex);
				if(this.heldKey != -1) {
					this.setKeyIsDown(this.getKeyForNote(this.heldKey),false);
					this.keyUp.emit(this.heldKey);
				}
				this.heldKey = key.noteIndex;
			}
		}
	}
	,onKeyPointerDown: function(e) {
		var key = e.hit;
		this.pointerDown = true;
		if(this.heldKey != key.noteIndex) {
			this.heldKey = key.noteIndex;
			this.setKeyIsDown(key,true);
			this.keyDown.emit(key.noteIndex);
		}
	}
	,onKeyPointerUp: function(e) {
		var key = e.hit;
		this.pointerDown = false;
		if(this.heldKey != -1 && this.heldKey == key.noteIndex) {
			this.heldKey = -1;
			this.pointerDown = false;
			this.setKeyIsDown(key,false);
			this.keyUp.emit(key.noteIndex);
		}
	}
	,getKeysData: function(startOctave,octaveCount) {
		if(octaveCount == null) octaveCount = 2;
		if(startOctave == null) startOctave = 2;
		this.ocataves = octaveCount;
		return this.getUIKeyNoteData(startOctave,octaveCount);
	}
	,getKeyForNote: function(noteIndex) {
		return this.noteIndexToKey.get(noteIndex);
	}
	,setNoteState: function(index,isDown) {
		this.setKeyIsDown(this.getKeyForNote(index),isDown);
	}
	,setKeyIsDown: function(key,isDown) {
		if(key.isSharp) {
			if(isDown) key.setTint(1.666,1.666,1.666); else key.setTint(1,1,1,.16);
		} else if(isDown) key.setTint(.666,.666,.666); else key.setTint(1,1,1,.16);
	}
	,getUIKeyNoteData: function(startOctave,octaveCount) {
		if(octaveCount == null) octaveCount = 2;
		if(startOctave == null) startOctave = 0;
		var i = this.keyboardNotes.noteFreq.noteNameToIndex("C" + startOctave);
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
	,__class__: webaudio_synth_ui_KeyboardUI
});
var webaudio_synth_ui_MonoSynthUI = function(textureAtlas,keyboardNotes) {
	flambe_display_Sprite.call(this);
	this.textureAtlas = textureAtlas;
	this.keyboardNotes = keyboardNotes;
};
$hxClasses["webaudio.synth.ui.MonoSynthUI"] = webaudio_synth_ui_MonoSynthUI;
webaudio_synth_ui_MonoSynthUI.__name__ = true;
webaudio_synth_ui_MonoSynthUI.__super__ = flambe_display_Sprite;
webaudio_synth_ui_MonoSynthUI.prototype = $extend(flambe_display_Sprite.prototype,{
	onAdded: function() {
		this.x.set__(-(1240 / 2));
		this.y.set__(-348);
		this.setupBackground();
		this.setupKeyboard();
		this.setupPanels();
	}
	,setupBackground: function() {
		this.owner.addChild(new flambe_Entity().add(this.background = flambe_display_NineSlice.fromSubTexture(this.textureAtlas.get("panel-bg_50%"))));
		this.background.set_width(1240);
		this.background.set_height(680);
		this.background.setTint(96 / 196,139 / 196,139 / 196);
	}
	,setupKeyboard: function() {
		this.keyboard = new webaudio_synth_ui_KeyboardUI(this.keyboardNotes,this.textureAtlas);
		this.owner.addChild(new flambe_Entity().add(this.keyboardMask = new flambe_display_Sprite()).addChild(new flambe_Entity().add(this.keyboardContainer = new flambe_display_Sprite()).add(this.keyboard)));
		this.keyboardMask.x.set__(64);
		this.keyboardMask.y.set__(530);
		this.keyboardMask.scissor = new flambe_math_Rectangle(0,0,1148,164);
	}
	,setupPanels: function() {
		var panelBg = new flambe_display_ImageSprite(this.textureAtlas.get("main-panel-bg")).disablePointer();
		this.owner.addChild(new flambe_Entity().add(panelBg));
		panelBg.x.set__(-8);
		panelBg.y.set__(-4);
		this.oscillators = new webaudio_synth_ui_modules_OscillatorsModule(this.owner,this.textureAtlas);
		this.adsr = new webaudio_synth_ui_modules_ADSRModule(this.owner,this.textureAtlas);
		this.filter = new webaudio_synth_ui_modules_FilterModule(this.owner,this.textureAtlas);
		this.distortion = new webaudio_synth_ui_modules_DistortionModule(this.owner,this.textureAtlas);
		this.delay = new webaudio_synth_ui_modules_DelayModule(this.owner,this.textureAtlas);
		this.output = new webaudio_synth_ui_modules_OutputModule(this.owner,this.textureAtlas);
	}
	,__class__: webaudio_synth_ui_MonoSynthUI
});
var webaudio_synth_ui_controls_NumericControl = function(name,defaultValue,parameterMapping) {
	this.highAccuracy = 0.001;
	this.normalAccuracy = 0.01;
	this.returnToDefaultMin = 1e-6;
	this.returnToDefaultSpeed = 16;
	this.returnToDefault = false;
	this.returningToDefault = false;
	this.moveConnection = null;
	this.pY = .0;
	this.pX = .0;
	this.lastTime = 0.0;
	this.pointerHasMoved = false;
	this.value = new audio_parameter_Parameter(name,defaultValue,parameterMapping);
	this.labelFormatter = $bind(this,this.defaultLabelFormatter);
};
$hxClasses["webaudio.synth.ui.controls.NumericControl"] = webaudio_synth_ui_controls_NumericControl;
webaudio_synth_ui_controls_NumericControl.__name__ = true;
webaudio_synth_ui_controls_NumericControl.__interfaces__ = [audio_parameter_ParameterObserver];
webaudio_synth_ui_controls_NumericControl.roundValueForDisplay = function(value,sigfig) {
	if(sigfig < 1) sigfig = 1;
	if(sigfig > 8) sigfig = 8;
	var e = Math.pow(10,sigfig);
	var vr = Math.round(value * e) / e;
	var vs = "" + vr;
	if(sigfig > 1 && vs.indexOf(".") == -1) vs = "" + vr + ".0";
	return vs;
};
webaudio_synth_ui_controls_NumericControl.__super__ = flambe_Component;
webaudio_synth_ui_controls_NumericControl.prototype = $extend(flambe_Component.prototype,{
	get_name: function() {
		return "NumericControl_2";
	}
	,onAdded: function() {
		var display = this.owner.getComponent("Sprite_0");
		display.get_pointerDown().connect($bind(this,this.pointerDown));
		this.value.addObserver(this,true);
	}
	,onUpdate: function(dt) {
		if(this.returningToDefault) {
			var now = this.value.getValue(true);
			var delta = this.value.normalisedDefaultValue - now;
			if((delta < 0?-delta:delta) < this.returnToDefaultMin) delta = 0; else delta = delta;
			if(delta != 0) this.value.setValue(now + delta * dt * this.returnToDefaultSpeed,true); else {
				this.returningToDefault = false;
				this.value.setToDefault();
			}
		}
	}
	,onRemoved: function() {
		this.value.removeObserver(this);
	}
	,pointerDown: function(e) {
		this.pointerHasMoved = this.returningToDefault = false;
		this.pX = e.viewX;
		this.pY = e.viewY;
		if(this.moveConnection != null) this.moveConnection.dispose();
		this.moveConnection = flambe_System.get_pointer().move.connect($bind(this,this.pointerMove));
		flambe_System.get_pointer().up.connect($bind(this,this.pointerUp)).once();
	}
	,pointerMove: function(e) {
		if(e.viewX != this.pX || e.viewY != this.pY) {
			var dX = this.pX - e.viewX;
			var dY = this.pY - e.viewY;
			this.pX = e.viewX;
			this.pY = e.viewY;
			this.pointerHasMoved = true;
			this.lastTime = 0;
			var accuracy = flambe_System.get_keyboard().isDown(flambe_input_Key.Control);
			if(accuracy) dX *= this.highAccuracy; else dX *= this.normalAccuracy;
			if(accuracy) dY *= this.highAccuracy; else dY *= this.normalAccuracy;
			this.dragDelta(dX,dY);
		}
	}
	,dragDelta: function(dX,dY) {
		var val = this.value.getValue(true) + dY;
		this.value.setValue(val > 1?1:val < 0?0:val,true);
	}
	,doubleClicked: function() {
		this.value.setValue(this.value.defaultValue);
	}
	,pointerUp: function(e) {
		if(this.moveConnection != null) {
			this.moveConnection.dispose();
			this.moveConnection = null;
		}
		if(!this.pointerHasMoved) {
			var t = flambe_System.get_time();
			var dt = t - this.lastTime;
			if(dt < .5) this.doubleClicked();
			this.lastTime = t;
		} else if(this.returnToDefault) this.returningToDefault = true;
	}
	,defaultLabelFormatter: function(value) {
		return webaudio_synth_ui_controls_NumericControl.roundValueForDisplay(value,3);
	}
	,onParameterChange: function(p) {
		if(p == this.value) this.updateDisplay();
	}
	,updateDisplay: function() {
	}
	,__class__: webaudio_synth_ui_controls_NumericControl
});
var webaudio_synth_ui_controls_OscSlider = function(name,defaultValue,parameterMapping) {
	this.lastPosition = -1;
	webaudio_synth_ui_controls_NumericControl.call(this,name,defaultValue,parameterMapping);
};
$hxClasses["webaudio.synth.ui.controls.OscSlider"] = webaudio_synth_ui_controls_OscSlider;
webaudio_synth_ui_controls_OscSlider.__name__ = true;
webaudio_synth_ui_controls_OscSlider.create = function(name) {
	if(name == null) name = "Slider";
	var textures = webaudio_Main.instance.textureAtlas;
	var ent = new flambe_Entity();
	ent.add(new flambe_display_ImageSprite(textures.get("OscSliderTrack"))).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("slider-thumb_50%")))).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("knob-hash_25%")).disablePointer())).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("Icon_Sine")).disablePointer())).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("Icon_Square")).disablePointer())).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("Icon_Sawtooth")).disablePointer())).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("Icon_Triangle")).disablePointer()));
	ent.add(new webaudio_synth_ui_controls_OscSlider(name,0,audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.INT,webaudio_synth_generator_OscillatorType.SINE,webaudio_synth_generator_OscillatorType.TRIANGLE)));
	return ent;
};
webaudio_synth_ui_controls_OscSlider.__super__ = webaudio_synth_ui_controls_NumericControl;
webaudio_synth_ui_controls_OscSlider.prototype = $extend(webaudio_synth_ui_controls_NumericControl.prototype,{
	onAdded: function() {
		this.display = this.owner.getComponent("Sprite_0");
		var sprites = this.owner.firstChild;
		this.thumb = sprites.getComponent("Sprite_0").centerAnchor();
		this.thumb.set_pointerEnabled(true);
		this.thumb.y.set__(6);
		sprites = sprites.next;
		this.knobHash = sprites.getComponent("Sprite_0").centerAnchor();
		this.knobHash.y.set__(3);
		this.knobHash.alpha.set__(0);
		this.knobHash.setTint(.6,1.2,1.8);
		var iconX = -17;
		var iconSpace = 37;
		var iconY = -32;
		sprites = sprites.next;
		this.sine = sprites.getComponent("Sprite_0");
		this.sine.x.set__(iconX);
		this.sine.y.set__(iconY);
		iconX += iconSpace;
		sprites = sprites.next;
		this.square = sprites.getComponent("Sprite_0");
		this.square.x.set__(iconX);
		this.square.y.set__(iconY - 2);
		iconX += iconSpace;
		sprites = sprites.next;
		this.sawtooth = sprites.getComponent("Sprite_0");
		this.sawtooth.x.set__(iconX + 1);
		this.sawtooth.y.set__(iconY);
		iconX += iconSpace;
		sprites = sprites.next;
		this.triangle = sprites.getComponent("Sprite_0");
		this.triangle.x.set__(iconX + 1);
		this.triangle.y.set__(iconY - 1);
		this.minX = 0;
		this.maxX = this.display.getNaturalWidth();
		this.thumb.get_pointerDown().connect($bind(this,this.pointerDown));
		webaudio_synth_ui_controls_NumericControl.prototype.onAdded.call(this);
	}
	,pointerDown: function(e) {
		this.knobHash.alpha.animateTo(1,.5,flambe_animation_Ease.quadOut);
		webaudio_synth_ui_controls_NumericControl.prototype.pointerDown.call(this,e);
	}
	,pointerUp: function(e) {
		this.knobHash.alpha.animateTo(0,.5,flambe_animation_Ease.quadOut);
		webaudio_synth_ui_controls_NumericControl.prototype.pointerUp.call(this,e);
	}
	,pointerMove: function(e) {
		if(e.viewX != this.pX || e.viewY != this.pY) {
			var dX = this.pX - e.viewX;
			var dY = this.pY - e.viewY;
			this.pX = e.viewX;
			this.pY = e.viewY;
			this.pointerHasMoved = true;
			this.lastTime = 0;
			this.dragDelta(dX,dY);
		}
	}
	,dragDelta: function(dX,dY) {
		var val = this.value.getValue(true) - dX / this.display.getNaturalWidth();
		this.value.setValue(val > 1?1:val < 0?0:val,true);
	}
	,updateDisplay: function() {
		this.setPosition(Math.round(this.value.getValue()));
	}
	,getIcon: function(type) {
		switch(type) {
		case webaudio_synth_generator_OscillatorType.SINE:
			return this.sine;
		case webaudio_synth_generator_OscillatorType.SQUARE:
			return this.square;
		case webaudio_synth_generator_OscillatorType.SAWTOOTH:
			return this.sawtooth;
		case webaudio_synth_generator_OscillatorType.TRIANGLE:
			return this.triangle;
		default:
			return null;
		}
	}
	,setPosition: function(value) {
		if(this.lastPosition != -1) this.getIcon(this.lastPosition).setTint(1,1,1,.5,flambe_animation_Ease.quartOut);
		this.getIcon(value).setTint(1.2,1.52,1.66,.25,flambe_animation_Ease.quadOut);
		var px = value / 3 * this.display.getNaturalWidth();
		this.thumb.x.animateTo(px,.1,flambe_animation_Ease.quadOut);
		this.knobHash.x.animateTo(px,.1,flambe_animation_Ease.quadOut);
		this.lastPosition = value;
	}
	,__class__: webaudio_synth_ui_controls_OscSlider
});
var webaudio_synth_ui_controls_PitchBendWheel = function(name,defaultValue,parameterMapping) {
	webaudio_synth_ui_controls_NumericControl.call(this,name,defaultValue,parameterMapping);
	this.normalAccuracy = 1;
	this.highAccuracy = .5;
	this.minY = 20;
};
$hxClasses["webaudio.synth.ui.controls.PitchBendWheel"] = webaudio_synth_ui_controls_PitchBendWheel;
webaudio_synth_ui_controls_PitchBendWheel.__name__ = true;
webaudio_synth_ui_controls_PitchBendWheel.create = function(name) {
	if(name == null) name = "Slider";
	var textures = webaudio_Main.instance.textureAtlas;
	var ent = new flambe_Entity();
	ent.add(new flambe_display_ImageSprite(textures.get("PitchBendBg"))).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("PitchBendDrag"))));
	ent.add(new webaudio_synth_ui_controls_PitchBendWheel(name,0,audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-1,1)));
	return ent;
};
webaudio_synth_ui_controls_PitchBendWheel.__super__ = webaudio_synth_ui_controls_NumericControl;
webaudio_synth_ui_controls_PitchBendWheel.prototype = $extend(webaudio_synth_ui_controls_NumericControl.prototype,{
	onAdded: function() {
		var display = this.owner.getComponent("Sprite_0");
		this.thumbRange = display.getNaturalHeight() - this.minY - this.minY;
		var sprites = this.owner.firstChild;
		this.thumb = sprites.getComponent("Sprite_0");
		this.thumb.x.set__(6);
		this.thumb.anchorY.set__(this.thumb.getNaturalHeight() / 2);
		webaudio_synth_ui_controls_NumericControl.prototype.onAdded.call(this);
	}
	,dragDelta: function(dX,dY) {
		var val = this.value.getValue(true) - dY / this.thumbRange;
		this.value.setValue(val > 1?1:val < 0?0:val,true);
	}
	,updateDisplay: function() {
		this.setPosition(this.value.getValue(true));
	}
	,setPosition: function(value) {
		var py = this.minY + value * this.thumbRange;
		this.thumb.x.set__(5);
		this.thumb.y.animateTo(py,.1,flambe_animation_Ease.quadOut);
	}
	,__class__: webaudio_synth_ui_controls_PitchBendWheel
});
var webaudio_synth_ui_controls_Rotary = function(name,defaultValue,parameterMapping,minAngle,maxAngle,radius) {
	this.labelUpdated = false;
	webaudio_synth_ui_controls_NumericControl.call(this,name,defaultValue,parameterMapping);
	this.minAngle = minAngle;
	this.maxAngle = maxAngle;
	this.radius = radius;
};
$hxClasses["webaudio.synth.ui.controls.Rotary"] = webaudio_synth_ui_controls_Rotary;
webaudio_synth_ui_controls_Rotary.__name__ = true;
webaudio_synth_ui_controls_Rotary.create = function(parameterMapping,defaultValue,minAngle,maxAngle,small,showLabel,name) {
	if(name == null) name = "Rotary";
	if(showLabel == null) showLabel = true;
	if(small == null) small = false;
	if(maxAngle == null) maxAngle = 2.5132741228718345;
	if(minAngle == null) minAngle = -2.5132741228718345;
	var textures = webaudio_Main.instance.textureAtlas;
	var ent = new flambe_Entity();
	ent.add(new flambe_display_ImageSprite(textures.get("knob_" + (small?"25":"50") + "%"))).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("knob-nipple_50%")))).addChild(new flambe_Entity().add(new flambe_display_ImageSprite(textures.get("knob-hash_50%"))));
	if(showLabel) ent.addChild(new flambe_Entity().add(webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime13,"0.00",2171187).setAlpha(.75)));
	ent.add(new webaudio_synth_ui_controls_Rotary(name,defaultValue,parameterMapping,minAngle,maxAngle,small?5.25:12));
	return ent;
};
webaudio_synth_ui_controls_Rotary.__super__ = webaudio_synth_ui_controls_NumericControl;
webaudio_synth_ui_controls_Rotary.prototype = $extend(webaudio_synth_ui_controls_NumericControl.prototype,{
	onAdded: function() {
		this.display = this.owner.getComponent("Sprite_0").centerAnchor();
		this.centreX = this.display.anchorX.get__();
		this.centreY = this.display.anchorY.get__();
		var sprites = this.owner.firstChild;
		this.knobDot = sprites.getComponent("Sprite_0").centerAnchor().disablePixelSnapping().disablePointer();
		sprites = sprites.next;
		this.knobHash = sprites.getComponent("Sprite_0");
		this.knobHash.x.set__(6);
		this.knobHash.y.set__(6);
		this.knobHash.alpha.set__(0);
		this.knobHash.setTint(.6,1.2,1.8);
		sprites = sprites.next;
		this.valueLabel = sprites.getComponent("Sprite_0");
		if(Std["is"](this.valueLabel,flambe_display_TextSprite)) {
			this.valueLabel.centerAnchor();
			this.valueLabel.y.set__(this.centreY + this.display.getNaturalHeight() / 2 + 7);
		} else this.valueLabel = null;
		webaudio_synth_ui_controls_NumericControl.prototype.onAdded.call(this);
	}
	,pointerDown: function(e) {
		this.knobHash.alpha.animateTo(.8,.5,flambe_animation_Ease.quadOut);
		webaudio_synth_ui_controls_NumericControl.prototype.pointerDown.call(this,e);
	}
	,pointerUp: function(e) {
		this.knobHash.alpha.animateTo(0,.5,flambe_animation_Ease.quadOut);
		webaudio_synth_ui_controls_NumericControl.prototype.pointerUp.call(this,e);
	}
	,doubleClicked: function() {
		this.knobHash.alpha.set__(1);
		this.knobHash.alpha.animateTo(0,1,flambe_animation_Ease.quartOut);
		webaudio_synth_ui_controls_NumericControl.prototype.doubleClicked.call(this);
	}
	,updateDisplay: function() {
		this.setKnobPosition();
		this.updateLabel();
		this.lastUpdate = flambe_System.get_time();
	}
	,updateLabel: function() {
		if(this.valueLabel != null) {
			this.valueLabel.set_text(this.labelFormatter(this.value.getValue()));
			this.valueLabel.centerAnchor();
			this.valueLabel.x.set__(this.centreX);
			this.valueLabel.alpha.set__(.7);
			this.labelUpdated = true;
		}
	}
	,onUpdate: function(dt) {
		webaudio_synth_ui_controls_NumericControl.prototype.onUpdate.call(this,dt);
		if(this.labelUpdated) {
			if(flambe_System.get_time() - this.lastUpdate > 2.5) {
				this.labelUpdated = false;
				this.valueLabel.alpha.animateTo(.2,2,flambe_animation_Ease.quadOut);
			}
		}
	}
	,setKnobPosition: function() {
		var norm = this.value.getValue(true);
		var range = Math.abs(this.maxAngle - this.minAngle);
		var angle = this.minAngle + norm * range;
		var px = this.centreX + Math.cos(angle - 3.141592653589793 / 2) * this.radius;
		var py = this.centreY + Math.sin(angle - 3.141592653589793 / 2) * this.radius;
		this.knobDot.setXY(px,py);
		var m = this.value.mapping;
		if(m.min < 0 && m.max > 0) {
			if(norm < .5) norm = 1 - norm * 2; else norm = (norm - .5) * 2;
		}
		this.knobHash.setTint(.6 + norm * 1,1.2 - norm * .8,1.8 - norm);
	}
	,__class__: webaudio_synth_ui_controls_Rotary
});
var webaudio_synth_ui_modules_ADSRModule = function(owner,textureAtlas) {
	this.init(owner,textureAtlas);
	this.position(651,96);
};
$hxClasses["webaudio.synth.ui.modules.ADSRModule"] = webaudio_synth_ui_modules_ADSRModule;
webaudio_synth_ui_modules_ADSRModule.__name__ = true;
webaudio_synth_ui_modules_ADSRModule.prototype = {
	init: function(owner,textureAtlas) {
		this.owner = owner;
		this._attack = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,10),.1,null,null,null,null,"adsrAttack");
		this._decay = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,10),1.0,null,null,null,null,"adsrDecay");
		this._sustain = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),1.0,null,null,null,null,"adsrSustain");
		this._release = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,10),0.25,null,null,null,null,"adsrRelease");
		this._panel = flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),8,8,280,192);
		this._diagram = new flambe_display_ImageSprite(textureAtlas.get("ADSRDiagram"));
		owner.addChild(new flambe_Entity().add(this._panel).addChild(this._attack).addChild(this._decay).addChild(this._sustain).addChild(this._release).addChild(new flambe_Entity().add(this._diagram)));
		this.attack = this._attack.getComponent("NumericControl_2");
		this.decay = this._decay.getComponent("NumericControl_2");
		this.sustain = this._sustain.getComponent("NumericControl_2");
		this.release = this._release.getComponent("NumericControl_2");
	}
	,position: function(panelX,panelY) {
		var rotarySpace = 64;
		var labelY = panelY + 12;
		var labelColour = 3289650;
		var labelAlpha = 0.55;
		var label;
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"AEG",labelColour).setAlpha(labelAlpha);
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX + 12);
		label.y.set__(labelY);
		this._panel.set_x(panelX);
		this._panel.set_y(panelY);
		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		this._diagram.x.set__(panelX);
		this._diagram.y.set__(panelY - 84);
		this._attack.getComponent("Sprite_0").x.set__(panelX);
		this._attack.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"attack",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._decay.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._decay.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"decay",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._sustain.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._sustain.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"sustain",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._release.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._release.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"release",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
	}
	,__class__: webaudio_synth_ui_modules_ADSRModule
};
var webaudio_synth_ui_modules_DelayModule = function(owner,textureAtlas) {
	this.owner = owner;
	this.init(owner,textureAtlas);
	this.position(420,296);
};
$hxClasses["webaudio.synth.ui.modules.DelayModule"] = webaudio_synth_ui_modules_DelayModule;
webaudio_synth_ui_modules_DelayModule.__name__ = true;
webaudio_synth_ui_modules_DelayModule.prototype = {
	init: function(owner,textureAtlas) {
		this._level = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),0.25,null,null,null,null,"delayLevel");
		this._time = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0.0001,1),.333,null,null,null,null,"delayTime");
		this._feedback = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,0.9999),0.25,null,null,null,null,"delayFeedback");
		this._lfpFreq = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,20,8000),8000,null,null,null,null,"delayLFPFreq");
		this._lfpQ = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0.0001,10),1,null,null,null,null,"delayLFPQ");
		this._panel = flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),8,8,360,192);
		owner.addChild(new flambe_Entity().add(this._panel).addChild(this._level).addChild(this._time).addChild(this._feedback).addChild(this._lfpFreq).addChild(this._lfpQ));
		this.level = this._level.getComponent("NumericControl_2");
		this.time = this._time.getComponent("NumericControl_2");
		this.feedback = this._feedback.getComponent("NumericControl_2");
		this.lfpFreq = this._lfpFreq.getComponent("NumericControl_2");
		this.lfpQ = this._lfpQ.getComponent("NumericControl_2");
	}
	,position: function(panelX,panelY) {
		var rotarySpace = 64;
		var labelY = panelY + 12;
		var labelColour = 3289650;
		var labelAlpha = 0.55;
		var label;
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"Delay",labelColour).setAlpha(labelAlpha);
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX + 12);
		label.y.set__(labelY);
		this._panel.set_x(panelX);
		this._panel.set_y(panelY);
		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		this._level.getComponent("Sprite_0").x.set__(panelX);
		this._level.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"level",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._time.getComponent("Sprite_0").x.set__(panelX);
		this._time.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"time",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._feedback.getComponent("Sprite_0").x.set__(panelX);
		this._feedback.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"feedback",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace + 16;
		this._lfpFreq.getComponent("Sprite_0").x.set__(panelX);
		this._lfpFreq.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"freq",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._lfpQ.getComponent("Sprite_0").x.set__(panelX);
		this._lfpQ.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"q",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
	}
	,__class__: webaudio_synth_ui_modules_DelayModule
};
var webaudio_synth_ui_modules_DistortionModule = function(owner,textureAtlas) {
	this.owner = owner;
	this.init(owner,textureAtlas);
	this.position(937,96);
};
$hxClasses["webaudio.synth.ui.modules.DistortionModule"] = webaudio_synth_ui_modules_DistortionModule;
webaudio_synth_ui_modules_DistortionModule.__name__ = true;
webaudio_synth_ui_modules_DistortionModule.prototype = {
	init: function(owner,textureAtlas) {
		this._pregain = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,12),0.0,null,null,null,null,"distortionPregain");
		this._waveshaperAmount = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-0.999,0.999),0.0,null,null,null,null,"distortionWaveshaperAmount");
		this._bits = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,1,24),12,null,null,null,null,"distortionBits");
		this._rateReduction = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,1,16),1,null,null,null,null,"distortionRateReduction");
		this._panel = flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),8,8,272,192);
		owner.addChild(new flambe_Entity().add(this._panel).addChild(this._pregain).addChild(this._waveshaperAmount).addChild(this._bits).addChild(this._rateReduction));
		this.pregain = this._pregain.getComponent("NumericControl_2");
		this.waveshaperAmount = this._waveshaperAmount.getComponent("NumericControl_2");
		this.bits = this._bits.getComponent("NumericControl_2");
		this.rateReduction = this._rateReduction.getComponent("NumericControl_2");
	}
	,position: function(panelX,panelY) {
		var rotarySpace = 64;
		var labelY = panelY + 12;
		var labelColour = 3289650;
		var labelAlpha = 0.55;
		var label;
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"Distortion",labelColour).setAlpha(labelAlpha);
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX + 12);
		label.y.set__(labelY);
		this._panel.set_x(panelX);
		this._panel.set_y(panelY);
		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		this._pregain.getComponent("Sprite_0").x.set__(panelX);
		this._pregain.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"gain",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._waveshaperAmount.getComponent("Sprite_0").x.set__(panelX);
		this._waveshaperAmount.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"shape",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._bits.getComponent("Sprite_0").x.set__(panelX);
		this._bits.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"crush",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._rateReduction.getComponent("Sprite_0").x.set__(panelX);
		this._rateReduction.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"reduce",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
	}
	,__class__: webaudio_synth_ui_modules_DistortionModule
};
var webaudio_synth_ui_modules_FilterModule = function(owner,textureAtlas) {
	this.owner = owner;
	this.init(owner,textureAtlas);
	this.position(791,296);
};
$hxClasses["webaudio.synth.ui.modules.FilterModule"] = webaudio_synth_ui_modules_FilterModule;
webaudio_synth_ui_modules_FilterModule.__name__ = true;
webaudio_synth_ui_modules_FilterModule.prototype = {
	position: function(panelX,panelY) {
		var rotarySpace = 64;
		var labelY = panelY + 12;
		var labelColour = 3289650;
		var labelAlpha = 0.55;
		var label;
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"Filter",labelColour).setAlpha(labelAlpha);
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX + 12);
		label.y.set__(labelY);
		this._panel.set_x(panelX);
		this._panel.set_y(panelY);
		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		this._type.getComponent("Sprite_0").x.set__(panelX);
		this._type.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"lp/hp",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._frequency.getComponent("Sprite_0").x.set__(panelX);
		this._frequency.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"freq",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._Q.getComponent("Sprite_0").x.set__(panelX);
		this._Q.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"q",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += 16;
		panelX += rotarySpace;
		this._attack.getComponent("Sprite_0").x.set__(panelX);
		this._attack.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"attack",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._release.getComponent("Sprite_0").x.set__(panelX);
		this._release.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"release",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		panelX += rotarySpace;
		this._range.getComponent("Sprite_0").x.set__(panelX);
		this._range.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"range",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
	}
	,init: function(owner,textureAtlas) {
		this._type = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.INT,0,1),0,null,null,null,null,"filterType");
		this._frequency = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,20,8000),8000.0,null,null,null,null,"filterFrequency");
		this._Q = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0.0001,10),1.0,null,null,null,null,"filterQ");
		this._attack = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,10),0.25,null,null,null,null,"filterAttack");
		this._release = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,10),0.5,null,null,null,null,"filterRelease");
		this._range = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),0.0,null,null,null,null,"filterRange");
		this._panel = flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),8,8,424,192);
		owner.addChild(new flambe_Entity().add(this._panel).addChild(this._type).addChild(this._frequency).addChild(this._Q).addChild(this._attack).addChild(this._release).addChild(this._range));
		this.type = this._type.getComponent("NumericControl_2");
		this.frequency = this._frequency.getComponent("NumericControl_2");
		this.Q = this._Q.getComponent("NumericControl_2");
		this.attack = this._attack.getComponent("NumericControl_2");
		this.release = this._release.getComponent("NumericControl_2");
		this.range = this._range.getComponent("NumericControl_2");
	}
	,__class__: webaudio_synth_ui_modules_FilterModule
};
var webaudio_synth_ui_modules_OscillatorsModule = function(owner,textureAtlas) {
	this.owner = owner;
	this.init(owner,textureAtlas);
	this.position(24,96);
};
$hxClasses["webaudio.synth.ui.modules.OscillatorsModule"] = webaudio_synth_ui_modules_OscillatorsModule;
webaudio_synth_ui_modules_OscillatorsModule.__name__ = true;
webaudio_synth_ui_modules_OscillatorsModule.prototype = {
	position: function(panelX,panelY) {
		var rotarySpace = 64;
		var labelY = 192;
		var labelColour = 3289650;
		var labelAlpha = 0.55;
		var label;
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"waveform",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX + 94);
		label.y.set__(labelY - 2);
		this._oscPanel.set_x(panelX);
		this._oscPanel.set_y(panelY);
		panelY += 42;
		this._osc0Type.getComponent("Sprite_0").x.set__(panelX + 38);
		this._osc0Type.getComponent("Sprite_0").y.set__(panelY + 12);
		panelX += 210;
		this._osc0Level.getComponent("Sprite_0").x.set__(panelX);
		this._osc0Level.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"level",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._osc0Pan.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc0Pan.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"pan",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._osc0Slide.getComponent("Sprite_0").x.set__(panelX += rotarySpace + 16);
		this._osc0Slide.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"slide",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._osc0Detune.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc0Detune.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"detune",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._osc0Random.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc0Random.getComponent("Sprite_0").y.set__(panelY);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"random",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY);
		this._oscPhase.getComponent("Sprite_0").x.set__(panelX += rotarySpace + rotarySpace / 4);
		this._oscPhase.getComponent("Sprite_0").y.set__(panelY + 54);
		label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"phase",labelColour).setAlpha(labelAlpha).centerAnchor();
		this.owner.addChild(new flambe_Entity().add(label));
		label.x.set__(panelX);
		label.y.set__(labelY + 54);
		panelX = 24;
		panelY += 96;
		this._osc1Type.getComponent("Sprite_0").x.set__(panelX + 38);
		this._osc1Type.getComponent("Sprite_0").y.set__(panelY + 12);
		panelX += 210;
		this._osc1Level.getComponent("Sprite_0").x.set__(panelX);
		this._osc1Level.getComponent("Sprite_0").y.set__(panelY);
		this._osc1Pan.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc1Pan.getComponent("Sprite_0").y.set__(panelY);
		this._osc1Slide.getComponent("Sprite_0").x.set__(panelX += rotarySpace + 16);
		this._osc1Slide.getComponent("Sprite_0").y.set__(panelY);
		this._osc1Detune.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc1Detune.getComponent("Sprite_0").y.set__(panelY);
		this._osc1Random.getComponent("Sprite_0").x.set__(panelX += rotarySpace);
		this._osc1Random.getComponent("Sprite_0").y.set__(panelY);
	}
	,init: function(owner,textureAtlas) {
		this._osc0Type = webaudio_synth_ui_controls_OscSlider.create("osc0Type");
		this._osc0Level = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),.5,null,null,null,null,"osc0Level");
		this._osc0Pan = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-1,1),0.0,null,null,null,null,"osc0Pan");
		this._osc0Slide = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0.001,1),0.1,null,null,null,null,"osc0Slide");
		this._osc0Detune = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-200,200),0.0,null,null,null,null,"osc0Detune");
		this._osc0Random = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,100),0.0,null,null,null,null,"osc0Random");
		this._osc1Type = webaudio_synth_ui_controls_OscSlider.create("osc1Type");
		this._osc1Level = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),.5,null,null,null,null,"osc1Level");
		this._osc1Pan = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-1,1),0.0,null,null,null,null,"osc1Pan");
		this._osc1Slide = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0.001,1),0.1,null,null,null,null,"osc1Slide");
		this._osc1Detune = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,-200,200),0.0,null,null,null,null,"osc1Detune");
		this._osc1Random = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,100),0.0,null,null,null,null,"osc1Random");
		this._oscPhase = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),0.0,null,null,null,null,"oscPhase");
		this._oscPanel = flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),8,8,616,192);
		owner.addChild(new flambe_Entity().add(this._oscPanel).addChild(this._osc0Type).addChild(this._osc0Level).addChild(this._osc0Pan).addChild(this._osc0Slide).addChild(this._osc0Detune).addChild(this._osc0Random).addChild(this._osc1Type).addChild(this._osc1Level).addChild(this._osc1Pan).addChild(this._osc1Slide).addChild(this._osc1Detune).addChild(this._osc1Random).addChild(this._oscPhase));
		this.osc0Type = this._osc0Type.getComponent("NumericControl_2");
		this.osc0Level = this._osc0Level.getComponent("NumericControl_2");
		this.osc0Pan = this._osc0Pan.getComponent("NumericControl_2");
		this.osc0Slide = this._osc0Slide.getComponent("NumericControl_2");
		this.osc0Detune = this._osc0Detune.getComponent("NumericControl_2");
		this.osc0Random = this._osc0Random.getComponent("NumericControl_2");
		this.osc1Type = this._osc1Type.getComponent("NumericControl_2");
		this.osc1Level = this._osc1Level.getComponent("NumericControl_2");
		this.osc1Pan = this._osc1Pan.getComponent("NumericControl_2");
		this.osc1Slide = this._osc1Slide.getComponent("NumericControl_2");
		this.osc1Detune = this._osc1Detune.getComponent("NumericControl_2");
		this.osc1Random = this._osc1Random.getComponent("NumericControl_2");
		this.oscPhase = this._oscPhase.getComponent("NumericControl_2");
	}
	,__class__: webaudio_synth_ui_modules_OscillatorsModule
};
var webaudio_synth_ui_modules_OutputModule = function(owner,textureAtlas) {
	this._outputLevel = webaudio_synth_ui_controls_Rotary.create(audio_parameter_mapping_MapFactory.getMapping(audio_parameter_mapping_MapType.FLOAT,0,1),1.0,null,null,null,null,"outputLevel");
	this._pitchBend = webaudio_synth_ui_controls_PitchBendWheel.create("pitchBend");
	owner.addChild((this._panel = new flambe_Entity().add(flambe_display_NineSlice.fromSubTexture(textureAtlas.get("InnerPanelBg"),16,16,386,192))).addChild(this._outputLevel).addChild(this._pitchBend));
	this.outputLevel = this._outputLevel.getComponent("NumericControl_2");
	this.pitchBend = this._pitchBend.getComponent("NumericControl_2");
	var panelX = 23;
	var panelY = 296;
	this._panel.getComponent("NineSlice_5").set_x(panelX);
	this._panel.getComponent("NineSlice_5").set_y(panelY);
	var labelY = panelY + 12;
	var labelColour = 3289650;
	var labelAlpha = 0.55;
	var label;
	label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"Output",labelColour).setAlpha(labelAlpha);
	owner.addChild(new flambe_Entity().add(label));
	label.x.set__(panelX + 12);
	label.y.set__(labelY);
	panelX += 43;
	panelY += 116;
	labelY = panelY + 54;
	this._outputLevel.getComponent("Sprite_0").x.set__(panelX);
	this._outputLevel.getComponent("Sprite_0").y.set__(panelY);
	label = webaudio_synth_ui_Fonts.getField(webaudio_synth_ui_Fonts.Prime20,"level",labelColour).setAlpha(labelAlpha).centerAnchor();
	owner.addChild(new flambe_Entity().add(label));
	label.x.set__(panelX);
	label.y.set__(labelY);
	this._pitchBend.getComponent("Sprite_0").x.set__(17);
	this._pitchBend.getComponent("Sprite_0").y.set__(549);
};
$hxClasses["webaudio.synth.ui.modules.OutputModule"] = webaudio_synth_ui_modules_OutputModule;
webaudio_synth_ui_modules_OutputModule.__name__ = true;
webaudio_synth_ui_modules_OutputModule.prototype = {
	__class__: webaudio_synth_ui_modules_OutputModule
};
var webaudio_utils_KeyboardInput = function(keyNotes) {
	this.heldNotes = [];
	this.noteOn = new flambe_util_Signal1();
	this.noteOff = new flambe_util_Signal1();
	this.keyToNote = keyNotes.keycodeToNoteIndex;
};
$hxClasses["webaudio.utils.KeyboardInput"] = webaudio_utils_KeyboardInput;
webaudio_utils_KeyboardInput.__name__ = true;
webaudio_utils_KeyboardInput.prototype = {
	qwertyKeyIsNote: function(code) {
		return this.keyToNote.exists(code);
	}
	,onQwertyKeyDown: function(code) {
		if(this.qwertyKeyIsNote(code)) this.onNoteKeyDown(this.keyToNote.get(code));
	}
	,onQwertyKeyUp: function(code) {
		if(this.get_noteCount() > 0 && this.keyToNote.exists(code)) this.onNoteKeyUp(this.keyToNote.get(code));
	}
	,onNoteKeyDown: function(noteIndex) {
		var i = Lambda.indexOf(this.heldNotes,noteIndex);
		if(i == -1) {
			this.noteOn.emit(noteIndex);
			this.heldNotes.push(noteIndex);
		}
	}
	,onNoteKeyUp: function(noteIndex) {
		var i = Lambda.indexOf(this.heldNotes,noteIndex);
		if(i != -1) this.noteOff.emit(this.heldNotes.splice(i,1)[0]);
	}
	,get_noteCount: function() {
		return this.heldNotes.length;
	}
	,get_lastNote: function() {
		if(this.get_noteCount() > 0) return this.heldNotes[this.get_noteCount() - 1]; else return -1;
	}
	,__class__: webaudio_utils_KeyboardInput
	,__properties__: {get_lastNote:"get_lastNote",get_noteCount:"get_noteCount"}
};
var webaudio_utils_KeyboardNotes = function(startOctave) {
	if(startOctave == null) startOctave = 0;
	this.startOctave = startOctave;
	this.noteFreq = new webaudio_utils_NoteFrequencyUtil();
	this.keycodeToNoteFreq = new haxe_ds_IntMap();
	this.keycodeToNoteIndex = new haxe_ds_IntMap();
	var value = this.noteFreq.noteNameToIndex("C" + startOctave);
	this.keycodeToNoteIndex.set(90,value);
	var value1 = this.noteFreq.noteNameToIndex("C#" + startOctave);
	this.keycodeToNoteIndex.set(83,value1);
	var value2 = this.noteFreq.noteNameToIndex("D" + startOctave);
	this.keycodeToNoteIndex.set(88,value2);
	var value3 = this.noteFreq.noteNameToIndex("D#" + startOctave);
	this.keycodeToNoteIndex.set(68,value3);
	var value4 = this.noteFreq.noteNameToIndex("E" + startOctave);
	this.keycodeToNoteIndex.set(67,value4);
	var value5 = this.noteFreq.noteNameToIndex("F" + startOctave);
	this.keycodeToNoteIndex.set(86,value5);
	var value6 = this.noteFreq.noteNameToIndex("F#" + startOctave);
	this.keycodeToNoteIndex.set(71,value6);
	var value7 = this.noteFreq.noteNameToIndex("G" + startOctave);
	this.keycodeToNoteIndex.set(66,value7);
	var value8 = this.noteFreq.noteNameToIndex("G#" + startOctave);
	this.keycodeToNoteIndex.set(72,value8);
	var value9 = this.noteFreq.noteNameToIndex("A" + startOctave);
	this.keycodeToNoteIndex.set(78,value9);
	var value10 = this.noteFreq.noteNameToIndex("A#" + startOctave);
	this.keycodeToNoteIndex.set(74,value10);
	var value11 = this.noteFreq.noteNameToIndex("B" + startOctave);
	this.keycodeToNoteIndex.set(77,value11);
	var value12 = this.noteFreq.noteNameToIndex("C" + (startOctave + 1));
	this.keycodeToNoteIndex.set(81,value12);
	var value13 = this.noteFreq.noteNameToIndex("C#" + (startOctave + 1));
	this.keycodeToNoteIndex.set(50,value13);
	var value14 = this.noteFreq.noteNameToIndex("D" + (startOctave + 1));
	this.keycodeToNoteIndex.set(87,value14);
	var value15 = this.noteFreq.noteNameToIndex("D#" + (startOctave + 1));
	this.keycodeToNoteIndex.set(51,value15);
	var value16 = this.noteFreq.noteNameToIndex("E" + (startOctave + 1));
	this.keycodeToNoteIndex.set(69,value16);
	var value17 = this.noteFreq.noteNameToIndex("F" + (startOctave + 1));
	this.keycodeToNoteIndex.set(82,value17);
	var value18 = this.noteFreq.noteNameToIndex("F#" + (startOctave + 1));
	this.keycodeToNoteIndex.set(53,value18);
	var value19 = this.noteFreq.noteNameToIndex("G" + (startOctave + 1));
	this.keycodeToNoteIndex.set(84,value19);
	var value20 = this.noteFreq.noteNameToIndex("G#" + (startOctave + 1));
	this.keycodeToNoteIndex.set(54,value20);
	var value21 = this.noteFreq.noteNameToIndex("A" + (startOctave + 1));
	this.keycodeToNoteIndex.set(89,value21);
	var value22 = this.noteFreq.noteNameToIndex("A#" + (startOctave + 1));
	this.keycodeToNoteIndex.set(55,value22);
	var value23 = this.noteFreq.noteNameToIndex("B" + (startOctave + 1));
	this.keycodeToNoteIndex.set(85,value23);
	var value24 = this.noteFreq.noteNameToIndex("C" + (startOctave + 2));
	this.keycodeToNoteIndex.set(73,value24);
	var value25 = this.noteFreq.noteNameToIndex("C#" + (startOctave + 2));
	this.keycodeToNoteIndex.set(57,value25);
	var value26 = this.noteFreq.noteNameToIndex("D" + (startOctave + 2));
	this.keycodeToNoteIndex.set(79,value26);
	var value27 = this.noteFreq.noteNameToIndex("D#" + (startOctave + 2));
	this.keycodeToNoteIndex.set(48,value27);
	var value28 = this.noteFreq.noteNameToIndex("E" + (startOctave + 2));
	this.keycodeToNoteIndex.set(80,value28);
	var value29 = this.noteFreq.noteNameToIndex("F" + (startOctave + 2));
	this.keycodeToNoteIndex.set(219,value29);
	var value30 = this.noteFreq.noteNameToIndex("F#" + (startOctave + 2));
	this.keycodeToNoteIndex.set(187,value30);
	var value31 = this.noteFreq.noteNameToIndex("G" + (startOctave + 2));
	this.keycodeToNoteIndex.set(221,value31);
	var value32 = this.keycodeToNoteIndex.get(90);
	this.keycodeToNoteFreq.set(90,value32);
	var value33 = this.keycodeToNoteIndex.get(83);
	this.keycodeToNoteFreq.set(83,value33);
	var value34 = this.keycodeToNoteIndex.get(88);
	this.keycodeToNoteFreq.set(88,value34);
	var value35 = this.keycodeToNoteIndex.get(68);
	this.keycodeToNoteFreq.set(68,value35);
	var value36 = this.keycodeToNoteIndex.get(67);
	this.keycodeToNoteFreq.set(67,value36);
	var value37 = this.keycodeToNoteIndex.get(86);
	this.keycodeToNoteFreq.set(86,value37);
	var value38 = this.keycodeToNoteIndex.get(71);
	this.keycodeToNoteFreq.set(71,value38);
	var value39 = this.keycodeToNoteIndex.get(66);
	this.keycodeToNoteFreq.set(66,value39);
	var value40 = this.keycodeToNoteIndex.get(72);
	this.keycodeToNoteFreq.set(72,value40);
	var value41 = this.keycodeToNoteIndex.get(78);
	this.keycodeToNoteFreq.set(78,value41);
	var value42 = this.keycodeToNoteIndex.get(74);
	this.keycodeToNoteFreq.set(74,value42);
	var value43 = this.keycodeToNoteIndex.get(77);
	this.keycodeToNoteFreq.set(77,value43);
	var value44 = this.keycodeToNoteIndex.get(81);
	this.keycodeToNoteFreq.set(81,value44);
	var value45 = this.keycodeToNoteIndex.get(50);
	this.keycodeToNoteFreq.set(50,value45);
	var value46 = this.keycodeToNoteIndex.get(87);
	this.keycodeToNoteFreq.set(87,value46);
	var value47 = this.keycodeToNoteIndex.get(51);
	this.keycodeToNoteFreq.set(51,value47);
	var value48 = this.keycodeToNoteIndex.get(69);
	this.keycodeToNoteFreq.set(69,value48);
	var value49 = this.keycodeToNoteIndex.get(82);
	this.keycodeToNoteFreq.set(82,value49);
	var value50 = this.keycodeToNoteIndex.get(53);
	this.keycodeToNoteFreq.set(53,value50);
	var value51 = this.keycodeToNoteIndex.get(84);
	this.keycodeToNoteFreq.set(84,value51);
	var value52 = this.keycodeToNoteIndex.get(54);
	this.keycodeToNoteFreq.set(54,value52);
	var value53 = this.keycodeToNoteIndex.get(89);
	this.keycodeToNoteFreq.set(89,value53);
	var value54 = this.keycodeToNoteIndex.get(55);
	this.keycodeToNoteFreq.set(55,value54);
	var value55 = this.keycodeToNoteIndex.get(85);
	this.keycodeToNoteFreq.set(85,value55);
	var value56 = this.keycodeToNoteIndex.get(73);
	this.keycodeToNoteFreq.set(73,value56);
	var value57 = this.keycodeToNoteIndex.get(57);
	this.keycodeToNoteFreq.set(57,value57);
	var value58 = this.keycodeToNoteIndex.get(79);
	this.keycodeToNoteFreq.set(79,value58);
	var value59 = this.keycodeToNoteIndex.get(48);
	this.keycodeToNoteFreq.set(48,value59);
	var value60 = this.keycodeToNoteIndex.get(80);
	this.keycodeToNoteFreq.set(80,value60);
	var value61 = this.keycodeToNoteIndex.get(219);
	this.keycodeToNoteFreq.set(219,value61);
	var value62 = this.keycodeToNoteIndex.get(187);
	this.keycodeToNoteFreq.set(187,value62);
	var value63 = this.keycodeToNoteIndex.get(221);
	this.keycodeToNoteFreq.set(221,value63);
};
$hxClasses["webaudio.utils.KeyboardNotes"] = webaudio_utils_KeyboardNotes;
webaudio_utils_KeyboardNotes.__name__ = true;
webaudio_utils_KeyboardNotes.prototype = {
	__class__: webaudio_utils_KeyboardNotes
};
var webaudio_utils_NoteFrequencyUtil = function() {
	if(webaudio_utils_NoteFrequencyUtil.pitchNames == null) {
		webaudio_utils_NoteFrequencyUtil.pitchNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
		webaudio_utils_NoteFrequencyUtil.altPitchNames = [null,"Db",null,"Eb",null,null,"Gb",null,"Ab",null,"Bb",null];
	}
	this.noteFrequencies = new Float32Array(128);
	this.noteNames = [];
	this._octaveMiddleC = 3;
	this.set_tuningBase(440.0);
};
$hxClasses["webaudio.utils.NoteFrequencyUtil"] = webaudio_utils_NoteFrequencyUtil;
webaudio_utils_NoteFrequencyUtil.__name__ = true;
webaudio_utils_NoteFrequencyUtil.prototype = {
	reset: function() {
		var _g = 0;
		while(_g < 128) {
			var i = _g++;
			this.noteNames[i] = this.indexToName(i);
			this.noteFrequencies[i] = this.indexToFrequency(i);
		}
	}
	,noteIndexToFrequency: function(index) {
		if(index >= 0 && index < 128) return this.noteFrequencies[index];
		return Math.NaN;
	}
	,detuneFreq: function(freq,cents) {
		if(cents < 0) return freq / Math.pow(2,-cents * 0.00083333333333333339); else if(cents > 0) return freq * Math.pow(2,cents * 0.00083333333333333339);
		return freq;
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
	,indexToFrequency: function(index) {
		return this.get_tuningBase() * Math.pow(2,(index - 69.0) * 0.083333333333333329);
	}
	,indexToName: function(index) {
		var pitch = index % 12;
		var octave = Std["int"](index * 0.083333333333333329) - (5 - this.get_octaveMiddleC());
		var noteName = webaudio_utils_NoteFrequencyUtil.pitchNames[pitch] + octave;
		if(webaudio_utils_NoteFrequencyUtil.altPitchNames[pitch] != null) noteName += "/" + webaudio_utils_NoteFrequencyUtil.altPitchNames[pitch] + octave;
		return noteName;
	}
	,get_tuningBase: function() {
		return this._tuningBase;
	}
	,set_tuningBase: function(value) {
		this._tuningBase = value;
		this.invTuningBase = 1.0 / (this._tuningBase * 0.5);
		this.reset();
		return this._tuningBase;
	}
	,get_octaveMiddleC: function() {
		return this._octaveMiddleC;
	}
	,__class__: webaudio_utils_NoteFrequencyUtil
	,__properties__: {get_octaveMiddleC:"get_octaveMiddleC",set_tuningBase:"set_tuningBase",get_tuningBase:"get_tuningBase"}
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
var Node = Reflect.getProperty(js_Browser.get_window(),"OscillatorNode");
if(Node != null) {
	if(Reflect.hasField(Node,"SINE")) {
		window.OscillatorTypeShim = {SINE:Node.SINE, SQUARE:Node.SQUARE, TRIANGLE:Node.TRIANGLE, SAWTOOTH:Node.SAWTOOTH, CUSTOM:Node.CUSTOM}
	} else {
		window.OscillatorTypeShim = {SINE:"sine", SQUARE:"square", TRIANGLE:"triangle", SAWTOOTH:"sawtooth", CUSTOM:"custom"}
	}
}
var Node = Reflect.getProperty(js_Browser.get_window(),"BiquadFilterNode");
if(Node != null) {
	if(Reflect.hasField(Node,"LOWPASS")) {
		window.FilterTypeShim = {ALLPASS:Node.ALLPASS, BANDPASS:Node.BANDPASS, HIGHPASS:Node.HIGHPASS, HIGHSHELF:Node.HIGHSHELF, LOWPASS:Node.LOWPASS, LOWSHELF:Node.LOWSHELF, NOTCH:Node.NOTCH, PEAKING:Node.PEAKING}
	} else {
		window.FilterTypeShim = {ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}
	}
}
flambe_platform_html_HtmlPlatform.instance = new flambe_platform_html_HtmlPlatform();
flambe_util_SignalBase.DISPATCHING_SENTINEL = new flambe_util_SignalConnection(null,null);
flambe_System.root = new flambe_Entity();
flambe_System.uncaughtError = new flambe_util_Signal1();
flambe_System.hidden = new flambe_util_Value(false);
flambe_System.volume = new flambe_animation_AnimatedFloat(1);
flambe_System._platform = flambe_platform_html_HtmlPlatform.instance;
flambe_System._calledInit = false;
flambe_Log.logger = flambe_System.createLogger("flambe");
flambe_asset_Manifest.__meta__ = { obj : { assets : [{ bootstrap : [{ bytes : 36282, md5 : "a8d2809c1bde26e2863279b7063b27bb", name : "font/Prime13.fnt"},{ bytes : 6789, md5 : "a5e204dcb7f4ea16084cc6dc8992aa44", name : "font/Prime13_0.png"},{ bytes : 36282, md5 : "ed0b12cefe3347b38ceeef6f9906945d", name : "font/Prime14.fnt"},{ bytes : 7477, md5 : "e12fc759beeac6ab64b5be1d887874d8", name : "font/Prime14_0.png"},{ bytes : 25928, md5 : "275955a2886df7e2e78ff63f3ff09897", name : "font/Prime20.fnt"},{ bytes : 11135, md5 : "80ce085528ba12587a04562ca0450332", name : "font/Prime20_0.png"},{ bytes : 2160, md5 : "379d68386232530f1d7ed43f5420b11c", name : "font/Prime20_1.png"},{ bytes : 25928, md5 : "aa6bd205c87cab4c8a8b55cd9f144c7f", name : "font/Prime22.fnt"},{ bytes : 10598, md5 : "6ae0c93e0c18711e92c6d09e7f404e05", name : "font/Prime22_0.png"},{ bytes : 4532, md5 : "3346d1965b9b92034c53dc4299aeb9a5", name : "font/Prime22_1.png"},{ bytes : 38204, md5 : "07486cd37b710833e5aff926c2b67fa7", name : "font/Prime24.fnt"},{ bytes : 7852, md5 : "5e5367359a16e3b6610ffd9cbf7a2096", name : "font/Prime24_0.png"},{ bytes : 7390, md5 : "988156320ad6e33245ab65bdc77fa568", name : "font/Prime24_1.png"},{ bytes : 38172, md5 : "429083da87bdebde91624c6a2c1a4749", name : "font/Prime32.fnt"},{ bytes : 29282, md5 : "9aad77450eaeb3bf367ad3333bfa3fd9", name : "font/Prime32_0.png"},{ bytes : 136445, md5 : "be3a3c108d556062d9954ea8ce82b2e4", name : "sprites.png"},{ bytes : 2305, md5 : "39ac61b4a782c4e386053ce9b29f2f28", name : "sprites.xml"}]}]}};
flambe_asset_Manifest._supportsCrossOrigin = (function() {
	var detected = (function() {
		if(js_Browser.get_navigator().userAgent.indexOf("Linux; U; Android") >= 0) return false;
		var xhr = new XMLHttpRequest();
		return xhr.withCredentials != null;
	})();
	if(!detected) flambe_Log.warn("This browser does not support cross-domain asset loading, any Manifest.remoteBase setting will be ignored.");
	return detected;
})();
flambe_display_Sprite._scratchPoint = new flambe_math_Point();
flambe_display_Font.NEWLINE = new flambe_display_Glyph(10);
flambe_platform_BasicKeyboard._sharedEvent = new flambe_input_KeyboardEvent();
flambe_platform_BasicMouse._sharedEvent = new flambe_input_MouseEvent();
flambe_platform_BasicPointer._sharedEvent = new flambe_input_PointerEvent();
flambe_platform_html_CanvasRenderer.CANVAS_TEXTURES = (function() {
	var pattern = new EReg("(iPhone|iPod|iPad)","");
	return pattern.match(js_Browser.get_window().navigator.userAgent);
})();
flambe_platform_html_HtmlAssetPackLoader._mediaRefCount = 0;
flambe_platform_html_HtmlAssetPackLoader._detectBlobSupport = true;
flambe_platform_html_HtmlUtil.VENDOR_PREFIXES = ["webkit","moz","ms","o","khtml"];
flambe_platform_html_HtmlUtil.SHOULD_HIDE_MOBILE_BROWSER = js_Browser.get_window().top == js_Browser.get_window() && new EReg("Mobile(/.*)? Safari","").match(js_Browser.get_navigator().userAgent);
flambe_platform_html_WebAudioSound._detectSupport = true;
flambe_platform_html_WebGLGraphics._scratchMatrix = new flambe_math_Matrix();
haxe_ds_ObjectMap.count = 0;
haxe_xml_Parser.escapes = (function($this) {
	var $r;
	var h = new haxe_ds_StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
webaudio_synth_generator_OscillatorType.SINE = 0;
webaudio_synth_generator_OscillatorType.SQUARE = 1;
webaudio_synth_generator_OscillatorType.SAWTOOTH = 2;
webaudio_synth_generator_OscillatorType.TRIANGLE = 3;
webaudio_synth_generator_OscillatorType.CUSTOM = 4;
webaudio_synth_processor_FilterType.ALLPASS = 0;
webaudio_synth_processor_FilterType.BANDPASS = 1;
webaudio_synth_processor_FilterType.HIGHPASS = 2;
webaudio_synth_processor_FilterType.HIGHSHELF = 3;
webaudio_synth_processor_FilterType.LOWPASS = 4;
webaudio_synth_processor_FilterType.LOWSHELF = 5;
webaudio_synth_processor_FilterType.NOTCH = 6;
webaudio_synth_processor_FilterType.PEAKING = 7;
webaudio_Main.main();
})();

//# sourceMappingURL=main-html.js.map