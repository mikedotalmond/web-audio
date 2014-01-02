package audio.core;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */

typedef TimecodeData = {
	var time	:Float;
	var bar		:Int;
	var beat	:Int;
	var ticks	:Int;
}

@:allow(audio.core.Clock)
class Timecode {
	
	var timeSignature	:TimeSignature;
	var quarterNotes	:Float = 0.0;
	
	public var data(default, null):TimecodeData;
	
	public function new(timeSignature:TimeSignature) {
		data = { bar:-1, beat:-1, ticks:-1, time:.0 };
		this.timeSignature = timeSignature;
	}
	
	public function update(ticks:Int, time:Float) {
		
		data.ticks 	 = ticks;
		quarterNotes = ticks / Clock.PPQN;
		data.time 	 = time;
		
		var beatPosition = quarterNotes * timeSignature.quarterNotesPerBeat;
		var beat 	= Std.int(beatPosition % timeSignature.beatsPerBar);
		var bar 	= Std.int(beatPosition / timeSignature.beatsPerBar);
		
		if (bar != data.bar) {
			data.bar = bar;
			trace('bar:${bar}, ticks:${data.ticks}');
		}
		
		if (beat != data.beat) {
			data.beat = beat;
			trace('beat:${beat}, ticks:${data.ticks}');
		}
	}
	
	public inline function toString():String {
		return '${data} (${timeSignature})';
	}
}