package flambe.display;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class SpriteSheet {  }

typedef SubTextureData = {
	var name	:String;
	var texture	:Texture;
	var x		:Float;
	var y		:Float;
	var width	:Float;
	var height	:Float;
}


/**
 * Starling/Sparrow TextureAtlas parser
 * Does not support frame regions or sprite rotation
 */
@:final class StarlingSpriteSheet {
	
	public static function parse(atlasXml:Xml, texture:Texture):Map<String, SubTextureData> {
		
		var map = new Map<String, SubTextureData>();
		
		for (el in atlasXml.elements()) {
			if (el.nodeName == 'TextureAtlas') {
				var textures = el.elementsNamed('SubTexture');
				for (sub in textures) {
					var name = sub.get('name');
					map.set(name,
						{
							name:name,
							texture:texture,
							x:Std.parseFloat(sub.get('x')),
							y:Std.parseFloat(sub.get('y')),
							width:Std.parseFloat(sub.get('width')),
							height:Std.parseFloat(sub.get('height'))
						}
					);
				}
			}
		}
		
		return map;
	}
}

