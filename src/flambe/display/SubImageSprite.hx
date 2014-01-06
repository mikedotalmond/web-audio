package flambe.display;

/**
 * SubImageSprite and a parser for Starling TextureAtlas format
 *
 * StarlingSpriteSheet.parse(atlasXML, texture) -> Map<String,SubImageSprite>
 */

import flambe.display.Graphics;
import flambe.display.Sprite;
import flambe.display.Texture;
import flambe.math.Rectangle;


@:final class SubImageSprite extends Sprite {
	
	var tX		:Float;
	var tY		:Float;
	var tWidth	:Float;
	var tHeight	:Float;
	
	public var texture	:Texture;
	public var textureId:String;
	
	/**
	 *
	 * @param	texture
	 * @param	bounds - position of a sub-texture within the texture
	 * @param	pivotX
	 * @param	pivotY
	 */
    public function new (id, texture, x, y, width, height) {
        super();
		
		this.textureId 	= id;
        this.texture 	= texture;
		tX 				= x;
		tY 				= y;
		tWidth 			= width;
		tHeight			= height;
    }
	
    override public function draw (g :Graphics) g.drawSubImage(texture, 0, 0, tX, tY, tWidth, tHeight);
	
    override public function getNaturalWidth () return tWidth;
    override public function getNaturalHeight () return tHeight;
	
	public static inline function fromSubTextureData(d:SubTextureData):SubImageSprite {
		return new SubImageSprite(d.name, d.texture, d.x, d.y, d.width, d.height);
	}
	
	public static inline function threeSliceXfromSubTextureData(d:SubTextureData):Array<SubImageSprite> {
		var half = Std.int(d.width / 2) - 1;
		return [
			new SubImageSprite('${d.name}-left', d.texture, d.x, d.y, half, d.height),
			new SubImageSprite('${d.name}-mid', d.texture, d.x + half, d.y, 1, d.height),
			new SubImageSprite('${d.name}-right', d.texture, d.x + half + 2, d.y, half, d.height),
		];
	}
	
	public static inline function threeSliceYfromSubTextureData(d:SubTextureData):Array<SubImageSprite> {
		var half = Std.int(d.height / 2) - 1;
		return [
			new SubImageSprite('${d.name}-top', d.texture, d.x, d.y, d.width, half),
			new SubImageSprite('${d.name}-mid', d.texture, d.x, d.y + half, d.width, 1),
			new SubImageSprite('${d.name}-bottom', d.texture, d.x, d.y + half + 2, d.width, half),
		];
	}
}


@:final class SubTextureData {
	
	public var name		:String;
	public var texture	:Texture;
	
	public var x		:Float;
	public var y		:Float;
	
	public var width	:Float;
	public var height	:Float;
	
	public var offsetX	:Float;
	public var offsetY	:Float;
	
	public function new(name:String, t:Texture, x:Float, y:Float, w:Float, h:Float) {
		this.name = name;
		this.texture = t;
		this.x = x; this.y = y;
		this.width = w; this.height = h;
	}
}


@:final class StarlingSpriteSheet {
	
	public static function parse(atlasXml:Xml, texture:Texture):Map<String, SubTextureData> {
		
		var map = new Map<String, SubTextureData>();
		
		for (el in atlasXml.elements()) {
			if (el.nodeName == 'TextureAtlas') {
				var textures = el.elementsNamed('SubTexture');
				for (sub in textures) {
					var name = sub.get('name');
					map.set(name,
						new SubTextureData(name, texture,
							Std.parseFloat(sub.get('x')),
							Std.parseFloat(sub.get('y')),
							Std.parseFloat(sub.get('width')),
							Std.parseFloat(sub.get('height'))
						)
					);
				}
			}
		}
		
		return map;
	}
}

