"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var socket_io_service_1 = require("./socket-io.service");
describe('SocketIoService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [socket_io_service_1.SocketIoService]
        });
    });
    it('should be created', testing_1.inject([socket_io_service_1.SocketIoService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=socket-io.service.spec.js.map