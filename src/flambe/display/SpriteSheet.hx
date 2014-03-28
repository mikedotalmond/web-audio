package flambe.display;
import haxe.Json;

/**
 * SpriteSheet parsers / helpers
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class SpriteSheet {  }


/**
 * Starling/Sparrow TextureAtlas parser
 * Outputs a Map<String,SubTexture>
 *
 * Does not support frame regions or sprite rotation
 */
@:final class StarlingSpriteSheet {
	
	public static function parse(atlasXml:Xml, texture:Texture):Map<String, SubTexture> {
		
		var map = new Map<String, SubTexture>();
		
		for (el in atlasXml.elements()) {
			if (el.nodeName == 'TextureAtlas') {
				var textures = el.elementsNamed('SubTexture');
				for (sub in textures) {
					var name = sub.get('name');
					map.set(
						name,
						texture.subTexture(
							Std.parseInt(sub.get('x')),
							Std.parseInt(sub.get('y')),
							Std.parseInt(sub.get('width')),
							Std.parseInt(sub.get('height'))
						)
					);
				}
			}
		}
		
		return map;
	}
}



/**
 * Should be compatible with the JSON data format used in PixieJS, UIToolkit, NGUI (Unity)
 */
@:final class JSSpriteSheet {
	
	public static function parse(data:String, texture:Texture):Map<String, SubTexture> {
		
		var obj 	= Json.parse(data);
		var map 	= new Map<String, SubTexture>();
		
		var frames 	= Reflect.getProperty(obj, 'frames');
		var names 	= Reflect.fields(frames);
		
		for (name in names) {
			var frame = Reflect.field(Reflect.field(frames, name), 'frame');
			map.set(
				name,
				texture.subTexture(
					Reflect.getProperty(frame, 'x'),
					Reflect.getProperty(frame, 'y'),
					Reflect.getProperty(frame, 'w'),
					Reflect.getProperty(frame, 'h')
				)
			);
		}
		return map;
	}
}