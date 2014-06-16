package webaudio.synth;

import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import haxe.ds.ObjectMap;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.DelayNode;
import js.html.audio.GainNode;
import js.html.audio.OscillatorNode;
import webaudio.synth.generator.ADSR;
import webaudio.synth.generator.Oscillator.OscillatorType;
import webaudio.synth.generator.OscillatorGroup;
import webaudio.synth.processor.Waveshaper;
import webaudio.synth.processor.Waveshaper;
import webaudio.utils.NoteFrequencyUtil;

import webaudio.synth.processor.Biquad;

/**
 * A fairly basic monosynth
 *
 * Audio routing:
 * OSC-0 + OSC-1[Phase Delay] -> ADSR -> BiQuad -> WaveShaper -> Delay[level+feedback] -> Output Gain
	
 *
 *
 * @author Mike Almond - https://github.com/mikedotalmond *
 */

class MonoSynth implements ParameterObserver { //
	
	public var adsr(default, null)		:ADSR;
	public var output(default, null)	:GainNode;
	
	public var biquad(default, null)	:Biquad;
	public var waveshaper(default, null):WaveShaper;
	
	public var delay(default, null)		:DelayNode;
	public var delayLevel(default, null):GainNode;
	public var delayFeedback(default, null):GainNode;
	
	public var adsr_attackTime		:Float = .1;
	public var adsr_decayTime		:Float = 0.2;
	public var adsr_releaseTime		:Float = .25;
	public var adsr_sustain			:Float = .44;
	
	public var osc0(default, null):OscillatorGroup;
	public var osc1(default, null):OscillatorGroup;
	public var osc0_portamentoTime	:Float = 0;
	public var osc0_detuneCents		:Int = 0;
	public var osc1_portamentoTime	:Float = 0;
	public var osc1_detuneCents		:Int = 0;
	
	public var phase(get, set):Float;
	
	public var noteIsOn(default, null):Bool = false;
	
	
	var freqUtil:NoteFrequencyUtil;
	
	// osc 0/1 phase offset (using delaynode)
	var phaseDelay:DelayNode;
	var _phase:Float = 0;
	
	var noteFreq:Float = 440;
	var context:AudioContext;
	
	/** filter */
	public var filterType:Int = 0;
	public var filterFrequency:Float=.001;
	public var filterQ:Float=10;
	public var filterGain:Float = 1;
	
	public var filterEnvEnabled:Bool = true;
	public var filterEnvRange:Float=1;
	public var filterEnvAttack:Float=.1;
	public var filterEnvRelease:Float=1;
	
	
	/**
	 *
	 * @param	destination AudioNode
	 */
	public function new(destination:AudioNode, freqUtil:NoteFrequencyUtil) {
		this.freqUtil = freqUtil;
		
		//[ OSC-0 + OSC-1[Phase Delay] -> ADSR -> BiQuad -> WaveShaper -> Delay[level+feedback] -> Output Gain
		
		context = destination.context;
		
		output = context.createGain();
		output.connect(destination);
		output.gain.value = 1;
		
		setupDelay();	
		
		setupWaveshaper();	
		
		biquad = new Biquad(FilterType.LOWPASS, filterFrequency, filterQ, context, null, waveshaper);
		
		adsr = new ADSR(context, null, biquad);
		
		setupOscillators();
	}
	
	
	function setupDelay():Void {
		
		delayLevel = context.createGain();
		delay = context.createDelay(1);
		delayFeedback = context.createGain();		
		
		delayLevel.gain.value = .5;
		delayFeedback.gain.value = .5;
		
		delayLevel.connect(delay);
		delay.connect(delayFeedback);
		delayFeedback.connect(delay);
		delay.connect(output);
	}
	
	public function delayEnabled() {
		//delay.connect(output);
		//delay.disconnect();
	}
	
	function setupWaveshaper():Void {
		waveshaper 	= new WaveShaper(context);
		waveshaper.setDistortion( .325);
		waveshaper.node.connect(delayLevel);
		waveshaper.node.connect(output);
	}
	
	function setupOscillators():Void {
		
		// osc0 output is routed though this delay
		phaseDelay = context.createDelay(1 / freqUtil.noteIndexToFrequency(0));
		phaseDelay.connect(adsr, 0);
		
		osc0 = new OscillatorGroup(context, phaseDelay);
		osc1 = new OscillatorGroup(context, adsr);
	}
	
	
	public function getOutputGain() return output.gain.value;
	
	public function setOutputGain(value:Float, when:Float=0) {
		output.gain.setValueAtTime(value, when);
	}
	
	
	public function noteOn(when:Float, freq:Float, velocity:Float = 1, retrigger:Bool = false) {
		
		noteFreq = freq;
	
		var p = (1 / freq) * _phase;
		phaseDelay.delayTime.cancelScheduledValues(when);
		if (osc0_portamentoTime > 0) {
			// make phase-change match portamento
			phaseDelay.delayTime.setValueAtTime(phaseDelay.delayTime.value, when);
			phaseDelay.delayTime.exponentialRampToValueAtTime(p, when + osc0_portamentoTime);
		} else {
			phaseDelay.delayTime.setValueAtTime(p, when);
		}
		
		
		if (osc0_detuneCents != 0) {
			osc0.oscillator.trigger(when, freqUtil.detuneFreq(freq, osc0_detuneCents), osc0_portamentoTime, retrigger);
		} else {
			osc0.oscillator.trigger(when, freq, osc0_portamentoTime, retrigger);
		}
		
		if (osc1_detuneCents != 0) {
			osc1.oscillator.trigger(when, freqUtil.detuneFreq(freq, osc1_detuneCents), osc1_portamentoTime, retrigger);
		} else {
			osc1.oscillator.trigger(when, freq, osc1_portamentoTime, retrigger);
		}
		
		if (!noteIsOn || retrigger) {
			adsr.trigger(when, velocity, adsr_attackTime, adsr_decayTime, adsr_sustain, retrigger);
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
			var r = adsr.release(when, adsr_releaseTime);
			
			osc0.oscillator.release(r);
			osc1.oscillator.release(r);
			phaseDelay.delayTime.cancelScheduledValues(r);
			
			if (filterEnvEnabled) biquad.release(when, filterFrequency * 6000, filterEnvRelease);
			
			noteIsOn = false;
		}
	}
	
	
	
	public function dispose() {
		adsr = null;
		osc1 = null;
		osc0 = null;
		biquad = null;
		delay = null;
		phaseDelay = null;
		output = null;
	}
	
	
	/* INTERFACE audio.parameter.IParameterObserver */
	public function onParameterChange(parameter:Parameter) {
		trace('[MonoSynth] onParameterChange - ${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
		
		switch(parameter.name) {
			case 'outputLevelRotary':
				setOutputGain(parameter.getValue(), context.currentTime);
		}
	}
	
	
	
	inline function get_phase():Float return _phase;
	inline function set_phase(value:Float):Float {
		phaseDelay.delayTime.value = (1 / noteFreq) * value;
		return _phase = value;
	}
}