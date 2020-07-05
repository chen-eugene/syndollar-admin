<template>
    <el-card class="dishes" shadow="never">
        <div slot="header" class="clearfix">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="createOps">添加菜品</el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="createCategory">添加分类</el-button>
        </div>

        <div class="content">
            <el-tabs class="tab" @tab-click="onTabChange" v-model="searchForm.category">
                <el-tab-pane v-for="(category,index) in categoryList"
                             :key="index"
                             :name="category.categoryId.toString()"
                             :label="category.categoryName">
                    <div class="dishes-list clearfix">
                        <el-card class="dishes-card"
                                 v-for="(item, index) in dishesList"
                                 :key="index"
                                 :body-style="{ padding: '0px' }">
                            <el-carousel class="dishes-preview" height="240px">
                                <el-carousel-item
                                        v-for="(img, key) in item.dishesImage.split(',')"
                                        :key="key"
                                        :style="{ 'background-image': `url(${img})`}"/>
                            </el-carousel>

                            <div class="dishes-aside">
                                <div class="dishes-name">
                                    {{ item.dishesName }}
                                    <el-tag type="info" v-if="item.soldOut" size="mini">已售罄</el-tag>
                                    <el-tag type="danger" v-if="item.tag" size="mini">{{item.tag}}</el-tag>
                                </div>

                                <div class="dishes-price">
                                    <span class="sold"><em>¥</em>{{ item.soldPrice | currency }}</span>
                                    <span class="prime"
                                          v-if="item.soldPrice !== item.primePrice">{{ item.primePrice | currency }}</span>
                                </div>

                                <div class="inventory">
                                    <span>库存:</span>
                                    <span>{{item.inventory}}</span>
                                </div>

                                <div class="dishes-operate">
                                    <el-tooltip class="item" effect="dark" content="打折/降价" placement="top">
                                        <i class="el-icon-discount error" @click="discountOps(item)"></i>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="售罄" placement="top"
                                                v-if="!item.soldOut">
                                        <i class="el-icon-sold-out warning" @click="soldoutOps(item)"></i>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" content="在售" placement="top" v-else>
                                        <i class="el-icon-sell success" @click="soldoutOps(item)"></i>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                        <i class="el-icon-setting success" @click="dishesEdit(item)"></i>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                        <i class="el-icon-delete error" @click="deleteDishes(item)"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <el-pagination
                            class="pagination"
                            background
                            layout="prev, pager, next"
                            :total="pagination.total"
                            :current-page="pagination.pageNum"
                            :page-size="pagination.pageSize"
                            @current-change="onPageChange">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog :visible.sync="discountVisible" width="400px">
            <el-form :model="discountForm" class="discount-form" ref="discountForm">
                <el-form-item prop="primePrice" label="原价">
                    <el-input v-model="discountForm.primePrice" disabled></el-input>
                </el-form-item>

                <el-form-item prop="soldPrice" label="售价">
                    <el-input v-model="discountForm.soldPrice">
                        <el-select v-model="discountForm.quikSale" slot="append" placeholder="快速打折" @change="quickSale">
                            <el-option label="原价" :value="1"></el-option>
                            <el-option label="9折" :value="0.9"></el-option>
                            <el-option label="8折" :value="0.8"></el-option>
                            <el-option label="8.8折" :value="0.88"></el-option>
                            <el-option label="7折" :value="0.7"></el-option>
                            <el-option label="6折" :value="0.6"></el-option>
                            <el-option label="6.8折" :value="0.68"></el-option>
                            <el-option label="5折" :value="0.5"></el-option>
                            <el-option label="3折" :value="0.3"></el-option>
                            <el-option label="1折" :value="0.1"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="discountVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDiscount">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
    import {mapActions, mapState} from 'vuex'

    export default {
        name: 'dishes',
        data() {
            return {
                dishesList: [],
                isLoading: false,
                pagination: {
                    pageSize: 16,
                    pageNum: 1,
                    total: 0
                },
                discountVisible: false,
                discountForm: {
                    dishesId: '',
                    primePrice: '',
                    soldPrice: '',
                    quikSale: ''
                },

                searchForm: {
                    category: ''
                }
            }
        },
        computed: {
            ...mapState('category', {
                categoryList: state => {
                    return state.categoryList
                },
            }),
        },
        watch: {
            categoryList(newValue) {
                if (newValue && newValue.length > 0) {
                    this.searchForm.category = newValue[0].categoryId.toString()
                    this.getDishesList()
                }
            }
        },
        methods: {
            ...mapActions('dishes', ['getDishesListX', 'discountDishesX', 'soldoutDishesX', 'deleteDishesX']),
            ...mapActions('category', ['GET_CATEGORY_LIST']),

            search() {
                this.pagination.pageNum = 0
                this.getDishesList()
            },

            onPageChange(pageNum) {
                this.pagination.pageNum = pageNum
                this.getDishesList()
            },

            // 新增菜品
            createOps() {
                this.$router.push('/dishes/create')
            },

            // 新增分类
            createCategory() {
                this.$router.push('/category/create')
            },

            // 打折
            discountOps(row) {
                this.discountForm.dishesId = row.dishesId
                this.discountForm.primePrice = row.primePrice
                this.discountForm.soldPrice = row.soldPrice
                this.discountVisible = true
            },

            quickSale(discount) {
                this.discountForm.soldPrice = (Number(this.discountForm.primePrice) * discount).toFixed(2)
            },

            // 确认打折
            async confirmDiscount() {
                const options = Object.assign({}, this.discountForm, {
                    soldPrice: Number(this.discountForm.soldPrice)
                })
                const response = await this.discountDishesX(options)
                if (response.code === 200) {
                    this.discountVisible = false
                    this.getDishesList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            },

            // 售罄/在售
            async soldoutOps(row) {
                const confirm = await this.$confirm(`确定设置该菜品为${row.soldOut ? '售罄' : '在售'}状态?`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (!confirm) return
                const response = await this.soldoutDishesX({
                    dishesId: row.dishesId,
                    status: row.soldOut === 0 ? 1 : 0
                })
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: response.msg
                    })
                    this.getDishesList()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.msg
                    })
                }
            },

            async getDishesList() {
                const params = {
                    pageNum: this.pagination.pageNum,
                    pageSize: this.pagination.pageSize,
                    ...this.searchForm
                }
                const res = await this.getDishesListX(params)
                if (res.code === 200) {
                    this.dishesList = res.data.list
                    this.pagination.total = res.data.total
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            },

            dishesEdit(item) {
                console.log(item)
                this.$router.push({
                    path: '/dishes/create',
                    query: {
                        ...item
                    }
                })
            },

            async deleteDishes(item) {
                await this.$confirm('真的要删除吗???')
                    .then(async () => {
                        const params = {
                            dishesId: item.dishesId
                        }
                        const res = await this.deleteDishesX(params)
                        if (res.code === 200) {
                            this.dishesList = res.data.list
                            this.pagination.total = res.data.total
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                    .catch(() => {})
            },

            onTabChange() {
                this.pagination = this.$options.data().pagination
                this.getDishesList()
            }
        },
        mounted() {
            this.GET_CATEGORY_LIST()
        },
    }
</script>
<style lang="scss">
    .dishes {
        > .el-card__body {
            padding-left: 0;
            padding-top: 0;
        }

        .content {
            .tab {
                margin: 20px 20px 0;
            }

            .dishes-list {
                .dishes-card {
                    width: 300px;
                    float: left;
                    margin-left: 20px;
                    margin-top: 20px;
                    position: relative;

                    .dishes-preview {
                        height: 240px;

                        .el-carousel__container {
                            height: 100%;

                            .el-carousel__item {
                                height: 100%;
                                background-size: cover;
                            }
                        }
                    }

                    .dishes-aside {
                        padding: 5px 15px;
                        position: relative;

                        .dishes-name {
                            font-size: 16px;
                            font-weight: bold;
                            color: $neut2;
                        }

                        .dishes-price {
                            line-height: 3em;

                            .sold {
                                font-size: 18px;
                                color: $error;
                                font-weight: bold;

                                em {
                                    font-style: normal;
                                    font-size: 12px;
                                }
                            }

                            .prime {
                                font-size: 14px;
                                font-weight: bold;
                                margin-left: 3px;
                                color: $neut3;
                                text-decoration: line-through;
                            }
                        }

                        .inventory {
                            position: absolute;
                            right: 15px;
                            bottom: 15px;
                            color: $neut3;
                        }

                        .dishes-operate {
                            display: flex;
                            flex-direction: row;
                            position: absolute;
                            top: 5px;
                            right: 15px;

                            i {
                                font-size: 18px;
                                color: $info;
                                cursor: pointer;
                                font-weight: bold;
                                margin-left: 5px;

                                &.warning {
                                    color: $warning;
                                }

                                &.success {
                                    color: $success;
                                }

                                &.error {
                                    color: $error;
                                }

                                &:hover {
                                    color: $primary;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
