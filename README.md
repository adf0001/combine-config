# combine-config
Combine config object

# Install
```
npm install combine-config
```

# Usage
```javascript
var combine_config = require("combine-config");
var prototype_stringify = require("prototype-stringify");   //tool for debug

var base_config = {
	ip: "127.0.0.1",	//Items will be untouched if not existed in sub config.
	port: 8080,
	param: [1, 2, 3, 4],
	date1: new Date(2000, 1, 1),
	func1: function () { },

	mine: {
		"html": "text/html",	//Items will be untouched if not existed in sub config.
		"jpg": "image/jpg",
	},
	mine2: {
		"html": "text/html",
		"jpg": "image/jpg",
	},

};

var sub_config = {
	port: 8081,		//Items will be replaced, except simple objects.
	param: [3, 4],
	date1: null,
	func1: undefined,

	mine: {				//simple objects will be deep-copied.
		"txt": "text/plain",
		"jpg": "application/octet-stream",
	},
	"!mine2": {			//To stop deep-copy, prefix name with "!".
		"txt": "text/plain",
	},

	param2: "new param",	//Add new item
};

var new_config = combine_config(base_config, sub_config, "test");		//A new config object is created

//change somethig
new_config.mine["css"] = "text/css";		//The base config is isolated by prototype chain

base_config.ip2 = "127.0.0.2";			//Change to base config will be seen in the new config
base_config.mine["js"] = "text/javascript";
base_config.mine["html"] = "text";

console.log(new_config);
prototype_stringify(new_config, "\t");

/*
var expect_config = {
	ip: "127.0.0.1",
	ip2: "127.0.0.2",
	port: 8081,
	param: [3, 4],
	date1: null,
	func1: undefined,

	mine: {
		"html": "text",
		"txt": "text/plain",
		"jpg": "application/octet-stream",
		"js": "text/javascript",
		"css": "text/css",
	},
	mine2: {
		"txt": "text/plain",
	},
	param2: "new param",
};
*/

```
