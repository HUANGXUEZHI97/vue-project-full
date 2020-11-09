<template>
  <div>
    <div class="write-btn">
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
    <el-row>
      <!-- markdown编辑器的基本操作 -->
      <el-col :span="12">
        <textarea ref="editor" class="md-editor" :value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/monokai-sublime.css';

export default {
  data() {
    return {
      content: `# 哈哈哈哈
* 上课
* 吃饭
* 敲代码
\`\`\`javascript
computed: {
  compiledContent() {
    return marked(this.content, {});
  }
},
\`\`\`
`,
    };
  },
  mounted() {
    this.timer = null;
    this.bindEvent();

    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value;
      },
    });
  },
  computed: {
    compiledContent() {
      return marked(this.content, {});
    },
  },
  methods: {
    bindEvent() {
      this.$refs.editor.addEventListener('paste', async e => {
        const files = e.clipboardData.files;
        console.log(files);

        // TODO:上传
      });
      this.$refs.editor.addEventListener('drop', async e => {
        const files = e.dataTransfer.files;
        console.log(files);
        e.preventDefault();

        // TODO:上传
      });
    },
    update(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.content = e.target.value;
      }, 1500);
    },
    submit() {
      this.$http.post('/article/create', {
        content: this.content, // selected:false
        compiledContent: this.compiledContent,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.md-editor {
  width: 100%;
  height: 100vh;
  outline: none;
}
.write-btn {
  position: fixed;
  z-index: 100;
  right: 30px;
  top: 10px;
}
</style>
