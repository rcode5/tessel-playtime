/*
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ ButtonMgr
 ~ --------------------------------------------------------------
 */

var tesselKit = require("tessel-kit");
var generalUtils = tesselKit.generalUtils;

/**
 * ButtonMgr is a generic class that manages button events and interprets typical "gestures" (e.g., double-click, long-press, etc).
 * It is expected that this class can be instantiated for multiple buttons attached to the Tessel.
 *
 * The constructor takes the target button event-specification, which must include the following:
 *     - buttonEventFunction: the target button's on-event receiver (e.g., tessel.button.on('press',f) => tessel.button.on).
 *     - buttonObject: the target button object (e.g., tessel.button.on('press',f) => tessel.button).
 *     - pressEventName: (e.g., tessel.button.on('press',f) => 'press').
 *     - releaseEventName: (e.g., tessel.button.on('release',f) => 'release').
 *
 * Here's an example of how to create a ButtonMgr for the Tessel config button:
 *    var configButtonMgr = new tesselKit.ButtonMgr(config, {
 *      buttonEventFunction: tessel.button.on,
 *      buttonObject: tessel.button,
 *      pressEventName: 'press',
 *      releaseEventName: 'release'
 *    });
 *    configButtonMgr.onLongPress(function(){console.log("The Tessel config button was 'long-pressed'.")});
 */
module.exports = ButtonMgr;

// -------------------------------------------------------------------------
// Public/Client functions
// -------------------------------------------------------------------------

/**
 * Constructs a new ButtonMgr instance for the button specified by btnEventSpec.
 * Uses the tessel-kit config section to initialize the value for the long-press duration in milliseconds (longPressTriggerMillis).
 *
 * See:https://tessel.io/docs/hardwareAPI
 *
 * @param btnEventSpec specifies the target button event handler (buttonEventFunction) and button object (buttonObject),
 *        so that the ButtonMgr can hook in and receive 'press' and 'release' events from the button.
 *        btnEventSpec {
 *          buttonObject:  Tessel button object - Tessel has two buttons.
 *                          The reset button (nearer to the edge of the board) will stop running any program that is currently executing and restart the microcontroller (erasing any memory in RAM).
 *                          The config button will eventually be used for other purposes but is currently a simple way to get user feedback into a script
 *          buttonEventFunction:function(buttonObject, pressEventName,
 *          pressEventName:
 *          releaseEventName:
 *          }
 *
 * @constructor
 */
function ButtonMgr(btnEventSpec) {
  var self = this;

  // initialize event handlers
  var buttonEventFunction = btnEventSpec.buttonEventFunction;
  var buttonObject = btnEventSpec.buttonObject;
  buttonEventFunction.call(buttonObject, btnEventSpec.pressEventName, function(time) {
    ButtonMgr.prototype._processButtonPress.call(self, time)
  });
  buttonEventFunction.call(buttonObject, btnEventSpec.releaseEventName, function(time) {
    ButtonMgr.prototype._processButtonRelease.call(self, time)
  });
}

ButtonMgr.prototype = {
  // registry for observers of "short-press" events
  onShortPressCallbackRegistry: {},

  // registry for observers of "long-press" events
  onLongPressCallbackRegistry: {},

  // registry for observers of "double-press" events
  onDoublePressCallbackRegistry: {},

  eventDetection: {
    // the minimum time a button must be depressed, inorder for a "long-press" event to be generated
    longPressTriggerMillis: generalUtils.coalesceOnEmpty(tesselKit.tesselKitConfig.longPressTriggerMillis, 2000),

    // records the time the button was pressed
    onPressStartTime: 0,

    // records the time the button was pressed
    onPressDurationMillis: 0,

    // count the times the button has been pressed, during a detection phase
    onReleaseCount: 0,

    reset: function() {
      this.onPressStartTime = 0;
      this.onReleaseCount = 0;
      this.onPressDurationMillis = 0;
    },

    recordPress: function(time) {
      this.onPressStartTime = time;
      console.log("recordPress:"+this.onPressStartTime+", onReleaseCount:"+this.onReleaseCount);
    },

    recordRelease: function(time) {
      this.onReleaseCount++;

      if (this.onPressStartTime == 0) { // @-@:p0 BUG! Why is this 0?
        this.onPressDurationMillis = 0;
        console.log("@-@:p0 BUG! Why is this 0?");
      } else {
        this.onPressDurationMillis = (time - this.onPressStartTime)/1000;
        this.onPressStartTime = 0;
      }
    },

    isLongPress: function() {
      console.log("isLongPress:"+this.onPressDurationMillis+">"+this.longPressTriggerMillis+"?");
      return this.onPressDurationMillis > this.longPressTriggerMillis;
    }
  },

  /**
   * Register for notification on "short-press" events.
   * Each time a "short-press" event occurs, all registered observers will be notified.
   *
   * @param observer the entity to be notified when a "short-press" event occurs.
   */
  onShortPress: function(observer) {
    this.onShortPressCallbackRegistry[observer] = observer;
  },

  /**
   * Register for notification on "long-press" events.
   * Each time a "long-press" event occurs, all registered observers will be notified.
   *
   * @param observer the entity to be notified when a "long-press" event occurs.
   */
  onLongPress: function(observer) {
    this.onLongPressCallbackRegistry[observer] = observer;
  },

  /**
   * Register for notification on "doube-press" events.
   * Each time a "doube-press" event occurs, all registered observers will be notified.
   *
   * @param observer the entity to be notified when a "doube-press" event occurs.
   */
  onDoublePress: function(observer) {
    this.onDoublePressCallbackRegistry[observer] = observer;
  },

  // ------------------------------------------------------
  // Implementation
  // ------------------------------------------------------

  /**
   * Handle the button-press event generated by the button associated with this ButtonMgr instance.
   *
   * @param time the time of the button-down event.
   */
  _processButtonPress: function(time) {
    this.eventDetection.recordPress(time);
  },

  /**
   * Handle the button-release event generated by the button associated with this ButtonMgr instance.
   *
   * @param time the time of the button-up event.
   */
  _processButtonRelease: function(time) {
    var self = this;
    self.eventDetection.recordRelease(time);

    if (self.eventDetection.isLongPress()) {
      // this is a "long-press" -  reset detection states and notify the "long-press" observers
      self.eventDetection.reset();
      self._notifyObservers(self.onLongPressCallbackRegistry);
    } else {
      if (self.eventDetection.onReleaseCount >= 2) {
        // this is a double-press (or more) event, so notify the "double-press" observers
        self.eventDetection.reset();
        self._notifyObservers(self.onDoublePressCallbackRegistry);
      }

      setTimeout(function(){
        if (self.eventDetection.onReleaseCount == 1) {
          // second press did not occur within the allotted time, so notify the "short-press" observers
          self.eventDetection.reset();
          self._notifyObservers(self.onShortPressCallbackRegistry);
        }
      }, 300); // @-@:p0 make this configurable?
    }
  },

  _notifyObservers: function(onPressRegistry) {
    console.log("_notifyObservers:"+onPressRegistry);
    for (var key in onPressRegistry) {
      onPressRegistry[key](); // call observer
    }
  },
}

