"use strict";

var expect = require("expect.js");
var MainLoop = require("../../lib/mainloop");

describe("obsidian-core/lib/mainloop", function() {

    it("can register callbacks", function() {
        var cb1Count = 0;
        var cb2Count = 0;
        var loop = new MainLoop({
            callbacks: [
                function() {cb1Count += 1;},
                function() {cb2Count += 1;}
            ]
        });

        expect(loop.callbacks).to.have.length(2);
    });

    it("can start the loop", function(done) {
        var cb1Count = 0;
        var cb2Count = 0;
        var loop = new MainLoop({
            callbacks: [
                function() {cb1Count += 1;},
                function() {cb2Count += 1;}
            ]
        });

        loop.start();

        setTimeout(function() {
            expect(cb1Count).to.be.greaterThan(0);
            expect(cb2Count).to.be.greaterThan(0);
            loop.stop();
            done();
        }, 10);
    });

    it("can stop the loop", function(done) {
        var cb1Count = 0;
        var cb2Count = 0;
        var loop = new MainLoop({
            callbacks: [
                function() {cb1Count += 1;},
                function() {cb2Count += 1;}
            ]
        });

        loop.start();

        setTimeout(function() {
            var cb1CountBackup = cb1Count;
            var cb2CountBackup = cb2Count;

            loop.stop();

            setTimeout(function() {
                expect(cb1Count).to.equal(cb1CountBackup);
                expect(cb2Count).to.equal(cb2CountBackup);
                done();
            }, 50);
        }, 50);
    });

    it("can add callbacks", function(done) {
        var cb1Count = 0;
        var cb2Count = 0;
        var loop = new MainLoop({
            callbacks: [
                function() {cb1Count += 1;}
            ]
        });

        loop.addCallback(function() {cb2Count += 1;});
        loop.start();

        setTimeout(function() {
            var cb1CountBackup = cb1Count;
            var cb2CountBackup = cb2Count;

            loop.stop();

            setTimeout(function() {
                expect(cb1Count).to.equal(cb1CountBackup);
                expect(cb2Count).to.equal(cb2CountBackup);
                done();
            }, 50);
        }, 50);
    });

    it("can remove callbacks", function(done) {
        var cb1Count = 0;
        var cb2Count = 0;
        var cb1 = function() {cb1Count += 1;};
        var cb2 = function() {cb2Count += 1;};
        var loop = new MainLoop({
            callbacks: [
                cb1,
                cb2
            ]
        });

        loop.removeCallback(cb2);
        loop.start();

        setTimeout(function() {
            var cb1CountBackup = cb1Count;

            loop.stop();

            setTimeout(function() {
                expect(cb1Count).to.equal(cb1CountBackup);
                expect(cb2Count).to.equal(0);
                done();
            }, 50);
        }, 50);
    });

});
