import { expect } from "chai";
import sinon from "sinon";
import "sinon-as-promised";

/* Controller Tests */

import Controller from "./controller";

describe("Controller", () => {
    it("should store successful response on controller", () => {
        // Mock the dependency
        var myService = {
            get: sinon.stub().resolves("success")
        };
        var controller = new Controller(myService);
        expect(controller.items).to.be.null;
        expect(controller.myService.get).to.be.a("function");

        var result = controller.getItems();

        return result.then(() => {
            expect(controller.items).to.equal("success");
        });
    });
});

/* Service Tests, note the shim for the $q constructor */

import MyService from "./service";

function $q(resolve, reject) {
    return new Promise(resolve, reject);
}

describe("MyService", () => {
    it("should store successful request on service", () => {

        // Mock Angular's $http
        var httpFlag = "got http data";
        var $http = {
            get: sinon.stub().resolves(httpFlag)
        };

        // Pass in our $q wrapper function above
        var service = new MyService($q, $http);
        var result = service.get();

        return result.then((result) => {
            expect(service.logs).to.equal(httpFlag);
        });
    });
});


