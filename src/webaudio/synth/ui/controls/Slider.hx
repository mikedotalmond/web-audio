package webaudio.synth.ui.controls;

import audio.parameter.mapping.Mapping;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class Slider extends NumericControl {

	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		super(name, defaultValue, parameterMapping);
	}
	
}