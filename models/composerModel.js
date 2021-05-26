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
        this.route_stavesA = `${this.route}_a`;
        this.route_stavesB = `${this.route}_b`;
        this.route_stavesConsolidated = `${this.route}_consolidated`;
        this.stavesA = JSON.parse(serverLocalStorage.getItem(this.route_stavesA));
        this.stavesB = JSON.parse(serverLocalStorage.getItem(this.route_stavesB));
        this.stavesConsolidated = JSON.parse(serverLocalStorage.getItem(this.route_stavesConsolidated));
    }

    _createInstrument(route) {

        console.log("createInstrument: ", route);
        const route_stavesA = `${route}_a`;
        const route_stavesB = `${route}_b`;
        const route_stavesConsolidated = `${route}_consolidated`;

        if (!serverLocalStorage.getItem(route_stavesConsolidated)) {
            serverLocalStorage.setItem(route_stavesA, JSON.stringify([]))
            serverLocalStorage.setItem(route_stavesB, JSON.stringify([]))
            serverLocalStorage.setItem(route_stavesConsolidated, JSON.stringify([]))
            this.gap = false
        } else {
            console.error(`${route} db already exists`)
        }
    }

    _removeById = (arr, id) => {
        const requiredIndex = arr.findIndex(el => {
            return el.id === String(id);
        });
        if (requiredIndex === -1) {
            return false;
        };
        return !!arr.splice(requiredIndex, 1);
    }

    _pickParts() {
        serverLocalStorage.getItem('parts') ||
            serverLocalStorage.setItem('parts', JSON.stringify([]));

        this.parts = JSON.parse(serverLocalStorage.getItem('parts'))
    }

    _commit(route, changes) {
        serverLocalStorage.setItem(route, JSON.stringify(changes))
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

    _getQueuePos() {
        let lastPos;

        try {
            this.gap ? lastPos = this.stavesB[this.stavesB.length - 1].queue : lastPos = this.stavesConsolidated[this.stavesConsolidated.length - 1].queue
        } catch (error) {
            //console.log(error)
            return 2
        }

        if (lastPos < 1) {
            if (this.stavesB < 1) {
                this.gap = true
                return 2
            } else {
                return lastPos + 1
            }
        } else {
            return lastPos + 1
        }
    }

    addPart(newPart) {
        this._pickParts(); //parse parts JSON
        if (!JSON.stringify(this.parts).includes(newPart.route)) {
            this._createInstrument(newPart.route);
            this._createDir(newPart.route);
            const currentId = this.parts.length > 0 ? this.parts[this.parts.length - 1].id + 1 : 0
            const part = {
                id: currentId,
                route: newPart.route,
                name: newPart.name,
            }
            this.parts.push(part);
            this._commit('parts', this.parts);
            console.log(`New part added: ${newPart.name}`);
        } else {
            console.warn(`${newPart.name} part already exists`);
        }
    }

    deletePart(route) {
        this._pickParts()
        this.parts = this.parts.filter((part) => part.route == this.route)
        this._commit('parts', this.parts)

        this._pickInstrument(route)
        this._deleteDir(route)
        serverLocalStorage.removeItem(this.route_stavesConsolidated)
        serverLocalStorage.removeItem(this.route_stavesA)
        serverLocalStorage.removeItem(this.route_stavesB)
    }

    addStaff(newStaff) {
        this._pickInstrument(newStaff.route);
        const currentId = this.stavesConsolidated.length > 0 ? this.stavesConsolidated[this.stavesConsolidated.length - 1].id + 1 : 0

        const staff = {
            id: currentId,
            svg: newStaff.svg,
            route: newStaff.route,
            queue: this._getQueuePos()
        }

        //        console.log(staff)

        if (this.gap) {
            this.stavesB.push(staff)
            this._commit(this.route_stavesB, this.stavesB)
        } else {
            this.stavesA.push(staff)
            this._commit(this.route_stavesA, this.stavesA)
        }
        this.stavesConsolidated = this.stavesA.concat(this.stavesB)
        this._commit(this.route_stavesConsolidated, this.stavesConsolidated)

        //        console.log(this.route_stavesConsolidated)
    }

    // Map through all staves, and replace the content of the staff with the specified id
    editStaff(updatedStaff) {
        this._pickInstrument(updatedStaff.route);
        this._removeById(this.stavesConsolidated, updatedStaff.id)
        //what about this.stavesA and this.stavesB? 
        this._commit(this.stavesConsolidated);
    }

    // Filter a staff out of the array by id
    deleteStaff(route, id) {
        this._pickInstrument(route);
        const staves = this.stavesConsolidated.filter(staff => staff.id !== id);
        this._commit(this.route_stavesConsolidated, staves);
        this.onStaffListChanged(staves);
    }

    scroll(route) {
        this._pickInstrument(route);
        let lastPos;

        try {
            this.gap ? lastPos = this.stavesB[this.stavesB.length - 1].queue : lastPos = this.stavesConsolidated[this.stavesConsolidated.length - 1].queue
        } catch (error) {
            console.log(error)
        }

        if (this.gap) {
            this.stavesB = this.stavesB.map(
                (staff) => {
                    staff.queue -= 1
                    return staff
                }
            )

            this.stavesConsolidated = this.stavesA.concat(this.stavesB)

            if (this.stavesB[0].queue == (this.stavesA[this.stavesA.length - 1].queue + 1)) {
                this.stavesA = this.stavesA.concat(this.stavesB)
                this.stavesB = []
                this.gap = false
            }
        } else if (lastPos >= -1) {
            this.stavesA = this.stavesA.map(
                (staff) => {
                    staff.queue -= 1
                    return staff
                }
            )
            this.stavesConsolidated = this.stavesA.concat(this.stavesB)
        } else {
            this.stavesConsolidated = this.stavesA.slice(0) //fastest way to copy array according some guy at stackoverflow 
        }

        this._commit(this.route_stavesA, this.stavesA)
        this._commit(this.route_stavesB, this.stavesB)
        this._commit(this.route_stavesConsolidated, this.stavesConsolidated)
    }

    /*
    bindStaffListChanged(callback) {
            this.onStaffListChanged = callback;
    }
    */
}

module.exports = editorModel;