/* jshint node:true, mocha:true */

"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe("Navigation", function() {

  beforeEach(function() {
    var url = "http://localhost:8080/";
    browser.get(url);

    // Wait for the board to be present
    browser.wait(function() {
      return browser.isElementPresent(by.css(".navigation"));
    });
  });

  it("should set the document.title", function() {
    expect(browser.executeScript("return document.title;"))
      .to.eventually.equal("Test proj");
  });

  it("should navigate to about page", function(){
    var el = element(by.css(".navAbout"));
    el.click();
    expect(element.all(by.css('.about-page')).count())
    .to.eventually.equal(1);
  })

  it("should navigate back to home page", function(){
    var el = element(by.css(".navHome"));
    el.click();
    expect(element.all(by.css('.home-page')).count())
    .to.eventually.equal(1);
  })

});
