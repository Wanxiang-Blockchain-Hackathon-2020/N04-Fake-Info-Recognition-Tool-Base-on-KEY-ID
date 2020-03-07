// 全局变量
const isUseHttps = false; // true使用https请求，false使用http请求
const host = "192.168.31.115"; // 本地ip
const getSignIntervalTime = 5000; // 轮询服务器是否收到mykey签名回调的间隔

let md5Sign; // 内容摘要得md5加密
let qrCode; // 二维码生成器
let unixTime; // unix时间戳
let getSignInterval; // 轮询定时器
let eosSign; // 最终签名结果
let oldSignHtml; // 已插入的签名html
const apiHost = isUseHttps ? `https://${host}:3008` : `http://${host}:3006`; // 本地ip

window.onload = () => {
  insertMykey();
};

// 插入dom 并绑定按钮事件
const insertMykey = () => {
  $("body").append(
    '<div id="mykeySignBox"><button id="mykeySignBtn">MYKEY 签名</button></div><div id="mykeySignModal"><div class="con"><div id="QrBox"></div><div class="tip"><p>请使用MYKEY APP，扫描二维码进行签名。</p><p>MYKEY签名完成，将会把签名结果自动插入文章末尾，请返回页面查看</p></div><div class="btnBox"><button id="mykeyBackBtn">返回页面</button></div></div></div>'
  );
  btnBindClick();
};

// 绑定按钮事件
const btnBindClick = () => {
  $("#mykeyBackBtn").click(() => {
    clearInterval();
    $("#mykeySignModal").css({ display: "none" });
  });
  $("#mykeySignBtn").click(() => {
    clearInterval();
    btnSignClick();
  });
};

// 点击签名/重新签名 生成二维码 显示弹框
const btnSignClick = () => {
  $("#mykeySignBtn").html("重新签名");
  setQrcode();
  $("#mykeySignModal").css({ display: "flex" });
};

// 生成md5二维码，发送uuid给服务器，开始轮询服务器签名数据
const setQrcode = () => {
  getMd5();
  getQrCode();
  setGetSignInterval();
};

// 生成md5加密数据
const getMd5 = () => {
  const title = $(".edit-title").val();
  if (!title) alert("请输入标题后再签名");
  const con = $(".w-e-text-container .w-e-text")
    .text()
    .replace(/\s+/g, "")
    .split("--------------------我的签名--------------------")[0];
  if (!con) alert("请输入内容后再签名");
  unixTime = Math.round(new Date().getTime() / 1000);
  md5Sign = md5(`${title}&&${con}&&${unixTime}`);
};

// 生成json
const getMykeyJson = () => {
  return JSON.stringify({
    protocol: "SimpleWallet",
    version: "1.0",
    action: "sign",
    dappName: "Content Sign Tool",
    dappIcon:
      "https://cdn.mykey.tech/mykey-dapp/static/images/logo_bihu.012d8f83.png",
    desc: "Content Sign Tool",
    message: md5Sign,
    callback: "",
    signUrl: `${apiHost}/sendSign?uuid=${unixTime}`,
    expired: Number(unixTime + 60 * 60 * 1)
  });
};

// 生成二维码
const getQrCode = () => {
  const code = getMykeyJson();
  console.log(code);
  if (qrCode) {
    qrCode.clear();
    qrCode.makeCode(code);
    return;
  }
  qrCode = new QRCode(document.getElementById("QrBox"), {
    text: code,
    width: 186,
    height: 186,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
};

// 轮询是否签名成功
const setGetSignInterval = () => {
  clearInterval();
  getSignInterval = setInterval(() => {
    $.get(`${apiHost}/getSign?uuid=${unixTime}`, getSignIntervalCallBack);
  }, getSignIntervalTime);
};

// 轮询回调
const getSignIntervalCallBack = res => {
  console.log(res);
  if (res) {
    eosSign = res;
    //插入签名
    insertSign();
    // 隐藏二维码modal
    $("#mykeySignModal").css({ display: "none" });
    // 清除轮询
    window.clearInterval(getSignInterval);
    getSignInterval = null;
  }
};

// 插入签名
const insertSign = () => {
  // 清除老的签名
  let newSignHtml = `<p>--------------------我的签名--------------------</p><p>时间戳：${unixTime}</p><p>签名：${eosSign}</p>`;
  if (oldSignHtml) {
    const oldHtml = $(".w-e-text-container .w-e-text").html();
    const html = oldHtml.replace(oldSignHtml, newSignHtml);
    $(".w-e-text-container .w-e-text").html(html);
  } else {
    $(".w-e-text-container .w-e-text").append(newSignHtml);
  }
  oldSignHtml = newSignHtml;
};

// 清除定时器
const clearInterval = () => {
  if (getSignInterval) {
    window.clearInterval(getSignInterval);
    getSignInterval = null;
  }
};
