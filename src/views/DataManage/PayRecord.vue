<template>
<div class="table-data">
    <div class="search-box">
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <el-row>
                        <el-col :span="8">
                            <div class="grid-content bg-purple-light">
                                <el-input size="mini" v-model="searchVal" placeholder="请输入学生姓名" @input="searchPay(searchVal)"></el-input>
                                <el-button size="mini" type="primary" icon="el-icon-search" @click="searchPay(searchVal)">搜索</el-button>
                            </div>
                        </el-col>

                        <el-col :span="14">
                            <div class="block">
                                <el-date-picker size="mini" v-model="selectDate" type="date" value-format="yyyy-MM-dd" placeholder="选择查询日期" @change="searchPay(selectDate)"></el-date-picker>
                            </div>
                        </el-col>

                        <el-col :span="2">
                            <div class="grid-content bg-purple-light">

                            </div>
                        </el-col>
                    </el-row>

                </div>
            </el-col>
        </el-row>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">

        <el-table-column fit label="缴费类型" prop="payType" align="center"></el-table-column>
        <el-table-column width="200" label="缴费日期" prop="payDate" align="center"></el-table-column>
        <el-table-column fit label="应缴金额" prop="courseCost" align="center"></el-table-column>

        <el-table-column fit label="折扣" prop="courseRate" align="center"></el-table-column>
        <el-table-column fit label="实缴金额" prop="courseTotal" align="center"></el-table-column>
        <el-table-column fit label="缴费方式" prop="payWay" align="center"></el-table-column>
        <el-table-column fit label="收款人" prop="payStaff" align="center"></el-table-column>
        <el-table-column fit label="学生姓名" prop="chineseName" align="center"></el-table-column>

        <el-table-column label="操作" git align="center" v-if="getUser.key == 'admin'">
            <template slot-scope="scope">

                <el-button @click="handleEdit(scope.$index,scope.row)" size="mini" type="danger">修改</el-button>

            </template>
        </el-table-column>

    </el-table>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[50,100,200,9999]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>

    <EditPayRecord :dialogVisible="dialogVisible" :form="formData" @closeDialog="closeDialog"></EditPayRecord>

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

import FileSaver from "file-saver";

import XLSX from "xlsx";

import EditPayRecord from "./EditPayRecord.vue";

@Component({
    components: {
        EditPayRecord
    }
})
export default class PayRecord extends Vue {
    @Getter("user") getUser: any;
    @Provide() selectDate: any = "";

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 50; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() loading: boolean = true;
    @Provide() searchVal: string = "";

    @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面

    @Provide() formData: object = {

    };

    closeDialog() {

        this.dialogVisible = false;

    }

    handleEdit(index: number, row: any) {

        this.formData = row;
        this.dialogVisible = true;
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
      导出EXCEL
    */
    exportExcel() {
        // 设置当前日期
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day;

        /* generate workbook object from table */
        //  .table要导出的是哪一个表格
        var wb = XLSX.utils.table_to_book(document.querySelector(".table-data"));
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
        });
        try {
            //  name+'.xlsx'表示导出的excel表格名字
            FileSaver.saveAs(
                new Blob([wbout], {
                    type: "application/octet-stream"
                }),
                name + ".xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
    }
    /**
    查询缴费记录

    */
    searchPay(search: string) {
        if (search == null) {
            return;
        }
        if (search.length == 0) {
            return;
        }
        let data: any = {
            search: search
        };
        (this as any).$axios.post("/student/searchPayRecord", data).then((res: any) => {
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
</script>

<style lang="scss" scoped>
.table-data {
    height: 100%;

    .table-box {
        font-size: 14px;
    }

    .pages {
        background: #fff;
        margin-top: 10px;
        padding: 10px 10px;
        text-align: right;
        height: 55px;
        box-sizing: border-box;
    }

    .search-box {
        background: #fff;
        margin-bottom: 10px;
        padding: 10px 10px;
        border-radius: 4px;
        height: 55px;
        box-sizing: border-box;

        .el-input {
            width: 200px;
            margin-right: 10px;
        }
    }
}
</style>
