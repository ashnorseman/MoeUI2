/**
 * Created by Ash.Zhang on 2015/5/14.
 */


Moe.module('Form', function (Form, Moe) {
  'use strict';

  var dateTimeLayouts = ['date', 'hour', 'time'],
      callbackList = ['onClick', 'onChange'],
      defaults = {
        className: '',
        disabled: false,
        name: ''
      },
      initialize = function (options) {
        options || (options = {});

        // locale -> text
        if (this.get('locale')) this.set('value', _.parseLocale(this.get('locale')));

        // Callbacks can be saved as string
        _.each(options, function (value, key) {
          if (_.contains(callbackList, key) && _.isString(value)) {
            this.set(key, new Function(options[key]));
          }
        }, this);
      };


  // Button
  // --------------------------

  Form._ButtonModel = Backbone.Model.extend({

    defaults: _.extend({}, defaults, {
      layout: 'button',
      icon: '',
      locale: '',
      value: ''
    }),

    initialize: function (options) {
      initialize.apply(this, arguments);
    }
  });

  Form._ButtonView = Backbone.ItemView.extend({
    template:
      '<button type="button"' +
        '<% if (name) { %> name="<%= name %>"<% } %>' +
        '<% if (className) { %> class="<%= className %>"<% } %>' +
        '<% if (disabled) { %> disabled<% } %>' +
      '>' +
        '<% if (icon) { %><i class="icon-btn icon-<%= icon %>"></i><% } %>' +
        '<span' +
          '<% if (locale) { %> data-locale="<%= locale %>"<% } %>' +
        '><%= value %></span>' +
      '</button>',

    events: {
      'click': 'onClick'
    },

    onRender: function () {
      this.setElement(this.$el.html());
    },


    // DOM Events
    // --------------------------

    // Will not trigger events when disabled
    onClick: function () {
      if (this.isDisabled()) return;
      if (_.isFunction(this.get('onClick'))) this.get('onClick').apply(this, arguments);
    },


    // API
    // --------------------------

    isDisabled: function () {
      return this.get('disabled');
    },

    disable: function () {
      this.set('disabled', true);
      this.$el.prop('disabled', true);
    },

    enable: function () {
      this.set('disabled', false);
      this.$el.prop('disabled', false);
    }
  });


  // Input
  // --------------------------

  Form._InputModel =
  Form._PasswordModel =
  Form._TextareaModel =
  Backbone.Model.extend({

    defaults: _.extend({}, defaults, {
      layout: 'input',
      errorMessage: null,
      icon: '',
      locale: '',
      placeholder: '',
      placeLocale: '',
      value: null,
      validateOnCreate: false,
      validation: null
    }),

    initialize: function (options) {
      initialize.apply(this, arguments);

      if (this.get('placeLocale')) this.set('placeholder', _.parseLocale(this.get('placeLocale')));
    },


    getVal: function () {
      return this.get('value');
    },


    /**
     * Generate error messages according to `validationError` and self-defined `errorMessage`
     * @returns {Array}
     */
    errorText: function () {
      var errorMessage = this.get('errorMessage') || {},
          isDate = _.contains(dateTimeLayouts, this.get('layout'));

      return _.map(this.validationError, function (err, type) {
        if (errorMessage[type]) return errorMessage[type];
        return _.template(_.parseLocale('ERR_' + type.toUpperCase() + (isDate ? '_DATE': '')))(this.validationError);
      }, this);
    },


    /**
     * Validate model
     * @param {Object} attr
     * @returns {*}
     */
    validate: function (attr) {
      var validation = this.get('validation'),
          value = this.getVal(),
          err;

      // Neither `valid` nor `invalid`
      if (!_.isPureObject(validation)) return;

      // `required` has the highest priority
      if (validation.required && this.failRequired(value)) return { required: true };

      // Only check others when value is existy
      if (_.notEmpty(value)) {

        err = _.pick(validation, function (limit, item) {
          var method = this['fail' + _.capitalize(item)];
          return (method && method(value, limit));
        }, this);

        if (!_.isEmpty(err)) return err;
      }

      // All test passed
      this.trigger('valid');
    },

    failRequired: function (value) {
      return !_.notEmpty(value) || value === false;
    },

    failMax: function (value, max) {
      return _.num(value) > _.num(max);
    },

    failMin: function (value, min) {
      return _.num(value) < _.num(min);
    },

    failMaxlength: function (value, maxlength) {
      return value.toString().length > maxlength;
    },

    failMinlength: function (value, minlength) {
      return value.toString().length < minlength;
    },

    failPattern: function (value, patStr) {
      return !(new RegExp(patStr).test(value));
    },

    failFormat: function (value, format) {
      var patStr;

      switch (format) {
      case 'email':
        patStr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        break;
      case 'money':
        patStr = /^[+-]?[0-9]+(\.\d{1,2})?$/;
        break;
      case 'number':
        patStr = /^-?(\d{0,3}(\,\d{3})*|(\d*))(\.\d+)?$/;
        break;
      case 'idCard':
        patStr = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        break;
      case 'tel':
        patStr = /^[\d-]+$/g;
        break;
      case 'url':
        patStr = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/g;
        break;
      }

      return !(patStr.test(value));
    }
  });


  Form._NumberModel = Form._InputModel.extend({

    defaults: {
      text: '',
      digits: null,
      step: 1
    },

    initialize: function (options) {
      this._super('initialize', arguments);
      this.set({
        validation: _.extend({}, this.get('validation'), { format: 'number' }),
        errorMessage: _.extend({}, this.get('errorMessage'), { format: _.parseLocale('ERR_FORMAT_NUMBER') })
      });
      this.formatNumber();
      this.on('change:value', this.formatNumber);
    },

    formatNumber: function () {
      var text;

      if (!_.notEmpty(this.get('value'))) return this.set('text', '');

      text = _.formatNumber(this.get('value'), this.get('digits'));
      this.set('text', text !== '' ? text : this.get('value'));
    }
  });


  Form._CheckboxModel =
  Form._RadioModel = Form._InputModel.extend({

    defaults: {
      checked: false
    },


    // Overwrite
    // --------------------------

    getVal: function () {
      return this.get('checked');
    }
  });


  Form._PasswordView =
  Form._InputView =
  Backbone.ItemView.extend({
    template:
      '<div class="control-input' +
        '<% if (className) { %> <%= className %><% } %>' +
        '<% if (icon) { %> control-input-icon<% } %>' +
        '<% if (validation && validation.required) { %> control-required<% } %>"' +
      '>' +
        '<input type="<%= layout === \'input\' ? \'text\' : \'password\' %>"' +
          '<% if (name) { %> name="<%= name %>"<% } %>' +
          '<% if (_.exists(value)) { %> value="<%= value %>"<% } %>' +
          '<% if (placeholder) { %> placeholder="<%= placeholder %>"<% } %>' +
          '<% if (placeLocale) { %> data-locale-placeholder="<%= placeLocale %>"<% } %>' +
          '<% if (disabled) { %> disabled <% } %>' +
        '>' +
        '<% if (icon) { %><i class="icon-<%= icon %>"></i><% } %>' +
      '</div>',

    events: {
      'click': 'onClick',
      'change :input': 'onChange'
    },

    modelEvents: {
      valid: 'showValid',
      invalid: 'showInvalid'
    },


    onRender: function () {
      this.setElement(this.$el.html());
      this.modelShortcut(['getVal', 'isValid', 'hasChanged']);
      if (this.get('validateOnCreate')) this.isValid();
    },


    // DOM Events
    // --------------------------

    onChange: function (e) {
      this.setVal($.trim(e.target.value), { updateView: false });
      if (_.isFunction(this.get('onChange'))) this.get('onChange').apply(this, arguments);
    },

    // Will not trigger events when disabled
    onClick: function () {
      if (this.isDisabled()) return;
      if (_.isFunction(this.get('onClick'))) this.get('onClick').apply(this, arguments);
    },


    // Model Events
    // --------------------------

    showValid: function () {
      var $el = this.$el.removeClass('control-error').addClass('control-success');

      setTimeout(function () {
        $el.removeClass('control-success').addClass('control-success');
      }, 0);
      this.$('.control-error-message').remove();
    },

    showInvalid: function () {
      var $el = this.$el.removeClass('control-success').addClass('control-error');

      setTimeout(function () {
        $el.removeClass('control-error').addClass('control-error');
      }, 0);
      this.$('.control-error-message').remove();

      $('<p></p>', {
        'class': 'control-error-message',
        html: this.model.errorText().join('<br>')
      }).appendTo($el);
    },


    // API
    // --------------------------

    setVal: function (val, options) {
      options || (options = {});
      this.set('value', val, options);
      if (options.validate !== false) this.isValid();
      if (options.updateView !== false) this.updateView();
    },

    clear: function () {
      this.setVal(null, { validate: false });
      this.model.validationError = null;
      this.$el.removeClass('control-success control-error');
      this.$('.control-error-message').remove();
    },

    updateView: function () {
      this.$(':text').val(this.getVal());
    },

    isDisabled: function () {
      return this.get('disabled');
    },

    disable: function () {
      this.set('disabled', true);
      this.$el.addClass('control-disabled');
      this.$(':text').prop('disabled', true);
    },

    enable: function () {
      this.set('disabled', false);
      this.$el.removeClass('control-disabled');
      this.$(':text').prop('disabled', false);
    },

    require: function () {
      this.set('validation', _.extend({}, this.get('validation'), { required: true }));
      this.$el.addClass('control-required');
    },

    unRequire: function () {
      this.set('validation', _.extend({}, this.get('validation'), { required: false }));
      this.$el.removeClass('control-required');
    },

    show: function () {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    }
  });


  Form._TextareaView = Form._InputView.extend({
    template:
      '<div class="control-textarea' +
        '<% if (className) { %> <%= className %><% } %>' +
        '<% if (validation && validation.required) { %> control-required<% } %>"' +
      '>' +
        '<textarea' +
          '<% if (name) { %> name="<%= name %>"<% } %>' +
          '<% if (placeholder) { %> placeholder="<%= placeholder %>"<% } %>' +
          '<% if (placeLocale) { %> data-locale-placeholder="<%= placeLocale %>"<% } %>' +
          '<% if (disabled) { %> disabled <% } %>' +
        '>' +
          '<% if (_.exists(value)) { %><%= value %><% } %>' +
        '</textarea>' +
      '</div>'
  });

  Form._NumberView = Form._InputView.extend({
    template:
      '<div class="control-number' +
         '<% if (className) { %> <%= className %><% } %>' +
         '<% if (validation && validation.required) { %> control-required<% } %>"' +
      '">' +
        '<input type="text" value="<%= text %>"' +
          '<% if (name) { %> name="<%= name %>"<% } %>' +
          '<% if (placeholder) { %> placeholder="<%= placeholder %>"<% } %>' +
          '<% if (placeLocale) { %> data-locale-placeholder="<%= placeLocale %>"<% } %>' +
          '<% if (disabled) { %> disabled <% } %>' +
        '>' +
        '<button type="button" class="btn-white btn-icon number-up"<% if (disabled) { %> disabled <% } %>><i class="icon-arrow-caret-up number-icon"></i></button>' +
        '<button type="button" class="btn-white btn-icon number-down"<% if (disabled) { %> disabled <% } %>><i class="icon-arrow-caret-down number-icon"></i></button>' +
      '</div>',

    events: {
      'click .number-up': 'add',
      'click .number-down': 'subtract'
    },


    // Dom events
    // --------------------------


    // '1,234,567'  ->  1234567
    // 'abc'        ->  'abc'
    // ''           ->  null
    onChange: function (e) {
      var val = $.trim(e.target.value),
          number = _.notEmpty(val) ? _.parseNumber(val) : null;

      this.setVal(_.isNaN(number) ? val : number);
      if (_.isFunction(this.get('onChange'))) this.get('onChange').apply(this, arguments);
    },

    add: function () {
      this.step(this.get('step'));
    },

    subtract: function () {
      this.step(-this.get('step'));
    },


    // Overwrite
    // --------------------------

    updateView: function () {
      this.$(':text').val(this.get('text'));
    },


    // API
    // --------------------------

    step: function (step) {

      if (!_.isNaN(+this.getVal())) {
        this.setVal(+this.getVal() + step);
        this.$(':text').trigger('change');
      }
    }
  });


  Form._CheckboxView =
  Form._RadioView = Form._InputView.extend({
    template:
      '<label class="control-check' +
        '<% if (className) { %> <%= className %><% } %>' +
        '<% if (validation && validation.required) { %> control-required<% } %>"' +
      '">' +
        '<input type="<%= layout %>"' +
          '<% if (name) { %> name="<%= name %>"<% } %>' +
          '<% if (_.exists(value)) { %> value="<%= value %>"<% } %>' +
          '<% if (checked) { %> checked<% } %>' +
          '<% if (disabled) { %> disabled<% } %>' +
        '><span' +
            '<% if (placeLocale) { %> data-locale-placeholder="<%= placeLocale %>"<% } %>' +
          '><%= placeholder %></span>' +
      '</label>',


    // Dom events
    // --------------------------

    onChange: function (e) {
      this.setVal(e.target.checked, { updateView: false });
      if (_.isFunction(this.get('onChange'))) this.get('onChange').apply(this, arguments);
    },


    // Overwrite
    // --------------------------

    getVal: function () {
      return this.get('checked');
    },

    setVal: function (val, options) {
      options || (options = {});
      this.set('checked', val, options);
      if (options.validate !== false) this.isValid();
      if (options.updateView !== false) this.updateView();
    },

    updateView: function () {
      this.$(':input').prop('checked', this.getVal());
    }
  });


  // Create a control
  // --------------------------

  Form.createControl = function (options) {
    if (!options || !options.layout) return _.error('No layout');

    return new Form['_' + _.capitalize(options.layout) + 'View']({
      model: new Form['_' + _.capitalize(options.layout) + 'Model'](options)
    }).render();
  };


  // Language
  // --------------------------

  _.addLang({

    en: {

      // Form error message
      ERR_REQUIRED: '请输入必填项',
      ERR_MAXLENGTH: '最多输入 <%= maxlength %> 个字符',
      ERR_MINLENGTH: '至少输入 <%= minlength %> 个字符',
      ERR_MAX: '所填数字不能大于 <%= max %>',
      ERR_MIN: '所填数字不能小于 <%= min %>',
      ERR_MAX_DATE: '日期不能晚于 <%= _.formatTime(max, "YYYY-MM-DD HH:mm") %>',
      ERR_MIN_DATE: '日期不能早于 <%= _.formatTime(min, "YYYY-MM-DD HH:mm") %>',
      ERR_FORMAT: '格式不正确',
      ERR_FORMAT_NUMBER: '不是正确的数字格式',
      ERR_PATTERN: '不符合指定格式：<%= pattern %>'
    },

    zh: {

      // Form error message
      ERR_REQUIRED: 'Please fill in the required field.',
      ERR_MAXLENGTH: 'No more than <%= maxlength %> characters.',
      ERR_MINLENGTH: 'At least <%= minlength %> characters.',
      ERR_MAX: 'The number must be less than <%= max %>.',
      ERR_MIN: 'The number must be more than <%= min %>.',
      ERR_MAX_DATE: 'Date must be earlier than <%= _.formatTime(max, "YYYY-MM-DD HH:mm") %>.',
      ERR_MIN_DATE: 'Date must be later than <%= _.formatTime(min, "YYYY-MM-DD HH:mm") %>.',
      ERR_FORMAT: 'Wrong format.',
      ERR_FORMAT_NUMBER: 'Not valid number.',
      ERR_PATTERN: 'Please follow the required format: <%= pattern %>'
    }
  });
});
