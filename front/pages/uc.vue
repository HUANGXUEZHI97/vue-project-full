<template>
  <article>
    <h1>用户中心</h1>
    <div ref="dragHead" class="drag">
      <input type="file" name="file" @change="handleFileChange" />
    </div>
    <aside>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
    </aside>
    <div>
      <el-button @click="uploadFile">头像上传</el-button>
    </div>
    <hr />
    <div ref="dragBigFile" class="drag">
      <input type="file" name="file" @change="handleBigFileChange" />
    </div>
    <aside>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadBigProgress"></el-progress>
    </aside>
    <div>
      <el-button @click="uploadBigFile">大文件上传</el-button>
    </div>
    <aside>
      <p>计算Hash的进度</p>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="hashProgress"></el-progress>
      <!-- 此处用canvas实现进度条会更加优化 -->
      <!-- icon的多少根据 cube-container 的宽度来确定-->
      <div class="cube-container" :style="{width:cubeWidth+'px'}">
        <!-- chunk.progress -->
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <!-- 状态判定 -->
          <div
            :class="{
              'uploading':chunk.progress>0&&chunk.progress<100,
              'success':chunk.progress=100,
              'error':chunk.progress<0,
            }"
            :style="{'height':chunk.progress+'%'}"
          >
            <!-- 具体的进度 -->
            <i
              class="el-icon-loading"
              style="color:#f56c6c"
              v-if="chunk.progress<100 &&chunk.progress>0"
            ></i>
          </div>
        </div>
      </div>
    </aside>
  </article>
</template>

