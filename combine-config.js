
// combine-config @ npm
// to combine config object

var call_log_func = require("call-log-func");
var is_simple_object = require("is-simple-object");

//var combine_config = function (baseConfig, subConfig [, logFunc [, logPath]] )
var combine_config = function (baseConfig, subConfig, logFunc, logPath) {
	var target = Object.create(baseConfig);

	var i, bi, si;
	for (i in subConfig) {
		si = subConfig[i];

		//forcely replace
		if (typeof i === "string" && i.charAt(0) == "!") {
			target[i.slice(1)] = si;
			call_log_func(logFunc, (logPath || "") + "." + i.slice(1) + ", \t\t replaced forcely");
			continue;
		}

		//if not exist
		if (!(i in baseConfig)) {
			target[i] = si;
			call_log_func(logFunc, (logPath || "") + "." + i + ", \t\t added");
			continue;
		}

		bi = baseConfig[i];
		if (bi === si) continue;

		if (!is_simple_object(si) || !is_simple_object(bi)) {
			target[i] = si;
			call_log_func(logFunc, (logPath || "") + "." + i + ", \t\t replaced");
			continue;
		}

		target[i] = combine_config(bi, si, logFunc, (logPath || "") + "." + i);
	}
	return target;
}

//module

module.exports = combine_config;
