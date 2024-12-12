import musicalScaleColors from 'musical-scale-colors';
import * as pixi from 'pixi.js';
import * as teoria from 'teoria';

pixi.utils._saidHello = true;

/**
 * JavaScript 2D WebGL / Canvas animated piano roll
 * @module pixiPianoRoll
 * @author Matthew Hasbach
 * @copyright Matthew Hasbach 2015
 * @license MIT
 */

/**
 * Playback position expressed in bars:quarters:sixteenths format (e.g. `"1:2:0"`)
 * @typedef {string} transportTime
 * @global
 */

/**
 * Musical note expressed in [Scientific notation]{@link https://en.wikipedia.org/wiki/Scientific_pitch_notation}, [Helmholtz notation]{@link https://en.wikipedia.org/wiki/Helmholtz_pitch_notation}, [piano key number]{@link https://en.wikipedia.org/wiki/Piano_key_frequencies}, [audio frequency]{@link https://en.wikipedia.org/wiki/Audio_frequency} (the closest note will be used), or [MIDI]{@link https://en.wikipedia.org/wiki/MIDI} note number
 * @typedef {string|number} note
 * @global
 */

/**
 * Note duration expressed as a number (e.g. `1` for a whole note) or string (e.g. `"4n"` for a quarter note)
 * @typedef {string|number} noteDuration
 * @global
 */

/**
 * See the typedefs for [transportTime]{@link transportTime}, [note]{@link note}, and [noteDuration]{@link noteDuration}
 * @typedef {Array.<Array<transportTime, note, noteDuration>>} noteData
 * @global
 */

/**
 * Instantiate a pixiPianoRoll
 * @alias module:pixiPianoRoll
 * @param {Object} opt - Options object
 * @param {number} [opt.width=900] - Width of the piano roll
 * @param {number} [opt.height=400] - Height of the piano roll
 * @param {number} [opt.pianoKeyWidth=125] - Width of the piano keys
 * @param {number|Object<number>} [opt.noteColor=musicalScaleColors.dDJameson] - Hexadecimal color of every note or object that has pitch class (chroma) property names and hexadecimal color values. See [musical-scale-colors]{@link https://github.com/mjhasbach/musical-scale-colors} for palettes (including the default).
 * @param {number} [opt.noteColor=0x333333] - Hexadecimal color of the grid lines
 * @param {number} [opt.noteColor=0] - Hexadecimal color of the background
 * @param {number} [opt.bpm=140] - Beats per minute
 * @param {boolean} [opt.activateKeys=true] - If true, the color of the piano keys will change to the color of the notes that intersect them
 * @param {boolean} [opt.antialias=true] - Whether or not the renderer will use antialiasing
 * @param {number} [opt.zoom=4] - Amount of visible measures
 * @param {number} [opt.resolution=1] - Amount of vertical grid lines per measure
 * @param {transportTime} [opt.time=0:0:0] - The [transportTime]{@link transportTime} at which playback will begin
 * @param {string} [opt.renderer=WebGLRenderer] - Determines the renderer type. Must be `"WebGLRenderer"` or `"CanvasRenderer"`.
 * @param {string} [opt.noteFormat=String] - The format of the [notes]{@link note} in `opt.noteData`. `"String"` for scientific or Helmholtz notation, `"Key"` for piano key numbers, `"Frequency"` for audio frequencies, or `"MIDI"` for MIDI note numbers.
 * @param {noteData} [opt.noteData=[]] - Note data
 * @returns {pianoRollAPI}
 * @example
var pianoRoll = pixiPianoRoll({
    width: 900,
    height: 400,
    noteColor: 0xdb000f,
    gridLineColor: 0x333333,
    blackGridBgColor: 0x1e1e1e,
    whiteGridBgColor: 0x282828,
    bpm: 140,
    antialias: true,
    zoom: 4,
    resolution: 2,
    time: '0:0:0',
    renderer: 'WebGLRenderer',
    noteFormat: 'String',
    noteData: [
        ['0:0:0', 'C4', '2n'],
        ['0:0:0', 'D4', '2n'],
        ['0:0:0', 'E4', '2n'],
        ['0:2:0', 'B4', '4n'],
        ['0:3:0', 'A#4', '4n']
    ]
});

document.getElementsByTagName('body')[0].appendChild(pianoRoll.view);

pianoRoll.playback.play();
 */
