/* eslint-disable no-bitwise */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-08 12:42:48
 * @LastEditTime: 2021-04-08 13:05:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/mocks/puzzle.js
 */
const { createCanvas, loadImage } = require('canvas');
const { omit } = require('ramda');

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

const BLOCK_POSITION_FIX = [0, 15, 12];

const cacheService = {
  data: {},
  get(key) {
    return this.data[key];
  },
  set(key, value) {
    this.data[key] = value;
  },
  delete(key) {
    this.data = omit(key, this.data);
  },
};

function drawLine(ctx, x, y, operation, shape) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (shape === 0) {
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
  } else if (shape === 1) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l + 2);
    ctx.arc(x + l / 2, y + l + 8, r, -0.21 * PI, 1.21 * PI);
    ctx.lineTo(x, y + l + 2);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  } else if (shape === 2) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + 5, y + l / 2, r, 1.31 * PI, 2.71 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.arc(x + l / 2, y + l - 5, r, 0.21 * PI, 0.81 * PI, true);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = 'overlay';
}

async function getPuzzleImg() {
  try {
    const imageCanvas = createCanvas(w, h);
    const blockCanvas = createCanvas(w, h);
    const imageCanvasCtx = imageCanvas.getContext('2d');
    const blockCanvasCtx = blockCanvas.getContext('2d');

    const x = (Math.random() * 200 + 90) >> 0;
    const y = (Math.random() * 100 + 40) >> 0;

    const blockShapeTmp = (Math.random() * 100) % 3 >> 0;
    drawLine(imageCanvasCtx, x, y, 'fill', blockShapeTmp);
    drawLine(blockCanvasCtx, x, y, 'clip', blockShapeTmp);
    const image = await loadImage('http://gmm.sdoprofile.com/events/assets/img/home_bg.5849ea6.png');
    blockCanvasCtx?.drawImage(image, 0, 0, w, h);
    imageCanvasCtx?.drawImage(image, 0, 0, w, h);
    const newY = y - r * 2 - 1 + BLOCK_POSITION_FIX[blockShapeTmp];
    const imageData = blockCanvasCtx?.getImageData(x - 3, newY, L, L);
    if (imageData) {
      blockCanvas.width = L;
      blockCanvasCtx?.putImageData(imageData, 0, newY);
    }
    const session = `${new Date().getTime()}`;
    cacheService.set(session, x);
    return {
      success: true,
      msg: '获取成功',
      code: 0,
      data: {
        canvas: imageCanvas.toDataURL(), block: blockCanvas.toDataURL(), session,
      },
    };
  } catch (e) {
    return {
      success: false,
      msg: e.toString(),
      code: -1,
    };
  }
}

async function verifyPuzzle(session, left) {
  try {
    const cacheLeft = parseInt(cacheService.get(session) || '', 10);
    cacheService.delete(session);
    const success = left > cacheLeft - 5 && left < cacheLeft + 5;
    return {
      success,
      msg: success ? '验证成功' : '验证失败',
      code: success ? 0 : -1,
    };
  } catch (e) {
    return {
      success: false,
      msg: e.toString(),
      code: -1,
    };
  }
}

module.exports = {
  getPuzzleImg,
  verifyPuzzle,
};
