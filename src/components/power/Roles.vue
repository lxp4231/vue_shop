<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="roleDialogVisible = true"
                        >添加角色</el-button
                    >
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                :data="roleList"
                border
                style="width: 100%"
                stripe
                :row-key="roleList.id"
            >
                <!--展开项 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                            :class="[
                                i1 == 0 ? '.bdtop' : 'bdbottom',
                                'vcenter',
                            ]"
                        >
                            <!--一级权限 -->
                            <el-col>
                                <el-tag
                                    closable
                                    @close="deleteAuth(scope.row, item1.id)"
                                    >{{ item1.authName }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--二级，三级权限 -->
                            <el-col>
                                <el-row
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                    :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                                >
                                    <!-- 二级 -->
                                    <el-col>
                                        <el-tag
                                            closable
                                            type="success"
                                            @close="
                                                deleteAuth(scope.row, item2.id)
                                            "
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级 -->
                                    <el-col>
                                        <el-tag
                                            closable
                                            type="warning"
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            @close="
                                                deleteAuth(scope.row, item3.id)
                                            "
                                        >
                                            {{ item3.authName }}</el-tag
                                        >
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"> </el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="操作">
                    <!-- 直接解构拿到数据 -->
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showRoleDialog(scope.row.id)"
                            >编辑</el-button
                        >
                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteRole(scope.row.id)"
                            >删除</el-button
                        >
                        <!-- 分配权限按钮 -->
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showSetRoleDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分配权限dialog -->
            <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed"
            >
                <!-- 树形控件 @node-click="handleNodeClick" -->
                <el-tree
                    :data="authList"
                    :props="treeProps"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    :default-checked-keys="defkeys"
                    ref="treeRef"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="allotRights"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Roles',
    data() {
        return {
            // 角色列表
            roleList: [],
            setRightDialogVisible: false,
            // 权限列表
            authList: [],
            // 节点列表
            defkeys: [],
            // 即将分配权限的id
            roleId: '',
            treeProps: {
                children: 'children',
                label: 'authName',
            },
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.message.error(res.meta.msg)
            this.roleList = res.data
        },
        //删除权限
        deleteAuth(role, authId) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    // 发送删除请求
                    const { data: res } = await this.$http.delete(
                        `roles/${role.id}/rights/${authId}`
                    )
                    if (res.meta.status !== 200)
                        return this.$message.error('删除失败')
                    this.$message.success('删除成功')
                    role.children = res.data //给role.children重新赋值,因为双向绑定了数据(getter)
                    // console.log(this.roleList)
                    // this.getRoleList() 此处不采用此方式，会刷新整个页面????????
                })
                // 捕获错误，取消删除
                .catch(() => {
                    this.$message.info('取消删除')
                })
        },
        //分配权限列表
        async showSetRoleDialog(role) {
            this.setRightDialogVisible = true
            // 获取权限列表
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200)
                return this.$message.error('获取权限列表失败')
            this.authList = res.data
            // console.log(role) // scope-row得到的是当前行传过来的值,当前角色
            this.getLeafkeys(role, this.defkeys) // ???未被数据监视
            // console.log(this.defkeys)//当前所有授权三级id
            this.roleId = role.id
        },
        //  递归获取角色下所有三级列表的id！！！！！
        getLeafkeys(node, arr) {
            // // node是当前行的数据(object), 即{children,....}
            if (!node.children) {
                return arr.push(node.id)
            }
            // children为数组
            node.children.forEach((item) => {
                this.getLeafkeys(item, arr)
            })
        },
        // 监听分配权限列表关闭事件，清空当前所有权限
        setRightDialogClosed() {
            // 让defkeys重新赋值为空
            this.defkeys = []
        },
        // 分配权限确认
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const isStr = keys.join(',')
            // 发起请求
            // const { data: res } = await this.$http.post(
            //     `roles/${this.roleId}/rights`,
            //     { rids: isStr }
            // )
            // 或
            const { data: res } = await this.$http({
                method: 'POST',
                url: `roles/${this.roleId}/rights`,
                data: { rids: isStr },
            })
            // console.log(res)
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.$message.success('分配权限成功')
            this.getRoleList() //更新页面
            this.setRightDialogVisible = false
        },
        showRoleDialog() {
            this.$message.error('sorry! 该功能尚未授权')
        },
        deleteRole() {
            this.$message.error('sorry! 该功能尚未授权')
        },
    },
}
</script>

<style lang="less" scoped>
.el-col {
    margin-bottom: 15px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.bdright {
    border-right: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>