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
        SELECT * FROM content WHERE ReadStatus = 1
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
