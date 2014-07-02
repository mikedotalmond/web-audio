package webaudio.synth.data;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import flambe.System;
import haxe.Json;
import js.Browser;
import webaudio.synth.data.Settings;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ParameterSerialiser implements ParameterObserver {
	
	static inline var SessionDataKey:String = 'monosynth_sessionParameters';
	static inline var PresetDataKey	:String = 'monosynth_presetParameters_';
	
	var settings:Settings;
	var map		:Map<String, Parameter>;
	
	
	public var presetNames(get, never):Array<String>;
	
	
	public function new(settings:Settings) {
		
		this.settings 	= settings;
		map 			= new Map<String,Parameter>();
		
		Browser.window.addEventListener('beforeunload', function(e) {
			storeSession();
		});
	}
	
	
	public function storePreset(name:String) {
		settings.setLocalData(PresetDataKey + name, serialise());
	}
	
	
	public function removePreset(name:String) {
		settings.removeLocalData(PresetDataKey + name);
	}
	
	
	public function restorePreset(name:String) {
		var data = settings.getLocalData(PresetDataKey + name);
		if (data != null) {
			trace('Restoring $name...');
			deserialise(data);
		} else {
			trace('restorePreset - there is no preset with the name $name');
		}
	}
	
	
	public function restoreSession() {
		var session = settings.getSessionData(SessionDataKey);
		if (session != null) {
			trace('Restoring parameters from previous session...');
			deserialise(session);
		}
	}
	
	
	public function storeSession() {
		settings.setSessionData(SessionDataKey, serialise());
	}
	
	
	/* INTERFACE audio.parameter.ParameterObserver */
	public function onParameterChange(parameter:Parameter):Void {
		if(!map.exists(parameter.name)) map.set(parameter.name, parameter);
	}
	
	public function resetAll() {
		for (key in map.keys()) {
			map.get(key).setToDefault();
		}
	}
	
	public function randomiseAll(amount:Float=1) {
		for (key in map.keys()) {
			var p = map.get(key);
			var v = p.getValue(true);
			v += (Math.random() - .5) * amount * 2;
			v = v < 0 ? -v : (v > 1 ? v-1 : v);
			p.setValue(v, true);
		}
	}
	
	/**
	 * Store all the current parameter values
	 * @return
	 */
	public function serialise():String {
		var out = { };
		for (key in map.keys()) {
			Reflect.setField(out, key, map.get(key).normalisedValue);
		}
		return Json.stringify(out);
	}	
	
	
	/**
	 * Deserialises a Parameter-set and upadtes existing paramters
	 * @param	data
	 */
	public function deserialise(data:String, setAsDefault:Bool = false) {
		var input = Json.parse(data);
		for (field in Reflect.fields(input)) {
			if (map.exists(field)) {
				var value = Std.parseFloat(Reflect.field(input, field));
				if (setAsDefault) {
					map.get(field).setDefault(value, true);
				} else {
					map.get(field).setValue(value, true);
				}
			}
		}
	}
	
	
	
	function get_presetNames():Array<String> {
		var out = [];
		for (key in settings.getLocalDataKeys()) {
			if (key.indexOf(PresetDataKey) == 0) {
				out.push(key.substring(PresetDataKey.length));
			}
		}
		return out;
	}
}


class Presets {
	//{"outputLevel":1,"pitchBend":0.5,"osc0Type":0.4991173497401178,"osc0Level":0.4781810147687793,"osc0Pan":0.6310725971125066,"osc0Slide":0.1266044092769017,"osc0Random":0.26653681276366115,"osc0Detune":0.5,"osc1Type":0.7477981359697878,"osc1Level":0.3292993218638003,"osc1Pan":0.01828722283244133,"osc1Slide":0.02745950322279389,"osc1Random":0.4499491536989808,"osc1Detune":0.45999999999999996,"oscPhase":0.7650310881435871,"adsrAttack":0.7040971665621574,"adsrDecay":0.33823246182873845,"adsrSustain":0.3593041876703502,"adsrRelease":0.8135661084193722,"filterType":0.18629450630396605,"filterFrequency":0.4422275172546506,"filterQ":0.15257560480386023,"filterAttack":0.5661690521042779,"filterRelease":0.2524551069401806,"filterRange":0.013978504110127687,"distortionPregain":0.7552918116562068,"distortionWaveshaperAmount":0.11509892949834466,"distortionBits":0.06239914096405963,"distortionRateReduction":0.6496388632804155,"delayLevel":0.4921991547197102,"delayTime":0.3267808564475132,"delayFeedback":0.7100817100144923,"delayLFPFreq":0.4960417885705828,"delayLFPQ":0} 
	//
	
