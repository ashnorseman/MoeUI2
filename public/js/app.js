/**
 * Created by Ash.Zhang on 2015/5/14.
 */


(function (global) {

  // Settings
  // --------------------------

  _.setLang('en');


  // API
  // --------------------------

  global.Moe = {


    // Methods
    // --------------------------


    /**
     * Make a module
     * @param {string}    moduleName
     * @param {Function}  moduleMaker
     */
    module: function (moduleName, moduleMaker) {
      'use strict';

      var Module,
          modules;

      // Create a namespace
      // e.g. Moe.Form
      Module = Moe[moduleName] = {};

      // To hold instances
      // e.g. Moe.forms
      modules = Moe[moduleName.toLowerCase() + 's'] = {};

      // Call the maker function
      moduleMaker.call(Module, Module, Moe);
    }
  };
}(window));
