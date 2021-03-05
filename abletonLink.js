// Ableton Link
module.exports = function(io) {

    const abletonlink = require('abletonlink');
    const link = new abletonlink();

    const updateLink = () => {
        let lastBeat = 0.0;
        let lastBpm = 0;

        link.startUpdate(60, (beat, phase, bpm) => {
            //Beats
            beat = 0 ^ beat;
            if (0 < beat - lastBeat) {
                io.emit('beat', {
                    beat
                });
                lastBeat = beat;
            }
            //BPM
            bpm = Math.round((bpm + Number.EPSILON) * 100) / 100;
            if (bpm != lastBpm) {
                io.emit('bpm', {
                    bpm
                });
                lastBpm = bpm;
                //console.log(bpm);
            }
        });
    };

    updateLink();
    return link;
};