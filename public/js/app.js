/**
 * Created by Ash.Zhang on 2015/5/14.
 */


window.Moe = {

  // Settings
  // --------------------------

  langCode: 'en',

  lang: {

    en: {
      TEST: 'test'
    },

    zh: {
      TEST: '测试'
    }
  },


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
  },


  /**
   * Return a parsed Locale code of current language
   * @param {string} locale
   * @returns {string}
   */
  parseLocale: function (locale) {

    if (!Moe.lang || !Moe.lang[Moe.langCode]) {
      return '';
    } else {
      return Moe.lang[Moe.langCode][locale] || '';
    }
  }
};
