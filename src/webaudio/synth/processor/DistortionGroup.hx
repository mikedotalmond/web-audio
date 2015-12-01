package webaudio.synth.processor;

import js.html.audio.AudioContext;
import js.html.audio.AudioDestinationNode;
import js.html.audio.AudioNode;
import js.html.audio.GainNode;

import webaudio.synth.processor.Waveshaper.WaveShaper;


/**
 * 
 * [Input] -> Pre-Gain -> WaveShaper -> Crusher -> [Ouput]
 * 
 */
class DistortionGroup {

	var _input	:AudioNode;
	var _output	:AudioNode;
	
	public var pregain		(default,null):GainNode;
	public var waveshaper	(default,null):WaveShaper;
	public var crusher		(default,null):Crusher;
	
	public var input		(get, never):AudioNode; // 1st node in chain (pass input here)
	public var output		(get, never):AudioNode; // last node in chain (read output from here)
	
	public function new(context:AudioContext) {
		pregain 	= context.createGain();
		waveshaper 	= new WaveShaper(context, null, pregain);
		crusher 	= new Crusher(context, waveshaper);
	}
	
	inline function get_input()	:AudioNode return pregain; 
	inline function get_output():AudioNode return crusher.node;
}