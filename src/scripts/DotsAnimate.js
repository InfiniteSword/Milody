const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

function random (m, n) {
  return Math.round(Math.random() * (n - m) + m);
}

function initDots (n, rd, color) {
  let arr = [];
  if (rd) {
    for (let i = 0; i < n; i++) {
      let x = random(0, SCREEN_WIDTH);
      let y = random(0, SCREEN_HEIGHT);
      let color = 'rgba(' + random(102, 255) + ',' + random(102, 255) + ',' + random(102, 255) + ',0)';
      arr.push({
        x: x,
        y: y,
        dy: Math.random() + 0.1, // 保证dy>0.1
        color: color,
        radius: 30,
        r: random(150, 255),
        g: random(150, 255),
        b: random(150, 255)
      });
    }
  } else {
    for (let i = 0; i < n; i++) {
      let x = random(0, SCREEN_WIDTH);
      let y = random(0, SCREEN_HEIGHT);
      arr.push({
        x: x,
        y: y,
        dy: Math.random() + 0.1, // 保证dy>0.1
        color: color,
        radius: 30,
        r: random(150, 255),
        g: random(150, 255),
        b: random(150, 255)
      });
    }
  }
  return arr;
}
function changeColorRandom (arr, n) {
  for (let i = 0; i < n; i++) {
    arr[i].r = random(150, 255);
    arr[i].g = random(150, 255);
    arr[i].b = random(150, 255);
  }
}
function changeColor (arr, n, color) {
  for (let i = 0; i < n; i++) {
    arr[i].color = color;
  }
}

function DotsAnimate (canvas, arr, lastArr, options) {
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  let cwidth = canvas.width;
  let cheight = canvas.height;
  options = options || {};
  let _random = true;
  let opts = {
    r: options.r || 30, // 点半径
    n: options.n || cwidth > 500 ? 30 : 20,
    color: options.color || 'rgba(255,255,255,.8)',
    tempArr: lastArr || []
  };
  if (opts.tempArr.length === 0) {
    opts.tempArr = initDots(opts.n, opts.random, opts.color);
  }
  Object.defineProperty(opts, 'random', {
    get: function () {
      return _random;
    },
    set: function (v) {
      if (v === _random) {
        return _random;
      } else {
        if (v === true) {
          changeColorRandom(opts.tempArr, opts.n);
        } else {
          changeColor(opts.tempArr, opts.n, opts.color);
        }
        _random = v;
      }
    }
  });
  opts.random = options.random;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let n = 0; n < opts.n; n++) {
    let s = opts.tempArr[n];
    s.radius = Math.round(arr[n] / 256 * (cwidth > cheight ? cwidth / 64 : cheight / 36));
    let gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
    if (opts.random) {
      gradient.addColorStop(0, 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',' + 0.7 + ')');
    } else {
      gradient.addColorStop(0, opts.color);
    }
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2, true);
    ctx.fill();
    s.y = s.y - 1 * s.dy;
    // 到顶部后返回底部，随机化
    if (s.y <= 0) {
      s.y = cheight;
      s.x = random(0, cwidth);
    }
  }

  return opts.tempArr;
}

export default DotsAnimate;
