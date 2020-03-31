<template>
<div class="form-data">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px">
        <el-row>

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
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="中文拼音" prop="phoneticName">
                        <el-input v-model="form.phoneticName" placeholder="请输入中文拼音"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>
        <!-- ssss -->
        <el-row>

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
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker type="date" placeholder="出生日期" v-model="form.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>

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

            <el-col :span="8">
                <div class="grid-content bg-purple-light">

                    <el-form-item label="LeadsSource" prop="studentSource">
                        <el-select v-model="form.studentSource" placeholder="请选择Leads Source"  >
                            <el-option label="Call In" value="Call In"></el-option>
                            <el-option label="Walk In" value="Walk In"></el-option>
                            <el-option label="Offlin" value="Offlin"></el-option>
                            <el-option label="Online" value="Online"></el-option>
                        </el-select>

                    </el-form-item>
                </div>
            </el-col>
        </el-row>

        <el-row>

            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-form-item label="备注" prop="memo">
                        <el-input type="textarea" autosize v-model="form.memo"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>

        <el-form-item>

            <el-button @click="submitForm('ruleForm')" type="primary" icon="el-icon-check">新增</el-button>
            <el-button @click="resetForm('ruleForm')" type="info" icon="el-icon-search">重置</el-button>
        </el-form-item>
    </el-form>
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
@Component({
    components: {}
})
export default class FormData extends Vue {
    @Getter("user") getUser: any;
    @Provide() form: any = {
        city: "",
        net_name: "",
        domain: ""
    };
    @Provide() disableAdd: boolean = true;

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
        ,
        studentSource: [{
            required: true,
            message: "请选择来源",
            trigger: ["blur", "change"]
        }]
    };

    submitForm(formName: string) {
        (this as any).$refs[formName].validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post("student/insert", this.form)
                    .then((res: any) => {

                        this.$message({
                            message: res.data.msg,
                            type: "success"
                        });

                        if (res.data.state === 'success') {
                            this.resetForm(formName);
                        }

                        this.disableAdd = true;
                    });
            }
        });
    }

    check(formName: string) {
        (this as any).$refs[formName].validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post("student/check", this.form)
                    .then((res: any) => {
                        if (res.data.total > 0) {

                            this.$message({
                                message: "清单库已经存在",
                                type: "info"
                            });
                        } else {
                            this.disableAdd = false;
                            this.$message({
                                message: "可以新增到清单库",
                                type: "success"
                            });
                        }
                    });
            }
        });
    }
    resetForm(formName: string) {
        (this as any).$refs[formName].resetFields();
    }

    created() {
        let cityname: any = localStorage.getItem("cityname");
        if (cityname != "%") {
            this.form.city = cityname;
        }
    }
}
</script>

<style lang="scss" scoped>
.form-data {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    padding: 35px;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);

    .el-input,
    .el-select {
        width: 200px !important;
    }

    .division {
        margin: 0 10px;
        color: #606266;
    }
}
</style>
