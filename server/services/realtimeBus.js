const EventEmitter = require('events');

/**
 * Enterprise In-Memory Real-Time Dispatcher
 * Dispatches live socket/SSE campus broadcast events
 */
class RealtimeCampusBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }

    emitNotification(eventData) {
        this.emit('CAMPUS_NOTIFICATION', eventData);
    }

    emitAttendanceLogged(eventData) {
        this.emit('ATTENDANCE_LOGGED', eventData);
    }

    emitResultPublished(eventData) {
        this.emit('RESULT_PUBLISHED', eventData);
    }
}

const campusBus = new RealtimeCampusBus();

module.exports = campusBus;
