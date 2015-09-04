# TesselKit

A simple module that can be useful for basic Tessel app development.


## Examples

* [Tessel Climate Module Test Project](https://github.com/georgenorman/tessel-climate)


## Overview of the TesselKit Modules

### tessel-utils

This module contains specialized utility functions (useful for Tessel app development). Some examples:

* **getArgumentValue(argumentName, defaultValue)**: Read the argument, with the given `argumentName`, from the commandline and if it doesn't exist, use the given `defaultValue`.
  The default can be a scalar or an object. If it's an object, then retrieve the value using the given `argumentName` as the key.
* **isValidPort(port)**: Returns true if the given port is a valid name (e.g., "A", "B").


Example:

```javascript
// Configure the application from the commandline.
// If an argument is missing, then read it from the config file.
var climatePort = tesselKit.tesselUtils.getArgumentValue("climatePort", config);
var refreshRate = tesselKit.tesselUtils.getArgumentValue("refreshRate", config);

var portStatus = tesselKit.tesselUtils.isValidPort(climatePort);
```


### log-helper

This module contains helper functions for logging to the console. Some examples:

* **heading1(heading)**: Log a level-1 heading.
* **heading2(heading)**: Log a level-2 heading.
* **heading3(heading)**: Log a level-3 heading.
* **listProperties(obj)**: Dump an object's properties to the console, using the `getProperties` function from the general-utils module.
* **error(errMsg, err)**: Log and error.

Example:

```javascript
// Display startup banner (and list the current configuration)
tesselKit.logHelper.heading1("B E G I N");
tesselKit.logHelper.listProperties({
  "Climate Port": climatePort,
  "Refresh Rate": refreshRate
});
tesselKit.logHelper.divider1();
```

Renders the following:

```bash
###################################################################
# B E G I N
###################################################################
Refresh Rate=500,
Climate Port=A
###################################################################
```

### general-utils

This module contains some general-purpose helper functions. Some examples:

* **coalesceOnEmpty(value, defaultValue)**: Returns the given `value`, if not empty; otherwise, returns the given `defaultValue`.
* **isEmpty(value)**: Returns true if the given `value` is undefined, null, an empty String or an Object with a length property that's zero (e.g., a zero-length array).
* **getProperties(obj, maxNumProperties)**: Return a String, of the form "propertyName=propertyValue\n", for every property of the given `obj`, or until maxNumProperties has been reached.
* **copyProperties(source, target)**: Copy all properties that are directly owned by the given `source` object (i.e., hasOwnProperty) to the given `target` object.

