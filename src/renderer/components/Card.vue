<template>
  <Col span="24" style="margin-bottom: 15px">
    <Card>
      <p slot="title" class="book-title-link" @click="openUrl(book.ISBN)">
        {{ book.Title }}
      </p>
      <Row>
        <Col span="8">
          <a @click="openUrl(book.ISBN)">
            <img
              v-bind:src="bookImg"
              style="max-width: 120px; max-height: 170px"
            />
          </a>
        </Col>
        <Col span="12">
          <p>The reading percentage: {{ book.___PercentRead }}% Read</p>
          <p>
            The estimate reading time left in the book:
            {{ millisecondToHours(book.RestOfBookEstimate) }} Hours
          </p>
          <p>
            Time spent reading:
            {{ millisecondToHours(book.TimeSpentReading) }} Hours
          </p>
          <p>Last time of reading: {{ book.LastTimeStartedReading }}</p>
          <p>
            Last time of finished reading: {{ book.LastTimeFinishedReading }}
          </p>
          <p></p>
        </Col>
      </Row>
    </Card>
  </Col>
</template>

<script>
import axios from "axios";

export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bookImg: "",
    };
  },
  methods: {
    millisecondToHours(millisecond) {
      return (millisecond / 60 / 60).toFixed(2);
    },
    openUrl(isbn) {
      const url = `https://www.kobo.com/tw/zh/search?query=${isbn}`;
      this.$electron.shell.openExternal(url);
    },
    getBookImage(title, queryAuthor, isbn) {
      const googleApi = "https://www.googleapis.com/books/v1/volumes";
      const queryStr = `intitle:${title}+inauthor:${queryAuthor}`;
      const url = `${googleApi}?q=${queryStr}&filter=paid-ebooks&orderBy=newest&maxResults=1`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.items == undefined) {
            this.bookImg =
              "https://via.placeholder.com/120x170?text=no%20image";
          } else {
            console.log(title);
            console.log(queryAuthor);
            console.log(url);
            this.bookImg =
              response.data.items[0].volumeInfo.imageLinks.smallThumbnail;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getBookImage(this.book.Title, this.book.Attribution, this.book.ISBN);
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
