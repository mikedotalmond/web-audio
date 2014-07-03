package webaudio.synth.generator;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.OscillatorNode;
import webaudio.synth.generator.Oscillator.OscillatorType;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class OscillatorGroup {
	
	var _type	:Int;
	var _output	:AudioNode;
	var osc		:Map<Int, Oscillator>;
	var connected:Bool;
	
	public var type(get, set)	:Int;
	public var output(get, set)	:AudioNode;
	
	public var oscillator(get_oscillator, never):Oscillator;
	public var oscillatorNode(get_oscillatorNode, never):OscillatorNode;
	
	public function new(context:AudioContext, output:AudioNode) {
		
		osc = new Map<Int, Oscillator>();
		osc.set(OscillatorType.SINE, new Oscillator(context, null, OscillatorType.SINE));
		osc.set(OscillatorType.SQUARE, new Oscillator(context, null, OscillatorType.SQUARE));
		osc.set(OscillatorType.SAWTOOTH, new Oscillator(context, null, OscillatorType.SAWTOOTH));
		osc.set(OscillatorType.TRIANGLE, new Oscillator(context, null, OscillatorType.TRIANGLE));
		_type  = 0;
		_output = output;
		connected = false;
	}
	
	
	inline function get_type() return _type;
	function set_type(value:Int) {
		if (_type != value || !connected) {
			connected = true;
			osc.get(_type).node.disconnect(0);
			osc.get(value).node.connect(output);
		}
		return _type = value;
	}
	
	
	inline function get_output() return _output;
	inline function set_output(value:AudioNode) {
		if (value != _output) {
			oscillator.node.disconnect(0);
			oscillator.node.connect(value);
		}
		return _output = value;
	}
	
	
	inline function get_oscillator():Oscillator return osc.get(_type); 
	inline function get_oscillatorNode():OscillatorNode return osc.get(_type).node; 
}