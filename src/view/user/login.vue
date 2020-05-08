<template>
    <div class="page login">
        <el-card shadow="hover" class="login-card">
            <template #header>
                <p>SYNDOLLAR</p>
            </template>

            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item prop="accountId">
                    <el-input v-model="form.accountId" @keyup.enter.native="submitForm" placeholder="请输入账号/手机号/邮箱">
                        <template #prepend><i class="iconfont icon-account"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input @keyup.enter.native="submitForm" type="password" v-model="form.password" autocomplete="off" placeholder="输入登录密码">
                        <template #prepend><i class="iconfont icon-lock"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm" class="login-btn" :loading="isLoading">登 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 录</el-button>
                    <p class="tips">忘记密码？</p>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'login',

    data () {
        return {
            form: {
                accountId: '',
                password: ''
            },
            rules: {
                accountId: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入登录密码',
                        trigger: 'blur'
                    }
                ]
            },
            isLoading: false
        }
    },

    methods: {
        ...mapActions('user', ['userLoginX']),

        async submitForm () {
            const valid = await this.$refs['form'].validate()
            if (!valid) return
            this.isLoading = true
            const response = await this.userLoginX(this.form)
            this.isLoading = false
            if (response.code === 200) {
                this.$router.push('/')
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg
                })
            }
        }
    }
}
</script>
<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.page.login {
    width: 100%;
    height: 100%;
    background-color: $neut3;

    .login-page{
        width: 100%;
        height: 100vh;
    }
    .login-card {
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        .login-btn {
            width: 100%;
            font-size: 18px;
        }
        .tips {
            color: gray;
        }
    }
}
</style>