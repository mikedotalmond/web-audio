package audio.core;

import flambe.Component;
import flambe.util.Signal0;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 *
 *
 * https://en.wikipedia.org/wiki/MIDI_timecode
 * https://en.wikipedia.org/wiki/MIDI_beat_clock
 *
 * http://home.roadrunner.com/~jgglatt/tech/mtc.htm
 * http://home.roadrunner.com/~jgglatt/tech/midispec.htm
 *
 * MIDI beat clock (also known as MIDI timing clock or simply MIDI clock) is a clock signal that is broadcast via MIDI to ensure that several MIDI-enabled devices such as a synthesizer or music sequencer stay in synchronization. It is not MIDI timecode.
 *	Unlike MIDI timecode, the MIDI beat clock is tempo-dependent. Clock events are sent at a rate of 24 ppqn (pulses per quarter note). Those pulses are used to maintain a synchronized tempo for synthesizers that have BPM-dependent voices and also for arpeggiator synchronization. It does not transmit any location information (bar number or time code) and so must be used in conjunction with a positional reference (such as timecode) for complete sync.
 *	Because of limitations in MIDI and synthesizers, devices driven by MIDI beatclock are often subject to clock drift. For this reason, it is a common practice on equipment that supports another clock source such as ADAT or wordclock to use both that source and MIDI beatclock.

 *	MIDI beat clock defines the following real time messages:
 *	clock (decimal 248, hex 0xF8)
 *	start (decimal 250, hex 0xFA)
 *	continue (decimal 251, hex 0xFB)
 *	stop (decimal 252, hex 0xFC)
 */

class MIDIClock extends Component {
	
	static inline var PPQN	:Int = 24; // pulses per quarter note
	static inline var QNPB	:Int = 4;  // quarter notes per beat
	
	var running:Bool=false;
	var tc:Float;
	var pulseDuration:Float;
	
	var _bpm:Float;
	public var bpm(get, set):Float;
	
	public var tick(default, null):Signal0;
	public var started(default, null):Signal0;
	public var stopped(default, null):Signal0;
	
	
	public function new(bpm:Float = 120) {
		tick 		= new Signal0();
		started 	= new Signal0();
		stopped 	= new Signal0();
		this.bpm 	= bpm;
	}
	
	
	public function start() {
		if (!running) {
			tc = 0;
			running = true;
			started.emit();
		}
	}
	
	
	public function stop() {
		if (running) {
			running = false;
			stopped.emit();
		}
	}
		
	override public function onAdded() {
		//start();
	}
	
	override public function onUpdate(dt:Float) {
		if (running) {
			tc += dt;
			if (tc >= pulseDuration) {
				tc = 0;
				tick.emit();
			}
		}
	}
	
	override public function onRemoved() {
		stopped.emit();
	}
	
	
	function get_bpm():Float return _bpm;
	function set_bpm(value:Float) {
		
		tc 				= 0;
		pulseDuration  	= 1.0 / (value * 60 * QNPB * PPQN);
		
		return _bpm = value;
	}
}