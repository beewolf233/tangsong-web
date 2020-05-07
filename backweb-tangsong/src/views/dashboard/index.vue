<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="addopen">新增诗歌</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="书籍">
        <template slot-scope="scope">
          {{ scope.row.book }}
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">
          {{ scope.row.auther }}
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <span class="text-overflow2">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span class="text-overflow2">{{ scope.row.descript }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelClick(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="handleEditClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="margin-top:20px;text-align:center"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增诗歌 弹框 -->
    <el-dialog
      title="新增诗歌"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.auther" />
        </el-form-item>
        <el-form-item label="书名">
          <el-input v-model="form.book" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.descript"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
          />
        </el-form-item>
        <el-form-item label="繁文标题">
          <el-input v-model="form.traditionTitle" />
        </el-form-item>
        <el-form-item label="繁文作者">
          <el-input v-model="form.traditionAuther" />
        </el-form-item>
        <el-form-item label="繁文书名">
          <el-input v-model="form.traditionBook" />
        </el-form-item>
        <el-form-item label="繁文内容">
          <el-input
            v-model="form.traditionContent"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      listLoading: true,
      dialogVisible: false,
      formState: 'add',
      id: null,
      form: {
        title: '',
        content: '',
        book: '',
        auther: '',
        descript: '',
        traditionTitle: '',
        traditionContent: '',
        traditionBook: '',
        traditionAuther: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 删除操作
    handleDelClick(item) {
      this.axios.post(this.apiNames.apiPoemDel, {
        id: item._id
      }).then((response) => {
        const { recode, msg } = response
        if (recode === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.fetchData()
        }
      })
    },
    // 编辑操作
    handleEditClick(item) {
      this.id = item._id
      this.formState = 'edit'
      this.form = {
        title: item.title,
        content: item.content,
        book: item.book,
        auther: item.auther,
        descript: item.descript,
        traditionTitle: item.traditionTitle,
        traditionContent: item.traditionContent,
        traditionBook: item.traditionBook,
        traditionAuther: item.traditionAuther
      }
      this.dialogVisible = true
    },
    addopen() {
      this.id = null
      this.formState = 'add'
      this.form = {
        title: '',
        content: '',
        book: '',
        auther: '',
        descript: '',
        traditionTitle: '',
        traditionContent: '',
        traditionBook: '',
        traditionAuther: ''
      }
      this.dialogVisible = true
    },
    handleAdd() {
      if (this.formState === 'add') {
        this.axios.post(this.apiNames.apiPoemAdd, this.form).then((response) => {
          const { recode, msg } = response
          if (recode === 200) {
            this.dialogVisible = false
            this.$message({
              message: msg,
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      }
      if (this.formState === 'edit') {
        const params = Object.assign({}, this.form, {
          id: this.id
        })
        this.axios.post(this.apiNames.apiPoemEdit, params).then((response) => {
          const { recode, msg } = response
          if (recode === 200) {
            this.dialogVisible = false
            this.$message({
              message: msg,
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      }
    },
    fetchData() {
      this.listLoading = true
      console.log(this.apiNames.apiPoemList)
      this.axios.post(this.apiNames.apiPoemList, {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then((response) => {
        const { recode, data } = response
        this.listLoading = false
        if (recode === 200) {
          this.total = data.count
          this.list = data.list
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.fetchData()
    }
  }
}
</script>
