package webaudio.synth.ui;

import audio.parameter.mapping.MapFactory;
import audio.parameter.Parameter;
import flambe.animation.Ease;
import flambe.Component;
import flambe.display.NineSlice;
import flambe.display.Sprite;
import flambe.display.SpriteSheet;
import flambe.display.ImageSprite;
import flambe.display.SubTexture;
import flambe.display.ThreeSliceX;
import flambe.display.ThreeSliceY;
import flambe.Entity;
import flambe.math.FMath;
import flambe.math.Rectangle;
import flambe.System;
import flambe.util.Signal0;
import webaudio.Main;

import webaudio.synth.ui.controls.Rotary;
import webaudio.synth.ui.modules.ADSRModule;
import webaudio.synth.ui.modules.DelayModule;
import webaudio.synth.ui.modules.DistortionModule;
import webaudio.synth.ui.modules.FilterModule;
import webaudio.synth.ui.modules.OscillatorsModule;
import webaudio.synth.ui.modules.OutputModule;
import webaudio.utils.KeyboardNotes;


/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI extends Sprite {
	
	var textureAtlas		:Map<String,SubTexture>;
	var keyboardNotes		:KeyboardNotes;
	var keyboardContainer	:Sprite;
	var keyboardMask		:Sprite;
	
	var background			:ImageSprite;
	
	public var keyboard		(default,null):KeyboardUI;
	
	public var oscillators	(default, null):OscillatorsModule;
	public var adsr			(default, null):ADSRModule;
	public var filter		(default, null):FilterModule;
	public var distortion	(default, null):DistortionModule;
	public var delay		(default, null):DelayModule;
	public var output		(default, null):OutputModule;
	
	
	public function new(textureAtlas:Map<String,SubTexture>, keyboardNotes:KeyboardNotes) {
		super();
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
	}
	
	
	override public function onAdded() {
		
		x._ = -(1240 / 2);
		y._ = -348;
		
		setupBackground();
		setupKeyboard();
		setupPanels();
	}	
	
	
	function setupBackground(){
		owner.addChild(new Entity().add(background = cast new ImageSprite(textureAtlas.get('BackPanelBack')).disablePointer()));
		background.x._  = -10;
	}
	
	
	
	function setupKeyboard() {
		
		keyboard = new KeyboardUI(keyboardNotes, textureAtlas);
		owner.addChild(
			new Entity()
				.add(keyboardMask = new Sprite())
				.addChild(new Entity().add(keyboardContainer = new Sprite()).add(keyboard))
			);
		
		keyboardMask.x._ = 64;
		keyboardMask.y._ = 530;
		keyboardMask.scissor = new Rectangle(0, 0, 1148, 164);
		// perhaps create more keys and animate them left/right to move the playable range...
		
		keyboardStartOctave(1, 0);
	}
	
	public var currentDisplayOctave:Int = 1;
	
	public function keyboardStartOctave(octave:Int, time:Float=.25) {
		
		var minOctave = keyboard.minOctave;
		var maxOctave = keyboard.maxOctave - 4; // keyboard display is 4-octaves long
		
		currentDisplayOctave = FMath.max(FMath.min(octave, maxOctave), minOctave);
		
		var end = -keyboard.octaveSpace * (currentDisplayOctave - minOctave);
		
		keyboardContainer.x.animateTo(end , time, Ease.quadOut);
	}
	
	
	
	function setupPanels() {
		
		var panelBg = new ImageSprite(textureAtlas.get('main-panel-bg')).disablePointer();
		owner.addChild(new Entity().add(panelBg));
		panelBg.x._ = -8;
		panelBg.y._ = -4;
		
		oscillators = new OscillatorsModule(owner, textureAtlas);
		adsr 		= new ADSRModule(owner, textureAtlas);
		filter 		= new FilterModule(owner, textureAtlas);
		distortion 	= new DistortionModule(owner, textureAtlas);
		delay 		= new DelayModule(owner, textureAtlas);
		output 		= new OutputModule(owner, textureAtlas);
	}
}