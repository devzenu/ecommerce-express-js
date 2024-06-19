class ApiFeatures {
  // here we made the constructor to initialize the query and querystr
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }
  // api search feature

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // for case insensitive means that captial word mn search kia to small wala bhi sath show ho skta
          },
        }
      : {};
    /// For debugging purposes, to check the keyword object

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // filter we are doing this for category
  filter() {
    const queryCopy = { ...this.queryStr };
    //console.log(queryCopy);
    // removing some fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    // console.log(queryCopy);

    // filter for price and rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // jub bhi this.query likha hoga smj jana iska mtlb product.find method
    this.query = this.query.find(JSON.parse(queryStr));
    //console.log(queryStr);
    return this;
  }
  // pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; // agre page ni ha to current page hoga 1
    // how many products should i skip means that ager page py 5 to next 1st 5 skip next 5 come
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    console.log(this.query.limit(resultPerPage).skip(skip));
    return this;
  }
}

export default ApiFeatures;
