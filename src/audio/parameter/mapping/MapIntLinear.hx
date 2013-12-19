package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */

import math.Tools;

class MapIntLinear implements IMapping {
	
	var _min:Int;
	var _max:Int;
	
	public function new(min:Int = 0, max:Int = 1 ){
		_min = min;
		_max = max;
	}
	
	public function map(normalisedValue:Float)
		return Math.round(_min + normalisedValue * ( _max - _min ));
	
	
	public function mapInverse(value:Float)
		return (value - _min ) / ( _max - _min );
	
	
	public function toString()
		return '[MapIntLinear] min:${_min}, max:${_max}';
}