<script>
import { log } from "util";
import sparkMD5 from "spark-md5";
import { format } from "url";
const CHUNK_SIZE = 0.1 * 1024 * 1024; // 1MB
const UPLOADFILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export default {
  data() {
    return {
      file: null,
      uploadProgress: 0,
      bigFile: null,
      // uploadBigProgress: 0,
      hashProgress: 0,
      chunks: []
    };
  },
  computed: {
    cubeWidth() {
      // 取 this.chunk.length 平方根，然后向上取整（保证能放下），再×16（因为每个方块为16像素，包括border）
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16;
    },
    uploadBigProgress() {
      if (!this.bigFile || this.chunks.length) {
        return 0;
      }

      const loaded = this.chunks
        .map(item => item.chunk.size * item.progress)
        .reduce((acc, cur) => acc + cur, 0);
      return parseInt(((loaded * 100) / this.bigFile.size).toFixed(2));
    }
  },
  async mounted() {
    const ret = await this.$http.get("/user/info");
    console.log(ret);
    this.bindEvent();
  },
  methods: {
    // |——————————————————  头像上传  —————————————————|
    bolbToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"))
            .join(" ");
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isGif(file) {
      // GIF89a  or  GIF87a
      // GIF：头6 '47 49 46 38 39 61' or '47 49 46 38 37 61'
      const ret = await this.bolbToString(file.slice(0, 6));
      const isGif = ret === "47 49 46 38 39 61" || ret === "47 49 46 38 37 61";
      console.log("isGif：", isGif);
      return isGif;
    },
    async isPng(file) {
      // PNG：头8： 89 50 4E 47 0D 0A 1A 0A
      const ret = await this.bolbToString(file.slice(0, 8));
      const isPng = ret === "89 50 4E 47 0D 0A 1A 0A";
      console.log("isPng：", isPng);
      return isPng;
    },
    async isJpg(file) {
      // JPG：头2： FF D8   尾2： FF D9
      const retHead = await this.bolbToString(file.slice(0, 2));
      const retFoot = await this.bolbToString(file.slice(-2, file.size));
      const isJpg = retHead === "FF D8" && retFoot === "FF D9";
      console.log("isJpg：", isJpg);
      return isJpg;
    },
    async isImage(file) {
      // 通过文件流来判定上传文件格式
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    async isLimit(file, limit = UPLOADFILE_SIZE_LIMIT) {
      console.log(this.file.size);
      console.log(limit);
      return this.file.size < limit;
    },
    async uploadFile() {
      if (!(await this.isLimit(this.file))) {
        this.$message.error("文件大小应限制在5M以内");
        return;
      }
      if (!(await this.isImage(this.file))) {
        this.$message.error("文件格式错误，应为gif/jpg/png其中一种。");
        return;
      }

      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      const ret = await this.$http.post("/uploadfile", form, {
        onUploadProgress: progress => {
          console.log("progress：", progress);
          this.uploadProgress = Number(
            ((progress.loaded / progress.total) * 100).toFixed(2)
          );
        }
      });
      this.$message.success("上传文件成功！");
    },
    handleFileChange(e) {
      this.uploadProgress = 0; // 重新drag的时候，进度条回退至0

      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    // |——————————————————  大文件上传  —————————————————|
    createFileChunk(bigFile, size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < this.bigFile.size) {
        chunks.push({ index: cur, file: this.bigFile.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker("./hash.js"); // 开启新的web worker进程
        this.worker.postMessage({ chunks: this.chunks }); // 传递chunks给worker
        this.worker.onmessage = e => {
          // 每算一次新进程（hash.js）都会回传一个信息
          const { progress, hash } = e.data;
          this.hashProgress = Number(progress.toFixed(2));
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async calculateHashIdle() {
      const chunks = this.chunks;
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;

        const appendToSpark = async bigFile => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(bigFile);
            reader.onload = e => {
              spark.append(e.target.result);
              resolve();
            };
          });
        };
        const workLoop = async deadline => {
          // deadline 是 requestIdleCallback 的 IdleDeadline
          // deadline.timeRemaining() 返回的估计数量剩余在当前空闲时段的毫秒
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            //空间时间，且有任务
            await appendToSpark(chunks[count].file);
            count++;
            //如果依然在计算的过程中
            if (count < chunks.length) {
              this.hashProgress = Number(
                (100 * count) / chunks.length.toFixed(2)
              );
            } else {
              this.hashProgress = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop); //在下一次空闲时间启动计算md5
        };
        window.requestIdleCallback(workLoop); //首次启动计算md5
        console.log("首次启动计算md5");
      });
    },
    async calculateHashSample() {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer();
        const reader = new FileReader();

        const bigFile = this.bigFile;
        const size = bigFile.size;
        const offset = 2 * 1024 * 1024;
        //第一个2M，最后一个区块数据全要
        let chunks = [bigFile.slice(0, offset)];

        let cur = offset;
        while (cur < offset) {
          if (cur + offset > size) {
            chunks.push(bigFile.slice(cur, cur + offset));
          } else {
            // 中间区块每2M就取其头、中、尾各两字节
            const mid = (cur + offset) / 2;
            const end = cur + offset;

            chunks.push(bigFile.slice(cur, cur + 2));
            chunks.push(bigFile.slice(mid, mid + 2));
            chunks.push(bigFile.slice(end - 2, end));
          }
          cur += offset;
        }
        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = e => {
          spark.append(e.target.result);
          this.hashProgress = 100;
          resolve(spark.end());
        };
      });
    },
    async mergeRequest() {
      this.$http.post("/mergebigfile", {
        ext: this.bigFile.name.split(".").pop(),
        size: CHUNK_SIZE,
        hash: this.hash
      });
    },
    async uploadChunks(uploadedList) {
      const requests = this.chunks
        .filter(chunk => uploadedList.includes(chunk.name) !== -1)
        .map((chunk, index) => {
          // 此处是每一个文件切片的上传！！！

          //转成promise，变成axios的对象
          const form = new FormData();
          //当前chunk是二进制
          form.append("chunk", chunk.chunk);
          form.append("hash", chunk.hash);
          form.append("name", chunk.name);
          return form;
        })
        .map((form, index) =>
          this.$http.post("/uploadbigfile", form, {
            onUploadProgress: progress => {
              //这里是 每个区块的进度条，整体的进度条要计算
              this.chunks[index].progress = Number(
                ((progress.loaded / progress.total) * 100).toFixed(2)
              );
            }
          })
        );
      // TODO: 并发量控制

      // 所有文件切片上传
      await Promise.all(requests);
      await this.mergeRequest();
    },
    async uploadBigFile() {
      const chunks = this.createFileChunk(this.bigFile);
      // const hashWorker = await this.calculateHashWorker();
      // console.log("hashWorker：", hashWorker);
      // const hashIdle = await this.calculateHashIdle();
      // console.log("hashIdle：", hashIdle);
      // const hashSample = await this.calculateHashSample();
      // console.log("hashSample：", hashSample);

      const hash = await this.calculateHashSample();
      this.hash = hash;

      // 判断文件是否上传过，如果没有，是否又存在的切片
      const {
        data: { uploaded, uploadedList }
      } = await this.$http.post("/checkfile", {
        hash,
        ext: this.bigFile.name.split(".").pop()
      });

      if (uploaded) {
        // 秒传
        return this.$message.success("秒传成功！");
      }

      this.chunks = chunks.map((chunk, index) => {
        //切片的名字 hash+index
        const name = hash + "-" + index;

        return {
          hash,
          name,
          index,
          chunk: chunk.file,
          //设置进度条，已经上传的设置为100否则0
          // progress: 0
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0
        };
      });
      console.log("this.chunks:", this.chunks);

      await this.uploadChunks(uploadedList);
    },
    handleBigFileChange(e) {
      // this.uploadBigProgress = 0; // 重新drag的时候，进度条回退至0
      const [file] = e.target.files;
      if (!file) return;
      this.bigFile = file;
    },
    // |——————————————————  头像和大文件拖拽  —————————————————|
    bindEvent() {
      const dragHead = this.$refs.dragHead;
      const dragBigFile = this.$refs.dragBigFile;
      dragHead.addEventListener("dragover", e => {
        dragHead.style.borderColor = "red";
        e.preventDefault();
      });
      dragHead.addEventListener("dragleave", e => {
        dragHead.style.borderColor = "#eee";
        e.preventDefault();
      });
      dragHead.addEventListener("drag", e => {
        const fileList = e.dataTransfer.files;
        dragHead.style.borderColor = "#eee";
        this.file = fileList[0];
        e.preventDefault();
      });
      dragBigFile.addEventListener("dragover", e => {
        dragBigFile.style.borderColor = "red";
        e.preventDefault();
      });
      dragBigFile.addEventListener("dragleave", e => {
        dragBigFile.style.borderColor = "#eee";
        e.preventDefault();
      });
      dragBigFile.addEventListener("drag", e => {
        const fileList = e.dataTransfer.files;
        dragBigFile.style.borderColor = "#eee";
        this.file = fileList[0];
        e.preventDefault();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drag {
  height: 100px;
  line-height: 100px;
  // width: 100px;
  border: 2px dashed #eee;
  text-align: center;
  vertical-align: middle;
  &:hover {
    border-color: red;
  }
}
hr {
  margin: 100px auto;
  height: 10px;
  background-color: salmon;
  &:hover {
    background-color: slateblue;
  }
}

.cube-container {
  .cube {
    width: 14px;
    height: 14px;
    line-height: 12px;
    border: 1px black solid;
    background-color: #eee;
    float: left;
    > .success {
      background-color: green;
    }
    > .uploading {
      background-color: blue;
    }
    > .error {
      background-color: red;
    }
  }
}
</style>