package utils;

/**
 * ...
 * @author Mike Almond - MadeByPi
 */

import utils.NoteFrequencyUtil;

class KeyboardNotes {
	
	public var noteFreq(default, null):NoteFrequencyUtil;
	public var keycodeToNoteFreq(default, null):Map<Int,Float>;
	public var keycodeToNoteIndex(default, null):Map<Int,Int>;
		
	public function new() {
		
		noteFreq 			= new NoteFrequencyUtil();
		keycodeToNoteFreq 	= new Map<Int,Float>();
		keycodeToNoteIndex 	= new Map<Int,Int>();
		
		keycodeToNoteIndex.set(KeyCodes.Z, noteFreq.noteNameToIndex('C0'));
		keycodeToNoteIndex.set(KeyCodes.S, noteFreq.noteNameToIndex('C#0'));
		keycodeToNoteIndex.set(KeyCodes.X, noteFreq.noteNameToIndex('D0'));
		keycodeToNoteIndex.set(KeyCodes.D, noteFreq.noteNameToIndex('D#0'));
		keycodeToNoteIndex.set(KeyCodes.C, noteFreq.noteNameToIndex('E0'));
		keycodeToNoteIndex.set(KeyCodes.V, noteFreq.noteNameToIndex('F0'));
		keycodeToNoteIndex.set(KeyCodes.G, noteFreq.noteNameToIndex('F#0'));
		keycodeToNoteIndex.set(KeyCodes.B, noteFreq.noteNameToIndex('G0'));
		keycodeToNoteIndex.set(KeyCodes.H, noteFreq.noteNameToIndex('G#0'));
		keycodeToNoteIndex.set(KeyCodes.N, noteFreq.noteNameToIndex('A0'));
		keycodeToNoteIndex.set(KeyCodes.J, noteFreq.noteNameToIndex('A#0'));
		keycodeToNoteIndex.set(KeyCodes.M, noteFreq.noteNameToIndex('B0'));
		keycodeToNoteIndex.set(KeyCodes.Q, noteFreq.noteNameToIndex('C1'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_2, noteFreq.noteNameToIndex('C#1'));
		keycodeToNoteIndex.set(KeyCodes.W, noteFreq.noteNameToIndex('D1'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_3, noteFreq.noteNameToIndex('D#1'));
		keycodeToNoteIndex.set(KeyCodes.E, noteFreq.noteNameToIndex('E1'));
		keycodeToNoteIndex.set(KeyCodes.R, noteFreq.noteNameToIndex('F1'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_5, noteFreq.noteNameToIndex('F#1'));
		keycodeToNoteIndex.set(KeyCodes.T, noteFreq.noteNameToIndex('G1'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_6, noteFreq.noteNameToIndex('G#1'));
		keycodeToNoteIndex.set(KeyCodes.Y, noteFreq.noteNameToIndex('A1'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_7, noteFreq.noteNameToIndex('A#1'));
		keycodeToNoteIndex.set(KeyCodes.U, noteFreq.noteNameToIndex('B1'));
		keycodeToNoteIndex.set(KeyCodes.I, noteFreq.noteNameToIndex('C2'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_9, noteFreq.noteNameToIndex('C#2'));
		keycodeToNoteIndex.set(KeyCodes.O, noteFreq.noteNameToIndex('D2'));
		keycodeToNoteIndex.set(KeyCodes.NUMBER_0, noteFreq.noteNameToIndex('D#2'));
		keycodeToNoteIndex.set(KeyCodes.P, noteFreq.noteNameToIndex('E2'));		
		keycodeToNoteIndex.set(KeyCodes.LEFTBRACKET, noteFreq.noteNameToIndex('F2'));		
		keycodeToNoteIndex.set(KeyCodes.EQUAL, noteFreq.noteNameToIndex('F#2'));		
		keycodeToNoteIndex.set(KeyCodes.RIGHTBRACKET, noteFreq.noteNameToIndex('G2'));
		
		keycodeToNoteFreq.set(KeyCodes.Z, keycodeToNoteIndex.get(KeyCodes.Z));
		keycodeToNoteFreq.set(KeyCodes.S, keycodeToNoteIndex.get(KeyCodes.S));
		keycodeToNoteFreq.set(KeyCodes.X, keycodeToNoteIndex.get(KeyCodes.X));
		keycodeToNoteFreq.set(KeyCodes.D, keycodeToNoteIndex.get(KeyCodes.D));
		keycodeToNoteFreq.set(KeyCodes.C, keycodeToNoteIndex.get(KeyCodes.C));
		keycodeToNoteFreq.set(KeyCodes.V, keycodeToNoteIndex.get(KeyCodes.V));
		keycodeToNoteFreq.set(KeyCodes.G, keycodeToNoteIndex.get(KeyCodes.G));
		keycodeToNoteFreq.set(KeyCodes.B, keycodeToNoteIndex.get(KeyCodes.B));
		keycodeToNoteFreq.set(KeyCodes.H, keycodeToNoteIndex.get(KeyCodes.H));
		keycodeToNoteFreq.set(KeyCodes.N, keycodeToNoteIndex.get(KeyCodes.N));
		keycodeToNoteFreq.set(KeyCodes.J, keycodeToNoteIndex.get(KeyCodes.J));
		keycodeToNoteFreq.set(KeyCodes.M, keycodeToNoteIndex.get(KeyCodes.M));
		keycodeToNoteFreq.set(KeyCodes.Q, keycodeToNoteIndex.get(KeyCodes.Q));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_2, keycodeToNoteIndex.get(KeyCodes.NUMBER_2));
		keycodeToNoteFreq.set(KeyCodes.W, keycodeToNoteIndex.get(KeyCodes.W));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_3, keycodeToNoteIndex.get(KeyCodes.NUMBER_3));
		keycodeToNoteFreq.set(KeyCodes.E, keycodeToNoteIndex.get(KeyCodes.E));
		keycodeToNoteFreq.set(KeyCodes.R, keycodeToNoteIndex.get(KeyCodes.R));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_5, keycodeToNoteIndex.get(KeyCodes.NUMBER_5));
		keycodeToNoteFreq.set(KeyCodes.T, keycodeToNoteIndex.get(KeyCodes.T));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_6, keycodeToNoteIndex.get(KeyCodes.NUMBER_6));
		keycodeToNoteFreq.set(KeyCodes.Y, keycodeToNoteIndex.get(KeyCodes.Y));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_7, keycodeToNoteIndex.get(KeyCodes.NUMBER_7));
		keycodeToNoteFreq.set(KeyCodes.U, keycodeToNoteIndex.get(KeyCodes.U));
		keycodeToNoteFreq.set(KeyCodes.I, keycodeToNoteIndex.get(KeyCodes.I));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_9, keycodeToNoteIndex.get(KeyCodes.NUMBER_9));
		keycodeToNoteFreq.set(KeyCodes.O, keycodeToNoteIndex.get(KeyCodes.O));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_0, keycodeToNoteIndex.get(KeyCodes.NUMBER_0));
		keycodeToNoteFreq.set(KeyCodes.P, keycodeToNoteIndex.get(KeyCodes.P));		
		keycodeToNoteFreq.set(KeyCodes.LEFTBRACKET, keycodeToNoteIndex.get(KeyCodes.LEFTBRACKET));		
		keycodeToNoteFreq.set(KeyCodes.EQUAL, keycodeToNoteIndex.get(KeyCodes.EQUAL));
		keycodeToNoteFreq.set(KeyCodes.RIGHTBRACKET, keycodeToNoteIndex.get(KeyCodes.RIGHTBRACKET));		
	}
	
	public function dispose() {
		noteFreq 			= null;
		keycodeToNoteFreq 	= null;
		keycodeToNoteIndex 	= null;
	}
}