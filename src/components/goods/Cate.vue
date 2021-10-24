<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddCateDialog"
                        >添加分类</el-button
                    >
                </el-col>
            </el-row>
            <!-- 表格(第三方插件) -->
            <tree-table
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :show-index="true"
                index-text="#"
                border
                style="margin-top: 15px"
            >
                <!-- 作用域插槽 -->
                <!-- 提供给isOk使用 v-slot="scope"接收当前行数据 -->
                <!--  -->
                <template slot="isOk" slot-scope="scope">
                    <i
                        class="el-icon-success"
                        v-if="scope.row.cat_deleted === false"
                        style="color: #43b985"
                    ></i>
                    <i class="el-icon-error" v-else style="color: #e3333d"></i>
                </template>
                <!--  -->
                <template slot="grade" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level == 1"
                        >二级</el-tag
                    >
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!--  -->
                <template slot="order" slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="showCateDialog(scope.row.id)"
                        >编辑</el-button
                    >
                    <!-- 删除按钮 -->
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteCate(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </tree-table>
            <!--分页 -->
            <el-row style="margin-top: 10px">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 200]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes,prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </el-row>
            <!-- 添加分类对话框 -->
            <el-dialog
                title="添加商品分类"
                :visible.sync="addCataDialogVisible"
                width="50%"
            >
                <el-form
                    :model="cateForm"
                    :rules="cateFormRules"
                    ref="cateFormRef"
                    label-width="100px"
                    @close="addCataDialogClosed"
                >
                    <!-- prop是要验证属性 -->
                    <el-form-item label="分类名称 :" prop="cat_name">
                        <el-input v-model="cateForm.cat_name"></el-input>
                    </el-form-item>
                    <!-- 级联选择框 -->
                    <!-- 级联选择框步骤:options用来指定数据源，指定props(数据源的)配置对象 v-model将选中的值双向绑定data中，类型为数组-->
                    <el-form-item label="父级分类 :">
                        <el-cascader
                            v-model="selectKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="selectHandleChange"
                            clearable
                        ></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCataDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addCata">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Cate',
    data() {
        return {
            cateList: [],
            //获取分类列表的请求参数
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            addCataDialogVisible: false,

            // 添加分类
            cateForm: {
                // 分类名称
                cat_name: '',
                //父级id，没有父级则为0
                cat_pid: 0,
                cat_level: 0,
            },
            //父级cateList 数据源
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                // 鼠标经过触发
                expandTrigger: 'hover',
                // 第一级也可选择
                checkStrictly: true,
                // value代表选中之后的值
                value: 'cat_id',
                // label展示看到的属性
                label: 'cat_name',
                children: 'children',
            },
            // 级联最后选中的结果,父级ID数组
            selectKeys: [],
            //分类校验规则
            cateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur',
                    },
                ],
            },
            //总共条数
            total: 0,
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    // 将当前列定义为模板列
                    type: 'template',
                    //表示当前列使用的模板名称
                    template: 'isOk',
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'grade',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'order',
                },
            ],
        }
    },
    //初始化获取列表
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            // 获取列表成功
            this.cateList = res.data.result
            this.total = res.data.total
        },
        // 每页展示条数
        handleSizeChange(evePage) {
            this.queryInfo.pagesize = evePage
            this.getCateList()
        },
        // 当前页
        handleCurrentChange(curPage) {
            this.queryInfo.pagenum = curPage
            this.getCateList()
        },
        // 添加分类对话框
        showAddCateDialog() {
            this.getParentCateList()
            this.addCataDialogVisible = true
        },
        // 获取添加分类中，父级分类的数据
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                // 参数
                params: { type: 2 },
            })
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.parentCateList = res.data
        },
        // 监控级联变化
        selectHandleChange() {
            if (this.selectKeys) {
                // 父级分类Id
                this.cateForm.cat_pid =
                    this.selectKeys[this.selectKeys.length - 1]
                // 等级
                this.cateForm.cat_level = this.selectKeys.length
                return
            } else {
                this.cateForm.cat_pid = 0
                // 等级
                this.cateForm.cat_level = 0
            }
        },
        //关闭添加分类对话框，清空选择的数据
        addCataDialogClosed() {
            this.$refs.cateFormRef.resetFields()
            this.selectKeys = []
            this.cateForm.cat_pid = 0
            this.cateForm.cat_level = 0
        },
        //确定添加分类
        addCata() {
            // if (!this.cateForm.cat_name) {
            //     return this.$message.error('分类名称不能为空')
            // }
            // 统一验证
            this.$refs.cateFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('分类名称不能为空')
                // 发送请求
                const { data: res } = await this.$http.post(
                    'categories',
                    this.cateForm
                )
                if (res.meta.status !== 201)
                    return this.$message.error(res.meta.msg)
                this.$message.success('添加分类成功')
                this.getCateList() //放在这
            })
            this.addCataDialogVisible = false
        },
        deleteCate() {
            this.$message.error('sorry! 该功能尚未授权')
        },
        showCateDialog() {
            this.$message.error('sorry! 该功能尚未授权')
        },
    },
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>