import { Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.less';

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

const BLOCK_POSITION_FIX = [0, 15, 0];

interface PropsI {
  onSuccess: () => any;
  onClose: () => any;
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
  return `https://picsum.photos/350/200?image=${getRandomNumberByRange(0, 1084)}`;
  // return 'https://i.picsum.photos/id/648/350/200.jpg?hmac=2BO8hrHzcalCSb3b3oKIJ8lvFFd_wyhZakTGj3fDZ0k';
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

enum DragStatus {
  pending,
  start,
  move,
  end
}

enum VerifyStatus {
  pending,
  success,
  fail
}

const MVerify = (props: PropsI) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blockRef = useRef<HTMLCanvasElement>(null);
  const refreshIconRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const resultRef = useRef<HTMLSpanElement>(null);
  const [dragStatus, setDragStatus] = useState(DragStatus.pending);
  const [moveX, setMoveX] = useState(0);
  const [blockLeft, setBlockLeft] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState(VerifyStatus.pending);
  const [canvasCtx, setCanvasCtx] = useState(canvasRef?.current?.getContext('2d') || null);
  const [blockCtx, setBlockCtx] = useState(blockRef?.current?.getContext('2d') || null);
  const [imgSrc, setImgSrc] = useState(getRandomImg());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([0]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  const verify = useCallback(() => {
    const average = trail.reduce(sum) / trail.length;
    const deviations = trail.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / trail.length);
    const left = parseInt(blockRef?.current?.style?.left || '', 10);
    return {
      spliced: Math.abs(left - position.x) < 10,
      verified: stddev !== 0,
    };
  }, [position.x, trail]);

  const reset = useCallback(() => {
    setMoveX(0);
    setBlockLeft(0);
    setTrail([0]);
    setPosition({ x: 0, y: 0 });
    setVerifyStatus(VerifyStatus.pending);
    setDragStatus(DragStatus.pending);
    setIsImgLoading(true);
    canvasCtx?.clearRect(0, 0, w, h);
    blockCtx?.clearRect(0, 0, w, h);
    blockCtx?.canvas?.setAttribute('width', String(w));
    setImgSrc(getRandomImg());
    if (resultRef.current) resultRef.current.innerText = '';
  }, [blockCtx, canvasCtx]);

  const onFail = useCallback(() => {
    setVerifyStatus(VerifyStatus.fail);
    if (resultRef.current) resultRef.current.innerText = '验证失败，请重试';
    setTimeout(reset, 1000);
  }, [reset]);

  const onSuccess = useCallback(() => {
    setVerifyStatus(VerifyStatus.success);
    if (resultRef.current) resultRef.current.innerText = '验证成功';
    setTimeout(() => {
      props.onClose();
      props.onSuccess();
      reset();
    }, 1000);
  }, [props, reset]);


  const handleDragStart = useCallback((e: any) => {
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    setOriginPosition({ x, y });
    setDragStatus(() => DragStatus.start);
  }, []);

  const handleDragMove = useCallback((e: any) => {
    if (dragStatus !== DragStatus.start) return false;
    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = e.clientY || e.touches[0].clientY;
    const _moveX = eventX - originPosition.x;
    const moveY = eventY - originPosition.y;
    if (_moveX < 0 || _moveX + 38 >= w) return false;
    setMoveX(_moveX);
    setBlockLeft(((w - 40 - 20) / (w - 40)) * _moveX);
    setTrail((_trail) => [..._trail, moveY]);
  }, [dragStatus, originPosition.x, originPosition.y]);

  const handleDragEnd = useCallback((e: any) => {
    if (dragStatus !== DragStatus.start) return false;
    const eventX = e.clientX || e.changedTouches[0].clientX;
    if (eventX === originPosition.x) return false;
    const { spliced, verified } = verify();
    if (spliced && verified) onSuccess();
    else onFail();
  }, [dragStatus, onFail, onSuccess, originPosition.x, verify]);

  const draw = useCallback(() => {
    if (!imgRef.current) return;
    setIsImgLoading(false);
    const x = getRandomNumberByRange(L + 10, w - (L + 10));
    const y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
    setPosition(() => ({ x, y }));
    const _blockShape = (Math.random() * 100) % 3 >> 0;
    drawD(canvasCtx, x, y, 'fill', _blockShape);
    drawD(blockCtx, x, y, 'clip', _blockShape);
    blockCtx?.drawImage(imgRef?.current, 0, 0, w, h);
    canvasCtx?.drawImage(imgRef?.current, 0, 0, w, h);
    const _y = y - r * 2 - 1 + BLOCK_POSITION_FIX[_blockShape];
    const imageData = blockCtx?.getImageData(x - 3, _y, L, L);
    if (imageData) {
      blockCtx?.canvas.setAttribute('width', String(imageData?.width || L));
      blockCtx?.putImageData(imageData, 0, _y);
    }
  }, [blockCtx, canvasCtx]);

  const onImgLoadError = useCallback(() => {
    if (resultRef.current) resultRef.current.innerText = '';
  }, [resultRef]);

  useEffect(() => {
    imgRef?.current?.addEventListener('load', draw);
    imgRef?.current?.addEventListener('error', onImgLoadError);
    return () => {
      imgRef?.current?.removeEventListener('load', draw);
      imgRef?.current?.removeEventListener('error', onImgLoadError);
    };
  }, [imgRef, draw, onImgLoadError]);

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove]);

  useEffect(() => {
    sliderRef?.current?.addEventListener('mousedown', handleDragStart);
    return () => {
      sliderRef?.current?.removeEventListener('mousedown', handleDragStart);
    };
  }, [sliderRef, handleDragStart]);

  useEffect(() => {
    refreshIconRef?.current?.addEventListener('click', reset);
    return () => {
      refreshIconRef?.current?.removeEventListener('click', reset);
    };
  }, [reset, refreshIconRef]);

  useEffect(() => {
    setCanvasCtx(canvasRef?.current?.getContext('2d') || null);
  }, [canvasRef]);

  useEffect(() => {
    setBlockCtx(blockRef?.current?.getContext('2d') || null);
  }, [blockRef]);

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
      <p className="un-copy">请完成以下验证后继续:</p>
      <div
        style={{
          zIndex: isImgLoading ? 0 : 1,
          borderRadius: 10,
          width: 350,
          height: 200,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Spin spinning={isImgLoading} size="large" style={{ position: 'absolute', width: w, height: h, lineHeight: `${h}px` }} />
        <img ref={imgRef} src={imgSrc} alt="" srcSet="" width={w} height={h} crossOrigin="anonymous" style={{ zIndex: -1, position: 'absolute' }} />
        <canvas ref={canvasRef} width={w} height={h} />
        <div ref={refreshIconRef} className="refreshIcon" />
        <canvas ref={blockRef} height={h} style={{ left: `${blockLeft}px` }} className="block" />
        <span
          ref={resultRef}
          className={`resultTip
            ${verifyStatus === VerifyStatus.success ? 'success' : ''}
            ${verifyStatus === VerifyStatus.fail ? 'fail' : ''}
          `}
          style={{ opacity: verifyStatus === VerifyStatus.pending ? 0 : 1 }}
        />
        <div
          className={`sliderContainer
            ${verifyStatus === VerifyStatus.success ? 'sliderContainer_success' : ''}
            ${verifyStatus === VerifyStatus.fail ? 'sliderContainer_fail' : ''}
          `}
        >
          <div style={{ width: `${moveX}px` }} className="sliderMask" />
          <div ref={sliderRef} style={{ left: `${moveX}px` }} className="slider">
            <span className="sliderIcon" />
          </div>
          <span ref={textRef} className="sliderText un-copy">向右滑动填充拼图</span>
        </div>
      </div>
    </div>
  );
};

export default MVerify;
