package webaudio.synth.data;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import haxe.Json;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ParameterSerialiser implements ParameterObserver {

	var map:Map<String, Parameter>;

	public function new() {
		map = new Map<String,Parameter>();
	}
	
	
	/* INTERFACE audio.parameter.ParameterObserver */
	public function onParameterChange(parameter:Parameter):Void {
		if(!map.exists(parameter.name)) map.set(parameter.name, parameter);
	}
	
	
	/**
	 * Store all the current parameter values
	 * @return
	 */
	public function serialise():String {
		var out = { };
		for (key in map.keys()) {
			Reflect.setField(out, key, map.get(key).normalisedValue);
		}
		return Json.stringify(out);
	}	
	
	
	/**
	 * Deserialises a Parameter-set and upadtes existing paramters
	 * @param	data
	 */
	public function deserialise(data:String, setAsDefault:Bool = false) {
		var input = Json.parse(data);
		for (field in Reflect.fields(input)) {
			if (map.exists(field)) {
				var value = Std.parseFloat(Reflect.field(input, field));
				if (setAsDefault) {
					map.get(field).setDefault(value, true);
				} else {
					map.get(field).setValue(value, true);
				}
			}
		}
	}
}