	static var WetSine:String = '{"outputLevel":1,"pitchBend":0.5,"osc0Type":0,"osc0Level":0.5,"osc0Pan":0.5,"osc0Slide":0.0990990990990991,"osc0Random":0.04,"osc0Detune":0.5,"osc1Type":0,"osc1Level":0.5,"osc1Pan":0.5,"osc1Slide":0.0990990990990991,"osc1Random":0.04,"osc1Detune":0.5,"oscPhase":0,"adsrAttack":0.07999999999999999,"adsrDecay":0.15,"adsrSustain":0.49999999999999956,"adsrRelease":1,"filterType":0,"filterFrequency":0.17999999999999935,"filterQ":0.8399999999999999,"filterAttack":0.13499999999999998,"filterRelease":0.7300000000000003,"filterRange":1,"distortionPregain":0.09999999999999999,"distortionWaveshaperAmount":0.7000000000000002,"distortionBits":0.13826086956521716,"distortionRateReduction":0,"delayLevel":0.14999999999999986,"delayTime":0.9729332933293332,"delayFeedback":0.4500250025002502,"delayLFPFreq":0.19999999999999982,"delayLFPQ":0}';
	static var FloppyBits:String = '{"outputLevel":0.4399999999999995,"pitchBend":0.5,"osc0Type":0,"osc0Level":1,"osc0Pan":0.5,"osc0Slide":0.0990990990990991,"osc0Random":0,"osc0Detune":0.5,"osc1Type":0,"osc1Level":1,"osc1Pan":0.5,"osc1Slide":0.0990990990990991,"osc1Random":0,"osc1Detune":0.5,"oscPhase":0,"adsrAttack":0.21000000000000002,"adsrDecay":0.15,"adsrSustain":0.8999999999999999,"adsrRelease":1,"filterType":0,"filterFrequency":1,"filterQ":0.4999999999999998,"filterAttack":1,"filterRelease":0.21999999999999942,"filterRange":1,"distortionPregain":0.29000000000000004,"distortionWaveshaperAmount":0.37,"distortionBits":0.13826086956521716,"distortionRateReduction":0,"delayLevel":0.09999999999999985,"delayTime":0.9729332933293332,"delayFeedback":0.4500250025002502,"delayLFPFreq":0.19999999999999982,"delayLFPQ":0}';
	
