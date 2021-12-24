<template>
  <div class="c-avatar-cutter">
    <div class="content">
      <div class="c-right">
        <H3>预览</H3>
        <div class="preview">
          <div class="preview-img"></div>
          <canvas
            ref="$canvas"
            :width="bgTypes[bgType].width"
            :height="bgTypes[bgType].height"
            :class="{ 'canvas--doing': imgURL }"
          ></canvas>
        </div>
      </div>
      <div class="c-left" :class="{ 'c-left--doing': imgURL }">
        <div class="container-box">
          <img ref="$img" :src="imgURL" v-if="imgURL" />
          <div
            class="select-box"
            v-if="imgURL"
            @touchstart="onMouseDown($event, 'move')"
            :style="{
              top: `${selectData.top}px`,
              left: `${selectData.left}px`,
              width: `${selectData.width}px`,
              height: `${selectData.width}px`,
              'background-image': `url(${imgURL})`,
              'background-position': `${-selectData.left}px ${-selectData.top}px`,
              'background-size': `${containerBoxData.width}px ${containerBoxData.height}px`,
            }"
          >
            <ul class="x-line">
              <li @touchstart.stop="onMouseDown($event, 'stretch', 'top')"></li>
              <li></li>
              <li></li>
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'bottom')"
              ></li>
            </ul>
            <ul class="y-line">
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'left')"
              ></li>
              <li></li>
              <li></li>
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'right')"
              ></li>
            </ul>
            <ul class="point">
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'top-left')"
              ></li>
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'top-right')"
              ></li>
              <li
                @touchstart.stop="onMouseDown($event, 'stretch', 'bottom-left')"
              ></li>
              <li
                @touchstart.stop="
                  onMouseDown($event, 'stretch', 'bottom-right')
                "
              ></li>
            </ul>
            <div class="cross"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-btn-group">
      <span class="file-upload">
        <a href="javascript:;" class="icon icon-img">
          <input
            type="file"
            @change="selectImg($event)"
            ref="selectImg"
            accept="image/png,image/jpeg,image/jpg"
          />
          选择图片
        </a>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgSrc: "http://www.luckly-mjw.cn/baseSource/picture-avatar-03.png",
      imgURL: "",
      returnType: "file",
      scaleRate: 1, // 图片缩放比
      minWidth: 20, // 选择框最小宽度
      bgType: "a1",
      bgTypes: {
        a1: { width: 310, height: 310 },
        a2: { width: 100, height: 100 },
        a3: { width: 100, height: 100 },
      },
      containerBoxData: {
        width: 750,
        height: 750,
      },
      selectData: {
        top: 0,
        left: 0,
        width: 0,
        action: "", // 当前进行的操作
        originPoint: {}, // 点击时所在位置
        selectLine: "", // 选择那一条边进行拉伸，为空则不是在拉伸
      },
    };
  },
  created() {
    // 全局监听松开事件，放在在内容选择框外松开
    document.addEventListener("touchend", this.onMouseUp);
    document.addEventListener("touchmove", this.onMouseMove);
  },

  beforeDestroy() {
    document.removeEventListener("touchend", this.onMouseUp);
    document.removeEventListener("touchmove", this.onMouseMove);
  },
  methods: {
    // 上传裁剪好的头像
    uploadAvatar(src) {
      this.imgSrc = src;
      this.showCutter = false;
    },
    // 选中图片
    selectImg(e) {
      let file = e.target.files[0];
      if (file.type.split("/")[0] !== "image") {
        alert("请选择图片！");
        return false;
      }
      let size = Math.floor(file.size / 1024);
      if (size > 2 * 1024) {
        alert("请选择2M以内的图片！");
        return false;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const { selectData, containerBoxData } = this;
        this.imgURL = reader.result;
        this.getImgSize(this.imgURL).then((result) => {
          if (result.width > result.height) {
            // 750为外盒子宽高
            this.scaleRate = 750 / result.width;
            containerBoxData.width = 750;
            containerBoxData.height = Math.floor(
              result.height * this.scaleRate
            );
            selectData.top = 0;
            selectData.left = (750 - containerBoxData.height) / 2;
            selectData.width = containerBoxData.height;
          } else {
            this.scaleRate = 750 / result.height;
            containerBoxData.height = 750;
            containerBoxData.width = Math.floor(result.width * this.scaleRate);
            selectData.left = 0;
            selectData.top = (750 - containerBoxData.width) / 2;
            selectData.width = containerBoxData.width;
          }
          this.setPreview();
        });
      };
      reader.readAsDataURL(file);
    },

    // 获取图片宽高
    getImgSize(url) {
      return new Promise((resolve) => {
        let $img = document.createElement("img");
        $img.src = url;
        $img.style.opacity = 0;
        $img.addEventListener("error", () => {
          document.body.removeChild($img);
          resolve(false);
        });
        $img.addEventListener("load", () => {
          const data = {
            width: $img.naturalWidth,
            height: $img.naturalHeight,
          };
          document.body.removeChild($img);
          resolve(data);
        });
        document.body.appendChild($img);
      });
    },

    // 从base64转化为file文件
    base64ToFile(base64Str, fileName) {
      const params = base64Str.split(",");
      const mime = params[0].match(/:(.*?)/)[1];
      const fileData = atob(params[1]); // 解码Base64
      let { length } = fileData;
      const uint8Array = new Uint8Array(length);
      while (length) {
        length -= 1;
        uint8Array[length] = fileData.charCodeAt(length);
      }
      return new File([uint8Array], fileName, { type: mime });
    },

    // 获取驼峰写法
    getCamelCase(text) {
      return text.replace(/-[a-z]+?/g, (matchStr) => matchStr[1].toUpperCase());
    },

    // 获取首单词大写
    getWord(text) {
      return text[0].toUpperCase() + text.substr(1);
    },

    // 鼠标点击
    onMouseDown(event, action, direction) {
      console.log(event.targetTouches[0].clientX);
      const { selectData } = this;
      selectData.action = action;
      selectData.direction = direction || "";
      selectData.originPoint = {
        x:
          event.targetTouches[0].clientX > 0
            ? event.targetTouches[0].clientX
            : 0,
        y:
          event.targetTouches[0].clientY > 0
            ? event.targetTouches[0].clientY
            : 0,
      };
    },

    // 鼠标松开
    onMouseUp() {
      const { selectData } = this;
      selectData.action = "";
      selectData.direction = "";
    },

    // 鼠标移动
    onMouseMove(event) {
      console.log(1);
      const { selectData, containerBoxData } = this;
      const { x, y } = selectData.originPoint;
      const moveX = event.targetTouches[0].clientX - x; // X轴移动的距离
      const moveY = event.targetTouches[0].clientY - y; // Y轴移动的距离
      if (selectData.action === "move") {
        // 移动选择框
        this.doMove(selectData, containerBoxData, moveX, moveY);
      } else if (selectData.action === "stretch") {
        // 拉伸选择框
        this.doStretch(selectData, containerBoxData, moveX, moveY);
      } else {
        return;
      }

      selectData.originPoint = {
        x:
          event.targetTouches[0].clientX > 0
            ? event.targetTouches[0].clientX
            : 0,
        y:
          event.targetTouches[0].clientY > 0
            ? event.targetTouches[0].clientY
            : 0,
      };

      this.setPreview();
    },

    // 选择框移动
    doMove(selectData, containerBoxData, moveX, moveY) {
      selectData.top += moveY;
      selectData.left += moveX;
      if (selectData.top < 0) {
        selectData.top = 0;
      }
      if (selectData.left < 0) {
        selectData.left = 0;
      }
      if (selectData.top + selectData.width > containerBoxData.height) {
        selectData.top = containerBoxData.height - selectData.width;
      }
      if (selectData.left + selectData.width > containerBoxData.width) {
        selectData.left = containerBoxData.width - selectData.width;
      }
    },

    // 选择框拉伸
    doStretch(selectData, containerBoxData, moveX, moveY) {
      const { minWidth } = this;

      // 获取溢出长度
      function getOverflowLength() {
        const overflowLeft = selectData.left < 0 ? -selectData.left : 0;
        const overflowTop = selectData.top < 0 ? -selectData.top : 0;
        const overflowRight =
          selectData.left + selectData.width > containerBoxData.width
            ? selectData.left + selectData.width - containerBoxData.width
            : 0;
        const overflowBottom =
          selectData.top + selectData.width > containerBoxData.height
            ? selectData.top + selectData.width - containerBoxData.height
            : 0;
        const overflowWidth =
          selectData.width < minWidth ? minWidth - selectData.width : 0;
        return Math.max(
          overflowLeft,
          overflowTop,
          overflowRight,
          overflowBottom,
          overflowWidth
        );
      }

      // 向左拉伸
      function doStretchLeft(action) {
        let space = moveX;
        space = action === "preDo" ? space : -space;
        selectData.top += space / 2;
        selectData.left += space;
        selectData.width -= space;
      }

      function doStretchRight(action) {
        let space = moveX;
        space = action === "preDo" ? space : -space;
        selectData.top -= space / 2;
        selectData.width += space;
      }

      function doStretchTop(action) {
        let space = moveY;
        space = action === "preDo" ? space : -space;
        selectData.top += space;
        selectData.left += space / 2;
        selectData.width -= space;
      }

      function doStretchBottom(action) {
        let space = moveY;
        space = action === "preDo" ? space : -space;
        selectData.left -= space / 2;
        selectData.width += space;
      }

      function doStretchTopLeft(action) {
        let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : moveY;
        space = action === "preDo" ? space : -space;
        selectData.top += space;
        selectData.left += space;
        selectData.width -= space;
      }

      function doStretchTopRight(action) {
        let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : -moveY;
        space = action === "preDo" ? space : -space;
        selectData.top -= space;
        selectData.width += space;
      }

      function doStretchBottomLeft(action) {
        let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : -moveY;
        space = action === "preDo" ? space : -space;
        selectData.left += space;
        selectData.width -= space;
      }

      function doStretchBottomRight(action) {
        let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : moveY;
        space = action === "preDo" ? space : -space;
        selectData.width += space;
      }

      const doStretchFun = {
        doStretchLeft,
        doStretchRight,
        doStretchTop,
        doStretchBottom,
        doStretchTopLeft,
        doStretchTopRight,
        doStretchBottomLeft,
        doStretchBottomRight,
      }[`doStretch${this.getWord(this.getCamelCase(selectData.direction))}`];

      doStretchFun("preDo");
      let overflowLength = getOverflowLength();
      if (overflowLength > 0) {
        doStretchFun("reset");
      }
    },

    // 设置预览图
    setPreview() {
      const { selectData, scaleRate } = this;
      const $canvas = this.$refs.$canvas.getContext("2d");
      let p = {
        width: this.bgTypes[this.bgType].width,
        height: this.bgTypes[this.bgType].height,
      };

      $canvas.clearRect(0, 0, p.width, p.height);
      $canvas.drawImage(
        this.$refs.$img,
        Math.floor(selectData.left / scaleRate),
        Math.floor(selectData.top / scaleRate),
        selectData.width / scaleRate,
        selectData.width / scaleRate,
        0,
        0,
        p.width,
        p.height
      );
    },

    // 选择图片
    fileChange(event) {},

    // 确认
    onEnter() {
      if (this.imgURL) {
        if (this.returnType === "url") {
          this.uploadAvatar(this.$refs.$canvas.toDataURL()); // 返回链接
        } else if (this.returnType === "file") {
          this.uploadAvatar(
            this.base64ToFile(this.$refs.$canvas.toDataURL(), "avatar.png")
          ); // 返回文件
        }
      } else {
        this.$message("请上传图片", "error");
      }
    },
  },
};
</script>
<!--用户基本信息页面-->
<style scoped lang="stylus">
.c-avatar-cutter {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  user-select: none;
  align-items: center;
  justify-content: center;

  li, ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .content {
    padding: 20px;
    width: 720px;
    background-color: #ffffff;

    .c-left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 720px;
      height: 720px;
      border: solid 1px #e8e8e8;
      background-repeat: round;
      background-image: url('~@/assets/images/empty.png');

      .container-box {
        position: relative;
        width: 750px;
        height: 750px;
      }

      .img-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.6;
      }

      img {
        width: 100%;
        height: 100%;
        opacity: 0.6;
      }

      .select-box {
        position: absolute;
        top: 0;
        left: 0;
        cursor: move;
      }

      .x-line, .y-line {
        display: flex;
        justify-content: space-between;
        position: absolute;
        width: 100%;
        height: 100%;

        li {
          position: relative;
          border: dashed 1px white;
        }

        li:nth-child(1):before {
          position: absolute;
          margin-left: 0px;
          margin-top: 0px;
          width: 30px;
          height: 30px;
          content: '';
          background-color: white;
        }

        li:nth-last-child(1):before {
          position: absolute;
          margin-left: -30px;
          margin-top: -30px;
          width: 30px;
          height: 30px;
          content: '';
          background-color: white;
        }
      }

      .x-line {
        flex-direction: column;

        li:nth-child(1) {
          cursor: n-resize;

          &:before {
            left: 50%;
          }
        }

        li:nth-last-child(1) {
          cursor: s-resize;

          &:before {
            left: 50%;
          }
        }
      }

      .y-line {
        li:nth-child(1) {
          cursor: w-resize;

          &:before {
            top: 50%;
          }
        }

        li:nth-last-child(1) {
          cursor: e-resize;

          &:before {
            top: 50%;
          }
        }
      }

      .point {
        width: 100%;
        height: 100%;

        li {
          position: absolute;
          margin-left: 0px;
          margin-top: 0px;
          width: 30px;
          height: 30px;
          content: '';
          cursor: crosshair;
          background-color: #007ACC;
        }

        li:nth-child(1) {
          top: 2px;
          left: 1px;
          cursor: nw-resize;
        }

        li:nth-child(2) {
          top: 2px;
          right: -2px;
          cursor: ne-resize;
        }

        li:nth-child(3) {
          bottom: -2px;
          left: 1px;
          cursor: sw-resize;
        }

        li:nth-child(4) {
          bottom: -2px;
          right: -2px;
          cursor: se-resize;
        }
      }

      .cross {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        min-width: unset;
        margin-top: -15px;
        margin-left: -15px;
        background-size: cover;
        background-image: url('~@/assets/images/icon-cancel.png');
      }
    }

    .c-left--doing {
      background-image: url('~@/assets/images/empty-pure.png');
    }

    .c-right {
      position: relative;
      font-size: 16px;
      text-align: center;
      margin-bottom: 100px;

      H3 {
        font-size: 25px;
        height: 30px;
        margin-bottom: 50px;
        line-height: 30px;
      }

      .preview {
        position: relative;
        display: flex;
        width: 500px;
        height: 500px;
        border: solid 1px #e8e8e8;
        margin: 0 auto;
        justify-content: center;
        align-items: center;

        .preview-img{
          height: 100%;
          width: 100%;
          position: absolute;
          background-size: 100% 100% !important;
          background: url('~@/assets/images/a1.png') no-repeat;
        }

        canvas {
          border: solid 1px #e8e8e8;
          background-image: url('~@/assets/images/empty.png');
        }
      }
    }
  }

  .c-btn-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .file-upload {
      overflow: hidden;

      .icon {
        position: relative;
        text-decoration: none;
        line-height: 20px;
        font-size: 19px;
        cursor: pointer;
        overflow: hidden;

        input {
          position: absolute;
          width: 100%;
          height: 100%;
          right: 0;
          top: 0;
          opacity: 0;
          // 解决cursor: pointer失效
          font-size: 0;
          cursor: pointer !important;
        }
      }

      .icon-img {
        padding: 20px 20px;
        width: 200px;
        color: #fff;
        text-align: center;
        display: inline-block;
        background-color: #2d8cf0;
        border-radius: 5px;
      }
    }

    .btn-enter {
      background-color: #56B962;
      padding: 0;
      display: inline-block;
      margin: 0 12px;
      width: 100px;
      height: 40px;
      color: white;
      line-height: 40px;
      font-size: 16px;
      border-radius: 20px;
    }

    .btn-enter--disable {
      cursor: not-allowed;
    }
  }
}
</style>