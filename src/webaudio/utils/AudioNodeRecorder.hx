package webaudio.utils;

/**
 * A Haxe port of Recorderjs - https://github.com/mattdiamond/Recorderjs
 * 
 * Utility to record the output of an AudioNode and save as WAV
 * (encode process runs asynchronously in a webworker)
 */

import flambe.util.Signal1;
import js.html.URL;

import js.Browser;

import js.html.AnchorElement;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.ScriptProcessorNode;

import js.html.Blob;
import js.html.Document;
import js.html.DOMURL;
import js.html.Float32Array;
import js.html.MessageEvent;
import js.html.Worker;

 
class AudioNodeRecorder {
	
	public var recording		(default, null):Bool;
	public var wavEncoded		(default, null):Signal1<Blob>;
	public var bufferExported	(default, null):Signal1<Array<Float32Array>>;

	var worker	:Worker;
	var context	:AudioContext;
	var node	:ScriptProcessorNode;
	
	public function new(source:AudioNode, bufferSize:Int=4096, workerPath:String='js/recorderWorker.js') {
		
		context 		= source.context;
		node 			= context.createScriptProcessor(bufferSize, 2, 2);
		worker 			= new Worker(workerPath);
		recording		= false;
		
		wavEncoded 		= new Signal1<Blob>();
		bufferExported 	= new Signal1<Array<Float32Array>>();
		
		worker.postMessage({
		  command: 'init',
		  config: { sampleRate: context.sampleRate }
		});
		
		worker.onmessage = onWorkerMessage;
		node.onaudioprocess = onAudioProcess;

		source.connect(node);
		node.connect(context.destination); // this should not be necessary	
	}
	
	
    function onWorkerMessage(e:MessageEvent) {
		if (Std.is(e.data, Blob)) {
			wavEncoded.emit(cast e.data);
		} else if (Std.is(e.data, Array)) {
			bufferExported.emit(cast e.data);
		} else {
			throw "Unexpected message data";
		}
    }
	
	
	function onAudioProcess(e) {
		if (!recording) return;
		worker.postMessage({
			command: 'record',
			buffer: [
			  e.inputBuffer.getChannelData(0),
			  e.inputBuffer.getChannelData(1)
			]
		});	  
	}
	
    inline public function start () {
      recording = true;
	}
	
    inline public function stop (){
      recording = false;
    }

	public function clear (){
      worker.postMessage( ClearBufferMessage );
    }
	
	public function getBuffer() {
      worker.postMessage( GetBufferMessage );
    }

	public function encodeWAV(){
      worker.postMessage(EncodeWAVMessage);
	}
	
	public static function forceDownload(blob:Blob, filename:String = 'output.wav') {
		
		var doc	:Document = js.Browser.window.document;
		var link:AnchorElement = cast doc.createElement('a');
		
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		
		var click = doc.createEvent("Event");
		click.initEvent("click", true, true);
		link.dispatchEvent(click);
	}
	 
	static var GetBufferMessage		:Dynamic = { command: 'getBuffer' };
	static var EncodeWAVMessage		:Dynamic = { command: 'exportWAV', type: 'audio/wav' };
	static var ClearBufferMessage	:Dynamic = { command: 'clear' };
  
}