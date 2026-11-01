class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search(fields = ['name']) {
        if (this.queryString.search) {
            const searchRegex = { $regex: this.queryString.search, $options: 'i' };
            const orConditions = fields.map(field => ({ [field]: searchRegex }));
            this.query = this.query.find({ $or: orConditions });
        }
        return this;
    }

    filter(allowedFields = ['department', 'semester', 'role', 'status']) {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        const safeFilter = {};
        for (const key of Object.keys(queryObj)) {
            if (allowedFields.includes(key) && queryObj[key] !== undefined && queryObj[key] !== '') {
                safeFilter[key] = queryObj[key];
            }
        }
        this.query = this.query.find(safeFilter);
        return this;
    }

    sort(defaultSort = '-createdAt') {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort(defaultSort);
        }
        return this;
    }

    paginate(defaultLimit = 10) {
        const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(this.queryString.limit, 10) || defaultLimit));
        const skip = (page - 1) * limit;

        this.page = page;
        this.limit = limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;
