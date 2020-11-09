<template>
  <article>
    <!-- <i class="el-icon-loading"></i> -->
    <div class="upload-item">
      <h4 class="upload-title">头像上传（限制大小、格式）：</h4>
      <UploadPhoto />
    </div>
    <div class="upload-item">
      <h4 class="upload-title">大文件上传（切片上传、断点续传、秒传、并发量控制）：</h4>
      <UploadBigFile />
    </div>
    <div class="upload-item">
      <h4 class="upload-title">粘贴上传（支持截图粘贴）：</h4>
      <UploadPaste />
    </div>
  </article>
</template>

<script>
import UploadBigFile from '@/components/upload/upload-bigfile/index';
import UploadPhoto from '@/components/upload/upload-photo/index';
import UploadPaste from '@/components/upload/upload-paste/index';

export default {
  name: 'Uc',
  components: {
    UploadBigFile,
    UploadPhoto,
    UploadPaste,
  },
  async mounted() {
    const ret = await this.$http.get('/user/info');
    console.log(ret);
  },
};
</script>

<style lang="scss" scoped>
.upload-item {
  padding: 50px;
  // max-width: 50%;
  .upload-title {
    margin: 10px 0;
    font-weight: 300;
  }
}
</style>
