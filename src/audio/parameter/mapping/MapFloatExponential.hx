package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */
class MapFloatExponential implements IMapping {
	
	var _min:Float;
	var _max:Float;
	var _t0	:Float;
	var _t1	:Float;
	var _t2	:Float;

	public function new(min = .0, max = 1.0 ){

		_t2 = 0;
		if (min <= 0) _t2 = 1 + min * -1;
		
		_min = min + _t2;
		_max = max + _t2;
		
		_t0 = Math.log( _max / _min );
		_t1 = 1.0 / _t0;
	}
	
	
	/**
	 *
	 * @param	normalisedValue (0-1)
	 * @return	A mapped value in the range of min-max
	 */
	public function map(normalisedValue:Float)
		return _min * Math.exp( (normalisedValue) * _t0 ) - _t2;
	
	
	/**
	 *
	 * @param	value	A value in the range of min-max
	 * @return	Normalised value (0-1)
	 */
	public function mapInverse(value:Float)
		return Math.log((value + _t2) / _min) * _t1;
	
	
	public function toString()
		return '[MapFloatExponential] min:${_min}, max:${_max}';
}