<template>
  <div class="form-container" :v-loading="true">
    <el-form class="filter-container" :inline="true" :model="listQuery">
      <el-form-item label="用户名">
        <el-input v-model="listQuery.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="listQuery.identity" placeholder="用户身份">
          <el-option label="admin" value="admin"></el-option>
          <el-option label="visitor" value="visitor"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="listQuery.registrationTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUser">查询</el-button>
      </el-form-item>
    </el-form>
    <form-table :data="tableData" :col-configs="colConfigs">
      <!-- slot="opt" 不能省略，需要与下面配置项中的对应 -->
      <el-table-column slot="opt">
        <el-button size="mini">查看</el-button>
      </el-table-column>
    </form-table>
    <el-pagination class="form-pagination" background layout="prev,pager,next" :total="100"></el-pagination>
  </div>
</template>

<script>
import formTable from "@/components/form/form-table";

export default {
  layout: "form",
  data() {
    return {
      colConfigs: [
        { prop: "date", label: "日期", width: "180" },
        { prop: "name", label: "姓名", width: "180" },
        { prop: "address", label: "地址", width: "" },
        { slot: "opt" }
      ],
      listQuery: {
        name: undefined,
        identity: undefined,
        registrationTime: undefined
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    searchUser() {
      console.log("search");
    }
  },
  components: {
    formTable
  },
  mounted() {
    let loading = this.$loading();
    setTimeout(() => {
      loading.close();
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
.form-pagination {
  position: absolute;
  right: 30px;
  margin-top: 30px;
}
</style>