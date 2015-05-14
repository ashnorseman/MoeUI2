/**
 * Created by Ash.Zhang on 2015/5/14.
 */


describe('app', function () {

  it('.module', function () {
    var moduleMaker = sinon.spy();

    Moe.module('Mod', moduleMaker);

    expect(Moe.Mod).to.be.an('object');
    expect(Moe.mods).to.be.deep.equal({});
    expect(moduleMaker).to.be.calledOn(Moe.Mod);
    expect(moduleMaker).to.be.calledWith(Moe.Mod, Moe);
  });
});
