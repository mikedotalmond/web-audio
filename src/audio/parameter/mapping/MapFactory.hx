package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */

 enum MapType {
	BOOL;
	INT;
	FLOAT;
	FLOAT_EXPONENTIAL;
 }

class MapFactory {
	
	public static function getMapping(type:MapType, min = .0, max = 1.0):Mapping {
		
		switch(type) {
			case MapType.BOOL:
				return new MapBool();
			
			case MapType.INT:
				return new MapIntLinear(Std.int(min), Std.int(max));
			
			case MapType.FLOAT:
				return new MapFloatLinear(min, max);
			
			case MapType.FLOAT_EXPONENTIAL:
				return new MapFloatExponential(min, max);
		}
		
		return null;
	}
}