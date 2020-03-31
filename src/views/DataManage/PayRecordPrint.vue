<template>
 <div class="table-data">
    <div class="search-box">
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <el-row>
                        <el-col :span="20">
                            <!-- 
                            <div class="block">
                                <el-date-picker size="mini" v-model="selectDate" type="date" value-format="yyyy-MM-dd" placeholder="选择查询日期" @change="searchPay(selectDate)"></el-date-picker>
                            </div>
                        -->

                            <div class="block">
                                <el-date-picker size="mini" type="daterange" v-model="selectDate" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="searchPay">
                                </el-date-picker>
                            </div>

                        </el-col>
                        <el-col :span="2">

                            <el-button v-print="'#printMe'" size="mini" type="success">打印</el-button>
                        </el-col>

                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
    <div id="printMe">
        <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border stripe style="width:100%"   class="table-box-print">

            <el-table-column fit label="缴费类型" prop="payType" align="center" sortable></el-table-column>
            <el-table-column width="200" label="缴费日期" prop="payDate" align="center" sortable></el-table-column>
            <el-table-column fit label="应缴金额" prop="courseCost" align="center"></el-table-column>

            <el-table-column fit label="折扣" prop="courseRate" align="center" sortable></el-table-column>
            <el-table-column fit label="实缴金额" prop="courseTotal" align="center" ></el-table-column>
            <el-table-column fit label="缴费方式" prop="payWay" align="center" sortable ></el-table-column>
            <el-table-column fit label="收款人" prop="payStaff" align="center" sortable ></el-table-column>
            <el-table-column fit label="学生姓名" prop="chineseName" align="center" sortable ></el-table-column>

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
    components: {}
})

export default class PayRecordPrint extends Vue {
    @Getter("user") getUser: any;
    @Provide() selectDate: any = "";

    @Provide() tHeight: number = document.body.offsetHeight - 100;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 50; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() loading: boolean = true;

    test() {
        console.log(this.selectDate);
        console.log(this.selectDate[0]);
        console.log(this.selectDate[1]);
        this.searchPay();
    }

    created() {

        this.loading = false;
    }
    handleSizeChange(val: number): void {
        this.size = val;
        this.page = 1;
        //this.searchVal ? this.loadSearchData() : this.loadData();
    }
    handleCurrentChange(val: number): void {
        this.page = val;
        //this.searchVal ? this.loadSearchData() : this.loadData();
    }

    /**
    查询缴费记录

    */
    searchPay() {

        if (this.selectDate.length < 2) {
            return;
        }

        let data: any = {
            beginDate: this.selectDate[0],
            endDate: this.selectDate[1],

        };

        (this as any).$axios.post("/student/searchPayRecordWithDateRange", data).then((res: any) => {
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
}
PayRecordPrint.use(Print);
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
