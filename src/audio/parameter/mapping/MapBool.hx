package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */
class MapBool implements IMapping {
	
	public function new() { }
	
	public function map(normalizedValue:Float)
		return normalizedValue > 0.5 ? 1 : 0;
	
	public function mapInverse(value:Float)
		return value==1 ? 1 : 0;
	
	public function toString()
		return '[MapBool]';
}