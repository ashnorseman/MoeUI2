/**
 * Created by Ash.Zhang on 2015/5/14.
 */


describe('Button', function () {

  it('creates a button', function () {
    var button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          name: 'btn-name',
          value: 'TEST'
        });

    expect(button.get('layout')).to.be.equal('button');
    expect(button.$el.attr('class')).to.be.equal('gap-v');
    expect(button.$el.attr('name')).to.be.equal('btn-name');
    expect(button.$('.icon-download')).to.be.length(1);
    expect(button.$('span').text()).to.be.equal('TEST');
  });

  it('onClick', function () {
    var spy = sinon.spy(),
        button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          value: 'TEST',
          onClick: spy
        });

    expect(spy).to.be.not.called;
    button.$el.click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall).to.be.calledOn(button);
  });

  it('onClick (string)', function () {
    var button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          value: 'TEST',
          onClick: 'return this;'
        }),
        spy = sinon.spy(button.model.attributes, 'onClick');

    expect(spy).to.be.not.called;
    button.$el.click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall).to.be.calledOn(button);
  });

  it('disable/enable/isDisabled', function () {
    var spy = sinon.spy(),
        button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          value: 'TEST',
          onClick: spy
        });

    expect(spy).to.be.not.called;
    button.$el.click();
    expect(spy).to.be.calledOnce;

    button.disable();
    expect(button.isDisabled()).to.be.ok;
    button.$el.click();
    expect(spy).to.be.calledOnce;

    button.enable();
    expect(button.isDisabled()).to.be.not.ok;
    button.$el.click();
    expect(spy).to.be.calledTwice;
  });
});

