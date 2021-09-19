const helpers = require("./helpers");
const constants = require("./constants");
const fileHandlers = require("./file_handlers");
const { doc } = require("prettier");

module.exports.getVariables = (jsonFile) => {
  const cVariablesRaw = jsonFile.variable;
  var collnVariables = new Map();
  if (cVariablesRaw != null) {
    cVariablesRaw.forEach((e) => {
      collnVariables.set(e.key, e.value);
    });
  }
  return collnVariables;
};

module.exports.generateDocs = (json, variables, outputDir) => {
  // build API info
  // console.log("\n\n\n\n");
  var info = buildAPIInfo(json, variables);
  // console.log(info);
  const { result, urlsForJS } = buildRoutes(json.info.name, json.item, variables, outputDir);
  const routes = result;
  fileHandlers.createFileAndWrite(
    "urls.js",
    outputDir,
    urlsForJS
  )
  fileHandlers.createFileAndWrite(
    helpers.append(json.info.name, ".md"),
    outputDir,
    helpers.append(info, constants.newLine, routes)
  );
  return info;
};

function buildAPIInfo(json, variables) {
  const info = json.info;

  var res = "";
  // Add name
  res += helpers.h1(info.name);

  // Add description
  if (info.description) {
    res += helpers.quote(info.description) + constants.newLine;
  }

  // Add Authorization schema
  if (json.auth) {
    res += buildAuthType(json);
  }

  // Add variables
  res += helpers.append(
    constants.newLine,
    helpers.bold(constants.variables),
    constants.colonSpace,
    constants.newLine,
    helpers.code(constants.json, helpers.expandKV(variables))
  );

  // Add postman collection Schema
  res += helpers.append(
    constants.newLine,
    helpers.bold(constants.schema),
    constants.colonSpace,
    info.schema,
    constants.newLine
  );

  return res;
}

function buildAuthType(json) {
  var res = helpers.append(
    helpers.bold(constants.authorization),
    constants.colonSpace,
    helpers.capitalizeFirstLetter(json.auth.type),
    constants.newLine
  );

  res += helpers.append(
    constants.newLine,
    helpers.bold(constants.usage),
    constants.colonSpace,
    constants.newLine
  );
  res += buildAuthTypeUsage(json);

  return res;
}

function buildAuthTypeUsage(json) {
  return helpers.code(
    constants.json,
    helpers.append(
      constants.authorization,
      constants.colonSpace,
      helpers.capitalizeFirstLetter(json.auth.type),
      " ",
      json.auth[json.auth.type.toString()][0].value
    )
  );
}

function buildRoutes(parent, routes, variables, outputDir) {
  var hyperlinks = "";
  var routesRes = "";
  var urlsForJS = "module.exports = Object({\n";

  routes.forEach((r) => {
    // check for grouped routes
    if (r.item) {
      console.log("------item")
      // this is a grouped route
      var result = buildGroupedRoutes(parent, r, variables, outputDir);
      // console.log(result);
      urlsForJS += result.urls;
      hyperlinks += helpers.append(
        constants.newLine,
        "- ",
        helpers.link(
          helpers.append(r.name, " (nested)"),
          helpers.append("./", result.fileName)
        )
      );
    } else {
      console.log("------not item")
      // single route
      const {docs, url} = buildSingleRoute(r, variables);
      routesRes += docs;

      urlsForJS +=  url;

      hyperlinks += helpers.append(
        constants.newLine,
        "- ",
        helpers.link(r.name, helpers.append("#", r.name))
      );
    }
  });
  const res = helpers.append(
    helpers.h2("Routes index"),
    hyperlinks.substr(1),
    constants.newLine,
    constants.newLine,
    routesRes
  );
  // console.log(res);
  urlsForJS += "});"; 
  return { result: res, urlsForJS: urlsForJS };
}

