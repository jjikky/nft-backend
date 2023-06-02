const multer = require("multer");
const Token = require("../models/Token");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");
const NFT = require("../models/NFT");

const nfts = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../", "nft-data", "data", "nft-simple.json")
  )
);

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_API_KEY_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = new ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
// const ipfs = new ipfsClient({
//   host: "localhost",
//   port: "5001",
//   protocol: "http",
// });
const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add(
    { path: fileName, content: file },
    { pin: true }
  );
  const fileHash = String(fileAdded.cid);
  // ipfs.pin.add(fileAdded.cid).then((res) => {
  //   console.log(res);
  // });
  return fileHash;
};

exports.test = async (req, res) => {
  const token = await Token.find();
  // res.send(token);
  // console.log(token);
  res.render("test", { token });
};

exports.minting = (req, res) => res.render("minting");

exports.mintingImage = async (req, res) => {
  try {
    console.log("file name :", req.file.filename);
    const hash = addFile(
      req.file.filename,
      `uploads/${req.file.filename}`
    ).then(async (resolveData) => {
      console.log("cid : ", resolveData);
      fs.unlink(`uploads/${req.file.filename}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
      const isExist = await Token.findOne({ hash: resolveData });
      if (!isExist) {
        const token = await Token.create({ hash: resolveData, name: "asdas" });
        console.log("token data stored in database");
      } else {
        console.log("token already exists");
      }
      res.send({ data: "success", hash: resolveData });
    });
  } catch (error) {
    console.log(error);
  }
};

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

exports.getAllNfts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`); ///api/v1/nfts?duration[gte]=5
    let query = NFT.find(JSON.parse(queryStr));

    //sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" "); ///api/v1/nfts?sort=-price,duration
      query = query.sort(sortBy);
    } else {
      query = query.sort("-_id"); // or createdAt
    }

    //field
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" "); ///api/v1/nfts?fields=price,images
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // select without __v
    }

    const nfts = await query;

    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      results: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "server error : " + err,
    });
  }
};

exports.createNFT = async (req, res) => {
  try {
    const nft = await NFT.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getSingleNFT = async (req, res) => {
  try {
    const id = req.params.id;
    const nft = await NFT.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateNFT = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteNFT = async (req, res) => {
  try {
    const id = req.params.id;
    await NFT.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
