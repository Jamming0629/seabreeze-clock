import React, { useState, useEffect, useMemo } from 'react';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import './App.css';

function App() {
  // 時計表示用のstate
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 時間帯ごとにtint色を決定
  const hour = time.getHours();
  let tintColor = [255, 255, 255, 255]; // デフォルト（昼）
  if (hour >= 5 && hour < 8) {
    // 朝焼け
    tintColor = [255, 200, 150, 255];
  } else if (hour >= 8 && hour < 17) {
    // 昼
    tintColor = [255, 255, 255, 255];
  } else if (hour >= 17 && hour < 20) {
    // 夕焼け
    tintColor = [255, 180, 180, 255];
  } else {
    // 夜
    tintColor = [160, 180, 255, 220];
  }

  // sketch関数をuseMemoで固定
  const sketch = useMemo(() => {
    return (p5) => {
      let img;
      let tintR = 255, tintG = 255, tintB = 255, tintA = 255;
      p5.updateWithProps = (props) => {
        if (props && props.tintColor) {
          [tintR, tintG, tintB, tintA] = props.tintColor;
          if (img && p5._renderer) {
            p5.clear();
            p5.tint(tintR, tintG, tintB, tintA);
            p5.image(img, 0, 0, p5.width, p5.height);
          }
        }
      };
      p5.preload = () => {
        img = p5.loadImage('/seabreeze.jpg');
      };
      p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.tint(tintR, tintG, tintB, tintA);
        p5.image(img, 0, 0, p5.width, p5.height);
        p5.noLoop();
      };
      p5.draw = () => {};
      p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.tint(tintR, tintG, tintB, tintA);
        p5.image(img, 0, 0, p5.width, p5.height);
      };
    };
  }, []);

  // 時計表示用フォーマット関数
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 (${weekday})`;
  };

  return (
    <div className="App">
      <ReactP5Wrapper sketch={sketch} tintColor={tintColor} />
      <div className="clock-overlay">
        <div className="time">{formatTime(time)}</div>
        <div className="date">{formatDate(time)}</div>
      </div>
    </div>
  );
}

export default App; 