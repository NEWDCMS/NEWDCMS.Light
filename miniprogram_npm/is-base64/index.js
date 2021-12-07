module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1635123148818, function(require, module, exports) {
(function(root) {
  

  function isBase64(v, opts) {
    if (v instanceof Boolean || typeof v === 'boolean') {
      return false
    }
    if (!(opts instanceof Object)) {
      opts = {}
    }
    if (opts.hasOwnProperty('allowBlank') && !opts.allowBlank && v === '') {
      return false
    }

    var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';

    if (opts.mime) {
      regex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)?' + regex
    }

    if (opts.paddingRequired === false) {
      regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
    }

    return (new RegExp('^' + regex + '$', 'gi')).test(v);
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = isBase64;
    }
    exports.isBase64 = isBase64;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return isBase64;
    });
  } else {
    root.isBase64 = isBase64;
  }
})(this);

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1635123148818);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map