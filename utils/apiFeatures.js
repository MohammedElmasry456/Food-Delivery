class ApiFeatures {
  constructor(reqQuery, objQuery) {
    this.reqQuery = reqQuery;
    this.objQuery = objQuery;
  }

  filter() {
    const foodObj = { ...this.reqQuery };
    const filters = ["page", "limit", "keyword", "sort", "limitfield"];
    filters.map((e) => delete foodObj[e]);
    let foodObjStr = JSON.stringify(foodObj);
    foodObjStr = foodObjStr.replace(/\b(lt|lte|gt|gte)\b/gi, (el) => `$${el}`);
    this.objQuery = this.objQuery.find(JSON.parse(foodObjStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortFilter = this.reqQuery.sort.split(",").join(" ");
      this.objQuery.sort(sortFilter);
    } else {
      this.objQuery.sort("-createdAt");
    }
    return this;
  }

  limitfield() {
    if (this.reqQuery.limitfield) {
      const limitfieldFilter = this.reqQuery.limitfield.split(",").join(" ");
      this.objQuery.select(limitfieldFilter);
    } else {
      this.objQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.reqQuery.keyword) {
      const queryfiler = {
        $or: [
          { name: { $regex: this.reqQuery.keyword, $options: "i" } },
          { description: { $regex: this.reqQuery.keyword, $options: "i" } },
        ],
      };
      this.objQuery.find(queryfiler);
    }
    return this;
  }

  pagination(numOfDoc) {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    this.objQuery.skip(skip).limit(limit);

    const totalPages = Math.ceil(numOfDoc / limit);
    this.paginationResult = {};
    this.paginationResult.currentPage = page;
    this.paginationResult.totalPages = totalPages;

    if (skip > 0) {
      this.paginationResult.previous = page - 1;
    }
    if (endIndex < numOfDoc) {
      console.log(numOfDoc);
      this.paginationResult.next = page + 1;
    }
    return this;
  }

  async calcNumOfDoc() {
    const clone = this.objQuery.clone();
    return await clone.countDocuments();
  }
}

module.exports = ApiFeatures;
