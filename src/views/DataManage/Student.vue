<template>
<div class="table-data">
    <div class="search-box">
        <el-row>
            <el-col :span="20">
                <div class="grid-content bg-purple">
                    <el-input style="width:420px;" size="small" v-model="searchVal" @input="loadSearchData" placeholder="请输入中文姓名/英文/拼音/联系电话"></el-input>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="loadSearchData">搜索</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">
        <el-table-column type="index" label="序号" width="50" align="center"   ></el-table-column>
        <el-table-column fit label="学号" prop="studentNo" align="center"     </el-table-column>
        <el-table-column fit label="英文名" prop="englishName" align="center"    ></el-table-column>
        <el-table-column fit label="中文名" prop="chineseName" align="center"     ></el-table-column>
        <el-table-column fit label="中文拼音" prop="phoneticName" align="center"   ></el-table-column>
        <el-table-column fit label="联系电话" prop="telNo" align="center"   ></el-table-column>

        <el-table-column label="操作" width="300" align="center"    >
            <template slot-scope="scope">
                <el-button @click="handlePayFee(scope.$index,scope.row)" size="mini" type="success">缴费</el-button>
                <el-button @click="handleChooseClass(scope.$index,scope.row)" size="mini" type="primary">选课</el-button>
                <el-button @click="handleEdit(scope.$index,scope.row)" size="mini" type="info">编辑</el-button>
                <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,5,20,9999]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>
    <EditDialog :dialogVisible="dialogVisible" :form="formData" @closeDialog="closeDialog"></EditDialog>

    <ChooseClass ref="ChooseClass" :currentClasses="currentClasses" :classHistoryTableData="classHistoryTableData" :chooseClassVisible="chooseClassVisible" :form="formData" @closeChooseClass="closeChooseClass"  @loadClassHistory = "loadClassHistory"    ></ChooseClass>

    <PayFee :payFeeVisible="payFeeVisible" :form="formData" @closePayFee="closePayFee"></PayFee>

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
import EditDialog from "./EditDialog.vue";
import ChooseClass from "./ChooseClass.vue";
import PayFee from "./PayFee.vue";
@Component({
    components: {
        EditDialog,
        ChooseClass,
        PayFee
    }
})
export default class Student extends Vue {
    @Getter("user") getUser: any;

    @Provide() strTest: string = "dirxu"

    @Provide() searchVal: string = ""; // 搜索框

    @Provide() searchFlag: string = ""; // 定义当前页面数据查询数据的类型，主要是给分页做判断用。

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据

    @Provide() classHistoryTableData: any = []; // 历史选课表格数据

    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 10; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面

    @Provide() chooseClassVisible: Boolean = false; // 是否展示编辑页面

    @Provide() payFeeVisible: Boolean = false; // 是否展示编辑页面

    @Provide() formData: object = {

    };
    @Provide() loading: boolean = true;

    @Provide() currentClasses: any = [];

    handleEdit(index: number, row: any) {
        
        this.formData = row;
        this.dialogVisible = true;
    }
    /**
     * 学生选课
     * 
     * */
    handleChooseClass(index: number, row: any) {

        // 调用子组件的方法childClick
        //  (this as any).$refs.ChooseClass.clearClass();

        this.chooseClassVisible = true;

        this.strTest = "bbbbbbbbbb";

        this.formData = row;

        this.loadCurrentClass();
        this.loadClassHistory(row.studentNo);

    }

    //handlePayFee

    handlePayFee(index: number, row: any) {

        this.formData = row;
        this.payFeeVisible = true;
        

    }

    closeDialog() {

        this.dialogVisible = false;
        this.loadSearchData();
    }

    closeChooseClass() {

        this.chooseClassVisible = false;

    }

    closePayFee() {

        this.payFeeVisible = false;

    }

    created() {
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
     查询学生信息    
    */
    loadSearchData() {
        let data: any = {
            searchVal: this.searchVal
        };
        (this as any).$axios.post("/student/search", data).then((res: any) => {

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
     * 删除学生信息    
     */
    handleDelete(index: number, row: any) {
        let data: any = {
            studentNo: row.studentNo
        };

        (this as any).$axios.post("/student/delete", data).then((res: any) => {
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

    /**
     * 读取当前课程信息，
     *  
     *  */
    loadCurrentClass() {        
        let data: any = {
            query: "active"
        };

        (this as any).$axios.post("/class/search", data).then((res: any) => {
           
            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }

            for (var i = 0; i < res.data.list.length; i++) {

                this.currentClasses.push({
                    id: i + 1,
                    name: res.data.list[i].classCode
                })
            }

           

        });

    }

    /**
     * 读取历史选课信息
     *  
     *  */

    loadClassHistory(studentNo: string) {

        
        

        let data: any = {
            studentNo: studentNo,
            classCode: '%'
        };

        (this as any).$axios.post("/class/searchHistory", data).then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }
            this.classHistoryTableData = res.data.list;
        });

    }

}
</script>

<style lang="scss" scoped >
.table-data {
    height: 100%;

    .table-box {
        font-size: 14px; 
        // th {
        //   padding:0 !important;
        //   height:20px;
        //  // line-height:20px;
        
        // }
        // td {
        //   padding:0 !important;
        //   height:20px;
        //    //line-height:20px;          
        // }
        

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
