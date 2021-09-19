# post-my-api

A tiny toolkit that generates Markdown docs using the postman collection v2.1

usage:

```bash
$ node index -f example/colln.json -t example
```

check the example [here](example/docs/post-my-api.md)

Supports only Collection schema v2.1, collections present in nested folders also works fine!
I just worked with `JSON` format, feel free to test it and contribute :)


## For generating axios-react api requests
```bash
$ node axios_reqs -f trr.json -t ./trr-docs/
```

## For generating urls api requests
```bash
$ node json_urls -f trr.json -t ./trr-docs/
```

---

I would like to thank

- mkdirp
- prettier
- stdio
- eslint
- eslint-config-prettier
- swagger for colors and which drove me to develop this plugin instead of re-writing everything everytime

---

MIT License

Copyright (c) 2021 Mohammad Fayaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
