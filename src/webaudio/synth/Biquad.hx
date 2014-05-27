package webaudio.synth;
/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

import js.html.audio.BiquadFilterNode;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.GainNode;


/*
// fix up current differences in chrome/firefox

var Node = Reflect.getProperty(Browser.window, "BiquadFilterNode");
if (Node != null) {
	if (Reflect.hasField(Node, "LOWPASS") && Std.is(Node.LOWPASS, Int)) {
		untyped __js__('window.FilterTypeShim = {ALLPASS:Node.ALLPASS, BANDPASS:Node.BANDPASS, HIGHPASS:Node.HIGHPASS, HIGHSHELF:Node.HIGHSHELF, LOWPASS:Node.LOWPASS, LOWSHELF:Node.LOWSHELF, NOTCH:Node.NOTCH, PEAKING:Node.PEAKING}');
	} else {
		untyped __js__('window.FilterTypeShim = {ALLPASS:"allpass", BANDPASS:"bandpass", HIGHPASS:"highpass", HIGHSHELF:"highshelf", LOWPASS:"lowpass", LOWSHELF:"lowshelf", NOTCH:"notch", PEAKING:"peaking"}');
	}
}*/
		

/**
 * Wraps the Biquad Filter, giving it an ASR envelope
 * http://www.w3.org/TR/webaudio/#BiquadFilterNode-section
 */
abstract Biquad(BiquadFilterNode) from BiquadFilterNode to BiquadFilterNode {
	
	inline public function new(type:Int, f:Float=350.0, q:Float=1.0, context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		this 					= context.createBiquadFilter();
		this.type 				= type;
		this.frequency.value 	= f;
		this.Q.value	 		= q;
		this.gain.value 		= 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
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
