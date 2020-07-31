class InterpreterModel {
    constructor(instrument) {
      // The state of the model, an array of staff objects 
      this.instrument = instrument;
      const stored = localStorage.getItem('instrument');
      this.staves = JSON.parse(stored) || []
    }
  
    bindStaffListChanged(callback) {
        this.onStaffListChanged = callback
      }
    
  }

module.exports = InterpreterModel;