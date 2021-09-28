const httpPrefix = "http://";
const httpsPrefix = "https://";

function appendPathParamsToUrl(url) {
  let appendPrefix = "";

  if (url.includes(httpPrefix)) {
    appendPrefix = httpPrefix;
    url = url.replace(httpPrefix, "");
  } else if (url.includes(httpsPrefix)) {
    appendPrefix = httpsPrefix;
    url = url.replace(httpsPrefix, "");
  }

  if (url.endsWith("/")) {
    url = url.substr(0, url.length - 1);
  }
  let params = [];

  while (url.includes(":")) {
    const index = url.indexOf(":");
    const indexx = url.substr(index).indexOf("/");
    if (indexx == -1) {
      const param = url.substr(index).replace(":", "");
      params.push(param);
      url = replaceBetween(url, index, url.length, "${" + param + "}");
    } else {
      const param = url.substr(index, indexx).replace(":", "");
      params.push(param);
      url = replaceBetween(url, index, indexx, "${" + param + "}");
    }
  }

  return { url: appendPrefix + url, params: params.join(",") };
}

function replaceBetween(str, start, end, what) {
  return str.replace(str.substr(start, end), what);
}

console.log(appendPathParamsToUrl("https://mohammadfayaz.in/"));
