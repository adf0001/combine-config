
// combine-config @ npm
// to combine config object

var call_log_func = require("call-log-func");
var is_simple_object = require("is-simple-object");
var prototype_clone = require("prototype-clone");

var createRef = prototype_clone.createRef;

//re-write prototype_clone.copySingle()
var copySingle = function (target, source, refMap, logFunc, logPath) {
	if (!refMap) refMap = new Map();		//map the original to the derived
	if (!target) target = createRef(source, refMap);

	var i, ti, si, si_simple, i2;
	for (i in source) {
		si = source[i];

		//forcely replace
		if (typeof i === "string" && i.charAt(0) == "!") {
			i2 = i.slice(1);
			call_log_func(logFunc, logPath + "." + i2 + ", \t\t replaced forcely");

			if (is_simple_object(si)) target[i2] = copySingle(null, si, refMap, logFunc, logPath + "." + i2);
			else target[i2] = si;

			continue;
		}

		ti = target[i];

		if ((si_simple = is_simple_object(si)) && is_simple_object(ti)) {
			//deep copy
			if (Object.prototype.hasOwnProperty.call(target, i)) {
				if (!refMap.has(si) || refMap.get(si) !== ti) copySingle(ti, si, refMap, logFunc, logPath + "." + i);
				//else console.log("skip already copied, " + i);	//skip already copied
			}
			else {
				target[i] = refMap.has(si) ?
					refMap.get(si) :		//copy already copied
					copySingle(null, si, refMap, logFunc, logPath + "." + i);
			}
		}
		else {
			//direct copy
			if (si_simple) target[i] = createRef(si, refMap);
			else if (ti !== si) {
				call_log_func(logFunc, (logPath || "") + "." + i + ", \t\t " + ((typeof ti === "undefined") ? "added" : "replaced"));
				target[i] = si;
			}
			//else { }	//skip same
		}
	}
	return target;
}

//var combine_config = function (baseConfig, subConfig [, logFunc ] )
var combine_config = function (baseConfig, subConfig, logFunc) {
	var refMap = new Map();		//map the original to the derived

	var target = null;
	target = copySingle(target, baseConfig, refMap, logFunc, "");
	target = copySingle(target, subConfig, refMap, logFunc, "");

	return target;
}

//module

module.exports = exports = combine_config;

exports.copySingle = copySingle;	//export sub tool
