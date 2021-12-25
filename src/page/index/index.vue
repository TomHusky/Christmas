<template>
  <div class="context">
    <div id="snow">
      <div id="effect">
        <svg id="inner">
          <defs>
            <path
              id="leaf"
              d="M41.9,56.3l0.1-2.5c0,0,4.6-1.2,5.6-2.2c1-1,3.6-13,12-15.6c9.7-3.1,19.9-2,26.1-2.1c2.7,0-10,23.9-20.5,25 c-7.5,0.8-17.2-5.1-17.2-5.1L41.9,56.3z"
            />
          </defs>
          <g id="layer-snow"></g>
        </svg>
      </div>
    </div>
    <div class="container">
      <div class="star"></div>
      <div class="pressie">
        <div class="cover"></div>
        <div class="wrap"></div>
        <div class="ribbon"></div>
      </div>
      <div class="tree">
        <div class="base"></div>
        <div class="layer">
          <div class="line"></div>
          <div class="bauble one"></div>
        </div>

        <div class="layer two">
          <div class="line two"></div>
          <div class="bauble two"></div>
          <div class="socks">
            <div class="top"></div>
            <div class="foot"></div>
          </div>
        </div>

        <div class="layer three">
          <div class="line three"></div>
          <div class="bauble three"></div>
          <div class="socks two">
            <div class="top"></div>
            <div class="foot two"></div>
          </div>
        </div>
      </div>

      <div class="layer four">
        <div class="bauble four"></div>
        <div class="star two"></div>
        <div class="line four"></div>
      </div>
    </div>
    <div id="to-head" @click="toHead"><span>头像框</span></div>
    <div id="footer">
      <span>Copyright © 2019-2021 房东的Tom</span>
      <span>备案号:</span>
      <a target="_blank" href="https://beian.miit.gov.cn/"
        >湘ICP备2021018517号-1</a
      >
    </div>
  </div>
</template>
<script>
var container;
var innerSVG;
var summary;
var weatherContainer;
var innerSnowHolder;

var lightningTimeout;

var sizes;

var settings;
var tickCount = 0;
var snow = [];
import { mapState } from "vuex";
export default {
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    ...mapState({
      windowWidth: (state) => state.system.windowWidth,
      windowHeight: (state) => state.system.windowHeight,
    }),
  },
  watch: {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.initMain();
    this.timer = setInterval(() => {
      $(".bauble").addClass("light");

      setTimeout(() => {
        $(".bauble").removeClass("light");
      }, 500);
    }, 1000);
  },
  methods: {
    toHead(){
      this.$router.push("/headimg");
    },
    initMain() {
      // 📝 Fetch all DOM nodes in jQuery and Snap SVG
      container = $("#snow");
      innerSVG = Snap("#inner");
      summary = $("#summary");
      weatherContainer = Snap.select("#layer-snow");

      innerSnowHolder = weatherContainer.group();

      lightningTimeout;
      // create sizes object, we update this later

      sizes = {
        container: { width: 0, height: 0 },
      };

      // 🛠 app settings
      // in an object so the values can be animated in tweenmax

      settings = {
        snowCount: 0,
        renewCheck: 10,
      };

      tickCount = 0;

      snow = [];

      this.onResize();

      // 🏃 start animations

      requestAnimationFrame(this.tick);

      this.changeWeather();
    },
    onResize() {
      // 📏 grab window and card sizes
      sizes.container.width = this.windowWidth;
      sizes.container.height = this.windowHeight;
      innerSVG.attr({
        width: sizes.container.width,
        height: sizes.container.height,
      });
    },
    makeSnow() {
      let scale = 0.5 + Math.random() * 0.5;
      let newSnow;

      let x = 20 + Math.random() * (sizes.container.width - 40);
      let y = -10;
      let endY;

      newSnow = innerSnowHolder.circle(0, 0, 5).attr({
        fill: "white",
      });
      endY = sizes.container.height + 10;

      snow.push(newSnow);

      TweenMax.fromTo(
        newSnow.node,
        3 + Math.random() * 5,
        { x: x, y: y },
        {
          y: endY,
          onComplete: this.onSnowEnd,
          onCompleteParams: [newSnow],
          ease: Power0.easeIn,
        }
      );
      TweenMax.fromTo(
        newSnow.node,
        1,
        { scale: 0 },
        { scale: scale, ease: Power1.easeInOut }
      );
      TweenMax.to(newSnow.node, 3, {
        x: x + (Math.random() * 150 - 75),
        repeat: -1,
        yoyo: true,
        ease: Power1.easeInOut,
      });
    },

    onSnowEnd(flake) {
      flake.remove();
      flake = null;

      for (let i in snow) {
        if (!snow[i].paper) snow.splice(i, 1);
      }
      if (snow.length < settings.snowCount) {
        this.makeSnow();
      }
    },

    // 改变天气
    changeWeather() {
      TweenMax.killTweensOf(summary);
      TweenMax.to(summary, 1, {
        opacity: 0,
        x: -30,
        onComplete: this.updateSummaryText,
        ease: Power4.easeIn,
      });

      // snowCount 雪的数量
      TweenMax.to(settings, 3, { snowCount: 40, ease: Power2.easeInOut });
    },

    tick() {
      tickCount++;
      let check = tickCount % settings.renewCheck;

      if (check) {
        if (snow.length < settings.snowCount) this.makeSnow();
      }
      requestAnimationFrame(this.tick);
    },

    updateSummaryText() {
      // summary.html(currentWeather.name);
      TweenMax.fromTo(
        summary,
        1.5,
        { x: 30 },
        { opacity: 1, x: 0, ease: Power4.easeOut }
      );
    },
    openUrl(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="stylus" scoped>
.context {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Lato', sans-serif;
}

#snow {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: relative;
  background-size: 100% 100% !important;
  background: url('~@/assets/images/bg.jpg') no-repeat center center;
}

#effect {
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  z-index: 2;

  #back {
    position: fixed;
    pointer-events: none;
  }
}

