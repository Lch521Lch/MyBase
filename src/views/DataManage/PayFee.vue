<template>
<el-dialog :close-on-click-modal="false" :show-close="false" title="缴费" width="72%" :visible.sync="payFeeVisible">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px" size="small" class="form-box">
        <el-row v-if="false">
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
                        <el-input v-model="form.englishName" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="中文姓名" prop="chineseName">
                        <el-input v-model="form.chineseName" :disabled=true placeholder="请输入网站名称"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <!-- 单选框-->
        <el-row>

        </el-row>

        <!--  学费 ----------------------------------------------------------------------------------------------------------- -->
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <div class="grid-content bg-purple-light">
                    <el-radio v-model="payType" label="tuition" @change="radioChange">学费</el-radio>
                </div>
            </el-col>
            <el-col :span="2">
                <div class="grid-content bg-purple-light">
                    <el-select size="mini" :disabled="tuitionDisabled" v-model="courseCost" placeholder="请选择课程代码" @change="courseSelect">
                        <el-option v-for="item in courses" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                </div>
            </el-col>

            <el-col :span="5">
                <div class="grid-content bg-purple-light">
                    <el-form-item label="目录价" prop="courseCost">
                        <el-input :disabled=true size="mini" v-model="courseCost"></el-input>
                    </el-form-item>
                </div>
            </el-col>

            <el-col :span="5">
                <el-form-item label="优惠款" prop="courseRate">
                    <el-input :disabled="tuitionDisabled" v-model="courseRate" size="mini" @input="courseSelect"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="5">

                <el-form-item label="成交价" prop="courseTotal">
                    <el-input :disabled=true v-model="courseTotal" size="mini"></el-input>
                </el-form-item>

            </el-col>
            <el-col :span="4">

                <el-form-item label="缴费方式" prop="courseTotal">
                    <el-select size="mini" v-model="courseFeeType" placeholder="缴费方式" :disabled="tuitionDisabled">
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="支付宝" value="支付宝"></el-option>
                        <el-option label="银行卡" value="银行卡"></el-option>
                        <el-option label="现金" value="现金"></el-option>
                        <el-option label="电汇" value="电汇"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <!--  教材费 --------------------------------------------------------------  -->
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <div class="grid-content bg-purple">
                    <el-radio v-model="payType" label="bookFee" @change="radioChange">书费</el-radio>
                </div>
            </el-col>
            <el-col :span="2">
                <el-select size="mini" :disabled="bookDisabled" v-model="bookCost" placeholder="请选择课程代码" @change="bookSelect">
                    <el-option v-for="item in books" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

            </el-col>
            <el-col :span="5">

                <div class="grid-content bg-purple-light">

                    <el-form-item label="目录价:" prop="chineseName">
                        <el-input :disabled=true size="mini" v-model="bookCost"></el-input>
                    </el-form-item>

                </div>

            </el-col>
            <el-col :span="5">

                <el-form-item label="优惠:" prop="chineseName">
                    <el-input :disabled="bookDisabled" v-model="bookRate" size="mini" @input="bookSelect"></el-input>
                </el-form-item>

            </el-col>
            <el-col :span="5">

                <el-form-item label="成交价:" prop="chineseName">
                    <el-input :disabled=true v-model="bookTotal" size="mini"></el-input>
                </el-form-item>

            </el-col>

            <el-col :span="4">

                <el-form-item label="缴费方式" prop="courseTotal">
                    <el-select size="mini" v-model="bookFeeType" placeholder="缴费方式" :disabled="bookDisabled">
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="支付宝" value="支付宝"></el-option>
                        <el-option label="银行卡" value="银行卡"></el-option>
                        <el-option label="现金" value="现金"></el-option>
                        <el-option label="电汇" value="电汇"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-divider></el-divider>

        <!--  退款费 --------------------------------------------------------------  -->
        <el-row>
            <el-col :span="14">
                <div class="grid-content bg-purple-light">
                    <el-radio v-model="payType" label="refund" @change="radioChange">退费</el-radio>
                </div>
            </el-col>
            <el-col :span="5">

                <div class="grid-content bg-purple-light">

                    <el-form-item label="退费金额:" prop="chineseName">
                        <el-input :disabled="refundDisabled" size="mini" v-model="refundCost" placeholder="请输入退费金额"></el-input>

                    </el-form-item>
                </div>

            </el-col>
            <el-col :span="4">

                <el-form-item label="缴费方式" prop="courseTotal">
                    <el-select size="mini" v-model="refundFeeType" placeholder="缴费方式" :disabled="refundDisabled">
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="支付宝" value="支付宝"></el-option>
                        <el-option label="银行卡" value="银行卡"></el-option>
                        <el-option label="现金" value="现金"></el-option>
                        <el-option label="电汇" value="电汇"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>

            </el-col>
            <el-col :span="8">

            </el-col>
        </el-row>

    </el-form>
    <el-divider></el-divider>

    <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closePayFee')" size="small">取消</el-button>
        <el-button @click="openMessage" type="primary" size="small">确定</el-button>
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
export default class PayFee extends Vue {
    @Getter("user") getUser: any;

