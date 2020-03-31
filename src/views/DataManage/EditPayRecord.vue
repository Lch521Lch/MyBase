<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="修改缴费记录" width="50%" :visible.sync="dialogVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="学生编号" prop="studentNo">
                        <el-input v-model="form.studentNo" :disabled=true placeholder=" "></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>
        <!-- ssss -->
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="修改金额" prop="courseTotal">
                        <el-input v-model="form.courseTotal" @input="modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="修改原因" prop="reason">
                        <el-input v-model="form.reason" placeholder="请输入中文拼音"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="修改历史" prop="memo">
                        <el-input style="width:400px;" :disabled=true v-model="form.memo" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                    </el-form-item>
                </div>
            </el-col>

        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeDialog')" size="small">取消</el-button>
        <el-button @click="submit" type="primary" size="small">确定</el-button>
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
export default class EditPayRecord extends Vue {
    @Getter("user") getUser: any;

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) dialogVisible!: boolean;
    @Prop(Object) form!: {
        payId: string;
        memo: string;
        reason: string;
        courseTotal: number
    };

    @Provide() memo: string = "";

    @Provide() fileList: any = [];

    @Provide() disableEdit: boolean = true;

    @Provide() reason: string = "";

    @Provide() rules: any = {
        reason: [{
            required: true,
            message: "请输入修改原因",
            trigger: ["blur"]
        }],
        courseTotal: [{
            required: true,
            message: "请输入修改金额",
            trigger: ["blur", "change"]
        }]

    };

    modify() {

        if (String(this.form.courseTotal).length == 0) {
            return;
        }

        console.log(this.checkRate(String(this.form.courseTotal)));
        if (!this.checkRate(String(this.form.courseTotal))) {
            this.$message({
                message: "请输入数字",
                type: "error"
            });
            return;
        }

    }

    checkRate(str: string): Boolean {

        let reg5: RegExp = /^[0-9]+$/i;

        return reg5.test(String(str));
    }

    submit() {

        let data: any = {
            payId: this.form.payId,
            courseTotal: this.form.courseTotal,
            memo: this.form.reason
        };

        (this as any).$axios.post("/student/updatePay", data).then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
            } else {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                this.$emit('closeDialog');
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

    .el-input {
        width: 300px !important;
    }

    .el-select {
        width: 300px !important;
    }
}
</style>
