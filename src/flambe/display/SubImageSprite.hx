package flambe.display;

/**
 * SubImageSprite and a parser for Starling TextureAtlas format
 *
 * StarlingSpriteSheet.parse(atlasXML, texture) -> Map<String,SubImageSprite>
 */

import flambe.Component;
import flambe.display.Graphics;
import flambe.display.Sprite;
import flambe.display.SubImageSprite;
import flambe.display.Texture;
import flambe.Entity;
import flambe.math.Rectangle;
import webaudio.Main;


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
	
	public static function threeSliceXfromSubTextureData(d:SubTextureData, edgeWidth:Int=-1):Array<SubImageSprite> {
		var half = Std.int(d.width / 2);
		if (edgeWidth == -1) edgeWidth = half - 1;
		return [
			new SubImageSprite('${d.name}-left', d.texture, d.x, d.y, edgeWidth, d.height),
			new SubImageSprite('${d.name}-mid', d.texture, d.x + half - 1, d.y, 1, d.height),
			new SubImageSprite('${d.name}-right', d.texture, d.x + d.width - edgeWidth, d.y, edgeWidth, d.height),
		];
	}
	
	public static function threeSliceYfromSubTextureData(d:SubTextureData, edgeHeight:Int=-1):Array<SubImageSprite> {
		var half = Std.int(d.height / 2);
		if (edgeHeight == -1) edgeHeight = half - 1;
		return [
			new SubImageSprite('${d.name}-top', d.texture, d.x, d.y, d.width, edgeHeight),
			new SubImageSprite('${d.name}-mid', d.texture, d.x, d.y + half - 1, d.width, 1),
			new SubImageSprite('${d.name}-bottom', d.texture, d.x, d.y + d.height - edgeHeight, d.width, edgeHeight),
		];
	}
	
	/**
	 * Generates slices needed for 9-slice scaling, takes a single x and y offset to define the top/bottom and left/right inset
	 * @param	d
	 * @param	xOffset
	 * @param	yOffset
	 * @return
	 */
	public static function nineSliceFromSubTextureData(d:SubTextureData, xOffset:Int, yOffset:Int):Array<SubImageSprite> {
		
		var xMid = Std.int(d.width / 2 + .5);
		var yMid = Std.int(d.height / 2 + .5);
		
		return [
			new SubImageSprite('${d.name}-topMid', d.texture, 		d.x + xMid, d.y, 1, yOffset),
			new SubImageSprite('${d.name}-midMid', d.texture, 		d.x + xMid, d.y + yMid, 1, 1),
			new SubImageSprite('${d.name}-bottomMid', d.texture,	d.x + xMid, d.y + d.height - yOffset, 1, yOffset),
			
			new SubImageSprite('${d.name}-rightTop', d.texture, 	d.x + d.width - xOffset, d.y, xOffset, yOffset),
			new SubImageSprite('${d.name}-rightMid', d.texture, 	d.x + d.width - xOffset, d.y + yMid, xOffset, 1),
			new SubImageSprite('${d.name}-rightBottom', d.texture,	d.x + d.width - xOffset, d.y + d.height - yOffset, xOffset, yOffset),
			
			new SubImageSprite('${d.name}-lefTop', d.texture, 		d.x, d.y, xOffset, yOffset),
			new SubImageSprite('${d.name}-leftMid', d.texture, 		d.x, d.y + yMid, xOffset, 1),
			new SubImageSprite('${d.name}-leftBottom', d.texture,	d.x, d.y + d.height - yOffset, xOffset, yOffset),
		];
	}
}

/**
 * A basic 9-Slice implementation
 */
