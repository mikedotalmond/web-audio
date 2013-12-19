package audio.parameter.mapping;
import audio.parameter.mapping.MapFactory.Mapping;

/**
 * ...
 * @author Mike Almond
 */

 enum Mapping {
	BOOL;
	INT;
	FLOAT;
	FLOAT_EXPONENTIAL;
 }

class MapFactory {
	
	public static function getMapping(type:Mapping, min = .0, max = 1.0):IMapping {
		
		switch(type) {
			case Mapping.BOOL:
				return new MapBool();
			
			case Mapping.INT:
				return new MapIntLinear(Std.int(min), Std.int(max));
			
			case Mapping.FLOAT:
				return new MapFloatLinear(min, max);
			
			case Mapping.FLOAT_EXPONENTIAL:
				return new MapFloatExponential(min, max);
		}
		
		return null;
	}
}