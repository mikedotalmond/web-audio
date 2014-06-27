package webaudio.synth.data;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import flambe.System;
import haxe.Json;
import js.Browser;
import webaudio.synth.data.Settings;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ParameterSerialiser implements ParameterObserver {
	
	static inline var SessionDataKey:String = 'monosynth_sessionParameters';
	static inline var PresetDataKey	:String = 'monosynth_presetParameters_';
	
	var settings:Settings;
	var map		:Map<String, Parameter>;
	
	
	public var presetNames(get, never):Array<String>;
	
	
	public function new(settings:Settings) {
		
		this.settings 	= settings;
		map 			= new Map<String,Parameter>();
		
		Browser.window.addEventListener('beforeunload', function(e) {
			storeSession();
		});
	}
	
	
	public function storePreset(name:String) {
		settings.setLocalData(PresetDataKey + name, serialise());
	}
	
	
	public function removePreset(name:String) {
		settings.removeLocalData(PresetDataKey + name);
	}
	
	
	public function restorePreset(name:String) {
		var data = settings.getLocalData(PresetDataKey + name);
		if (data != null) {
			trace('Restoring $name...');
			deserialise(data);
		} else {
			trace('restorePreset - there is no preset with the name $name');
		}
	}
	
	
	public function restoreSession() {
		var session = settings.getSessionData(SessionDataKey);
		if (session != null) {
			trace('Restoring parameters from previous session...');
			deserialise(session);
		}
	}
	
	
	public function storeSession() {
		settings.setSessionData(SessionDataKey, serialise());
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
	
	
	
	function get_presetNames():Array<String> {
		var out = [];
		for (key in settings.getLocalDataKeys()) {
			if (key.indexOf(PresetDataKey) == 0) {
				out.push(key.substring(PresetDataKey.length));
			}
		}
		return out;
	}
}