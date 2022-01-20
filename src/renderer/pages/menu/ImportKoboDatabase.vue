<template>
  <div class="buttonDiv">
    <Button
      @click="handleUpload"
      style="width: 100%; height: 100px; font-size: 25px; font-weight: 300"
    >
      <Icon type="ios-cloud-upload" size="5px" />
      Upload KoboReader.sqlite file
    </Button>
    <input type="file" style="display: none" />

    <Spin fix v-if="dataLoading">
      <Icon type="load-c" size="18" class="spin-icon-load"></Icon>
      <div>Trying to import data into database, Please wait.</div>
    </Spin>
  </div>
</template>

<script>
const { search } = require("node-ecdict");
const opencc = require("node-opencc");

export default {
  data() {
    return {
      dataLoading: false,
    };
  },
  methods: {
    handleUpload() {
      this.$electron.remote.dialog.showOpenDialog(
        {
          title: "Select the File to be uploaded",
          buttonLabel: "Upload",
          filters: [
            {
              name: "Sqlite Files",
              extensions: ["sqlite", "sqlite3"],
            },
          ],
          properties: ["openFile", "showHiddenFiles"],
        },
        (filepath) => {
          this.dataLoading = true;
          if (filepath == undefined) {
            this.dataLoading = false;
          }

          let attachDbSql = `ATTACH DATABASE '${filepath[0]}' AS attachdb;`;

          this.$db.all(attachDbSql, (err, res) => {
            console.log(`attachDbSql:${err}`);

            let deleteOldDataeSql = `DELETE FROM main.WordList; DELETE FROM main.Bookmark;`;

            this.$db.run(deleteOldDataeSql, (err, res) => {
              console.log(`deleteOldDataeSql:${err}`);

              //Copy Bookmark table
              let insertIntoBookmark = `INSERT INTO main.Bookmark SELECT * FROM attachdb.Bookmark;`;
              this.$db.all(insertIntoBookmark, (err, res) => {
                console.log(`insertIntoBookmark:${err}`);
              });

              //Copy ShelfContent table
              let insertIntoShelfContent = `INSERT INTO main.ShelfContent SELECT * FROM attachdb.ShelfContent;`;
              this.$db.all(insertIntoShelfContent, (err, res) => {
                console.log(`insertIntoShelfContent:${err}`);
              });

              //Copy content table
              let insertIntoContent = `INSERT INTO main.content SELECT * FROM attachdb.content;`;
              this.$db.all(insertIntoContent, (err, res) => {
                console.log(`insertIntoContent:${err}`);
              });

              //Copy WordList table
              let getNewWordListDataSql = `SELECT * FROM attachdb.WordList;`;

              this.$db.all(getNewWordListDataSql, (err, wordListRes) => {
                console.log(`getNewWordListDataSql:${err}`);

                if (wordListRes.length == 0) {
                  this.dataLoading = false;
                  this.$Notice.success({
                    title: "Success",
                    desc: "Data has been successfully uploaded!",
                  });
                }

                console.log(wordListRes);

                for (let i = 0; i < wordListRes.length; i++) {
                  search(wordListRes[i].Text).then((result) => {
                    if (result[0] != undefined) {
                      wordListRes[i].Definition = opencc.simplifiedToTaiwan(
                        result[0].translation.join().replace(/,/g, " ")
                      );
                      console.log(
                        result[0].translation.join().replace(/,/g, " ")
                      );
                    } else {
                      wordListRes[i].Definition = "";
                    }

                    this.$db.run(
                      "INSERT INTO main.WordList (Text, DateCreated, Definition, VolumeId) VALUES (?, ?, ?, ?)",
                      [
                        wordListRes[i].Text,
                        wordListRes[i].DateCreated,
                        wordListRes[i].Definition,
                        wordListRes[i].VolumeId,
                      ]
                    ),
                      (err) => {
                        console.log(`INSERT INTO:${err}`);
                      };

                    if (i == wordListRes.length - 1) {
                      this.dataLoading = false;
                      this.$Notice.success({
                        title: "Success",
                        desc: "Data has been successfully uploaded!",
                      });
                    }
                  });
                }

                //detach db
                this.$db.all(`DETACH DATABASE 'attachdb';`, (err) => {
                  console.log(`DETACH DATABASE`);
                });
              });
            });
          });
        }
      );
    },
    wordImport() {},
    searchWord(word) {
      search(word).then((result) => {
        if (result[0] != undefined) {
          return result[0].translation;
        }
        return "";
      });
    },
  },
  created() {},
};
</script>

<style>
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
