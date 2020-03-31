<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="新增班级信息" width="75%" :visible.sync="dialogVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="课程编号" prop="courseCode">

                        <el-select v-model="form.courseCode" filterable placeholder="请选择课程代码">
                            <el-option v-for="item in courses" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>

                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                    <el-form-item label="开课日期" prop="beginDate">
                        <el-date-picker v-model="form.beginDate" type="date" value-format="yyyyMMdd"  placeholder="选择班级开课日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
          
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="班主任" prop="headTeacher">
                        <el-select v-model="form.headTeacher" filterable placeholder="班主任">
                            <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="课节次数" prop="ClassFrequenc">
                        <el-input v-model="form.ClassFrequenc" placeholder="课节次数"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <!--  -->
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教师1" prop="teacher1">
                        <el-select v-model="form.teacher1" filterable placeholder="教师1">
                            <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="星期1" prop="week1">
                        <el-select v-model="form.week1" placeholder="选择星期">
                            <el-option v-for="item in weeks " :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="时间1" prop="time1">
                        <el-time-select v-model="form.time1" :picker-options="{
                                                                   start: '09:00',
                                                                   step: '00:15',
                                                                   end: '20:00'
                                                                }" placeholder="上课时间1">
                        </el-time-select>
                    </el-form-item>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="下课时间1" prop="endTime1">
                        <el-time-select v-model="form.endTime1" :picker-options="{
                                                                   start: '09:00',
                                                                   step: '00:15',
                                                                   end: '20:00'
                                                                }" placeholder="下上课时间1">
                        </el-time-select>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>
        <!--  -->
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教师2" prop="teacher2">
                        <el-select v-model="form.teacher2" filterable placeholder="请选教师2">
                            <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="星期2" prop="week2">
                        <el-select v-model="form.week2" placeholder="选择星期">
                            <el-option v-for="item in weeks " :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="时间2" prop="time2">
                        <el-time-select v-model="form.time2" :picker-options="{
                                                                    start: '09:00',
                                                                    step: '00:15',
                                                                    end: '20:00'
                                                                }" placeholder="选择上课时间">
                        </el-time-select>
                    </el-form-item>
                </div>
            </el-col>

                        <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="下课时间2" prop="endTime2">
                        <el-time-select v-model="form.endTime2" :picker-options="{
                                                                    start: '09:00',
                                                                    step: '00:15',
                                                                    end: '20:00'
                                                                }" placeholder="下课时间">
                        </el-time-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>
               <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教室编号" prop="roomCode">
                        <el-select v-model="form.roomCode" placeholder="请选择教室编号">
                            <el-option v-for="item in rooms" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="最小学生数" prop="minStudents">
                        <el-input v-model="form.minStudents" placeholder="最小学生数"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="最大学生数" prop="maxStudents">
                        <el-input v-model="form.maxStudents" placeholder="最大学生数"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')"  type="warning" size="small">重置</el-button>
         <el-button @click="close"  type="info" size="small">取消</el-button>
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
export default class AddClass extends Vue {
    @Getter("user") getUser: any;

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) dialogVisible!: boolean;
    @Provide() form: any = {
        beginDate: ""
    };
    @Provide() beginDate: any ="";

    

    @Provide() rules: any = {
        courseCode: [{
            required: true,
            message: "请选择课程代码",
            trigger: ["blur", "change"]
        }]        
        ,
        beginDate: [{
            required: true,
            message: "b",
            trigger: [ "blur","change"]
        }],
        roomCode: [{
            required: true,
            message: "请选择教室代码",
            trigger: ["blur", "change"]
        }],
        headTeacher: [{
            required: true,
            message: "请选择班主任",
            trigger: ["blur", "change"]
        }],
        teacher1: [{
            required: true,
            message: "请选择教师",
            trigger: ["change"]
        }],
        week1: [{
            required: true,
            message: "a",
            trigger: [ "change"]
        }],
        time1: [{
            required: true,
            message: "请选择上课时间1",
            trigger: ["blur", "change"]
        }],
        
        minStudents: [{
            required: true,
            message: "请输入班级最小人数",
            trigger: ["blur"]
        }],
        maxStudents: [{
            required: true,
            message: "请输入班级最大人数",
            trigger: ["blur"]
        }]
        ,
        endTime1: [{
            required: true,
            message: "请选择下课时间1",
             trigger: ["blur", "change"]
        }],
           ClassFrequenc: [{
            required: true,
            message: "请输入班级最大人数",
            trigger: ["blur"]
        }]
        
    };

    @Provide() rooms: any = [];

    @Provide() courses: any = [];

    @Provide() teachers: any = [];

    @Provide() weeks: any = [{
            value: 'Mon',
            label: 'Mon'
        }, {
            value: 'Tues',
            label: 'Tues'
        }, {
            value: 'Wed',
            label: 'Wed'
        }, {
            value: 'Thur',
            label: 'Thur'
        }, {
            value: 'Fri',
            label: 'Fri'
        }, {
            value: 'Sat',
            label: 'Sat'
        }, {
            value: 'Sun',
            label: 'Sun'
        }

    ]

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
    // 读取课程编号信息 
    loadCoursehData() {

        (this as any).$axios.post("/course/search").then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }
            for (var i = 0; i < res.data.list.length; i++) {

                this.courses.push({
                    value: res.data.list[i].courseCode,
                    label: res.data.list[i].courseCode
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

    submitForm(formName: string) {        

        (this as any).$refs[formName].validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post("class/insert", this.form)
                    .then((res: any) => {

                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                        if (res.data.state === 'success') {
                            this.resetForm(formName);
                        }

                    });
            }
        });
    }

    resetForm(formName: string) {
        (this as any).$refs[formName].resetFields();
    }

    close(){
       this.resetForm('ruleForm');
        this.$emit('closeDialog');
    }

    created() {
        this.loadRoomhData();
        this.loadCoursehData();
        this.loadTeacherhData();

    }
    mounted() {

    }

}
</script>

<style lang="scss" scoped>
.form-box {

    .el-form-item {
        width: 50px !important;
    }

    .el-input {
        width: 130px !important;
    }

    .el-select {
        width: 130px !important;
    }
}
</style>
