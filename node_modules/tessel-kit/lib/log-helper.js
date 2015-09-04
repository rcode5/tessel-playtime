/*!
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ log-helper
 ~ --------------------------------------------------------------
 */

var tesselKit = require("tessel-kit");
var generalUtils = tesselKit.generalUtils;

/**
 * A tessel-kit module that contains helper functions for logging to the console.
 *
 * @module log-helper
 */
module.exports = (function() {
  "use strict";

  // get the optional 'logHelperEnabled' property from either the commandline or the config file and if not found, then default to true.
  var enabled = generalUtils.coalesceOnEmpty(generalUtils.getArgumentValue("logHelperEnabled", tesselKit.tesselKitConfig), true);

  return {
    /** Return true, if logging (via log-helper) is enabled; otherwise, return false. */
    isEnabled: function() {
      return enabled;
    },

    /** Enable log-helper logging to console. */
    enable: function() {
      enabled = true;
    },

    /** Disable log-helper logging to console. */
    disable: function() {
      enabled = false;
    },

    /**
     * Log a message to the console.
     *
     * @param msg - the message to be logged.
     */
    msg: function(msg) {
      doLog(msg);
    },

    /**
     * Log a level-1 heading.
     *
     * @param heading - the heading text.
     */
    heading1: function(heading) {
      doLog('###################################################################');
      doLog("# " + heading);
      doLog('###################################################################');
    },

    /**
     * Logs a level-1 divider.
     */
    divider1: function() {
      doLog('###################################################################');
    },

    /**
     * Log a level-2 heading.
     *
     * @param heading - the heading text.
     */
    heading2: function(heading) {
      doLog('===================================================================');
      doLog("= " + heading);
      doLog('===================================================================');
    },

    /**
     * Logs a level-2 divider.
     */
    divider2: function() {
      doLog('===================================================================');
    },

    /**
     * Log a level-3 heading.
     *
     * @param heading - the heading text.
     */
    heading3: function(heading) {
      doLog('-------------------------------------------------------------------');
      doLog("- " + heading);
      doLog('-------------------------------------------------------------------');
    },

    /**
     * Logs a level-3 divider.
     */
    divider3: function() {
      doLog('-------------------------------------------------------------------');
    },


    /**
     * Logs a String, of the form "propertyName=propertyValue\n", for every property of the given obj.
     *
     * @param title optional title to log above the property listing.
     * @param obj object to retrieve the properties from.
     */
    listProperties: function(title, obj) {
      if (arguments.length == 2) {
        this.msg(title);
      } else {
        obj = title;
      }
      doLog(generalUtils.getProperties(obj));
    },

    /**
     * Log an error message.
     */
    error: function(errMsg, err) {
      this.newline();
      doLog('*******************************************************************');
      doLog('* ERROR                                                           *');
      doLog('*******************************************************************');

      if (generalUtils.isEmpty(err)) {
        doLog(errMsg);
      } else {
        doLogError(errMsg, err);
      }
      this.newline();
    },

    /**
     * Log a new line.
     */
    newline: function() {
      doLog("");
    }
  };

  // -----------------------------------
  // Private functions
  // -----------------------------------

  function doLog(msg) {
    if (enabled) {
      console.log(msg);
    }
  }

  function doLogError(msg, err) {
    if (enabled) {
      console.log(msg, err);
    }
  }
})();
