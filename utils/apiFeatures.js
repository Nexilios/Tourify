class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const { page, sort, limit, fields, ...queryObj } = this.queryString;

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // In-case user query with , instead of +
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // In-case user query with , instead of +
      const fieldsLimit = this.queryString.fields.split(',').join(' ');
      this.query.select(fieldsLimit);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const pageValue = parseInt(this.queryString.page, 10) || 1;
    const limitValue = parseInt(this.queryString.limit, 10) || 100;
    const skip = (pageValue - 1) * limitValue;
    this.query.skip(skip).limit(limitValue);

    return this;
  }
}

module.exports = APIFeatures;
