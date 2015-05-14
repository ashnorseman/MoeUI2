/**
 * Created by Ash.Zhang on 2015/5/14.
 */


describe('Button', function () {

  it('creates a button', function () {
    var button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          text: 'TEST'
        });

    button.$el.appendTo('body');

    expect(button.get('layout')).to.be.equal('button');
    expect(button.$el.attr('class')).to.be.equal('gap-v');
    expect(button.$('.icon-download')).to.be.length(1);
    expect(button.$('span').text()).to.be.equal('TEST');

    button.remove();
  });

  it('onClick', function () {
    var spy = sinon.spy(),
        button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          text: 'TEST',
          onClick: spy
        });

    button.$el.appendTo('body');

    expect(spy).to.be.not.called;
    button.$el.click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall).to.be.calledOn(button);

    button.remove();
  });

  it('disable/enable/isDisabled', function () {
    var spy = sinon.spy(),
        button = Moe.Form.createControl({
          layout: 'button',
          className: 'gap-v',
          icon: 'download',
          text: 'TEST',
          onClick: spy
        });

    button.$el.appendTo('body');

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

    button.remove();
  });
});
