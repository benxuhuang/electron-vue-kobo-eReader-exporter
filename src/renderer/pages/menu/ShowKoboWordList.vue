<template>
  <div>
    <Table
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
    <Alert show-icon style="font-size: 15px"
      >The pronunciation feature requires network support.</Alert
    >
  </div>
</template>

<script>
import Player from "audio-player-es6";

export default {
  data() {
    return {
      tableLoading: false,
      dataList: [],
      dataList_table_column: [
        {
          title: "Word",
          key: "Text",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    "font-size": "25px",
                  },
                  on: {
                    click: () => {
                      this.openUrl(params.row.Text);
                    },
                  },
                },
                params.row.Text.toLowerCase()
              ),
              h("i", {
                class: {
                  "ivu-icon": true,
                  "ivu-icon-volume-medium": true,
                },
                style: {
                  "margin-left": "5px",
                },
                on: {
                  click: () => {
                    this.playSound(params.row.Text);
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "Definition",
          key: "Definition",
          align: "center",
          minWidth: 200,
        },
        {
          title: "DateCreated",
          key: "DateCreated",
          align: "center",
          minWidth: 150,
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

      const pageSQL = `LIMIT ${searchParams.pageSize} OFFSET ${
        (searchParams.pageIndex - 1) * searchParams.pageSize
      } `;

      const orderSQL = `ORDER BY DateCreated ${searchParams.sort} `;

      const sql = `SELECT Text, Definition, date(DateCreated) as DateCreated from WordList `;

      let rowSQL = sql + orderSQL + pageSQL;
      let countSQL = "SELECT COUNT(VolumeId) AS totalCount from WordList";

      const volumeId = this.$route.params.volumeId;
      const whereSQL = `where VolumeId = '${volumeId}'`;
      if (volumeId !== ":volumeId") {
        rowSQL = sql + whereSQL + orderSQL + pageSQL;
        countSQL = `SELECT COUNT(VolumeId) AS totalCount from WordList where VolumeId = '${volumeId}'`;
      }
      this.$logger(rowSQL);

      this.$db.all(rowSQL, (err, res) => {
        this.dataList = res;
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
        filename: "export_data",
      });
    },
    playSound(text) {
      const url = `https://s.yimg.com/bg/dict/dreye/live/m/${text.toLowerCase()}.mp3`;
      let player = new Player({});
      player.src(url).play();
    },
    openUrl(word) {
      const url = `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${word}`;
      this.$electron.shell.openExternal(url);
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
