const path = require("path");
const fs = require("fs");
const stdio = require("stdio");
var mkdirp = require("mkdirp");
const bar = new stdio.ProgressBar(7);

module.exports.readCollectionJsonFile = (path) => {
  console.log("Reading collection file...");
  // Synchronous read
  var data = fs.readFileSync(path);
  // console.log(data.toString());
  console.log("Read complete...");
  return data;
};

module.exports.copyAssets = async (outfilePath) => {
  bar.setValue(0);

  var assetRoot = path.join(__dirname, "../");

  // console.log(assetRoot);
  // console.log(path.join(assetRoot, "assets/get.png"));
  // console.log(path.join(outfilePath, "assets/get.png"));

  // write docs
  await fs.copyFile(
    path.join(assetRoot, "assets/get.png"),
    path.join(outfilePath, "assets/get.png"),
    (err) => {
      if (err) throw err;
      // console.log("get.png was copied to destination");
    }
  );

  bar.setValue(1);
  await fs.copyFile(
    path.join(assetRoot, "assets/delete.png"),
    path.join(outfilePath, "assets/delete.png"),
    (err) => {
      if (err) throw err;
      // console.log("del.png was copied to destination");
    }
  );
  bar.setValue(2);
  await fs.copyFile(
    path.join(assetRoot, "assets/head.png"),
    path.join(outfilePath, "assets/head.png"),
    (err) => {
      if (err) throw err;
      // console.log("head.png was copied to destination");
    }
  );
  bar.setValue(3);
  await fs.copyFile(
    path.join(assetRoot, "assets/options.png"),
    path.join(outfilePath, "assets/options.png"),
    (err) => {
      if (err) throw err;
      // console.log("options.png was copied to destination");
    }
  );
  bar.setValue(4);
  await fs.copyFile(
    path.join(assetRoot, "assets/patch.png"),
    path.join(outfilePath, "assets/patch.png"),
    (err) => {
      if (err) throw err;
      // console.log("patch.png was copied to destination");
    }
  );
  bar.setValue(5);
  fs.copyFile(
    path.join(assetRoot, "assets/post.png"),
    path.join(outfilePath, "assets/post.png"),
    (err) => {
      if (err) throw err;
      // console.log("post.png was copied to destination");
    }
  );
  bar.setValue(6);
  await fs.copyFile(
    path.join(assetRoot, "assets/put.png"),
    path.join(outfilePath, "assets/put.png"),
    (err) => {
      if (err) throw err;
      // console.log("put.png was copied to destination");
    }
  );
  bar.setValue(7);
  bar.tick();
};

module.exports.createFileAndWrite = (fileName, outfilePath, content) => {
  console.log(fileName);
  console.log(outfilePath);
  var writeStream = fs.createWriteStream(path.join(outfilePath, fileName));
  writeStream.write(content);
  writeStream.end();
  console.log(`Wrote contents to file at ${path.join(outfilePath, fileName)}`);
};

module.exports.createDirectories = async (outputDir) => {
  console.log("Creating direcotries...");
  await mkdirp(outputDir, mkdirp.prototype, function (err) {
    if (err) console.error(err);
    // else console.log("created directory");
  });

  await mkdirp(
    path.join(outputDir, "assets"),
    mkdirp.prototype,
    function (err) {
      if (err) console.error(err);
      // else console.log("created directory");
    }
  );
  console.log("Direcotries created...");
};