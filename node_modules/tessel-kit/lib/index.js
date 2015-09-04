/*!
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ tessel-kit
 ~ --------------------------------------------------------------
 */


/**
 * TesselKit is a collection of utilities, helpers and classes, useful for Tessel app development:
 *    - general-utils (e.g., getArgumentValue)
 *    - log-helper(e.g., heading1, divider1, heading2, divider2, heading3, divider3, listProperties, error)
 *    - tessel-utils (e.g., isValidPort, getPortFromKey, isValidLEDName, getLEDFromName).
 *    - button-mgr: a generic class that manages button events and interprets typical "gestures" (e.g., double-click, long-press, etc).
 *    - led-mgr: work in progress
 *
 * @module tessel-kit
 */
module.exports = (function() {
  "use strict";

  var tesselKitConfig;

  return {
    /**
     * Initialize this module from the commandline and/or config file.
     *
     * @param config JSON data used to configure tessel-kit.
     */
    init: function(config) {
      tesselKitConfig = config === undefined || config === null ? {} : config;
      module.exports.tesselKitConfig = tesselKitConfig;

      module.exports.generalUtils = require("./general-utils");
      module.exports.logHelper = require("./log-helper");
      module.exports.tesselUtils = require("./tessel-utils");

      module.exports.ButtonMgr = require("./classes/button-mgr");
      module.exports.LedMgr = require("./classes/led-mgr");

      return this;
    },

    /** Log a simple header showing details of the current configuration of the TesselKit module. */
    logHeader: function() {
      var logHelper = require("./log-helper");
      logHelper.msg("# TesselKit");
      logHelper.listProperties(tesselKitConfig);

      return logHelper;
    }
  }

})();
