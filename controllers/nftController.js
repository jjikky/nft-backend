const multer = require("multer");
const Token = require("../models/Token");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");

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

exports.home = async (req, res) => {
  res.send({ nfts });
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
