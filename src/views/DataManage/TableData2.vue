<template>
  <div class="table-data">
    <div class="search-box">
      <el-row>
        <el-col :span="6"> </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <el-select
              size="small"
              v-model="selectCity"
              placeholder="选择城市"
              @change="filterByCity"
              :disabled="getUser.key != 'admin'"
            >
              <el-option label="全省" value="%"></el-option>
              <el-option label="沈阳" value="沈阳"></el-option>
              <el-option label="大连" value="大连"></el-option>
              <el-option label="鞍山" value="鞍山"></el-option>
              <el-option label="抚顺" value="抚顺"></el-option>
              <el-option label="本溪" value="本溪"></el-option>
              <el-option label="丹东" value="丹东"></el-option>
              <el-option label="锦州" value="锦州"></el-option>
              <el-option label="营口" value="营口"></el-option>
              <el-option label="阜新" value="阜新"></el-option>
              <el-option label="辽阳" value="辽阳"></el-option>
              <el-option label="铁岭" value="铁岭"></el-option>
              <el-option label="朝阳" value="朝阳"></el-option>
              <el-option label="盘锦" value="盘锦"></el-option>
              <el-option label="葫芦岛" value="葫芦岛"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-button
              size="small"
              type="success"
              icon="el-icon-download"
              @click="exportExcel"
              >导出</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableData.slice((page - 1) * size, page * size)"
      border
      stripe
      style="width:100%"
      :height="tHeight"
      class="table-box"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="地市"
        prop="city"
        align="center"
      ></el-table-column>
      
      <el-table-column
        fit
        label="引入类型"
        prop="import_type"
        align="center"
      ></el-table-column>
      
      <el-table-column
        fit
        label="引入日期"
        prop="import_date"
        align="center"
      ></el-table-column>    
     
      <el-table-column
        fit
        label="审批状态"
        prop="flow_status"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="单位地址"
        prop="custom_address"
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="单位邮编"
        prop=""
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="单位属性"
        prop="custom_type"
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="证件类型"
        prop="custom_credentials"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="证件号码"
        prop="custom_credentials_id"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="安全责任人"
        prop="custom_safe_name"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="安全责任人证件类型"
        prop="custom_safe_credentials"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="安全责任人证件号码"
        prop="custom_safe_credentials_id"
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="固定电话"
        prop=""
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="移动电话"
        prop="custom_phone"
        align="center"
      ></el-table-column>
      <el-table-column
        fit
        label="电子邮箱"
        prop=""
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="服务内容"
        prop="custom_net_content"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="域名"
        prop="domain"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="IP地址"
        prop="ip"
        align="center"
      ></el-table-column>

      <el-table-column
        fit
        label="备案号"
        prop="ict"
        align="center"
      ></el-table-column>
    </el-table>
    <div class="pages" ref="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1500, 9999]"
        :page-size="size"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </div>
    <EditDialog
      :dialogVisible="dialogVisible"
      :form="formData"
      @closeDialog="closeDialog"
    ></EditDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import EditDialog from "./EditDialog.vue";
import FileSaver from "file-saver";
import XLSX from "xlsx";
@Component({
  components: { EditDialog }
})
export default class TableData extends Vue {
  @Getter("user") getUser: any;

  @Provide() searchVal: string = ""; // 搜索框
  @Provide() selectStatus: string = ""; // 审批进度
  @Provide() selectCity: string = ""; // 城市

  @Provide() searchFlag: string = ""; // 定义当前页面数据查询数据的类型，主要是给分页做判断用。

  @Provide() tHeight: number = document.body.offsetHeight - 270;
  @Provide() tableData: any = []; // 表格数据
  @Provide() page: number = 1; // 当前page
  @Provide() size: number = 1500; // 请求数据的个数 默认5
  @Provide() total: number = 0; // 总数据条数

  @Provide() dialogVisible: Boolean = false; // 是否展示编辑页面
  @Provide() formData: object = {
    net_name: "",
    domain: "",
    flow_status: "",
    memo: "",
    import_date: ""
  };
  @Provide() loading: boolean = true;

  handleEdit(index: number, row: any) {
    
    this.formData = row;
    this.dialogVisible = true;
  }

  handleDelete(index: number, row: any) {
     
    let data: any = { domain: row.domain };
    (this as any).$axios.post("/api/delete", data).then((res: any) => {
      let msg: string = res.data.state;
      if (msg == "suc") {
        this.tableData.splice(index, 1);
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 4000
        });
      } else {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    });
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  created() {
    this.loadData();
  }

  loadData() {
    let data: any = { city: localStorage.getItem("cityname") };

    (this as any).$axios.post("/api/loadByCity", data).then((res: any) => {
      
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    });
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
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  filterByStatus(): void {
    this.page = 1;
    this.selectStatus ? this.loadStatusData() : this.loadData();
  }

  filterByCity(): void {
    this.page = 1;
    this.selectCity ? this.loadCityData() : this.loadData();
  }

  loadSearchData() {
    // 加载搜索数据
    this.selectStatus = ""; // 状态清空
    this.selectCity = ""; // city清空
    this.searchFlag = "searchByInput"; // 定义查询类型是input

    let data: any = {
      city: localStorage.getItem("cityname"),
      domain: this.searchVal
    };
    (this as any).$axios.post("/api/search", data).then((res: any) => {
       
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    });
  }

  loadStatusData() {
    this.selectCity = ""; // city清空
    this.searchVal = ""; // input 内容清空

    this.searchFlag = "searchByStatus"; // 定义查询类型是Status

    // 加载搜索数据
    let data: any = {
      city: this.getUser.username,
      flow_status: this.selectStatus
    };
    (this as any).$axios.post("/api/loadByStatus", data).then((res: any) => {
      
     
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    });
  }

  loadCityData() {
    this.selectStatus = ""; // 状态清空
    this.searchVal = ""; // input 内容清空

    this.searchFlag = "searchByCity"; // 定义查询类型是City

    
    let data: any = { city: this.selectCity };
    (this as any).$axios.post("/api/loadByCity", data).then((res: any) => {
      
       
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    });
  }

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
        new Blob([wbout], { type: "application/octet-stream" }),
        name + ".xlsx"
      );
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 8px;
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
