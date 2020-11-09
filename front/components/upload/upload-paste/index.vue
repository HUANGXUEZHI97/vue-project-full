<template>
  <div id="upload-file">
    <div id="paste-area" @paste="pasteUploadPirtrue" :style="paste_area_style" tabindex="0" outline="0">
      <!-- <img src="../../images/order/copy.svg" alt="copy" /> -->
      <span><svg-icon icon-class="copy" />将图片按Ctrl+V 粘贴至此处</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadPaste',
  props: {
    // 上传组件额外的class样式
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 10,
    },
    //上传文件的地址
    uploadFile: {
      type: String,
      default: '/uploadfile',
    },
    //上传视频的地址
    uploadVideo: {
      type: String,
      default: '/uploadbigfile',
    },
    //是否支持多选文件
    multiple: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: Array,
      default() {
        return ['.png', '.jpg', '.jpeg', '.xls', '.xlsx', '.doc', '.docx', '.pdf', '.mp4'];
      },
    },
    // 文件最多可上传大小，单位M
    maxFileSize: {
      type: Number,
      default: 50,
    },
    name: {
      type: String,
      default: 'files',
    },
  },
  data() {
    return {
      isVideo: false,
      paste_area_style: {},
      fileList: [],
    };
  },
  methods: {
    //复制粘贴上传图片
    async pasteUploadPirtrue(e) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items) {
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.warning('请截图粘贴上传一张图片，仅支持png、jpg文件格式');
        return;
      }
      const reader = new FileReader();
      const pasteArea = document.querySelector('#paste-area');
      reader.onload = event => {
        pasteArea.innerHTML = `<img class="paste-img" src="${event.target.result}"/>`;
      };
      reader.readAsDataURL(file);

      let beforeFileUpload = await this.beforeFileUpload(file);
      let uploadFileNum = new Promise((resolve, reject) => {
        if (this.fileList.length < this.limit) {
          resolve(true);
        } else {
          this.$message.warning(`当前只能上传${this.limit} 个文件`);
          reject(false);
        }
      });
      Promise.all([beforeFileUpload, uploadFileNum]).then(res => {
        if (res[0]) {
          this.uploadPlans(file);
        }
      });
    },
    //粘贴上传文件
    uploadPlans(file) {
      let form = new FormData();
      form.append('files', file);

      this.$http.post(this.uploadFile, form).then(res => {
        this.handleSuccess(res, file);
      });
    },
    // 上传成功
    handleSuccess(response, file, fileList = []) {
      const { data, code, message, errorMessage } = response;
      console.log(data);
      if (data) {
        this.$message.success('上传文件成功！');
        this.fileList.push(file);
      } else {
        this.$message.error(message || '上传文件失败！');
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    async beforeFileUpload(file) {
      const hasFileType = this.fileType.some(item => file.name.indexOf(item) > -1);
      const isLimit = file.size / 1024 / 1024 < this.maxFileSize;
      this.isVideo = file.name.indexOf('.mp4') > -1;
      // let videoNotRepeatName = true;
      if (!hasFileType) {
        this.$message.error('上传文件格式类型不合法，请重新上传!');
      }
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过 ${this.maxFileSize}MB!`);
      }
      if (this.isVideo) {
        let fileName = file.name.substr(0, file.name.length - 4);
        this.formData = {
          materialType: 3,
          title: fileName,
        };
        // videoNotRepeatName = await this.validateTitle(fileName);
        // if (!videoNotRepeatName) {
        //   this.$message.error('视频标题重复');
        // }
      }
      if (hasFileType && isLimit) {
        return Promise.resolve(true);
      } else {
        return Promise.reject(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#upload-file {
  #paste-area {
    height: 100px;
    border: 1px dashed #aaa;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #188fff;
    outline: none;
    &:focus {
      border-color: #188fff;
    }
    .paste-img {
      max-height: 90%;
      max-width: 90%;
      z-index: 100;
      position: absolute;
    }
  }
}
</style>
