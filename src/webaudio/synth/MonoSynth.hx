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
import webaudio.utils.NoteFrequencyUtil;

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
	
	var osc0:Map<Int, Oscillator>;
	var osc1:Map<Int, Oscillator>;
	
	var osc0Type:Int = 0;
	var osc1Type:Int = 0;
	var freqUtil:NoteFrequencyUtil;
	
	
	public var adsr(default, null):ADSR;
	public var outputGain(default, null):GainNode;
	
	public var biquad(default, null):Biquad;
	
	public var adsr_attackTime		:Float = .1;
	public var adsr_decayTime		:Float = 0.2;
	public var adsr_releaseTime		:Float = .25;
	public var adsr_sustain			:Float = .44;
	
	public var osc0_portamentoTime	:Float = 0;
	public var osc0_detuneCents		:Int = 0;
	
	public var osc1_portamentoTime	:Float = 0;
	public var osc1_detuneCents		:Int = 0;
	
	public var noteIsOn(default, null):Bool = false;
	
	var oscillator0(get_oscillator0, never):Oscillator;
	inline function get_oscillator0():Oscillator { return osc0.get(oscillator0Type); }
	
	var oscillator1(get_oscillator1, never):Oscillator;
	inline function get_oscillator1():Oscillator { return osc1.get(oscillator1Type); }
	
	public var oscillator0Type(get_oscillator0Type, set_oscillator0Type):Int;
	inline function get_oscillator0Type() { return osc0Type; }
	function set_oscillator0Type(type:Int) {
		cast(oscillator0, OscillatorNode).disconnect(0);
		osc0Type = type;
		cast(oscillator0, OscillatorNode).connect(biquad, 0);
		return type;
	}
	
	public var oscillator1Type(get_oscillator1Type, set_oscillator1Type):Int;
	inline function get_oscillator1Type() { return osc1Type; }
	function set_oscillator1Type(type:Int) {
		cast(oscillator1, OscillatorNode).disconnect(0);
		osc1Type = type;
		cast(oscillator1, OscillatorNode).connect(biquad, 0);
		return type;
	}
	
	/**
	 * filter
	 */
	public var filterType:Int = 0;
	public var filterFrequency:Float=.001;
	public var filterQ:Float=10;
	public var filterGain:Float = 1;
	
	public var filterEnvEnabled:Bool = true;
	public var filterEnvRange:Float=1;
	public var filterEnvAttack:Float=.1;
	public var filterEnvRelease:Float=1;
	
	// TODO LFOs (pitch/filter-freq/amplitude)
	
	/**
	 *
	 * @param	destination AudioNode
	 */
	public function new(destination:AudioNode, freqUtil:NoteFrequencyUtil) {
		this.freqUtil = freqUtil;
	
		var context = destination.context;
		
		outputGain = context.createGain();
		
		outputGain.gain.value = 1;
		outputGain.connect(destination);
		
		
		osc0 = new Map<Int, Oscillator>();
		osc0.set(OscillatorType.SINE, new Oscillator(context, null, OscillatorType.SINE));
		osc0.set(OscillatorType.SQUARE, new Oscillator(context, null, OscillatorType.SQUARE));
		osc0.set(OscillatorType.SAWTOOTH, new Oscillator(context, null, OscillatorType.SAWTOOTH));
		osc0.set(OscillatorType.TRIANGLE, new Oscillator(context, null, OscillatorType.TRIANGLE));
		
		osc1 = new Map<Int, Oscillator>();
		osc1.set(OscillatorType.SINE, new Oscillator(context, null, OscillatorType.SINE));
		osc1.set(OscillatorType.SQUARE, new Oscillator(context, null, OscillatorType.SQUARE));
		osc1.set(OscillatorType.SAWTOOTH, new Oscillator(context, null, OscillatorType.SAWTOOTH));
		osc1.set(OscillatorType.TRIANGLE, new Oscillator(context, null, OscillatorType.TRIANGLE));
		
		biquad	= new Biquad(FilterType.LOWPASS, filterFrequency, filterQ, context);
		adsr 	= new ADSR(context, biquad, outputGain);
		oscillator0Type = OscillatorType.SINE;
		oscillator1Type = OscillatorType.SINE;
	}
	
	
	public function getOutputGain() return outputGain.gain.value;
	public function setOutputGain(value:Float, when:Float=0) {
		outputGain.gain.cancelScheduledValues(when);
		outputGain.gain.setValueAtTime(value, when);
	}
	
	public function noteOn(when:Float, freq:Float, velocity:Float = 1, retrigger:Bool = false) {
		if (osc0_detuneCents != 0) {
			oscillator0.trigger(when, freqUtil.detuneFreq(freq, osc0_detuneCents), osc0_portamentoTime, retrigger);
		} else {
			oscillator0.trigger(when, freq, osc0_portamentoTime, retrigger);
		}
		
		if (osc1_detuneCents != 0) {
			oscillator1.trigger(when, freqUtil.detuneFreq(freq, osc1_detuneCents), osc1_portamentoTime, retrigger);
		} else {
			oscillator1.trigger(when, freq, osc1_portamentoTime, retrigger);
		}
		
		
		oscillator1.trigger(when, freq, osc1_portamentoTime, retrigger);
		if (!noteIsOn || retrigger) {
			//NoteFrequencyUtil
			adsr.trigger(when, velocity, adsr_attackTime, adsr_decayTime, adsr_sustain, retrigger);
			//if FEG active...
			if (filterEnvEnabled) { 
				var start = filterFrequency * 6000;
				var dest  = start + filterEnvRange * 8000;
				biquad.trigger(when, start, filterEnvAttack, dest, retrigger);
			}
		}
		noteIsOn = true;
	}
	
	public function noteOff(when) {
		if (noteIsOn) {
			oscillator0.release(adsr.release(when, adsr_releaseTime));
			oscillator1.release(adsr.release(when, adsr_releaseTime));
			if (filterEnvEnabled) biquad.release(when, filterFrequency * 6000, filterEnvRelease);
			noteIsOn = false;
		}
	}
	
	public function dispose() {
		adsr = null;
		osc1 = null;
		osc0 = null;
		biquad = null;
		outputGain = null;
	}
	
	/* INTERFACE audio.parameter.IParameterObserver */
	public function onParameterChange(parameter:Parameter) {
		trace('[MonoSynth] onParameterChange');
		trace('${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
	}
}