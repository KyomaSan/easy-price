<script setup>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";
import { ref } from "vue";
import * as XLSX from "xlsx";
import { getYiShouYou, getKejinshou } from "@/api/info";
import { Search } from "@element-plus/icons-vue";
import { handleYiShouYou } from "@/utils/yishouyou";
const rule = ref(null);
const uploadExcel = (e) => {
    let fileObj = e.target.files[0];
    console.log(fileObj);
    ruleVersonName.value.push(fileObj.name);
    console.log(ruleVersonName.value);
    // FileReader对象就是专门操作二进制数据的，主要用于将文件内容读入内存
    const fileReader = new FileReader();
    //.readAsArrayBuffer，读取指定的 Blob 或 File 内容
    fileReader.readAsArrayBuffer(fileObj);
    fileReader.onload = (event) => {
        const fileData = event.target.result;
        //从电子表格字节中提取数据
        const workbook = XLSX.read(fileData, {
            type: "binary",
        });
        //按选项卡顺序列出工作表名称
        const wsname = workbook.SheetNames[0];
        // 输出文档的名字
        // 从工作表创建JS值数组数组
        const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
        console.log(sheetJson); // 得到的表格 JsoN 内容
        // 处理：将导入的Excel文件的JSON数据补全。
        const data = handleExcelData(sheetJson);
        /*    // 先找到本地存储的数据
        let localRule = localStorage.getItem("rule") || [];
        // console.log("localRule:", localRule);
        // 如果本地存储的数据不为空数组，则将其转换为JSON格式
        if (localRule && localRule.length > 0) {
            localRule = JSON.parse(localRule);
        }
        localRule.push(data);
        // 将处理后的数据保存在本地，并命名为 rule
        localStorage.setItem("rule", JSON.stringify(localRule)); */
        // console.log("data:", data);
        rule.value = data;
    };
    uploadExcelButton.value = false;
};
const showIframe = ref(false);
const showKjs = ref(false);
const uploadExcelButton = ref(true);
// 处理：将导入的Excel文件的JSON数据补全。
const handleExcelData = (data) => {
    let arr = data;
    const chunkSize = 42;
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    const result1 = result.map((item) => {
        return item.map((item1, index) => {
            return {
                角色: item[0].角色,
                命座: item[0].命座 + Math.floor(index / 6),
                武器: item1.武器,
                价格: item1.价格,
            };
        });
    });
    return result1;
};
const ruleVersonName = ref([]);
const YishouyouPrice = ref(null);
const YishouyouCode = ref(null);
const KjsCode = ref(null);
function getYishouYouData(value) {
    if (!rule.value) {
        alert("规则未设置");
        return;
    }
    getYiShouYou(value)
        .then((res) => {
            console.log(res);
            if (res.status === 200) {
                let info = res.data.data.more_info;
                console.log(handleYiShouYou(info, rule.value));

                YishouyouPrice.value = handleYiShouYou(info, rule.value);
            }
        })
        .catch((error) => {
            console.error("请求失败:", error);
        });
}
const search = (value, type) => {
    if (type === "yishouyou") {
        showIframe.value = true;
        //3111540
        getYishouYouData(value);
    }
    if (type === "kjs") {
        showKjs.value = true;
        getKejinshou(KjsCode.value).then((res) => {
            handleKjs(res);
        });
    }
};

function handleKjs(res) {
    // 使用 DOMParser 解析 HTML 字符串
    const parser = new DOMParser();
    const doc = parser.parseFromString(res.data, "text/html");

    // 提取金色角色命数信息
    const goldenCharacters = Array.from(doc.querySelectorAll("table#pv-table tr"))
        .filter((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return cells.length > 0 && cells[0].textContent.includes("命金色角色");
        })
        .map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return [cells[0].textContent, cells[1].textContent];
        });

    // 提取武器精炼等级信息
    const weaponRefinements = Array.from(doc.querySelectorAll("table#pv-table tr"))
        .filter((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return cells.length > 0 && cells[0].textContent.includes("精武器");
        })
        .map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return [cells[0].textContent, cells[1].textContent];
        });

    console.log("金色角色命数信息：", goldenCharacters);
    console.log("武器精炼等级信息：", weaponRefinements);
    // 处理金色角色数据
    const processCharacters = (data) => {
        const result = {};
        data.forEach(([level, names]) => {
            const levelValue = parseInt(level[0]); // 提取命之数
            names.split(",").forEach((name) => {
                const cleanName = name.replace(/满命|五命|四命|三命|二命|一命|零命/g, "").trim();
                result[cleanName] = levelValue.toString();
            });
        });
        return result;
    };

    // 处理武器数据
    const processWeapons = (data) => {
        const result = {};
        data.forEach(([level, names]) => {
            const levelValue = parseInt(level[0]); // 提取精炼等级
            names.split(",").forEach((name) => {
                const cleanName = name.trim();
                if (result[cleanName]) {
                    result[cleanName] = Math.min(5, parseInt(result[cleanName]) + levelValue).toString();
                } else {
                    result[cleanName] = levelValue.toString();
                }
            });
        });
        return result;
    };

    // 生成最终的 JSON 数据
    const finalData = [
        {
            name: "五星角色",
            value: processCharacters(goldenCharacters),
            type: 4,
        },
        {
            name: "五星武器",
            value: processWeapons(weaponRefinements),
            type: 4,
        },
    ];

    console.log(JSON.stringify(finalData, null, 4));
    YishouyouPrice.value = handleYiShouYou(finalData, rule.value);
}
const QIBABAYI_BASE_URL = process.env.NODE_ENV === "production" ? "https://gw.7881.com" : "/qibabayi";
</script>

<template>
    <div>
        <h1>前端的导入 Excel，解析为json</h1>
        <div>选择你要解析的Excel文件</div>
        <input v-show="uploadExcelButton" type="file" @change="uploadExcel" />
        <div class="my-4">
            <el-input @input="showIframe = false" v-model="YishouyouCode" style="width: 200px" placeholder="输入易手游编码" class="input-with-select">
                <template #append>
                    <el-button :icon="Search" @click="search(YishouyouCode, 'yishouyou')" />
                </template>
            </el-input>
        </div>
        <div v-if="showIframe" style="width: 300px">
            易手游编码：<span>{{ YishouyouCode }}</span> <br />
            详情：
            <el-input autosize type="textarea" v-model="YishouyouPrice" disabled></el-input>
        </div>
        <div class="my-4">
            <el-input @input="showKjs = false" v-model="KjsCode" style="width: 200px" placeholder="输入氪金兽编码" class="input-with-select">
                <template #append>
                    <el-button :icon="Search" @click="search(KjsCode, 'kjs')" />
                </template>
            </el-input>
        </div>
        <div v-if="showKjs" style="width: 300px">
            氪金兽编码：<span>{{ KjsCode }}</span> <br />
            详情：
            <el-input autosize type="textarea" v-model="YishouyouPrice" disabled></el-input>
        </div>
    </div>
    <iframe
        v-if="showIframe"
        :src="'https://pc.swcbg.com/pages/index/shop_detail?shop_id=' + YishouyouCode"
        frameborder="0"
        style="width: 50vw; height: 80vh">
    </iframe>
</template>

<style scoped lang="scss"></style>
