<template>
  <div id="//jsmind_container">
    <div>
      topic:<input type="text" v-model="topic" placeholder="topic" /><br />
      type:<input type="text" v-model="type" placeholder="type" /><br />
      url:<input type="text" v-model="url" placeholder="url" /><br />
      <button v-on:click="creatroot()">创建根节点</button>
    </div>
    <br />
    <label>
      <input type="text" v-model="searchbyroot" />
      <button v-on:click="getjsmind()">showmindmap</button>
    </label>
    <label>
      <input type="text" v-model="keyword" />
      <button v-on:click="startcrawler()">search</button>
      <h2>{{ keyword }}</h2>
    </label>
    <br />
    <div style="margin-top: 20px">
      <el-radio-group v-model="splice" size="mini">
        <el-radio-button label="带上节点"></el-radio-button>
        <el-radio-button label="不带上节点"></el-radio-button>
      </el-radio-group>
      <el-input v-model="exword" placeholder="请输入拓展词"></el-input>
      <el-radio-group v-model="exword" size="medium">
        <el-radio-button label="历史"></el-radio-button>
        <el-radio-button label="学习路线"></el-radio-button>
        <el-radio-button label="知识点"></el-radio-button>
        <el-radio-button label="目的"></el-radio-button>
      </el-radio-group>
      <el-button type="primary" v-on:click="expandnode()">拓展节点</el-button>
    </div>

    <p>test: {{ atest }}</p>
    <a :href="APIurl">代理后的API</a>
    <div id="jsmind_container"></div>
  </div>
</template>
<script>
import "../style/jsmind.css";
import "../js/jsmind.js";
import "../js/jsmind.draggable.js";
import axios from "axios";
// import jsMind from "jsmind";

var xx = {};

axios.withCredentials = false;

