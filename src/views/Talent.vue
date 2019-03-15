<template>
  <div>
    <el-container style="height: 100%">
      <el-header>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-input
              v-model="query.name"
              placeholder="输入姓名"
              size="mini"
            >
              <template slot="prepend">
                姓名
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="query.sexual"
              placeholder="选择性别"
              size="mini"
            >
              <el-option
                v-for="gender in genderList"
                :key="gender.value"
                :label="gender.text"
                :value="gender.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-date-picker
              v-model="query.employDate"
              type="date"
              size="mini"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-col>
          <el-col :span="3">
            <el-button
              size="mini"
              type="info"
              plain
              @click="searchTalent"
            >
              查询
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="openEdit"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <transition
          appear
          appear-active-class="animated zoomInUp"
          enter-active-class="animated zoomInUp"
          mode="out-in"
          name="custom-classes-transition"
        >
          <el-table
            :data="tableData"
            border
            stripe
          >
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="sexual"
              label="性别"
              :formatter="genderFormat"
            />
            <el-table-column
              prop="department.departName"
              label="部门名称"
            />
            <el-table-column
              prop="employDate"
              label="入职日期"
            />
            <el-table-column
              prop="graduation"
              label="毕业院校"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="openEdit(scope.row, scope.$index)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </transition>
      </el-main>
      <el-footer>
        <el-pagination
          :total="pageInfo.total"
          :current-page.sync="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          layout="total, prev, pager, next, jumper"
          @current-change="handePageChange"
        />
      </el-footer>
    </el-container>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="formModel">
        <el-form-item
          label="姓名"
          label-width="120px"
        >
          <el-input
            v-model="formModel.name"
            type="text"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          label="性别"
          label-width="120px"
          size="mini"
        >
          <el-select
            v-model="formModel.sexual"
            placeholder="选择性别"
            size="mini"
          >
            <el-option
              v-for="gender in genderList"
              :key="gender.value"
              :label="gender.text"
              :value="gender.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部门"
          label-width="120px"
        >
          <el-select
            v-model="formModel.department.id"
            placeholder="选择部门"
            size="mini"
          >
            <el-option
              v-for="depart in departList"
              :key="depart.id"
              :label="depart.departName"
              :value="depart.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="雇佣日期"
          label-width="120px"
        >
          <el-date-picker
            v-model="formModel.employDate"
            type="date"
            size="mini"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Talent',
  data () {
    return {
      dialogTitle: '新增',
      dialogVisible: false,
      pageInfo: {
        pageSize: 5,
        pageNum: 1,
        total: 0
      },
      departList: [],
      formModel: {
        id: Number,
        name: '',
        sexual: '',
        employDate: '',
        department: {
          id: Number,
          departName: '',
          departPhone: ''
        }
      },
      query: {
        name: '',
        sexual: '',
        employDate: ''
      },
      genderList: [
        {
          value: '0',
          text: '女'
        },
        {
          value: '1',
          text: '男'
        },
        {
          value: '2',
          text: '未知'
        }
      ],
      tableData: []
    }
  },
  created () {
    this.searchTalent()
    // 一旦页面北加载，向后台请求department
    window.axios.post('/api/department/all').then(res => {
      for (let index in res.data) {
        this.departList.push(res.data[index])
      }
    })
  },
  methods: {
    searchTalent () {
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
        for (let index in res.data.list) {
          this.tableData.push(res.data.list[index])
        }
        // 给pageInfo赋值
        this.pageInfo.pageNum = res.data.pageNum
        this.pageInfo.pageSize = res.data.pageSize
        this.pageInfo.total = res.data.total
      })
    },
    handePageChange () {
      // 出发后台查询
      this.searchTalent()
    },
    genderFormat (row, column, cellValue, index) {
      switch (cellValue) {
        case '1':
          return '男'
        case '0':
          return '女'
        default:
          return '未知'
      }
    },
    openEdit (data, index) {
      // 如果有data，代表更新，没有代表新增
      if (data && index !== undefined) {
        // 更新formModel
        this.formModel.id = data.id
        this.formModel.name = data.name
        this.formModel.sexual = data.sexual
        this.formModel.employDate = data.employDate
        this.formModel.department = { id: data.department.id, departName: data.department.departName, departPhone: data.department.departPhone }
      } else {
        this.formModel.id = null
        this.formModel.name = ''
        this.formModel.sexual = ''
        this.formModel.employDate = ''
        this.formModel.department = { id: null, departName: '', departPhone: '' }
      }
      this.dialogVisible = true
    },
    save () {
      // 保存新增或者修改的数据
      let that = this
      this.axios.post('/api/talent/save', this.formModel).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
          'onClose': function () {
            that.dialogVisible = false
            that.searchTalent()
          }
        })
      })
    },
    handleDelete (data, index) {
      // 是否确认删除
      this.$confirm('是否确认删除', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.axios.delete('/api/talent/' + data.id).then(res => {
          this.$message({ message: '删除成功', 'type': 'success' })
          // 清楚当前的表中删除的数据
          if (this.tableData.length === 1 && this.pageInfo.pageNum > 1) {
            this.pageInfo.pageNum -= 1
            this.searchTalent()
          } else {
            this.searchTalent()
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
