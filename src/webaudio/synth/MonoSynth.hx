package webaudio.synth;

import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import haxe.ds.ObjectMap;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.GainNode;
import js.html.audio.OscillatorNode;
import webaudio.synth.Oscillator.OscillatorType;

import webaudio.synth.Biquad;

/**
 * A fairly basic monosynth
 *
 * Audio routing:
 *	* Osc -> FEG(AR-BiQuad) -> AEG(ADSR-GainNode) -> OutGain -> Desitnation
 *
 *
 * @author Mike Almond - https://github.com/mikedotalmond *
 */

class MonoSynth implements ParameterObserver { //
	
	var osc:Map<Int, Oscillator>;
	
	public var adsr(default, null):ADSR;
	public var outputGain(default, null):GainNode;
	public var biquad(default, null):Biquad;
	
	public var adsr_attackTime		:Float = .1;
	public var adsr_decayTime		:Float = 0.2;
	public var adsr_releaseTime		:Float = .25;
	public var adsr_sustain			:Float = .44;
	
	public var osc_portamentoTime	:Float = 0;
	public var osc_detuneTones		:Int = 0;
	public var osc_detuneCents		:Float = 0;
	
	public var noteIsOn(default, null):Bool = false;
	
	
	var currentOscillator(get_currentOscillator, never):Oscillator;
	inline function get_currentOscillator():Oscillator { return osc.get(oscillatorType); }
	
	var currentOscillatorNode(get_currentOscillatorNode, never):OscillatorNode;
	inline function get_currentOscillatorNode():OscillatorNode { return osc.get(oscillatorType); }
	
	var oscType:Int = 0;
	public var oscillatorType(get_oscillatorType, set_oscillatorType):Int;
	inline function get_oscillatorType() { return oscType; }
	function set_oscillatorType(type:Int) {
		noteOff(0);
		currentOscillatorNode.disconnect(0);
		oscType = type;
		currentOscillatorNode.connect(biquad, 0);
		return oscType;
	}
	
	/**
	 * filter
	 */
	public var filterType:Int = 0;
	public var filterFrequency:Float=.001;
	public var filterQ:Float=10;
	public var filterGain:Float=1;
	public var filterEnvRange:Float=1;
	public var filterEnvAttack:Float=.1;
	public var filterEnvRelease:Float=1;
	
	
	/**
	 *
	 * @param	destination AudioNode
	 */
	public function new(destination:AudioNode) {
		
		var context = destination.context;
		outputGain = context.createGain();
		outputGain.gain.value = 1;
		outputGain.connect(destination);
		
		osc = new Map<Int, Oscillator>();
		osc.set(OscillatorType.SINE, new Oscillator(context, null, OscillatorType.SINE));
		osc.set(OscillatorType.SQUARE, new Oscillator(context, null, OscillatorType.SQUARE));
		osc.set(OscillatorType.SAWTOOTH, new Oscillator(context, null, OscillatorType.SAWTOOTH));
		osc.set(OscillatorType.TRIANGLE, new Oscillator(context, null, OscillatorType.TRIANGLE));
		
		biquad			= new Biquad(FilterType.LOWPASS, filterFrequency, filterQ, context);
		adsr 			= new ADSR(context, biquad, outputGain);
		oscillatorType 	= OscillatorType.SINE;
	}
	
	
	public function getOutputGain() return outputGain.gain.value;
	public function setOutputGain(value:Float, when:Float=0) {
		outputGain.gain.cancelScheduledValues(when);
		outputGain.gain.setValueAtTime(value, when);
	}
	
	public function noteOn(when:Float, freq:Float, velocity:Float=1, retrigger:Bool=false) {
		currentOscillator.trigger(when, freq, osc_portamentoTime, retrigger);
		if (!noteIsOn || retrigger) {
			adsr.trigger(when, velocity, adsr_attackTime, adsr_decayTime, adsr_sustain, retrigger);
			//if FEG active...
			var start = filterFrequency * 6000;
			var dest  = start + filterEnvRange * 8000;
			biquad.trigger(when, start, filterEnvAttack, dest, retrigger);
		}
		noteIsOn = true;
	}
	
	public function noteOff(when) {
		if (noteIsOn) {
			currentOscillator.release(adsr.release(when, adsr_releaseTime));
			biquad.release(when, filterFrequency*6000, filterEnvRelease);
			noteIsOn = false;
		}
	}
	
	public function dispose() {
		adsr = null;
		osc = null;
		biquad = null;
		outputGain = null;
		osc = null;
	}
	
	/* INTERFACE audio.parameter.IParameterObserver */
	public function onParameterChange(parameter:Parameter) {
		trace('[MonoSynth] onParameterChange');
		trace('${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
	}
}