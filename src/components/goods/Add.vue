<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 警告 -->
            <el-row>
                <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    :closable="false"
                    show-icon
                >
                </el-alert
            ></el-row>
            <!-- 步骤条 -->
            <el-steps
                :active="Number(activeIndex)"
                finish-status="success"
                style="margin-top: 30px"
                align-center
            >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
                label-position="top"
            >
                <!-- tab切换(使用Form表单包裹起来！！！)-->
                <el-tabs
                    @tab-click="checkout()"
                    tab-position="left"
                    style="margin-top: 30px"
                    v-model="activeIndex"
                    :before-leave="beforeTabLeave"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input
                                v-model="addForm.goods_price"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input
                                v-model="addForm.goods_weight"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品和数量" prop="goods_number">
                            <el-input
                                v-model="addForm.goods_number"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <!-- 级联选择框 -->
                        <!-- 级联选择框步骤:options用来指定数据源，指定props(数据源的)配置对象 
                        v-model将选中的值双向绑定data(id值)中，类型为数组-->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cascaderProps"
                                @change="selectHandleChange"
                                clearable
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                            v-for="item in manyTabData"
                            :key="item.attr_id"
                            :label="item.attr_name"
                        >
                            <!-- 复选框组!!!!!! -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    :label="cb"
                                    v-for="(cb, i) in item.attr_vals"
                                    :key="i"
                                    border
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTabData"
                            :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <!-- action 上传请求地址 -->
                        <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor
                            ref="myQuillEditor"
                            v-model="addForm.goods_introduce"
                        />
                        <el-button
                            type="primary"
                            style="margin-top: 15px"
                            @click="add"
                            >添加商品</el-button
                        >
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="picVisible" width="50%">
            <img :src="PreviewUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            //active和activeName共用index
            activeIndex: '0',
            //输入的表单信息
            addForm: {
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_number: '',
                // 图片上传临时路径
                pics: [],
                // 商品所属分类数组
                goods_cat: [],
                goods_introduce: '',
                //
                attrs: [],
            },
            //父级cateList 数据源
            cateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                // 鼠标经过触发
                expandTrigger: 'hover',
                // value代表选中之后的值(一般为id)
                value: 'cat_id',
                // label展示看到的属性
                label: 'cat_name',
                children: 'children',
            },
            // manyTabData 商品参数
            manyTabData: [],
            // onlyTabData 商品属性
            onlyTabData: [],
            // 给图片上传请求参加token验证
            headerObj: {
                Authorization: window.sessionStorage.getItem('token'),
            },
            //图片预览时的路径
            PreviewUrl: '',
            picVisible: false,
            // 验证规则
            addFormRules: {
                goods_name: [
                    {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur',
                    },
                ],
                goods_price: [
                    {
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur',
                    },
                ],
                goods_weight: [
                    {
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur',
                    },
                ],
                goods_number: [
                    {
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur',
                    },
                ],
                // 级联选择框验证
                goods_cat: [
                    {
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    // 获取分类
    created() {
        this.getCateList()
    },
    computed: {
        catId() {
            if (this.addForm.goods_cat.length == 3) {
                return this.addForm.goods_cat[2]
            }
            // 否则分类未选中，返回空
            return null
        },
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            // 获取列表成功
            this.cateList = res.data
        },
        selectHandleChange() {
            if (this.addForm.goods_cat.length != 3) {
                //数据goods_cat(id)清空
                this.addForm.goods_cat = []
                return
            }
        },
        //tab切换钩子,(即将进入的名字，即将离开的名字)
        beforeTabLeave() {
            // 使用promise  对基本信息表单进行全局验证
            return new Promise((resolve, reject) => {
                this.$refs.addFormRef.validate((valid) => {
                    if (!valid) {
                        this.$message.error('请完善基本信息资料')
                        reject(valid)
                    } else {
                        resolve(valid)
                    }
                })
            })
        },
        // tab选中时触发
        async checkout() {
            // console.log(this.activeIndex)
            if (this.addForm.goods_cat.length !== 3) return false
            else if (this.activeIndex === '0') {
                const { data: res } = await this.$http.get(
                    `categories/${this.catId}/attributes`,
                    {
                        params: { sel: 'many' },
                    }
                )

                if (res.meta.status !== 200)
                    return this.$message.error(res.meta.msg)
                // res.data中attr_vals转化为数组
                res.data.forEach((item) => {
                    // 先判断是否为空
                    item.attr_vals =
                        item.attr_vals != 0 ? item.attr_vals.split(' ') : []
                })
                this.manyTabData = res.data
            } else if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(
                    `categories/${this.catId}/attributes`,
                    {
                        params: { sel: 'only' },
                    }
                )

                if (res.meta.status !== 200)
                    return this.$message.error(res.meta.msg)
                this.onlyTabData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            //保存图片路径
            this.PreviewUrl = file.response.data.url
            this.picVisible = true
        },
        // 文件上传成功调用
        handleSuccess(response) {
            //获取临时路径，保存到pics中
            this.addForm.pics.push({ pic: response.data.tmp_path })
        },
        // 移除图片的操作
        handleRemove(file) {
            // 移除1.filter过滤,2.findIndex先获取索引，再splice删除
            this.addForm.pics = this.addForm.pics.filter((item) => {
                return item.pic != file.response.data.tmp_path
            })
        },
        // 添加商品
        async add() {
            // 发送请求
            // 利用lodash对addForm做 深拷贝！！！！！！
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理静态参数和动态属性 attr_id,attr_vals
            this.manyTabData.forEach((item) => {
                this.addForm.attrs.push({
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals.join(' '),
                })
            })
            this.onlyTabData.forEach((item) => {
                this.addForm.attrs.push({
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals,
                })
            })
            form.attrs = this.addForm.attrs
            // 发送请求 添加商品，数据为form
            const { data: res } = await this.$http.post('goods', form)
            if (res.meta.status !== 201)
                return this.$message.error(res.meta.msg)
            this.$message.success('添加成功')
            //添加成功后跳转到商品列表
            // 等两秒跳转
            this.activeIndex = '6'
            this.timer = setInterval(() => {
                this.$router.push('/goods')
            }, 1000)
        },
    },
    // 文件销毁之前清除定时器
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0 !important;
    margin-right: 10px !important;
}
.el-dialog {
    img {
        width: 100%;
    }
}
</style>