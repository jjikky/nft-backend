// const multer = require("multer");
// const Token = require("../models/Token");
// const ipfsClient = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");
const NFT = require("../models/NFT");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filter() {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // filter
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`); ///api/v1/nfts?duration[gte]=5
//     this.query = this.query.find(JSON.parse(queryStr));
//     // this.query = NFT.find(JSON.parse(queryStr));
//     return this;
//   }
//   //sort
//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" "); ///api/v1/nfts?sort=-price,duration
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-_id"); // or createdAt
//     }
//     return this;
//   }

//   //field
//   selectFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" "); ///api/v1/nfts?fields=price,images
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v"); // select without __v
//     }
//     return this;
//   }

//   //pagenation
//   pagenation() {
//     const page = this.queryString.page * 1 || 1; // defalut view is page 1
//     const limit = this.queryString.limit * 1 || 10;
//     const skip = (page - 1) * limit; //  page=5 & limit = 10  >>  40 data skip
//     this.query = this.query.skip(skip).limit(limit);

//     // app crash, if throw error here.   instead, apply to result of res
//     // if (this.queryString.page) {
//     //   const countNfts = await NFT.countDocuments();
//     //   if (skip >= countNfts) throw new Error("This page doesn't exist");
//     // }
//     return this;
//   }
// }

const nfts = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../", "nft-data", "data", "nft-simple.json")
  )
);

// const projectId = process.env.INFURA_PROJECT_ID;
// const projectSecret = process.env.INFURA_API_KEY_SECRET;
// const auth =
//   "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// const ipfs = new ipfsClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
//   headers: {
//     authorization: auth,
//   },
// });
// const ipfs = new ipfsClient({
//   host: "localhost",
//   port: "5001",
//   protocol: "http",
// });
// const addFile = async (fileName, filePath) => {
//   const file = fs.readFileSync(filePath);
//   const fileAdded = await ipfs.add(
//     { path: fileName, content: file },
//     { pin: true }
//   );
//   const fileHash = String(fileAdded.cid);
//   // ipfs.pin.add(fileAdded.cid).then((res) => {
//   //   console.log(res);
//   // });
//   return fileHash;
// };

// exports.test = async (req, res) => {
//   const token = await Token.find();
//   // res.send(token);
//   // console.log(token);
//   res.render("test", { token });
// };

// exports.minting = (req, res) => res.render("minting");

// exports.mintingImage = async (req, res) => {
//   try {
//     console.log("file name :", req.file.filename);
//     const hash = addFile(
//       req.file.filename,
//       `uploads/${req.file.filename}`
//     ).then(async (resolveData) => {
//       console.log("cid : ", resolveData);
//       fs.unlink(`uploads/${req.file.filename}`, (err) => {
//         if (err) {
//           console.log(err);
//         }
//       });
//       const isExist = await Token.findOne({ hash: resolveData });
//       if (!isExist) {
//         const token = await Token.create({ hash: resolveData, name: "asdas" });
//         console.log("token data stored in database");
//       } else {
//         console.log("token already exists");
//       }
//       res.send({ data: "success", hash: resolveData });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const NFT = require("./../models/nftModel");

exports.checkId = (req, res, next, value) => {
  console.log(`ID: ${value}`);
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name and price",
    });
  }
  next();
};

exports.topRateNfts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

exports.getAllNfts = catchAsync(async (req, res) => {
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // filter
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`); ///api/v1/nfts?duration[gte]=5
  // let query = NFT.find(JSON.parse(queryStr));

  // //sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" "); ///api/v1/nfts?sort=-price,duration
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-_id"); // or createdAt
  // }

  // //field
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" "); ///api/v1/nfts?fields=price,images
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v"); // select without __v
  // }

  // //pagenation
  // const page = req.query.page * 1 || 1; // defalut view is page 1
  // const limit = req.query.limit * 1 || 10;
  // const skip = (page - 1) * limit; //  page=5 & limit = 10  >>  40 data skip
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const countNfts = await NFT.countDocuments();
  //   if (skip >= countNfts) throw new Error("This page doesn't exist");
  // }

  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .pagenation();
  const nfts = await features.query;

  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length > 0 ? nfts.length : "No data exist",
    // validation of APIFeatures.pagenation.  instead, apply here
    //   if (skip >= countNfts) throw new Error("This page doesn't exist");
    data: {
      nfts,
    },
  });
});

exports.createNFT = catchAsync(async (req, res) => {
  const nft = await NFT.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      nft,
    },
  });

  // try {
  //   const nft = await NFT.create(req.body);
  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       nft,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: err,
  //   });
  // }
});

exports.getSingleNFT = catchAsync(async (req, res) => {
  const id = req.params.id;
  const nft = await NFT.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

exports.updateNFT = catchAsync(async (req, res) => {
  const id = req.params.id;
  const nft = await NFT.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

exports.deleteNFT = catchAsync(async (req, res) => {
  const id = req.params.id;
  await NFT.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// aggregation pipeline
exports.getStats = catchAsync(async (req, res) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, //Columns that divide groups
        numNFT: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: -1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: "EASY" },  // example for "not equal"
    //   },
    // },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTStarts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numNFTStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: plan,
  });
});
