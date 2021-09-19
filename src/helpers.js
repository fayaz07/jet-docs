const constants = require("./constants");
const c = require("./constants");

module.exports.removeQueryParams = (str) => {
  var index = str.indexOf("?");
  if(index != -1){
    return str.substr(0, index);
  }
  return str;
};

module.exports.replaceSpacesAndHyphens = (str) => {
  str = str.toString();
  while (str.includes(" ")) {
    str = str.replace(" ", "_");
  }
  while (str.includes("-")) {
    str = str.replace("-", "_");
  }
  // for some reason, this didn't work, so I had to use while loops
  // str = str.replaceAll("-", "_");
  // str = str.replaceAll(" ", "_");
  return str;
};

module.exports.replaceSpacesWithHyphen = (str) => {
  str = str.toString();
  while (str.includes(" ")) {
    str = str.replace(" ", "-");
  }
  // for some reason, this didn't work, so I had to use while loops
  // str = str.replaceAll("-", "_");
  // str = str.replaceAll(" ", "_");
  return str;
};

module.exports.linkTarget = (link) => {
  link = this.replaceSpacesWithHyphen(link).toLowerCase();
  return `<!--
(#${link})
-->`;
};

module.exports.link = (txt, link) => {
  link = this.replaceSpacesWithHyphen(link).toLowerCase();
  return `[${txt}](${link})`;
};

module.exports.buildHeaders = (headers) => {
  var headersCode = "";
  if (headers != null) {
    headers.forEach((e) => {
      headersCode += this.append(
        constants.newLine,
        e.key,
        constants.colonSpace,
        e.value
      );
    });
  }

  return this.code(constants.json, headersCode.substr(1));
};

module.exports.expandKV = (mapV) => {
  var res = "";
  mapV.forEach((v, k) => {
    res += this.append(constants.newLine, k, ": ", v);
  });
  // escaping first newline
  return res.substr(1);
};

module.exports.bold = (str) => {
  return "**" + str + "**";
};

module.exports.italic = (str) => {
  return "*" + str + "*";
};

module.exports.quote = (str) => {
  return "> " + str + c.newLine;
};

module.exports.h1 = (str) => {
  return "# " + str + c.newLine;
};
module.exports.h2 = (str) => {
  return "## " + str + c.newLine;
};
module.exports.h3 = (str) => {
  return "### " + str + c.newLine;
};
module.exports.h4 = (str) => {
  return "#### " + str + c.newLine;
};
module.exports.h5 = (str) => {
  return "##### " + str + c.newLine;
};
module.exports.h6 = (str) => {
  return "###### " + str + c.newLine;
};

module.exports.code = (lang, str) => {
  return c.tripleQuotes + lang + c.newLine + str + c.newLine + c.tripleQuotes;
};

module.exports.append = (...str) => {
  var res = "";
  str.forEach((e) => {
    res += e;
  });
  return res;
};

module.exports.capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

module.exports.appendNL = (str, str2) => {
  return str + str2 + c.newLine;
};

module.exports.method = (img, url) => {
  img = "assets/" + img + ".png";
  return `| <img src="${img}" width="53.3px" height="30px"/> | ${url} |\n| :---------- | :-------- |\n\n`;
};

module.exports.replaceVariables = (oUrl, collnVariables) => {
  var cIndex = 0;
  while (oUrl.includes("{{") || oUrl.includes("}}")) {
    var fIndex = oUrl.indexOf("{{", cIndex);
    var lIndex = oUrl.indexOf("}}", cIndex);

    // console.log(fIndex + " " + lIndex);

    var urlVar = oUrl.substr(fIndex + 2, lIndex - fIndex - 2);

    // console.log("variable found: " + urlVar);

    cIndex = lIndex;

    // console.log("first half: " + oUrl.substr(0, fIndex));
    // console.log("var to be replaced: " + collnVariables.get(urlVar));
    // console.log("second half: " + oUrl.substr(lIndex + 2, oUrl.length));

    oUrl =
      oUrl.substr(0, fIndex) +
      collnVariables.get(urlVar) +
      oUrl.substr(lIndex + 2, oUrl.length);
    // console.log("replaced: " + oUrl);
    // console.log("--------------");
  }
  return oUrl;
};

// console.log(replaceVariables("{{baseUrlAPIv1}}/auth/login"));
