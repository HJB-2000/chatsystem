(() => {
"use strict";
var __webpack_modules__ = ({
"./apps/chatsystem/src/app.controller.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppController: () => (AppController)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _app_service__rspack_import_1 = __webpack_require__("./apps/chatsystem/src/app.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}


class AppController {
    getHello() {
        return this.appService.getHello();
    }
    constructor(appService){
        _define_property(this, "appService", void 0);
        this.appService = appService;
    }
}
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _app_service__rspack_import_1.AppService === "undefined" ? Object : _app_service__rspack_import_1.AppService
    ])
], AppController);


},
"./apps/chatsystem/src/app.module.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppModule: () => (AppModule),
  ObserveInstrument: () => (ObserveInstrument),
  ObserveModule: () => (ObserveModule)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _nestjs_observe__rspack_import_1 = __webpack_require__("@nestjs/observe");
/* import */ var _nestjs_observe__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_nestjs_observe__rspack_import_1);
/* import */ var _app_controller__rspack_import_2 = __webpack_require__("./apps/chatsystem/src/app.controller.ts");
/* import */ var _app_service__rspack_import_3 = __webpack_require__("./apps/chatsystem/src/app.service.ts");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}




const { ObserveModule, ObserveInstrument } = (0,_nestjs_observe__rspack_import_1.createObserveModule)();
class AppModule {
}
AppModule = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Module)({
        imports: [
            // Distributed tracing, auto-correlated logs, request/job metrics, error
            // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
            ObserveModule.forRoot({
                appKey: 'YOUR_APP_KEY',
                appSecret: 'YOUR_APP_SECRET',
                serviceId: 'chatsystem'
            })
        ],
        controllers: [
            _app_controller__rspack_import_2.AppController
        ],
        providers: [
            _app_service__rspack_import_3.AppService
        ]
    })
], AppModule);


},
"./apps/chatsystem/src/app.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppService: () => (AppService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

class AppService {
    getHello() {
        return 'Hello World!';
    }
}
AppService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], AppService);


},
"@nestjs/common"(module) {
module.exports = require("@nestjs/common");

},
"@nestjs/core"(module) {
module.exports = require("@nestjs/core");

},
"@nestjs/observe"(module) {
module.exports = require("@nestjs/observe");

},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, getters, values) => {
	var define = (defs, kind) => {
		for(var key in defs) {
			if(__webpack_require__.o(defs, key) && !__webpack_require__.o(exports, key)) {
				Object.defineProperty(exports, key, { enumerable: true, [kind]: defs[key] });
			}
		}
	};
	define(getters, "get");
	define(values, "value");
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* import */ var _nestjs_core__rspack_import_0 = __webpack_require__("@nestjs/core");
/* import */ var _nestjs_core__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__rspack_import_0);
/* import */ var _app_module__rspack_import_1 = __webpack_require__("./apps/chatsystem/src/app.module.ts");


async function bootstrap() {
    const app = await _nestjs_core__rspack_import_0.NestFactory.create(_app_module__rspack_import_1.AppModule, {
        instrument: _app_module__rspack_import_1.ObserveInstrument
    });
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map