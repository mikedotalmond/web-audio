package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */
class MapFloatLinear implements Mapping {
	
	var _min:Float;
	var _max:Float;

	public function new(min:Float = 0, max:Float = 1 ){
		_min = min;
		_max = max;
	}
	
	/**
	 *
	 * @param	normalisedValue (0-1)
	 * @return	A mapped value in the range of min-max
	 */
	public function map(normalisedValue:Float)
		return _min + normalisedValue * ( _max - _min );
	
	
	/**
	 *
	 * @param	value	A value in the range of min-max
	 * @return	Normalised value (0-1)
	 */
	public function mapInverse(value:Float)
		return ( value - _min ) / ( _max - _min );
	
		
	
	public function toString()
		return '[MapFloatLinear] min:' + _min + ', max:' + _max;
	
}