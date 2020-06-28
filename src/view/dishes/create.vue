<template>
    <el-card class="dishes-create" shadow="never">
        <el-form :model="form" :rules="rules" ref="form" label-position="top">
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="dishesName" label="菜品名称">
                                <el-input v-model="form.dishesName" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="englishName" label="英文名称">
                                <el-input v-model="form.englishName" placeholder="请输入英文名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="soldPrice" label="在售价格">
                                <el-input v-model="form.soldPrice" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="primePrice" label="菜品原价">
                                <el-input v-model="form.primePrice" placeholder="默认和原价一样"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="category" label="分类">
                                <el-select v-model="form.category" multiple placeholder="请选择" style="width: 100%">
                                    <el-option
                                            v-for="item in categoryList"
                                            :key="item.categoryId"
                                            :label="item.categoryName"
                                            :value="item.categoryId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="inventory" label="库存">
                                <el-input v-model="form.inventory" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="specification" label="规格">
                                <el-select v-model="form.specification" clearable multiple placeholder="请选择"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in config.specification"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="temperature" label="温度">
                                <el-select v-model="form.temperature" clearable multiple placeholder="请选择"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in config.temperature"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="sugar" label="糖度">
                                <el-select v-model="form.sugar" clearable multiple placeholder="请选择"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in config.sugar"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="cream" label="奶油">
                                <el-select v-model="form.cream" clearable multiple placeholder="请选择"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in config.cream"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-form-item prop="tag" label="标签">
                        <el-select v-model="form.tag" placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in tagList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="description" label="描述">
                        <el-input type="textarea" :rows="4" v-model="form.description" placeholder="请输入"
                                  :maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="dishesImage" label="菜品图片">
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
            <el-button type="primary" @click="submitDishes">完成</el-button>
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
    import {mapState, mapActions} from 'vuex'
    import axios from 'axios'

    export default {
        name: 'dishes-create',
        data() {
            return {
                config: {
                    specification: [{
                        label: '大杯',
                        value: '大杯'
                    }, {
                        label: '中杯',
                        value: '中杯'
                    }, {
                        label: '小杯',
                        value: '小杯'
                    }],
                    temperature: [{
                        label: '冰',
                        value: '冰'
                    }, {
                        label: '常温',
                        value: '常温'
                    }, {
                        label: '热',
                        value: '热'
                    }],
                    sugar: [{
                        label: '全糖',
                        value: '全糖'
                    }, {
                        label: '半糖',
                        value: '半糖'
                    }, {
                        label: '不加糖',
                        value: '不加糖'
                    }],
                    cream: [{
                        label: '默认奶油',
                        value: '默认奶油'
                    }, {
                        label: '无奶油',
                        value: '无奶油'
                    }]
                },
                form: {
                    dishesName: this.$route.query.dishesName,
                    englishName: this.$route.query.englishName,
                    primePrice: this.$route.query.primePrice,
                    soldPrice: this.$route.query.soldPrice,
                    inventory: this.$route.query.inventory,
                    specification: [],
                    temperature: [],
                    sugar: [],
                    cream: [],
                    dishesImage: '',
                    description: this.$route.query.description,
                    category: [],
                    tag: this.$route.query.tag
                },
                rules: {
                    dishesName: [{required: true, message: '请输入菜品名称', trigger: 'blur'}],
                    soldPrice: [{required: true, message: '请输入售价', trigger: 'blur'}],
                    dishesImage: [{required: true, message: '请上传菜品图片', trigger: 'change'}],
                    category: [{required: true, message: '请选择分类', trigger: 'change'}],
                    inventory: [{required: true, message: '请输入库存', trigger: 'blur'},
                        // {pattern: /^\d+$/, message: '必须数字', trigger: 'blur'}
                    ],
                },
                dialogVisible: false,
                isLoading: false,
                fileList: [],
                uploadFileList: [],
                option: {
                    img: '' // 裁剪图片的地址
                },
                tagList: ['新品上市', '热卖', '限时折扣']
            }
        },
        computed: {
            ...mapState('category', {
                categoryList: state => state.categoryList
            }),
            mapCategory() {
                let categoryStr = this.$route.query.category
                if (categoryStr) {
                    return categoryStr.split(',').map(i => {
                        return Number(i)
                    })
                }
                return []
            },
            mapDishesImage() {
                let imageStr = this.$route.query.dishesImage
                if (imageStr) {
                    return imageStr.split(',').map((item, index) => {
                        return {
                            name: `图片 ${index + 1}`,
                            url: item
                        }
                    })
                }
                return []
            },
        },
        methods: {
            ...mapActions('dishes', ['createDishesX', 'editDishesX']),
            ...mapActions('category', ['GET_CATEGORY_LIST']),

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
                const response = await axios.post('admin/upload', formData, {
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
                        soldPrice: Number(this.form.soldPrice),
                        primePrice: Number(this.form.primePrice),
                        inventory: Number(this.form.inventory),
                        category: this.form.category.join(','),
                        tag: this.form.tag,
                        specification: this.form.specification.join(','),
                        temperature: this.form.temperature.join(','),
                        sugar: this.form.sugar.join(','),
                        cream: this.form.cream.join(','),
                    })

                    let response
                    if (this.$route.query.dishesId) {
                        const p = Object.assign({}, this.$route.query, params)
                        response = await this.editDishesX(p)
                    } else {
                        response = await this.createDishesX(params)
                    }

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
            },

            resolveParams(params){
                if (params) {
                    return params.split(',')
                }
                return []
            }
        },
        created() {
            this.form.category = this.mapCategory
            this.form.specification = this.resolveParams(this.$route.query.specification)
            this.form.temperature = this.resolveParams(this.$route.query.temperature)
            this.form.sugar = this.resolveParams(this.$route.query.sugar)
            this.form.cream = this.resolveParams(this.$route.query.cream)
            this.$set(this, 'fileList', this.mapDishesImage)
            this.form.dishesImage = this.$route.query.dishesImage
            console.log(this.$route.query)
        },
        mounted() {
            this.GET_CATEGORY_LIST()
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

    .dishes-create {
        .button-group {
            margin-top: 20px;
            text-align: right;
        }
    }
</style>
