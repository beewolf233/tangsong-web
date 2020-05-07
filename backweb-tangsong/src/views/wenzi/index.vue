<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="addopen">新增文字</el-button>
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
      <el-table-column label="简体字" width="95">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="繁体字" width="95">
        <template slot-scope="scope">
          {{ scope.row.traditionname }}
        </template>
      </el-table-column>
      <el-table-column label="笔划">
        <template slot-scope="scope">
          <div class="wenzi-piclist">
            <img v-for="(item, index) in scope.row.pic" :key="index" :src="item.url" alt="">
          </div>
          <!-- {{ scope.row.pic }} -->
        </template>
      </el-table-column>
      <el-table-column label="背景图">
        <template slot-scope="scope">
          <div class="wenzi-piclist">
            <img v-for="(item, index) in scope.row.backpic" :key="index" :src="item.url" alt="">
          </div>
          <!-- {{ scope.row.backpic }} -->
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
      title="新增文字"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="简体字">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="繁体字">
          <el-input v-model="form.traditionname" />
        </el-form-item>
        <el-form-item label="背景图">
          <!-- :auto-upload="false" -->
          <el-upload
            ref="“uploadfile”"
            action="/api/uploadwenzi"
            list-type="picture-card"
            :file-list="backpicList"
            :on-success="(response, file, fileList) => {
              handleSuccess(response, file, fileList, 'backpic')
            }"
            :on-error="handleError"
            :on-change="handleChangePic"
            :before-upload="beforeUpload"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="笔划">
          <!-- :auto-upload="false" -->
          <el-upload
            ref="“uploadfile”"
            action="/api/uploadwenzi"
            list-type="picture-card"
            :file-list="picList"
            multiple
            :on-success="(response, file, fileList) => {
              handleSuccess(response, file, fileList, 'pic')
            }"
            :on-error="handleError"
            :on-change="handleChangePic"
            :before-upload="beforeUpload"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
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
      dialogImageUrl: '',
      dialogImageVisible: false,
      disabled: false,
      picList: [],
      backpicList: [],
      form: {
        name: '',
        traditionname: '',
        pic: [],
        backpic: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 删除操作
    handleDelClick(item) {
      this.axios.post(this.apiNames.apiWenziDel, {
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
        name: item.name,
        traditionname: item.traditionname,
        pic: item.pic,
        backpic: item.backpic
      }
      this.picList = item.pic
      this.backpicList = item.backpic
      this.dialogVisible = true
    },
    addopen() {
      this.id = null
      this.formState = 'add'
      this.form = {
        name: '',
        traditionname: '',
        pic: [],
        backpic: []
      }
      this.picList = []
      this.backpicList = []
      this.dialogVisible = true
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleChangePic(file, fileList) {
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(response, file, fileList, type) {
      const { recode, msg, data } = response
      if (recode === 200) {
        console.log('success')
        if (type === 'pic') {
          this.form.pic.push({
            name: data[0].fileName,
            url: data[0].filePath
          })
        } else {
          this.form.backpic.push({
            name: data[0].fileName,
            url: data[0].filePath
          })
        }
      } else {
        if (type === 'pic') {
          this.form.pic = this.form.pic.length > 1 ? this.form.pic.pop() : []
        } else {
          this.form.backpic = this.form.backpic.length > 1 ? this.form.backpic.pop() : []
        }
        this.$message.error(msg)
      }
    },
    handleError(err, file, fileList) {
      console.log(err)
    },
    beforeUpload(file) {
    },
    handleAdd() {
      // const sortArr =
      this.form.pic.sort((a, b) => {
        const aNumber = a.url.replace(/[^0-9]/ig, '')
        const bNumber = b.url.replace(/[^0-9]/ig, '')
        return parseInt(aNumber) - parseInt(bNumber)
      })
      // console.log(sortArr, 999000)
      const params = {
        name: this.form.name,
        traditionname: this.form.traditionname,
        pic: JSON.stringify(this.form.pic),
        backpic: JSON.stringify(this.form.backpic)
      }
      if (this.formState === 'add') {
        // const params = JSON.stringify(this.form)
        this.axios.post(this.apiNames.apiSumbitwenzi, params).then((response) => {
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
        const paramsTwo = Object.assign({}, params, {
          id: this.id
        })
        this.axios.post(this.apiNames.apiSumbitwenzi, paramsTwo).then((response) => {
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
      console.log(this.apiNames.apiGetwenzi)
      this.axios.post(this.apiNames.apiGetwenzi, {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then((response) => {
        const { recode, data } = response
        this.listLoading = false
        if (recode === 200) {
          this.total = data.count
          if (data.list) {
            data.list.forEach(ele => {
              ele.backpic = JSON.parse(ele.backpic)
              ele.pic = JSON.parse(ele.pic)
            })
          }
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
<style lang="scss" scoped>
.wenzi-piclist{
  img{
    width:60px;
    height: 60px;
    margin: 5px;
    border: 1px solid #eee;
  }
}
</style>
