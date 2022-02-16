<template>
  <Row style="padding: 10px">
    <Card v-for="book in dataList" :key="book.ContentID" :book="book" />
  </Row>
</template>

<script>
import Card from "@/components/Card.vue";

export default {
  data() {
    return {
      dataList: [],
    };
  },
  components: {
    Card,
  },
  methods: {
    getDataList() {
      const sql = `
        SELECT ISBN, Title, ContentID, ___PercentRead, RestOfBookEstimate,
        TimeSpentReading, Attribution, 
	      date(LastTimeStartedReading) as LastTimeStartedReading,
        date(LastTimeFinishedReading) as LastTimeFinishedReading
	      FROM content WHERE (ReadStatus = 1 or ReadStatus = 2)
         and ___SyncTime is not NULL and ___UserID != "removed"
         order by ___PercentRead DESC,  LastTimeFinishedReading DESC
      `;
      this.$logger(sql);
      this.$db.all(sql, (err, res) => {
        this.dataList = res;
        this.$logger(res);
      });
    },
  },
  created() {
    console.log("stat");
    this.getDataList();
  },
};
</script>