#to-head {
  z-index: 9999;
  position: absolute;
  display: flex;
  bottom: 150px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(244, 90, 104, 0.8);
  align-items: center;
  justify-content: center;

  span {
    font-size: 28px;
    color: #fff;
  }
}

#footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin-right: 10px;
    color: #999;
  }

  a {
    color: #999;

    &:hover {
      color: #64854c;
    }
  }
}

.container {
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  width: 100px;
  text-align: center;
  bottom: 0px;
  height: 650px;
  z-index: 1;
  transform: scale(2, 2);
  -ms-transform: scale(2, 2); /* IE 9 */
  -webkit-transform: scale(2, 2); /* Safari and Chrome */

  .socks {
    position: absolute;
    top: 80px;
    left: 10px;
    z-index: 1;
    transform: rotate(10deg);
    animation: 1.9s deco linear infinite;
  }

  .socks.two {
    position: absolute;
    top: 143px;
    left: -40px;
    z-index: 1;
    transform: rotate(-10deg);
  }

  // .socks:hover {
  // animation: 1.9s deco linear infinite;
  // }
  .top {
    position: absolute;
    width: 15px;
    height: 35px;
    background: #E54B4B;
    border-radius: 5px;
  }

  .foot {
    position: absolute;
    top: 20px;
    left: 0;
    width: 25px;
    height: 15px;
    border-radius: 30px;
    background: #E54B4B;
  }

  .foot.two {
    position: absolute;
    top: 20px;
    left: -10px;
    width: 25px;
    height: 15px;
    border-radius: 30px;
    background: #E54B4B;
  }

  .tree {
    position: absolute;
  }

  .base {
    width: 210px;
    height: 10px;
    background: transparent;
    position: absolute;
    top: 304px;
    left: -45px;
    border-radius: 100%;
  }

  .base:after {
    content: '';
    width: 20px;
    height: 20px;
    background: #84714F;
    position: absolute;
    top: -25px;
    left: 83px;
  }

  .layer {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid #499F68;
  }

  .layer.two {
    position: absolute;
    top: 30px;
    left: -10px;
    border-left: 60px solid transparent;
    border-right: 60px solid transparent;
    border-bottom: 120px solid #499F68;
  }

  .layer.three {
    position: absolute;
    top: 50px;
    left: -30px;
    border-left: 80px solid transparent;
    border-right: 80px solid transparent;
    border-bottom: 160px solid #499F68;
  }

  .layer.four {
    position: absolute;
    top: 80px;
    left: -50px;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-bottom: 200px solid #499F68;
  }

  .bauble {
    z-index: 1;
    position: absolute;
    border-radius: 100%;
  }

  .bauble.one {
    top: 65px;
    width: 13px;
    height: 13px;
    background: #FFE066;
  }

  .bauble.two {
    top: 105px;
    left: -30px;
    width: 13px;
    height: 13px;
    background: #FFE066;
  }

  .bauble.three {
    top: 110px;
    left: 15px;
    width: 13px;
    height: 13px;
    background: #FFE066;
  }

  .bauble.four {
    top: 163px;
    left: -30px;
    width: 13px;
    height: 13px;
    background: #FFE066;
  }

  .deco {
    position: absolute;
    top: 130px;
    left: 30px;
    width: 50px;
    height: 20px;
    background: #EF476F;
    /* border-radius: 100% 100% 100% 100%; */
    transform: rotate(0deg);
  }

  .deco:after {
  }

  .line {
    z-index: 1;
    position: absolute;
    top: 70px;
    left: -43px;
    width: 70px;
    height: 0;
    background: #FFE066;
    border: 1px dashed #FFF;
    transform: rotate(-30deg);
  }

  .line.two {
    top: 93px;
    left: -50px;
    width: 85px;
    height: 0;
    background: #FFE066;
    border: 1px dashed #FFF;
    transform: rotate(-30deg);
  }

  .line.three {
    top: 123px;
    left: -60px;
    width: 106px;
    height: 0;
    background: #FFE066;
    border: 1px dashed #FFF;
    transform: rotate(-30deg);
  }

  .line.four {
    top: 153px;
    left: -80px;
    width: 136px;
    height: 0;
    background: #FFE066;
    border: 1px dashed #FFF;
    transform: rotate(-30deg);
  }

  .pressie {
    z-index: 1;
    position: absolute;
    top: 250px;
    left: 120px;
    width: 60px;
    height: 60px;
    background: #F45B69;
  }

  .cover {
    position: absolute;
    left: -3px;
    width: 66px;
    height: 10px;
    background: #F45B69;
    border-bottom: 1px solid #AAA;
  }

  .wrap {
    position: absolute;
    left: 25px;
    background: #59C3C3;
    width: 10px;
    height: 60px;
  }

  .ribbon {
    position: absolute;
    top: -30px;
    left: 10px;
    background: #FFF;
    width: 12px;
    height: 25px;
    border-radius: 0 80% 20% 80%;
    border: 3px solid #59C3C3;
    transform: rotate(-10deg);
  }

  .ribbon:after {
    position: absolute;
    top: 0;
    left: 20px;
    background: #FFF;
    width: 12px;
    height: 25px;
    border-radius: 0 80% 20% 80%;
    border: 3px solid #59C3C3;
    transform: rotate(60deg);
    content: '';
  }

  .pressie:hover {
    animation: 0.5s move linear infinite;
  }

  @keyframes move {
    0% {
      transform: rotate(10deg);
    }

    50% {
      transform: rotate(-30deg);
    }

    100% {
      transform: rotate(10deg);
    }
  }

  @keyframes deco {
    0% {
      transform: rotate(5deg);
    }

    50% {
      transform: rotate(-10deg);
    }

    100% {
      transform: rotate(5deg);
    }
  }

  .light {
    box-shadow: 1px 1px 10px #CCC, -2px 1px 10px #CCC, 0 -1px 10px #CCC;
  }

  .star {
    z-index: 1;
    position: absolute;
    left: -49px;
    top: -40px;
    display: block;
    color: red;
    width: 0px;
    height: 0px;
    border-right: 100px solid transparent;
    border-bottom: 70px solid #FFE066;
    border-left: 100px solid transparent;
    transform: rotate(35deg) scale(0.2);
  }

  .star:before {
    border-bottom: 80px solid #FFE066;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    position: absolute;
    height: 0;
    width: 0;
    top: -45px;
    left: -65px;
    display: block;
    content: '';
    transform: rotate(-35deg);
  }

  .star:after {
    position: absolute;
    display: block;
    color: red;
    top: 3px;
    left: -105px;
    width: 0px;
    height: 0px;
    border-right: 100px solid transparent;
    border-bottom: 70px solid #FFE066;
    border-left: 100px solid transparent;
    transform: rotate(-70deg);
    content: '';
  }

  .star.two {
    transform: rotate(23deg) scale(0.1);
    position: absolute;
    top: 102px;
    left: -60px;
  }
}
</style>
