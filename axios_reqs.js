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
  outputDir = readers.getOutputDir().replace("/docs", "");

  // reading collection
  const inBytes = fileHandlers.readCollectionJsonFile(inPath);
  const collectionJSON = JSON.parse(inBytes.toString());

  // reading variables stored in the collection
  const collnVariables = jsonHandlers.getVariables(collectionJSON);

  await fileHandlers.createOnlyTargetDirectories(outputDir);

  console.log("Building your urls....");
  // jsonHandlers.generateDocs(collectionJSON, collnVariables, outputDir);
  buildUrls(collectionJSON, outputDir);
  // console.log(collectionJSON)
  console.log("Requests building finished....");
  // console.log("Copying assets....");
  // await fileHandlers.copyAssets(outputDir);
  // console.log("API Docs built successfully....");
}

function buildUrls(colln, outputDir) {
  var reqsForAxios = 'import axios from "./axios"';
  if (colln.item) {
    reqsForAxios += findNestedRoutes(colln.item, outputDir);
  }
  // reqsForAxios += "});";
  // console.log(reqsForAxios)
  // fileHandlers.createFileAndWrite("reqs.js", "./", reqsForAxios);
}

const _isSuccessFunction = "\n\nfunction _isSuccess(resp){\r\n  return resp.data.status == \"success\"\r\n}";

function findNestedRoutes(colln, outputDir) {
  let requests = "";
  let exports = "export {";
  for (let i = 0; i < colln.length; i++) {
    let c = colln[i];
    if (c.item) {
      let reqs = findNestedRoutes(c.item, outputDir);
      let fileContent =
        'import axios from "./axios"\n\n' + reqs.requests + _isSuccessFunction + reqs.exports;
      fileHandlers.createFileAndWrite(
        `${getCamelcase(c.name)}.js`,
        outputDir,
        fileContent
      );
    } else {
      exports += getCamelcase(c.name) + ",\n";
      // console.log(c.request.method)
      let params = findOutParams(c);
      let req = writeAsyncFunction(getCamelcase(c.name), params);

      req += "\n";
      req += "try{\n\tlet response = await";

      if (c.request.method == "GET") {
        // console.log(appendQueryParamsToUrl(formatUrl(
        //   c.request.url.raw
        // ),params))
        req += ` axios({
          method: \"${c.request.method}\",
          url: \`${appendQueryParamsToUrl(
            formatUrl(c.request.url.raw),
            params
          )}\`});\n\t`;
      } else {
        req += ` axios({
              method: \"${c.request.method}\",
              url: \"${formatUrl(c.request.url.raw)}\",
              body: ${paramsToJsonBody(params)} 
            });\n\t`;

        // req += ` axios.${c.request.method.toLowerCase()}(\`${formatUrl(
        //   c.request.url.raw
        // )}\`, ${paramsToJsonBody(params)});\n\t`;
      }

      req +=
        `\treturn {success: _isSuccess(response.data.status), message: response.data.message, statusCode: response.status, data: response.data.data};\n} catch (e){\n\tconsole.log(\`Axios ${c.request.method} request failed: \${e}\`);\nreturn {success: false, message: e.response.data.message, statusCode: e.response.status, data: null};\nthrow e;\n}`;

      req += closeAsyncFunction();
      // getCamelcase(c.name) + ":" + `\"${formatUrl(c.request.url.raw)}\",\n`;
      // console.log(getCamelcase(c.name) + ":" + `\"${formatUrl(c.request.url.raw)}\",\n`)

      requests += req + "\n\n";
    }
  }
  return { requests: requests, exports: exports + "}" };
}

function _isSuccess(resp){
  return resp.data.status == "success"
}

function findOutParams(c) {
  switch (c.request.method) {
    case "POST":
    case "PATCH":
    case "DELETE":
    case "PUT":
      return paramsForOthers(c);
    case "GET":
      return paramsForGET(c);
  }
}

function paramsForOthers(c) {
  if (c.request.body) {
    if (c.request.body.mode == "raw") {
      // console.log(c.request.body.raw)
      const b = JSON.parse(c.request.body.raw.toString());
      // console.log(b)
      let allParams = "";
      for (const [key, value] of Object.entries(b)) {
        allParams += key + ",";
      }
      if (allParams.length > 2) {
        allParams = allParams.substr(0, allParams.length - 1);
      }
      // console.log(allParams)
      return allParams;
    }
  }
  return "";
}
/*
{
							"name": "get clients",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{url}}/admin/client?page=1&limit=20",
									"host": [
										"{{url}}"
									],
									"path": [
										"admin",
										"client"
									],
									"query": [
										{
											"key": "page",
											"value": "1"
										},
										{
											"key": "limit",
											"value": "20"
										}
									]
								}
							},
							"response": []
						}
*/

function paramsForGET(c) {
  if (c.request.url.query) {
    const arr = c.request.url.query;
    let allParams = "";
    arr.forEach((element) => {
      // console.log(element)
      // const b = JSON.parse(element.toString())
      // console.log(b)
      allParams += element.key + ",";
    });
    if (allParams.length > 2) {
      allParams = allParams.substr(0, allParams.length - 1);
    }
    // console.log(allParams);
    return allParams;
  }
  return "";
}

function appendQueryParamsToUrl(url, params) {
  if (params && params.length > 1) {
    let pArr = params.split(",");
    url += "?";
    pArr.forEach((element) => {
      if (element && element.length > 0) url += `${element}=\$\{${element}\}&`;
    });
    url = url.substr(0, url.length - 1);
    // console.log(url)
  }
  return url;
}

function paramsToJsonBody(params) {
  let body = "{";
  // console.log(params);
  if (params && params.length > 1) {
    let pArr = params.split(",");
    // console.log(pArr);
    pArr.forEach((element) => {
      if (element && element.length > 0) body += `${element}:${element}, `;
    });
    body = body.substr(0, body.length - 2);
    // console.log(url)
    body += "}";
  }
  // console.log(body + "\n");
  return body;
}

function formatUrl(url) {
  while (url.includes("{{") || url.includes("}}")) {
    var fIndex = url.indexOf("{{");
    var lIndex = url.indexOf("}}");
    url = url.substr(0, fIndex) + url.substr(lIndex + 2, url.length);
  }
  url = helpers.removeQueryParams(url);
  if (url.endsWith("/")) {
    return url.substr(0, url.length - 1);
  }
  return url;
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

function writeAsyncFunction(funcName, params) {
  if (params && params.length > 0) {
    return `async function ${funcName}(${params}){`;
  }
  return `async function ${funcName}(){`;
}

function closeAsyncFunction() {
  return "}";
}
/*
{
							"name": "disable user access",
							"request": {
								"method": "PATCH",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"userId\":\"6145665ea592c67f64e48a59\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{url}}/admin/user/disable",
									"host": [
										"{{url}}"
									],
									"path": [
										"admin",
										"user",
										"disable"
									]
								}
							},
							"response": []
						},
*/