function pixiPianoRoll(opt) {
    const colors = {
        blackKey: 0x000000,
        whiteKey: 0xffffff,
        blackGridBg: 0x1e1e1e,
        whiteGridBg: 0x282828,
    };

    opt = Object.assign({
        width: 900,
        height: 400,
        pianoKeyWidth: 125,
        noteColor: musicalScaleColors.dDJameson,
        gridLineColor: 0x333333,
        blackGridBgColor: colors.blackGridBg,
        whiteGridBgColor: colors.whiteGridBg,
        bpm: 140,
        activateKeys: true,
        antialias: true,
        zoom: 4,
        resolution: 1,
        time: '0:0:0',
        renderer: 'WebGLRenderer',
        noteFormat: 'String',
        noteData: []
    }, opt);

    let keys,
        lastTime,
        beatsPerMs,
        pxMovementPerMs,
        noteContainer,
        noteRange,
        noteRangeDiff,
        noteHeight,
        innerNoteHeight,
        pianoContainer,
        barWidth,
        beatWidth,
        sixteenthWidth,
        gridLineWidth,
        halfGridLineWidth,
        gridLineSpacing,
        activeKeys,
        playing = false,
        stage = new pixi.Container(),
        rollContainer = new pixi.Container(),
        gridlineContainers = {
            main: new pixi.Container()
        },
        renderer = new pixi[opt.renderer](
            opt.width,
            opt.height,
            {
                antialias: opt.antialias,
                autoResize: true
            }
        );

    function getTeoriaNote(note) {
        let noteObj = teoria.note['from' + opt.noteFormat](note);

        return opt.noteFormat === 'Frequency' ? noteObj.note : noteObj;
    }

    function getNoteRange() {
        let min, max;

        for (let [,note] of opt.noteData) {
            let keyNumber = getTeoriaNote(note).key();

            if (keyNumber < min || typeof min !== 'number') {
                min = keyNumber;
            }
            if (keyNumber > max || typeof max !== 'number') {
                max = keyNumber;
            }
        }

        return {min: min - 1, max: max};
    }

    function drawPianoKey(key, active) {
        return (key.graphic || new pixi.Graphics())
            .clear()
            .beginFill(active ? key.activeColor : key.color)
            .lineStyle(key.color === colors.whiteKey ? noteHeight / 10 : 0, colors.blackKey)
            .drawRect(0, key.y, key.width, key.height)
            .endFill();
    }

    function drawPianoKeys() {
        let whiteKeys = [],
            blackKeys = [],
            blackKeyWidth = opt.pianoKeyWidth / 1.575;

        keys = {};
        activeKeys = new Set;
        stage.removeChild(pianoContainer);
        pianoContainer = new pixi.Container();

        for (let i = noteRange.min; i < noteRange.max + 2; i++) {
            let y = opt.height + ((noteRange.min - i) * noteHeight),
                note = teoria.note.fromKey(i),
                chroma = note.chroma(),
                key = {
                    keyNumber: note.key(),
                    activeColor: typeof opt.noteColor === 'number' ? opt.noteColor : opt.noteColor[chroma]
                };

            if (new Set([0, 2, 4, 5, 7, 9, 11]).has(chroma)) {
                whiteKeys.push(Object.assign(key, {
                    y: y + (new Set([4, 11]).has(chroma) ? 0 : -noteHeight / 2),
                    width: opt.pianoKeyWidth,
                    height: new Set([2, 7, 9]).has(chroma) ? noteHeight * 2 : noteHeight * 1.5,
                    color: colors.whiteKey
                }));
            }
            else {
                blackKeys.push(Object.assign(key, {
                    y: y,
                    width: blackKeyWidth,
                    height: noteHeight,
                    color: colors.blackKey
                }));
            }
        }

        whiteKeys.concat(blackKeys).forEach(function(key) {
            let pixiKey = drawPianoKey(key);

            keys[key.keyNumber] = Object.assign(key, {graphic: pixiKey});
            pianoContainer.addChild(pixiKey);
        });

        stage.addChild(pianoContainer);
    }

    function transportTimeToX(transportTime, isNote) {
        if (!transportTime) {
            return 0;
        }

        let [bar, quarter = 0, sixteenth = 0] = transportTime.split(':'),
            x = (barWidth * bar) + (beatWidth * quarter) + (sixteenthWidth * sixteenth);

        return isNote ? x : opt.pianoKeyWidth - x;
    }

    function drawNotes() {
        let oldContainer = rollContainer.removeChild(noteContainer);

        noteContainer = new pixi.Container();

        for (let [transportTime, note, duration] of opt.noteData) {
            let pixiNote = new pixi.Graphics(),
                teoriaNote = getTeoriaNote(note),
                keyNumber = teoriaNote.key(),
                color = typeof opt.noteColor === 'number' ? opt.noteColor : opt.noteColor[teoriaNote.chroma()];

            pixiNote
                .beginFill(color)
                .drawRect(0, 0, barWidth / parseInt(duration), innerNoteHeight)
                .endFill();

            pixiNote.x = transportTimeToX(transportTime, true) + halfGridLineWidth;
            pixiNote.y = opt.height - ((keyNumber - noteRange.min) * noteHeight) + halfGridLineWidth;
            pixiNote.keyNumber = keyNumber;

            noteContainer.addChild(pixiNote);
        }

        noteContainer.x = oldContainer ? oldContainer.x : transportTimeToX(opt.time);
        rollContainer.addChild(noteContainer);
    }

    function moveVerticalGridLines(horizontalMovement) {
        let verticalGridlines = gridlineContainers.vertical.children;

        for (let line of verticalGridlines) {
            line.x -= horizontalMovement;
        }

        if (verticalGridlines[0].x + gridLineWidth < opt.pianoKeyWidth) {
            let line = gridlineContainers.vertical.removeChildAt(0);

            line.x = verticalGridlines[verticalGridlines.length - 1].x + gridLineSpacing;

            gridlineContainers.vertical.addChild(line);
        }
    }

    function getFirstVerticalGridLineX(transportX) {
        let x = transportX;

        while (x + gridLineSpacing < opt.pianoKeyWidth) {
            x += gridLineSpacing;
        }

        return x;
    }

    function drawGridlines(type) {
        let i;

        if (!type || type === 'horizontal') {
            gridlineContainers.main.removeChild(gridlineContainers.horizontal);
            gridlineContainers.horizontal = new pixi.Container();

            for (i = 0; i < noteRangeDiff + 1; i++) {
                gridlineContainers.horizontal.addChild(
                    new pixi.Graphics()
                        .beginFill(opt.gridLineColor)
                        .drawRect(0, (i * noteHeight) - halfGridLineWidth, opt.width, gridLineWidth)
                        .endFill()
                );

                var noteChroma = teoria.note.fromKey(i + 3).chroma();

                if (new Set([0, 2, 4, 5, 7, 9, 11]).has(noteChroma)) {
                    gridlineContainers.horizontal.addChild(
                    new pixi.Graphics()
                        .beginFill(opt.whiteGridBgColor)
                        .drawRect(
                        0,
                        i * noteHeight + halfGridLineWidth,
                        opt.width,
                        noteHeight - gridLineWidth
                        )
                        .endFill()
                    );
                }
            }

            gridlineContainers.main.addChild(gridlineContainers.horizontal);
        }

        if (!type || type === 'vertical') {
            let offset = getFirstVerticalGridLineX(noteContainer ? noteContainer.x : transportTimeToX(opt.time));

            gridlineContainers.main.removeChild(gridlineContainers.vertical);
            gridlineContainers.vertical = new pixi.Container();

            for (i = 0; i < (opt.zoom * opt.resolution) + 1; i++) {
                let line = new pixi.Graphics()
                    .beginFill(opt.gridLineColor)
                    .drawRect(0, 0, gridLineWidth, opt.height)
                    .endFill();

                line.x = offset + (i * gridLineSpacing) - halfGridLineWidth;

                gridlineContainers.vertical.addChild(line);
            }

            gridlineContainers.main.addChild(gridlineContainers.vertical);
        }

        rollContainer.addChild(gridlineContainers.main);
    }

    function activateKeys() {
        if (!opt.activateKeys) {
            return;
        }

        let intersectedKeys = new Set;

        for (let note of noteContainer.children) {
            if (note.containsPoint(new pixi.Point(opt.pianoKeyWidth, note.y))) {
                intersectedKeys.add(note.keyNumber);
            }
        }

        for (let intersectedKey of intersectedKeys) {
            if (!activeKeys.has(intersectedKey)) {
                let key = keys[intersectedKey];

                drawPianoKey(key, true);
                activeKeys.add(intersectedKey);
            }
        }

        for (let activeKey of activeKeys) {
            if (!intersectedKeys.has(activeKey)) {
                let key = keys[activeKey];

                drawPianoKey(key);
                activeKeys.delete(activeKey);
            }
        }
    }

    function animate(frameTime) {
        if (!lastTime) {
            lastTime = frameTime;
        }

        let timeDiff = frameTime - lastTime,
            horizontalMovement = timeDiff * pxMovementPerMs;

        noteContainer.x = noteContainer.x - horizontalMovement;
        moveVerticalGridLines(horizontalMovement);
        activateKeys();
        lastTime = frameTime;
        renderer.render(stage);
        playing ? requestAnimationFrame(animate) : lastTime = null;
    }

    function calculate() {
        noteRange = getNoteRange(opt.noteData);
        noteRangeDiff = noteRange.max - noteRange.min;
        barWidth = (opt.width - opt.pianoKeyWidth) / opt.zoom;
        beatWidth = ((opt.width - opt.pianoKeyWidth) / (opt.zoom * 4));
        sixteenthWidth = beatWidth / 4;
        gridLineWidth = barWidth / 100;
        halfGridLineWidth = gridLineWidth / 2;
        gridLineSpacing = barWidth / opt.resolution;
        beatsPerMs = (opt.bpm / 60) / 1000;
        pxMovementPerMs = beatWidth * beatsPerMs;
        noteHeight = opt.height / noteRangeDiff;
        innerNoteHeight = noteHeight - gridLineWidth;
    }

    (function init() {
        stage.addChild(rollContainer);
        calculate();
        drawGridlines();
        drawNotes();
        drawPianoKeys();
        renderer.backgroundColor = opt.blackGridBgColor;
        renderer.render(stage);
    })();

    /**
     * The piano roll API
     * @typedef pianoRollAPI
     * @type {Object}
     * @global
     */
    let pianoRollAPI = {
        /**
         * Contains methods that control playback
         * @memberof pianoRollAPI
         * @type {Object}
         */
        playback: {
            /**
             * Pause if playing or play if paused
             * @param {transportTime} [time] - If paused, the position to begin playing. If omitted, playback will begin at the current position.
             */
            toggle(time) {
                playing ? pianoRollAPI.playback.pause() : pianoRollAPI.playback.play(time);
            },
            /**
             * Begin playback
             * @param {transportTime} [time] - The position to begin playing. If omitted, playback will begin at the current position.
             */
            play(time) {
                if (!playing) {
                    if (time) {
                        pianoRollAPI.playback.seek(time);
                    }

                    playing = true;
                    requestAnimationFrame(animate);
                }
            },
            /**
             * Pause playback
             */
            pause() {
                playing = false;
            },
            /**
             * Change the playback position
             * @param {transportTime} time - The new playback position
             */
            seek(time) {
                opt.time = time;

                noteContainer.x = transportTimeToX(time);
                drawGridlines('vertical');
                rollContainer.addChild(rollContainer.removeChild(noteContainer));
                renderer.render(stage);
            }
        },
        /**
         * Change the bpm by changing this property
         * @memberof pianoRollAPI
         * @type {number}
         */
        set bpm(bpm) {
            opt.bpm = bpm;
            calculate();
        },
        /**
         * Change the zoom by changing this property
         * @memberof pianoRollAPI
         * @type {number}
         */
        set zoom(zoom) {
            opt.zoom = zoom;
            calculate();
            drawGridlines();
            drawNotes();
            renderer.render(stage);
        },
        /**
         * Change the resolution by changing this property
         * @memberof pianoRollAPI
         * @type {number}
         */
        set resolution(resolution) {
            opt.resolution = resolution;
            calculate();
            drawGridlines('vertical');
            rollContainer.addChild(rollContainer.removeChild(noteContainer));
            renderer.render(stage);
        },
        /**
         * Change the note data by changing this property
         * @memberof pianoRollAPI
         * @type {noteData}
         */
        set noteData(noteData) {
            opt.noteData = noteData;
            calculate();
            drawGridlines('horizontal');
            drawNotes();
            drawPianoKeys();
            renderer.render(stage);
        },
        /**
         * Whether or not playback is ongoing
         * @memberof pianoRollAPI
         * @type {boolean}
         * @readonly
         */
        get playing() {
            return playing;
        },
        /**
         * The piano roll canvas element
         * @memberof pianoRollAPI
         * @type {HTMLElement}
         * @readonly
         */
        get view() {
            return renderer.view;
        }
    };

    return pianoRollAPI;
}

export default pixiPianoRoll;