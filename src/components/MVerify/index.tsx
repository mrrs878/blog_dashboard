/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import './index.less';

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

interface PropsI {
  onSuccess: Function
}

function addClass(tag: any, className: string) {
  tag.classList.add(className);
}

function removeClass(tag: any, className: string) {
  tag.classList.remove(className);
}

function sum(x: number, y: number) {
  return x + y;
}

function square(x: number) {
  return x * x;
}

function getRandomNumberByRange(start: number, end: number) {
  return Math.round(Math.random() * (end - start) + start);
}

function getRandomImg() {
  // return `https://picsum.photos/350/200/?image=${getRandomNumberByRange(0, 1084)}`;
  return 'https://i.picsum.photos/id/648/350/200.jpg?hmac=2BO8hrHzcalCSb3b3oKIJ8lvFFd_wyhZakTGj3fDZ0k';
}

function createElement<T>(tagName: string, className: string = ''): T {
  const elment = document.createElement(tagName) as any;
  elment.className = className;
  return elment;
}

function createCanvas(width: number, height: number) {
  const canvas = createElement<HTMLCanvasElement>('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function createImg(onload: (e: Event) => any) {
  const img = createElement<HTMLImageElement>('img');
  img.crossOrigin = 'Anonymous';
  img.onload = onload;
  img.onerror = () => {
    img.src = getRandomImg();
  };
  img.src = getRandomImg();
  return img;
}

function drawD(ctx: CanvasRenderingContext2D|null, x: number, y: number, operation: 'fill'|'clip', shape: number) {
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

function createDOM() {
  const canvas = createCanvas(w, h); // 画布
  const block = canvas.cloneNode(true) as HTMLCanvasElement; // 滑块
  const sliderContainer = createElement<HTMLDivElement>('div', 'sliderContainer');
  const refreshIcon = createElement<HTMLDivElement>('div', 'refreshIcon');
  const sliderMask = createElement<HTMLDivElement>('div', 'sliderMask');
  const slider = createElement<HTMLDivElement>('div', 'slider');
  const sliderIcon = createElement<HTMLSpanElement>('span', 'sliderIcon');
  const text = createElement<HTMLSpanElement>('span', 'sliderText');
  const canvasCtx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  const blockCtx: CanvasRenderingContext2D | null = block.getContext('2d');
  return {
    canvas, block, sliderContainer, refreshIcon, sliderMask, slider, sliderIcon, text, canvasCtx, blockCtx,
  };
}

const MVerify = (props: PropsI) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvas, block, sliderContainer, refreshIcon, sliderMask, slider, sliderIcon, text, canvasCtx, blockCtx } = createDOM();

  let img: HTMLImageElement|null = null;
  let trail: Array<number> = [];
  const position = { x: 0, y: 0 };
  let blockShape = 0;
  const blockPositionFix = [0, 15, 0];

  function initDOM() {
    block.className = 'block';
    text.innerHTML = '向右滑动填充拼图';

    containerRef.current?.appendChild(canvas);
    containerRef.current?.appendChild(refreshIcon);
    containerRef.current?.appendChild(block);
    slider.appendChild(sliderIcon);
    sliderMask.appendChild(slider);
    sliderContainer.appendChild(sliderMask);
    sliderContainer.appendChild(text);
    containerRef.current?.appendChild(sliderContainer);
  }

  function draw() {
    const x = getRandomNumberByRange(L + 10, w - (L + 10));
    const y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
    position.x = x;
    position.y = y;
    blockShape = (Math.random() * 100) % 3 >> 0;
    drawD(canvasCtx, x, y, 'fill', blockShape);
    drawD(blockCtx, x, y, 'clip', blockShape);
  }

  function initImg() {
    const _img = createImg(() => {
      draw();
      const { y, x } = position;
      canvasCtx?.drawImage(_img, 0, 0, w, h);
      blockCtx?.drawImage(_img, 0, 0, w, h);
      const _y = y - r * 2 - 1 + blockPositionFix[blockShape];
      const imageData = blockCtx?.getImageData(x - 3, _y, L, L);
      block.width = L;
      if (imageData) blockCtx?.putImageData(imageData, 0, _y);
    });
    img = _img;
  }

  function clean() {
    canvasCtx?.clearRect(0, 0, w, h);
    blockCtx?.clearRect(0, 0, w, h);
    block.width = w;
  }

  function verify() {
    const arr = trail; // 拖动时y轴的移动距离
    const average = arr.reduce(sum) / arr.length;
    const deviations = arr.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    const left = parseInt(block?.style.left || '', 10);
    return {
      spliced: Math.abs(left - position.x) < 10,
      verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    };
  }

  function reset() {
    sliderContainer.className = 'sliderContainer';
    slider.style.left = '0';
    block.style.left = '0';
    sliderMask.style.width = '0';
    clean();
    if (img) img.src = getRandomImg();
  }

  function onFail() {}

  function onRefresh() {}

  function bindEvents() {
    refreshIcon.onclick = () => {
      reset();
      onRefresh();
    };

    let originX: number;
    let originY: number;
    const _trail: Array<number> = [];
    let isMouseDown = false;

    const handleDragStart = (e: any) => {
      originX = e.clientX || e.touches[0].clientX;
      originY = e.clientY || e.touches[0].clientY;
      isMouseDown = true;
    };

    const handleDragMove = (e: any) => {
      if (!isMouseDown) return false;
      const eventX = e.clientX || e.touches[0].clientX;
      const eventY = e.clientY || e.touches[0].clientY;
      const moveX = eventX - originX;
      const moveY = eventY - originY;
      if (moveX < 0 || moveX + 38 >= w) return false;
      slider.style.left = `${moveX}px`;
      const blockLeft = ((w - 40 - 20) / (w - 40)) * moveX;
      block.style.left = `${blockLeft}px`;

      addClass(sliderContainer, 'sliderContainer_active');
      sliderMask.style.width = `${moveX}px`;
      _trail.push(moveY);
    };

    const handleDragEnd = (e: any) => {
      if (!isMouseDown) return false;
      isMouseDown = false;
      const eventX = e.clientX || e.changedTouches[0].clientX;
      if (eventX === originX) return false;
      removeClass(sliderContainer, 'sliderContainer_active');
      trail = _trail;
      const { spliced, verified } = verify();
      if (spliced) {
        if (verified) {
          addClass(sliderContainer, 'sliderContainer_success');
          props.onSuccess();
        } else {
          addClass(sliderContainer, 'sliderContainer_fail');
          text.innerHTML = '再试一次';
          reset();
        }
      } else {
        addClass(sliderContainer, 'sliderContainer_fail');
        onFail();
        setTimeout(() => {
          reset();
        }, 1000);
      }
    };
    slider?.addEventListener('mousedown', handleDragStart);
    slider?.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  }

  useEffect(() => {
    initDOM();
    initImg();
    bindEvents();
  }, []);

  return (
    <div style={{
      padding: '20px 0 20px',
      boxSizing: 'content-box',
      backgroundColor: '#fff',
      height: 280,
      width: 350,
      margin: '0 auto',
    }}
    >
      <p>请完成以下验证后继续:</p>
      <div
        ref={containerRef}
        style={{
          borderRadius: 10, width: 350, height: 200, backgroundColor: '#fff', position: 'relative' }}
      />
    </div>
  );
};

export default MVerify;
