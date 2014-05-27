package webaudio.synth;
/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
import js.Browser;

import js.html.audio.BiquadFilterNode;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.GainNode;




// the implementation of is generated at runtime in the OscillatorType __init__ below...
@:native("FilterTypeShim")
extern enum FilterTypeShim {
	ALLPASS; BANDPASS; HIGHPASS; HIGHSHELF; LOWPASS; LOWSHELF; NOTCH; PEAKING;
}


@:final class FilterType {
	
	public static var ALLPASS:Int = 0;
	public static var BANDPASS:Int = 1;
	public static var HIGHPASS:Int = 2;
	public static var HIGHSHELF:Int = 3;
	public static var LOWPASS:Int = 4;
	public static var LOWSHELF:Int = 5;
	public static var NOTCH:Int = 6;
	public static var PEAKING:Int = 7;
	
	public static function get(type:Int):Dynamic {
		init();
		return switch(type) {
			case FilterType.ALLPASS		: FilterTypeShim.ALLPASS;
			case FilterType.BANDPASS	: FilterTypeShim.BANDPASS;
			case FilterType.HIGHPASS	: FilterTypeShim.HIGHPASS;
			case FilterType.HIGHSHELF	: FilterTypeShim.HIGHSHELF;
			case FilterType.LOWPASS		: FilterTypeShim.LOWPASS;
			case FilterType.LOWSHELF	: FilterTypeShim.LOWSHELF;
			case FilterType.NOTCH		: FilterTypeShim.NOTCH;
			case FilterType.PEAKING		: FilterTypeShim.PEAKING;
			default						: null;
		}
	}
	
	static var hasInit:Bool = false;
	static function init() {
		// fix up current differences in chrome/firefox
		if (hasInit) return;
		hasInit = true;
		
		var Node = Reflect.getProperty(Browser.window, "BiquadFilterNode");
		if (Node != null) {
			if (Reflect.hasField(Node, "LOWPASS")) {
				untyped __js__('window.FilterTypeShim = {ALLPASS:Node.ALLPASS, BANDPASS:Node.BANDPASS, HIGHPASS:Node.HIGHPASS, HIGHSHELF:Node.HIGHSHELF, LOWPASS:Node.LOWPASS, LOWSHELF:Node.LOWSHELF, NOTCH:Node.NOTCH, PEAKING:Node.PEAKING}');
			} else {
				untyped __js__('window.FilterTypeShim = {ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}');
			}
		}
	}
}
		

/**
 * Wraps the Biquad Filter, giving it an ASR envelope
 * http://www.w3.org/TR/webaudio/#BiquadFilterNode-section
 */
abstract Biquad(BiquadFilterNode) from BiquadFilterNode to BiquadFilterNode {
	
	inline public function new(type:Int, f:Float=350.0, q:Float=1.0, context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		this 					= context.createBiquadFilter();
		this.type 				= FilterType.get(type);
		this.frequency.value 	= f;
		this.Q.value	 		= q;
		this.gain.value 		= 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	
	inline public function setType(type:Int) {
		this.type = FilterType.get(type);
	}
	
	/**
	 * 
	 * @param	when=.0 time (audio context) to trigger at
	 * @param	startFreq = 350.0
	 * @param	attackTime=1.0
	 * @param	sustainFreq=1000.0
	 * @param	retrigger
	 */
	inline public function trigger(when:Float, startFreq:Float, attackTime:Float, sustainFreq:Float, retrigger:Bool=false) {
		//trace(startFreq,sustainFreq);
		startFreq = retrigger ? startFreq : this.frequency.value;
		rampToFreqAtTime(when, attackTime, startFreq, sustainFreq);
	}
	
	/**
	 * 
	 * @param	when=.0
	 * @param	destinationFreq=350.0
	 * @param	releaseDuration=.5
	 * @return
	 */
	inline public function release(when=.0, destinationFreq=350.0, releaseDuration=.5):Float {
		rampToFreqAtTime(when, releaseDuration, this.frequency.value, destinationFreq);
		return when + releaseDuration;
	}
	
	
	inline function rampToFreqAtTime(when, duration, startFreq, destFreq) {
		this.frequency.cancelScheduledValues(when);
		this.frequency.setValueAtTime(startFreq, when);
		this.frequency.exponentialRampToValueAtTime(destFreq, when + duration);
	}
}
