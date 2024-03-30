let sketch = (p) =>
{

    basic.p = p

    let osc;

    let words = [
        '.--...-.-.',
        '.--',
        '.---',
        '.--.-..',
        '--.-.-.',
        '.-',
        "--.--",
        '..'


    ]

    let filter = new p5.LowPass();
    let delay = new p5.Delay();
    let useDelay;
    let useFilter;

    let sm_a_word = null
    let sm_a_timestamp = null
    let sm_a_word_index = null

    let lightTimestamp = null

    let light = 0;

    let settings = {
        init: 'neutral',
        transitions: [
          { name: 'neutral', from: "*", to: "neutral"},
          { name: 'hurt', from: "*", to: "hurt" },
          { name: 'angry', from: "*", to: "angry"},
          { name: 'sad', from: "*", to: "*"},
          { name: 'relax', from: "*", to: "neutral"}
        ],
        // methods: {
        //   onMelt:     function() {
        //   onFreeze:   function() {
        //   onVaporize: function() {
        //   onCondense: function() {
        // }
    }


    let sm_a; //= new StateMachine(settings);
    let sm_b; // = new StateMachine(settings);

    function updateWord() {

        let duration = basic.getSetting("duration");
        let oscillator = basic.getSetting("oscillator")

        let basePitch = basic.getSetting("base pitch")
        let pitchMultiplier = basic.getSetting("pitch change")
        let lengthMultiplier = basic.getSetting("length multiplier")
        let rampTime = basic.getSetting("Ramp between fqs");



        // if (useDelay !== basic.getSetting("use delay")) {
        //     useDelay = basic.getSetting("use delay")
        // }

        //let useDelay = basic.getSetting("use delay")

        let filterFrequency = basic.getSetting("filter freq")
        let filterR = basic.getSetting("filter R")

        let delayTime = basic.getSetting("delay time")
        let delayFeedback = basic.getSetting("delay feedback")
        let delayFreq = basic.getSetting("delay freq")

        filter.freq(filterFrequency)
        filter.res(filterR);

        let a = basic.getSetting("A")
        let d = basic.getSetting("D")
        let s = basic.getSetting("S")
        let r = basic.getSetting("R")

        //let t = duration

        if (!sm_a_word) {
            return;
        }

        if (sm_a_timestamp === null) {

            if (sm_a_word_index === null) {
                sm_a_word_index = 0
            } else {
                sm_a_word_index++;
            }



            if (sm_a_word_index < sm_a_word.length) {


                let f = sm_a_word[sm_a_word_index]
                if (f === '.') {
                    if (oscillator !== "noise") {
                        osc.freq(basePitch, rampTime)
                    }
                    envelope.setADSR(a, d, s, r);
                    sm_a_timestamp = new Date().getTime() + duration

                }

                if (f === '-') {
                    if (oscillator !== "noise") {
                        osc.freq(basePitch * pitchMultiplier, rampTime)
                    }
                    envelope.setADSR(a, d * lengthMultiplier, s, r);
                    sm_a_timestamp = new Date().getTime() + duration * lengthMultiplier
                }

                lightTimestamp = new Date().getTime();

                delay.process(osc, delayTime, delayFeedback, delayFreq)

                if (useDelay) {
                    delay.process(osc, delayTime, delayFeedback, delayFreq)
                    //delay.connect()
                }  else {
                    //delay.disconnect()
                }

                if (useFilter) {
                    filter.process(osc)
                } else {
                    filter.disconnect()
                }

                light = 255;

                envelope.play()
            } else {
                sm_a_word_index = null
                sm_a_word = null
            }

            return;

        }

        if (sm_a_timestamp < new Date().getTime()) {
            sm_a_timestamp = null;

        }


    }

    function updateStateMachine(one, other) {

        let speakChance = basic.getSetting("speak chance")

        updateWord()

        if (!sm_a_word) {
            if (p.random() > (1 - speakChance))
            sm_a_word = p.random(words)
        }

        /*
	 * if (one.is('angry')) {

        }

        if (p.random() > 0.995) {
            if (other.state === "angry" && one.can("hurt")) {
              //
                one.hurt();
            }

        }

        if (p.random() > 0.995) {
            if (one.can("angry")) {
              //
                one.angry();
            }
        }

        if (one.state === "hurt" && other.state !== "angry") {
            if (p.random > 0.9) {
                one.neutral();
            }
        }

        if (other.state == "hurt" && p.random() > 0.9) {
            one.neutral();
        }
	*/

    }


    osc = new p5.SinOsc();

    envelope = new p5.Env();
    envelope.setADSR(0.1, 0.3, 0.3, 0.5);
    //osc.connect(filter)
    osc.start();
    osc.freq(200)
    osc.amp(envelope)
    // set attackLevel, releaseLevel
    envelope.setRange(1, 0);

    p.draw = () =>
    {
        p.userStartAudio();
        p.noStroke();

        basic.draw(false);


        // p.clear();
        // p.fill(0)
        // p.rect(0, 0, p.width, p.height)


        // p.fill(0, 10)
        // p.rect(0, 0, p.width, p.height)

        let lightDim = basic.getSetting("light dim")
        let lightTimeout = basic.getSetting("light timeout")

        // if (lightMode === "fade") {

        // } else {
        //     p.fill(0)
        // }

        p.fill(0, lightDim)
        p.rect(0, 0, p.width, p.height)



        if (lightTimestamp !== null) {

            p.fill(255)
            p.rect(0, 0, p.width, p.height)

            if (lightTimestamp + lightTimeout < new Date().getTime()) {
                lightTimestamp = null
            }
        }

        // light -= ligthDim
        // light = p.max(0, light)

      //  p.fill(basic._primary)
        p.textFont(font)

        p.fill(light)


       // p.rect(0, 0, p.width, p.height)

        updateStateMachine(sm_a, sm_b)
        updateStateMachine(sm_b, sm_a)

        p.fill(p.abs(255 - light))

        //p.text(sm_a.state, p.width / 4 * 1, p.height / 2)
       // p.text(sm_b.state, p.width / 4 * 3, p.height / 2)

        // if (sm_a_word) {


        //     let l = 15 + sm_a_word.length;
        //     let s = "|   " + sm_a_word.substring(0, sm_a_word_index + 1) + " ".repeat( l - sm_a_word_index - 10) + "|"
        //     let tt = 20

        //     p.text("÷" + "-". repeat(l - 6) + "÷",                                      p.width / 4 * 1 - 50, p.height / 2 - 6 * tt - 40)
        //     p.text("|" + " ".repeat(l - 6) + "|",                                       p.width / 4 * 1 - 50, p.height / 2 - 5 * tt - 40)
        //     p.text(s,                                                                   p.width / 4 * 1 - 50, p.height / 2 - 4 * tt - 40)
        //     p.text("|" + " ".repeat(l - 6) + "|",                                       p.width / 4 * 1 - 50, p.height / 2 - 3 * tt - 40)
        //     p.text("÷" + "-". repeat(l - 6) + "÷",                                      p.width / 4 * 1 - 50, p.height / 2 - 2 * tt - 40)
        //     p.text("  V ",                                                              p.width / 4 * 1 - 50, p.height / 2 - tt - 40)

        //    // p.text(sm_a_word.substring(0, sm_a_word_index + 1), p.width / 4 * 1, p.height / 2 - 30)
        // }
    }


    p.setup = () =>
    {

        p.frameRate(15)
        preferredWidth = p.displayWidth
        preferredHeight = p.displayHeight
        basic.setup()


        basic.addSettingsRandomize()
        basic._quickSettings.toggleVisibility();

        basic.addSetting("speak chance", "range", 0.045, 0.001, 0.1, 0.001, true);

        // basic.addSetting("light mode", "dropdown", ["fade", "no fade"])
        basic.addSetting("light dim", "range", 26, 0, 255, 0.1)
        basic.addSetting("light timeout", "range", 2, 0, 255, 0.1)

        basic.addSetting("duration", "range", 100, 0, 400, 1)

        basic.addSetting("base pitch", "range", 96, 30, 2000, 1)
        basic.addSetting("pitch change", "range", 1.31, 1, 2, 0.01)
        basic.addSetting("length multiplier", "range", 1.26, 1, 2, 0.01)
        basic.addSetting("oscillator", "dropdown", ["sine", "square", "triangle", "saw", "noise", "pwm"], null, null, null, true, (setting) => {

            switch(setting.value) {
                case "sine":
                    osc.stop();
                    osc = new p5.SinOsc();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
                case "square":
                    osc.stop();
                    osc = new p5.SqrOsc();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
                case "triangle":
                    osc.stop();
                    osc = new p5.TriOsc();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
                case "saw":
                    osc.stop();
                    osc = new p5.SawOsc();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
                case "noise":
                    osc.stop();
                    osc = new p5.Noise();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
                case "pwm":
                    osc.stop();
                    osc = new p5.Pulse();
                    osc.amp(envelope)
                    //osc.connect(filter)
                    osc.start()
                    break;
            }


        });

        basic.addSetting("A", "range", 0.016, 0.001, 0.2, 0.001, true);
        basic.addSetting("D", "range", 0.032, 0.001, 0.2, 0.001, true);
        basic.addSetting("S", "range", 0.023, 0.001, 0.2, 0.001, true);
        basic.addSetting("R", "range", 0.015, 0.001, 0.2, 0.001, true);

        basic.addSetting("Ramp between fqs", "range", 0.209, 0.0, 1, 0.001, true);

        basic.addSetting("use filter", "boolean", false, null, null, null, true, (setting) => {
            useFilter = !useFilter
        })

        basic.addSetting("filter type", "dropdown", ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"], null, null, null, true, (setting) => {
            filter.setType(setting.value)
        })
        basic.addSetting("filter freq", "range", 200, 30, 2000, 1, true)
        basic.addSetting("filter R", "range", 1, 0, 50, 1, true)

        basic.addSetting("use delay", "boolean", false)
        basic.addSetting("delay time", "range", 0, 0, 1, 0.001, true)
        basic.addSetting("delay feedback", "range", 0, 0, 1, 0.001, true)
        basic.addSetting("delay freq", "range", 0, 0, 1000, 0.001, true)

        basic.randomize(["duration", "base pitch", "pitch change", "length multiplier", "oscillator" ])

        osc.stop();
        osc = new p5.SawOsc();
        osc.amp(envelope)
        osc.connect(filter)
        osc.start()


    }

    p.mousePressed = (event) => {
        if (event.button === 2) {
            basic._quickSettings.toggleVisibility();
        }
    }
}


new p5(sketch, document.querySelector("body")[0])
