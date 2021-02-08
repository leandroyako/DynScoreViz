// Ableton Link
module.exports = function(io) {

    const abletonlink = require('abletonlink');
    const link = new abletonlink();

    const emitBeats = () => {
        let lastBeat = 0.0;
        link.startUpdate(60, (beat, phase, bpm) => {
            beat = 0 ^ beat;
            if (0 < beat - lastBeat) {
                io.emit('beat', {
                    beat
                });
                lastBeat = beat;
            }
        });
    };

    emitBeats();

    return link;
};