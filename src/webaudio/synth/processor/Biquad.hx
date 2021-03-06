package webaudio.synth.processor;
/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
import flambe.math.FMath;
import js.Browser;

import js.html.audio.BiquadFilterNode;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;

/**
 * Biquad filter with ASR (Attack->Sustain->Release) envelope generator
 */
class BiquadFilter {
	
	var _q						:Float;
	var _gain					:Float;
	var _frequency				:Float;
	
	// settings for the envelope...
	static inline var MinFreq	:Float = 20;
	static inline var MaxFreq	:Float = 8000;
	static inline var FreqRange	:Float = MaxFreq - MinFreq;
	
	static inline var MinQ		:Float = 0;
	static inline var MaxQ		:Float = 24;
	
	public var biquad			:Biquad;
	
	public var envRange			:Float = 1;
	public var envAttack		:Float = .1;
	public var envRelease		:Float = 1;
	
	public var type		(get,set):Int;
	public var frequency(get, set):Float;
	public var q		(get, set):Float;
	public var gain		(get, set):Float; // only relevant to peak/shelving modes, not lp/hp
	
	
	public function new(type:Int, freq:Float=8000.0, q:Float=1.0, context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		_frequency 	= freq;
		_q 			= q;
		_gain 		= 1.0;
		biquad 		= new Biquad(type, freq, q, context, input, destination);
	}
	
	
	public function on(when:Float, retrigger:Bool=false) {
		var dest  = Math.min(_frequency + envRange * (MaxFreq - _frequency), MaxFreq);
		biquad.trigger(when, _frequency, envAttack, dest, retrigger);
	}
	
	public function off(when:Float):Float {
		return biquad.release(when, _frequency, envRelease);
	}
	
	
	inline function get_frequency():Float return _frequency;	
	function set_frequency(value:Float):Float {
		
		var ctx 	= biquad.node.context;
		var nyquist = ctx.sampleRate / 2;
		var now 	= ctx.currentTime;
		
		value = (value < 10) ? 10 : ((value > nyquist) ? nyquist : value);
		
		biquad.node.frequency.cancelScheduledValues(now);
		biquad.node.frequency.setValueAtTime(value, now);
		
		return _frequency = value;
	}
	
	
	// default=1, valid range - 0.0001 to 1000
	inline function get_q():Float return _q;	
	function set_q(value:Float):Float {
		value = value < 0.0001 ? 0.0001 : (value > 1000 ? 1000 : value);
		
		var now = biquad.node.context.currentTime;
		biquad.node.Q.cancelScheduledValues(now);
		biquad.node.Q.setValueAtTime(value, now);
		return _q = value;
	}
	
	
	inline function get_gain():Float return _gain;	
	function set_gain(value:Float):Float {
		var now = biquad.node.context.currentTime;
		biquad.node.gain.cancelScheduledValues(now);
		biquad.node.gain.setValueAtTime(value, now);
		return _gain = value;
	}
	
	
	inline function get_type():Int return cast biquad.node.type;
	inline function set_type(value:Int):Int return cast biquad.node.type = FilterType.get(value);
	
}



/**
 * Wraps the Biquad Filter, giving it an ASR envelope
 * http://www.w3.org/TR/webaudio/#BiquadFilterNode-section
 */
abstract Biquad(BiquadFilterNode) from BiquadFilterNode to BiquadFilterNode {
	
	inline public function new(type:Int, f:Float=10000.0, q:Float=1.0, context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		
		this 					= context.createBiquadFilter();
		this.type 				= FilterType.get(type);
		this.frequency.value 	= f;
		this.Q.value	 		= q;
		this.gain.value 		= 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	
	public var node(get, never):BiquadFilterNode;
	inline function get_node():BiquadFilterNode return this;
	
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
		
		attackTime 	= attackTime < 0.0001 ? 0.0001 : attackTime;
		
		this.frequency.cancelScheduledValues(when);	
		
		if (retrigger) {
			this.frequency.setValueAtTime(startFreq, when);
		} else {
			this.frequency.setValueAtTime(this.frequency.value, when);		
		}
		
		this.frequency.exponentialRampToValueAtTime(sustainFreq, when + attackTime);
	}
	
	
	/**
	 * 
	 * @param	when=.0
	 * @param	destinationFreq=350.0
	 * @param	releaseDuration=.5
	 * @return
	 */
	inline public function release(when=.0, destinationFreq=20.0, releaseDuration=.5):Float {
		releaseDuration = releaseDuration < 0.0001 ? 0.0001 : releaseDuration;
		
		this.frequency.cancelScheduledValues(when);		
		this.frequency.setValueAtTime(this.frequency.value, when);
		this.frequency.setTargetAtTime(destinationFreq, when, getTimeConstant(releaseDuration));
		
		return when + releaseDuration;
	}
	
	static inline var TimeConstDivider = 4.605170185988092; // Math.log(100);
	static inline function getTimeConstant(time:Float) return Math.log(time + 1.0) / TimeConstDivider;
}




// the implementation of is generated at runtime in FilterType __init__ below...
@:native("FilterTypeShim")
extern enum FilterTypeShim {
	ALLPASS; BANDPASS; HIGHPASS; HIGHSHELF; LOWPASS; LOWSHELF; NOTCH; PEAKING;
}


/**
 * 
 */
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
	
	static function __init__() {
		// fix some differences in api implementation between chrome/firefox
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