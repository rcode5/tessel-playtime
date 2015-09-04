/*
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ LedMgr WORK IN PROGRESS
 ~ --------------------------------------------------------------
 */



var tesselKit = require("tessel-kit");
var generalUtils = tesselKit.generalUtils;

/**
 * LedMgr is a generic class that manages button events and interprets typical "gestures" (e.g., double-click, long-press, etc).
 * It is expected that this class can be instantiated for multiple buttons attached to the Tessel.
 *
 * The constructor takes the target button event-specification, which must include the following:
 *     - buttonEventFunction: the target button's on-event receiver (e.g., tessel.button.on('press',f) => tessel.button.on).
 *     - buttonObject: the target button object (e.g., tessel.button.on('press',f) => tessel.button).
 *     - pressEventName: (e.g., tessel.button.on('press',f) => 'press').
 *     - releaseEventName: (e.g., tessel.button.on('release',f) => 'release').
 *
 * Here's an example of how to create a LedMgr for the Tessel config button:
 *    var configLedMgr = new tesselKit.LedMgr(config, {
 *      buttonEventFunction: tessel.button.on,
 *      buttonObject: tessel.button,
 *      pressEventName: 'press',
 *      releaseEventName: 'release'
 *    });
 */
module.exports = LedMgr;

// -------------------------------------------------------------------------
// Public/Client functions
// -------------------------------------------------------------------------

/**
 * Constructs a new LedMgr instance for the button specified by btnEventSpec.
 * Uses the tessel-kit config section to initialize the value for the long-press duration in milliseconds (longPressTriggerMillis).
 *
 * @param btnEventSpec specifies the target button event handler (buttonEventFunction) and button object (buttonObject),
 *        so that the LedMgr can hook in and receive 'press' and 'release' events from the button.
 * @constructor
 */
function LedMgr() {
  var self = this;


  LedMgr.prototype = {
    reset: function() {

    }
  }
};

