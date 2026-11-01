const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const FacultyAssignment = require('../models/FacultyAssignment');
const StudentRegistration = require('../models/StudentRegistration');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Result = require('../models/Result');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');

/**
 * Universal Query & Pagination Service:
 * Handles filtering, regex searching, field sorting, and pagination metadata
 */
exports.queryWithPagination = async (model, queryParams, searchableFields = [], populateFields = [], baseQuery = {}) => {
    const {
        page = 1,
        limit = 15,
        search,
        sort = '-createdAt',
        status,
        isActive,
        ...otherFilters
    } = queryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { ...baseQuery };

    // Status & Active filters
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;

    // Search across specified string fields
    if (search && search.trim().length > 0 && searchableFields.length > 0) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = searchableFields.map(field => ({ [field]: regex }));
    }

    // Direct match filters
    Object.keys(otherFilters).forEach(key => {
        if (otherFilters[key] !== undefined && otherFilters[key] !== '') {
            // Check for numeric fields
            if (!isNaN(otherFilters[key]) && typeof otherFilters[key] !== 'boolean') {
                filter[key] = Number(otherFilters[key]);
            } else {
                filter[key] = otherFilters[key];
            }
        }
    });

    let queryObj = model.find(filter).sort(sort).skip(skip).limit(limitNum);

    // Apply multiple populate definitions
    populateFields.forEach(pop => {
        queryObj = queryObj.populate(pop);
    });

    const [data, total] = await Promise.all([
        queryObj.lean(),
        model.countDocuments(filter)
    ]);

    return {
        data,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum) || 1
        }
    };
};
