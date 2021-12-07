
const x_pi = Math.PI * 3000.0 / 180.0;

const rad=(d)=>{
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
 }
 //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
 const getDistance=(lat1,lng1,lat2,lng2)=>{
     var radLat1 = rad(lat1);
     var radLat2 = rad(lat2);
     var a = radLat1 - radLat2;
     var  b = rad(lng1) - rad(lng2);
     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
     Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
     s = s *6378.137 ;// EARTH_RADIUS;
     s = Math.round(s * 10000) / 10000; //输出为公里
     //s=s.toFixed(4);
     return s;
 }


const bd09IIToGCJ02 = (baidu_point)=>{
    var mars_point={lon:0,lat:0};
    var x=baidu_point.lon-0.0065;
    var y=baidu_point.lat-0.006;
    var z=Math.sqrt(x*x+y*y)- 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    mars_point.lon=z * Math.cos(theta);
    mars_point.lat=z * Math.sin(theta);
    return mars_point;
}
const GCJ02Tobd09II = (mars_point)=>{
    var baidu_point={lon:0,lat:0};
    var x=mars_point.lon;
    var y=mars_point.lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    baidu_point.lon = z * Math.cos(theta) + 0.0065;
    baidu_point.lat = z * Math.sin(theta) + 0.006;
    return baidu_point;
}
module.exports = {
    bd09IIToGCJ02,
    GCJ02Tobd09II,
    getDistance
  }
  
