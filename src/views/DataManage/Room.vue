<template>
<div class="table-data">
    <div id="printMe">
        <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData.slice((page - 1) * size, page * size)" border stripe style="width:100%" :height="tHeight" class="table-box">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column fit label="学校" prop="id" align="center"></el-table-column>
            <el-table-column fit label="楼层" prop="floor" align="center"></el-table-column>
            <el-table-column fit label="教室编号" prop="roomCode" align="center" sortable></el-table-column>

        </el-table>
    </div>
    <div class="pages" ref="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="size" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
    </div>

    <button v-print="'#printMe'">打印</button>

</div>
</template>

<script lang="ts">
import Print from 'vue-print-nb';

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

// import Print from 'vue-print-nb';

@Component({
    components: {}
})
export default class Room extends Vue {

    @Getter("user") getUser: any;

    @Provide() tHeight: number = document.body.offsetHeight - 270;
    @Provide() tableData: any = []; // 表格数据
    @Provide() page: number = 1; // 当前page
    @Provide() size: number = 10; // 请求数据的个数 默认5
    @Provide() total: number = 0; // 总数据条数

    @Provide() loading: boolean = true;

    printObj() {
        id: "#printMe";
        popTitle: "览析反洗钱制裁名单系统"
        extraCss: "";
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
    }

    created() {

        this.loadSearchData();
        this.loading = false;

    }

    //     print(){
    //     this.$print(this.$refs.print,{'no-print':'.className'});
    // }

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
     查询课程信息   
    */
    loadSearchData() {

        (this as any).$axios.post("/room/search").then((res: any) => {

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

Room.use(Print);
/**

  一、使用id
     <div id="printMe" >
       <p>打印内容</p>
    </div>
    <button v-print="'#printMer'">打印</button>

   二、使用ref 
    <div ref="print">
      <p>打印内容</p>
      <p class="no-print">非打印内容 方法1：添加no-print样式类</p>
      <p class="className">非打印内容 方法2：自定义类名</p>
    </div>
    <button @click="print()">打印</button>

    print(){
      this.$print(this.$refs.print,{'no-print':'.className'});
    }
   
  三、使用printObj
     
     <button v-print="printObj">Print local range</button>
 
  <div id="printMe" style="background:red;">
        <p>葫芦娃，葫芦娃</p>
        <p>一根藤上七朵花 </p>
    </div>

   export default {
    data() {
        return {
            printObj: {
              id: "printMe",
              popTitle: 'good print',
              extraCss: 'https://www.google.com,https://www.google.com',
              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
            }
        };
    }
}
<style lang="scss" scoped>
*/
</script>

<style lang="css"  media="printContent">
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
        height: 155px;
        box-sizing: border-box;

        .el-input {
            width: 200px;
            margin-right: 10px;
        }
    }
}


 
    @page {
      margin: 15mm; /* this affects the margin in the printer settings */
    }
 
</style>
