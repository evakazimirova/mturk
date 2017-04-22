import { CommonService } from '../../common.service';
import { VideoPlayerService } from '../video-player.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'na-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [ VideoPlayerService ]
})
export class TimelineComponent implements OnInit {
  scrollIncrement: number = 1;
  startTickPosition;
  endTickPosition;
  startFragment;
  endFragment;

  constructor(private common: CommonService, private vp: VideoPlayerService) { }

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
        this.setStartFragment()
      }

      if (e.keyCode === 40) { // вниз
        this.setEndFragment()
      }
    });

    this.vp.timelineWidth = $(".timeline").outerWidth();
  }

  // 14. Пользователь может создавать фрагменты отмечая начало и конец на таймлайне.
  setTickPosition(event) {
    this.vp.setTickPosition(event.offsetX);
  }

  // 17. Также в интерфейсе продублированы кнопки «начало фрагмента» «конец фрагмента»
  setStartFragment() {
    this.startTickPosition = this.vp.tickPosition;
    this.startFragment = this.vp.videoPosition;
  }

  setEndFragment() {
    this.endTickPosition = this.vp.tickPosition;
    this.endFragment = this.vp.videoPosition;
  }

  // 14. Границы фрагмента можно перемещать по таймлайну после их создания.
  startDragTick() {
    console.log("перемещение ползунка");
  }

  endDragTick() {
    console.log("ползунок перемещён");
  }

  // 16. В режиме разметки на фрагменты появляется выбор скорости скролла по таймлайну, нажатием на клавиши «влево» и «вправо» - 1 сек, 0,5 сек, 0,1 сек. Выбор вместо кнопок выставления оценки.
  setScrollSpeed(speed) {
    // console.log("Скорость скролла: " + speed + " сек");
    this.scrollIncrement = speed;
  }

  saveFragment() {
    // console.log("ID: " + this.vp.fragments.length);
    // console.log("начало: " + this.startFragment);
    // console.log("конец: " + this.endFragment);

    let newID = this.vp.fragments.length + 1;
    this.vp.fragments.push([
      newID,
      this.startFragment,
      this.endFragment
    ]);

    console.log(this.vp.fragments);
  }
}