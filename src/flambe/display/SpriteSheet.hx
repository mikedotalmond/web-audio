package flambe.display;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class SpriteSheet {  }


/**
 * Starling/Sparrow TextureAtlas parser
 * Outputs map of texture-name to texture
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

