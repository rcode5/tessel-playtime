/*
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ general-utils
 ~ --------------------------------------------------------------
 */

/**
 * A tessel-kit module that provides general purpose utility functions.
 *
 * @module general-utils
 */
module.exports = (function( ) {
  "use strict";

  // cache the commandline arguments
  var argMap = {};
  var args = process.argv.slice(2);

  if (args != null && args.length > 0) {
    var numArgs = args.length;

    for (var i = 0; i < numArgs; i++) {
      var keyValue = args[i];
      var key = keyValue.substr(0,keyValue.indexOf('='));
      var value = keyValue.substr(keyValue.indexOf('=')+1);

      argMap[key] = value;
    }
    args = null;
  }

  return {
    /**
     * Returns the given <code>value</code>, if not empty; otherwise, returns the given <code>defaultValue</code>.
     */
    coalesceOnEmpty: function( value, defaultValue ) {
      var result = this.isEmpty( value ) ? defaultValue : value;

      return result;
    },

    /**
     * Returns the given <code>value</code>, if not null or undefined; otherwise, returns the given <code>defaultValue</code>.
     */
    coalesceOnNull: function(value, defaultValue) {
      var result = value === undefined || value === null ? defaultValue : value;

      return result;
    },

    /**
     * Returns true if the given value is undefined, null, an empty String or an Object with a
     * length property that's zero (e.g., a zero-length array).
     *
     * @param value to be tested
     * @returns {boolean|*}
     */
    isEmpty: function( value ) {
      var result = (value === undefined || value === null || value === "" || (value.hasOwnProperty("length") && value.length == 0));

      return result;
    },

    /**
     * Inverse of isEmpty.
     *
     * @param value to be tested
     * @returns {boolean|*}
     */
    isNotEmpty: function( value ) {
      return !this.isEmpty( value );
    },

    /**
     * Return a String, of the form "propertyName = propertyValue\n", for every property of the given obj, or until
     * maxNumProperties has been reached.
     *
     * @param obj object to retrieve the properties from.
     * @param maxNumProperties optional limiter for the number of properties to retrieve.
     * @returns {string} new-line separated set of property/value pairs
     */
    getProperties: function(obj, maxNumProperties) {
      var result = "";

      maxNumProperties = maxNumProperties === undefined ? Number.MAX_VALUE : maxNumProperties;

      if (obj !== undefined && obj !== null) {
        var separator = "";

        var propCount = 0;
        for (var propertyName in obj) {
          var objValue;

          if ((obj[propertyName]) === undefined) {
            objValue = "*** undefined ***";
          } else {
            objValue = obj[propertyName];
          }

          result += separator + propertyName + " = " + objValue;
          separator = ",\n";
          propCount++;

          if (propCount >= maxNumProperties) {
            break;
          }
        }
      }

      return result;
    },

    /**
     * Copy all properties that are directly owned by the given source object (i.e., hasOwnProperty) to the given target object.
     *
     * @param source object to copy methods and properties from.
     * @param target object to copy methods and properties to.
     */
    copyProperties: function(source, target) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    },

    /**
     * Returns true if the given value is a number.
     * See: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
     *
     * @param value
     * @returns {boolean|*}
     */
    isNumber: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Return the commandline argument specified by argumentName. If not found, then return the specified defaultValue.
     *
     * Example commandline:
     *   "tessel run app/app.js climatePort=A foo=1.23 bar=4.56"
     *
     * Example Usages (for the commandline shown above):
     *   // returns "1.23"
     *   tesselKit.tesselUtils.getArgumentValue("foo", "asdfgh");
     *
     *   // returns "qwerty"
     *   tesselKit.tesselUtils.getArgumentValue("test", "qwerty");
     */
    getArgumentValue: function(argumentName, defaultValue) {
      var result = argMap[argumentName];

      if (this.isEmpty(result) && this.isNotEmpty(defaultValue)) {
        if (typeof defaultValue === 'object') {
          result = defaultValue[argumentName];
        } else {
          result = defaultValue;
        }
      }

      return result;
    }
  };

}( ));
