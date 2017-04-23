import { VideoPlayerService } from '../video-player.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'na-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  scrollIncrement: number = 1;
  startTickPosition = 0;
  endTickPosition = 0;
  startFragment = 0;
  endFragment = 0;
  watchingVideo;

  drag = {
    tick: "main",
    startPageX: 0,
    startX: 0,
    startIsSet: false,
    endIsSet: false
  }

  constructor(private vp: VideoPlayerService) { }

  ngOnInit() {
    // скролл по нажатию стрелок на клавиатуре
    $(document).keyup((e) => {
      if (e.keyCode === 37) { // влево
        if (this.vp.videoPosition > this.scrollIncrement) {
          this.vp.setVideoPosition(+(this.vp.videoPosition - this.scrollIncrement).toFixed(1));
        } else {
          this.vp.setVideoPosition(0);
        }
      }

      if (e.keyCode === 39) { // вправо
        if (this.vp.videoPosition + this.scrollIncrement < this.vp.videoLength) {
          this.vp.setVideoPosition(+(this.vp.videoPosition + this.scrollIncrement).toFixed(1));
        } else {
          this.vp.setVideoPosition(this.vp.videoLength);
        }
      }

      // 18. Нажатие стрелки «вверх» на клавиатуре создает начало фрагмента, «вниз» конец фрагмента.
      if (e.keyCode === 38) { // вверх
        this.setStartFragment(e)
      }

      if (e.keyCode === 40) { // вниз
        this.setEndFragment(e)
      }

      // воспроизведение / пауза
      if (e.keyCode === 32) { // пробел
        if (this.vp.videoContainer.paused) {
          this.playVideo();
        } else {
          this.pauseVideo();
        }
      }

      // console.log(e.keyCode);
    });

    this.vp.timelineWidth = $(".timeline").outerWidth();
    this.endFragment = this.vp.videoLength;
  }

  // 14. Пользователь может создавать фрагменты отмечая начало и конец на таймлайне.
  setTickPosition(event) {
    this.vp.setTickPosition(event.offsetX);
  }

  // 17. Также в интерфейсе продублированы кнопки «начало фрагмента» «конец фрагмента»
  setStartFragment(event) {
    event.preventDefault();

    this.startTickPosition = this.vp.tickPosition;
    this.startFragment = this.vp.videoPosition;
    this.drag.startIsSet = true;
  }

  setEndFragment(event) {
    event.preventDefault();

    this.endTickPosition = this.vp.tickPosition;
    this.endFragment = this.vp.videoPosition;
    this.drag.endIsSet = true;
  }

  // 14. Границы фрагмента можно перемещать по таймлайну после их создания.
  startDragTick(event, tick) {
    // event.dataTransfer.setData('data', data);
    this.drag.tick = tick;

    let tickPos;
    switch (tick) {
      case "main":
        tickPos = this.vp.tickPosition;
        break;

      case "start":
        tickPos = this.startTickPosition;
        break;

      case "end":
        tickPos = this.endTickPosition;
        break;
    }

    this.drag.startPageX = event.pageX;
    this.drag.startX = tickPos;
  }

  moveTick(event) {
    event.preventDefault();

    let dx = event.pageX - this.drag.startPageX;
    let newPos = this.drag.startX + dx;

    if (newPos > 0 && newPos < this.vp.timelineWidth) {

      switch (this.drag.tick) {
        case "main":
          this.vp.setTickPosition(newPos);
          break;

        case "start":
          this.startTickPosition = newPos;
          this.startFragment = +((newPos / this.vp.timelineWidth) * this.vp.videoLength).toFixed(1);
          break;

        case "end":
          this.endTickPosition = newPos;
          this.endFragment = +((newPos / this.vp.timelineWidth) * this.vp.videoLength).toFixed(1);
          break;
      }
    }
  }

  // endDragTick() {}

  // 16. В режиме разметки на фрагменты появляется выбор скорости скролла по таймлайну, нажатием на клавиши «влево» и «вправо» - 1 сек, 0,5 сек, 0,1 сек. Выбор вместо кнопок выставления оценки.
  setScrollSpeed(event, speed) {
    event.preventDefault();
    this.scrollIncrement = speed;
  }

  saveFragment(event) {
    event.preventDefault();

    if(this.drag.startIsSet && this.drag.endIsSet && this.endFragment > this.startFragment) {
      let newID = this.vp.fragments.length + 1;
      this.vp.fragments.push([
        newID,
        this.startFragment,
        this.endFragment
      ]);

      // обнуляем значения
      this.startTickPosition = 0;
      this.endTickPosition = 0;
      this.startFragment = 0;
      this.endFragment = 0;
      this.drag = {
        tick: "main",
        startPageX: 0,
        startX: 0,
        startIsSet: false,
        endIsSet: false
      }
    }

  }

  playVideo() {
    let updateTickPosition = () => {
      if (this.vp.videoContainer === undefined) {
        this.vp.videoContainer = document.getElementById('videoToMark');
      }

      let pos = +(this.vp.videoContainer.currentTime).toFixed(1);
      this.vp.videoPosition = pos;
      this.vp.tickPosition = +((pos / this.vp.videoLength) * this.vp.timelineWidth).toFixed(1);
    }

    this.vp.videoContainer.play();
    this.watchingVideo = setInterval(updateTickPosition, 100);
  }

  pauseVideo() {
    this.vp.videoContainer.pause();
    clearInterval(this.watchingVideo);
  }
}