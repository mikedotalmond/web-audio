package audio.time;
import flambe.util.Signal0;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */
@:allow(audio.time)
class TimeSignature {
	
	public var barLength(get, never):Float;
	public var beatLength(get, never):Float;
	public var quarterNotesPerBeat(get, never):Float;
	
	public var beatsPerBar(get, set):Int;
	public var beatNoteValue(get, set):Int;
	public var change(default, null):Signal0;
	
	/**
	 *	The lower numeral (beatNoteValue) indicates the note value that represents one beat (the beat unit).
	 *	The upper numeral (beatsPerBar) indicates how many such beats there are in a bar.
	 *
	 * @param	beatsPerBar
	 * @param	beatNoteValue
	 */
	public function new(beatsPerBar:Int = 4, beatNoteValue:Int = 4) {
		_beatsPerBar	= beatsPerBar;
		_beatNoteValue 	= beatNoteValue;
		change 			= new Signal0();
	}
	
	public function set(beatsPerBar:Int, beatNoteValue:Int) {
		_beatsPerBar = beatsPerBar;
		_beatNoteValue = beatNoteValue;
		change.emit();
	}
	
	public inline function toString():String return '${beatsPerBar}/${beatNoteValue}';
	
	var _beatsPerBar:Int;
	inline function get_beatsPerBar():Int return _beatsPerBar;
	function set_beatsPerBar(value:Int):Int {
		change.emit();
		return _beatsPerBar = value;
	}
	
	var _beatNoteValue:Int;
	inline function get_beatNoteValue():Int return _beatNoteValue;
	function set_beatNoteValue(value:Int):Int {
		change.emit();
		return _beatNoteValue = value;
	}
	
	inline function get_beatLength() 			return (1 / beatNoteValue);
	inline function get_barLength() 			return beatLength * beatsPerBar;
	inline function get_quarterNotesPerBeat() 	return beatLength / .25;
}