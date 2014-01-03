package audio.time;

import audio.time.Timecode;
import audio.time.Timecode.TimecodeData;
import audio.time.TimeSignature;

import flambe.Component;
import flambe.util.Signal0;
import flambe.util.Signal1;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

@:allow(audio.time)
class Clock extends Component {

	static inline var PPQN:Int = 24; // pulses per quarter note (24 is the midi spec, may as well use that...)
	
	var ticks			:Int = -1;
	var lastTickedAt	:Float = 0;
	var pulseDuration	:Float = 0;
	
	var _bpm:Float;
	public var bpm(get, set):Float;
	public var bps(get, set):Float;
	
	public var time(default, null):Float = 0;
	public var running(default, null):Bool = false;
	
	public var tick(default, null):Signal1<TimecodeData>;
	public var started(default, null):Signal0;
	public var stopped(default, null):Signal0;
	
	public var timecode(default, null)		:Timecode;
	public var timeSignature(default, null)	:TimeSignature;
	
	
	public function new(bpm:Float = 120, timeSignature:TimeSignature = null) {
		
		tick 				= new Signal1<TimecodeData>();
		started 			= new Signal0();
		stopped 			= new Signal0();
		
		this.timeSignature 	= timeSignature == null ? new TimeSignature() : timeSignature;
		timecode 			= new Timecode(this.timeSignature);
		
		set_bpm(bpm);
		goto(0);
		
		this.timeSignature.change.connect(set_bpm.bind(_bpm));
	}
	
	
	public function start(time = -1.0) {
		if (!running) {
			running = true;
			goto((time == -1.0) ? (this.time > 0 ? this.time : 0) : 0);
			started.emit();
		}
	}
	
	
	public function goto(time:Float) {
		this.time = lastTickedAt = (time > 0 ? time : 0);
		ticks = Math.floor(time / pulseDuration);
	}
	
	public function resume() {
		if (!running) running = true;
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
			
			time += dt;
			
			var steps = Math.floor((time - lastTickedAt) / pulseDuration);
			if (steps > 0) lastTickedAt = time;
			
			var start = lastTickedAt;
			for (i in 0...steps) {
				
				timecode.update(ticks, start);
				tick.emit(timecode.data);
				
				ticks++;
				start += pulseDuration;
			}
			
			lastTickedAt = start;
		}
	}
	
	
	override public function onRemoved() {
		stopped.emit();
	}
	
	
	function get_bpm():Float return _bpm;
	function set_bpm(value:Float) {
		
		time = lastTickedAt = 0;
		pulseDuration = 1.0 / ((value / 60) * PPQN * timeSignature.quarterNotesPerBeat * timeSignature.beatsPerBar);
		
		return _bpm = value;
	}
	
	function get_bps():Float return _bpm / 60;
	function set_bps(value:Float) return set_bpm(value * 60);
}

