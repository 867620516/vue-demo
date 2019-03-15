<template>
  <div>
    <el-container style="height: 100%">
      <el-header>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input placeholder="员工姓名" size="mini" v-model="query.name">
              <template slot="prepend">姓名</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="query.sexual" placeholder="选择性别" size="mini">
              <el-option
                v-for="gender in genderList"
                :key="gender.value"
                :label="gender.label"
                :value="gender.text">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-date-picker size="mini"
              v-model="query.employDate"
              type="date"
              placeholder="选择日期" format="yyyy-MM-dd">
              >
            </el-date-picker>
          </el-col>
          <el-col :span="3" :offset="4">
            <el-button size="mini" @click="searchTalent">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" border stripe>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="sexual" label="性别">
          </el-table-column>
          <el-table-column prop="department.departName" label="部门名称">
          </el-table-column>
          <el-table-column prop="employDate" label="入职日期">
          </el-table-column>
          <el-table-column prop="graduation" label="毕业院校">
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          layout=" total, prev, pager, next, jumper">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Talent',
  data () {
    return {
      pageInfo: [{
        pageNum: 1,
        pageSize: 5,
        total: 0
      }],
      genderList: [
        {
          value: 0,
          text: '女'
        },
        {
          value: 1,
          text: '男'
        },
        {
          value: 2,
          text: '未知'
        }
      ],
      tableData: [],
      query: [{
        name: '',
        sexual: '',
        employDate: ''
      }]
    }
  },
  created () {
    this.searchTalent()
  },
  methods: {
    handleCurrentChange () {
      // 清空当前数据
      // 触发后台查询
      this.searchTalent()
    },
    searchTalent () {
      this.$message.info(JSON.stringify(this.query))
      // todo  发查询请求
      window.axios.post('/api/talent', {}, {
        // 以mimeType为：x-www-form-urlencoded形式发送数据的话，参数放在config对象的params中
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          name: this.query.name,
          sexual: this.query.sexual,
          employDate: this.query.employDate,
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize
        }
      }).then(res => {
        // 清空原表单数据
        this.tableData.splice(0, this.tableData.length)
        // 加载新数据 res.data java类型PageInfo
        // console.log(res.data)
        for (let index in res.data.list) {
          this.tableData.push(res.data.list[index])
        }
        // 给pageInfo赋值
        this.pageInfo.pageNum = res.data.pageNum
        this.pageInfo.pageSize = res.data.pageSize
        this.pageInfo.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
