const { z } = require('zod');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Universal Zod Request Validator Middleware
 * Validates req.body, req.query, or req.params against a Zod schema
 */
exports.validate = (schema) => (req, res, next) => {
    try {
        const validated = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        
        // Replace with parsed and typed data
        if (validated.body) req.body = validated.body;
        if (validated.query) req.query = validated.query;
        if (validated.params) req.params = validated.params;
        
        return next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.').replace(/^(body|query|params)\./, ''),
                message: err.message
            }));
            return ApiResponse.error(res, 'Validation failed: Invalid input payload', 422, formattedErrors);
        }
        return ApiResponse.error(res, 'Input validation error', 400);
    }
};

// Common reusable Zod validation schemas
exports.schemas = {
    // User login schema
    login: z.object({
        body: z.object({
            email: z.string().email('Invalid email address format'),
            password: z.string().min(6, 'Password must be at least 6 characters long')
        })
    }),

    // User registration schema
    register: z.object({
        body: z.object({
            name: z.string().min(2, 'Name must be at least 2 characters'),
            email: z.string().email('Invalid email format'),
            password: z.string().min(6, 'Password must be at least 6 characters'),
            role: z.enum(['student', 'faculty', 'admin', 'superadmin']).optional()
        })
    }),

    // Marks upload schema
    recordMarks: z.object({
        body: z.object({
            studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format'),
            subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID format'),
            marksObtained: z.number().min(0, 'Marks obtained cannot be negative'),
            totalMarks: z.number().min(1, 'Total marks must be greater than 0').optional(),
            examType: z.enum(['ESA', 'ISA 1', 'ISA 2', 'Summer ESA', 'Assignment', 'Quiz', 'Lab Assessment']).optional()
        })
    })
};
