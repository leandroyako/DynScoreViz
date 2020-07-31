class editorModel {
    constructor() {
        //     let instrument; 
        //     let staves; 
        //     let route;
    }

    _pickInstrument(instrument) {
        this.instrument = instrument;
        this.route = instrument.replace(/ /g, '').toLowerCase();
        const stored = localStorage.getItem(this.route);
        this.staves = JSON.parse(stored) || []
    }

    _pickPart(instrument) {
        this.instrument = instrument;
        this.route = 'parts';
        const stored = localStorage.getItem('parts');
        this.parts = JSON.parse(stored) || []
    }

    _commit(changes) {
        //this.onStaffListChanged(staves)
        localStorage.setItem(this.route, JSON.stringify(changes))
    }

    addPart(newPart) {
        this._pickPart(newPart.instrument);

        const part = {
            id: this.parts.length > 0
                ? this.parts[this.parts.length - 1].id + 1
                : 0,
            route: newPart.route,
            instrument: newPart.instrument,
        }

        if (!this.parts.includes(newPart.instrument)) {

            this.parts.push(part);
            this._commit(this.parts);
            console.log("New part added");
        }
        else {
            console.log("Part already exists");
        }
    }

    addStaff(newStaff) {
        this._pickInstrument(newStaff.instrument);

        const staff = {
            id: this.staves.length > 0
                ? this.staves[this.staves.length - 1].id + 1
                : 0,
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
            staff.id === id
                ? { id: staff.id, instrument: updatedStaff.instrument, route: updatedStaff.route, svg: updatedStaff.svg, complete: staff.complete }
                : staff,
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

    // Flip the complete boolean on the specified staff
    toggleStaff(instrument, id) {
        this._pickInstrument(instrument);
        this.staves = this.staves.map(staff =>
            staff.id === id
                ? { id: staff.id, instrument: staff.instrument, route: staff.route, svg: staff.svg, complete: !staff.complete }
                : staff,
        );

        this._commit(this.staves);
    }

    bindStaffListChanged(callback) {
        this.onStaffListChanged = callback;
    }


}

module.exports = editorModel;