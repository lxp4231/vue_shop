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
            <!-- 表格 -->
            <el-table :data="rightList" border style="width: 100%" stripe>
                <el-table-column label="#" type="index"> </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径"> </el-table-column>
                <el-table-column v-slot="scope" label="权限等级">
                    <el-tag v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag type="success" v-if="scope.row.level == 1"
                        >二级</el-tag
                    >
                    <el-tag type="warning" v-if="scope.row.level == 2"
                        >三级</el-tag
                    >
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Right',
    created() {
        this.getRightList()
    },
    data() {
        return {
            rightList: [],
        }
    },
    methods: {
        async getRightList() {
            const { data: res } = await this.$http.get('rights/list')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.rightList = res.data
        },
    },
}
</script>

<style lang="less" scoped>
</style>