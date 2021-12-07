// 打印机纸宽58mm，页的宽度384，字符宽度为1，每行最多盛放32个字符
const app = getApp();
const PAGE_WIDTH = app.global.PAGE_WIDTH;
const MAX_CHAR_COUNT_EACH_LINE = app.global.MAX_CHAR_COUNT_EACH_LINE;

/**
 * @param str
 * @returns {boolean} str是否全是中文
 */
function isChinese(str) {
  return /^[\u4e00-\u9fa5]|:|·$/.test(str);
}

/**
 * 返回字符串宽度(1个中文=2个英文字符)
 * @param str
 * @returns {number}
 */
function getStringWidth(str) {
  let width = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    width += isChinese(str.charAt(i)) ? 2 : 1;
  }
  return width;
}


/**
 * 同一行输出str1, str2，str1居左, str2居右
 * @param {string} str1 内容1
 * @param {string} str2 内容2
 * @param {number} fontWidth 字符宽度 1/2
 * @param {string} fillWith str1 str2之间的填充字符
 *
 */
function inline(str1, str2, fillWith = ' ', fontWidth = 1) {
  const lineWidth = MAX_CHAR_COUNT_EACH_LINE / fontWidth;
  // 需要填充的字符数量
  let fillCount = Math.ceil(lineWidth - (getStringWidth(str1) + getStringWidth(str2)) % lineWidth);
  let fillStr = new Array(parseInt(fillCount)).fill(fillWith.charAt(0)).join('');
  return str1 + fillStr + str2;
}

//打印3列
function inline3(str1, str2, str3, col1Width = 0, fillWith = ' ', fontWidth = 1) {
  const lineWidth = MAX_CHAR_COUNT_EACH_LINE / fontWidth;
  // 需要填充的字符数量
  let fillCount = (lineWidth - (getStringWidth(str1) + getStringWidth(str2) + getStringWidth(str3)) % lineWidth) / 3;
  let nc = Math.ceil(fillCount) + Math.ceil(fillCount) / 2;

  let nc1 = nc
  let nc2 = nc

  if (col1Width > 0) {
    nc1 = col1Width
    nc2 = nc - col1Width
  }

  let fillStr1 = new Array(parseInt(nc1)).fill(fillWith.charAt(0)).join('');
  let fillStr2 = new Array(parseInt(nc2)).fill(fillWith.charAt(0)).join('');

  return str1 + fillStr1 + str2 + fillStr2 + str3;
}

//打印4列
function inline4(str1, str2, str3, str4, col1Width = 0, fillWith = ' ', fontWidth = 1) {
  //获取页面行固定宽度
  const lineWidth = MAX_CHAR_COUNT_EACH_LINE / fontWidth;
  // 需要填充的字符数量
  let fillCount = (lineWidth - (getStringWidth(str1) + getStringWidth(str2) + getStringWidth(str3) + getStringWidth(str4)) % lineWidth) / 4;

  let nc = Math.ceil(fillCount) + Math.ceil(fillCount) / 4;

  let nc1 = nc
  let nc2 = nc
  let nc3 = nc

  if (col1Width > 0) {
    nc1 = col1Width
    nc2 = nc - col1Width
    nc3 = nc - col1Width
  }

  let fillStr1 = new Array(Math.ceil(nc1)).fill(fillWith.charAt(0)).join('');
  let fillStr2 = new Array(Math.ceil(nc2)).fill(fillWith.charAt(0)).join('');
  let fillStr3 = new Array(Math.ceil(nc3)).fill(fillWith.charAt(0)).join('');

  return str1 + fillStr1 + str2 + fillStr2 + str3 + fillStr3 + str4;
}



/**
 * 用字符填充一整行
 * @param {string} fillWith 填充字符
 * @param {number} fontWidth 字符宽度 1/2
 */
function fillLine(fillWith = '-', fontWidth = 1) {
  const lineWidth = MAX_CHAR_COUNT_EACH_LINE / fontWidth;
  return new Array(lineWidth).fill(fillWith.charAt(0)).join('');
}

/**
 * 文字内容居中，左右用字符填充
 * @param {string} str 文字内容
 * @param {number} fontWidth 字符宽度 1/2
 * @param {string} fillWith str1 str2之间的填充字符
 */
function fillAround(str, fillWith = '-', fontWidth = 1) {
  const lineWidth = MAX_CHAR_COUNT_EACH_LINE / fontWidth;
  let strWidth = getStringWidth(str);
  // 内容已经超过一行了，没必要填充
  if (strWidth >= lineWidth) {
    return str;
  }
  // 需要填充的字符数量
  let fillCount = lineWidth - strWidth;
  // 左侧填充的字符数量
  let leftCount = Math.round(fillCount / 2);
  // 两侧的填充字符，需要考虑左边需要填充，右边不需要填充的情况
  let fillStr = new Array(leftCount).fill(fillWith.charAt(0)).join('');
  return fillStr + str + fillStr.substr(0, fillCount - leftCount);
}

module.exports = {
  inline: inline,
  inline3: inline3,
  inline4: inline4,
  fillLine: fillLine,
  fillAround: fillAround,
};