package webaudio.synth.data;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import flambe.System;
import haxe.Json;
import js.Browser;
import js.LZMA;
import webaudio.synth.data.Settings;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ParameterSerialiser implements ParameterObserver {
	
	static inline var SessionDataKey:String = 'monosynth_sessionParameters';
	static inline var PresetDataKey	:String = 'monosynth_presetParameters_';
	
	var settings	:Settings;
	var map			:Map<String, Parameter>;
	
	var lzma		:LZMA;
	
	public var presetNames(get, never):Array<String>;
	
	
	public function new(settings:Settings) {
		
		this.settings 	= settings;
		map 			= new Map<String,Parameter>();
		
		lzma 			= new LZMA('js/lzma_worker.js');
		
		lzma.compress(
			'{"outputLevel":0.3751866379752755,"pitchBend":0.49076298670843244,"osc0Type":0.20692102005705237,"osc0Level":0.1853079660795629,"osc0Pan":0.026996141765266657,"osc0Slide":0.008553653884142087,"osc0Random":0.40884588519111276,"osc0Detune":0.48292263550683856,"osc1Type":0.3029428655281663,"osc1Level":0.3246636767871678,"osc1Pan":0.32905254838988185,"osc1Slide":0.3190282742274707,"osc1Random":0.026921285316348076,"osc1Detune":0.01603039400652051,"oscPhase":0.09458741126582026,"adsrAttack":0.5582587651349604,"adsrDecay":0.23794807363301518,"adsrSustain":0.31983864260837436,"adsrRelease":0.01049697622656831,"filterType":0.7762245391495526,"filterFrequency":0.8620824320241809,"filterQ":0.30639425118169394,"filterAttack":0.12144354041665784,"filterRelease":0.36686871731653814,"filterRange":0.16690880246460438,"distortionPregain":0.44198520900681615,"distortionWaveshaperAmount":0.779462993144989,"distortionBits":0.5002409243632271,"distortionRateReduction":0.08735224744305015,"delayLevel":0.010561171919107437,"delayTime":0.574740771809374,"delayFeedback":0.5757653733996888,"delayLFPFreq":0.034561893437057734,"delayLFPQ":0.7621312789869925}',
			1, function(data) {
				var out = data.join("|");
				Browser.document.location.hash = '#data=$out';
			}
		);
		
		var queryStringData = Browser.document.location.hash;
		if (queryStringData.indexOf('#data=') == 0) {
			var str = queryStringData.substring(6).split('|');
			var out = [for (s in str) Std.parseInt(s)];
			//trace(out);
			lzma.decompress(out, function(decompressed) {
				trace(decompressed);
			});
		}
		
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
	
	
	public function restorePreset(name:String):Bool {
		var data = settings.getLocalData(PresetDataKey + name);
		if (data != null) {
			trace('Restoring $name...');
			deserialise(data);
			return true;
		}
		
		trace('restorePreset - there is no preset with the name $name');
		return false;
	}
	
	
	public function restoreSession():Bool {
		var session = settings.getSessionData(SessionDataKey);
		if (session != null) {
			trace('Restoring parameters from previous session...');
			deserialise(session);
			return true;
		}
		return false;
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
	
	public function serialiseForQueryString() {
		
        var s = serialise();
		
		trace(lzma.compress(s, 1, 
			function(data) {
				trace(data.length);
			}, null
		));
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
	
	static var presets:Map<String,String>;
	
	public static var names(get, never):Iterator<String>;
	static function get_names() {
		init(); 
		return presets.keys();
	}
	
	public static function get(name):String {
		init();
		return presets.get(name);
	}
	
	public static function init() {
		if (presets == null) {
			presets = new Map<String,String>();
			presets.set('Squasaw', Squasaw);
			presets.set('Mesanoir', Mesanoir);
			presets.set('Waaaaahp', Waaaaahp);
			presets.set('LongTime', LongTime);
			presets.set('Wet Sine', WetSine);
			presets.set('Floppy Bits', FloppyBits);
			presets.set('Gentle Ben', GentleBen);
			presets.set('WTFTW', WTFTW);
			presets.set('OwOwOw', OwOwOw);
			presets.set('Leadish', Leadish);
			presets.set('Hubble', Hubble);
			presets.set('Voyager', Voyager);
		}
	}
	
	static inline var Mesanoir:String = '{"outputLevel":0.35499718878418207,"pitchBend":0.5,"osc0Type":0.07624358251883545,"osc0Level":0.48556221509352326,"osc0Pan":0.09680561296641832,"osc0Slide":0.07077055245319075,"osc0Random":0.4575806651264429,"osc0Detune":0.8025450077839196,"osc1Type":0.006721058571389937,"osc1Level":0.8622063202783465,"osc1Pan":0.49720164434984326,"osc1Slide":0.2541634194334752,"osc1Random":0.5048075593076646,"osc1Detune":0.12225819798186421,"oscPhase":0.38200558442622423,"adsrAttack":0.7889877760782837,"adsrDecay":0.48192048855125913,"adsrSustain":0.9429306462407112,"adsrRelease":0.1279276450164617,"filterType":0.24608794087544084,"filterFrequency":0.19239046958461392,"filterQ":0.970282814583691,"filterAttack":0.2982791615650058,"filterRelease":0.0030650437809527364,"filterRange":0.7127542118541896,"distortionPregain":0.3336319421604276,"distortionWaveshaperAmount":0.006667260080575943,"distortionBits":0.47723340376725654,"distortionRateReduction":0.04437419539317489,"delayLevel":0.2907389444857835,"delayTime":0.6230580973534239,"delayFeedback":0.5186913178583821,"delayLFPFreq":0.20329118954390266,"delayLFPQ":0.47996358598494304}';
	static inline var LongTime:String = '{"outputLevel":0.5423528824560349,"pitchBend":0.5,"osc0Type":0.508481303229928,"osc0Level":0.2903344490192831,"osc0Pan":0.16695982096716755,"osc0Slide":0.008216620494217342,"osc0Random":0.39255549060180783,"osc0Detune":0.22689511254429817,"osc1Type":0.216489977572627,"osc1Level":0.1760277607850732,"osc1Pan":0.8199999999999998,"osc1Slide":0.6387598080778711,"osc1Random":0.50296380976215,"osc1Detune":0.5358693818561733,"oscPhase":0.42055099362507464,"adsrAttack":0.5636245479620992,"adsrDecay":1,"adsrSustain":0.7999999999999998,"adsrRelease":0.2141217650845646,"filterType":0.04347413685172796,"filterFrequency":0.019138042908162144,"filterQ":0.12306910322332176,"filterAttack":0.22199134798720488,"filterRelease":0.04813646869733934,"filterRange":0.7784414859488606,"distortionPregain":0.19512580804526802,"distortionWaveshaperAmount":0.13458260847255588,"distortionBits":0.6648063724253165,"distortionRateReduction":0.5591793827526272,"delayLevel":0.7884579640813172,"delayTime":0.7814509899823321,"delayFeedback":0.6427875032929922,"delayLFPFreq":0.09458289267495279,"delayLFPQ":0.34001128153228544}';
	static inline var Waaaaahp:String = '{"outputLevel":0.46341293396428185,"pitchBend":0.5,"osc0Type":0.28064297067386834,"osc0Level":0.1763532031327486,"osc0Pan":0.3412646828964354,"osc0Slide":0.4078379269471175,"osc0Random":0.1384059335105121,"osc0Detune":0.34210485965013504,"osc1Type":0.20411056885495782,"osc1Level":0.350563233718276,"osc1Pan":0.7297513120062648,"osc1Slide":0.7983276528088159,"osc1Random":0.012613496277481318,"osc1Detune":0.34069081442430615,"oscPhase":0.3753971047885717,"adsrAttack":0.12518607841804621,"adsrDecay":0.21071386579424134,"adsrSustain":0.43955529714003205,"adsrRelease":0.06789803653955451,"filterType":0.2604490057565272,"filterFrequency":0.022565599996596575,"filterQ":0.8418617065744975,"filterAttack":0.13229004982858905,"filterRelease":0.49194553755223747,"filterRange":0.8064281712286174,"distortionPregain":0.08015941549092531,"distortionWaveshaperAmount":0.5855826642364264,"distortionBits":0.7561208223227576,"distortionRateReduction":0.23606798753142325,"delayLevel":0.6047618193551898,"delayTime":0.4965090568645252,"delayFeedback":0.7778823028968429,"delayLFPFreq":0.492137948796153,"delayLFPQ":0.12913286697766393}';
	static inline var Squasaw:String = '{"outputLevel":0.4599999999999995, "pitchBend":0.5, "osc0Type":0.6666666666666666, "osc0Level":0.43999999999999995, "osc0Pan":0.5, "osc0Slide":0.0990990990990991, "osc0Random":0.060000000000000005, "osc0Detune":0.5, "osc1Type":0.31250000000000006, "osc1Level":0.43999999999999995, "osc1Pan":0.5, "osc1Slide":0.05999999999999996, "osc1Random":0.059999999999999984, "osc1Detune":0.5, "oscPhase":0, "adsrAttack":0.01599999999999999, "adsrDecay":0.029999999999999968, "adsrSustain":0.5800000000000003, "adsrRelease":0.03500000000000001, "filterType":0, "filterFrequency":0.06000000000000005, "filterQ":0.39999999999999947, "filterAttack":0.02299999999999998, "filterRelease":0.03, "filterRange":1, "distortionPregain":0, "distortionWaveshaperAmount":0.7600000000000002, "distortionBits":0.4782608695652174, "distortionRateReduction":0, "delayLevel":0.44999999999999957, "delayTime":0.2329332933293329, "delayFeedback":0.30002500250025005, "delayLFPFreq":0.22999999999999926, "delayLFPQ":0 }';
	static inline var WetSine:String = '{"outputLevel":1,"pitchBend":0.5,"osc0Type":0,"osc0Level":0.5,"osc0Pan":0.5,"osc0Slide":0.0990990990990991,"osc0Random":0.04,"osc0Detune":0.5,"osc1Type":0,"osc1Level":0.5,"osc1Pan":0.5,"osc1Slide":0.0990990990990991,"osc1Random":0.04,"osc1Detune":0.5,"oscPhase":0,"adsrAttack":0.07999999999999999,"adsrDecay":0.15,"adsrSustain":0.49999999999999956,"adsrRelease":1,"filterType":0,"filterFrequency":0.17999999999999935,"filterQ":0.8399999999999999,"filterAttack":0.13499999999999998,"filterRelease":0.7300000000000003,"filterRange":1,"distortionPregain":0.09999999999999999,"distortionWaveshaperAmount":0.7000000000000002,"distortionBits":0.13826086956521716,"distortionRateReduction":0,"delayLevel":0.14999999999999986,"delayTime":0.9729332933293332,"delayFeedback":0.4500250025002502,"delayLFPFreq":0.19999999999999982,"delayLFPQ":0}';
	static inline var FloppyBits:String = '{"outputLevel":0.4399999999999995,"pitchBend":0.5,"osc0Type":0,"osc0Level":1,"osc0Pan":0.5,"osc0Slide":0.0990990990990991,"osc0Random":0,"osc0Detune":0.5,"osc1Type":0,"osc1Level":1,"osc1Pan":0.5,"osc1Slide":0.0990990990990991,"osc1Random":0,"osc1Detune":0.5,"oscPhase":0,"adsrAttack":0.21000000000000002,"adsrDecay":0.15,"adsrSustain":0.8999999999999999,"adsrRelease":1,"filterType":0,"filterFrequency":1,"filterQ":0.4999999999999998,"filterAttack":1,"filterRelease":0.21999999999999942,"filterRange":1,"distortionPregain":0.29000000000000004,"distortionWaveshaperAmount":0.37,"distortionBits":0.13826086956521716,"distortionRateReduction":0,"delayLevel":0.09999999999999985,"delayTime":0.9729332933293332,"delayFeedback":0.4500250025002502,"delayLFPFreq":0.19999999999999982,"delayLFPQ":0}';
	static inline var GentleBen:String = '{"outputLevel":0.6799999999999998, "pitchBend":0.5, "osc0Type":0.37500000000000006, "osc0Level":0.5, "osc0Pan":0.43999999999999995, "osc0Slide":0.0990990990990991, "osc0Random":0.20000000000000004, "osc0Detune":0.5, "osc1Type":0.598214285714286, "osc1Level":0.5, "osc1Pan":0.56, "osc1Slide":0.0990990990990991, "osc1Random":0.2, "osc1Detune":0.5, "oscPhase":0.17999999999999997, "adsrAttack":0.03750352374993505, "adsrDecay":1, "adsrSustain":1, "adsrRelease":0.2919280948873624, "filterType":0, "filterFrequency":0.1599999999999993, "filterQ":0.8, "filterAttack":0.6719280948873626, "filterRelease":0.21496250072115589, "filterRange":0.9000000000000005, "distortionPregain":0, "distortionWaveshaperAmount":0.8600000000000003, "distortionBits":0.4782608695652174, "distortionRateReduction":0, "delayLevel":0.15999999999999995, "delayTime":0.16293329332933287, "delayFeedback":0.49999999999999956, "delayLFPFreq":1, "delayLFPQ":0.0999909999099991}';
	static inline var WTFTW:String = '{"outputLevel":0.4399999999999996,"pitchBend":0.5,"osc0Type":0.9464285714285714,"osc0Level":0.4668754586018622,"osc0Pan":0.434224143885076,"osc0Slide":0.09999999999999999,"osc0Random":0.1353575261309743,"osc0Detune":0.5,"osc1Type":0,"osc1Level":0.55,"osc1Pan":0.5818778711184858,"osc1Slide":0.7860790734147436,"osc1Random":0.4989718380384147,"osc1Detune":0.5,"oscPhase":0.6322048523835839,"adsrAttack":0.17999999999999947,"adsrDecay":0.5345427193678916,"adsrSustain":0.9099999999999999,"adsrRelease":0.3135172767948372,"filterType":0,"filterFrequency":0.7800000000000007,"filterQ":0.94,"filterAttack":0.3699999999999995,"filterRelease":0.9243289259783327,"filterRange":0.48999999999999955,"distortionPregain":0.49999999999999956,"distortionWaveshaperAmount":0.8739709560014308,"distortionBits":0.21000000000000005,"distortionRateReduction":0.2,"delayLevel":0.09999999999999974,"delayTime":0.33131938935235605,"delayFeedback":0.0666541256941855,"delayLFPFreq":0.43000000000000005,"delayLFPQ":0}';
	static inline var OwOwOw:String = '{"outputLevel":0.4404992213845257,"pitchBend":0.5,"osc0Type":0.53176956916494,"osc0Level":0.2848998922854662,"osc0Pan":0.6553399509564042,"osc0Slide":0.3345249738357958,"osc0Random":0.3254045475460585,"osc0Detune":0.48,"osc1Type":0.5856871545048695,"osc1Level":0.34120628116652374,"osc1Pan":0.274271479975432,"osc1Slide":0.19665794456058805,"osc1Random":0.27338116569444537,"osc1Detune":0.46399999999999997,"oscPhase":0.5367797849141063,"adsrAttack":0.13585058337077552,"adsrDecay":0.4118536375463009,"adsrSustain":0.7993384519033133,"adsrRelease":0.24872226793430885,"filterType":0.9169524870812893,"filterFrequency":0.04,"filterQ":1,"filterAttack":0.13216184906661455,"filterRelease":0.6764560150503516,"filterRange":0.2090064475871618,"distortionPregain":0.16845860145986036,"distortionWaveshaperAmount":0.7897845552489162,"distortionBits":0.15361713754013176,"distortionRateReduction":0.47468311311677097,"delayLevel":0.3756582126766443,"delayTime":0.5380281316579925,"delayFeedback":0.18479999119415877,"delayLFPFreq":0.8414817627705634,"delayLFPQ":0.6816484755836427}';
	static inline var Leadish:String = '{"outputLevel":0.38295858133584215,"pitchBend":0.5,"osc0Type":0.5938830460155663,"osc0Level":0.5741079380363225,"osc0Pan":0.5,"osc0Slide":0.048732493184506884,"osc0Random":0.19387254383414923,"osc0Detune":0.5,"osc1Type":0.3392857142857143,"osc1Level":0.2815980485267937,"osc1Pan":0.5117302227392793,"osc1Slide":0.10685698390325825,"osc1Random":0.01588528836145997,"osc1Detune":0.499,"oscPhase":0.14331354821100817,"adsrAttack":0.15529628787189734,"adsrDecay":0.7664752448908985,"adsrSustain":0.6781206807121636,"adsrRelease":0.4241326441790896,"filterType":0,"filterFrequency":0.12000000000000001,"filterQ":0.5797061326913537,"filterAttack":0.4112402198649936,"filterRelease":0.3100000000000001,"filterRange":0.9099999999999999,"distortionPregain":0.6008890603668984,"distortionWaveshaperAmount":0.13999999999999999,"distortionBits":0.1382608695652172,"distortionRateReduction":0,"delayLevel":0.14624362844973773,"delayTime":0.12053697529227002,"delayFeedback":0.311054561883211,"delayLFPFreq":0.35068133769556864,"delayLFPQ":0.12999999999999995}';
	static inline var Hubble:String = '{"outputLevel":0.4673323092423374,"pitchBend":0.5,"osc0Type":0.32187723594584483,"osc0Level":0.5501569783687592,"osc0Pan":0.035873363725841045,"osc0Slide":0.46743601735681295,"osc0Random":0.5535920813307174,"osc0Detune":0.5,"osc1Type":0.8837717605887779,"osc1Level":0.7479439487121999,"osc1Pan":0.15710694646462797,"osc1Slide":0.42825166909342927,"osc1Random":0.648777486756444,"osc1Detune":0.48000000000000004,"oscPhase":0.7499087216891347,"adsrAttack":0.42545380499213925,"adsrDecay":0.055507498793303967,"adsrSustain":0.5419561782851814,"adsrRelease":0.6898205606464309,"filterType":0.2519419346936047,"filterFrequency":0.34113304095342756,"filterQ":0.40043697291985136,"filterAttack":0.6723704796470709,"filterRelease":0.7224151427485048,"filterRange":0.6672021801024675,"distortionPregain":0.48588421270251314,"distortionWaveshaperAmount":0.5391920240223409,"distortionBits":0.4782608695652174,"distortionRateReduction":0.06000000000000014,"delayLevel":0.31409743022173675,"delayTime":0.4189383636324062,"delayFeedback":0.626016280371696,"delayLFPFreq":0.5011918721720574,"delayLFPQ":0.20447118736803485}';
	static inline var Voyager:String = '{"outputLevel":0.596160045024007,"pitchBend":0.48438319687767045,"osc0Type":0.4999197233202217,"osc0Level":0.18356056366115814,"osc0Pan":0.4514487967826426,"osc0Slide":0.5665156216174365,"osc0Random":0.6446686258167036,"osc0Detune":0.5682883285917342,"osc1Type":0.2984360323420594,"osc1Level":0.22554069174453617,"osc1Pan":0.4376573327369988,"osc1Slide":0.2393585837478034,"osc1Random":0.9832042241469026,"osc1Detune":0.7423076857998967,"oscPhase":0.4472648433037101,"adsrAttack":0.41782711129635564,"adsrDecay":0.20043661259114742,"adsrSustain":0.9824869338423012,"adsrRelease":0.93405529389046,"filterType":0,"filterFrequency":0.4091029983200133,"filterQ":0.7449476217851041,"filterAttack":0.09563750846311381,"filterRelease":0.7517979797534644,"filterRange":0.5817121911421419,"distortionPregain":0.34397339383140246,"distortionWaveshaperAmount":0.3808828432671727,"distortionBits":0.8468644326228811,"distortionRateReduction":0.55675847357139,"delayLevel":0.5397429227456447,"delayTime":0.20590351169019483,"delayFeedback":0.7042214359156789,"delayLFPFreq":0.34564317250624277,"delayLFPQ":0.09628216465935173}';
	
}