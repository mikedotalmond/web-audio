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
		
		keycodeToNoteFreq.set(Keyboard.Z, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C2')));
		keycodeToNoteFreq.set(Keyboard.S, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#2')));
		keycodeToNoteFreq.set(Keyboard.X, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D2')));
		keycodeToNoteFreq.set(Keyboard.D, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#2')));
		keycodeToNoteFreq.set(Keyboard.C, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E2')));
		keycodeToNoteFreq.set(Keyboard.V, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F2')));
		keycodeToNoteFreq.set(Keyboard.G, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F#2')));
		keycodeToNoteFreq.set(Keyboard.B, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G2')));
		keycodeToNoteFreq.set(Keyboard.H, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G#2')));
		keycodeToNoteFreq.set(Keyboard.N, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A2')));
		keycodeToNoteFreq.set(Keyboard.J, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A#2')));
		keycodeToNoteFreq.set(Keyboard.M, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('B2')));
		keycodeToNoteFreq.set(Keyboard.Q, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C3')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_2, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#3')));
		keycodeToNoteFreq.set(Keyboard.W, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D3')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_3, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#3')));
		keycodeToNoteFreq.set(Keyboard.E, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E3')));
		keycodeToNoteFreq.set(Keyboard.R, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F3')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_5, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('F#3')));
		keycodeToNoteFreq.set(Keyboard.T, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G3')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_6, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('G#3')));
		keycodeToNoteFreq.set(Keyboard.Y, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A3')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_7, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('A#3')));
		keycodeToNoteFreq.set(Keyboard.U, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('B3')));
		keycodeToNoteFreq.set(Keyboard.I, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C4')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_9, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('C#4')));
		keycodeToNoteFreq.set(Keyboard.O, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D4')));
		keycodeToNoteFreq.set(Keyboard.NUMBER_0, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('D#4')));
		keycodeToNoteFreq.set(Keyboard.P, noteFreq.noteIndexToFrequency(noteFreq.noteNameToIndex('E4')));		
	}
}