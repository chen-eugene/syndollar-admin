<template>
    <el-card class="dishes" shadow="never">
        <div slot="header" class="clearfix">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="createOps">添加菜品</el-button>
        </div>

        <div class="dishes-list clearfix">
            <el-card class="dishes-card" v-for="(item, index) in dishesList" :key="index" :body-style="{ padding: '0px' }">
                <el-carousel class="dishes-preview">
                    <el-carousel-item 
                        v-for="(img, key) in item.dishesImage.split(',')"
                        :key="key"
                        :style="{ 'background-image': `url(${img})` }"/>
                </el-carousel>

                <div class="dishes-aside">
                    <div class="dishes-name">{{ item.dishesName }}</div>

                    <div class="dishes-price">
                        <span class="sold"><em>¥</em>{{ item.soldPrice | currency }}</span>
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
    </el-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'dishes',

    data () {
        return {
            dishesList: [],
            isLoading: false,
            pagination: {
                pageSize: 15,
                pageNum: 0,
                total: 0
            },
            searchForm: {
                userName: '',
                storeRole: ''
            }
        }
    },

    created () {
        this.search()
    },

    methods: {
        ...mapActions('dishes', ['getDishesListX', 'discountDishesX']),

        search () {
            this.pagination.pageNum = 0
            this.getDishesList()
        },

        async getDishesList () {
            this.isLoading = true
            const response = await this.getDishesListX({
                userName: this.searchForm.userName,
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.pageNum
            })
            this.isLoading = false
            if (response.code === 200) {
                this.dishesList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        onPageChange (pageNum) {
            this.pagination.pageNum = pageNum
            this.getDishesList()
        },

        // 新增菜品
        createOps () {
            this.$router.push('/dishes/create')
        }
    }
}
</script>
<style lang="scss">
    .dishes {
        >.el-card__body {
            padding-left: 0;
            padding-top: 0;
        }

        .dishes-list {
            .dishes-card {
                width: 300px;
                float: left;
                margin-left: 20px;
                margin-top: 20px;

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
                    }
                }
            }
        }
    }
</style>