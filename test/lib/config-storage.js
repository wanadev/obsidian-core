"use strict";

var expect = require("expect.js");
var uuid = require("uuid");

var ConfigStorage = require("../../lib/config-storage");

describe("obsidian-core/lib/config-storage", function() {

    it("can get / set a value", function() {
        var config = new ConfigStorage("testConfigStorage");
        config.clear();

        expect(config.get("foo")).to.be(undefined);
        expect(config.get("foo", "default")).to.equal("default");

        config.set("foo", "bar");

        expect(config.get("foo")).to.equal("bar");
        expect(config.get("foo", "default")).to.equal("bar");
    });

    it("can export a static representation of the config", function() {
        var config = new ConfigStorage("testConfigStorage");
        config.clear();

        config.set("key1", "a")
            .set("key2.a", "a")
            .set("key2.b.a", "a")
            .set("key3.a", 42)
            .set("key3", {a: 1, b: 2})
            .set("key4[0]", "foo");

        expect(config.exportConfig()).to.eql({
            key1: "a",
            key2: {a: "a", b: {a: "a"}},
            key3: {a: 1, b: 2},
            key4: ["foo"]
        });

    });

    it("can save / load values to / from the storage", function(done) {
        var config = new ConfigStorage("testConfigStorage");
        config.clear();

        var id = uuid.v4();
        config.set("id", id);

        setTimeout(function() {
            var config2 = new ConfigStorage("testConfigStorage");
            expect(config2.get("id")).to.equal(id);
            done();
        }, 10);
    });

    it("can resolve values in the right order", function() {
        var values1 = {a: 1, b: 2, c: {a: 1, b: 2}};
        var values2 = {b: 42, c: {b: 42, c: 3}, d: 1337};
        var config = new ConfigStorage("testConfigStorage", [values1, values2]);
        config.clear();

        config.set("e", 5)
            .set("c.a", 888);

        expect(config.exportConfig()).to.eql({
            a: 1,
            b: 42,
            c: {a: 888, b: 42, c: 3},
            d: 1337,
            e: 5
        });
    });

    it("can clear the storage", function() {
        var config = new ConfigStorage("testConfigStorage");
        config.set("aaa", 1);
        expect(config.get("aaa")).to.equal(1);
        config.clear();
        expect(config.get("aaa")).to.be(undefined);
    });

});
