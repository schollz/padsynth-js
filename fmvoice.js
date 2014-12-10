ONE_CENT = Math.exp(Math.log(2)/1200);

function FMVoice(frequency, velocity) {
	var params = FMVoice.params;
	var ops = params.OPERATORS;
	this.frequency = frequency;
	this.velocity = velocity;
	this.algorithm = this['algorithm' + parseInt(params.ALGO.get())];
	this.feedback = params.FEEDBACK.get();
	this.op1 = new Operator(frequency * ops.OP1.FREQ.get() * Math.pow(ONE_CENT, ops.OP1.DETUNE.get()), this.opEnvFromParams(ops.OP1));
	this.op2 = new Operator(frequency * ops.OP2.FREQ.get() * Math.pow(ONE_CENT, ops.OP2.DETUNE.get()), this.opEnvFromParams(ops.OP2));
	this.op3 = new Operator(frequency * ops.OP3.FREQ.get() * Math.pow(ONE_CENT, ops.OP3.DETUNE.get()), this.opEnvFromParams(ops.OP3));
	this.op4 = new Operator(frequency * ops.OP4.FREQ.get() * Math.pow(ONE_CENT, ops.OP4.DETUNE.get()), this.opEnvFromParams(ops.OP4));
	this.op5 = new Operator(frequency * ops.OP5.FREQ.get() * Math.pow(ONE_CENT, ops.OP5.DETUNE.get()), this.opEnvFromParams(ops.OP5));
	this.op6 = new Operator(frequency * ops.OP6.FREQ.get() * Math.pow(ONE_CENT, ops.OP6.DETUNE.get()), this.opEnvFromParams(ops.OP6));
}

FMVoice.prototype.render = function() {
	return this.velocity * (
			this.op1.render(this.op2.render()) +
			this.op3.render(this.op4.render())
		);
}

FMVoice.prototype.noteOff = function() {
	this.op1.noteOff();
	this.op2.noteOff();
	this.op3.noteOff();
	this.op4.noteOff();
FMVoice.prototype.isFinished = function() {
	return this.op1.isFinished() && this.op2.isFinished();
};

FMVoice.createComponents = function(el) {
	for (m in FMVoice.params.OPERATORS) {
		var op = FMVoice.params.OPERATORS[m];
		var groupEl = $('<div class="param-group">').append($('<div class="group-name">').text(m));
		for (n in op) {
			var param = op[n];
			$(groupEl).append(param.render());
		}
		$(el).append(groupEl);
	}
	$(el).append($('<hr style="clear: both">'));
	$(el).append(FMVoice.params.ALGO.render());
	$(el).append(FMVoice.params.FEEDBACK.render());
	$(el).append($('<img src="algorithms.png" class="algo-diagram">'));
};

FMVoice.params = {
	ALGO: new Param("Algorithm", 1, 1, 32, 1),
	FEEDBACK: new Param("Feedback", 1, 0, 1),
	OPERATORS: {
		OP1: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 2, 1, 16, 1),
			V: new Param("Volume", 1, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		},
		OP2: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1.5,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 11, 1, 16, 1),
			V: new Param("Volume", 0.78, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		},
		OP3: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1.5,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 1, 1, 16, 1),
			V: new Param("Volume", 0.78, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		},
		OP4: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1.5,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 1, 1, 16, 1),
			V: new Param("Volume", 0.78, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		},
		OP5: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1.5,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 6, 1, 16, 1),
			V: new Param("Volume", 0.78, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		},
		OP6: {
			A: new Param("Attack", 0,   0, 1),
			D: new Param("Decay", 1.5,   0, 3),
			S: new Param("Sustain", 0,   0, 1),
			R: new Param("Release", 0.2, 0, 5),
			FREQ: new Param("Freq. Multiplier", 16, 1, 16, 1),
			V: new Param("Volume", 0.78, 0, 12),
			DETUNE: new Param("Detune", 0, -50, 50, 1)
		}
	}
};

function Param(name, def, min, max, step) {
	this.name = name;
	this.min = min;
	this.max = max;
	this.val = def;
	this.step = step || 0.01;
}

Param.prototype.get = function() {
	return parseFloat(this.val);
};

Param.prototype.render = function() {
	this.el = $('<div class="param">')
		.append($('<div class="param-label">').text(this.name))
		.append($('<div class="param-value">').text(this.val.toFixed(this.step == 1 ? 0 : 2)))
		.append(
			$('<input type="range"/>').attr('step', this.step).attr('min', this.min).attr('max', this.max).attr('value', this.val)
		);
	this.el.find('input').on('input change', this.onChange.bind(this));
	return this.el;
};

Param.prototype.onChange = function(e) {
	this.val = parseFloat(this.el.find('input').val());
	this.el.find('.param-value').text(this.val.toFixed(this.step == 1 ? 0 : 2));
	console.log(this.name, this.val);
};
