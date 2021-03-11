const fs = require('fs').promises;

class editorModel {
    constructor() {}

    _pickInstrument(instrument) {
        this.instrument = instrument;
        this.route = instrument.replace(/ /g, '').toLowerCase();
        const stored = serverLocalStorage.getItem(this.route);
        //console.log(stored);
        this.staves = JSON.parse(stored) || []
    }

    _createInstrument(instrument) {
        serverLocalStorage.getItem(instrument) ||
            serverLocalStorage.setItem(instrument, JSON.stringify([]))
    }

    _pickParts() {
        serverLocalStorage.getItem('parts') ||
            serverLocalStorage.setItem('parts', JSON.stringify([]));

        this.parts = JSON.parse(serverLocalStorage.getItem('parts'))
    }

    _commit(changes) {
        //console.log(this.route);
        //console.log(changes);
        serverLocalStorage.setItem(this.route, JSON.stringify(changes))
    }

    _createDir(dir) { // create new directory

        const svgPath = `./public/svg/${dir}`;

        fs.mkdir(svgPath, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });
    }

    _deleteDir(dir) { // create new directory

        const svgPath = `./public/svg/${dir}`;

        fs.rmdir(svgPath, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });

        console.log(`${dir} is deleted!`);
    }

    _deleteFile(route) { // create new directory

        const dbPath = `./localStorage/${route}`;
        /*
                fs.unlink(dbPath)
                    .then(() => {
                        console.log(`${route} file is deleted!`)
                    }).catch(err => {
                        console.error(`Something wrong happened removing ${route} file`, err)
                    })
        */
        ;
        (async () => {
            try {
                await fs.unlink(dbPath)
                console.log(`${route} file is deleted!`)
            } catch (err) {
                console.error(`Something wrong happened removing ${route} file`, err)
            }
        })()
    }

    addPart(newPart) {
        this.route = 'parts';
        this._pickParts(); //parse parts
        this._createDir(newPart.route);
        this._createInstrument(newPart.route);
        //console.log("Adding new part to:")
        //console.log(this.parts);
        const currentId = this.parts.length > 0 ? this.parts[this.parts.length - 1].id + 1 : 0
        const part = {
            id: currentId,
            route: newPart.route,
            instrument: newPart.instrument,
        }

        if (!JSON.stringify(this.parts).includes(newPart.instrument)) {
            this.parts.push(part);
            this._commit(this.parts);
            console.log(`New part added: ${newPart.instrument}`);
        } else {
            console.log(`${newPart.instrument} part already exists`);
        }
    }

    deletePart(route) {
        this.route = 'parts'
        this._pickParts()
        this._deleteDir(route)
        this._deleteFile(route)
    }

    addStaff(newStaff) {
        this._pickInstrument(newStaff.instrument);
        const currentId = this.staves.length > 0 ? this.staves[this.staves.length - 1].id + 1 : 0
        //console.log(currentId)
        const staff = {
            id: currentId,
            svg: newStaff.svg,
            route: newStaff.route,
            instrument: newStaff.instrument,
            complete: false,
        }
        this.staves.push(staff);
        this._commit(this.staves);
    }
    // Map through all staves, and replace the content of the staff with the specified id
    editStaff(id, updatedStaff) {
        this._pickInstrument(updatedStaff.instrument);

        this.staves = this.staves.map(staff =>
            staff.id === id ? {
                id: staff.id,
                instrument: updatedStaff.instrument,
                route: updatedStaff.route,
                svg: updatedStaff.svg,
                complete: staff.complete
            } :
            staff,
        )
        this._commit(this.staves);
    }

    // Filter a staff out of the array by id
    deleteStaff(instrument, id) {
        this._pickInstrument(instrument);
        this.staves = this.staves.filter(staff => staff.id !== id);
        this._commit(this.staves);
        this.onStaffListChanged(this.staves);
    }

    // Flip the 'complete' boolean on the specified staff
    toggleStaff(instrument, id) {
        this._pickInstrument(instrument);
        this.staves = this.staves.map(staff =>
            staff.id === id ? {
                id: staff.id,
                instrument: staff.instrument,
                route: staff.route,
                svg: staff.svg,
                complete: !staff.complete
            } :
            staff,
        );
        this._commit(this.staves);
    }

    bindStaffListChanged(callback) {
        this.onStaffListChanged = callback;
    }
}

module.exports = editorModel;