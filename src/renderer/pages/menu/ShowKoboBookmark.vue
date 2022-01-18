<template>
  <div>
    <Table
      height="1000"
      border
      stripe
      size="large"
      :columns="dataList_table_column"
      :data="dataList"
      :loading="tableLoading"
      ref="table"
    ></Table>
    <Page
      :total="dataListTotalCount"
      :current="searchParams.pageIndex"
      :page-size="searchParams.pageSize"
      @on-change="getDataList"
      @on-page-size-change="getDataListOnPageChange"
      :page-size-opts="[10, 20, 30, 40, 50, 100, 300, 500, 1000, 2000]"
      show-total
      show-sizer
      show-elevator
      transfer
    ></Page>
    <Form :label-width="90" inline style="margin-top: 15px">
      <FormItem :label-width="10">
        <Button type="primary" size="large" @click="exportCsv()">
          <Icon type="ios-cloud-download"></Icon> Export
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      dataList: [],
      dataList_table_column: [
        {
          title: "BookTitle",
          key: "BookTitle",
          align: "left",
          sortable: true,
          render: (h, params) => {
            return h(
              "p",
              {
                style: {
                  margin: "15px",
                },
              },
              params.row.BookTitle
            );
          },
        },
        {
          title: "Text",
          key: "Text",
          align: "left",
          minWidth: 400,
          render: (h, params) => {
            return h(
              "p",
              {
                style: {
                  margin: "15px",
                },
              },
              params.row.Text
            );
          },
        },
        {
          title: "DateCreated",
          key: "DateCreated",
          align: "center",
          sortable: true,
        },
      ],
      search: {
        sort: "DESC",
        totalMax: null,
        totalMin: null,
        buyPriceMax: null,
        buyPriceMin: null,
        sellPriceMax: null,
        sellPriceMin: null,
        pageIndex: 1,
        pageSize: 10,
      },
      searchParams: {},
      dataListTotalCount: 0,
    };
  },
  methods: {
    getDataList(method) {
      this.searchParams = JSON.parse(JSON.stringify(this.search));

      if (typeof method === "number") {
        this.searchParams.pageIndex = method;
      }

      const searchParams = this.searchParams;

      const pageSQL = `LIMIT ${
        searchParams.pageSize
      } OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `;

      const orderSQL = `ORDER BY DateCreated ${searchParams.sort} `;

      const sql = `
          SELECT distinct c.BookTitle, a.Text, date(a.DateCreated) as DateCreated
          from Bookmark a
          left outer join ShelfContent b on b.ContentID = a.VolumeID
          left outer join content c on c.BookID = a.VolumeID
      `;

      const rowSQL = sql + orderSQL + pageSQL;
      this.$logger(rowSQL);

      this.$db.all(rowSQL, (err, res) => {
        console.log(res);
        this.dataList = res;
        const countSQL = "SELECT COUNT(VolumeId) AS totalCount from Bookmark";
        this.$logger(countSQL);
        this.$db.get(countSQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: "Get totalCount error",
              desc: err,
            });
          } else {
            this.dataListTotalCount = res.totalCount;
          }
        });
      });
    },
    getDataListOnPageChange(pageSize) {
      this.search.pageSize = pageSize;
      this.getDataList();
    },
    exportCsv() {
      this.$refs.table.exportCsv({
        filename: "export_bookmark_data",
      });
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style>
.ivu-table-cell {
  font-size: 20px;
}
</style>
