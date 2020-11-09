<template>
  <div>
    <div ref="dragHead" class="drag">
      <input type="file" name="file" @change="handleFileChange" />
    </div>
    <aside>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
    </aside>
    <div>
      <el-button @click="uploadFile">上 传</el-button>
    </div>
  </div>
</template>

<script>
const UPLOADFILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export default {
  name: 'UploadPhoto',
  data() {
    return {
      file: null,
      uploadProgress: 0,
    };
  },
  async mounted() {
    this.bindEvent();
  },
  methods: {
    // |——————————————————  头像上传  —————————————————|
    bolbToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function () {
          const ret = reader.result
            .split('')
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, '0'))
            .join(' ');
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isGif(file) {
      // GIF89a  or  GIF87a
      // GIF：头6 '47 49 46 38 39 61' or '47 49 46 38 37 61'
      const ret = await this.bolbToString(file.slice(0, 6));
      const isGif = ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61';
      console.log('isGif：', isGif);
      return isGif;
    },
    async isPng(file) {
      // PNG：头8： 89 50 4E 47 0D 0A 1A 0A
      const ret = await this.bolbToString(file.slice(0, 8));
      const isPng = ret === '89 50 4E 47 0D 0A 1A 0A';
      console.log('isPng：', isPng);
      return isPng;
    },
    async isJpg(file) {
      // JPG：头2： FF D8   尾2： FF D9
      const retHead = await this.bolbToString(file.slice(0, 2));
      const retFoot = await this.bolbToString(file.slice(-2, file.size));
      const isJpg = retHead === 'FF D8' && retFoot === 'FF D9';
      console.log('isJpg：', isJpg);
      return isJpg;
    },
    async isImage(file) {
      // 通过文件流来判定上传文件格式
      return (await this.isGif(file)) || (await this.isPng(file)) || (await this.isJpg(file));
    },
    async isLimit(file, limit = UPLOADFILE_SIZE_LIMIT) {
      console.log(this.file.size);
      console.log(limit);
      return this.file.size < limit;
    },
    async uploadFile() {
      if (!(await this.isLimit(this.file))) {
        this.$message.error('文件大小应限制在5M以内');
        return;
      }
      if (!(await this.isImage(this.file))) {
        this.$message.error('文件格式错误，应为gif/jpg/png其中一种。');
        return;
      }

      const form = new FormData();
      form.append('name', 'file');
      form.append('file', this.file);
      const ret = await this.$http.post('/uploadfile', form, {
        onUploadProgress: progress => {
          console.log('progress：', progress);
          this.uploadProgress = Number(((progress.loaded / progress.total) * 100).toFixed(2));
        },
      });
      this.$message.success('上传文件成功！');
    },
    handleFileChange(e) {
      this.uploadProgress = 0; // 重新drag的时候，进度条回退至0

      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    bindEvent() {
      const dragBigFile = this.$refs.dragBigFile;
      const dragHead = this.$refs.dragHead;
      dragHead.addEventListener('dragover', e => {
        dragHead.style.borderColor = 'red';
        e.preventDefault();
      });
      dragHead.addEventListener('dragleave', e => {
        dragHead.style.borderColor = '#eee';
        e.preventDefault();
      });
      dragHead.addEventListener('drag', e => {
        const fileList = e.dataTransfer.files;
        dragHead.style.borderColor = '#eee';
        this.file = fileList[0];
        e.preventDefault();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drag {
  height: 100px;
  line-height: 100px;
  // width: 100px;
  border: 1px dashed #eee;
  border-radius: 4px;
  text-align: center;
  vertical-align: middle;
  &:hover {
    border-color: #188fff;
  }
}
</style>
