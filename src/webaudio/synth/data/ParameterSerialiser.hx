package webaudio.synth.data;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import flambe.System;
import haxe.Json;
import js.Browser;


/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ParameterSerialiser implements ParameterObserver {
	
	var sessionDataKey	:String;
	var presetDataKey	:String;
	
	var storage			:SerialisedStorage;
	var map				:Map<String, Parameter>;
	
	public var presetNames(get, never):Array<String>;
	
	
	public function new(name:String) {
		
		sessionDataKey 	= '${name}_sessionParameters';
		presetDataKey 	= '${name}_presetParameters_';
		
		storage 		= SerialisedStorage.instance;
		map 			= new Map<String,Parameter>();
		
		Browser.window.addEventListener('beforeunload', function(e) {
			storeSession();
		});
	}
	
	
	public function storePreset(name:String) {
		storage.setLocalData(presetDataKey + name, serialise());
	}
	
	
	public function removePreset(name:String) {
		storage.removeLocalData(presetDataKey + name);
	}
	
	
	public function restorePreset(name:String):Bool {
		var data = storage.getLocalData(presetDataKey + name);
		if (data != null) {
			trace('Restoring $name...');
			deserialise(data);
			return true;
		}
		
		trace('restorePreset - there is no preset with the name $name');
		return false;
	}
	
	
	public function restoreSession():Bool {
		var session = storage.getSessionData(sessionDataKey);
		if (session != null) {
			trace('Restoring parameters from previous session...');
			deserialise(session);
			return true;
		}
		return false;
	}
	
	
	public function storeSession() {
		storage.setSessionData(sessionDataKey, serialise());
	}
	
	
	/* INTERFACE audio.parameter.ParameterObserver */
	public function onParameterChange(parameter:Parameter):Void {
		if(!map.exists(parameter.name)) map.set(parameter.name, parameter);
	}
	
	public function resetAll() {
		for (key in map.keys()) {
			map.get(key).setToDefault();
		}
	}
	
	public function randomiseAll(amount:Float=1) {
		for (key in map.keys()) {
			var p = map.get(key);
			var v = p.getValue(true);
			v += (Math.random() - .5) * amount * 2;
			v = v < 0 ? -v : (v > 1 ? v-1 : v);
			p.setValue(v, true);
		}
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
		for (key in storage.getLocalDataKeys()) {
			if (key.indexOf(presetDataKey) == 0) {
				out.push(key.substring(presetDataKey.length));
			}
		}
		return out;
	}
}


class Presets {
	
	var presets:Map<String,String>;
	
	public var names(get, never):Iterator<String>;
	inline function get_names() return presets.keys();
	
	public inline function get(name):String return presets.get(name);
	
	public function new() {
		init();
	}
	
	function init() {
		
	}
}