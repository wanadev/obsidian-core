"use strict";

var expect = require("expect.js");
var Class = require("abitbol");
var classUtils = require("../../helpers/class-utils");

describe("obsidian-core/helpers/class-utils", function() {

    it("getter/setter can get and set values to/from a property of an Abitbol class", function() {
        var TestClass = Class.$extend({
            __init__: function() {
                this.$data.prop1 = "prop1";
                this.$data.prop2 = null;
            },

            getProp1: classUtils.getter,

            getprop2: classUtils.getter,
            setprop2: classUtils.setter
        });

        var test = new TestClass();

        expect(test.prop1).to.equal("prop1");
        expect(test.prop2).to.be(null);

        test.prop2 = "prop2";

        expect(test.prop2).to.equal("prop2");
    });

    it("applyProperties can apply properties to an Abitbol class", function() {
        var TestClass = Class.$extend({
            __init__: function() {
                this.$data.prop1 = "prop1";
            },

            getProp1: classUtils.getter,
            setprop1: classUtils.setter,

            prop2: "prop2"
        });

        var test = new TestClass();

        expect(test.prop1).to.equal("prop1");
        expect(test.prop2).to.equal("prop2");

        classUtils.applyProperties(test, {
            prop1: "a",
            prop2: "b",
        });

        expect(test.prop1).to.equal("a");
        expect(test.prop2).to.equal("prop2");
    });

});
