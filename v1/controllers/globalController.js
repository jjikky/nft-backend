const multer = require("multer");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs");
const ipfs = new ipfsClient({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

exports.home = async (req, res) => {
  // const hash = addFile(
  //   "5_1679213033671.png",
  //   `uploads/5_1679213033671.png`
  // ).then((resolveData) => {
  //   console.log(resolveData);
  //   res.send({ data: "success", hash: resolveData });
  // });
  res.render("home");
};

exports.minting = (req, res) => res.render("minting");

exports.mintingImage = async (req, res) => {
  try {
    console.log(req.file.filename);
    const hash = addFile(
      req.file.filename,
      `uploads/${req.file.filename}`
    ).then((resolveData) => {
      console.log(resolveData);
      res.send({ data: "success", hash: resolveData });
    });
    // res.send({ data: "success" });
  } catch (error) {
    console.log(error);
  }
};

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add(
    { path: fileName, content: file },
    { pin: true }
  );
  const fileHash = String(fileAdded.cid);
  return fileHash;
};
