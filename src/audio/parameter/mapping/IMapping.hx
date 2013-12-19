package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */

interface IMapping {
	
	/**
	 * @param	normalisedValue (0-1)
	 * @return	A mapped value in the range of min-max
	 */
	function map(normalisedValue:Float):Float;
	
	/**
	 * @param	value	A value in the range of min-max
	 * @return	Normalised value (0-1)
	 */
	function mapInverse(value:Float):Float;
	
	/**/
	function toString():String;
}