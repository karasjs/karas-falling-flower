import karas from 'karas';

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

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var version = "0.4.0";

var _karas$enums$STYLE_KE = karas.enums.STYLE_KEY,
    DISPLAY = _karas$enums$STYLE_KE.DISPLAY,
    VISIBILITY = _karas$enums$STYLE_KE.VISIBILITY,
    OPACITY = _karas$enums$STYLE_KE.OPACITY,
    REPAINT = karas.refresh.level.REPAINT,
    _karas$util = karas.util,
    isNil = _karas$util.isNil,
    isFunction = _karas$util.isFunction,
    _karas$math = karas.math,
    d2r = _karas$math.geom.d2r,
    _karas$math$matrix = _karas$math.matrix,
    identity = _karas$math$matrix.identity,
    multiply = _karas$math$matrix.multiply,
    _karas$mode = karas.mode,
    CANVAS = _karas$mode.CANVAS,
    WEBGL = _karas$mode.WEBGL;
var uuid = 0;

var FallingFlower = /*#__PURE__*/function (_karas$Component) {
  _inherits(FallingFlower, _karas$Component);

  function FallingFlower(props) {
    var _this;

    _this = _karas$Component.call(this, props) || this;
    _this.count = 0;
    _this.time = 0;
    _this.playbackRate = props.playbackRate || 1;
    _this.interval = props.interval || 300;
    _this.intervalNum = props.intervalNum || 1;
    _this.num = props.num || 0;
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
      this.hashOpacity = {};
      this.hashTfo = {};
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var props = this.props;
      var _props$list = props.list,
          list = _props$list === void 0 ? [] : _props$list,
          _props$initNum = props.initNum,
          initNum = _props$initNum === void 0 ? 0 : _props$initNum,
          _props$delay = props.delay,
          delay = _props$delay === void 0 ? 0 : _props$delay,
          autoPlay = props.autoPlay;
      var dataList = [];
      var i = 0,
          length = list.length;
      var lastTime = 0,
          count = 0;
      var fake = this.ref.fake;
      var root = this.root;
      var hashCache = this.hashCache = {};
      var hashMatrix = this.hashMatrix = {};
      this.hashImg = {};
      this.hashOpacity = {};
      this.hashTfo = {};
      var currentTime = 0,
          maxTime = 0;
      var hasStart;
      var self = this;

      var cb = this.cb = function (diff) {
        diff *= _this3.playbackRate;
        currentTime += diff;

        if (delay > 0) {
          delay -= diff;
        }

        if (delay <= 0) {
          diff += delay;
          _this3.time += diff;
          delay = 0; // 如果有初始粒子

          if (initNum > 0) {
            lastTime = _this3.time;

            while (initNum-- > 0) {
              i++;
              i %= length;
              count++;

              var o = _this3.genItem(list[i]);

              maxTime = Math.max(maxTime, currentTime + o.duration);
              dataList.push(o);
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
                  direction = item.direction,
                  _item$iterations = item.iterations,
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
              hasStart = true;
            }
          } // 开始后每次都刷新，即便数据已空，要变成空白初始状态


          if (hasStart) {
            // fake.clearCache();
            // let p = fake.domParent;
            // while (p) {
            //   p.clearCache(true);
            //   p = p.domParent;
            // }
            root.__addUpdate(fake, {
              focus: REPAINT,
              cb: function cb() {
                self.emit('frame');
              }
            });
          }

          if (count >= _this3.num) {
            if (currentTime >= maxTime) {
              fake.removeFrameAnimate(cb);
            }

            return;
          } // 每隔interval开始生成这一阶段的粒子数据


          if (_this3.time >= lastTime + _this3.interval) {
            lastTime = _this3.time;

            for (var _j = 0; _j < _this3.intervalNum; _j++) {
              i++;
              i %= length;
              count++;

              var _o = _this3.genItem(list[i]);

              maxTime = Math.max(maxTime, currentTime + _o.duration);
              dataList.push(_o);

              if (count >= _this3.num) {
                break;
              }
            }
          }
        }
      };

      if (autoPlay !== false) {
        fake.frameAnimate(cb);
      }

      var shadowRoot = this.shadowRoot;
      this.root.texCache;

      fake.render = function (renderMode, ctx) {
        var dx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var time = currentTime - delay;

        if (time < 0) {
          return;
        }

        var computedStyle = shadowRoot.computedStyle;

        if (computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden' || computedStyle[OPACITY] <= 0) {
          return;
        }

        var sx = fake.sx,
            sy = fake.sy;
        var globalAlpha;

        if (renderMode === CANVAS) {
          globalAlpha = ctx.globalAlpha;
        } else if (renderMode === WEBGL) {
          globalAlpha = computedStyle[OPACITY];
        }

        dataList.forEach(function (item) {
          if (item.loaded) {
            var opacity = globalAlpha;
            opacity *= item.opacity; // 计算位置

            var x = item.nowX + sx + dx;
            var y = item.nowY + sy + dy;
            var m = identity();
            var tfo = [x, y + item.origin];

            if (renderMode === CANVAS) {
              m = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tfo[0], tfo[1], 0, 1], m);
            }

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
            m = multiply(m, t);

            if (renderMode === WEBGL) ; else if (renderMode === CANVAS) {
              ctx.globalAlpha = opacity; // canvas处理方式不一样，render的dx和dy包含了total的偏移计算考虑，可以无感知

              m = multiply(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -tfo[0], -tfo[1], 0, 1]); // 父级的m

              var pm = _this3.matrixEvent;

              if (pm) {
                m = multiply(pm, m);
              }

              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
              ctx.drawImage(item.source, x, y, item.width, item.height);
            }
          }
        });

        if (renderMode === CANVAS) {
          ctx.globalAlpha = globalAlpha;
        }
      }; // fake.hookGlRender = function(gl, opacity, matrix, cx, cy, dx, dy, revertY) {
      //   let computedStyle = shadowRoot.computedStyle;
      //   if(computedStyle[DISPLAY] === 'none'
      //     || computedStyle[VISIBILITY] === 'hidden'
      //     || computedStyle[OPACITY] <= 0) {
      //     return;
      //   }
      //   dataList.forEach(item => {
      //     if(item.loaded) {
      //       let id = item.id;
      //       let tfo = hashTfo[id].slice(0);
      //       tfo[0] += dx;
      //       tfo[1] += dy;
      //       let m = hashMatrix[id];
      //       m = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tfo[0], tfo[1], 0, 1], m);
      //       m = multiply(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -tfo[0], -tfo[1], 0, 1]);
      //       // 父级的m
      //       if(matrix) {
      //         m = multiply(matrix, m);
      //       }
      //       texCache.addTexAndDrawWhenLimit(gl, hashCache[id], hashOpacity[id], m, cx, cy, dx, dy, revertY);
      //     }
      //   });
      // };

    }
  }, {
    key: "genItem",
    value: function genItem(item) {
      var width = this.width,
          height = this.height,
          props = this.props;
      var o = {
        id: uuid++,
        time: 0,
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
        karas.inject.measureImg(item.url, function (res) {
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
            } else {
              o.width = res.width;
              o.height = res.height;
            }

            if (o.height) {
              o.origin *= o.height;
            }
          }
        });
      }

      if (props.hookData && isFunction(props.hookData)) {
        o = props.hookData(o);
      }

      return o;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.ref.fake.removeFrameAnimate(this.cb);
    }
  }, {
    key: "resume",
    value: function resume() {
      this.ref.fake.frameAnimate(this.cb);
    }
  }, {
    key: "play",
    value: function play() {
      this.count = 0;
      this.time = 0;
      this.ref.fake.removeFrameAnimate(this.cb);
      this.ref.fake.frameAnimate(this.cb);
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this.__playbackRate;
    },
    set: function set(v) {
      this.__playbackRate = parseFloat(v) || 1;
    }
  }, {
    key: "interval",
    get: function get() {
      return this.__interval;
    },
    set: function set(v) {
      this.__interval = parseInt(v) || 300;
    }
  }, {
    key: "intervalNum",
    get: function get() {
      return this.__intervalNum;
    },
    set: function set(v) {
      this.__intervalNum = parseInt(v) || 1;
    }
  }, {
    key: "num",
    get: function get() {
      return this.__num;
    },
    set: function set(v) {
      if (v === Infinity || /infinity/i.test(v)) {
        this.__num = Infinity;
      } else {
        this.__num = parseInt(v) || 0;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return karas.createElement("div", null, karas.createElement("$polyline", {
        ref: "fake",
        style: {
          width: 0,
          height: 0,
          visibility: 'hidden'
        }
      }));
    }
  }]);

  return FallingFlower;
}(karas.Component);

FallingFlower.version = version;

export { FallingFlower as default };
//# sourceMappingURL=index.es.js.map