class NineSlice extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var width(get, set):Float;
	public var height(get, set):Float;
	
	public var tintR(get, set):Float;
	public var tintG(get, set):Float;
	public var tintB(get, set):Float;
	
	var parts		:Array<SubImageSprite>;
	
	var minWidth	:Float;
	var minHeight	:Float;
	var xOffset		:Float;
	var yOffset		:Float;
	
	/**
	 *
	 **/
	public function new(textureName:String, xOffset:Int = 0, yOffset:Int = 0) {
		
		var textureData = Main.instance.textureAtlas.get(textureName);
		
		if (xOffset < 1) xOffset = Std.int(textureData.width / 2);
		if (yOffset < 1) yOffset = Std.int(textureData.height / 2);
		
		parts 		= SubImageSprite.nineSliceFromSubTextureData(textureData, xOffset, yOffset);
		minWidth 	= xOffset + xOffset + 1;
		minHeight	= yOffset + yOffset + 1;
		_width 		= minWidth;
		_height 	= minHeight;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		x = y = 0;
	}
	
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	public function setTint(r,g,b) {
		for (part in parts) part.setTint(r, g, b);
	}
	
	
	var _width:Float = 0;
	function get_width() return _width;
	function set_width(value) {
		
		var w 		= (value < minWidth) ? minWidth : value;
		var scale 	= w - minWidth;
		
		// scale centre top,middle,and bottom slices
		parts[0].scaleX._ = parts[1].scaleX._ = parts[2].scaleX._ = scale;
		
		// position right top,middle,and bottom
		parts[3].x._ = parts[4].x._ = parts[5].x._ = _x + w - minWidth;
		
		return _width = w;
	}
	
	var _height:Float = 0;
	function get_height() return _height;
	function set_height(value) {
		
		var h 		= (value < minHeight) ? minHeight : value;
		var scale 	= h - minHeight;
		
		// scale middle left,centre,and right slices
		parts[1].scaleY._ = parts[4].scaleY._ = parts[7].scaleY._ = scale;
		
		// position bottom left,centre,and right
		parts[2].y._ = parts[5].y._ = parts[8].y._ = _y + h - minHeight;
		
		return _height = h;
	}
	
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value:Float) {
		
		// mid
		parts[0].x._ = parts[1].x._ = parts[2].x._ = value + xOffset;
		
		// right
		parts[3].x._ = parts[4].x._ = parts[5].x._ = value + _width - xOffset - 1;
		
		// left
		parts[6].x._ = parts[7].x._ = parts[8].x._ = value;
		
		return _x = value;
	}
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value:Float) {
		
		// top
		parts[0].y._ = parts[3].y._ = parts[6].y._ = value;
		
		// mid
		parts[1].y._ = parts[4].y._ = parts[7].y._ = value + yOffset;
		
		// bottom
		parts[2].y._ = parts[5].y._ = parts[8].y._ = value + _height - yOffset - 1;
		
		return _y = value;
	}
	
	
	function get_tintR() return parts[0].tintR._;
	function set_tintR(value:Float) {
		for (part in parts) part.tintR._ = value;
		return value;
	}
	
	function get_tintG() return parts[0].tintG._;
	function set_tintG(value:Float) {
		for (part in parts) part.tintG._ = value;
		return value;
	}
	
	function get_tintB() return parts[0].tintB._;
	function set_tintB(value:Float) {
		for (part in parts) part.tintB._ = value;
		return value;
	}
}


class ThreeSliceX extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var width(get, set):Float;
	
	public var minWidth(get, never):Float;
	function get_minWidth():Float return edgesWidth + 1;
	
	var parts		:Array<SubImageSprite>;
	var edgesWidth	:Float;
	
	public function new(textureName:String, edgeWidth:Int=-1) {
		parts 		= SubImageSprite.threeSliceXfromSubTextureData(Main.instance.textureAtlas.get(textureName), edgeWidth);
		edgesWidth 	= parts[0].getNaturalWidth() + parts[2].getNaturalWidth();
		_width 		= minWidth;
	}
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	var _width:Float = 0;
	function get_width() return _width;
	function set_width(value) {
		
		var w 			= (value < minWidth) ? minWidth : value;
		var midScale 	= w - edgesWidth;
		
		parts[1].scaleX._ = midScale;
		parts[2].x._ = parts[1].x._ + parts[1].scaleX._;
		
		return _width = w;
	}
	
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value) {
		parts[0].x._ = value;
		parts[1].x._ = value + parts[0].getNaturalWidth();
		parts[2].x._ = parts[1].x._ + parts[1].scaleX._;
		return _x = value;
	}
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value) {
		return _y 		=
		parts[0].y._ 	=
		parts[1].y._ 	=
		parts[2].y._ 	= value;
	}
}


class ThreeSliceY extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var height(get, set):Float;
	
	public var minHeight(get, never):Float;
	function get_minHeight():Float return edgesHeight + 1;
	
	var parts		:Array<SubImageSprite>;
	var edgesHeight	:Float;
	
	public function new(textureName:String) {
		parts 		= SubImageSprite.threeSliceYfromSubTextureData(Main.instance.textureAtlas.get(textureName));
		edgesHeight	= parts[0].getNaturalHeight() + parts[2].getNaturalHeight();
		_height		= minHeight;
	}
	
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	var _height:Float = 0;
	function get_height() return _height;
	function set_height(value) {
		
		var h 			= (value < minHeight) ? minHeight : value;
		var midScale 	= h - edgesHeight;
		
		parts[1].scaleY._ = midScale;
		parts[2].y._ = parts[1].y._ + parts[1].scaleY._;
		
		return _height = h;
	}
	
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value) {
		parts[0].y._ = value;
		parts[1].y._ = value + parts[0].getNaturalHeight();
		parts[2].y._ = parts[1].y._ + parts[1].scaleY._;
		return _y = value;
	}
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value) {
		return _x 		=
		parts[0].x._ 	=
		parts[1].x._ 	=
		parts[2].x._ 	= value;
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

