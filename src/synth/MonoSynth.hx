package synth;

import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.OscillatorNode;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

 
class MonoSynth { // 
	
	var adsr						:ADSR;
	var osc							:Array<Oscillator>;
	
	public var adsr_attackTime		:Float = .1;
	public var adsr_decayTime		:Float = 0.2;
	public var adsr_releaseTime		:Float = .25;
	public var adsr_sustain			:Float = .44;
	public var osc_portamentoTime	:Float = 0;
	
	public var noteIsOn(default, null):Bool = false;
	
	
	var currentOscillator(get_currentOscillator, never):Oscillator;
	inline function get_currentOscillator():Oscillator { return osc[oscillatorType]; }
	
	var currentOscillatorNode(get_currentOscillatorNode, never):OscillatorNode;
	inline function get_currentOscillatorNode():OscillatorNode { return osc[oscillatorType]; }
	
	
	var oscType:Int = 0;
	public var oscillatorType(get_oscillatorType, set_oscillatorType):Int;

	inline function get_oscillatorType() { return oscType; }
	function set_oscillatorType(type:Int) {
		switch (type) {
			case Oscillator.SINE, Oscillator.SQUARE, Oscillator.TRIANGLE, Oscillator.SAWTOOTH:
				noteOff(0);
				currentOscillatorNode.disconnect(0);
				oscType = type;
				currentOscillatorNode.connect(adsr,0);
		}
		return oscType;
	}
	
	
	/**
	 * 
	 * @param	destination
	 */
	public function new(destination:AudioNode) {
		
		var context = destination.context;
		
		osc 					= [];
		osc[Oscillator.SINE] 	= new Oscillator(context, null, Oscillator.SINE);
		osc[Oscillator.SQUARE]	= new Oscillator(context, null, Oscillator.SQUARE);
		osc[Oscillator.TRIANGLE]= new Oscillator(context, null, Oscillator.TRIANGLE);
		osc[Oscillator.SAWTOOTH]= new Oscillator(context, null, Oscillator.SAWTOOTH);
		
		adsr 					= new ADSR(context, null, destination);
		oscillatorType 			= Oscillator.SINE;
		
		//todo: use AudioParam
	}
	
	public function noteOn(when:Float, freq:Float, velocity:Float=1, retrigger:Bool=false) {
		currentOscillator.trigger(when, freq, osc_portamentoTime); 
		if(!noteIsOn || retrigger) adsr.trigger(when, velocity, adsr_attackTime, adsr_decayTime, adsr_sustain, retrigger);
		noteIsOn = true;
	}
	
	public function noteOff(when) {
		if (noteIsOn) {
			currentOscillator.release(adsr.release(when, adsr_releaseTime));
			noteIsOn = false;
		}
	}
}