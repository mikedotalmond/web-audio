<div id="container"><!-- Based on http://codepen.io/lukeyphills/pen/CEfHx -->
	<div class="synth">
		<div class="touch-move-scroll-blocker"></div>
		::if modules.visible::
		<div id="modules" class="modules">
			
			::if modules.osc.visible::
			<div class="module osc">
				<div class="slider waveform">
					<span class="label">Osc</span>
					<input title="Oscillator Select" type="range" id="osc-shape" min="0" max="3" step="1" value="2" />
				</div>
				<div class="slider portamento">
					<span class="label">Slide</span>
					<input title="Portamento" type="range" id="portamento" min="0" max="2" step=".01" value="0" />
				</div>
			</div>
			::end::
			
			::if modules.filter.visible::
			<div class="module filter">
				<div class="slider filterType">
					<span class="label">Filter</span>
					<input title="Filter Mode" type="range" id="filter-type" min="0" max="5" step="1" value="0" />
				</div>
				<div class="slider">
					<span class="label">Freq</span>
					<input title="Filter Frequency" type="range" id="filter-freq" min="0" max="1" step=".05" value=".7" />
				</div>
				<div class="slider">
					<span class="label">Q</span>
					<input title="Filter Q-factor" type="range" id="filter-res" min="0" max="1" step=".01" value=".4" />
				</div>
				<div class="slider">
					<span class="label">Gain</span>
					<input title="Filter Gain" type="range" id="filter-gain" min="-12" max="3" step=".01" value="0" />
				</div>
				
				<div class="slider">
					<span class="label">Range</span>
					<input title="FEG Range" type="range" id="adsr-decay" min="0.0" max="3.0" step=".01" value="3.0" />
				</div>
				<div class="slider">
					<span class="label">A</span>
					<input title="FEG Attack" type="range" id="adsr-attack" min="0.0" max="3.0" step=".01" value="0" />
				</div>
				<div class="slider">
					<span class="label">R</span>
					<input title="FEG Release" type="range" id="adsr-release" min="0.0" max="3.0" step=".01" value="1.0" />
				</div>
			</div>
			::end::
			
			::if modules.adsr.visible::
			<div class="module adsr">
				<div class="slider">
					<span class="label">A</span>
					<input title="AEG Attack" type="range" id="adsr-attack" min="0.0" max="3.0" step=".01" value="0" />
				</div>
				<div class="slider">
					<span class="label">D</span>
					<input title="AEG Decay" type="range" id="adsr-decay" min="0.0" max="3.0" step=".01" value="3.0" />
				</div>
				<div class="slider">
					<span class="label">S</span>
					<input title="AEG Sustain" type="range" id="adsr-sustain" min="0.0" max="1.0" step=".01" value="1.0" />
				</div>
				<div class="slider">
					<span class="label">R</span>
					<input title="AEG Release" type="range" id="adsr-release" min="0.0" max="3.0" step=".01" value="1.0" />
				</div>
			</div>
			::end::
			
			::if modules.outGain.visible::
			<div class="module outGain">
				<div class="slider volume">
					<span class="label">Out</span>
					<input title="Output gain" type="range" id="outGain" min="-1" max="1" step=".01" value="0" />
				</div>
			</div>
			::end::
			
		</div>
		<br />
		::end::
		
		::if keyboard.visible::
		<div id="piano-keys">
			::foreach keyboard.keys::
				<div class="key natural" data-classname="natural" data-noteindex="::index::">
				::if hasSharp::
					<div class="key sharp" data-classname="sharp" data-noteindex="::(index+1)::"></div>
				::end::
				</div>
			::end::
		</div>
		::end::
	</div>
</div>