describe('Input', function () {

  it('creates a input', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          className: 'gap-v',
          icon: 'search',
          placeholder: 'test',
          value: 'TEST'
        });

    expect(input.get('layout')).to.be.equal('input');
    expect(input.$el.hasClass('gap-v')).to.be.ok;
    expect(input.$('.icon-search')).to.be.length(1);
    expect(input.$(':text').val()).to.be.equal('TEST');
    expect(input.$(':text').attr('placeholder')).to.be.equal('test');
  });

  it('getVal/setVal/clear', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validation: {
            required: true
          }
        });

    expect(input.getVal()).to.be.a('null');
    expect(input.$(':text').val()).to.be.equal('');
    expect(input.isValid()).to.be.not.ok;
    expect(input.$('.control-error-message')).to.be.length(1);

    input.setVal('new');
    expect(input.getVal()).to.be.equal('new');
    expect(input.$(':text').val()).to.be.equal('new');
    expect(input.isValid()).to.be.ok;
    expect(input.$('.control-error-message')).to.be.length(0);

    input.setVal(null);
    expect(input.getVal()).to.be.a('null');
    expect(input.$(':text').val()).to.be.equal('');
    expect(input.isValid()).to.be.not.ok;
    expect(input.$('.control-error-message')).to.be.length(1);

    input.clear();
    expect(input.getVal()).to.be.a('null');
    expect(input.$(':text').val()).to.be.equal('');
    expect(input.$el.hasClass('control-error')).to.be.not.ok;
    expect(input.$('.control-error-message')).to.be.length(0);
  });

  it('onClick & onChange', function () {
    var clickSpy = sinon.spy(),
        changeSpy = sinon.spy(),
        input = Moe.Form.createControl({
          layout: 'input',
          value: 'TEST',
          onClick: clickSpy,
          onChange: changeSpy
        });

    expect(clickSpy).to.be.not.called;
    input.$el.click();
    expect(clickSpy).to.be.calledOnce;
    expect(clickSpy.firstCall).to.be.calledOn(input);

    expect(changeSpy).to.be.not.called;
    input.$(':text').val('changed').trigger('change');
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledOn(input);
  });

  it('onClick (string) & onChange (string)', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: 'TEST',
          onClick: 'return this;',
          onChange: 'return this;'
        }),
        clickSpy = sinon.spy(input.model.attributes, 'onClick'),
        changeSpy = sinon.spy(input.model.attributes, 'onChange');

    expect(clickSpy).to.be.not.called;
    input.$el.click();
    expect(clickSpy).to.be.calledOnce;
    expect(clickSpy.firstCall).to.be.calledOn(input);

    expect(changeSpy).to.be.not.called;
    input.$(':text').val('changed').trigger('change');
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledOn(input);
  });

  it('disable/enable/isDisabled', function () {
    var spy = sinon.spy(),
        input = Moe.Form.createControl({
          layout: 'input',
          value: 'TEST',
          onClick: spy
        });

    expect(spy).to.be.not.called;
    input.$el.click();
    expect(spy).to.be.calledOnce;

    input.disable();
    expect(input.isDisabled()).to.be.ok;
    input.$el.click();
    expect(spy).to.be.calledOnce;

    input.enable();
    expect(input.isDisabled()).to.be.not.ok;
    input.$el.click();
    expect(spy).to.be.calledTwice;
  });

  it('require/unRequire', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validation: {
            required: true
          }
        });

    expect(input.get('validation').required).to.be.ok;
    expect(input.isValid()).to.be.not.ok;
    expect(input.$el.hasClass('control-required')).to.be.ok;

    input.unRequire();
    expect(input.get('validation').required).to.be.not.ok;
    expect(input.isValid()).to.be.ok;
    expect(input.$el.hasClass('control-required')).to.be.not.ok;

    input.require();
    expect(input.get('validation').required).to.be.ok;
    expect(input.isValid()).to.be.not.ok;
    expect(input.$el.hasClass('control-required')).to.be.ok;
  });

  it('show/hide', function () {
    var input = Moe.Form.createControl({
          layout: 'input'
        });

    input.$el.appendTo('body');

    expect(input.$el.is(':visible')).to.be.ok;
    input.hide();
    expect(input.$el.is(':visible')).to.be.not.ok;
    input.show();
    expect(input.$el.is(':visible')).to.be.ok;

    input.remove();
  });

  it('hasChanged', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validation: {
            max: 100
          }
        });

    expect(input.hasChanged()).to.be.not.ok;
    input.setVal(1000);
    expect(input.hasChanged()).to.be.ok;
  });

  it('validate: required', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validation: {
            required: true
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('val');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: maxlength', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: 'aaaaa',
          validation: {
            maxlength: 2
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('a');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: minlength', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: 'a',
          validation: {
            minlength: 2
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('aaaaa');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: max', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: '10',
          validation: {
            max: 2
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('1');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: min', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: '2',
          validation: {
            min: 10
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('20');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: pattern', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: 'abc',
          validation: {
            pattern: '^\\d+$'
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('123');
    expect(input.isValid()).to.be.ok;
  });

  it('validate: format', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          value: 'abc',
          validation: {
            format: 'email'
          }
        });

    expect(input.isValid()).to.be.not.ok;
    input.setVal('a@b.com');
    expect(input.isValid()).to.be.ok;
  });

  it('validateOnCreate', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validateOnCreate: true,
          validation: {
            required: true
          }
        }),
        input2 = Moe.Form.createControl({
          layout: 'input',
          validation: {
            required: true
          }
        });

    expect(input.model.validationError).to.be.ok;
    expect(input2.model.validationError).to.be.not.ok;
  });

  it('errorText', function () {
    var input = Moe.Form.createControl({
          layout: 'input',
          validation: {
            required: true,
            maxlength: 5,
            minlength: 2,
            max: 100,
            min: 1,
            pattern: '^\\d+$',
            format: 'number'
          },
          errorMessage: {
            required: 'required',
            maxlength: 'maxlength',
            minlength: 'minlength',
            max: 'max',
            min: 'min',
            pattern: 'pattern',
            format: 'format'
          }
        });

    expect(input.isValid()).to.be.not.ok;
    expect(_.contains(input.model.errorText(), 'required')).to.be.ok;
    input.setVal('100000');
    expect(_.contains(input.model.errorText(), 'max')).to.be.ok;
    expect(_.contains(input.model.errorText(), 'maxlength')).to.be.ok;
    expect(_.contains(input.model.errorText(), 'min')).to.be.not.ok;
    expect(_.contains(input.model.errorText(), 'minlength')).to.be.not.ok;
  });
});

describe('Password', function () {

  it('creates a password', function () {
    var input = Moe.Form.createControl({
          layout: 'password'
        });

    expect(input.get('layout')).to.be.equal('password');
    expect(input.$('[type=password]')).to.be.length(1);
  });
});

describe('Textarea', function () {

  it('creates a textarea', function () {
    var input = Moe.Form.createControl({
          layout: 'textarea',
          value: 'test'
        });

    expect(input.get('layout')).to.be.equal('textarea');
    expect(input.$('textarea').val()).to.be.equal('test');
  });
});

