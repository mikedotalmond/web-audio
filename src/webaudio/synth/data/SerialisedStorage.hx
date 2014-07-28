package webaudio.synth.data;

import js.html.Storage;
import js.Browser;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class SerialisedStorage {
	
	var local	(default, null):Storage;
	var session	(default, null):Storage;
	
	static var _instance:SerialisedStorage;
	public static var instance(get, never):SerialisedStorage;
	
	function new() {
		local 	= Browser.getLocalStorage();
		session = Browser.getSessionStorage();
	}
	
	
	/**
	 * Copy everything in the local storage to current session
	 */
	public function localToSession() {
		for (i in 0...local.length) {
			var key = local.key(i);
			setSessionData(key, local.getItem(key));
		}
	}
	
	
	/**
	 * Copy everything in the current session to local storage
	 */
	public function sessionToLocal() {
		for (i in 0...session.length) {
			var key = session.key(i);
			setLocalData(key, local.getItem(key));
		}
	}
	
	
	inline public function clearSessionData() session.clear();
	inline public function clearLocalData()	local.clear();
	inline public function clearAll() {
		clearLocalData();
		clearSessionData();
	}
	
	inline public function removeSessionData(name:String) session.removeItem(name);
	inline public function removeLocalData(name:String) local.removeItem(name);
	
	inline public function setSessionData(name:String, data:String) session.setItem(name, data);
	inline public function setLocalData(name:String, data:String) local.setItem(name, data);
	
	inline public function getSessionData(name:String):String return session.getItem(name);
	inline public function getLocalData(name:String):String return local.getItem(name);
	inline public function getLocalDataCount():Int return local.length;
	inline public function getLocalDataAt(index:Int) return local.getItem(local.key(index));
	inline public function getLocalDataKeys():Array<String> {
		var n = getLocalDataCount();
		return [for (i in 0...n) local.key(i)];
	}
		
	
	static inline function get_instance() {
		return _instance == null ? (_instance = new SerialisedStorage()) : _instance;
	}
}