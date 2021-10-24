<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="25" style="margin-bottom: 15px">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getOrderList"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 列表区 -->
            <el-table :data="orderInfo" style="width: 100%" border stripe>
                <el-table-column type="index" label="#" align="center">
                </el-table-column>
                <el-table-column
                    prop="order_number"
                    label="订单编号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="order_price"
                    label="订单价格"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="是否付款" align="center">
                    <template v-slot="scope">
                        <el-tag
                            type="success"
                            v-if="scope.row.pay_status === '1'"
                            >已付款</el-tag
                        >
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" align="center">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="下单时间"
                    align="center"
                >
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
                        <!-- 地址 -->
                        <el-button
                            type="success"
                            icon="el-icon-location"
                            size="mini"
                            @click="showProgressDialog(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            <!-- 修改地址对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="editdialogVisible"
                width="50%"
            >
                <el-form
                    :model="addrForm"
                    :rules="addrFormRules"
                    ref="addrRuleRef"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="省市区/县" prop="addr1">
                        <!-- 级联选择器 -->
                        <!--  v-model="addrForm.addr1" 为选择的最终值 和props值value对应 -->
                        <el-cascader
                            v-model="addrForm.addr1"
                            :options="cityData"
                            :props="addrProps"
                            @change="selectHandleChange"
                            clearable
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="addr2">
                        <el-input v-model="addrForm.addr2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editdialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="editdialogClosed"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
            <!-- 修改物流信息对话框 -->
            <el-dialog
                title="物流信息"
                :visible.sync="progressDialogVisible"
                width="50%"
            >
                <!-- 时间线 -->
                <el-timeline>
                    <el-timeline-item
                        v-for="(item, index) in progressInfo"
                        :key="index"
                        :timestamp="item.time"
                    >
                        {{ item.context }}
                    </el-timeline-item>
                </el-timeline>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="progressDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="progressDialogClosed"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import cityData from './citydata'
import progressInfo from './progressData'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,
                user_id: '',
                pay_status: '',
                is_send: '',
                order_fapiao_title: '',
                order_fapiao_company: '',
                order_fapiao_content: '',
                consignee_addr: '',
            },
            // 订单数据goodsInfo
            total: 0,
            orderInfo: [],
            editdialogVisible: false,
            // 修改地址
            addrForm: {
                addr1: [],
                addr2: '',
            },
            addrFormRules: {
                addr1: [
                    {
                        required: true,
                        message: '请选择省市区/县',
                        trigger: 'blur',
                    },
                ],
                addr2: [
                    {
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur',
                    },
                ],
            },
            // 城市列表
            cityData,
            addrProps: {
                // 鼠标经过触发
                expandTrigger: 'hover',
                // value代表选中之后的值
                value: 'value',
                // label展示看到的属性
                label: 'label',
                children: 'children',
            },
            progressDialogVisible: false,
            // 物流信息
            progressInfo: [],
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            res.data.goods.forEach((item) => {
                item.create_time = this.$formatDate.dateFormat('2020-7-1 8:8:8')
            })
            this.total = res.data.total
            this.orderInfo = res.data.goods
            // console.log(this.orderInfo)
        },
        // 每页展示条数
        handleSizeChange(evePage) {
            this.queryInfo.pagesize = evePage
            this.getOrderList()
        },
        // 当前页
        handleCurrentChange(curPage) {
            this.queryInfo.pagenum = curPage
            this.getOrderList()
        },
        //展示修改对话框
        showEditDialog() {
            this.editdialogVisible = true
        },
        // 级联变化时
        selectHandleChange(val) {
            console.log(val)
        },
        // 确定修改地址
        editdialogClosed() {
            // 全局校验，并清空当前表单
            this.$refs.addrRuleRef.resetFields()
            this.editdialogVisible = false
        },
        // 展示物流信息对话框
        showProgressDialog() {
            // 接口问题！！！ 注意加async
            // const { data: res } = await this.$http.get()
            // if (res.meta.status !== 200)
            //     return this.$message.error(res.meta.msg)
            this.progressInfo = progressInfo.data
            this.progressDialogVisible = true
        },
        // 展示物流信息对话框关闭
        progressDialogClosed() {
            this.progressDialogVisible = false
        },
    },
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>