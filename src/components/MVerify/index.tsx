/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-06 22:33:55
 * @LastEditTime: 2021-04-08 10:51:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\components\MVerify\index.tsx
 */
import { Spin } from 'antd';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { CHECK_PUZZLE_IMG, GET_PUZZLE_IMG } from '../../api/auth';
import useRequest from '../../hook/useRequest';
import style from './index.module.less';

const w = 350; // canvas宽度
const h = 200; // canvas高度

interface IMVerifyProps {
  onSuccess: () => any;
  onClose: () => any;
}

enum DragStatus {
  pending,
  start,
  move,
  end,
}

enum VerifyStatus {
  pending,
  success,
  fail,
}

const VerifyTip: Record<VerifyStatus, string> = {
  [VerifyStatus.fail]: '验证失败，请重试',
  [VerifyStatus.pending]: '',
  [VerifyStatus.success]: '验证成功',
};

const MVerify = (props: IMVerifyProps) => {
  const [dragStatus, setDragStatus] = useState(DragStatus.pending);
  const [moveX, setMoveX] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState(VerifyStatus.pending);
  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });
  const [getPuzzleImgLoading, puzzleImgRes, ,getPuzzleImg] = useRequest(GET_PUZZLE_IMG);
  const [checkPuzzleLoading, checkPuzzleRes, checkPuzzle] = useRequest(CHECK_PUZZLE_IMG, false);

  const verify = useCallback((left) => {
    checkPuzzle({ left, session: puzzleImgRes?.data.session || '' });
  }, [checkPuzzle, puzzleImgRes?.data.session]);

  const reset = useCallback(() => {
    setMoveX(0);
    setVerifyStatus(VerifyStatus.pending);
    setDragStatus(DragStatus.pending);
    getPuzzleImg();
  }, [getPuzzleImg]);

  const onFail = useCallback(() => {
    setVerifyStatus(VerifyStatus.fail);
    setTimeout(reset, 1000);
  }, [reset]);

  const onSuccess = useCallback(() => {
    setVerifyStatus(VerifyStatus.success);
    setTimeout(() => {
      props.onSuccess();
      props.onClose();
      reset();
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onClose, props.onSuccess, reset]);

  const handleDragStart = useCallback((e: any) => {
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    setOriginPosition({ x, y });
    setDragStatus(() => DragStatus.start);
  }, []);

  const handleDragMove = useCallback((e: any) => {
    if (dragStatus !== DragStatus.start) return false;
    const eventX = e.clientX || e.touches[0].clientX;
    const newMoveX = eventX - originPosition.x;
    if (newMoveX < 0 || newMoveX + 38 >= w) return false;
    setMoveX(newMoveX);
    return true;
  }, [dragStatus, originPosition.x]);

  const handleDragEnd = useCallback(() => {
    if (dragStatus !== DragStatus.start) return;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    setDragStatus(DragStatus.end);
    verify(moveX);
  }, [dragStatus, handleDragMove, moveX, verify]);

  useEffect(() => {
    if (!checkPuzzleRes) return;
    if (checkPuzzleRes.success) onSuccess();
    else onFail();
  }, [checkPuzzleRes, onFail, onSuccess]);

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove]);

  return (
    <div className={style.container}>
      <p>请完成以下验证后继续:</p>
      <div
        style={{
          zIndex: getPuzzleImgLoading ? 0 : 1,
          borderRadius: 10,
          width: w,
          height: h,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Spin
          spinning={getPuzzleImgLoading || checkPuzzleLoading}
          size="large"
          style={{
            position: 'absolute', width: w, height: h, lineHeight: `${h}px`,
          }}
        />
        <img src={puzzleImgRes?.data.canvas} alt="" srcSet="" width={w} height={h} crossOrigin="anonymous" />
        <div onClick={getPuzzleImg} className={style.refreshIcon} />
        <img src={puzzleImgRes?.data.block} alt="" srcSet="" className={style.block} style={{ left: moveX || 10 }} />
        <span
          className={`${style.resultTip}
            ${verifyStatus === VerifyStatus.success ? style.success : ''}
            ${verifyStatus === VerifyStatus.fail ? style.fail : ''}
          `}
        >
          { VerifyTip[verifyStatus] }
        </span>
        <div
          className={`${style.sliderContainer}
            ${verifyStatus === VerifyStatus.success ? style.sliderContainerSuccess : ''}
            ${verifyStatus === VerifyStatus.fail ? style.sliderContainerFail : ''}
          `}
        >
          <div style={{ width: `${moveX}px` }} className={style.sliderMask} />
          <div style={{ left: `${moveX}px` }} onMouseDown={handleDragStart} className={style.slider}>
            <span className={style.sliderIcon} />
          </div>
          <span className={style.sliderText}>向右滑动填充拼图</span>
        </div>
      </div>
    </div>
  );
};

export default MVerify;
