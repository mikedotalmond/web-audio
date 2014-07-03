package audio.time;
import flambe.util.Signal1;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */

@:allow(audio.time)
class Timecode {
	
	var timeSignature	:TimeSignature;
	var quarterNotes	:Float = 0.0;
	
	public var data(default, null):TimecodeData;
	
	public var beatChange(default, null):Signal1<TimecodeData>;
	public var barChange(default, null):Signal1<TimecodeData>;
	
	
	public function new(timeSignature:TimeSignature) {
		
		this.timeSignature = timeSignature;
		
		beatChange 	= new Signal1<TimecodeData>();
		barChange 	= new Signal1<TimecodeData>();
		data 		= { bar:-1, beat:-1, ticks:-1, time:.0 };
	}
	
	
	function update(ticks:Int, time:Float) {
		
		data.ticks 	 = ticks;
		quarterNotes = ticks / Clock.PPQN;
		data.time 	 = time;
		
		var beatPosition = quarterNotes * timeSignature.quarterNotesPerBeat;
		var beat 	= Std.int(beatPosition % timeSignature.beatsPerBar);
		var bar 	= Std.int(beatPosition / timeSignature.beatsPerBar);
		
		if (bar != data.bar) {
			data.bar = bar;
			barChange.emit(data);
		}
		
		if (beat != data.beat) {
			data.beat = beat;
			beatChange.emit(data);
		}
	}
	
	public inline function toString():String {
		return '[Timecode] ${data.time} - ${data.bar}:${data.beat}:${data.ticks%Clock.PPQN} (${timeSignature})';
	}
}

typedef TimecodeData = {
	var time	:Float;
	var bar		:Int;
	var beat	:Int;
	var ticks	:Int;
}