<template>
<div class="table-data">
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>       
        <el-table-column fit label="课程类型" prop="courseType" align="center"></el-table-column>
          <el-table-column fit label="课程代码" prop="courseCode" align="center" sortable></el-table-column>
        <el-table-column fit label="课程次数" prop="courseDuration" align="center"></el-table-column>
         <el-table-column fit label="课程周期" prop="courseCycle" align="center"></el-table-column>
           <el-table-column fit label="课程价格" prop="courseCost" align="center"></el-table-column>
           <el-table-column fit label="课时单价" prop="univalence" align="center"></el-table-column>
       

       
    </el-table>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[50,100,200,9999]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
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
import EditDialog from "./AddTeacher.vue";
@Component({
    components: {
        EditDialog
    }
})
export default class Course extends Vue {    

    @Getter("user") getUser: any;     

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 50; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面
    @Provide() formData: object = {

    };
    @Provide() loading: boolean = true;

  
     @Provide()  searchVal:string = "";
    

    created() {
        this.loadSearchData();
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

    handleSearch(): void {
        // 点击搜索
        this.page = 1;
        this.searchVal ? this.loadSearchData() : this.loadSearchData();
    }

    /**
     查询课程信息   
    */
    loadSearchData() {
        let data: any = {
            searchVal: this.searchVal
        };
        (this as any).$axios.post("/course/search", data).then((res: any) => {

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
