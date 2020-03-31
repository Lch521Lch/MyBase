<template>
<div class="table-data">
    <div class="search-box">
        <el-row>
            <el-col :span="20">
                <div class="grid-content bg-purple">

                    <el-row>
                        <el-col :span="16">
                            <div class="grid-content bg-purple-light">
                                <el-input style="width:420px;" size="mini" v-model="searchVal" @input="loadSearchData" placeholder="请输入查询教师姓名"></el-input>
                                <el-button size="mini" type="primary" icon="el-icon-search" @click="loadSearchData">搜索</el-button>

                            </div>
                        </el-col>

                        <el-col :span="4">
                            <div class="grid-content bg-purple-light">
                                <el-button size="mini" type="info" icon="el-icon-plus" @click="addTeacher">新增</el-button>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </el-col>
        </el-row>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column v-if = false  label="编号" prop="teacherId" align="center"></el-table-column>
        <el-table-column fit label="教师姓名" prop="teacherName" align="center"></el-table-column>
        <el-table-column fit label="教师类型" prop="teacherType" align="center"></el-table-column>
        <el-table-column fit label="备注" prop="memo" align="center"></el-table-column>

        <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">

                <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger"  icon="el-icon-delete"   >删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,5,20,9999]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>
    <EditDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog"></EditDialog>
</div>
</template>

<script lang="ts">



import {
    Component,
    Vue,
    Provide
} from "vue-property-decorator";
import {
    State,
    Getter,
    Mutation,
    Action
} from "vuex-class";

import EditDialog from "./AddTeacher.vue";

@Component({
    components: {
        EditDialog
    }
})
export default class Teacher extends Vue {

  @Provide() visibile : Boolean = false;


    @Getter("user") getUser: any;

    @Provide() searchVal: string = ""; // 搜索框

    @Provide() searchFlag: string = ""; // 定义当前页面数据查询数据的类型，主要是给分页做判断用。

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 10; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面
    @Provide() formData: object = {

    };
    @Provide() loading: boolean = true;

    handleEdit(index: number, row: any) {
        
        this.formData = row;
        this.dialogVisible = true;
    }

    addTeacher() {
        this.dialogVisible = true;
    }

    closeDialog() {

        this.dialogVisible = false;
        this.loadSearchData();
    }

    created() {
        this.loadSearchData();
        this.loading = false;
    }

    handleSizeChange(val: number): void {
        this.size = val;
        this.page = 1;
        //this.searchVal ? this.loadSearchData() : this.loadData();
    }

    handleCurrentChange(val: number): void {
        this.page = val;
        //this.searchVal ? this.loadSearchData() : this.loadData();
    }

    handleSearch(): void {
        // 点击搜索
        this.page = 1;
        this.searchVal ? this.loadSearchData() : this.loadSearchData();
    }

    /**
     查询教师信息    
    */
    loadSearchData() {
        let data: any = {
            searchVal: this.searchVal
        };
        (this as any).$axios.post("/teacher/search", data).then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
            }

            this.tableData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    /**
     * 删除教师信息    
     */
    handleDelete(index: number, row: any) {
        let data: any = {
            teacherId: row.teacherId
        };

        (this as any).$axios.post("/teacher/delete", data).then((res: any) => {
            if (res.data.state == "success") {
                this.tableData.splice(index, 1);
                this.$message({
                    message: "删除成功",
                    type: "success",
                    duration: 4000
                });
            } else {
                this.$message({
                    message: "删除失败",
                    type: "error"
                });
            }
        });
    }

}
</script>

<style lang="scss" scoped>
.table-data {
    height: 100%;

    .table-box {
        font-size: 14px;
    }

    .pages {
        background: #fff;
        margin-top: 10px;
        padding: 10px 10px;
        text-align: right;
        height: 55px;
        box-sizing: border-box;
    }

    .search-box {
        background: #fff;
        margin-bottom: 10px;
        padding: 10px 10px;
        border-radius: 4px;
        height: 55px;
        box-sizing: border-box;

        .el-input {
            width: 200px;
            margin-right: 10px;
        }
    }
}
</style>
