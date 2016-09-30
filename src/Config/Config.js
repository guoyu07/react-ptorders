(function(doc, win) {
  //orientationchange : 判断手机是水平方向还是垂直方向，感应方向
  //之所以要得到文档的根元素，是为了计算网页所打开时屏幕的真实宽度
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      //320 是我们默认的手机屏幕 
      //clientWidth 是我们页面打开时所得到的屏幕宽度真实的宽度值
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
      //浏览器默认的font－size值是16，这里20的默认值是自定义的，方便计算，因为改变font－size的值并不影响布局，只会影响rem的值
      //设置根元素font-size
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);

var Ios_Android = function() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    var system = 'Android'
  }
  if (isIOS) {
    var system = 'IOS'
  }
  return system
}
const system = Ios_Android();

const target = process.env.NODE_ENV !== 'production' ? '' : 'http://sale.putao.com'; //目标网站
export {
  target,
  system
}