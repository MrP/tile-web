# tile-web

Takes a big website URL as input, takes a screenshot of it, generates an image pyramyd of the big image, then generates a static website with a scrollable, zoomable version of the original site.

Useful for reducing the memory footprint of some websites that don't work well on mobile browsers or other memory-constrained systems.

# Installation
use it globally from the command line:
```
npm install -g tile-web
```
or from inside a node script:
```
npm install --save tile-web
```

# Usage
From the command line:
```
tile-web http://example.com ./outputFfolder
```

From inside a script:
```
var tileWeb = require('tile-web').tileWeb;

tileWeb('http://example.com/index.html', '/somewhere/outputFolder')
    .then(function (pathOut) {
        console.log(pathOut); // Prints: examplecom/indexhtml
    });
```
