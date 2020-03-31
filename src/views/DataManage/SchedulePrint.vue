<template>
<div class="table-data">

    <div class="search-box">
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <el-row>
                        <el-col :span="5">
                            <div class="grid-content bg-purple-light">

                                <el-date-picker size="mini" v-model="selectDate" type="date" value-format="yyyyMMdd" placeholder="选择查询日期" @change="searchSchedule"></el-date-picker>

                            </div>
                        </el-col>

                        <el-col :span="5">
                            <div class="grid-content bg-purple-light">

                                <el-select  size="mini" v-model="selectTeacher" filterable placeholder="教师" @change="searchSchedule">
                                    <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>

                        </el-col>
                        <el-col :span="5">
                            <div class="grid-content bg-purple-light">

                                <el-select  size="mini"  v-model="selectRoom" placeholder="请选择教室编号" @change="searchSchedule">
                                    <el-option v-for="item in rooms" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>

                        </el-col>
                                              <el-col :span="5">
                            <div class="grid-content bg-purple-light">
                               <el-button v-print="'#printMe'" size="mini" type="success">打印</el-button>
                            </div>

                        </el-col>

                    </el-row>
                </div>
            </el-col>

        </el-row>
    </div>
     <div id="printMe">
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border stripe style="width:100%" class="table-box-print">
        <el-table-column v-if="false" type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column v-if="false" fit label="id" prop="scheduleId" align="center"></el-table-column>
        <el-table-column width="200" label="班级" prop="classCode" align="center"></el-table-column>
        <el-table-column width="80" label="教室" prop="roomCode" align="center"></el-table-column>
        <el-table-column width="120" label="教师姓名" prop="scheduleTeacher" align="center" sortable></el-table-column>
        <el-table-column width="120" label="课程日期" prop="scheduleDate" align="center" sortable></el-table-column>
        <el-table-column width="120" label="上课时间" prop="scheduleTime" align="center" sortable></el-table-column>
        <el-table-column width="120" label="下课时间" prop="scheduleEndtime" align="center" sortable></el-table-column>

    </el-table>
</div>
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

import Print from 'vue-print-nb';

@Component({
    components: {

    }
})
export default class SchedulePrint extends Vue {

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

    @Provide()

    // @Provide() options: any 

    @Provide() currentClassCode: any = [];

    @Provide() selectClassCode: string = "";

    @Provide() createDisabled: boolean = true;

    @Provide() studentArrTotal: Array < any > = [];

    @Provide() selectDate: any = new Date();

    @Provide() selectTeacher: any = "%";

    @Provide() selectRoom: any = "%";

    @Provide() teachers: any = [];

    @Provide() rooms: any = [];

    created() {
        this.loading = false;
        this.loadTeacherhData();
        this.loadRoomhData()
    }

    /**
     查询班级课程表信息   
    */
    searchSchedule() {

        let data: any = {
            scheduleDate: this.selectDate,
            scheduleTeacher: this.selectTeacher,
            room: this.selectRoom
        };
        console.log(data) ;

        (this as any).$axios.post("/class/searchSchedulePrint", data).then((res: any) => {

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

    // 读取教师信息
    loadTeacherhData() {

        let data: any = {
            searchVal: ""
        };
        (this as any).$axios.post("/teacher/search", data).then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }
            for (var i = 0; i < res.data.list.length; i++) {

                this.teachers.push({
                    value: res.data.list[i].teacherName,
                    label: res.data.list[i].teacherName
                })
            };

            this.teachers.push({
                value: '%',
                label: '全部'
            })

        });
    }

    // 读取教室信息
    loadRoomhData() {

        (this as any).$axios.post("/room/search").then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }
            for (var i = 0; i < res.data.list.length; i++) {

                this.rooms.push({
                    value: res.data.list[i].roomCode,
                    label: res.data.list[i].roomCode
                })
            };
            this.rooms.push({
                value: '%',
                label: '全部'
            })
        });
    }

    public clearArray(arrr: Array < any > ) {
        while (arrr.length > 0) {
            arrr.pop();
        }
    }

}

SchedulePrint.use(Print);

</script>

<style lang="scss">
.table-box-print {
    font-size: 8px;

    th {
        padding: 0 !important;
        height: 20px;

    }

    td {
        padding: 0 !important;
        height: 20px;

    }

}

.pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 50px;
    box-sizing: border-box;
}

.search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 50px;
    box-sizing: border-box;

    .el-input {
        width: 200px;
        margin-right: 10px;
    }

}
</style>
