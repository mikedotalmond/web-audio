package audio.parameter;
/**
 * ...
 * @author Mike Almond
 */

import flambe.util.Signal1.Signal1;
import flambe.util.SignalConnection;

import audio.parameter.mapping.MapBool;
import audio.parameter.mapping.IMapping;
import audio.parameter.mapping.MapFactory;

class Parameter {
	
	var observers:Map<IParameterObserver, SignalConnection>;
	
	var normalisedValue:Float;
	
	public var name:String;
	public var defaultValue:Float;
	
	public var mapping(default, null):IMapping;
	public var change(default, null):Signal1<Parameter>;
	
	
	public function new(name:String, defaultValue:Float, mapping:IMapping) {
		
		change = new Signal1<Parameter>();
		observers = new Map<IParameterObserver,SignalConnection>();
		
		this.name 			= name;
		this.defaultValue	= defaultValue;
		this.mapping		= mapping;
		
		normalisedValue = 0;
		setValue(defaultValue);
	}
	
	public function setValue(value:Float, normalised:Bool = false, forced:Bool = false):Void {
		
		var nv:Float;
		
		if (normalised) nv = value;
		else nv = mapping.mapInverse(value);
		
		if (forced || nv != normalisedValue) {
			normalisedValue = nv;
			change.emit(this);
		}
	}
	
	public function getValue(normalised:Bool = false):Float {
		if (normalised) return normalisedValue;
		return mapping.map(normalisedValue);
	}
	
	public function toggleBool() {
		if (Std.is(mapping, MapBool)) {
			normalisedValue = (normalisedValue == 0) ? 1 : 0;
			change.emit(this);
		}
	}
	
	public function addObserver(observer:IParameterObserver, triggerImmediately=false, once=false) {
		if (!observers.exists(observer)) {
			var conn = change.connect(observer.onParameterChange);
			
			if (once) conn.once();
			else observers.set(observer, conn);
		}
		
		if (triggerImmediately) observer.onParameterChange(this);
	}
	
	public function removeObserver(o:IParameterObserver) {
		if (observers.exists(o)) {
			observers.get(o).dispose();
			observers.remove(o);
		}
	}
	
	public function toString():String {
		return '[Parameter] ${name}, defaultValue:${defaultValue}, mapping:${mapping.toString()}';
	}
}