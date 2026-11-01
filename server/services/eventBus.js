const EventEmitter = require('events');
const logger = require('../utils/logger');

class ERPEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        this.registerDefaultHandlers();
    }

    registerDefaultHandlers() {
        // Phase 37 Event Listeners
        this.on('STUDENT_REGISTERED', (data) => {
            logger.info(`[EVENT] Student registered: ${data.usn || data.name} in course ${data.courseId}`);
        });

        this.on('FACULTY_ASSIGNED', (data) => {
            logger.info(`[EVENT] Faculty ${data.facultyId} assigned to subject ${data.subjectId}`);
        });

        this.on('ATTENDANCE_MARKED', (data) => {
            logger.info(`[EVENT] Attendance marked for subject ${data.subjectId} on ${data.date} (${data.recordsCount} students)`);
        });

        this.on('RESULT_PUBLISHED', (data) => {
            logger.info(`[EVENT] Exam result published for exam ${data.examId} - semester ${data.semester}`);
        });

        this.on('NOTICE_POSTED', (data) => {
            logger.info(`[EVENT] Campus notice broadcasted: "${data.title}" by ${data.author}`);
        });

        this.on('FEEDBACK_SUBMITTED', (data) => {
            logger.info(`[EVENT] Faculty feedback submitted for subject ${data.subjectId} (Score: ${data.rating})`);
        });

        this.on('WORKFLOW_TRIGGERED', (data) => {
            logger.info(`[EVENT] Workflow approval required: ${data.workflowType} by user ${data.applicantId}`);
        });
    }

    publish(eventName, payload) {
        logger.info(`[EVENT_BUS] Publishing event ${eventName}`, { payload });
        this.emit(eventName, payload);
    }
}

const eventBus = new ERPEventBus();
module.exports = eventBus;