	static var GentleBen:String = '"outputLevel":0.6799999999999998, "pitchBend":0.5, "osc0Type":0.37500000000000006, "osc0Level":0.5, "osc0Pan":0.43999999999999995, "osc0Slide":0.0990990990990991, "osc0Random":0.20000000000000004, "osc0Detune":0.5, "osc1Type":0.598214285714286, "osc1Level":0.5, "osc1Pan":0.56, "osc1Slide":0.0990990990990991, "osc1Random":0.2, "osc1Detune":0.5, "oscPhase":0.17999999999999997, "adsrAttack":0.03750352374993505, "adsrDecay":1, "adsrSustain":1, "adsrRelease":0.2919280948873624, "filterType":0, "filterFrequency":0.1599999999999993, "filterQ":0.8, "filterAttack":0.6719280948873626, "filterRelease":0.21496250072115589, "filterRange":0.9000000000000005, "distortionPregain":0, "distortionWaveshaperAmount":0.8600000000000003, "distortionBits":0.4782608695652174, "distortionRateReduction":0, "delayLevel":0.15999999999999995, "delayTime":0.16293329332933287, "delayFeedback":0.49999999999999956, "delayLFPFreq":1, "delayLFPQ":0.0999909999099991 }';
	static var WTFTW:String = '{"outputLevel":0.4399999999999996,"pitchBend":0.5,"osc0Type":0.9464285714285714,"osc0Level":0.4668754586018622,"osc0Pan":0.434224143885076,"osc0Slide":0.09999999999999999,"osc0Random":0.1353575261309743,"osc0Detune":0.5,"osc1Type":0,"osc1Level":0.55,"osc1Pan":0.5818778711184858,"osc1Slide":0.7860790734147436,"osc1Random":0.4989718380384147,"osc1Detune":0.5,"oscPhase":0.6322048523835839,"adsrAttack":0.17999999999999947,"adsrDecay":0.5345427193678916,"adsrSustain":0.9099999999999999,"adsrRelease":0.3135172767948372,"filterType":0,"filterFrequency":0.7800000000000007,"filterQ":0.94,"filterAttack":0.3699999999999995,"filterRelease":0.9243289259783327,"filterRange":0.48999999999999955,"distortionPregain":0.49999999999999956,"distortionWaveshaperAmount":0.8739709560014308,"distortionBits":0.21000000000000005,"distortionRateReduction":0.2,"delayLevel":0.09999999999999974,"delayTime":0.33131938935235605,"delayFeedback":0.0666541256941855,"delayLFPFreq":0.43000000000000005,"delayLFPQ":0}';
	static var OwOwOw:String = '{"outputLevel":0.4404992213845257,"pitchBend":0.5,"osc0Type":0.53176956916494,"osc0Level":0.2848998922854662,"osc0Pan":0.6553399509564042,"osc0Slide":0.3345249738357958,"osc0Random":0.3254045475460585,"osc0Detune":0.48,"osc1Type":0.5856871545048695,"osc1Level":0.34120628116652374,"osc1Pan":0.274271479975432,"osc1Slide":0.19665794456058805,"osc1Random":0.27338116569444537,"osc1Detune":0.46399999999999997,"oscPhase":0.5367797849141063,"adsrAttack":0.13585058337077552,"adsrDecay":0.4118536375463009,"adsrSustain":0.7993384519033133,"adsrRelease":0.24872226793430885,"filterType":0.9169524870812893,"filterFrequency":0.04,"filterQ":1,"filterAttack":0.13216184906661455,"filterRelease":0.6764560150503516,"filterRange":0.2090064475871618,"distortionPregain":0.16845860145986036,"distortionWaveshaperAmount":0.7897845552489162,"distortionBits":0.15361713754013176,"distortionRateReduction":0.47468311311677097,"delayLevel":0.3756582126766443,"delayTime":0.5380281316579925,"delayFeedback":0.18479999119415877,"delayLFPFreq":0.8414817627705634,"delayLFPQ":0.6816484755836427}';
	static var Leadish:String = '{"outputLevel":0.38295858133584215,"pitchBend":0.5,"osc0Type":0.5938830460155663,"osc0Level":0.5741079380363225,"osc0Pan":0.5,"osc0Slide":0.048732493184506884,"osc0Random":0.19387254383414923,"osc0Detune":0.5,"osc1Type":0.3392857142857143,"osc1Level":0.2815980485267937,"osc1Pan":0.5117302227392793,"osc1Slide":0.10685698390325825,"osc1Random":0.01588528836145997,"osc1Detune":0.499,"oscPhase":0.14331354821100817,"adsrAttack":0.15529628787189734,"adsrDecay":0.7664752448908985,"adsrSustain":0.6781206807121636,"adsrRelease":0.4241326441790896,"filterType":0,"filterFrequency":0.12000000000000001,"filterQ":0.5797061326913537,"filterAttack":0.4112402198649936,"filterRelease":0.3100000000000001,"filterRange":0.9099999999999999,"distortionPregain":0.6008890603668984,"distortionWaveshaperAmount":0.13999999999999999,"distortionBits":0.1382608695652172,"distortionRateReduction":0,"delayLevel":0.14624362844973773,"delayTime":0.12053697529227002,"delayFeedback":0.311054561883211,"delayLFPFreq":0.35068133769556864,"delayLFPQ":0.12999999999999995}';
	static var Hubble:String = '{"outputLevel":0.4673323092423374,"pitchBend":0.5,"osc0Type":0.32187723594584483,"osc0Level":0.5501569783687592,"osc0Pan":0.035873363725841045,"osc0Slide":0.46743601735681295,"osc0Random":0.5535920813307174,"osc0Detune":0.5,"osc1Type":0.8837717605887779,"osc1Level":0.7479439487121999,"osc1Pan":0.15710694646462797,"osc1Slide":0.42825166909342927,"osc1Random":0.648777486756444,"osc1Detune":0.48000000000000004,"oscPhase":0.7499087216891347,"adsrAttack":0.42545380499213925,"adsrDecay":0.055507498793303967,"adsrSustain":0.5419561782851814,"adsrRelease":0.6898205606464309,"filterType":0.2519419346936047,"filterFrequency":0.34113304095342756,"filterQ":0.40043697291985136,"filterAttack":0.6723704796470709,"filterRelease":0.7224151427485048,"filterRange":0.6672021801024675,"distortionPregain":0.48588421270251314,"distortionWaveshaperAmount":0.5391920240223409,"distortionBits":0.4782608695652174,"distortionRateReduction":0.06000000000000014,"delayLevel":0.31409743022173675,"delayTime":0.4189383636324062,"delayFeedback":0.626016280371696,"delayLFPFreq":0.5011918721720574,"delayLFPQ":0.20447118736803485}';
	static var Voyager:String = '{"outputLevel":0.596160045024007,"pitchBend":0.48438319687767045,"osc0Type":0.4999197233202217,"osc0Level":0.18356056366115814,"osc0Pan":0.4514487967826426,"osc0Slide":0.5665156216174365,"osc0Random":0.6446686258167036,"osc0Detune":0.5682883285917342,"osc1Type":0.2984360323420594,"osc1Level":0.22554069174453617,"osc1Pan":0.4376573327369988,"osc1Slide":0.2393585837478034,"osc1Random":0.9832042241469026,"osc1Detune":0.7423076857998967,"oscPhase":0.4472648433037101,"adsrAttack":0.41782711129635564,"adsrDecay":0.20043661259114742,"adsrSustain":0.9824869338423012,"adsrRelease":0.93405529389046,"filterType":0,"filterFrequency":0.4091029983200133,"filterQ":0.7449476217851041,"filterAttack":0.09563750846311381,"filterRelease":0.7517979797534644,"filterRange":0.5817121911421419,"distortionPregain":0.34397339383140246,"distortionWaveshaperAmount":0.3808828432671727,"distortionBits":0.8468644326228811,"distortionRateReduction":0.55675847357139,"delayLevel":0.5397429227456447,"delayTime":0.20590351169019483,"delayFeedback":0.7042214359156789,"delayLFPFreq":0.34564317250624277,"delayLFPQ":0.09628216465935173}';
}