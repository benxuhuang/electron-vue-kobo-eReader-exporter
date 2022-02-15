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
        async (filepath) => {
          this.dataLoading = true;
          if (filepath == undefined) {
            this.dataLoading = false;
          }

          try {
            //attach db
            await this.sqlCommand(
              `ATTACH DATABASE '${filepath[0]}' AS attachdb;`,
              []
            );
            console.log("Successful attach database");

            //delete Bookmark table
            await this.sqlCommand(`DELETE FROM main.Bookmark;`, []);
            console.log("Successful delete Bookmark table");

            //copy Bookmark table
            await this.sqlCommand(
              `INSERT INTO main.Bookmark SELECT * FROM attachdb.Bookmark;`,
              []
            );
            console.log("Successful copy Bookmark table");

            //delete content table
            await this.sqlCommand(`DELETE FROM main.content;`, []);
            console.log("Successful delete content table");

            //copy content table
            await this.sqlCommand(
              `INSERT INTO main.content SELECT * FROM attachdb.content;`,
              []
            );
            console.log("Successful copy content table");

            //delete ShelfContent table
            await this.sqlCommand(`DELETE FROM main.ShelfContent;`, []);
            console.log("Successful delete ShelfContent table");

            //copy ShelfContent table
            await this.sqlCommand(
              `INSERT INTO main.ShelfContent SELECT * FROM attachdb.ShelfContent;`,
              []
            );
            console.log("Successful copy ShelfContent table");

            //delete WordList table
            await this.sqlCommand(`DELETE FROM main.WordList;`, []);
            console.log("Successful delete WordList table");

            //get wordlist
            let result = await this.sqlCommand(
              `SELECT * FROM attachdb.WordList;`,
              []
            );
            console.log("Successful get wordlist table");
            await this.getWordDefinition(result);
            console.log(result);

            // insert wordlist table
            for (let i = 0; i < result.length; i++) {
              const insertSql = `INSERT INTO main.WordList (Text, DateCreated, Definition, VolumeId)
                                  VALUES ('${result[i].Text}', '${result[i].DateCreated}', '${result[i].Definition}',
                                  '${result[i].VolumeId}')`;
              await this.sqlCommand(insertSql, []);
            }
            console.log("Successful insert wordlist");

            //detach database
            await this.sqlCommand(`DETACH DATABASE 'attachdb';`, []);

            this.dataLoading = false;
            this.$Notice.success({
              title: "Success",
              desc: "Data has been successfully uploaded!",
            });
          } catch (err) {
            return console.error(err.message);
          }
        }
      );
    },
    sqlCommand(sql, params) {
      return new Promise((resolve, reject) => {
        this.$db.all(sql, params, function (err, rows) {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    },
    getWordDefinition(wordList) {
      return new Promise((resolve, reject) => {
        try {
          for (let i = 0; i < wordList.length; i++) {
            search(wordList[i].Text).then((res) => {
              if (res[0] != undefined) {
                wordList[i].Definition = opencc.simplifiedToTaiwan(
                  res[0].translation.join().replace(/,/g, " ")
                );
              } else {
                wordList[i].Definition = "";
              }
            });
          }
          resolve(wordList);
        } catch (err) {
          reject(err);
        }
      });
    },
  },
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
