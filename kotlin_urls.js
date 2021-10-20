const readers = require("./src/read_inputs");
const fileHandlers = require("./src/file_handlers");
const jsonHandlers = require("./src/json_handlers");
const helpers = require("./src/helpers");

main();

var inPath;
var outputDir;

async function main() {
  // validates inputs
  readers.validateInputs();

  // get the file paths
  inPath = readers.getInputFilePath();
  outputDir = readers.getOutputDir();

  // reading collection
  const inBytes = fileHandlers.readCollectionJsonFile(inPath);
  const collectionJSON = JSON.parse(inBytes.toString());

  // reading variables stored in the collection
  const collnVariables = jsonHandlers.getVariables(collectionJSON);

  await fileHandlers.createDirectories(outputDir);

  console.log("Building your urls....");
  // jsonHandlers.generateDocs(collectionJSON, collnVariables, outputDir);
  buildUrls(collectionJSON);
  // console.log(collectionJSON)
  console.log("Urls building finished....");
  // console.log("Copying assets....");
  // await fileHandlers.copyAssets(outputDir);
  // console.log("API Docs built successfully....");
}

function buildUrls(colln) {
  var urlsForJS = "object EndPoints {\n";
  if (colln.item) {
    urlsForJS += findNestedRoutes(colln.item);
  }
  urlsForJS += "}";
  // console.log(urlsForJS)
  fileHandlers.createFileAndWrite("EndPoints.kt", "./", urlsForJS);
}

function findNestedRoutes(colln) {
  let urls = "";
  for (let i = 0; i < colln.length; i++) {
    let c = colln[i];
    if (c.item) {
      const u = getCamelcase(c.name);
      const objj = u.charAt(0).toUpperCase() + u.substring(1);
      urls += `object ${objj} {\n${findNestedRoutes(c.item)}}\n`;
    } else {
      urls +=
        `const val ` +
        getCamelcase(c.name) +
        ":String = " +
        `\"${formatUrl(c.request.url.raw)}\"\n`;
      // console.log(getCamelcase(c.name) + ":" + `\"${formatUrl(c.request.url.raw)}\",\n`)
    }
  }
  return urls;
}

function formatUrl(url) {
  while (url.includes("{{") || url.includes("}}")) {
    var fIndex = url.indexOf("{{");
    var lIndex = url.indexOf("}}");
    url = url.substr(0, fIndex) + url.substr(lIndex + 2, url.length);
  }
  return helpers.removeQueryParams(url);
}

function getCamelcase(myString) {
  while (myString.includes(" ")) {
    myString = myString.replace(" ", "_");
  }
  while (myString.includes("-")) {
    myString = myString.replace("-", "_");
  }
  myString = myString.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
  return myString;
}
