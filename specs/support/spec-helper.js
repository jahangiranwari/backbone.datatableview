//Custom global matchers

beforeEach(function () {
    var matchers = {
      toBeInstanceOf: function (expected) {
        return this.env.equals_(this.actual, jasmine.any(expected));
      },
      toBeOfType: function (type) {
        return (typeof this.actual === type);
      }
    };
    this.addMatchers(matchers);
});

jasmine.getFixtures().fixturesPath = (window.location.hostname) ? 'fixtures' : 'specs/fixtures';