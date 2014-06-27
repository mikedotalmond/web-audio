package audio.parameter;
/**
 * ...
 * @author Mike Almond
 */

import flambe.util.Signal1.Signal1;
import flambe.util.SignalConnection;

import audio.parameter.mapping.MapBool;
import audio.parameter.mapping.Mapping;
import audio.parameter.mapping.MapFactory;

class Parameter {
	
	var observers:Map<ParameterObserver, SignalConnection>;
	
	public var name:String;
	
	public var normalisedValue(default, null):Float;
	
	public var defaultValue(default, null):Float;
	public var normalisedDefaultValue(default, null):Float;
	
	public var mapping(default, null):Mapping;
	public var change(default, null):Signal1<Parameter>;
	
	
	public function new(name:String, defaultValue:Float, mapping:Mapping) {
		
		change = new Signal1<Parameter>();
		observers = new Map<ParameterObserver,SignalConnection>();
		
		this.name 	 = name;
		this.mapping = mapping;
		
		setDefault(defaultValue);
	}
	
	
	public function setDefault(value:Float, normalised:Bool = false) {
		var nv;
		
		if (normalised) {
			nv	  = value;
			value = mapping.map(nv);
		} else {
			nv = mapping.mapInverse(value);
		}
		
		normalisedDefaultValue 	= nv;
		defaultValue 			= value;
		
		setValue(nv, true);
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
	
	public function setToDefault() {
		setValue(normalisedDefaultValue, true);
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
	
	public function addObservers(observers:Array<ParameterObserver>, triggerImmediately = false, once = false) {
		for (observer in observers) {
			addObserver(observer, triggerImmediately, once);
		}
	}
	
	
	public function addObserver(observer:ParameterObserver, triggerImmediately=false, once=false) {
		if (!observers.exists(observer)) {
			var conn = change.connect(observer.onParameterChange);
			
			if (once) conn.once();
			else observers.set(observer, conn);
		}
		
		if (triggerImmediately) observer.onParameterChange(this);
	}
	
	public function removeObserver(o:ParameterObserver) {
		if (observers.exists(o)) {
			observers.get(o).dispose();
			observers.remove(o);
		}
	}
	
	public function toString():String {
		return '[Parameter] ${name}, defaultValue:${defaultValue}, mapping:${mapping.toString()}';
	}
}