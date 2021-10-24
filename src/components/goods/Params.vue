<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-alert
                title="注意：只允许为第三级分类设置参数"
                type="warning"
                style="margin-bottom: 15px"
                :closable="false"
                show-icon
            >
            </el-alert>
            <el-form label-width="110px">
                <!-- 级联选择框步骤:options用来指定数据源，指定props(数据源的)配置对象 v-model将选中的值双向绑定data中，类型为数组-->
                <el-form-item label="选择商品分类 :">
                    <el-cascader
                        v-model="selectKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="selectHandleChange"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <!-- tabs -->
            <!-- v-model="activeName" 和name的值双向绑定 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-row style="margin-bottom: 15px">
                        <el-col>
                            <!--此处使用计算属性，判断按钮是否禁用 -->
                            <!--  :disabled="
                                    selectKeys.length == 3 ? false : true
                                " -->

                            <el-button
                                type="primary"
                                @click="addParamsDialog"
                                :disabled="isDisabled"
                                style="margin-bottom: 15px"
                            >
                                添加参数</el-button
                            >
                            <el-table
                                :data="manyData"
                                style="width: 100%"
                                border
                            >
                                <!-- 展开行-->
                                <el-table-column type="expand">
                                    <template v-slot="scope">
                                        <el-tag
                                            v-for="(item, i) in scope.row
                                                .attr_vals"
                                            :key="i"
                                            closable
                                            @close="handleClose(i, scope.row)"
                                            >{{ item }}</el-tag
                                        >
                                        <!-- 添加动态标签 -->
                                        <el-input
                                            class="input-new-tag"
                                            v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="
                                                handleInputConfirm(scope.row)
                                            "
                                            @blur="
                                                handleInputConfirm(scope.row)
                                            "
                                        >
                                        </el-input>
                                        <el-button
                                            v-else
                                            class="button-new-tag"
                                            size="small"
                                            @click="showInput(scope.row)"
                                            >+ New Tag</el-button
                                        >
                                    </template>
                                </el-table-column>
                                <!-- 索引列 -->
                                <el-table-column label="#" type="index">
                                </el-table-column>
                                <el-table-column
                                    prop="attr_name"
                                    label="参数名称"
                                >
                                </el-table-column>
                                <!--操作列 -->
                                <el-table-column label="操作">
                                    <!-- 直接解构拿到数据 -->
                                    <template v-slot="scope">
                                        <!-- 修改按钮 -->
                                        <el-button
                                            type="primary"
                                            icon="el-icon-edit"
                                            size="mini"
                                            @click="showEditDialog(scope.row)"
                                            >编辑</el-button
                                        >
                                        <!-- 删除按钮 -->
                                        <el-button
                                            type="danger"
                                            icon="el-icon-delete"
                                            size="mini"
                                            @click="
                                                deleteParams(scope.row.attr_id)
                                            "
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row></el-tab-pane
                >
                <!-- 添加静态参数 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-row style="margin-bottom: 15px">
                        <el-col>
                            <el-button
                                type="primary"
                                @click="addParamsDialog"
                                :disabled="isDisabled"
                                style="margin-bottom: 15px"
                            >
                                添加属性</el-button
                            >
                            <el-table
                                :data="onlyData"
                                style="width: 100%"
                                border
                            >
                                <!-- 可采用作用域插槽获取本行数据 scope.row-->
                                <!-- 展开行-->
                                <el-table-column type="expand">
                                    <template v-slot="scope">
                                        <el-tag
                                            v-for="(item, i) in scope.row
                                                .attr_vals"
                                            :key="i"
                                            closable
                                            @close="handleClose(i, scope.row)"
                                            >{{ item }}</el-tag
                                        >
                                        <!-- 添加动态标签 -->
                                        <el-input
                                            class="input-new-tag"
                                            v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="
                                                handleInputConfirm(scope.row)
                                            "
                                            @blur="
                                                handleInputConfirm(scope.row)
                                            "
                                        >
                                        </el-input>
                                        <el-button
                                            v-else
                                            class="button-new-tag"
                                            size="small"
                                            @click="showInput(scope.row)"
                                            >+ New Tag</el-button
                                        >
                                    </template>
                                </el-table-column>
                                <!-- 索引列 -->
                                <el-table-column label="#" type="index">
                                </el-table-column>
                                <!--  -->
                                <el-table-column
                                    prop="attr_name"
                                    label="属性名称"
                                >
                                </el-table-column>
                                <el-table-column label="操作">
                                    <!-- 直接解构拿到数据 -->
                                    <template v-slot="scope">
                                        <!-- 修改按钮 -->
                                        <el-button
                                            type="primary"
                                            icon="el-icon-edit"
                                            size="mini"
                                            @click="showEditDialog(scope.row)"
                                            >编辑</el-button
                                        >
                                        <!-- 删除按钮 -->
                                        <el-button
                                            type="danger"
                                            icon="el-icon-delete"
                                            size="mini"
                                            @click="
                                                deleteParams(scope.row.attr_id)
                                            "
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row></el-tab-pane
                >
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框(静态动态共用一个对话框)-->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addParamsdialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <!--  @close="addParamsDialogClosed" -->
            <el-form
                :model="paramsForm"
                :rules="paramsFormRules"
                ref="paramsFormRef"
                label-width="100px"
            >
                <!-- prop是要验证属性 -->
                <el-form-item :label="titleText + ':'" prop="attr_name">
                    <el-input v-model="paramsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsdialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑参数的对话框(静态动态共用一个对话框)-->
        <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editParamsdialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <!--  @close="addParamsDialogClosed" -->
            <el-form
                :model="editparamsForm"
                :rules="paramsFormRules"
                ref="editparamsFormRef"
                label-width="100px"
            >
                <!-- prop是要验证属性 -->
                <el-form-item :label="titleText + ':'" prop="attr_name">
                    <el-input v-model="editparamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsdialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Params',
    data() {
        return {
            //父级cateList 数据源
            parentCateList: [],
            cascaderProps: {
                // 鼠标经过触发
                expandTrigger: 'hover',
                // value代表选中之后的值
                value: 'cat_id',
                // label展示看到的属性
                label: 'cat_name',
                children: 'children',
            },
            selectKeys: [],
            //默认选中第一个
            activeName: 'many',
            //动态值
            manyData: [],
            //静态值
            onlyData: [],
            addParamsdialogVisible: false,
            editParamsdialogVisible: false,
            //添加属性的数据对象
            paramsForm: {
                attr_name: '',
                attrId: '',
            },
            //编辑
            editparamsForm: {
                attr_name: '',
            },
            //验证规则
            paramsFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    created() {
        // 获取分类列表
        this.getCateList()
    },
    computed: {
        // 使用计算属性，判断按钮是否禁用
        isDisabled() {
            if (this.selectKeys.length !== 3) return true
            return false
        },
        // 分类Id
        cateId() {
            if (this.selectKeys.length == 3) return this.selectKeys[2]
            return null
        },
        //dialog标题
        titleText() {
            if (this.activeName == 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        },
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.parentCateList = res.data
        },
        //级联选择框变化时调用
        selectHandleChange() {
            // id
            // !== 3证明不是三级，selectKeys = []，直接return
            if (this.selectKeys.length !== 3) {
                // 级联选择的内容清空，表格内容也清空
                this.selectKeys = []
                this.manyData = []
                this.onlyData = []
                return
            }
            // 根据此时id，和所处面板的activeName,发送请求
            if (this.selectKeys.length) this.getParamsData()
            return
        },
        // tab切换时发送请求
        handleTabClick() {
            if (this.selectKeys.length) this.getParamsData()
            return
        },
        // 获取动态参数或静态属性(级联选择框变化,tab切换时变化)
        async getParamsData() {
            const { data: res } = await this.$http.get(
                `categories/${this.cateId + 0}/attributes`,
                { params: { sel: this.activeName } }
            )
            res.data.forEach((item) => {
                // 转为数组形式,转化之前先判断是否为空
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                //给每个new-tag单独的 inputVisible: false, inputValue: '',
                item.inputVisible = false
                item.inputValue = ''
            })
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            //判断是动态参数还是静态属性
            if (this.activeName == 'many') {
                this.manyData = res.data
            } else {
                this.onlyData = res.data
            }
        },
        // // 添加动态参数，静态属性对话框
        addParamsDialog() {
            this.addParamsdialogVisible = true
        },
        // 添加对话框关闭
        addDialogClosed() {
            // 清空验证规则
            this.$refs.paramsFormRef.resetFields()
        },
        //确定添加属性、参数,发送请求
        addParams() {
            this.$refs.paramsFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('参数错误')
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    //第二个参数{}表示请求体
                    {
                        attr_name: this.paramsForm.attr_name,
                        attr_sel: this.activeName,
                    }
                )
                if (res.meta.status !== 201)
                    return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.addParamsdialogVisible = false
                this.getParamsData()
            })
        },
        //编辑动态参数，静态属性对话框
        showEditDialog(val) {
            this.editparamsForm.attr_name = val.attr_name
            this.editParamsdialogVisible = true
            this.paramsForm.attrId = val.attr_id
        },
        // 确定修改，发送请求
        editParams() {
            this.$refs.editparamsFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('参数错误')
                const { data: res } = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.paramsForm.attrId}`,
                    //第二个参数{}表示请求体
                    {
                        attr_name: this.editparamsForm.attr_name,
                        attr_sel: this.activeName,
                    }
                )
                if (res.meta.status !== 200)
                    return this.$message.error('修改参数失败')
                this.$message.success('修改参数成功')
                this.editParamsdialogVisible = false
                this.getParamsData()
            })
        },
        //编辑对话框关闭
        editDialogClosed() {
            // 清空验证规则
            this.$refs.editparamsFormRef.resetFields()
        },

        // 删除动态参数,静态属性 提示框
        deleteParams(id) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    // 发送删除请求
                    const { data: res } = await this.$http.delete(
                        `categories/${this.cateId}/attributes/${id}`
                    )
                    if (res.meta.status !== 200)
                        return this.$message.error('删除失败')

                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    })
                    this.getParamsData()
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
        //标签失去焦点或enter按下时
        handleInputConfirm(row) {
            if (!row.inputValue.trim()) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }

            // ！！！！！！！！
            //没有return，执行添加程序(直接push到attr_vals(即data=>scope.row=>manyDate/onlyDate,因为这两个都被数据监测，会自动更新attr_vals))
            row.attr_vals.push(row.inputValue.trim())
            this.saveAttrVal(row, '已添加')
        },
        // 保存tag标签修改
        async saveAttrVal(row, str) {
            //发起请求，保存到数据库
            const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    // 参数的名称
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    // 展开列的值，新添加的值(字符串格式)
                    attr_vals: row.attr_vals.join(' '),
                }
            )
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.$message.success(`${str}`)
            // 添加完成后input内容置空,并隐藏
            row.inputValue = ''
            row.inputVisible = false
        },
        // button-new-tag按下时
        showInput(row) {
            // data 是作用域插槽拿过来的数据
            row.inputVisible = true
            //让文本框自动获得焦点
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 根据索引删除tag标签
        handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            //  this.getParamsData()
            this.saveAttrVal(row, '已删除')
        },
    },
}
</script>

<style lang="less" scoped>
</style>