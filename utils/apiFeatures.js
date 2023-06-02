class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`); ///api/v1/nfts?duration[gte]=5
    this.query = this.query.find(JSON.parse(queryStr));
    // this.query = NFT.find(JSON.parse(queryStr));
    return this;
  }
  //sort
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); ///api/v1/nfts?sort=-price,duration
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-_id"); // or createdAt
    }
    return this;
  }

  //field
  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" "); ///api/v1/nfts?fields=price,images
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // select without __v
    }
    return this;
  }

  //pagenation
  pagenation() {
    const page = this.queryString.page * 1 || 1; // defalut view is page 1
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit; //  page=5 & limit = 10  >>  40 data skip
    this.query = this.query.skip(skip).limit(limit);

    // app crash, if throw error here.   instead, apply to result of res
    // if (this.queryString.page) {
    //   const countNfts = await NFT.countDocuments();
    //   if (skip >= countNfts) throw new Error("This page doesn't exist");
    // }
    return this;
  }
}

module.exports = APIFeatures;