    @Provide() courseFeeType: string = "微信";

    @Provide() bookFeeType: string = "微信";

    @Provide() refundFeeType: string = "微信";

    // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
    @Prop(Boolean) payFeeVisible!: boolean;
    @Prop(Object) form!: {
        studentNo: ""
    };

    @Provide() courses: any = [];
    @Provide() books: any = [];

    @Provide() payType: any = "tuition";

    @Provide() courseCost: number = 0

    @Provide() bookCost: number = 0

    @Provide() refundCost: number = 0

    @Provide() courseRate: number = 0
    @Provide() bookRate: number = 0

    @Provide() courseTotal: number = 0;

    @Provide() bookTotal: number = 0;

    @Provide() refundDisabled: boolean = true;

    @Provide() bookDisabled: boolean = true;

    @Provide() tuitionDisabled: boolean = false;

    @Provide() rules: any = {
        englishName: [{
            required: true,
            message: "请输入英文姓名",
            trigger: ["blur", "change"]
        }],
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
                    value: res.data.list[i].courseCost,
                    label: res.data.list[i].courseCode
                })
            }
        });
    }

    // 读取教材编号信息 
    loadBookData() {

        (this as any).$axios.post("/room/book").then((res: any) => {

            if (res.data.state == "error") {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });
                return;
            }
            for (var i = 0; i < res.data.list.length; i++) {

                this.books.push({
                    value: res.data.list[i].bookFee,
                    label: res.data.list[i].bookCode
                })
            }
        });
    }

    radioChange() {

        if (this.payType === "tuition") {

            this.tuitionDisabled = false;
            this.bookDisabled = true;
            this.refundDisabled = true;
        } else if (this.payType === "bookFee") {
            this.tuitionDisabled = true;
            this.bookDisabled = false;
            this.refundDisabled = true;

        } else {
            this.tuitionDisabled = true;
            this.bookDisabled = true;
            this.refundDisabled = false;
        }

    }

    courseSelect() {

        if (String(this.courseRate).length == 0) {
            return;
        }

        if (!this.checkRate(String(this.courseRate))) {
            this.$message({
                message: "请输入数字",
                type: "error"
            });
            return;
        }

        // 学费会取整
        this.courseTotal = Math.ceil(this.courseCost - this.courseRate);

    }

    bookSelect() {

        if (String(this.bookRate).length == 0) {
            return;
        }

        if (!this.checkRate(String(this.bookRate))) {
            this.$message({
                message: "请输入数字",
                type: "error"
            });
            return;
        }

        //折扣后价格会向上取整   
        this.bookTotal = Math.ceil(this.bookCost - this.bookRate);

    }

    // 检查输入折扣
    checkRate(str: string): Boolean {
         //let reg5: RegExp = /^[0-9]/i;
         let reg5: RegExp = /^[0-9]+$/i;
        return reg5.test(String(str));
    }

    //  ECMAScript通过RegExp类型来支持正则表达式。

    // var expression=/pattern/flags;

    //  每个正则表达式都可带有一或多个标志(flags).

    // g：表示全局模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止；

    // i：表示不区分大小写模式，即在确定匹配项时忽略模式与字符串的大小写；

    // m：表示多行模式，即在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。

    // 1）RegExp实例属性

    // 1.1）global:布尔值，表示是否设置了g标志。

    // 1.2）ignoreCase：布尔值，表示是否设置了i标志。

    // 1.3）lastIndex:整数，表示开始搜索下一个匹配项的字符位置，从0算起。

    // 1.4）multiline：布尔值，表示是否设置了m标志。

    // 1.5）source：正则表达式的字符串表示，按照字面量形式而非传入构造函数中的字符串模式返回。

    // 2）RegExp实例方法

    // 2.1）exec()：接受一个参数，即要应用模式的字符串，然后返回包含第一匹配项信息的数组；或者在没有匹配项的情况下返回null。

    // var text1="mom and dad and baby";
    // var pattern=/mom( and dad( and baby)?)?/gi;
    // var matches=pattern.exec(text1);
    // console.log(matches.index);//=>0
    // console.log(matches.input);//=>"mom and dad and baby"
    // console.log(matches[0]);//=>"mom and dad and baby"
    // console.log(matches[1]);//=>"and dad and baby"
    // console.log(matches[2]);//=>"and baby

    // 2.2）test():接受一个字符串参数。在模式与该参数匹配的情况下返回true；否则，返回false.

    // var text2="000-00-0000";
    // var pattern2=/\d{3}-\d{2}-\d{4}/;
    // if(pattern2.test(text2)){
    //     console.log("格式正确");//=>格式正确
    // }
    // 3)RegExp构造函数属性

    // //RegExp构造函数属性 (IE不支持multiline属性)
    // var text3="this has been a short summer";
    // var pattern3=/(.)hort/g;
    // if(pattern3.test(text3)){
    //     console.log(RegExp.input);//=>"this has been a short summer"
    //     console.log(RegExp.leftContext);//=>"this has been a "
    //     console.log(RegExp.rightContext);//=>" summer"
    //     console.log(RegExp.lastMatch);//=>"short"
    //     console.log(RegExp.lastParen);//=>"s"
    //     console.log(RegExp.multiline);//=>undefined
    // }

    submit() {

        let courseCost: Number = 0;
        let courseRate: Number = 100;
        let courseTotal: Number = 0;
        let courseWay: string = "";

        if (this.payType == "tuition") {

            courseCost = this.courseCost;
            courseRate = this.courseRate;
            courseTotal = this.courseTotal;
            courseWay = this.courseFeeType;

        } else if (this.payType == "bookFee") {

            courseCost = this.bookCost;
            courseRate = this.bookRate;
            courseTotal = this.bookTotal;
            courseWay = this.bookFeeType;

        } else {
            courseCost = 0 - this.refundCost;
            courseTotal = 0 - this.refundCost;
            courseWay = this.refundFeeType;
        }

        let data: any = {
            courseCost: courseCost,
            courseRate: courseRate,
            courseTotal: courseTotal,
            payType: this.payType,
            payStaff: this.getUser.username,
            studentNo: this.form.studentNo,
            payWay: courseWay
        };

        (this as any).$axios.post("/student/pay", data).then((res: any) => {

            if (res.data.state == res.data.state) {
                this.$message({
                    message: res.data.msg,
                    type: res.data.state,
                    duration: 3000
                });

            }

        });

    }

    openMessage() {
        this.$confirm('请再次确定缴费金额是否正确，确定后不能更改记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.submit()
        }).catch(() => {

        });
    }

    created() {
        this.loadCoursehData();
        this.loadBookData();

        if (this.getUser.username == '%') {
            this.getUser.username = "admin"
        }
    }

}
</script>

<style lang="scss" scoped>
.form-box {
    .el-form-item {
        width: 50px !important;
    }

    .el-input {
        width: 100px !important;
    }

    .el-select {
        width: 100px !important;
    }

}
</style>
