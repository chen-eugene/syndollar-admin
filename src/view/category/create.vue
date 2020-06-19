<template>
    <el-card class="category-create" shadow="never">
        <el-form :model="form" :rules="rules" ref="form" label-position="top">
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item prop="categoryName" label="分类名称">
                        <el-input v-model="form.categoryName" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item prop="tag" label="标签">
                        <el-select v-model="form.tag" multiple placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in tagList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="description" label="描述">
                        <el-input type="textarea" :rows="4" v-model="form.description" placeholder="请输入"
                                  :maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="categoryImage" label="菜品图片">
                        <el-upload
                                drag
                                action="/api/vi/admin/upload"
                                list-type="picture"
                                :auto-upload="false"
                                :on-change='changeHanlder'
                                :file-list="fileList"
                                :on-remove="removeHandler">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="button-group">
            <el-button plain @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="submitDishes">完成创建</el-button>
        </div>

        <el-dialog title="为了更好的显示效果最好将图片裁剪为我们推荐的大小" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
                <div class="cropper" style="text-align:center">
                    <vueCropper ref="cropper" :img="option.img" autoCrop></vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="finish" :loading="isLoading">确认</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
    import {mapActions} from 'vuex'
    import axios from 'axios'

    export default {
        name: 'dishes-create',

        data() {
            return {
                form: {
                    categoryName: '',
                    tag: '',
                    description: '',
                    categoryImage: ''
                },
                rules: {
                    categoryName: [
                        {
                            required: true, message: '请输入分类名称', trigger: 'blur'
                        }
                    ]
                },
                dialogVisible: false,
                isLoading: false,
                fileList: [],
                uploadFileList: [],
                option: {
                    img: '' // 裁剪图片的地址
                },
                categoryList: [],


                storeList: [],
                tagList: [],

            }
        },

        methods: {
            ...mapActions('dishes', ['createCategoryX']),

            changeHanlder(file) {
                const isLt5M = file.size / 1024 / 1024 < 5
                if (!isLt5M) {
                    this.$message.error('上传文件大小不能超过 5MB!')
                    return false
                }

                this.$nextTick(() => {
                    this.option.img = file.url
                    this.dialogVisible = true
                })
            },

            removeHandler(file, fileList) {
                this.uploadFileList = fileList.slice()
            },

            finish() {
                this.isLoading = true
                this.$refs.cropper.getCropData(data => {
                    const filename = this.$encrypt(data) + '.jpg'
                    data = data.split(',')[1]
                    const byteCharacters = atob(data)
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const array = Uint8Array.from(byteNumbers);
                    const blob = new Blob([array], {type: 'image/jpg'})
                    this.customUpload(blob, filename)
                })
            },

            async customUpload(data, filename) {
                const formData = new FormData()
                formData.append('file', data, filename)
                const response = await axios.post('/upload', formData, {
                    'Content-Type': 'multipart/form-data'
                })
                this.isLoading = false
                if (response.code === 200) {
                    this.uploadFileList.push(response.data)
                    const urls = []
                    this.uploadFileList.forEach(item => {
                        urls.push(item.url)
                    })
                    this.form.dishesImage = urls.join(',')
                    this.$set(this, 'fileList', this.uploadFileList)
                    this.dialogVisible = false
                }
            },

            async submitDishes() {
                try {
                    const validate = await this.$refs['form'].validate()
                    if (!validate) return
                    const params = Object.assign({}, this.form, {
                        tag: this.form.tag.join(',')
                    })
                    const response = await this.createCategoryX(params)
                    if (response.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                        this.$router.go(-1)
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.msg
                        })
                    }
                } catch (exp) {
                    console.log(exp)
                }
            }
        }
    }
</script>
<style lang="scss">
    .cropper-content {
        .cropper {
            width: auto;
            height: 400px;
        }
    }

    .category-create {
        .button-group {
            margin-top: 20px;
            text-align: right;
        }
    }
</style>
