import { h } from 'preact';
import { connect } from 'unistore/preact';
import { actions } from '../../store.js';
import { useState, useRef } from 'preact/hooks';
import useEventListener from '@use-it/event-listener';
import styles from './PullToRefresh.css';

// Only supported on browsers with bounce overflow scrolling
const SUPPORTED = /iPhone|iPod|iPad/.test(navigator.userAgent) &&
                  !/CriOS/.test(navigator.userAgent);

const SHOW_LIMIT = 32;
const RELOAD_LIMIT = 58;
const SHOW_ROTATE = -90;
const RELOAD_ROTATE = 45;

const PullToRefresh = connect('loading', actions)(({ loading, update }) => {
  if (!SUPPORTED) return null;

  // Keep animation from playing on intial render
  const initialRender = useRef(true);

  // Don't show while zooming
  const [singleTouch, setSingleTouch] = useState(true);
  useEventListener('touchstart', ({ touches }) => {
    setSingleTouch(touches.length === 1);
  }, window);

  const [position, setPosition] = useState(0);
  useEventListener('scroll', () => {
    setPosition(
      singleTouch ? Math.max(-document.scrollingElement.scrollTop, 0) : 0
    );
  }, window);

  const show = loading || position >= SHOW_LIMIT;
  const progress = Math.min(
    (position - SHOW_LIMIT) / (RELOAD_LIMIT - SHOW_LIMIT), 1
  );
  const rotation = SHOW_ROTATE - (SHOW_ROTATE - RELOAD_ROTATE) * progress;
  const done = progress === 1;
  const verticalOffset = (position - RELOAD_LIMIT) / 2;

  useEventListener('touchend', () => {
    if (loading || !done) return;
    initialRender.current = false;
    update();
  }, window);

  return (
    <div
      className={[styles.wrapper, show && styles.show]}
      style={{ transform: `translateY(${Math.max(0, verticalOffset)}px)` }}
    >
      <div
        className={[
          styles.circle,
          done && styles.showCirle,
          !initialRender.current && loading && styles.animateCircle
        ]}
        style={{ transform: `scale(${done ? 1 : 0})` }}
      />
      <svg
        className={[styles.svg, done && styles.svgDone]}
        style={{
          transform: `rotate(${rotation}deg)`,
          opacity: loading ? 0 : progress
        }}
      >
        <path
          d="M12 18a6.003 6.003 0 005.659-4h2.089A8 8 0 1118 6.708V4h2v7h-7V9h4.197A6 6 0 1012 18z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
});

export default PullToRefresh;
