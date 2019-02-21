"use strict";

var expect = require("expect.js");
var CallbackManager = require("../../lib/callback-manager");

describe("obsidian-core/lib/callback-manager", function() {

    describe("addEvName", function() {

        it("can add one evName", function() {
            var cm = new CallbackManager();
            cm.addEvName("ev1");
            expect(cm.$data.callbacks).to.only.have.keys("ev1");
            cm.addEvName("ev2");
            expect(cm.$data.callbacks).to.only.have.keys("ev1", "ev2");
        });

        it("can add more than one evName", function() {
            var cm = new CallbackManager();
            cm.addEvName("ev1", "ev2");
            expect(cm.$data.callbacks).to.only.have.keys("ev1", "ev2");
        });

        it("can be called from the constructor", function() {
            var cm = new CallbackManager("ev1", "ev2");
            expect(cm.$data.callbacks).to.only.have.keys("ev1", "ev2");
        });

    });

    describe("add", function() {

        it("can register a callback without options", function() {
            var cm = new CallbackManager("ev1");
            var fn = function() {};
            var id = cm.add("ev1", fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: id, cb: fn}]});
        });

        it("can register a callback with options", function() {
            var cm = new CallbackManager("ev1");
            var fn = function() {};
            var id = cm.add("ev1", {mode: "wall-draw"}, fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: id, cb: fn, mode: "wall-draw"}]});
        });

        it("can register a callback with a custom id", function() {
            var cm = new CallbackManager("ev1");
            var fn = function() {};
            cm.add("ev1", {id: "my-id"}, fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "my-id", cb: fn}]});
        });

        it("can replace a callback that have the same id", function() {
            var cm = new CallbackManager("ev1");
            var fn = function() {};
            var fn2 = function() {};
            cm.add("ev1", {id: "id1"}, fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "id1", cb: fn}]});
            cm.add("ev1", {id: "id1"}, fn2);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "id1", cb: fn2}]});
        });

        it("throws an error if the evName is not allowed", function() {
            var cm = new CallbackManager();
            expect(cm.add.bind(null, "evFoo", function() {})).to.throwError(function(error) {
                expect(error).to.match(/WrongEvName/);
            });
        });

    });

    describe("remove", function() {

        it("can remove the given callback", function() {
            var cm = new CallbackManager("ev1", "ev2");
            var fn = function() {};
            cm.add("ev1", {id: "my-id"}, fn);
            cm.add("ev2", {id: "my-id-2"}, fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "my-id", cb: fn}], ev2: [{id: "my-id-2", cb: fn}]});
            cm.remove("my-id-2");
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "my-id", cb: fn}], ev2: []});
        });

        it("ignores id that does not exists", function() {
            var cm = new CallbackManager("ev1");
            var fn = function() {};
            cm.add("ev1", {id: "my-id"}, fn);
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "my-id", cb: fn}]});
            cm.remove("foo");
            expect(cm.$data.callbacks).to.eql({ev1: [{id: "my-id", cb: fn}]});
        });

    });

    describe("call", function() {

        it("can call callbacks", function() {
            var cm = new CallbackManager("ev1", "ev2");

            var cb1Called = false;
            var cb2Called = false;
            var cb3Called = false;

            cm.add("ev1", function() { cb1Called = true; });
            cm.add("ev1", function() { cb2Called = true; });
            cm.add("ev2", function() { cb3Called = true; });

            cm.call("ev1");

            expect(cb1Called).to.be.ok();
            expect(cb2Called).to.be.ok();
            expect(cb3Called).not.to.be.ok();
        });

        it("can call callbacks with arguments", function() {
            var cm = new CallbackManager("ev1");
            var args;
            cm.add("ev1", function(a, b) { args = [a, b]; });
            cm.call("ev1", ["arg1", "arg2"]);
            expect(args).to.eql(["arg1", "arg2"]);
        });

        it("throws an error if the evName does not exist", function() {
            var cm = new CallbackManager();
            expect(cm.call.bind(null, "foo")).to.throwError(function(error) {
                expect(error).to.match(/WrongEvName/);
            });
        });

        it("can filter callbacks that will be called", function() {
            var cm = new CallbackManager("ev1");
            var called;

            cm.add("ev1", {f: 1, o: 42}, function() { called.push(1); });
            cm.add("ev1", {f: null, o: 2}, function() { called.push(2); });
            cm.add("ev1", {f: undefined, o: 1}, function() { called.push(3); });
            cm.add("ev1", {f: 2, o: 10}, function() { called.push(4); });
            cm.add("ev1", {f: 1, o: 15}, function() { called.push(5); });

            called = [];
            cm.call("ev1", [], {filter: {f: 1}});
            expect(called).to.eql([1, 5]);

            called = [];
            cm.call("ev1", [], {filter: [{f: 1}, {f: null}]});
            expect(called).to.eql([1, 5, 2]);

            called = [];
            cm.call("ev1", [], {filter: function(o) { return o.f > 1; }});
            expect(called).to.eql([4]);
        });

        it("can order callbacks that will be called", function() {
            var cm = new CallbackManager("ev1");
            var called;

            cm.add("ev1", {f: 1, o: 42}, function() { called.push(1); });
            cm.add("ev1", {f: null, o: 2}, function() { called.push(2); });
            cm.add("ev1", {f: undefined, o: 1}, function() { called.push(3); });
            cm.add("ev1", {f: 2, o: 10}, function() { called.push(4); });
            cm.add("ev1", {f: 1, o: 15}, function() { called.push(5); });

            called = [];
            cm.call("ev1", [], {filter: {f: 1}, orderBy: "o"});
            expect(called).to.eql([5, 1]);

            called = [];
            cm.call("ev1", [], {filter: {f: 1}, orderBy: "o", order: "desc"});
            expect(called).to.eql([1, 5]);
        });

    });

    describe("stop", function() {

        it("stops the call of the callback stack", function() {
            var cm = new CallbackManager("ev1");
            var cb1Called = false;
            var cb2Called = false;
            var cb3Called = false;

            cm.add("ev1", {o: 1}, function() { cb1Called = true; });
            cm.add("ev1", {o: 2}, function() { cb2Called = true; cm.stop(); });
            cm.add("ev1", {o: 3}, function() { cb3Called = true; });

            cm.call("ev1", [], {orderBy: "o"});

            expect(cb1Called).to.be.ok();
            expect(cb2Called).to.be.ok();
            expect(cb3Called).not.to.be.ok();
        });

        it("stops only the call of the current callback stack", function() {
            var cm = new CallbackManager("ev1", "ev2");
            var ev1cb1Called = false;
            var ev1cb2Called = false;
            var ev2cb1Called = false;
            var ev2cb2Called = false;

            cm.add("ev1", {o: 1}, function() { 
                ev1cb1Called = true; 
                cm.call("ev2", [], {orderBy: "o"}); 
            });
            cm.add("ev1", {o: 2}, function() { ev1cb2Called = true; });

            cm.add("ev2", {o: 1}, function() { ev2cb1Called = true; cm.stop(); });
            cm.add("ev2", {o: 2}, function() { ev2cb2Called = true; });

            cm.call("ev1", [], {orderBy: "o"});

            expect(ev1cb1Called).to.be.ok();
            expect(ev2cb1Called).to.be.ok();
            expect(ev2cb2Called).not.to.be.ok();
            expect(ev1cb2Called).to.be.ok();
        });
    });

    describe("callbacks", function() {

        it("exposes the registerd callbacks", function() {
            var cm = new CallbackManager();
            expect(cm.callbacks).to.be(cm.$data.callbacks);
        });

    });

});
