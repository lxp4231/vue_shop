<template>
    <div class="login_container">
        <div class="login_box">
            <h2 style="color: #2b4b6b">后台管理系统</h2>
            <!--登录表单区 -->
            <el-form
                label-width="0px"
                :model="loginForm"
                :rules="rules"
                ref="loginForm"
            >
                <el-form-item label="" prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        prefix-icon="el-icon-lock"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="login"
                        >登录</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        let checkName = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error('用户名不能为空'))
            } else {
                //在满足不了你的自定义规则的时候，必须要触发callback回调要不然执行不到validate方法，有些人可能直接不写else语句，或者 直接return false了
                callback()
            }
        }
        let checkPass = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error('密码不能为空'))
            } else {
                //必须加callback
                callback()
            }
        }
        return {
            // 绑定表单数据
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 表单验证
            rules: {
                username: [
                    {
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 5,
                        message: '长度在 3 到 5 个字符',
                        trigger: 'blur',
                    },
                    // 自定义验证规则
                    { validator: checkName, trigger: 'blur' },
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur',
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur',
                    },
                    { validator: checkPass, trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        login() {
            this.$refs.loginForm.validate(async (valid) => {
                if (!valid) return
                // 修饰成异步的async,简化操作
                const { data: res } = await this.$http.post(
                    'login',
                    this.loginForm
                )
                // $message
                if (res.meta.status !== 200)
                    return this.$message.error('抱歉，登录失败')
                this.$message({
                    message: '恭喜你，登录成功',
                    type: 'success',
                })
                // 登录成功后保存token
                window.sessionStorage.setItem('token', res.data.token)
                //跳转页面,通过编程式导航
                this.$router.push('/home')
            })
        },
    },
}
</script>

<style lang="less" scoped>
.login_container {
    position: relative;
    height: 100%;
    background: url('../assets/img/login_big.jpg') no-repeat center bottom;
    background-size: 100% 100%;
    .login_box {
        padding: 0 15px;
        width: 400px;
        height: 260px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        // 居中显示的方法，top,left移动50%，再用transform 向xy移动-50%
        // translate(x,y)
        transform: translate(-50%, -50%);
        h2 {
            margin: 15px 0;
            text-align: center;
        }
    }
}
</style>