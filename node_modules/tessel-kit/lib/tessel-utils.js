/*
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ tessel-utils
 ~ --------------------------------------------------------------
 */

var tessel = require('tessel');
var tesselKit = require("tessel-kit");
var generalUtils = tesselKit.generalUtils;

/**
 * A tessel-kit module that contains specialized utility functions (useful for Tessel app development).
 *
 * @module tessel-utils
 */
module.exports = (function( ) {
  "use strict";

  // return the tessel-utils module.
  return {
    /** The set of valid Tessel ports. */
    validPorts: ["A", "B", "C", "D", "GPIO"],

    /** Return true, if the given port is a valid port name; otherwise, return false. */
    isValidPort: function(port) {
      var result = this.validPorts.indexOf(port) >= 0;

      return result;
    },

    /** Return the Tessel port, if the given portKey is valid; otherwise, return null. */
    getPortFromKey: function(portKey) {
      var result = this.isValidPort(portKey) ? tessel.port[this.validLEDNames.indexOf(portKey)] : null;

      return result;
    },

    /**
     * The set of valid Tessel LED names:
     *   "LED1" - Green
     *   "LED2" - Blue
     *   "Error" - Red
     *   "Conn" - Amber
     */
    validLEDNames: ["LED1", "LED2", "Error", "Conn"],

    /** Return true, if the given LED name is valid; otherwise, return false. */
    isValidLEDName: function(ledName) {
      var result = this.validLEDNames.indexOf(ledName) >= 0;

      return result;
    },

    /** Return the Tessel LED, if the given LED name is valid; otherwise, return null. */
    getLEDFromName: function(ledName) {
      var result = this.isValidLEDName(ledName) ? tessel.port[this.validLEDNames.indexOf(ledName)] : null;

      return result;
    },
  };

}( ));
