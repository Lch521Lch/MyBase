<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="学生信息详细" width="50%" :visible.sync="dialogVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="学生编号" prop="studentNo">
                        <el-input v-model="form.studentNo" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form-item label="英文姓名" prop="englishName">
                        <el-input v-model="form.englishName" placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="中文姓名" prop="chineseName">
                        <el-input v-model="form.chineseName" placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <!-- ssss -->
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="中文拼音" prop="phoneticName">
                        <el-input v-model="form.phoneticName" placeholder="请输入中文拼音"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form-item label="联系电话" prop="telNo">
                        <el-input v-model="form.telNo" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="form.sex" placeholder="请选择性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>

                        </el-select>

                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker type="date" placeholder="出生日期" v-model="form.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form-item label="创建人" prop="createPerson">
                        <el-input v-model="form.createPerson" placeholder="请输入建档人"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="建档日期" prop="createDate">
                        <el-date-picker type="date" placeholder="建档日期" v-model="form.createDate" value-format="yyyy-MM-dd"></el-date-picker>

                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="Leads Source" prop="studentSource">
                        <el-select v-model="form.studentSource" placeholder="请选择Leads Source" :disabled=true>
                            <el-option label="Call In" value="Call In"></el-option>
                            <el-option label="Walk In" value="Walk In"></el-option>
                            <el-option label="Offlin" value="Offlin"></el-option>
                            <el-option label="Online" value="Online"></el-option>
                        </el-select>

                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form-item label="备注" prop="memo">
                        <el-input v-model="memo" placeholder="请输入备注信息"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>

        <el-row>

            <el-col :span="16">
                <div class="grid-content bg-purple">
                    <el-form-item label="备注历史" prop="memoHistory">
                        <el-input type="textarea" autosize :disabled=true v-model="form.memoHistory"></el-input>
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
    @Prop(Object) form!: {
        memo: string;
    };

    @Provide() memo: string = "";

    @Provide() fileList: any = [];

    @Provide() disableEdit: boolean = true;

    @Provide() fileName: string = "";
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
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                this.form.memo = this.memo;

                (this as any).$axios.post("/student/update", this.form).then((res: any) => {

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
