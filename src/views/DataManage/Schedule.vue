<template>
<div class="table-data">

    <div class="search-box">
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <el-row>
                        <el-col :span="8">
                            <div class="grid-content bg-purple-light">

                                <el-select size="mini" style="width:250px;" v-model="selectClassCode" filterable placeholder="请选择班级代码" @change="selectChange">
                                    <el-option v-for="item in currentClassCode" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>

                            </div>
                        </el-col>

                        <el-col :span="4">
                            <div class="grid-content bg-purple-light">

                                <el-button size="small" type="primary" icon="el-icon-search" :disabled="createDisabled" @click="createSchedule">生成课程表</el-button>

                            </div>
                        </el-col>

                    </el-row>
                </div>
            </el-col>

        </el-row>
    </div>

    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column v-if="false" fit label="id" prop="scheduleId" align="center"></el-table-column>
        <el-table-column fit label="班级" prop="classCode" align="center"></el-table-column>
        <el-table-column width="80" label="教室" prop="roomCode" align="center"></el-table-column>
        <el-table-column width="120" label="教师姓名" prop="scheduleTeacher" align="center" sortable></el-table-column>
        <el-table-column width="120" label="课程日期" prop="scheduleDate" align="center" sortable></el-table-column>
        <el-table-column width="120" label="课程周" prop="scheduleWeek" align="center" sortable></el-table-column>
        <el-table-column width="120" label="上课时间" prop="scheduleTime" align="center" sortable></el-table-column>
        <el-table-column width="120" label="下课时间" prop="scheduleEndtime" align="center" sortable></el-table-column>

        <el-table-column v-if="getUser.key != 'visitor'" label="操作" width="160" align="center">
            <template slot-scope="scope">
                <el-button @click="handleAddAbsent(scope.$index,scope.row)" size="mini" type="success">出勤</el-button>
                <el-button @click="handleEdit(scope.$index,scope.row)" size="mini" type="primary">编辑</el-button>
            </template>
        </el-table-column>

    </el-table>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[50,100,150]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>
    <EditDialog :dialogVisible="dialogVisible" :form="formData" @closeDialog="closeDialog"></EditDialog>
    <AddAbsent :absentVisible="absentVisible" :studentArrTotal="studentArrTotal" @closeAddAbsent="closeAddAbsent"></AddAbsent>
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
import EditDialog from "./EditSchedule.vue";
import AddAbsent from "./AddAbsent.vue";
@Component({
    components: {
        EditDialog,
        AddAbsent
    }
})
export default class Schedule extends Vue {

    @Getter("user") getUser: any;

    @Provide() scheduleId: string = "";

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 50; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面

    @Provide() absentVisible: Boolean = false; // 是否展示编辑页面

    @Provide() formData: object = {

    };
    @Provide() loading: boolean = true;

    @Provide() searchVal: string = "";

    @Provide() value: string = "";
    @Provide() value2: string = "";

    // @Provide() options: any 

    @Provide() currentClassCode: any = [];

    @Provide() selectClassCode: string = "";

    @Provide() createDisabled: boolean = true;

    @Provide() studentArrTotal: Array < any > = [];

    created() {

        this.loadCurrentClass("%");

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

    selectChange() {
        this.createDisabled = false;
        this.loadSearchData();
    }

    /**
     查询班级课程表信息   
    */
    loadSearchData() {

        let data: any = {
            classCode: this.selectClassCode
        };

        if (this.selectClassCode.length == 0) {
            return;

        }

        (this as any).$axios.post("/class/searchSchedule", data).then((res: any) => {

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
     *  读取当当前班级表
     * 
     * 
     */

    loadCurrentClass(query: string) {
        let data: any = {
            query: query
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

                this.currentClassCode.push({
                    value: res.data.list[i].classCode,
                    label: res.data.list[i].classCode
                })
            }
        });
    }

    handleEdit(index: number, row: any) {

        this.formData = row;
        this.dialogVisible = true;
    }

    //handleAddAbsent 

    handleAddAbsent(index: number, row: any) {
        this.scheduleId = row.scheduleId;

        this.formData = row;

        let data: any = {
            scheduleId: row.scheduleId

        };
        (this as any).$axios.post("/student/searchByScheduleId", data).then((res: any) => {

            if (res.data.state === "success") {

                let tmpArr: Array < any > = []
                for (var i = 0; i < res.data.list.length; i++) {

                    var j = i + 1;

                    if (j % 4 === 0) {
                        let studentArrRow: Array < any > = []
                        for (var k = j - 4; k < j; k++) {
                            studentArrRow.push({
                                absent: true,
                                label: res.data.list[k].chineseName,
                                studentNo: res.data.list[k].studentNo,
                                scheduleId: row.scheduleId
                            })
                            tmpArr.pop();
                        }
                        this.studentArrTotal.push(studentArrRow);

                    } else {
                        tmpArr.push({
                            absent: true,
                            label: res.data.list[i].chineseName,
                            studentNo: res.data.list[i].studentNo,
                            scheduleId: row.scheduleId
                        })
                    }

                }

                this.studentArrTotal.push(tmpArr);

                this.absentVisible = true;

            } else {

                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });

                this.absentVisible = false;

            }

        });

        //this.absentVisible = true;
    }

    public clearArray(arrr: Array < any > ) {
        while (arrr.length > 0) {
            arrr.pop();
        }
    }

    closeDialog() {
        this.dialogVisible = false;

        this.loadSearchData();

    }

    closeAddAbsent() {
        this.absentVisible = false;
        this.clearArray(this.studentArrTotal);
        this.loadSearchData();

    }

    createSchedule() {

        let data: any = {
            classCode: this.selectClassCode
        };

        (this as any).$axios.post("/class/createSchedule", data).then((res: any) => {

            this.$message({
                message: res.data.msg,
                type: res.data.state,
                duration: 3000
            });

            this.loadSearchData();

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
