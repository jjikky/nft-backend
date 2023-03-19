const multer = require("multer");

exports.home = (req, res) => {
  res.send({ message: "Welcome api v1" });
};

exports.minting = (req, res) => res.render("minting");

exports.mintingImage = async (req, res) => {
  try {
    console.log(req.file.filename);

    res.send({ data: "success" });
  } catch (error) {
    console.log(error);
  }
};
