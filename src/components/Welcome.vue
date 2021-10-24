<template>
    <div class="welcome">
        <div>
            <el-card
                shadow="hover"
                style="width: 800px; margin-bottom: 15px; margin-right: 15px"
            >
                <div slot="header" class="clearfix">
                    <span>未读文档</span>
                </div>
                <div v-for="o in 4" :key="o" class="text item">
                    {{ '未读文档 ' + o }}
                </div>
            </el-card>
            <el-card shadow="hover" style="width: 800px; margin-right: 15px">
                <div slot="header" class="clearfix">
                    <span>所有文档</span>
                </div>
                <div v-for="o in 4" :key="o" class="text item">
                    {{ '文档' + o }}
                </div>
            </el-card>
        </div>
        <el-card style="width: 400px"
            ><el-calendar v-model="value"> </el-calendar
        ></el-card>
    </div>
</template>

<script>
export default {
    name: 'Welcome',
    data() {
        return {
            value: new Date(),
        }
    },
}
</script>

<style lang="less" scoped>
.welcome {
    display: flex;
    justify-content: space-between;
}
.el-calendar {
    width: 360px;
}
</style>