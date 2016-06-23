(function (root) {
    "use strict";

    var buster = root.buster || require("buster"),
        sinon = root.sinon || require("../lib/sinon"),
        assert = buster.assert,
        refute = buster.refute;

    buster.testCase("sinon", {
        ".wrapMethod": {
            setUp: function () {
                this.method = function () {};
                this.getter = function () {};
                this.setter = function () {};
                this.object = {method: this.method};
                Object.defineProperty(this.object, "property", {
                    get: this.getter,
                    set: this.setter,
                    configurable: true
                });
            },

            "is function": function () {
                assert.isFunction(sinon.wrapMethod);
            },

            "throws if first argument is not object": function () {
                assert.exception(function () {
                    sinon.wrapMethod();
                }, "TypeError");
            },

            "throws if object defines property but is not function": function () {
                this.object.prop = 42;
                var object = this.object;

                assert.exception(function () {
                    sinon.wrapMethod(object, "prop", function () {});
                }, "TypeError");
            },

            "throws if object does not define property": function () {
                var object = this.object;

                assert.exception(function () {
                    sinon.wrapMethod(object, "prop", function () {});
                });

                try {
                    sinon.wrapMethod(object, "prop", function () {});
                    throw new Error("Didn't throw");
                } catch (e) {
                    assert.match(e.message,
                        /Attempted to wrap .* property .* as function/);
                }
            },

            "throws if third argument is missing": function () {
                var object = this.object;

                assert.exception(function () {
                    sinon.wrapMethod(object, "method");
                }, "TypeError");
            },

            "throws if third argument is not a function or a property descriptor": function () {
                var object = this.object;

                assert.exception(function () {
                    sinon.wrapMethod(object, "method", 1);
                }, "TypeError");
            },

            "replaces object method": function () {
                sinon.wrapMethod(this.object, "method", function () {});

                refute.same(this.method, this.object.method);
                assert.isFunction(this.object.method);
            },

            "replaces getter": function () {
                sinon.wrapMethod(this.object, "property", { get: function () {} });

                refute.same(this.getter, Object.getOwnPropertyDescriptor(this.object, "property").get);
                assert.isFunction(Object.getOwnPropertyDescriptor(this.object, "property").get);
            },

            "replaces setter": function () {
                sinon.wrapMethod(this.object, "property", { set: function () {} });

                refute.same(this.setter, Object.getOwnPropertyDescriptor(this.object, "property").set);
                assert.isFunction(Object.getOwnPropertyDescriptor(this.object, "property").set);
            },

            "throws if method is already wrapped": function () {
                sinon.wrapMethod(this.object, "method", function () {});

                assert.exception(function () {
                    sinon.wrapMethod(this.object, "method", function () {});
                }, "TypeError");
            },

            "throws if property descriptor is already wrapped": function () {
                sinon.wrapMethod(this.object, "property", { get: function () {} });

                assert.exception(function () {
                    sinon.wrapMethod(this.object, "property", { get: function () {} });
                }, "TypeError");
            },

            "throws if method is already a spy": function () {
                var object = { method: sinon.spy() };

                assert.exception(function () {
                    sinon.wrapMethod(object, "method", function () {});
                }, "TypeError");
            },

            "originating stack traces": {
                requiresSupportFor: {
                    "overriding Error and TypeError": (function () {
                        return !(typeof navigator === "object" && /PhantomJS/.test(navigator.userAgent));
                    }())
                },

                setUp: function () {
                    this.oldError = Error;
                    this.oldTypeError = TypeError;
                    var i = 0;
                    Error = TypeError = function () {
                        this.stack = ":STACK" + ++i + ":";
                    }
                },

                tearDown: function () {
                    Error = this.oldError;
                    TypeError = this.oldTypeError;
                },

                "throws with stack trace showing original wrapMethod call": function () {
                    var object = { method: function () {} };
                    sinon.wrapMethod(object, "method", function () {
                        return "original"
                    });

                    try {
                        sinon.wrapMethod(object, "method", function () {});
                    } catch (e) {
                        assert.equals(e.stack, ":STACK2:\n--------------\n:STACK1:");
                    }
                }
            },

            "in browser": {
                requiresSupportFor: {
                    "window object": typeof window !== "undefined"
                },

                "does not throw if object is window object": function () {
                    window.sinonTestMethod = function () {};
                    try {
                        refute.exception(function () {
                            sinon.wrapMethod(window, "sinonTestMethod", function () {});
                        });
                    } finally {
                        // IE 8 does not support delete on global properties.
                        window.sinonTestMethod = undefined;
                    }
                }
            },

            "mirrors function properties": function () {
                var object = { method: function () {} };
                object.method.prop = 42;

                sinon.wrapMethod(object, "method", function () {});

                assert.equals(object.method.prop, 42);
            },

            "does not mirror and overwrite existing properties": function () {
                var object = { method: function () {} };
                object.method.called = 42;

                sinon.stub(object, "method");

                assert.isFalse(object.method.called);
            }
        },

        "wrapped method": {
            setUp: function () {
                this.method = function () {};
                this.object = { method: this.method };
            },

            "defines restore method": function () {
                sinon.wrapMethod(this.object, "method", function () {});

                assert.isFunction(this.object.method.restore);
            },

            "returns wrapper": function () {
                var wrapper = sinon.wrapMethod(this.object, "method", function () {});

                assert.same(this.object.method, wrapper);
            },

            "restore brings back original method": function () {
                sinon.wrapMethod(this.object, "method", function () {});
                this.object.method.restore();

                assert.same(this.object.method, this.method);
            }
        },

        "wrapped prototype method": {
            setUp: function () {
                this.type = function () {};
                this.type.prototype.method = function () {};
                this.object = new this.type();
            },

            "wrap adds owned property": function () {
                var wrapper = sinon.wrapMethod(this.object, "method", function () {});

                assert.same(this.object.method, wrapper);
                assert(this.object.hasOwnProperty("method"));
            },

            "restore removes owned property": function () {
                sinon.wrapMethod(this.object, "method", function () {});
                this.object.method.restore();

                assert.same(this.object.method, this.type.prototype.method);
                assert.isFalse(this.object.hasOwnProperty("method"));
            }
        },

        ".deepEqual": {
            "passes null": function () {
                assert(sinon.deepEqual(null, null));
            },

            "fails null and object": function () {
                assert.isFalse(sinon.deepEqual(null, {}));
            },

            "fails object and null": function () {
                assert.isFalse(sinon.deepEqual({}, null));
            },

            "fails error and object": function () {
                assert.isFalse(sinon.deepEqual(new Error(), {}));
            },

            "fails object and error": function () {
                assert.isFalse(sinon.deepEqual({}, new Error()));
            },

            "fails regexp and object": function () {
                assert.isFalse(sinon.deepEqual(/.*/, {}));
            },

            "fails object and regexp": function () {
                assert.isFalse(sinon.deepEqual({}, /.*/));
            },

            "passes primitives": function () {
                assert(sinon.deepEqual(1, 1));
            },

            "passes same object": function () {
                var object = {};

                assert(sinon.deepEqual(object, object));
            },

            "passes same function": function () {
                var func = function () {};

                assert(sinon.deepEqual(func, func));
            },

            "passes same array": function () {
                var arr = [];

                assert(sinon.deepEqual(arr, arr));
            },

            "passes same regexp": function () {
                var regexp = /foo/;

                assert(sinon.deepEqual(regexp, regexp));
            },

            "passes equal arrays": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                assert(sinon.deepEqual(arr1, arr2));
            },

            "passes equal arrays with custom properties": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                arr1.foo = "bar";
                arr2.foo = "bar";

                assert(sinon.deepEqual(arr1, arr2));
            },

            "fails arrays with unequal custom properties": function () {
                var arr1 = [1, 2, 3, "hey", "there"];
                var arr2 = [1, 2, 3, "hey", "there"];

                arr1.foo = "bar";
                arr2.foo = "not bar";

                assert.isFalse(sinon.deepEqual(arr1, arr2));
            },

            "passes equal regexps": function () {
                var regexp1 = /foo/;
                var regexp2 = /foo/;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps": function () {
                var regexp1 = /foo/;
                var regexp2 = /bar/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));

            },

            "passes equal regexps with same ignoreCase flags": function () {
                var regexp1 = /foo/i;
                var regexp2 = /foo/i;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps with different ignoreCase flags": function () {
                var regexp1 = /foo/i;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));

            },

            "passes equal regexps with same multiline flags": function () {
                var regexp1 = /foo/m;
                var regexp2 = /foo/m;

                assert(sinon.deepEqual(regexp1, regexp2));

            },

            "fails unequal regexps with different multiline flags": function () {
                var regexp1 = /foo/m;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes equal regexps with same global flags": function () {
                var regexp1 = /foo/g;
                var regexp2 = /foo/g;

                assert(sinon.deepEqual(regexp1, regexp2));
            },

            "fails unequal regexps with different global flags": function () {
                var regexp1 = /foo/g;
                var regexp2 = /foo/;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes equal regexps with multiple flags": function () {
                var regexp1 = /bar/im;
                var regexp2 = /bar/im;

                assert(sinon.deepEqual(regexp1, regexp2));
            },

            "fails unequal regexps with multiple flags": function () {
                var regexp1 = /bar/im;
                var regexp2 = /bar/ig;

                assert.isFalse(sinon.deepEqual(regexp1, regexp2));
            },

            "passes NaN and NaN": function () {
                assert(sinon.deepEqual(NaN, NaN));
            },

            "passes equal objects": function () {
                var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
                var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

                assert(sinon.deepEqual(obj1, obj2));
            },

            "fails unequal objects with undefined properties with different names": function () {
                var obj1 = {a: 1, b: 2, c: 3};
                var obj2 = {a: 1, b: 2, foo: undefined};

                assert.isFalse(sinon.deepEqual(obj1, obj2));
            },

            "fails unequal objects with undefined properties with different names (different arg order)": function () {
                var obj1 = {a: 1, b: 2, foo: undefined};
                var obj2 = {a: 1, b: 2, c: 3};

                assert.isFalse(sinon.deepEqual(obj1, obj2));
            },

            "passes equal dates": function () {
                var date1 = new Date(2012, 3, 5);
                var date2 = new Date(2012, 3, 5);

                assert(sinon.deepEqual(date1, date2));
            },

            "fails different dates": function () {
                var date1 = new Date(2012, 3, 5);
                var date2 = new Date(2013, 3, 5);

                assert.isFalse(sinon.deepEqual(date1, date2));
            },

            "in browsers": {
                requiresSupportFor: {
                    "document object": typeof document !== "undefined"
                },

                "passes same DOM elements": function () {
                    var element = document.createElement("div");

                    assert(sinon.deepEqual(element, element));
                },

                "fails different DOM elements": function () {
                    var element = document.createElement("div");
                    var el = document.createElement("div");

                    assert.isFalse(sinon.deepEqual(element, el));
                },

                "does not modify DOM elements when comparing them": function () {
                    var el = document.createElement("div");
                    document.body.appendChild(el);
                    sinon.deepEqual(el, {});

                    assert.same(el.parentNode, document.body);
                    assert.equals(el.childNodes.length, 0);
                }
            },

            "passes deep objects": function () {
                var func = function () {};

                var obj1 = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: "hey",
                    e: "there",
                    f: func,
                    g: {
                        a1: [1, 2, "3", {
                            prop: [func, "b"]
                        }]
                    }
                };

                var obj2 = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: "hey",
                    e: "there",
                    f: func,
                    g: {
                        a1: [1, 2, "3", {
                            prop: [func, "b"]
                        }]
                    }
                };

                assert(sinon.deepEqual(obj1, obj2));
            }
        },

        ".extend": {
            "copies all properties": function () {
                var object1 = {
                    prop1: null,
                    prop2: false
                };

                var object2 = {
                    prop3: "hey",
                    prop4: 4
                };

                var result = sinon.extend({}, object1, object2);

                var expected = {
                    prop1: null,
                    prop2: false,
                    prop3: "hey",
                    prop4: 4
                };

                assert.equals(result, expected);
            }
        },

        "Function.prototype.toString": {
            "returns function's displayName property": function () {
                var fn = function () {};
                fn.displayName = "Larry";

                assert.equals(sinon.functionToString.call(fn), "Larry");
            },

            "guesses name from last call's this object": function () {
                var obj = {};
                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            },

            "guesses name from any call where property can be located": function () {
                var obj = {}, otherObj = { id: 42 };
                obj.doStuff = sinon.spy();
                obj.doStuff.call({});
                obj.doStuff();
                obj.doStuff.call(otherObj);

                assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
            }
        },

        ".getConfig": {
            "gets copy of default config": function () {
                var config = sinon.getConfig();

                refute.same(config, sinon.defaultConfig);
                assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
                assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
                assert.equals(config.properties, sinon.defaultConfig.properties);
                assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
                assert.equals(config.useFakeServer, sinon.defaultConfig.useFakeServer);
            },

            "should override specified properties": function () {
                var config = sinon.getConfig({
                    properties: ["stub", "mock"],
                    useFakeServer: false
                });

                refute.same(config, sinon.defaultConfig);
                assert.equals(config.injectIntoThis, sinon.defaultConfig.injectIntoThis);
                assert.equals(config.injectInto, sinon.defaultConfig.injectInto);
                assert.equals(config.properties, ["stub", "mock"]);
                assert.equals(config.useFakeTimers, sinon.defaultConfig.useFakeTimers);
                assert.isFalse(config.useFakeServer);
            }
        },

        ".log": {
            "does nothing gracefully": function () {
                refute.exception(function () {
                    sinon.log("Oh, hiya");
                });
            }
        },

        ".createStubInstance": {
            "stubs existing methods": function () {
                var Class = function () {};
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                stub.method.returns(3);
                assert.equals(3, stub.method());
            },

            "doesn't stub fake methods": function () {
                var Class = function () {};

                var stub = sinon.createStubInstance(Class);
                assert.exception(function () {
                    stub.method.returns(3);
                });
            },

            "doesn't call the constructor": function () {
                var Class = function (a, b) {
                    var c = a + b;
                    throw c;
                };
                Class.prototype.method = function () {};

                var stub = sinon.createStubInstance(Class);
                refute.exception(function () {
                    stub.method(3);
                });
            },

            "retains non function values": function () {
                var TYPE = "some-value";
                var Class = function () {};
                Class.prototype.type = TYPE;

                var stub = sinon.createStubInstance(Class);
                assert.equals(TYPE, stub.type);
            },

            "has no side effects on the prototype": function () {
                var proto = {
                    method: function () {
                        throw "error"
                    }
                };
                var Class = function () {};
                Class.prototype = proto;

                var stub = sinon.createStubInstance(Class);
                refute.exception(stub.method);
                assert.exception(proto.method);
            },

            "throws exception for non function params": function () {
                var types = [{}, 3, "hi!"];
                for (var i = 0; i < types.length; i++) {
                    assert.exception(function () {
                        sinon.createStubInstance(types[i]);
                    });
                }
            }
        },

        ".restore": {
            "restores all methods of supplied object": function () {
                var methodA = function () {};
                var methodB = function () {};
                var obj = { methodA: methodA, methodB: methodB };

                sinon.stub(obj);
                sinon.restore(obj);

                assert.same(obj.methodA, methodA);
                assert.same(obj.methodB, methodB);
            },

            "only restores restorable methods": function () {
                var stubbedMethod = function () {};
                var vanillaMethod = function () {};
                var obj = { stubbedMethod: stubbedMethod, vanillaMethod: vanillaMethod };

                sinon.stub(obj, "stubbedMethod");
                sinon.restore(obj);

                assert.same(obj.stubbedMethod, stubbedMethod);
            },

            "restores a single stubbed method": function () {
                var method = function () {};
                var obj = { method: method };

                sinon.stub(obj);
                sinon.restore(obj.method);

                assert.same(obj.method, method);
            }
        }
    });
}(this));
