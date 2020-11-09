<template>
  <div>
    <div ref="dragBigFile" class="drag">
      <input type="file" name="file" @change="handleBigFileChange" />
    </div>
    <aside>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadBigProgress"></el-progress>
    </aside>
    <div>
      <el-button @click="uploadBigFile">上 传</el-button>
    </div>
    <aside>
      <p>计算Hash的进度</p>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="hashProgress"></el-progress>
      <!-- 此处用canvas实现进度条会更加优化 -->
      <!-- icon的多少根据 cube-container 的宽度来确定-->
      <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
        <!-- chunk.progress -->
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <!-- 状态判定 -->
          <div
            :class="{
              uploading: chunk.progress > 0 && chunk.progress < 100,
              success: chunk.progress == 100,
              error: chunk.progress < 0,
            }"
            :style="{ height: chunk.progress + '%' }"
          >
            <!-- 具体的进度 -->
            <i class="el-icon-loading" style="color: #f56c6c" v-if="chunk.progress < 100 && chunk.progress > 0"></i>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { log } from 'util';
import sparkMD5 from 'spark-md5';
import { format } from 'url';

// const CHUNK_SIZE = 0.1 * 1024 * 1024; // 1MB
const CHUNK_SIZE = 104857; // 约等于100KB
export default {
  name: 'UploadBigFile',
  data() {
    return {
      bigFile: null,
      // uploadBigProgress: 0,
      hashProgress: 0,
      chunks: [],
    };
  },
  computed: {
    cubeWidth() {
      // 取 this.chunk.length 平方根，然后向上取整（保证能放下），再×16（因为每个方块为16像素，包括border）
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16;
    },
    uploadBigProgress() {
      if (!this.bigFile || !this.chunks.length) {
        return 0;
      }

      const loaded = this.chunks
        .map(item => {
          return item.chunk.size * item.progress;
        })
        .reduce((acc, cur) => acc + cur, 0);
      return parseInt((loaded / this.bigFile.size).toFixed(2));
    },
  },
  methods: {
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
        this.worker = new Worker('./hash.js'); // 开启新的web worker进程
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
              this.hashProgress = Number((100 * count) / chunks.length.toFixed(2));
            } else {
              this.hashProgress = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop); //在下一次空闲时间启动计算md5
        };
        window.requestIdleCallback(workLoop); //首次启动计算md5
        console.log('首次启动计算md5');
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
      this.$http.post('/mergebigfile', {
        ext: this.bigFile.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash,
      });
    },
    // 切片上传报错之后，进度条变红，开始重试。
    // 一个切片只能重试三次，如果失败，则整体终止
    async sendRequest(chunks, limit = 3) {
      // limit 是并发数
      // 数组长度是limit，数组是执行栈
      //如:[task1,task2,task3]
      //每次取出头task，并且push新的task到尾部

      return new Promise((resolve, reject) => {
        const len = chunks.length;
        let count = 0;
        let isStop = false;

        // 执行task函数
        const start = async () => {
          if (isStop) return;
          const task = chunks.shift();
          if (task) {
            const { form, index } = task;
            // 上传文件切片
            try {
              await this.$http.post('/uploadbigfile', form, {
                onUploadProgress: progress => {
                  //这里是 每个区块的进度条，整体的进度条要计算
                  this.chunks[index].progress = Number(((progress.loaded / progress.total) * 100).toFixed(2));
                },
              });
              if (count == len - 1) {
                // 最后一个任务
                resolve();
              } else {
                count++;
                // 启动下一个任务
                start();
              }
            } catch (error) {
              this.chunks[index].progress = -1;
              if (task.error < 3) {
                task.error++;
                chunks.unshift(task);
                start();
              } else {
                isStop = true;
              }
            }
          }
        };
        while (limit > 0) {
          // 启动limit个任务
          // setTimeout模拟延时
          setTimeout(() => {
            start();
          }, Math.random() * 2000);
          limit -= 1;
        }
      });
    },
    async uploadChunks(uploadedList) {
      const requests = this.chunks
        .filter(chunk => uploadedList.indexOf(chunk.name) == -1)
        .map((chunk, index) => {
          // 此处是每一个文件切片的上传！！！

          //转成promise，变成axios的对象
          const form = new FormData();
          //当前chunk是二进制
          form.append('chunk', chunk.chunk);
          form.append('hash', chunk.hash);
          form.append('name', chunk.name);
          return { form, index: chunk.index, error: 0 };
        });
      // .map((
      //   { form, index } // 此处的index是chunk自身的index
      // ) =>
      //   this.$http.post("/uploadbigfile", form, {
      //     onUploadProgress: progress => {
      //       //这里是 每个区块的进度条，整体的进度条要计算
      //       this.chunks[index].progress = Number(
      //         ((progress.loaded / progress.total) * 100).toFixed(2)
      //       );
      //     }
      //   })
      // );
      // TODO: TCP请求过多造成卡顿，此处需要控制异步并发数
      // 所有文件切片上传
      // await Promise.all(requests);

      await this.sendRequest(requests);
      await this.mergeRequest();
    },
    async uploadBigFile() {
      if (!this.bigFile) return;

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
        data: { uploaded, uploadedList },
      } = await this.$http.post('/checkfile', {
        hash,
        ext: this.bigFile.name.split('.').pop(),
      });

      if (uploaded) {
        // 秒传
        return this.$message.success('秒传成功！');
      }

      this.chunks = chunks.map((chunk, index) => {
        //切片的名字 hash+index
        const name = hash + '-' + index;

        return {
          hash,
          name,
          index,
          chunk: chunk.file,
          //设置进度条，已经上传的设置为100否则0
          // progress: 0
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0,
        };
      });
      console.log('this.chunks:', this.chunks);

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
      const dragBigFile = this.$refs.dragBigFile;

      dragBigFile.addEventListener('dragover', e => {
        dragBigFile.style.borderColor = 'red';
        e.preventDefault();
      });
      dragBigFile.addEventListener('dragleave', e => {
        dragBigFile.style.borderColor = '#eee';
        e.preventDefault();
      });
      dragBigFile.addEventListener('drag', e => {
        const fileList = e.dataTransfer.files;
        dragBigFile.style.borderColor = '#eee';
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
