function CircleAnimate (canvas, arr, lastArr, options) {
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  options = options || {};
  let opts = {
    r: options.r || SCREEN_WIDTH / 96, // 距离
    n: options.n || 96, // 点数（必须为偶数）
    w: options.w || 2, // 线宽
    colors: options.colors || [{
      stop: '1',
      color: 'rgba(255,255,255,.8)'
    }], // 颜色及其过渡位置
    blurColor: options.blurColor || '#ffffff', // 模糊颜色
    blurWidth: options.blurWidth || 20,
    tempArr: lastArr || []
  };
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let arr1 = [];
  let arr2 = [];
  let x, y, value;
  let step = Math.round(arr.length / opts.n / 2);
  let bottomX = SCREEN_WIDTH / 2;
  let bottomY = SCREEN_HEIGHT;
  for (let i = 0; i < opts.n / 2; i++) {
    value = arr[i * step] * arr[i * step] / 250;
    let n1 = value || 0;
    let n2;
    if (opts.tempArr[i]) {
      n2 = 0;
    } else {
      n2 = 0;
    }
    n1 = Math.max(n1, n2);
    n1 = Math.min(n1, 300);
    opts.tempArr[i] = n1;
    x = bottomX + opts.r * i;
    y = bottomY;
    arr1.push({'x': x, 'y': y});
    x = bottomX + opts.r * i;
    y = bottomY - value;
    arr2.push({'x': x, 'y': y});
  }
  for (let i = opts.n / 2, j = 0; i < opts.n; i++, j++) {
    value = arr[j * step] * arr[j * step] / 250;
    let n1 = value || 0;
    let n2;
    if (opts.tempArr[j]) {
      n2 = 0;
    } else {
      n2 = 0;
    }
    n1 = Math.max(n1, n2);
    n1 = Math.min(n1, 300);
    opts.tempArr[j] = n1;
    x = bottomX - opts.r * j;
    y = bottomY;
    arr1.push({'x': x, 'y': y});
    x = bottomX - opts.r * j;
    y = bottomY - value;
    arr2.push({'x': x, 'y': y});
  }
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  opts.colors.forEach((item) => {
    gradient.addColorStop(item.stop, item.color);
  });
  ctx.shadowBlur = opts.blurWidth;
  ctx.shadowColor = opts.blurColor;
  ctx.lineWidth = opts.w;
  ctx.strokeStyle = gradient;
  ctx.beginPath();
  for (let i = 0; i < opts.n; i++) {
    ctx.moveTo(arr1[i].x, arr1[i].y);
    ctx.lineTo(arr2[i].x, arr2[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  return opts.tempArr;
}

export default CircleAnimate;
