package audio.core;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */

class TimeSignature {
	
	public var beatNoteValue:Int;
	public var beatsPerBar	:Int;
	
	public var beatLength(get, never):Float;
	inline function get_beatLength() return (1 / beatNoteValue);
	
	public var barLength(get, never):Float;
	inline function get_barLength() return beatLength * beatsPerBar;
	
	public var quarterNotesPerBeat(get, never):Float;
	inline function get_quarterNotesPerBeat() return beatLength / .25;
	
	/**
	 *	The lower numeral indicates the note value that represents one beat (the beat unit).
	 *	The upper numeral indicates how many such beats there are in a bar.
	 *
	 * 2/4
	 * 3/4
	 * 4/4
	 * 16/8
	 * @param	beatsPerBar
	 * @param	beatNoteValue
	 */
	public function new(beatsPerBar:Int = 4, beatNoteValue:Int = 4) {
		this.beatsPerBar	= beatsPerBar;
		this.beatNoteValue 	= beatNoteValue;
	}
	
	public inline function toString():String {
		return '${beatsPerBar}/${beatNoteValue}';
	}
}