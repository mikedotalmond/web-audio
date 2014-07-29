package webaudio.synth.data;

/**
 * Storage for 'built-in' presets
 * override init and populate the presets map with name:serialisedPreset pairs.
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class Presets {
	
	var presets:Map<String,String>;
	
	public var names(get, never):Iterator<String>;
	inline function get_names() return presets.keys();
	
	public inline function get(name):String return presets.get(name);
	
	public function new() {
		init();
	}
	
	function init() {
		throw 'ImplementationError - override in a subclass';
	}
}