function buildSingleRoute(r, variables) {
  var url = `\n${helpers.replaceSpacesAndHyphens(
    r.name.toString()
  )}:`
  const requestType = r.request.method.toString().toLowerCase();

  // write link target
  var _routesDocs = helpers.append(
    helpers.linkTarget(r.name),
    constants.newLine
  );

  // write name
  _routesDocs += helpers.h3(r.name);

  // write method and
  var met;
  if (requestType == "get") {
    url += `\"${helpers.removeQueryParams(r.request.url.raw)}\"`
    met = helpers.method(
      requestType,
      helpers.replaceVariables(
        helpers.removeQueryParams(r.request.url.raw),
        variables
      )
    );
  } else {
    url += `\"${r.request.url.raw}\"`
    met = helpers.method(
      requestType,
      helpers.replaceVariables(r.request.url.raw, variables)
    );
  }

  _routesDocs = helpers.appendNL(_routesDocs, met);

  // write authentication
  if (r.request.auth != null) {
    // var auth = ": " + r.request.auth.type + "\n";
    // _routesDocs = helpers.appendNL(_routesDocs, auth);

    _routesDocs += helpers.append(
      buildAuthTypeUsage(r.request),
      constants.newLine
    );
  }

  // write description
  if (r.request.description != null) {
    var desc = helpers.appendNL("Description: ", r.request.description) + "\n";
    _routesDocs = helpers.append(_routesDocs, desc);
  }

  // write request body for POST, PATCH
  // supports only raw
  if (
    requestType == "post" ||
    requestType == "patch" ||
    requestType == "delete"
  ) {
    if (r.request.header) {
      _routesDocs =
        _routesDocs +
        helpers.appendNL(
          "Request headers:<br/>\n",
          helpers.buildHeaders(r.request.header)
        );
    }

    if (r.request.body) {
      _routesDocs =
        _routesDocs +
        helpers.appendNL(
          "Request body:<br/>\n",
          helpers.code("json", r.request.body.raw)
        );
    }

    // there can be n responses
    var responsesRaw = r.response;
    _routesDocs = _routesDocs + helpers.append("Responses:<br/>\n", "");

    if (responsesRaw != null) {
      // sort by status codes
      responsesRaw.sort(function (a, b) {
        return a.code - b.code;
      });
      responsesRaw.forEach((r) => {
        _routesDocs = helpers.appendNL(_routesDocs, buildResponse(r));
      });
    }
  }

  if (requestType == "get") {
    if (r.request.header) {
      _routesDocs =
        _routesDocs +
        helpers.appendNL(
          "Request headers:<br/>\n",
          helpers.buildHeaders(r.request.header)
        );
    }

    if (r.request.url.query) {
      _routesDocs =
        _routesDocs +
        helpers.appendNL(
          "Request query:<br/>\n",
          helpers.buildHeaders(r.request.url.query)
        );
    }
  }

  _routesDocs += helpers.append(constants.newLine, "---", constants.newLine);
  return { docs: _routesDocs, url: url + ","};
}

function buildGroupedRoutes(parent, route, variables, outputDir) {
  // create file and save it there
  // should have a hyperlink from main file
  // check if the file already exists, then append variable and save the file
  const fileName = helpers.append(
    helpers.replaceSpacesAndHyphens(parent),
    "_",
    route.name,
    ".md"
  );
  var urlsForJS = "";
  var content = "";
  var hyperlinks = "";
  route.item.forEach((r) => {
    if (r.item) {
      // nested grouped route
      var result = buildGroupedRoutes(
        helpers.append(parent, "_", route.name),
        r,
        variables,
        outputDir
      );
      urlsForJS += result.urls;
      hyperlinks += helpers.append(
        constants.newLine,
        "- ",
        helpers.link(
          helpers.append(r.name, " (nested)"),
          helpers.append("./", result.fileName)
        )
      );
      // console.log(result);
    } else {
      // normal route
      hyperlinks += helpers.append(
        constants.newLine,
        "- ",
        helpers.link(r.name, helpers.append("#", r.name))
      );
      const {docs, url} = buildSingleRoute(r, variables);
      content += docs;
      urlsForJS = url;
    }
  });
  fileHandlers.createFileAndWrite(
    fileName,
    outputDir,
    helpers.append(
      helpers.h1(route.name),
      constants.newLine,
      helpers.h2("Routes index"),
      hyperlinks.substr(1),
      constants.newLine,
      constants.newLine,
      content
    )
  );
  return { fileName: fileName, urls: urlsForJS };
}

function buildResponse(r) {
  var resposne = "";
  var statusCode = helpers.quote(helpers.append(r.code, " ", r.status));
  var headers = helpers.append(
    constants.newLine,
    helpers.bold(constants.headers),
    constants.newLine,
    helpers.buildHeaders(r.header)
  );
  var body = helpers.append(
    helpers.bold(constants.body),
    constants.newLine,
    helpers.code(constants.json, r.body)
  );
  resposne = helpers.appendNL(resposne, statusCode);
  resposne = helpers.appendNL(resposne, headers);
  resposne = helpers.appendNL(resposne, body);
  return resposne;
}
