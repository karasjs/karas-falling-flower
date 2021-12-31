import karas from 'karas';
import { version } from '../package.json';

const {
  enums: {
    STYLE_KEY: {
      DISPLAY,
      VISIBILITY,
      OPACITY,
      TRANSFORM_ORIGIN,
    },
  },
  util: {
    isNil,
  },
  math: {
    geom: {
      d2r,
    },
    matrix: {
      identity,
      multiply,
    },
  },
} = karas;

class FallingFlower extends karas.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.time = 0;
    this.playbackRate = props.playbackRate || 1;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    let { props } = this;
    let { list = [], num = 0, initNum = 0, interval = 300, intervalNum = 1, delay = 0, autoPlay } = props;
    if(num === 'infinity' || num === 'Infinity') {
      num = Infinity;
    }
    let dataList = [];
    let i = 0, length = list.length;
    let lastTime = 0, count = 0;
    let fake = this.ref.fake;
    let cb = this.cb = diff => {
      diff *= this.playbackRate;
      if(delay > 0) {
        delay -= diff;
      }
      if(delay <= 0) {
        diff += delay;
        this.time += diff;
        delay = 0;
      }
      // 如果有初始粒子
      if(initNum > 0) {
        lastTime = this.time;
        while(initNum-- > 0) {
          i++;
          i %= length;
          count++;
          dataList.push(this.genItem(list[i]));
        }
      }
      // 已有的每个粒子时间增加计算位置，结束的则消失
      for(let j = dataList.length - 1; j >= 0; j--) {
        let item = dataList[j];
        item.time += diff;
        if(item.time >= item.duration) {
          dataList.splice(j, 1);
        }
        else if(item.source) {
          let { x, y, width, height, distance, direction, deg = 90, iterations = 1, time, duration } = item;
          let percent = time / duration;
          let dy = distance * percent;
          let per = duration / iterations;
          let count = Math.floor(time / per);
          item.nowPercent = (time % per) / per;
          item.nowDirection = (count % 2 === 0) ? direction : !direction;
          item.nowX = x - width * 0.5;
          item.nowY = y + dy - height * 0.5;
        }
      }
      if(count >= num) {
        return;
      }
      if(this.time >= lastTime + interval) {
        lastTime = this.time;
        for(let j = 0; j < intervalNum; j++) {
          i++;
          i %= length;
          count++;
          dataList.push(this.genItem(list[i]))
          if(count >= num) {
            break;
          }
        }
      }
    };
    if(autoPlay !== false) {
      fake.frameAnimate(cb);
    }
    let a = this.animation = fake.animate([
      {
        opacity: 1,
      },
      {
        opacity: 0,
      }
    ], {
      duration: 1000,
      delay,
      iterations: Infinity,
      autoPlay,
    });
    fake.render = (renderMode, lv, ctx, cache, dx = 0, dy = 0) => {
      let { sx, sy } = fake;
      let computedStyle = this.computedStyle;
      if(computedStyle[DISPLAY] === 'none'
        || computedStyle[VISIBILITY] === 'hidden'
        || computedStyle[OPACITY] <= 0) {
        return;
      }
      dataList.forEach(item => {
        if(item.source) {
          let x = item.nowX + sx + dx;
          let y = item.nowY + sy + dy;
          let m = this.matrixEvent;
          let tfo = [x, y + item.origin];
          let r;
          // 左右摇摆为一个时期，前半在一侧后半在另一侧
          if(item.nowPercent >= 0.5) {
            r = d2r(item.deg * (item.nowPercent - 0.5) * (item.nowDirection ? -1 : 1));
          }
          else {
            r = d2r(item.deg * (0.5 - item.nowPercent) * (item.nowDirection ? 1 : -1));
          }
          let t = identity();
          let sin = Math.sin(r);
          let cos = Math.cos(r);
          t[0] = t[5] = cos;
          t[1] = sin;
          t[4] = -sin;
          m = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tfo[0], tfo[1], 0, 1], m);
          m = multiply(m, t);
          m = multiply(m, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -tfo[0], -tfo[1], 0, 1]);
          ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          ctx.drawImage(item.source, x, y, item.width, item.height);
        }
      });
    };
  }

  genItem(item) {
    let { width, height } = this;
    let o = {
      time: 0,
      count: 0,
    };
    if(Array.isArray(item.x)) {
      o.x = (item.x[0] + Math.random() * (item.x[1] - item.x[0])) * width;
    }
    else {
      o.x = item.x * width;
    }
    if(Array.isArray(item.y)) {
      o.y = (item.y[0] + Math.random() * (item.y[1] - item.y[0])) * height;
    }
    else {
      o.y = item.y * height;
    }
    if(Array.isArray(item.duration)) {
      o.duration = (item.duration[0] + Math.random() * (item.duration[1] - item.duration[0]));
    }
    else {
      o.duration = item.duration;
    }
    if(Array.isArray(item.width)) {
      o.width = item.width[0] + Math.random() * (item.width[1] - item.width[0]);
    }
    else if(!isNil(item.width)) {
      o.width = item.width;
    }
    if(Array.isArray(item.height)) {
      o.height = item.height[0] + Math.random() * (item.height[1] - item.height[0]);
    }
    else if(!isNil(item.height)) {
      o.height = item.height;
    }
    let distance = 0;
    if(Array.isArray(item.distance)) {
      distance = (item.distance[0] + Math.random() * (item.distance[1] - item.distance[0])) * height;
    }
    else if(distance) {
      distance = item.distance * height;
    }
    o.distance = distance;
    if(Array.isArray(item.deg)) {
      o.deg = item.deg[0] + Math.random() * (item.deg[1] - item.deg[0]);
    }
    else if(!isNil(item.deg)) {
      o.deg = item.deg;
    }
    else {
      o.deg = 0;
    }
    if(Array.isArray(item.origin)) {
      o.origin = item.origin[0] + Math.random() * (item.origin[1] - item.origin[0]);
    }
    else if(!isNil(item.origin)) {
      o.origin = item.origin;
    }
    else {
      o.origin = 0;
    }
    // 随机左右
    o.direction = Math.random() > 0.5;
    if(Array.isArray(item.iterations)) {
      o.iterations = item.iterations[0] + Math.round(Math.random() * (item.iterations[1] - item.iterations[0]));
    }
    else if(!isNil(item.iterations)) {
      o.iterations = item.iterations;
    }
    // if(item.easing) {
    //   o.easing = karas.animate.easing.getEasing(item.easing);
    // }
    if(item.url) {
      karas.inject.measureImg(item.url, function(res) {
        if(res.success) {
          o.source = res.source;
          if(!(isNil(o.width) && isNil(o.height))) {
            if(isNil(o.width)) {
              o.width = res.width / res.height * o.height;
            }
            else if(isNil(o.height)) {
              o.height = o.width * res.height / res.width;
            }
          }
          if(o.height) {
            o.origin *= o.height;
          }
        }
      });
    }
    return o;
  }

  pause() {
    this.ref.fake.removeFrameAnimate(this.cb);
    if(this.animation) {
      this.animation.pause();
    }
  }

  resume() {
    this.ref.fake.frameAnimate(this.cb);
    if(this.animation) {
      this.animation.resume();
    }
  }

  play() {
    this.count = 0;
    this.time = 0;
    this.ref.fake.removeFrameAnimate(this.cb);
    this.ref.fake.frameAnimate(this.cb);
    if(this.animation) {
      this.animation.play();
    }
  }

  render() {
    return <div>
      <$polyline ref="fake"/>
    </div>;
  }
}

FallingFlower.version = version;

export default FallingFlower;
