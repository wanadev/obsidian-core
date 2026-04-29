"use strict";

const expect = require("expect.js");
const uuidHelper = require("../../helpers/uuid-helper");

describe("obsidian-core/helpers/uuid-helper", () => {

    describe("uuid4", () => {
        it("can generate a UUID v4 conform to RFC4122", () => {
            const uuid4_1 = uuidHelper.uuid4();
            const uuid4_2 = uuidHelper.uuid4();
            expect(uuid4_1).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            expect(uuid4_2).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            expect(uuid4_1).not.to.equal(uuid4_2);
        });
    });

    describe("fallbackUuid4", () => {
        it("can generate a UUID v4 (random)", () => {
            expect(uuidHelper.fallbackUuid4()).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });

});
