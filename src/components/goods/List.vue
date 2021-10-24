<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="25" style="margin-bottom: 15px">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getGoodsList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoods"
                        >添加商品</el-button
                    >
                </el-col>
            </el-row>
            <!-- 列表区 -->
            <template>
                <el-table :data="goodsInfo" style="width: 100%" border stripe>
                    <el-table-column type="index" label="#" align="center">
                    </el-table-column>
                    <el-table-column
                        prop="goods_name"
                        label="商品名称"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goods_price"
                        label="商品价格(元)"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goods_number"
                        label="商品重量"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="add_time"
                        label="创建时间"
                        align="center"
                    >
                        <!-- 作用域插槽，拿到数据当前行的 -->
                        <!-- <template v-slot="scope">{{
                            scope.row.add_time
                        }}</template> -->
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <!-- 直接解构拿到数据 -->
                        <template v-slot="scope">
                            <!-- 修改 -->
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.goods_id)"
                            ></el-button>
                            <!-- 删除 -->
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteGoods(scope.row.goods_id)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!--提示框 -->

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 30, 50, 100]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
                style="margin-top: 15px"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'List',
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
            // 商品信息
            goodsInfo: [],
            // 总条数
            total: 0,
            addDialogVisible: false,
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 获取商品列表(注意获取商品和查询商品是不是同一个接口)
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            //格式化时间
            res.data.goods.forEach((items) => {
                items.add_time = this.$formatDate.dateFormat('2020-8-20 8:8:8')
            })
            this.goodsInfo = res.data.goods
            this.total = res.data.total
        },
        //页数改变
        handleSizeChange(page) {
            this.queryInfo.pagesize = page
            this.getGoodsList()
        },
        // 当前页
        handleCurrentChange(page) {
            this.queryInfo.pagenum = page
            this.getGoodsList()
        },
        //编辑
        showEditDialog() {
            this.$message.error('尚未获得权限')
        },
        // 删除(先弹出提示框)
        deleteGoods(id) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { data: res } = await this.$http.delete(`goods/${id}`)
                    if (res.meta.status !== 200)
                        return this.$message.error('删除失败')
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    })
                    this.getGoodsList()
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
        //添加商品
        addGoods() {
            this.$router.push('/add')
        },
    },
}
</script>

<style lang="less" scoped>
</style>