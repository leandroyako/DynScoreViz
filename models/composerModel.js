const fs = require('fs').promises;

class editorModel {
    //constructor() {}
    /*
    No necesito constructor si estoy usando editorModel para crear una única instancia que maneje todas las partes
    
    Posibilidad:
    Quizá debería reescribirlo de tal manera de crear un editor por parte?
    
    class PartManager -> maneja la db de partes e instancia los Editors para cada una
   
    class editorModel {
        
        constructor(instrument) {
        this.instrument = instrument;
        this.route = instrument.replace(/ /g, '').toLowerCase();
        const stored = serverLocalStorage.getItem(this.route);
        this.staves = JSON.parse(stored) || []
    }
    ...

    */

    _pickInstrument(instrument) {
        this.instrument = instrument;
        this.route = instrument.replace(/ /g, '').toLowerCase();


        //const stored = serverLocalStorage.getItem(this.route);
        //this.staves = JSON.parse(stored) || []
        this.route_gap = `${this.route}_gap`;
        this.stored = serverLocalStorage.getItem(this.route);
        this.gap = serverLocalStorage.getItem(this.route_gap);
        this.staves = (JSON.parse(this.gap) || JSON.parse(this.stored)) || [];
        //this.staves = (JSON.parse(stored).concat(JSON.parse(gap) || [])) || []

        console.log("_pickInstrument: ", this.staves)
        console.log("this.gap: ", this.gap)
    }

    _createInstrument(instrument) {

        console.log("createInstrument: ", serverLocalStorage.getItem(instrument))

        if (!serverLocalStorage.getItem(instrument)) {
            serverLocalStorage.setItem(instrument, JSON.stringify([]))
        } else {
            console.error(`${instrument} db already exists`)
        }
    }

    _pickParts() {
        serverLocalStorage.getItem('parts') ||
            serverLocalStorage.setItem('parts', JSON.stringify([]));

        this.parts = JSON.parse(serverLocalStorage.getItem('parts'))
    }

    _commit(changes) {
        serverLocalStorage.setItem(this.route, JSON.stringify(changes))
    }

    _createDir(dir) {

        const svgPath = `./public/svg/${dir}`;

        fs.mkdir(svgPath, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });
    }

    _deleteDir(dir) {

        const svgPath = `./public/svg/${dir}`;

        fs.rmdir(svgPath, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });

        console.log(`${dir} dir is deleted!`);
    }

    _deleteFile(route) {
        /* _deleteFile unused, proper method to remove db is .removeItem() */
        const dbPath = `./localStorage/${route}`;

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

    _getQueuePos() {
        let lastPos;

        try {
            lastPos = this.staves[this.staves.length - 1].queue
        } catch (error) {
            console.log(error)
            // lastPos = undefined
            return 2
        }

        //console.log("_getQueuePos lastPos:", lastPos)

        if (lastPos < 1) {
            //console.log("lastPos < 1 true")
            if (!this.gap) {
                console.log("!this.gap true")
                return lastPos + 1

            } else {
                //   console.log("!this.gap false")
                serverLocalStorage.setItem(`${this.route_gap}`, JSON.stringify([]));
                console.log(this.route_gap)
                return 2
            }
        } else {
            //console.log("lastPos < 1 false")
            return lastPos + 1
        }
    }

    addPart(newPart) {
        this.route = 'parts'; //??
        this._pickParts(); //parse parts JSON

        console.log("includes part?: ", JSON.stringify(this.parts).includes(newPart.instrument))

        if (!JSON.stringify(this.parts).includes(newPart.instrument)) {

            this._createInstrument(newPart.route);
            this._createDir(newPart.route);
            const currentId = this.parts.length > 0 ? this.parts[this.parts.length - 1].id + 1 : 0

            const part = {
                id: currentId,
                route: newPart.route,
                instrument: newPart.instrument,
            }

            this.parts.push(part);
            this._commit(this.parts);
            console.log(`New part added: ${newPart.instrument}`);
        } else {
            console.error(`${newPart.instrument} part already exists`);
        }
    }

    deletePart(route) {
        //this.route = 'parts'
        this._pickParts()
        this._deleteDir(route)
        serverLocalStorage.removeItem(route)
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
            //complete: false,
            //state: undefined
            queue: this._getQueuePos()
        }
        this.staves.push(staff);
        this._commit(this.staves);
    }

    // Map through all staves, and replace the content of the staff with the specified id
    editStaff(id, updatedStaff) {
        this._pickInstrument(updatedStaff.instrument);

        //just push and pop whole object by id

        /*
        this.staves = this.staves.map(staff =>
            staff.id === id ? {
                id: staff.id,
                instrument: updatedStaff.instrument,
                route: updatedStaff.route,
                svg: updatedStaff.svg,
                complete: staff.complete,
                state: staff.state
            } :
            staff
        )
        */
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
    //maybe there is no use case for 'toggle', just mark as complete... rethink
    toggleStaff(instrument, id) {
        this._pickInstrument(instrument);
        const staff = this.staves.find(x => x.id == id);
        if (staff) {
            //staff.complete = !staff.complete;
            staff.complete = true;
            //maybe there is no use case for 'toggle', just mark as complete... rethink
        }
        this._commit(this.staves);
    }

    /*
    staffState(instrument, id, state) {
        this._pickInstrument(instrument);

        const staff = this.staves.find(x => x.id == id);
        if (staff) {
            staff.state = state;
        }

        this._commit(this.staves);
    }
    */

    scroll(instrument) {
        this._pickInstrument(instrument);
        let lastPos;
        let scrolledStaves;

        try {
            lastPos = this.staves[this.staves.length - 1].queue
            console.log(lastPos)
        } catch (error) {
            console.log(error)
            lastPos = undefined
            scrolledStaves = []
        }

        console.log(lastPos)

        if (this.gap) {
            scrolledStaves = this.gap.map(
                (staff) => {
                    staff.queue -= 1
                    return staff
                }
            );

            if (scrolledStaves[0].queue == lastPos) {
                this.staves = JSON.parse(stored).concat(JSON.parse(gap));
                serverLocalStorage.removeItem(this.route_gap)
            }

        } else {

            if (lastPos > -1) {
                scrolledStaves = this.staves.map(
                    (staff) => {
                        staff.queue -= 1
                        return staff
                    }
                );
            }
        }
        console.log("scrolledStaves: ", scrolledStaves);
        this._commit(scrolledStaves);
    }
    /*
        bindStaffListChanged(callback) {
            this.onStaffListChanged = callback;
        }
        */
}

module.exports = editorModel;