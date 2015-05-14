/**
 * Created by Ash.Zhang on 2015/5/14.
 */


Moe.module('Form', function (Form, Moe) {
  'use strict';

  var viewProto,
      defaults = {
        layout: 'input',
        name: '',
        className: '',
        disabled: false
      };


  // Control Interface
  // --------------------------

  Form._ControlView = Backbone.ItemView.extend({

    onRender: function () {
      this.setElement(this.$el.html());
    },

    onClick: function () {
      this.model.get('onClick').apply(this, arguments);
    },

    isDisabled: function () {
      return this.get('disabled');
    },

    disable: function () {
      this.set('disabled', true);
    }
  });

  viewProto = Form._ControlView.prototype;


  // Button
  // --------------------------

  Form._ButtonModel = Backbone.Model.extend({

    defaults: _.defaults({
      text: '',
      locale: '',
      icon: ''
    }, defaults)
  });

  Form._ButtonView = Form._ControlView.extend({
    template:
      '<button type="button"' +
        '<% if (name) { %> name="<%= name %>" <% } %>' +
        '<% if (className) { %> class="<%= className %>" <% } %>' +
        '<% if (disabled) { %> disabled <% } %>' +
      '>' +
        '<% if (icon) { %><i class="icon-<%= icon %>"></i><% } %>' +
        '<% if (locale) { %><span data-locale="<%= locale %>"><%= Moe.parseLocale(locale) %></span><% } else { %><span><%= text %></span><% } %>' +
      '</button>',

    events: {
      'click': 'onClick'
    },

    disable: function () {
      viewProto.disable.apply(this, arguments);
      this.$el.prop('disabled', true);
    },

    enable: function () {
      viewProto.enable.apply(this, arguments);
      this.$el.prop('disabled', false);
    }
  });


  // Create a control
  // --------------------------

  Form.createControl = function (options) {
    options = _.defaults({}, options, defaults);

    return new Form['_' + _.capitalize(options.layout) + 'View']({
      model: new Form['_' + _.capitalize(options.layout) + 'Model'](options)
    });
  };
});
