<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="学生选课" width="90%" :visible.sync="chooseClassVisible" class="table-data">
    <el-form ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="学生编号" prop="studentNo">
                        <el-input v-model="form.studentNo" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-form-item label="电话" prop="telNo">
                        <el-input v-model="form.telNo" :disabled=true placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="姓名" prop="chineseName">
                        <el-input v-model="form.chineseName" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="班级人数" prop="chineseName">
                        <el-input v-model="checkClassCode" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>

            <el-row>

                <el-col :span="14">
                    <div class="grid-content bg-purple-light" label="姓名">

                        <el-transfer filterable v-model="selectedClasses" :props="{key: 'id',label: 'name'}" :titles="['待选班级', '已选班级']" @change="handleChange" @left-check-change="handleSelect" :data="currentClasses">
                        </el-transfer>

                    </div>
                </el-col>

                <el-col :span="10">
                    <el-table :data="classHistoryTableData" border stripe style="width:100%" :height="tHeight" class="table-box">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column fit label="班级" prop="classCode" align="center" sortable></el-table-column>
                        <el-table-column label="状态" width="100" prop="status" align="center"></el-table-column>

                        <el-table-column label="操作" width="70" align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger" :disabled="scope.row.status ==='结课' ">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-col>

            </el-row>

        </el-row>

    </el-form>

    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">关闭</el-button>
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
export default class ChooseClass extends Vue {
    @Getter("user") getUser: any;

    @Provide() tHeight: number = 400;
    @Provide() studentNum: number = 0;
    @Provide() checkClassCode: string = "";

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) chooseClassVisible!: boolean;

    @Prop(Object) form!: {
        chineseName: "",
        studentNo: ""
    };

    @Prop(Array) classHistoryTableData!: [];

    @Provide() tableData: any =  this.classHistoryTableData;

    @Prop(Array) currentClasses!: [{
        id: "",
        name: ""
    }];

    @Provide() selectedClasses: any = []

    // 穿梭组件-选择班级模块触发事件

    handleChange(value: any, direction: any, movedKeys: any) {
       // console.log(value, direction, movedKeys);
        //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
        if (direction === "right") {
            //console.log("右侧");
            //  console.log("yesData：\t" + this.yesData.length);
        }
        if (direction === "left") {
            //console.log("左侧");
        }

    }
    //left-check-change
    public async handleSelect(key1: any, key2: any) {
        // console.log(key1);
        let i = key2;
        let classCode = this.currentClasses[i - 1].name;
       
        await this.loadStudentNum(classCode);;
        this.checkClassCode = this.studentNum + "人，" + classCode;
         
    }

    submitForm(formName: any) {

        if (this.selectedClasses.length != 1) {
            this.$message({
                message: "只能选择一个班级，多选，不选都不不可以",
                type: "error"
            });
            return;
        }

     
        let i = this.selectedClasses[0] - 1;
       

        let data: any = {
            studentNo: this.form.studentNo,
            classCode: this.currentClasses[i].name
        };
        

        (this.$refs[formName] as any).validate((valid: boolean) => {
                        if (valid) {

                (this as any).$axios.post("class/insertHis", data).then((res: any) => {

                    if (res.data.state == "success") {
                        this.$message({
                            message: res.data.msg,
                            type: "success",
                            duration: 4000
                        });

                       
                        this.clearArray(this.selectedClasses);
                        this.$emit("loadClassHistory",this.form.studentNo);
                           
                          

                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error",
                            duration: 4000
                        });
                    }
                });

            }
        });
    }

   
    close() {

        this.clearArray(this.currentClasses);       

        this.clearArray(this.selectedClasses);

        this.$emit("closeChooseClass");

    }

    public clearArray(arrr: Array < any > ) {
        while (arrr.length > 0) {
            arrr.pop();
        }
    }

 

    created() {

    }
    mounted() {

    }

    handleDelete(index: number, row: any) {
        
        let data: any = {
            studentNo: row.studentNo,
            classCode: row.classCode
        };
        (this as any).$axios.post("/class/delClassHis", data).then((res: any) => {
            // let msg: string = res.data.state;
            // if (msg == "success") {

            //     this.$message({
            //         message: "删除成功",
            //         type: "success",
            //         duration: 4000
            //     });
            // } else {
            //     this.$message({
            //         message: "删除失败",
            //         type: "error"
            //     });
            // }
            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });

            } else {
                this.classHistoryTableData.splice(index, 1);
                this.$message({
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                });
            }

        });
    }

  

    /**
     *  同步方式获取选取课程的学生数量
     * 
     * */
    public async loadStudentNum(classCode: string) {
        let data: any = {
            studentNo: '%',
            classCode: classCode
        };
       
        try {
            let res = await this.loadStudentNumByClassCode(classCode);
            this.studentNum = res.data.total;

        } catch (err) {
            console.log(err);
            alert('请求出错！');
        }
        

    }
    /**
     * 请求数据库
     * 
     */
    loadStudentNumByClassCode(classCode: string): any {
        let data: any = {
            studentNo: '%',
            classCode: classCode
        };
        let res = (this as any).$axios.post("/class/searchHistory", data);
        return res;
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
