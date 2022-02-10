<template>
  <Col span="8" offset="2" style="margin-bottom: 15px">
    <Card>
      <p slot="title" class="book-title-link" @click="openUrl(book.ISBN)">
        {{ book.Title }}
      </p>
      <p>Percent Read: {{ book.___PercentRead }}% Read</p>
      <p>
        Rest of Book estimate:
        {{ millisecondToHours(book.RestOfBookEstimate) }} Hours
      </p>
      <p>
        Time spent reading:
        {{ millisecondToHours(book.TimeSpentReading) }} Hours
      </p>
      <p>Last time started reading: {{ book.LastTimeStartedReading }}</p>
      <p>Last time finished reading: {{ book.LastTimeFinishedReading }}</p>
      <p></p>
    </Card>
  </Col>
</template>

<script>
export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  methods: {
    millisecondToHours(millisecond) {
      return (millisecond / 60 / 60).toFixed(2);
    },
    openUrl(isbn) {
      const url = `https://www.kobo.com/tw/zh/search?query=${isbn}`;
      this.$electron.shell.openExternal(url);
    },
  },
};
</script>

<style>
.book-title-link {
  cursor: pointer;
}

.book-title-link:hover {
  color: rgba(40, 123, 211, 0.91);
}
</style>
