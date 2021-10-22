
// global, for html page from test.htm @npm
combine_config = require("../combine-config.js");

prototype_stringify = require("prototype-stringify");   //tool for debug

module.exports = {		//global variable

	"combine-config": function (done) {

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

		var s1_base = prototype_stringify(base_config);

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

		var s1_sub = prototype_stringify(sub_config);

		var new_config = combine_config(base_config, sub_config, "test");		//A new config object is created

		var s2_base = prototype_stringify(base_config);
		var s2_sub = prototype_stringify(sub_config);

		//change somethig
		new_config.mine["css"] = "text/css";		//The base config is isolated by prototype chain
		var s3_base = prototype_stringify(base_config);

		base_config.ip2 = "127.0.0.2";			//Change to base config will be seen in the new config
		base_config.mine["js"] = "text/javascript";
		base_config.mine["html"] = "text";

		console.log(new_config);
		prototype_stringify(new_config, "\t");

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

		var s_new = prototype_stringify(new_config);
		var s_expect = prototype_stringify(expect_config);

		var s_new2 = prototype_stringify(new_config, "\t");
		var s_expect2 = prototype_stringify(expect_config, "\t");

		console.log(s1_base);
		console.log(s2_base);
		console.log(s3_base);
		console.log(s1_sub);
		console.log(s2_sub);
		console.log(s_new);
		console.log(s_expect);
		console.log(s_new2);
		console.log(s_expect2);

		done(!(
			s1_base === s2_base && s1_base === s3_base && s1_sub === s2_sub &&		//source is unchanged
			s_new === s_expect && s_new2 === s_expect2
		));
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult === "undefined") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]); } });