describe('Number', function () {

  it('creates a number', function () {
    var input = Moe.Form.createControl({
          layout: 'number',
          value: 100
        });

    expect(input.get('layout')).to.be.equal('number');
    expect(input.$(':text').val()).to.be.equal('100');
  });

  it('digits', function () {
    var input = Moe.Form.createControl({
          layout: 'number',
          value: 10,
          digits: 2
        });

    expect(input.$(':text').val()).to.be.equal('10.00');
    input.setVal('20');
    expect(input.$(':text').val()).to.be.equal('20.00');
  });

  it('step', function () {
    var input = Moe.Form.createControl({
          layout: 'number',
          value: 100
        });

    expect(input.getVal()).to.be.equal(100);
    expect(input.$(':text').val()).to.be.equal('100');

    input.$('.number-up').click();
    expect(input.getVal()).to.be.equal(101);
    expect(input.$(':text').val()).to.be.equal('101');

    input.$('.number-down').click();
    expect(input.getVal()).to.be.equal(100);
    expect(input.$(':text').val()).to.be.equal('100');
  });

  it('onChange', function () {
    var input = Moe.Form.createControl({
          layout: 'number'
        });

    input.$(':text').val('123,456.00').trigger('change');
    expect(input.getVal()).to.be.equal(123456);
    input.$(':text').val('abcde').trigger('change');
    expect(input.getVal()).to.be.equal('abcde');
    input.$(':text').val('').trigger('change');
    expect(input.getVal()).to.be.equal(null);
  });

  it('validate', function () {
    var input = Moe.Form.createControl({
          layout: 'number',
          validation: {
            required: false
          }
        });

    input.setVal('abc');
    expect(input.$(':text').val()).to.be.equal('abc');
    expect(input.isValid()).to.be.not.ok;
    expect(input.model.validationError.format).to.be.equal('number');

    input.setVal(123);
    expect(input.$(':text').val()).to.be.equal('123');
    expect(input.isValid()).to.be.ok;
    expect(input.model.validationError).to.be.not.ok;

    input.clear();
    expect(input.getVal()).to.be.equal(null);
    expect(input.$(':text').val()).to.be.equal('');
    expect(input.model.validationError).to.be.not.ok;
  });
});

describe('Checkbox & Radio', function () {

  it('creates a checkbox', function () {
    var input = Moe.Form.createControl({
          layout: 'checkbox',
          value: 'check',
          placeholder: 'Test',
          checked: true
        });

    expect(input.get('layout')).to.be.equal('checkbox');
    expect(input.$(':checkbox').prop('checked')).to.be.equal(true);
    expect(input.$('span').text()).to.be.equal('Test');
  });

  it('creates a radio', function () {
    var input = Moe.Form.createControl({
          layout: 'radio',
          value: 'check',
          placeholder: 'Test',
          checked: true
        });

    expect(input.get('layout')).to.be.equal('radio');
    expect(input.$(':radio').prop('checked')).to.be.equal(true);
    expect(input.$('span').text()).to.be.equal('Test');
  });

  it('getVal/setVal/clear', function () {
    var input = Moe.Form.createControl({
          layout: 'checkbox',
          value: 'check'
        });

    expect(input.getVal()).to.be.equal(false);
    expect(input.$(':checkbox').prop('checked')).to.be.equal(false);
    input.setVal(true);
    expect(input.getVal()).to.be.equal(true);
    expect(input.$(':checkbox').prop('checked')).to.be.equal(true);
    input.clear();
    expect(input.getVal()).to.be.equal(null);
    expect(input.$(':checkbox').prop('checked')).to.be.equal(false);
  });

  it('validate: required', function () {
    var input = Moe.Form.createControl({
          layout: 'checkbox',
          value: 'check',
          validation: {
            required: true
          }
        });

    expect(input.isValid()).to.be.equal(false);
    expect(input.$el.hasClass('control-error')).to.be.ok;
    expect(input.$el.hasClass('control-success')).to.be.not.ok;
    input.setVal(true);
    expect(input.isValid()).to.be.equal(true);
    expect(input.$el.hasClass('control-error')).to.be.not.ok;
    expect(input.$el.hasClass('control-success')).to.be.ok;
    input.clear();
    expect(input.$el.hasClass('control-success')).to.be.not.ok;
    expect(input.$el.hasClass('control-error')).to.be.not.ok;
  });

  it('onChange', function () {
    var spy = sinon.spy(),
        input = Moe.Form.createControl({
          layout: 'checkbox',
          value: 'check',
          onChange: spy
        });

    expect(spy).to.be.not.called;
    input.$(':checkbox').prop('checked', true).trigger('change');
    expect(spy).to.be.calledOnce;
    expect(spy).to.be.calledOn(input);
    input.$(':checkbox').prop('checked', false).trigger('change');
    expect(spy).to.be.calledTwice;
  });
});
