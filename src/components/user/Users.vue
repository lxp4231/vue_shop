<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="25">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList()"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList()"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <!-- 列表区 -->
            <template>
                <el-table :data="userList" style="width: 100%" border stripe>
                    <el-table-column type="index" align="center">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        label="姓名"
                        width="180"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="role_name"
                        label="角色"
                        width="180"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话" align="center">
                    </el-table-column>
                    <el-table-column
                        prop="mg_state"
                        label="状态"
                        align="center"
                    >
                        <!-- 作用域插槽 element-ui的标签就是一个组件，使用作用域插槽才能拿到数据 -->
                        <template v-slot="scope">
                            <!--通过scope.row可以拿到这一行的数据  -->
                            <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChange(scope.row)"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <!-- 直接解构拿到数据 -->
                        <template v-slot="scope">
                            <!-- 修改 -->
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.id)"
                            ></el-button>
                            <!-- 删除 -->
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteUser(scope.row.id)"
                            ></el-button>
                            <!-- 分配角色 -->
                            <el-tooltip
                                effect="dark"
                                content="分配角色"
                                placement="top-start"
                                :enterable="false"
                            >
                                <el-button
                                    type="warning"
                                    icon="el-icon-setting"
                                    size="mini"
                                    @click="setRoleDialog(scope.row)"
                                ></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 分页部分 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
            <!-- 添加用户信息对话框 -->
            <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
            >
                <el-form
                    :model="addForm"
                    :rules="rulesAdd"
                    ref="addForm"
                    label-width="70px"
                >
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="addForm.password"
                            show-password
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="submitAddForm"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
            <!-- 修改用户信息对话框 -->
            <el-dialog
                title="修改用户信息"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
            >
                <el-form
                    :model="editForm"
                    :rules="rulesEdit"
                    ref="editForm"
                    label-width="70px"
                >
                    <el-form-item label="用户名">
                        <el-input
                            v-model="editForm.username"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="submitEditForm"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
            <!-- 分配角色对话框 -->
            <el-dialog
                title="分配角色"
                :visible.sync="roleDialogVisible"
                width="50%"
                @close="setRoleDialogClosed"
            >
                <!-- 角色信息 -->
                <div>
                    <p>当前的用户：{{ userInfo.username }}</p>
                    <p>当前的角色：{{ userInfo.role_name }}</p>
                </div>
                <span>分配新角色：</span>
                <el-select v-model="selectRoleId" placeholder="选择角色">
                    <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                    >
                        <!-- label:看到的选择内容，value：和上边v-model对应，拿到选择的内容 -->
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="roleDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="submitRoleDialog"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Users',

    data() {
        //不能为空的校验
        let check = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error('内容不能为空'))
            } else {
                //必须加callback
                callback()
            }
        }
        //校验邮箱
        let checkEmail = (rule, value, callback) => {
            const regEmail =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('输入正确的邮箱'))
        }
        //校验手机号码
        let checkMobile = (rule, value, callback) => {
            const regMobile =
                /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('输入正确的手机号'))
        }
        return {
            // 用户列表
            userList: [],
            // 角色列表
            roleList: [],
            // 总数据条数
            total: 0,
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页码
                pagenum: 1,
                //一页展示多少数据
                pagesize: 2,
            },
            // 分配权限的用户信息
            userInfo: '',
            //添加用户信息的显示与隐藏
            addDialogVisible: false,
            //修改用户信息的显示与隐藏
            editDialogVisible: false,
            //分配角色的显示与隐藏
            roleDialogVisible: false,
            //保存编辑时查询到的信息
            editForm: {},
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 下拉框选中的角色id
            selectRoleId: '',
            roleForm: {
                rid: '',
            },
            rulesAdd: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 4,
                        max: 8,
                        message: '长度在 4到 8 个字符',
                        trigger: 'blur',
                    },
                    { validator: check, trigger: 'blur' },
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
                    { validator: check, trigger: 'blur' },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur',
                    },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur',
                    },
                    { validator: check, trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
            rulesEdit: {
                email: [
                    {
                        required: false,
                        message: '请输入邮箱地址',
                        trigger: 'blur',
                    },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    {
                        required: false,
                        message: '请输入手机号码',
                        trigger: 'blur',
                    },
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
        }
    },
    //获取角色列表,在created时
    created() {
        this.getUserList()
    },
    methods: {
        //首先渲染列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200) return this.$message(res.meta.msg)
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监视每页条数变化
        handleSizeChange(val) {
            this.queryInfo.pagesize = val
            this.getUserList()
        },
        // 监视当前页码变化
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val
            this.getUserList()
        },
        // 监视状态变化
        userStateChange(val) {
            // 对比处理请求结果的async和 then的不同？？？
            this.$http
                .put(`users/${val.id}/state/${val.mg_state}`)
                .then((res) => {
                    if (res.meta.status !== 200) {
                        // 还先改过来，改回原来状态
                        val.mg_state = !val.mg_state
                        return this.$message.error(res.data.meta.msg)
                    } else {
                        this.$message.success(res.data.meta.msg)
                    }
                })
                .catch((err) => {
                    return new Error(err)
                })
        },
        //添加用户信息
        // 表单验证
        submitAddForm() {
            // 全局校验
            this.$refs.addForm.validate(async (valid) => {
                //async 是哪个回调，添加在哪
                // 验证失败直接返回
                if (!valid) return
                // 验证成功发起请求
                const { data: res } = await this.$http.post(
                    'users',
                    this.addForm
                )
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        // dialog 关闭时调用
        addDialogClosed() {
            this.$refs.addForm.resetFields()
        },
        // 修改用户信息,注：关键点：通过作用域插槽拿到数据
        async showEditDialog(id) {
            // 发送请求
            const { data: res } = await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            // 请求成功
            this.editForm = res.data
            // 显示编辑框
            this.editDialogVisible = true
        },
        //提交更改
        submitEditForm() {
            // 全局校验??????!!!!别忘全局校验，校验通过再发送请求
            this.$refs.editForm.validate(async (valid) => {
                if (!valid) return
                // 发送请求
                const { data: res } = await this.$http.put(
                    `users/${this.editForm.id}`,
                    { email: this.editForm.email, mobile: this.editForm.mobile }
                )
                if (res.meta.status !== 200)
                    return this.$message.error(res.meta.msg)
                // 请求成功
                this.$message.success('更新用户信息成功')
                this.getUserList()
                this.editDialogVisible = false
            })
        },
        // dialog 关闭时调用
        editDialogClosed() {
            this.$refs.editForm.resetFields()
        },
        // 删除用户user
        async deleteUser(id) {
            // 先判断是否要删除,因为返回的结果是promise，所以使用async优化
            const confirmRes = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err) //捕获错误信息
            // 确认删除confirmRes返回的是confirm,取消返回的是cancel
            // 取消
            if (confirmRes != 'confirm') return this.$message.info('取消删除')
            // 确定,执行请求
            const { data: res } = await this.$http.delete(`users/${id}`)
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.$message.success('删除用户成功')
            this.getUserList()
        },
        // 分配角色
        async setRoleDialog(userInfo) {
            this.roleDialogVisible = true
            // 保存用户信息
            this.userInfo = userInfo
            // 获取所有角色列表请求
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.roleList = res.data
        },
        // 发送请求分配用户角色
        async submitRoleDialog() {
            // 判断是否选择
            if (!this.selectRoleId) {
                return this.$message.error('请选择角色')
            }
            const { data: res } = await this.$http.put(
                `users/${this.userInfo.id}/role`,
                { rid: this.selectRoleId }
            )
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.$message.success('分配角色成功')
            this.getUserList()
            this.roleDialogVisible = false
        },
        // 给分配角色对话框绑定关闭事件
        setRoleDialogClosed() {
            // 让当前选择的select为空
            this.selectRoleId = ''
            this.userInfo = {}
        },
    },
}
</script>

<style lang="less" scoped>
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
    margin-top: 15px !important;
}
</style>