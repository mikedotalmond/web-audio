package audio.core;
import flambe.Component;
import flambe.System;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 *
 * https://en.wikipedia.org/wiki/MIDI_timecode
 * https://en.wikipedia.org/wiki/MIDI_beat_clock
 *
 * http://home.roadrunner.com/~jgglatt/tech/mtc.htm
 * http://home.roadrunner.com/~jgglatt/tech/midispec.htm
 *
 */
class MIDITimeCode extends Component {
	
	public function new() {
		
	}
	
	override public function onAdded() {
		var clock:MIDIClock = owner.get(MIDIClock);
		clock.tick.connect(clockPulse);
		clock.start();
	}
	
	override public function onRemoved() {
		
	}
	
	var tick:Int = 0;
	var quarterNote:Int = 0;
	var note:Int = 0;
	var bar:Int = 0;
	
	function clockPulse() {
		
		if (++tick == 24) {
			tick = 0;
			if (++quarterNote == 4) {
				quarterNote = 0;
				if (++note > 4) {
					bar++;
				}
			}
		}
		
		//untyped __js__('console.clear()');
		trace('${bar}:${note}:${quarterNote}:${tick} @ ${webaudio.Main.audioContext.currentTime}');
	}
}