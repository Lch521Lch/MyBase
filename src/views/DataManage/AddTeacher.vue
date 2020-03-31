<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="新增教师信息" width="50%" :visible.sync="dialogVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small">
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教师姓名" prop="teacherName">
                        <el-input v-model="form.teacherName" placeholder="请输入教师姓名，中间不能有空格.名和※之间请用 '_', 举例： Michael_Jordan"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="教师类型" prop="teacherType">
                        <el-select v-model="form.teacherType" placeholder="请选择教师类型">
                            <el-option label="中教" value="中教"></el-option>
                            <el-option label="外教" value="外教"></el-option>
                            <el-option label="班主任" value="外教"></el-option>

                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="20">
                <div class="grid-content bg-purple-light">

                    <el-form-item label="备注" prop="memo">
                        <el-input type="textarea" autosize v-model="form.memo"></el-input>
                    </el-form-item>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeDialog')" size="small">取消</el-button>
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
export default class EditDialog extends Vue {
    @Getter("user") getUser: any;

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) dialogVisible!: boolean;
    @Provide() form: any = {
        teacherName: "",
        teacherType: "",
        memo: ""
    };

     

    @Provide() rules: any = {
        teacherName: [{
            required: true,
            message: "请输入教师姓名",
            trigger: ["blur", "change"]
        }],
        teacherType: [{
            required: true,
            message: "请选择教师类型",
            trigger: ["blur", "change"]
        }]

    };

    submitForm(formName: string) {

        if (this.checkTeacherName(this.form.teacherName)) {
            (this as any).$refs[formName].validate((valid: boolean) => {
                if (valid) {
                    (this as any).$axios
                        .post("teacher/insert", this.form)
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

        } else {
            this.$message({
                message: "教师姓名中间不能有空格",
                type: "error"
            });
        }

    }

    resetForm(formName: string) {
        (this as any).$refs[formName].resetFields();
    }

    checkTeacherName(name: string): boolean {
        name = name.trim();
        let b: boolean = true;
        for (let i = 0; i < name.length; i++) {
            if (name[i] == " ") {
                b = false;
                break;
            }

        }

        return b;
    }

    created() {

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
