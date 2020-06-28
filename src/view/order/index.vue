<template>
    <el-card id="order" shadow="never">

        <div class="content">
            <el-tabs class="tab" @tab-click="onTabChange" v-model="selectedClass">
                <el-tab-pane v-for="item in classList"
                             :key="item.label"
                             :name="item.value"
                             :label="item.label">
                    <div class="order-list clearfix">
                        <el-card class="order-item"
                                 v-for="(order) in orderList"
                                 :key="order.orderId"
                                 :body-style="{ padding: '0px' }">
                            <div class="status" :class="mapStatus(order.status)">{{order.status | statusFilter}}</div>
                            <div class="header clearfix">
                                <img class="avatar" :src="order.customer.avatarUrl" alt="">
                                <div class="info-box">
                                    <div>
                                        <div class="order-id">订单号：{{order.orderId}}</div>
                                        <div class="create-time">创建时间：{{order.createTime}}</div>
                                        <div class="price">价格：<span>￥{{order.price}}</span></div>
                                    </div>
                                    <div class="order-item-nickname">微信：{{order.customer.nickname}}</div>
                                </div>
                                <el-select class="select" placeholder="处理订单" size="small" v-model="order.orderOption"
                                           @change="onOptionChange(order)">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-divider></el-divider>
                            <div class="dishes-item clearfix" v-for="dishes in order.dishesList" :key="dishes.dishesId">
                                <el-image class="image" :src="dishes.dishesImage" fit="cover"></el-image>
                                <div class="info-box">
                                    <div class="name">{{dishes.dishesName}}</div>
                                    <div class="config">{{dishes.config}}</div>
                                </div>

                                <div class="price-box">
                                    <div class="sold-price">售价：<span>￥ {{dishes.soldPrice}}</span></div>
                                    <div class="prime-price">原价：<span>￥ {{dishes.primePrice}}</span></div>
                                </div>
                                <div class="count">× {{dishes.count}}</div>
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

    </el-card>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "index",
        data() {
            return {
                pagination: {
                    pageSize: 15,
                    pageNum: 0,
                    total: 0
                },
                orderList: [],
                classList: [{
                    label: '待处理订单',
                    value: '3'
                }, {
                    label: '全部订单',
                    value: '-1'
                }],
                selectedClass: '3',
                orderStatusClass: '',
                options: [{
                    label: '订单制作中',
                    value: 4
                }, {
                    label: '完成订单',
                    value: 7
                }],

            }
        },
        methods: {
            ...mapActions('order', ['getOrderListX', 'updateStatusX']),

            async getOrderList() {
                const params = {
                    pageNum: this.pagination.pageNum,
                    pageSize: this.pagination.pageSize,
                    status: this.selectedClass !== '-1' ? parseInt(this.selectedClass) : null
                }
                const res = await this.getOrderListX(params)
                if (res.code === 200) {
                    this.orderList = res.data.list
                    this.pagination.total = res.data.total
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            },

            async onOptionChange(val) {
                try {
                    this.$loading().visible = true
                    const params = {
                        orderId: val.orderId,
                        status: val.orderOption
                    }
                    const res = await this.updateStatusX(params)
                    if (res.code !== 200) {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                } finally {
                    this.$loading().close()
                }
            },

            onTabChange() {
                this.getOrderList()
            },

            onPageChange(pageNum) {
                this.pagination.pageNum = pageNum
                this.getOrderList()
            },

            mapStatus(value) {
                switch (value) {
                    case 1:
                    case 2:
                        return "red"
                    case 3:
                        return "green"
                    case 4:
                        return "red"
                    case 5:
                        return "gray"
                    case 6:
                        return "gray"
                }
                return ""
            }
        },
        filters: {
            statusFilter(value) {
                switch (value) {
                    case 1:
                    case 2:
                        return "待支付"
                    case 3:
                        return "已支付"
                    case 4:
                        return "制作中"
                    case 5:
                        return "已取消"
                    case 6:
                        return "已完成"
                }
                return ""
            }
        },
        mounted() {
            this.getOrderList()
        }
    }
</script>

<style scoped lang="scss">

    #order {
        > .el-card__body {
            padding-left: 0;
            padding-top: 0;
        }

        .content {
            .tab {
                margin: 0 20px;
            }

            .order-list {
                width: 100%;

                .order-item {
                    padding: 15px 20px;
                    margin: 20px;
                    color: $neut1;
                    font-size: 14px;
                    font-weight: lighter;
                    position: relative;

                    .status {
                        display: inline-block;
                        width: 120px;
                        height: 30px;
                        line-height: 30px;
                        color: white;
                        text-align: center;
                        border-top-right-radius: 5px;
                        position: absolute;
                        right: 0;
                        top: 0;

                        &.green {
                            background: $success;
                        }

                        &.red {
                            background: $error;
                        }

                        &.gray {
                            background: $neut3;
                        }

                    }

                    .header {
                        .avatar {
                            display: inline-block;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            vertical-align: middle;
                        }

                        .info-box {
                            display: inline-block;
                            vertical-align: middle;
                            width: calc(100% - 450px);
                            margin-left: 20px;

                            .order-id {
                                width: 300px;
                                display: inline-block;
                                color: $neut1;
                                font-size: 14px;
                                font-weight: lighter;
                            }

                            .create-time {
                                display: inline-block;
                                width: 300px;
                            }

                            .nickname {
                                display: inline-block;
                                vertical-align: middle;
                            }

                            .price {
                                display: inline-block;
                                font-size: 14px;
                                font-weight: lighter;
                                color: $neut1;

                                span {
                                    font-weight: bold;
                                    color: $error;
                                }
                            }


                        }

                        .select {

                        }

                    }

                    .dishes-item {
                        position: relative;
                        margin-top: 20px;

                        &:first-child {
                            margin: 0;
                        }

                        .image {
                            width: 50px;
                            height: 50px;
                            border-radius: 5px;
                            vertical-align: middle;
                        }

                        .info-box {
                            display: inline-block;
                            width: 300px;
                            height: 50px;
                            margin-left: 20px;
                            vertical-align: middle;
                            position: relative;

                            .name {
                                font-size: 16px;
                                font-weight: bold;
                                color: $neut1;
                            }

                            .config {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                            }


                        }

                        .price-box {
                            display: inline-block;
                            width: 300px;

                            .sold-price {
                                display: inline-block;
                                color: $neut2;
                            }

                            .prime-price {
                                display: inline-block;
                                margin-left: 20px;
                                text-decoration: line-through;
                                font-size: 12px;
                                color: $neut2;
                            }
                        }


                        .count {
                            display: inline-block;
                            font-size: 16px;
                            color: $error;
                            font-weight: bold;
                        }

                    }

                }


            }
        }


    }

</style>
