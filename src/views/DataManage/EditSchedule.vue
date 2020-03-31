<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="编辑课程表" width="50%" :visible.sync="dialogVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="课程表ID" prop="scheduleId">
                        <el-input v-model="form.scheduleId" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="班级代码" prop="classCode">
                        <el-input v-model="form.classCode" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>
        <!-- ssss -->
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-form-item label="教室代码" prop="roomCode">
                        <el-select v-model="form.roomCode" filterable placeholder="请选择教室编号">
                            <el-option v-for="item in rooms" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教师姓名" prop="scheduleTeacher">
                        <el-select v-model="form.scheduleTeacher" filterable placeholder="请选择老师姓名">
                            <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

            </el-col>

        </el-row>
        <el-row>

            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="开课日期" prop="beginDate">
                        <el-date-picker v-model="selectDate" type="date" placeholder="选择班级开课日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="时间" prop="time2">
                        <el-time-select v-model="form.scheduleTime" :picker-options="{
                                                                    start: '08:30',
                                                                    step: '00:30',
                                                                    end: '20:00'
                                                                }" placeholder="选择上课时间">
                        </el-time-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="close()" size="small">取消</el-button>
        <el-button @click="submitForm('ruleForm')" type="primary" size="small">确定</el-button>
    </span>
</el-dialog>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Prop,
    Provide
} from "vue-property-decorator";
import {
    State,
    Getter,
    Mutation,
    Action
} from "vuex-class";

@Component({
    components: {}
})
export default class EditSchedule extends Vue {
    @Getter("user") getUser: any;

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) dialogVisible!: boolean;
    @Prop(Object) form!: {
        scheduleDate: any;
    };

    @Provide() rooms: any = [];

    @Provide() teachers: any = [];

    //@Provide() selectDate: string = "";
    @Provide() selectDate: any = new Date();

    @Provide() rules: any = {
        englishName: [{
            required: true,
            message: "请输入英文姓名",
            trigger: ["blur", "change"]
        }],
        chineseName: [{
            required: true,
            message: "请输入中文姓名",
            trigger: "blur"
        }],
        sex: [{
            required: true,
            message: "请选择性别",
            trigger: ["blur", "change"]
        }],
        phoneticName: [{
            required: true,
            message: "请输入中文姓名拼音",
            trigger: ["blur"]
        }],
        telNo: [{
            required: true,
            message: "请输入联系电话",
            trigger: ["blur"]
        }],
        birthday: [{
            required: true,
            message: "请选择出生日期",
            trigger: ["blur", "change"]
        }],
        createPerson: [{
            required: true,
            message: "请输入建档人信息",
            trigger: ["blur"]
        }],
        createDate: [{
            required: true,
            message: "请选择建档日期",
            trigger: ["blur", "change"]
        }]
    };

    submitForm(formName: any) {

        let startYear: string | number = this.selectDate.getFullYear();
        let startMonth: string | number = this.selectDate.getMonth() + 1;
        let startDay: string | number = this.selectDate.getDate();

        if (startMonth <= 9) {
            startMonth = "0" + startMonth;
        }

        if (startDay <= 9) {
            startDay = "0" + startDay;
        }

        this.form.scheduleDate = startYear + "" + startMonth + startDay;

        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {

                (this as any).$axios.post("/class/updateSchedule", this.form).then((res: any) => {

                    this.$emit("closeDialog");
                    if (res.data.state == "success") {
                        this.$message({
                            message: res.data.msg,
                            type: "success",
                            duration: 4000
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });

            }
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
            }
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
            }
        });
    }

    close() {
        this.selectDate = "";
        (this as any).$emit('closeDialog')
    }

    created() {
        this.loadRoomhData();
        this.loadTeacherhData();
    }
    mounted() {

    }

}
</script>

<style lang="scss" scoped>
.form-box {

    .el-input,
    .el-select {
        width: 200px !important;
    }
}
</style>
