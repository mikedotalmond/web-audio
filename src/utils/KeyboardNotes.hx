package utils;

/**
 * ...
 * @author Mike Almond - MadeByPi
 */

import utils.NoteFrequency;

class KeyboardNotes {
	
	var noteFreq:NoteFrequency;
	
	public var keycodeToNoteFreq(default, null):Map<Int,Float>;
		
	public function new() {
		
		noteFreq 			= new NoteFrequency();
		keycodeToNoteFreq 	= new Map<Int,Float>();
		
		keycodeToNoteFreq.set(KeyCodes.Z, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C2')));
		keycodeToNoteFreq.set(KeyCodes.S, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#2')));
		keycodeToNoteFreq.set(KeyCodes.X, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D2')));
		keycodeToNoteFreq.set(KeyCodes.D, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#2')));
		keycodeToNoteFreq.set(KeyCodes.C, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E2')));
		keycodeToNoteFreq.set(KeyCodes.V, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F2')));
		keycodeToNoteFreq.set(KeyCodes.G, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F#2')));
		keycodeToNoteFreq.set(KeyCodes.B, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G2')));
		keycodeToNoteFreq.set(KeyCodes.H, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G#2')));
		keycodeToNoteFreq.set(KeyCodes.N, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A2')));
		keycodeToNoteFreq.set(KeyCodes.J, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A#2')));
		keycodeToNoteFreq.set(KeyCodes.M, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('B2')));
		keycodeToNoteFreq.set(KeyCodes.Q, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C3')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_2, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#3')));
		keycodeToNoteFreq.set(KeyCodes.W, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D3')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_3, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#3')));
		keycodeToNoteFreq.set(KeyCodes.E, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E3')));
		keycodeToNoteFreq.set(KeyCodes.R, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F3')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_5, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F#3')));
		keycodeToNoteFreq.set(KeyCodes.T, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G3')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_6, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G#3')));
		keycodeToNoteFreq.set(KeyCodes.Y, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A3')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_7, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A#3')));
		keycodeToNoteFreq.set(KeyCodes.U, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('B3')));
		keycodeToNoteFreq.set(KeyCodes.I, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C4')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_9, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#4')));
		keycodeToNoteFreq.set(KeyCodes.O, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D4')));
		keycodeToNoteFreq.set(KeyCodes.NUMBER_0, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#4')));
		keycodeToNoteFreq.set(KeyCodes.P, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E4')));		
	}
}