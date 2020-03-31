<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="学生出勤" width="50%" :visible.sync="absentVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small">

        <el-row v-for="(options,index) in studentArrTotal" :key=index>
            <el-col :span="6" v-for="(item,index) in options" :key=index>
                <div class="grid-content bg-purple">
                    <el-checkbox v-model="item.absent">{{item.label}}</el-checkbox>
                </div>
            </el-col>
        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeAddAbsent')" size="small">取消</el-button>
        <el-button @click="submitForm" type="primary" size="small">确定</el-button>
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
export default class AddAbsent extends Vue {
    @Getter("user") getUser: any;

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) absentVisible!: boolean;

    @Provide() form: any = {
        teacherName: "",
        teacherType: "",
        memo: ""
    };

    @Prop(Array) studentArrTotal!: [];

   

    @Provide() rules: any = {

    };

    //   @Provide() studentArrTotal: Array < any > = [];
    //     // @Provide() options: Array<any> = [];

    //   @Provide() studentArrRow: Array < any > = [ ]

    submitForm() {

        // 加载搜索数据        

        let tmp: Array < any > = [];

        for (let i = 0; i < this.studentArrTotal.length; i++) {

            let sss: Array < any > = [];
            sss = this.studentArrTotal[i];

            for (let j = 0; j < sss.length; j++) {
               
                tmp.push(sss[j]);
            }

        }

        let data: any = {

            abcentRecord: tmp
        };
        (this as any).$axios.post("/student/createAbsent", tmp).then((res: any) => {
            this.$message({
                message: res.data.msg,
                type: "success"
            });
            if (res.data.state = "success") {
                this.$emit('closeAddAbsent')
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
