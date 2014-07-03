package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */

import math.Tools;

class MapIntLinear implements Mapping {
	
	public var min:Float;
	public var max:Float;
	
	public var range(get, never):Float;
	inline function get_range() return max - min;
	
	public function new(min:Int = 0, max:Int = 1 ){
		this.min = min;
		this.max = max;
	}
	
	public function map(normalisedValue:Float)
		return Math.round(min + normalisedValue * range);
	
	
	public function mapInverse(value:Float)
		return (value - min ) / range;
	
	
	public function toString()
		return '[MapIntLinear] min:${min}, max:${max}';
}