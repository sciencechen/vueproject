<template>
  <div id="//jsmind_container">
  <!-- <div>悬浮"上滑至顶"和"悬浮删除"</div> -->
    <el-backtop :bottom="100">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        UP
      </div>
      <div
        :style="{
          right: '20px',
          bottom: '20px',
        }"
        class="el-backtop"
      >
        <slot>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            v-on:click.stop="deletenode()"
          ></el-button>
        </slot>
      </div>
    </el-backtop>
    <!-- <div>悬浮"拓展节点"</div> -->
    <div>
      <div
        :style="{
          left: '120px',
          bottom: '120px',
        }"
        class="el-backtop"
      >
        <slot>
          <div style="margin-top: 20px">
            <el-radio-group v-model="splice" size="mini">
              <el-radio-button label="带上节点"></el-radio-button>
              <el-radio-button label="不带上节点"></el-radio-button>
            </el-radio-group>
            <br />
            <el-input
              v-model="exword"
              placeholder="请输入拓展词"
              style="width: 200px"
            ></el-input>
            <!-- <div>添加.stop，看看可不可以解决爬虫防爬问题，因为正常来说，我的请求频率又不高，莫非是因为这个class导致瞬间二次请求了</div> -->
            <el-button type="primary" v-on:click.stop="expandnode()"
              >拓展节点</el-button
            >
            <br />
            <el-radio-group v-model="exword" size="medium">
              <el-radio-button label="历史"></el-radio-button>
              <el-radio-button label="原理"></el-radio-button>
              <el-radio-button label="要学什么"></el-radio-button>
              <el-radio-button label="学习路线"></el-radio-button>
              <el-radio-button label="知识点"></el-radio-button>
              <el-radio-button label="目的"></el-radio-button>
            </el-radio-group>
          </div>
        </slot>
      </div>
    </div>
    <div>
      topic:
      <el-input
        v-model="topic"
        placeholder="topic"
        style="width: 200px"
      ></el-input>
      type:
      <el-radio-group v-model="type" size="medium">
        <el-radio-button label="h"></el-radio-button>
        <el-radio-button label="a"></el-radio-button>
        <el-radio-button label="img"></el-radio-button>
        <el-radio-button label="video"></el-radio-button>
        <el-radio-button label="audio"></el-radio-button>
      </el-radio-group>
      url:
      <el-input v-model="url" placeholder="url" style="width: 100px"></el-input>
      <el-button type="success" v-on:click="creatroot()">创建根节点</el-button>
    </div>
    <br />
    <div>
      <el-row class="demo-autocomplete">
        <el-col :span="12">
          <el-autocomplete
            class="inline-input"
            v-model="searchbyroot"
            :fetch-suggestions="querySearch"
            placeholder="请输入根节点"
            @select="handleSelect"
          ></el-autocomplete>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            v-on:click="getjsmindbyroot()"
          ></el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="splice" size="mini">
        <el-radio-button label="带上节点"></el-radio-button>
        <el-radio-button label="不带上节点"></el-radio-button>
      </el-radio-group>
      <br />
      <el-input
        v-model="exword"
        placeholder="请输入拓展词"
        style="width: 200px"
      ></el-input>
      <el-button type="primary" v-on:click="expandnode()">拓展节点</el-button>
      <br />
      <el-radio-group v-model="exword" size="medium">
        <el-radio-button label="历史"></el-radio-button>
        <el-radio-button label="原理"></el-radio-button>
        <el-radio-button label="要学什么"></el-radio-button>
        <el-radio-button label="学习路线"></el-radio-button>
        <el-radio-button label="知识点"></el-radio-button>
        <el-radio-button label="目的"></el-radio-button>
      </el-radio-group>
    </div>
    <br />
    <p>test: {{ atest }}</p>
    <a :href="APIurl">代理后的API</a>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px">
      点我打开
    </el-button>
    <el-drawer title="随记" :visible.sync="drawer" :direction="direction">
      <span>
        <h1 align="center">
          我觉得人们应该更专注于学习本身，而不是花大量时间放在查找资料之类的重复的、低进步率的地方上
        </h1>
        <h1>
          这个项目的目的是降低信息获取的交流成本，减小知识获取的阻碍,简称“降低交流成本”
        </h1>
        <h1>我想了解更多更多这个世界的原理</h1>
        <h1>基于“客观现象”的学习——如“纹波”</h1>
        <h1>目标：“根据要学的东西，自动生成回形针视频”</h1>
      </span>
    </el-drawer>
    <div>
      <el-button
        type="danger"
        icon="el-icon-delete"
        circle
        v-on:click="deletenode()"
      ></el-button>
    </div>
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
      // Drawer抽屉
      drawer: false,
      direction: "rtl",

      // seacherbyroot
      restaurants: [],

      // 创建根节点
      topic: null,
      type: "h",
      url: null,

      // searchbyroot: null,
      searchbyroot: "",

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
      splice: "不带上节点",

      // jsmind的options
      options: {
        container: "jsmind_container",
        editable: true,
        theme: "info",
        mode: "full",
        // shortcut: {
        //   enable: true, // 是否启用快捷键
        //   // 命名的快捷键事件处理器
        //   handles: {
        //     dosomething: function (jm, e) {
        //       // do something...
        //       // atest = "nihao";
        //       atest = "nihao";
        //     },
        //   },
        //   mapping: {
        //     // 快捷键映射
        //     // addchild: 45, // <Insert>
        //     // addbrother: 13, // <Enter>
        //     // editnode: 113, // <F2>
        //     // delnode: 46, // <Delete>
        //     // toggle: 32, // <Space>
        //     // left: 37, // <Left>
        //     // up: 38, // <Up>
        //     // right: 39, // <Right>
        //     // down: 40, // <Down>
        //     // 示例
        //     dosomething: 65, // <F1>
        //   },
        // },
      },
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
            if (response.data.nodetype == "a") {
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
            } else {
              var rootdata = [
                {
                  id: response.data.mid,
                  isroot: true,
                  topic: response.data.topic,
                },
              ];
            }

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

            var options = this.options;
            // {
            //   container: "jsmind_container",
            //   editable: true,
            //   theme: "info",
            //   mode: "full",
            // };
            var jm = jsMind.show(options, mind);
            // jm.add_node("sub2", "sub23", "new node", { "background-color": "red" });
            // jm.set_node_color("sub21", "green", "#ccc");
            // jm.set_node_color("sub22", "green", "#ccc");
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
          // alert(JSON.stringify(response));
          // this.$router.go(0);
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
    },

    // 删除节点
    deletenode() {
      //  又是忘记加this了，又找了好久错误，又是 xxxx is not defined
      //  this.atest = this.testjm.get_selected_node().id
      // alert(this.testjm.get_selected_node().id);
      var selectednode = this.testjm.get_selected_node();
      var predata = this.testjm.get_data("node_array");
      this.testjm.remove_node(selectednode);
      var laterdata = this.testjm.get_data("node_array");

      // this.atest = this.testjm.get_data("node_array").data;
      // alert(nodelist);

      axios
        .post("/mindmap/deletenode/", {
          predata: predata,
          laterdata: laterdata,
        })
        .then((response) => {
          // alert("成功："+JSON.stringify(response)),
          // this.atest = response.data
          // 切记：要加this，否则就nodefind，找了好久才试出错误所在
          // alert(JSON.stringify(response));
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

    getjsmindbyroot() {
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
          } else if (jsondata[xx].nodetype == "h") {
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
          } else if (jsondata[xx].nodetype == "h") {
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

      var options = this.options;
      // {
      //   container: "jsmind_container",
      //   editable: true,
      //   theme: "info",
      //   mode: "full",
      //   shortcut: {
      //     enable: true, // 是否启用快捷键
      //     // 命名的快捷键事件处理器
      //     handles: {
      //       'dosomething': function (jm, e) {
      //         // do something...
      //         alert("nihao");
      //       },
      //     },
      //     mapping: {
      //       // 快捷键映射
      //       // addchild: 45, // <Insert>
      //       // addbrother: 13, // <Enter>
      //       // editnode: 113, // <F2>
      //       // delnode: 46, // <Delete>
      //       // toggle: 32, // <Space>
      //       // left: 37, // <Left>
      //       // up: 38, // <Up>
      //       // right: 39, // <Right>
      //       // down: 40, // <Down>
      //       // 示例
      //       dosomething: 65, // <F1>
      //     },
      //   },
      // };
      // 实现了拓展节点后实时刷新思维导图
      if (this.testjm == null) {
        var jm = jsMind.show(options, mind);
        // 这个要放在这，否则就会expand一次节点有就无法再次选中节点了
        this.testjm = jm;
      } else {
        // 如果this.testjm.show(options, mind)，就会报错，应该不允许重复赋值options
        this.testjm.show(mind);
      }
    },

    // searchbyroot的输入建议--element
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      axios
        .get("/mindmap/getrootlist/")
        .then((response) => {
          // alert("成功："+JSON.stringify(response)),
          // this.atest = response.data

          // 切记：要加this，否则就nodefind，找了好久才试出错误所在
          this.restaurants = response.data;
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
    handleSelect(item) {
      console.log(item);
    },
  },
  mounted() {
    this.loadAll();
    // this.restaurants = this.loadAll();

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
<style scoped>
/* element布局容器 */
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
