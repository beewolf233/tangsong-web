<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="首页轮播图设置">
        <el-upload
          ref="“uploadfile”"
          action="/api/uploadbanner"
          list-type="picture-card"
          :file-list="fileList"
          :on-success="handleSuccess"
          :on-error="handleError"
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="cropVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 4], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      filename: '',
      cropVisible: false,
      loading: false,
      cropState: false,
      cropFile: null,
      id: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      this.axios.post(this.apiNames.apiSubmitBanner, {
        banner: JSON.stringify(this.fileList),
        id: this.id
      }).then((response) => {
        const { recode, msg } = response
        if (recode === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      })
      // this.$message('submit!')
    },
    onCancel() {
      this.fetchData()
    },
    fetchData() {
      this.axios.post(this.apiNames.apiGetBanner, {
      }).then((response) => {
        const { recode, data } = response
        if (recode === 200) {
          const { banner, id } = data
          this.fileList = banner || []
          this.id = id || null
          console.log(data)
        }
      })
    },

    // handleRemove(file) {
    //   console.log(file)
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      const findIndex = this.fileList.findIndex(item => {
        return item.name === file.name
      })
      this.fileList.splice(findIndex, 1)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(response, file, fileList) {
      const { recode, msg } = response
      if (recode === 200) {
        console.log('success')
      } else {
        this.fileList = this.fileList.length > 1 ? this.fileList.pop() : []
        this.$message.error(msg)
      }
    },
    handleError(err, file, fileList) {
      console.log(err)
    },
    async beforeUpload(file) {
      console.log(file, file.name)
      this.filename = file.name
      return new Promise((resolve, reject) => {
        const types = ['image/jpeg', 'image/bmp', 'image/png']
        const isImage = types.includes(file.type)
        if (!isImage) {
          this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
          reject()
          return
        }
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!')
          reject()
          return
        }
        this.isSize(file).then(() => {
          resolve()
        }).catch((res) => {
          this.cropVisible = true
          this.option.img = res
          this.cropState = true
          // const a = setInterval(() => {
          //   if (this.cropState === false && !this.cropFile) {
          //     clearInterval(a)
          //     reject()
          //   }
          //   if (this.cropState === false && this.cropFile) {
          //     clearInterval(a)
          //     resolve(this.cropFile)
          //   }
          // }, 1000)
          reject()
        })
      })
    },
    isSize(file) {
      return new Promise((resolve, reject) => {
        const width = 700 // 限制图片尺寸为654X270
        const height = 400
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          const valid = img.width / img.height === width / height
          valid ? resolve(file) : reject(_URL.createObjectURL(file))
        }
        img.src = _URL.createObjectURL(file)
      })
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.loading = true
      this.$refs.cropper.getCropBlob((data) => {
        this.loading = false
        console.log(data)
        const formData = new FormData()
        formData.append('file', data, this.filename)
        this.axios.post('/api/uploadbanner', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {
          this.cropVisible = false
          const { recode, msg, data } = response
          if (recode === 200) {
            this.$message.success('裁切图片上传成功！')
            this.fileList.push({
              name: data[0].fileName,
              url: data[0].filePath
            })
          } else {
            this.$message.error(msg)
          }
        })
      })
    }
    // 将base64的图片转换为file文件
    // convertBase64UrlToBlob(urlData) {
    //   const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    //   // 处理异常,将ascii码小于0的转换为大于0
    //   const ab = new ArrayBuffer(bytes.length)
    //   const ia = new Uint8Array(ab)
    //   for (var i = 0; i < bytes.length; i++) {
    //     ia[i] = bytes.charCodeAt(i)
    //   }
    //   return new Blob([ab], { type: 'image/jpeg' })
    // }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.cropper-content{
  width: 400px;
  height: 300px;
  margin: 0 auto;

}
.cropper-content .cropper {
    width: auto;
    height: 300px;
}
.el-upload-list__item>div{
  width: 100%;
  height: 100%;
}
</style>