export default {
  name: "mindmap",

  data() {
    return {
      // 创建根节点
      topic: null,
      type: null,
      url: null,

      // searchbyroot: null,
      searchbyroot: "人工智能",

      keyword: null,
      atest: null,
      APIurl: "/mindmap/books/",
      // jsonnode : {},
      jsondata: {},
      // nodedata : [{},{}],
      // _this : this
      nodehref: "",
      nodetopic: "",
      testjm: null,
      exword: "",
      splice: "",
    };
  },
  created() {},
  computed: {},
  methods: {
    //  创建根节点
    creatroot() {
      if (this.topic == null || this.type == null || this.url == null) {
        alert("根节点信息未完成填写");
      } else {
        axios
          .get("/mindmap/creatroot/", {
            params: {
              topic: this.topic,
              type: this.type,
              url: this.url,
            },
          })
          .then((response) => {
            // alert("成功："+JSON.stringify(response)),
            // this.atest = response.data
            var rootdata = [
              {
                id: response.data.mid,
                isroot: true,
                topic:
                  "<a href=" +
                  response.data.mid +
                  ">" +
                  response.data.topic +
                  "</a>",
              },
            ];

            var mind = {
              /* 元数据，定义思维导图的名称、作者、版本等信息 */
              meta: {
                name: "demo",
                author: "hizzgdev@163.com",
                version: "0.2",
              },
              /* 数据格式声明 */
              format: "node_array",
              //   表对象格式
              data: rootdata,
            };

            var options = {
              container: "jsmind_container",
              editable: true,
              theme: "info",
              mode: "full",
            };
            var jm = jsMind.show(options, mind);
            // jm.add_node("sub2", "sub23", "new node", { "background-color": "red" });
            jm.set_node_color("sub21", "green", "#ccc");
            jm.set_node_color("sub22", "green", "#ccc");
            this.testjm = jm;
          })
          .catch((response) => {
            console.log(JSON.stringify(response));
            alert(
              "请求失败" +
                "Error Info:" +
                response +
                "                          " +
                JSON.stringify(response)
            );
          });
      }
    },

    // 拓展节点
    expandnode() {
      //  又是忘记加this了，又找了好久错误，又是 xxxx is not defined
      //  this.atest = this.testjm.get_selected_node().id
      // alert(this.testjm.get_selected_node().id);
      // alert("nihao");

      axios
        .get("/mindmap/expandnode/", {
          params: {
            mid: this.testjm.get_selected_node().id,
            exword: this.exword,
            splice: this.splice,
          },
        })
        .then((response) => {
          // alert("成功："+JSON.stringify(response)),
          // this.atest = response.data

          // 切记：要加this，否则就nodefind，找了好久才试出错误所在
          alert(JSON.stringify(response));
        })
        .catch((response) => {
          console.log(JSON.stringify(response));
          alert(
            "请求失败" +
              "Error Info:" +
              response +
              "                          " +
              JSON.stringify(response)
          );
        });
    },

    getjsmind() {
      if (this.searchbyroot == null) {
        alert("searchbyroot未填写");
      } else {
        axios
          .get("/mindmap/searchbyroot/", {
            params: {
              searchbyroot: this.searchbyroot,
            },
          })
          .then((response) => {
            // alert("成功："+JSON.stringify(response)),
            // this.atest = response.data

            // 切记：要加this，否则就nodefind，找了好久才试出错误所在
            this.nodesdata(response.data);
          })
          .catch((response) => {
            console.log(JSON.stringify(response));
            alert(
              "请求失败" +
                "Error Info:" +
                response +
                "                          " +
                JSON.stringify(response)
            );
          });
      }
    },
    startcrawler() {
      if (this.keyword == null) {
        alert("keyword未填写");
      } else {
        axios
          .get("/mindmap/startscraler/", {
            params: {
              keyword: this.keyword,
            },
          })
          .then((response) => {
            alert("成功：" + JSON.stringify(response));
            // this.atest = response.data
          })
          .catch((response) => {
            console.log(JSON.stringify(response));
            alert(
              "请求失败" +
                "Error Info:" +
                response +
                "                          " +
                JSON.stringify(response)
            );
          });
      }
    },

    nodesdata(jsondata) {
      var nodedata = [];
      // var _this = this;
      // this.atest = jsondata;

      // nodedata.push({
      //   id: "root",
      //   isroot: true,
      //   topic: "<a href=" + this.APIurl + ">" + this.info + "</a>",
      // });
      // nodedata.push({ id: "bilibili", parentid: root, topic: 'nih' });
      var topic = "";
      // if (jsondata[xx].type == "a") {
      //   topic =
      //     "<a href=" + jsondata[xx].url + ">" + jsondata[xx].title + "</a>";
      // } else {
      //   topic = jsondata[xx].title;
      // }

      // 重点！！！！ for in 遍历出的xx不是列表中的对象，而是编号！！！！！
      for (xx in jsondata) {
        // this.atest = jsondata[xx].bpub_date;
        // this.atest = jsondata;
        if (jsondata[xx].parentid == "isroot") {
          if (jsondata[xx].nodetype == "a") {
            topic =
              "<a href=" + jsondata[xx].url + ">" + jsondata[xx].title + "</a>";
          } else if(jsondata[xx].nodetype == "h") {
            topic = jsondata[xx].title;
          }
          // alert(JSON.stringify(jsondata[xx]))
          nodedata.push({
            id: jsondata[xx].mid,
            isroot: true,
            topic: topic,
          });
        } else {
          if (jsondata[xx].nodetype == "a") {
            topic =
              "<a href=" + jsondata[xx].url + ">" + jsondata[xx].title + "</a>";
          } else if(jsondata[xx].nodetype == "h") {
            topic = jsondata[xx].title;
          }

          nodedata.push({
            id: jsondata[xx].mid,
            // id : xx,
            parentid: jsondata[xx].parentid,
            topic: topic,
          });
        }
      }
      this.showmindmap(nodedata);
      // this.data = nodedata
      // this.atest = nodedata
    },
    showmindmap(inputdata) {
      var mind = {
        /* 元数据，定义思维导图的名称、作者、版本等信息 */
        meta: {
          name: "demo",
          author: "hizzgdev@163.com",
          version: "0.2",
        },
        /* 数据格式声明 */
        format: "node_array",
        //   表对象格式
        data: inputdata,
      };

      var options = {
        container: "jsmind_container",
        editable: true,
        theme: "info",
        mode: "full",
      };
      var jm = jsMind.show(options, mind);
      jm.add_node("sub2", "sub23", "new node", { "background-color": "red" });
      jm.set_node_color("sub21", "green", "#ccc");
      jm.set_node_color("sub22", "green", "#ccc");
      this.testjm = jm;
    },
  },
  mounted() {
    // var mind = {
    //   /* 元数据，定义思维导图的名称、作者、版本等信息 */
    //   meta: {
    //     name: "demo",
    //     author: "hizzgdev@163.com",
    //     version: "0.2",
    //   },
    // /* 数据格式声明 */
    //   format: "node_array",
    // //   表对象格式
    //   data: this.data,
    //   // [
    //   //   { id: "root", isroot: true, topic: "jsMind" },
    //   //   {
    //   //     id: "sub1",
    //   //     parentid: "root",
    //   //     topic: "sub1",
    //   //     index: "000000",
    //   //     "background-color": "#0000ff",
    //   //   },
    //   //   { id: "sub11", parentid: "sub1", topic: "sub11" },
    //   //   { id: "sub12", parentid: "sub1", topic: "sub12" },
    //   //   { id: "sub13", parentid: "sub1", topic: "sub13" },
    //   //   { id: "sub2", parentid: "root", topic: "sub2" },
    //   //   { id: "sub21", parentid: "sub2", topic: "sub21" },
    //   //   {
    //   //     id: "sub22",
    //   //     parentid: "sub2",
    //   //     topic: "sub22",
    //   //     "foreground-color": "#33ff33",
    //   //   },
    //   //   { id: "sub3", parentid: "root", topic: "sub3" },
    //   // ],
    // // 树对象格式
    // //    data:{"id":"root","topic":"jsMind","children":[
    // //     {"id":"easy","topic":"Easy","direction":"left","expanded":false,"children":[
    // //         {"id":"easy1","topic":"Easy to show"},
    // //         {"id":"easy2","topic":"Easy to edit"},
    // //         {"id":"easy3","topic":"Easy to store"},
    // //         {"id":"easy4","topic":"Easy to embed"}
    // //     ]},
    // //     {"id":"open","topic":"Open Source","direction":"right","expanded":true,"children":[
    // //         {"id":"open1","topic":"on GitHub"},
    // //         {"id":"open2","topic":"BSD License"}
    // //     ]},
    // //     {"id":"powerful","topic":"Powerful","direction":"right","children":[
    // //         {"id":"powerful1","topic":"Base on Javascript"},
    // //         {"id":"powerful2","topic":"Base on HTML5"},
    // //         {"id":"powerful3","topic":"Depends on you"}
    // //     ]},
    // //     {"id":"other","topic":"test node","direction":"left","children":[
    // //         {"id":"other1","topic":"I'm from local variable"},
    // //         {"id":"other2","topic":"I can do everything"}
    // //     ]}
    // // ]},
    // };
    // var options = {
    //   container: "jsmind_container",
    //   editable: true,
    //   theme: "info",
    // };
    // var jm = jsMind.show(options, mind);
    // jm.add_node("sub2", "sub23", "new node", { "background-color": "red" });
    // jm.set_node_color("sub21", "green", "#ccc");
    // jm.set_node_color("sub22", "green", "#ccc");
  },
};
</script>
<style  scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

