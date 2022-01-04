(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('karas')) :
  typeof define === 'function' && define.amd ? define(['karas'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FallingFlower = factory(global.karas));
})(this, (function (karas) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var karas__default = /*#__PURE__*/_interopDefaultLegacy(karas);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    Object.defineProperty(subClass, "prototype", {
      value: Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      }),
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  var version = "0.1.1";

  var _karas$enums = karas__default["default"].enums,
      _karas$enums$STYLE_KE = _karas$enums.STYLE_KEY,
      DISPLAY = _karas$enums$STYLE_KE.DISPLAY,
      VISIBILITY = _karas$enums$STYLE_KE.VISIBILITY,
      OPACITY = _karas$enums$STYLE_KE.OPACITY,
      NODE_REFRESH_LV = _karas$enums.NODE_KEY.NODE_REFRESH_LV,
      _karas$refresh = karas__default["default"].refresh,
      REPAINT = _karas$refresh.level.REPAINT,
      Cache = _karas$refresh.Cache,
      isNil = karas__default["default"].util.isNil,
      _karas$math = karas__default["default"].math,
      d2r = _karas$math.geom.d2r,
      _karas$math$matrix = _karas$math.matrix,
      identity = _karas$math$matrix.identity,
      multiply = _karas$math$matrix.multiply,
      _karas$mode = karas__default["default"].mode,
      CANVAS = _karas$mode.CANVAS,
      WEBGL = _karas$mode.WEBGL;
  var uuid = 0;

  var FallingFlower = /*#__PURE__*/function (_karas$Component) {
    _inherits(FallingFlower, _karas$Component);

    var _super = _createSuper(FallingFlower);

    function FallingFlower(props) {
      var _this;

      _classCallCheck(this, FallingFlower);

      _this = _super.call(this, props);
      _this.count = 0;
      _this.time = 0;
      _this.playbackRate = props.playbackRate || 1;
      return _this;
    }

    _createClass(FallingFlower, [{
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate() {
        return false;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this2 = this;

        Object.keys(this.hashImg || {}).forEach(function (k) {
          _this2.hashImg[k].release();
        });
        this.hashCache = {};
        this.hashMatrix = {};
        this.hashImg = {};
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        var props = this.props;
        var _props$list = props.list,
            list = _props$list === void 0 ? [] : _props$list,
            _props$num = props.num,
            num = _props$num === void 0 ? 0 : _props$num,
            _props$initNum = props.initNum,
            initNum = _props$initNum === void 0 ? 0 : _props$initNum,
            _props$interval = props.interval,
            interval = _props$interval === void 0 ? 300 : _props$interval,
            _props$intervalNum = props.intervalNum,
            intervalNum = _props$intervalNum === void 0 ? 1 : _props$intervalNum,
            _props$delay = props.delay,
            delay = _props$delay === void 0 ? 0 : _props$delay,
            autoPlay = props.autoPlay;

        if (num === 'infinity' || num === 'Infinity') {
          num = Infinity;
        }

        var dataList = [];
        var i = 0,
            length = list.length;
        var lastTime = 0,
            count = 0;
        var fake = this.ref.fake;
        var hashCache = this.hashCache = {},
            hashMatrix = this.hashMatrix = {},
            hashImg = this.hashImg = {};

        var cb = this.cb = function (diff) {
          diff *= _this3.playbackRate;

          if (delay > 0) {
            delay -= diff;
          }

          if (delay <= 0) {
            diff += delay;
            _this3.time += diff;
            delay = 0;
          } // 如果有初始粒子


          if (initNum > 0) {
            lastTime = _this3.time;

            while (initNum-- > 0) {
              i++;
              i %= length;
              count++;
              dataList.push(_this3.genItem(list[i]));
            }
          } // 已有的每个粒子时间增加计算位置，结束的则消失


          for (var j = dataList.length - 1; j >= 0; j--) {
            var item = dataList[j];
            item.time += diff;

            if (item.time >= item.duration) {
              dataList.splice(j, 1);
              delete hashCache[item.id];
              delete hashMatrix[item.id];
            } else if (item.source) {
              var x = item.x,
                  y = item.y,
                  width = item.width,
                  height = item.height,
                  distance = item.distance,
                  direction = item.direction;
                  item.deg;
                  var _item$iterations = item.iterations,
                  iterations = _item$iterations === void 0 ? 1 : _item$iterations,
                  time = item.time,
                  duration = item.duration;
              var percent = time / duration;
              var dy = distance * percent;
              var per = duration / iterations;

              var _count = Math.floor(time / per);

              item.nowPercent = time % per / per;
              item.nowDirection = _count % 2 === 0 ? direction : !direction;
              item.nowX = x - width * 0.5;
              item.nowY = y + dy - height * 0.5;
              item.loaded = true;
            }
          }

          if (count >= num) {
            return;
          }

          if (_this3.time >= lastTime + interval) {
            lastTime = _this3.time;

            for (var _j = 0; _j < intervalNum; _j++) {
              i++;
              i %= length;
              count++;
              dataList.push(_this3.genItem(list[i]));

              if (count >= num) {
                break;
              }
            }
          }
        };

        if (autoPlay !== false) {
          fake.frameAnimate(cb);
        }

        this.animation = fake.animate([{
          opacity: 1
        }, {
          opacity: 0
        }], {
          duration: 1000,
          delay: delay,
          iterations: Infinity,
          autoPlay: autoPlay
        });
        var __config = fake.__config;
        __config[NODE_REFRESH_LV] = REPAINT;
        var shadowRoot = this.shadowRoot;
        var texCache = this.root.texCache;

        fake.render = function (renderMode, lv, ctx, cache) {
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
          var dy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
          __config[NODE_REFRESH_LV] = REPAINT;
          var sx = fake.sx,
              sy = fake.sy;
          var computedStyle = shadowRoot.computedStyle;

          if (computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden' || computedStyle[OPACITY] <= 0) {
            return;
          }

          dataList.forEach(function (item) {
            if (item.loaded) {
              var x = item.nowX + sx + dx;
              var y = item.nowY + sy + dy;
              var m = _this3.matrixEvent;
              var tfo = [x, y + item.origin];
              var r; // 左右摇摆为一个时期，前半在一侧后半在另一侧

              if (item.nowPercent >= 0.5) {
                r = d2r(item.deg * (item.nowPercent - 0.5) * (item.nowDirection ? -1 : 1));
              } else {
                r = d2r(item.deg * (0.5 - item.nowPercent) * (item.nowDirection ? 1 : -1));
              }

              var t = identity();
              var sin = Math.sin(r);
              var cos = Math.cos(r);
              t[0] = t[5] = cos;
              t[1] = sin;
              t[4] = -sin;
              m = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tfo[0], tfo[1], 0, 1], m);

              if (renderMode === WEBGL) {
                var _cache = hashCache[item.id];

                if (!_cache) {
                  var url = item.url;

                  if (!hashImg[url]) {
                    _cache = hashCache[item.id] = Cache.getInstance([x - 1, y - 1, x + item.sourceWidth + 1, y + item.sourceHeight + 1], x, y);

                    _cache.ctx.drawImage(item.source, x + _cache.dx, y + _cache.dy);

                    hashImg[url] = _cache;
                  } else {
                    var c = hashImg[url];
                    _cache = hashCache[item.id] = new karas__default["default"].refresh.Cache(c.width, c.height, [x - 1, y - 1, x + item.sourceWidth + 1, y + item.sourceHeight + 1], c.page, c.pos, x, y);
                  }
                } else {
                  _cache.__bbox = [x - 1, y - 1, x + item.sourceWidth + 1, y + item.sourceHeight + 1];
                  _cache.__sx = x;
                  _cache.__sy = y;
                }

                if (item.width !== item.sourceWidth && item.height !== item.sourceHeight) {
                  var t2 = identity();
                  t2[0] = item.width / item.sourceWidth;
                  t2[5] = item.height / item.sourceHeight;
                  m = multiply(m, t2);
                }

                m = multiply(m, t);
                m = multiply(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -tfo[0], -tfo[1], 0, 1]);
                hashMatrix[item.id] = m;
              } else if (renderMode === CANVAS) {
                m = multiply(m, t);
                m = multiply(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -tfo[0], -tfo[1], 0, 1]);
                ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
                ctx.drawImage(item.source, x, y, item.width, item.height);
              }
            }
          });
        };

        fake.__hookGlRender = function (gl, opacity, cx, cy, dx, dy, revertY) {
          var computedStyle = shadowRoot.computedStyle;

          if (computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden' || computedStyle[OPACITY] <= 0) {
            return;
          }

          dataList.forEach(function (item) {
            if (item.loaded) {
              texCache.addTexAndDrawWhenLimit(gl, hashCache[item.id], opacity, hashMatrix[item.id], cx, cy, dx, dy, revertY);
            }
          });
        };
      }
    }, {
      key: "genItem",
      value: function genItem(item) {
        var width = this.width,
            height = this.height;
        var o = {
          id: uuid++,
          time: 0,
          count: 0,
          url: item.url
        };

        if (Array.isArray(item.x)) {
          o.x = (item.x[0] + Math.random() * (item.x[1] - item.x[0])) * width;
        } else {
          o.x = item.x * width;
        }

        if (Array.isArray(item.y)) {
          o.y = (item.y[0] + Math.random() * (item.y[1] - item.y[0])) * height;
        } else {
          o.y = item.y * height;
        }

        if (Array.isArray(item.duration)) {
          o.duration = item.duration[0] + Math.random() * (item.duration[1] - item.duration[0]);
        } else {
          o.duration = item.duration;
        }

        if (Array.isArray(item.width)) {
          o.width = item.width[0] + Math.random() * (item.width[1] - item.width[0]);
        } else if (!isNil(item.width)) {
          o.width = item.width;
        }

        if (Array.isArray(item.height)) {
          o.height = item.height[0] + Math.random() * (item.height[1] - item.height[0]);
        } else if (!isNil(item.height)) {
          o.height = item.height;
        }

        var distance = 0;

        if (Array.isArray(item.distance)) {
          distance = (item.distance[0] + Math.random() * (item.distance[1] - item.distance[0])) * height;
        } else if (distance) {
          distance = item.distance * height;
        }

        o.distance = distance;

        if (Array.isArray(item.deg)) {
          o.deg = item.deg[0] + Math.random() * (item.deg[1] - item.deg[0]);
        } else if (!isNil(item.deg)) {
          o.deg = item.deg;
        } else {
          o.deg = 0;
        }

        if (Array.isArray(item.origin)) {
          o.origin = item.origin[0] + Math.random() * (item.origin[1] - item.origin[0]);
        } else if (!isNil(item.origin)) {
          o.origin = item.origin;
        } else {
          o.origin = 0;
        } // 随机左右


        o.direction = Math.random() > 0.5;

        if (Array.isArray(item.iterations)) {
          o.iterations = item.iterations[0] + Math.round(Math.random() * (item.iterations[1] - item.iterations[0]));
        } else if (!isNil(item.iterations)) {
          o.iterations = item.iterations;
        }

        if (item.url) {
          karas__default["default"].inject.measureImg(item.url, function (res) {
            if (res.success) {
              o.source = res.source;
              o.sourceWidth = res.width;
              o.sourceHeight = res.height;

              if (!(isNil(o.width) && isNil(o.height))) {
                if (isNil(o.width)) {
                  o.width = res.width / res.height * o.height;
                } else if (isNil(o.height)) {
                  o.height = o.width * res.height / res.width;
                }
              }

              if (o.height) {
                o.origin *= o.height;
              }
            }
          });
        }

        return o;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.ref.fake.removeFrameAnimate(this.cb);

        if (this.animation) {
          this.animation.pause();
        }
      }
    }, {
      key: "resume",
      value: function resume() {
        this.ref.fake.frameAnimate(this.cb);

        if (this.animation) {
          this.animation.resume();
        }
      }
    }, {
      key: "play",
      value: function play() {
        this.count = 0;
        this.time = 0;
        this.ref.fake.removeFrameAnimate(this.cb);
        this.ref.fake.frameAnimate(this.cb);

        if (this.animation) {
          this.animation.play();
        }
      }
    }, {
      key: "render",
      value: function render() {
        return karas__default["default"].createElement("div", null, karas__default["default"].createElement("$polyline", {
          ref: "fake",
          style: {
            width: 0,
            visibility: 'hidden'
          }
        }));
      }
    }]);

    return FallingFlower;
  }(karas__default["default"].Component);

  FallingFlower.version = version;

  return FallingFlower;

}));
//# sourceMappingURL=index.js.map
