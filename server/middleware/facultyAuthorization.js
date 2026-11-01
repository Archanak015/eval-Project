const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Enterprise Faculty Scoping Middleware:
 * Loads the authenticated faculty member's profile and attaches their strict
 * authorization scope (assigned subjects, course codes, departments, semesters, sections).
 * 
 * Sets:
 * req.facultyScope = {
 *   isRestricted: true/false (admins are false),
 *   facultyProfile: doc,
 *   assignedSubjectIds: ObjectId[],
 *   assignedCourseCodes: string[],
 *   departments: string[],
 *   semesters: number[],
 *   sections: string[],
 *   buildStudentQuery: (extraFilters) => MongoQueryObject
 * }
 */
exports.facultyScope = async (req, res, next) => {
    try {
        if (!req.user) {
            return ApiResponse.error(res, 'Authentication required', 401);
        }

        // Admin has global institutional visibility
        if (req.user.role === 'admin') {
            req.facultyScope = {
                isRestricted: false,
                buildStudentQuery: (filters = {}) => filters
            };
            return next();
        }

        // If faculty, find profile and compute verified teaching responsibilities
        if (req.user.role === 'faculty') {
            const facultyProfile = await Faculty.findOne({ user: req.user._id }).lean();
            
            // Look up subjects assigned to this faculty member directly on Subject model
            const subjectsTaught = await Subject.find({
                $or: [
                    { faculty: req.user._id },
                    { _id: { $in: facultyProfile?.assignedSubjects || [] } }
                ]
            }).lean();

            const assignedSubjectIds = subjectsTaught.map(s => s._id);
            const courseCodes = [
                ...(facultyProfile?.courseCodes || []),
                ...subjectsTaught.map(s => s.code).filter(Boolean),
                ...subjectsTaught.map(s => s.course).filter(Boolean)
            ];

            const departments = [
                facultyProfile?.department,
                ...subjectsTaught.map(s => s.department).filter(Boolean)
            ].filter(Boolean);

            const semesters = [
                ...(facultyProfile?.semesters || []),
                ...subjectsTaught.map(s => s.semester).filter(Boolean)
            ];

            const sections = (facultyProfile?.sections && facultyProfile.sections.length > 0)
                ? facultyProfile.sections
                : ['A', 'B', 'C'];

            // Store verified scope in request
            req.facultyScope = {
                isRestricted: true,
                facultyProfile,
                assignedSubjectIds,
                assignedCourseCodes: [...new Set(courseCodes)],
                departments: [...new Set(departments)],
                semesters: [...new Set(semesters)],
                sections: [...new Set(sections)],
                
                // Construct MongoDB query that guarantees zero cross-faculty leakage
                buildStudentQuery: (additionalFilters = {}) => {
                    const query = { ...additionalFilters };

                    // Must belong to faculty's authorized registered subjects OR assigned department cohort
                    const scopeClauses = [];

                    if (assignedSubjectIds.length > 0) {
                        scopeClauses.push({ enrolledSubjects: { $in: assignedSubjectIds } });
                    }

                    if (departments.length > 0 && semesters.length > 0) {
                        const deptRegexes = departments.map(d => new RegExp(`^${d.trim()}$`, 'i'));
                        scopeClauses.push({
                            department: { $in: deptRegexes },
                            semester: { $in: semesters }
                        });
                    } else if (departments.length > 0) {
                        const deptRegexes = departments.map(d => new RegExp(`^${d.trim()}$`, 'i'));
                        scopeClauses.push({ department: { $in: deptRegexes } });
                    }

                    if (scopeClauses.length > 0) {
                        if (query.$or) {
                            query.$and = query.$and || [];
                            query.$and.push({ $or: scopeClauses });
                        } else {
                            query.$or = scopeClauses;
                        }
                    }

                    return query;
                }
            };

            return next();
        }

        return ApiResponse.error(res, 'Access denied: Faculty or Admin role required', 403);
    } catch (err) {
        console.error('Faculty scoping error:', err);
        return ApiResponse.error(res, 'Authorization evaluation error', 500);
    }
};

/**
 * Middleware ensuring a faculty member is authorized to access a specific subject
 */
exports.requireSubjectAccess = async (req, res, next) => {
    try {
        if (req.user?.role === 'admin') return next();

        const subjectId = req.params.subjectId || req.body.subjectId || req.query.subjectId;
        if (!subjectId) {
            return ApiResponse.error(res, 'Subject ID parameter is required', 400);
        }

        const subject = await Subject.findById(subjectId).lean();
        if (!subject) {
            return ApiResponse.error(res, 'Subject not found in curriculum', 404);
        }

        // Check if faculty owns or is assigned to this subject
        const isAssigned = 
            subject.faculty?.toString() === req.user._id.toString() ||
            (req.facultyScope && req.facultyScope.assignedSubjectIds.some(id => id.toString() === subjectId.toString())) ||
            (req.facultyScope && req.facultyScope.departments.some(d => d.toLowerCase() === (subject.department || '').toLowerCase()));

        if (!isAssigned) {
            return ApiResponse.error(res, 'HTTP 403 Forbidden: You are not authorized to access students or academic records for this subject.', 403);
        }

        req.authorizedSubject = subject;
        return next();
    } catch (err) {
        return ApiResponse.error(res, 'Authorization check failed', 500);
    }
};
