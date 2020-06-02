<template>
    <el-card class="employ" shadow="never">
        <div slot="header" class="clearfix">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="createOps">新增员工</el-button>
        </div>
        
        <el-table border stripe :data="employList" size="small" v-loading="isLoading">
            <el-table-column label="登录账号" prop="accountId"/>
            <el-table-column label="员工姓名" prop="employName"/>
            <el-table-column label="员工昵称" prop="nickName"/>
            <el-table-column label="生日" prop="birth">
                <template slot-scope="scope">
                    <span>{{ scope.row.birth | date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="性别" prop="sex">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex | gender }}</span>
                </template>
            </el-table-column>
            <el-table-column label="角色" prop="storeRole">
                <template slot-scope="scope">
                    <span>{{ scope.row.storeRole | role }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建日期" prop="createdAt">
                <template slot-scope="scope">
                    <span>{{ scope.row.createdAt | date('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="209px">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                    <el-button type="warning" size="small" @click="editOps(scope.row)">修改</el-button>
                    <el-button type="primary" size="small" @click="reset(scope.row)">重置</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="pagination.total"
            :current-page="pagination.pageNum"
            :page-size="pagination.pageSize"
            @current-change="onPageChange">
        </el-pagination>

        <!-- 新增/修改员工 -->
        <el-dialog :visible.sync="dialogVisible" width="450px" @closed="closeHandler">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item prop="accountId" label="登录账号">
                    <el-input v-model="form.accountId" :disabled="!!form.employId" placeholder="请输入登录账号"></el-input>
                </el-form-item>

                <el-form-item prop="password" label="登录密码" v-if="!form.employId">
                    <el-input v-model="form.password" placeholder="请输入登录密码"></el-input>
                </el-form-item>

                <el-form-item prop="employName" label="员工姓名">
                    <el-input v-model="form.employName" placeholder="请输入员工姓名"></el-input>
                </el-form-item>

                <el-form-item prop="storeRole" label="员工角色">
                    <el-select v-model="form.storeRole" placeholder="请选择" style="width: 410px">
                        <el-option
                            v-for="item in storeRoles"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="nickName" label="员工昵称">
                    <el-input v-model="form.nickName" placeholder="请输入员工昵称"></el-input>
                </el-form-item>

                <el-form-item prop="birth" label="员工生日">
                    <el-date-picker v-model="form.birth" type="date" placeholder="选择日期" style="width: 410px"></el-date-picker>
                </el-form-item>

                <el-form-item prop="sex" label="员工性别">
                    <el-select v-model="form.sex" placeholder="请选择" style="width: 410px">
                        <el-option
                            v-for="item in sexs"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'employ',

    data () {
        return {
            employList: [],
            isLoading: false,
            pagination: {
                pageSize: 15,
                pageNum: 0,
                total: 0
            },
            searchForm: {
                employName: '',
                storeRole: ''
            },
            dialogVisible: false,
            form: {
                employId: '',
                accountId: '',
                password: '',
                employName: '',
                nickName: '',
                birth: '',
                sex: '',
                storeRole: ''
            },
            rules: {
                accountId: [
                    { required: true, message: '请填写登录账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写登录密码', trigger: 'blur' }
                ],
                employName: [
                    { required: true, message: '请填写员工姓名', trigger: 'blur' }
                ],
                storeRole: [
                    { required: true, message: '请选择员工角色', trigger: 'change' }
                ]
            },
            storeRoles: [
                {
                    name: '服务员',
                    value: 'WAITER'
                }, {
                    name: '管理员',
                    value: 'ADMIN'
                }
            ],
            sexs: [
                {
                    name: '男',
                    value: 'M'
                }, {
                    name: '女',
                    value: 'F'
                }
            ]
        }
    },

    created () {
        this.search()
    },

    methods: {
        ...mapActions('employ', ['getEmployListX', 'createEmployX', 'updateEmployX', 'removeEmployX', 'resetEmployX']),

        search () {
            this.pagination.pageNum = 0
            this.getEmployList()
        },

        async getEmployList () {
            this.isLoading = true
            const response = await this.getEmployListX({
                employName: this.searchForm.employName,
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.pageNum
            })
            this.isLoading = false
            if (response.code === 200) {
                this.employList = response.data.rows
                this.pagination.total = response.data.count
            }
        },

        onPageChange (pageNum) {
            this.pagination.pageNum = pageNum
            this.getEmployList()
        },

        // 新增员工
        createOps () {
            this.resetForm()
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },

        // 修改员工
        editOps (row) {
            this.form.employId = row.employId
            this.form.accountId = row.accountId
            this.form.password = row.password
            this.form.employName = row.employName
            this.form.nickName = row.nickName
            this.form.birth = row.birth
            this.form.sex = row.sex
            this.form.storeRole = row.storeRole
            this.dialogVisible = true
        },

        // 新增/修改提交
        async createSubmit () {
            const validate = await this.$refs['form'].validate()
            if (!validate) return
            const params = Object.assign({}, this.form,  { password: this.$encrypt(this.form.password), birth: this.form.birth || undefined })
            let response
            if (this.form.employId) {
                response = await this.updateEmployX(params)
            } else {
                response = await this.createEmployX(params)
            }
            if (response.code === 200) {
                this.dialogVisible = false
                this.getEmployList()
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg
                })
            }
        },

        // 删除员工
        async remove (row) {
            const confirm = await this.$confirm('确定删除员工账号?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            if (!confirm) return
            const response = await this.removeEmployX({ employId: row.employId })
            if (response.code === 200) {
                this.dialogVisible = false
                this.getEmployList()
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg
                })
            }
        },

        // 重置账号密码
        async reset (row) {
            const confirm = await this.$confirm('确定将该员工密码重置为123456?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            if (!confirm) return
            const response = await this.resetEmployX({ employId: row.employId })
            if (response.code === 200) {
                this.dialogVisible = false
                this.getEmployList()
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg
                })
            }
        },

        resetForm () {
            this.form.employId = ''
            this.form.accountId = ''
            this.form.password = ''
            this.form.employName = ''
            this.form.nickName = ''
            this.form.birth = ''
            this.form.sex = ''
            this.form.storeRole = ''
        },

        closeHandler () {
            this.resetForm()
            this.$refs.form.resetFields()
        }
    }
}
</script>
<style lang="scss">
</style>