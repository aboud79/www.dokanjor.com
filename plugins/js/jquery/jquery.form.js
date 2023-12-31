/*!
 * jQuery Form Plugin
 * version: 3.44.0-2013.09.15
 * Requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
(function (f) {
  var c = {};
  c.fileapi = f("<input type='file'/>").get(0).files !== undefined;
  c.formdata = window.FormData !== undefined;
  var e = !!f.fn.prop;
  f.fn.attr2 = function () {
    if (!e) {
      return this.attr.apply(this, arguments);
    }
    var g = this.prop.apply(this, arguments);
    if ((g && g.jquery) || typeof g === "string") {
      return g;
    }
    return this.attr.apply(this, arguments);
  };
  f.fn.ajaxSubmit = function (j) {
    if (!this.length) {
      d("ajaxSubmit: skipping submit process - no element selected");
      return this;
    }
    var i,
      C,
      m,
      o = this;
    if (typeof j == "function") {
      j = { success: j };
    } else {
      if (j === undefined) {
        j = {};
      }
    }
    i = j.type || this.attr2("method");
    C = j.url || this.attr2("action");
    m = typeof C === "string" ? f.trim(C) : "";
    m = m || window.location.href || "";
    if (m) {
      m = (m.match(/^([^#]+)/) || [])[1];
    }
    j = f.extend(
      true,
      {
        url: m,
        success: f.ajaxSettings.success,
        type: i || f.ajaxSettings.type,
        iframeSrc: /^https/i.test(window.location.href || "")
          ? "javascript:false"
          : "about:blank",
      },
      j
    );
    var u = {};
    this.trigger("form-pre-serialize", [this, j, u]);
    if (u.veto) {
      d("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
      return this;
    }
    if (j.beforeSerialize && j.beforeSerialize(this, j) === false) {
      d("ajaxSubmit: submit aborted via beforeSerialize callback");
      return this;
    }
    var n = j.traditional;
    if (n === undefined) {
      n = f.ajaxSettings.traditional;
    }
    var s = [];
    var E,
      F = this.formToArray(j.semantic, s);
    if (j.data) {
      j.extraData = j.data;
      E = f.param(j.data, n);
    }
    if (j.beforeSubmit && j.beforeSubmit(F, this, j) === false) {
      d("ajaxSubmit: submit aborted via beforeSubmit callback");
      return this;
    }
    this.trigger("form-submit-validate", [F, this, j, u]);
    if (u.veto) {
      d("ajaxSubmit: submit vetoed via form-submit-validate trigger");
      return this;
    }
    var y = f.param(F, n);
    if (E) {
      y = y ? y + "&" + E : E;
    }
    if (j.type.toUpperCase() == "GET") {
      j.url += (j.url.indexOf("?") >= 0 ? "&" : "?") + y;
      j.data = null;
    } else {
      j.data = y;
    }
    var H = [];
    if (j.resetForm) {
      H.push(function () {
        o.resetForm();
      });
    }
    if (j.clearForm) {
      H.push(function () {
        o.clearForm(j.includeHidden);
      });
    }
    if (!j.dataType && j.target) {
      var l = j.success || function () {};
      H.push(function (q) {
        var k = j.replaceTarget ? "replaceWith" : "html";
        f(j.target)[k](q).each(l, arguments);
      });
    } else {
      if (j.success) {
        H.push(j.success);
      }
    }
    j.success = function (K, q, L) {
      var J = j.context || this;
      for (var I = 0, k = H.length; I < k; I++) {
        H[I].apply(J, [K, q, L || o, o]);
      }
    };
    if (j.error) {
      var z = j.error;
      j.error = function (J, k, q) {
        var I = j.context || this;
        z.apply(I, [J, k, q, o]);
      };
    }
    if (j.complete) {
      var h = j.complete;
      j.complete = function (I, k) {
        var q = j.context || this;
        h.apply(q, [I, k, o]);
      };
    }
    var D = f("input[type=file]:enabled", this).filter(function () {
      return f(this).val() !== "";
    });
    var p = D.length > 0;
    var B = "multipart/form-data";
    var x = o.attr("enctype") == B || o.attr("encoding") == B;
    var w = c.fileapi && c.formdata;
    d("fileAPI :" + w);
    var r = (p || x) && !w;
    var v;
    if (j.iframe !== false && (j.iframe || r)) {
      if (j.closeKeepAlive) {
        f.get(j.closeKeepAlive, function () {
          v = G(F);
        });
      } else {
        v = G(F);
      }
    } else {
      if ((p || x) && w) {
        v = t(F);
      } else {
        v = f.ajax(j);
      }
    }
    o.removeData("jqxhr").data("jqxhr", v);
    for (var A = 0; A < s.length; A++) {
      s[A] = null;
    }
    this.trigger("form-submit-notify", [this, j]);
    return this;
    function g(K) {
      var L = f.param(K, j.traditional).split("&");
      var q = L.length;
      var k = [];
      var J, I;
      for (J = 0; J < q; J++) {
        L[J] = L[J].replace(/\+/g, " ");
        I = L[J].split("=");
        k.push([decodeURIComponent(I[0]), decodeURIComponent(I[1])]);
      }
      return k;
    }
    function t(q) {
      var k = new FormData();
      for (var I = 0; I < q.length; I++) {
        k.append(q[I].name, q[I].value);
      }
      if (j.extraData) {
        var L = g(j.extraData);
        for (I = 0; I < L.length; I++) {
          if (L[I]) {
            k.append(L[I][0], L[I][1]);
          }
        }
      }
      j.data = null;
      var K = f.extend(true, {}, f.ajaxSettings, j, {
        contentType: false,
        processData: false,
        cache: false,
        type: i || "POST",
      });
      if (j.uploadProgress) {
        K.xhr = function () {
          var M = f.ajaxSettings.xhr();
          if (M.upload) {
            M.upload.addEventListener(
              "progress",
              function (Q) {
                var P = 0;
                var N = Q.loaded || Q.position;
                var O = Q.total;
                if (Q.lengthComputable) {
                  P = Math.ceil((N / O) * 100);
                }
                j.uploadProgress(Q, N, O, P);
              },
              false
            );
          }
          return M;
        };
      }
      K.data = null;
      var J = K.beforeSend;
      K.beforeSend = function (N, M) {
        M.data = k;
        if (J) {
          J.call(this, N, M);
        }
      };
      return f.ajax(K);
    }
    function G(af) {
      var L = o[0],
        K,
        ab,
        V,
        ad,
        Y,
        N,
        Q,
        O,
        P,
        Z,
        ac,
        T;
      var ai = f.Deferred();
      ai.abort = function (aj) {
        O.abort(aj);
      };
      if (af) {
        for (ab = 0; ab < s.length; ab++) {
          K = f(s[ab]);
          if (e) {
            K.prop("disabled", false);
          } else {
            K.removeAttr("disabled");
          }
        }
      }
      V = f.extend(true, {}, f.ajaxSettings, j);
      V.context = V.context || V;
      Y = "jqFormIO" + new Date().getTime();
      if (V.iframeTarget) {
        N = f(V.iframeTarget);
        Z = N.attr2("name");
        if (!Z) {
          N.attr2("name", Y);
        } else {
          Y = Z;
        }
      } else {
        N = f('<iframe name="' + Y + '" src="' + V.iframeSrc + '" />');
        N.css({ position: "absolute", top: "-1000px", left: "-1000px" });
      }
      Q = N[0];
      O = {
        aborted: 0,
        responseText: null,
        responseXML: null,
        status: 0,
        statusText: "n/a",
        getAllResponseHeaders: function () {},
        getResponseHeader: function () {},
        setRequestHeader: function () {},
        abort: function (aj) {
          var ak = aj === "timeout" ? "timeout" : "aborted";
          d("aborting upload... " + ak);
          this.aborted = 1;
          try {
            if (Q.contentWindow.document.execCommand) {
              Q.contentWindow.document.execCommand("Stop");
            }
          } catch (al) {}
          N.attr("src", V.iframeSrc);
          O.error = ak;
          if (V.error) {
            V.error.call(V.context, O, ak, aj);
          }
          if (ad) {
            f.event.trigger("ajaxError", [O, V, ak]);
          }
          if (V.complete) {
            V.complete.call(V.context, O, ak);
          }
        },
      };
      ad = V.global;
      if (ad && 0 === f.active++) {
        f.event.trigger("ajaxStart");
      }
      if (ad) {
        f.event.trigger("ajaxSend", [O, V]);
      }
      if (V.beforeSend && V.beforeSend.call(V.context, O, V) === false) {
        if (V.global) {
          f.active--;
        }
        ai.reject();
        return ai;
      }
      if (O.aborted) {
        ai.reject();
        return ai;
      }
      P = L.clk;
      if (P) {
        Z = P.name;
        if (Z && !P.disabled) {
          V.extraData = V.extraData || {};
          V.extraData[Z] = P.value;
          if (P.type == "image") {
            V.extraData[Z + ".x"] = L.clk_x;
            V.extraData[Z + ".y"] = L.clk_y;
          }
        }
      }
      var U = 1;
      var R = 2;
      function S(al) {
        var ak = null;
        try {
          if (al.contentWindow) {
            ak = al.contentWindow.document;
          }
        } catch (aj) {
          d("cannot get iframe.contentWindow document: " + aj);
        }
        if (ak) {
          return ak;
        }
        try {
          ak = al.contentDocument ? al.contentDocument : al.document;
        } catch (aj) {
          d("cannot get iframe.contentDocument: " + aj);
          ak = al.document;
        }
        return ak;
      }
      var J = f("meta[name=csrf-token]").attr("content");
      var I = f("meta[name=csrf-param]").attr("content");
      if (I && J) {
        V.extraData = V.extraData || {};
        V.extraData[I] = J;
      }
      function aa() {
        var al = o.attr2("target"),
          aj = o.attr2("action");
        L.setAttribute("target", Y);
        if (!i || /post/i.test(i)) {
          L.setAttribute("method", "POST");
        }
        if (aj != V.url) {
          L.setAttribute("action", V.url);
        }
        if (!V.skipEncodingOverride && (!i || /post/i.test(i))) {
          o.attr({
            encoding: "multipart/form-data",
            enctype: "multipart/form-data",
          });
        }
        if (V.timeout) {
          T = setTimeout(function () {
            ac = true;
            X(U);
          }, V.timeout);
        }
        function am() {
          try {
            var aq = S(Q).readyState;
            d("state = " + aq);
            if (aq && aq.toLowerCase() == "uninitialized") {
              setTimeout(am, 50);
            }
          } catch (ar) {
            d("Server abort: ", ar, " (", ar.name, ")");
            X(R);
            if (T) {
              clearTimeout(T);
            }
            T = undefined;
          }
        }
        var ak = [];
        try {
          if (V.extraData) {
            for (var ap in V.extraData) {
              if (V.extraData.hasOwnProperty(ap)) {
                if (
                  f.isPlainObject(V.extraData[ap]) &&
                  V.extraData[ap].hasOwnProperty("name") &&
                  V.extraData[ap].hasOwnProperty("value")
                ) {
                  ak.push(
                    f(
                      '<input type="hidden" name="' +
                        V.extraData[ap].name +
                        '">'
                    )
                      .val(V.extraData[ap].value)
                      .appendTo(L)[0]
                  );
                } else {
                  ak.push(
                    f('<input type="hidden" name="' + ap + '">')
                      .val(V.extraData[ap])
                      .appendTo(L)[0]
                  );
                }
              }
            }
          }
          if (!V.iframeTarget) {
            N.appendTo("body");
          }
          if (Q.attachEvent) {
            Q.attachEvent("onload", X);
          } else {
            Q.addEventListener("load", X, false);
          }
          setTimeout(am, 15);
          try {
            L.submit();
          } catch (an) {
            var ao = document.createElement("form").submit;
            ao.apply(L);
          }
        } finally {
          L.setAttribute("action", aj);
          if (al) {
            L.setAttribute("target", al);
          } else {
            o.removeAttr("target");
          }
          f(ak).remove();
        }
      }
      if (V.forceSync) {
        aa();
      } else {
        setTimeout(aa, 10);
      }
      var ag,
        ah,
        ae = 50,
        M;
      function X(ap) {
        if (O.aborted || M) {
          return;
        }
        ah = S(Q);
        if (!ah) {
          d("cannot access response document");
          ap = R;
        }
        if (ap === U && O) {
          O.abort("timeout");
          ai.reject(O, "timeout");
          return;
        } else {
          if (ap == R && O) {
            O.abort("server abort");
            ai.reject(O, "error", "server abort");
            return;
          }
        }
        if (!ah || ah.location.href == V.iframeSrc) {
          if (!ac) {
            return;
          }
        }
        if (Q.detachEvent) {
          Q.detachEvent("onload", X);
        } else {
          Q.removeEventListener("load", X, false);
        }
        var an = "success",
          ar;
        try {
          if (ac) {
            throw "timeout";
          }
          var am = V.dataType == "xml" || ah.XMLDocument || f.isXMLDoc(ah);
          d("isXml=" + am);
          if (!am && window.opera && (ah.body === null || !ah.body.innerHTML)) {
            if (--ae) {
              d("requeing onLoad callback, DOM not available");
              setTimeout(X, 250);
              return;
            }
          }
          var at = ah.body ? ah.body : ah.documentElement;
          O.responseText = at ? at.innerHTML : null;
          O.responseXML = ah.XMLDocument ? ah.XMLDocument : ah;
          if (am) {
            V.dataType = "xml";
          }
          O.getResponseHeader = function (aw) {
            var av = { "content-type": V.dataType };
            return av[aw.toLowerCase()];
          };
          if (at) {
            O.status = Number(at.getAttribute("status")) || O.status;
            O.statusText = at.getAttribute("statusText") || O.statusText;
          }
          var aj = (V.dataType || "").toLowerCase();
          var aq = /(json|script|text)/.test(aj);
          if (aq || V.textarea) {
            var ao = ah.getElementsByTagName("textarea")[0];
            if (ao) {
              O.responseText = ao.value;
              O.status = Number(ao.getAttribute("status")) || O.status;
              O.statusText = ao.getAttribute("statusText") || O.statusText;
            } else {
              if (aq) {
                var ak = ah.getElementsByTagName("pre")[0];
                var au = ah.getElementsByTagName("body")[0];
                if (ak) {
                  O.responseText = ak.textContent
                    ? ak.textContent
                    : ak.innerText;
                } else {
                  if (au) {
                    O.responseText = au.textContent
                      ? au.textContent
                      : au.innerText;
                  }
                }
              }
            }
          } else {
            if (aj == "xml" && !O.responseXML && O.responseText) {
              O.responseXML = W(O.responseText);
            }
          }
          try {
            ag = k(O, aj, V);
          } catch (al) {
            an = "parsererror";
            O.error = ar = al || an;
          }
        } catch (al) {
          d("error caught: ", al);
          an = "error";
          O.error = ar = al || an;
        }
        if (O.aborted) {
          d("upload aborted");
          an = null;
        }
        if (O.status) {
          an =
            (O.status >= 200 && O.status < 300) || O.status === 304
              ? "success"
              : "error";
        }
        if (an === "success") {
          if (V.success) {
            V.success.call(V.context, ag, "success", O);
          }
          ai.resolve(O.responseText, "success", O);
          if (ad) {
            f.event.trigger("ajaxSuccess", [O, V]);
          }
        } else {
          if (an) {
            if (ar === undefined) {
              ar = O.statusText;
            }
            if (V.error) {
              V.error.call(V.context, O, an, ar);
            }
            ai.reject(O, "error", ar);
            if (ad) {
              f.event.trigger("ajaxError", [O, V, ar]);
            }
          }
        }
        if (ad) {
          f.event.trigger("ajaxComplete", [O, V]);
        }
        if (ad && !--f.active) {
          f.event.trigger("ajaxStop");
        }
        if (V.complete) {
          V.complete.call(V.context, O, an);
        }
        M = true;
        if (V.timeout) {
          clearTimeout(T);
        }
        setTimeout(function () {
          if (!V.iframeTarget) {
            N.remove();
          } else {
            N.attr("src", V.iframeSrc);
          }
          O.responseXML = null;
        }, 100);
      }
      var W =
        f.parseXML ||
        function (aj, ak) {
          if (window.ActiveXObject) {
            ak = new ActiveXObject("Microsoft.XMLDOM");
            ak.async = "false";
            ak.loadXML(aj);
          } else {
            ak = new DOMParser().parseFromString(aj, "text/xml");
          }
          return ak &&
            ak.documentElement &&
            ak.documentElement.nodeName != "parsererror"
            ? ak
            : null;
        };
      var q =
        f.parseJSON ||
        function (aj) {
          return window["eval"]("(" + aj + ")");
        };
      var k = function (ao, am, al) {
        var ak = ao.getResponseHeader("content-type") || "",
          aj = am === "xml" || (!am && ak.indexOf("xml") >= 0),
          an = aj ? ao.responseXML : ao.responseText;
        if (aj && an.documentElement.nodeName === "parsererror") {
          if (f.error) {
            f.error("parsererror");
          }
        }
        if (al && al.dataFilter) {
          an = al.dataFilter(an, am);
        }
        if (typeof an === "string") {
          if (am === "json" || (!am && ak.indexOf("json") >= 0)) {
            an = q(an);
          } else {
            if (am === "script" || (!am && ak.indexOf("javascript") >= 0)) {
              f.globalEval(an);
            }
          }
        }
        return an;
      };
      return ai;
    }
  };
  f.fn.ajaxForm = function (g) {
    g = g || {};
    g.delegation = g.delegation && f.isFunction(f.fn.on);
    if (!g.delegation && this.length === 0) {
      var h = { s: this.selector, c: this.context };
      if (!f.isReady && h.s) {
        d("DOM not ready, queuing ajaxForm");
        f(function () {
          f(h.s, h.c).ajaxForm(g);
        });
        return this;
      }
      d(
        "terminating; zero elements found by selector" +
          (f.isReady ? "" : " (DOM not ready)")
      );
      return this;
    }
    if (g.delegation) {
      f(document)
        .off("submit.form-plugin", this.selector, b)
        .off("click.form-plugin", this.selector, a)
        .on("submit.form-plugin", this.selector, g, b)
        .on("click.form-plugin", this.selector, g, a);
      return this;
    }
    return this.ajaxFormUnbind()
      .bind("submit.form-plugin", g, b)
      .bind("click.form-plugin", g, a);
  };
  function b(h) {
    var g = h.data;
    if (!h.isDefaultPrevented()) {
      h.preventDefault();
      f(h.target).ajaxSubmit(g);
    }
  }
  function a(k) {
    var j = k.target;
    var h = f(j);
    if (!h.is("[type=submit],[type=image]")) {
      var g = h.closest("[type=submit]");
      if (g.length === 0) {
        return;
      }
      j = g[0];
    }
    var i = this;
    i.clk = j;
    if (j.type == "image") {
      if (k.offsetX !== undefined) {
        i.clk_x = k.offsetX;
        i.clk_y = k.offsetY;
      } else {
        if (typeof f.fn.offset == "function") {
          var l = h.offset();
          i.clk_x = k.pageX - l.left;
          i.clk_y = k.pageY - l.top;
        } else {
          i.clk_x = k.pageX - j.offsetLeft;
          i.clk_y = k.pageY - j.offsetTop;
        }
      }
    }
    setTimeout(function () {
      i.clk = i.clk_x = i.clk_y = null;
    }, 100);
  }
  f.fn.ajaxFormUnbind = function () {
    return this.unbind("submit.form-plugin click.form-plugin");
  };
  f.fn.formToArray = function (x, g) {
    var w = [];
    if (this.length === 0) {
      return w;
    }
    var l = this[0];
    var p = x ? l.getElementsByTagName("*") : l.elements;
    if (!p) {
      return w;
    }
    var r, q, o, y, m, t, k;
    for (r = 0, t = p.length; r < t; r++) {
      m = p[r];
      o = m.name;
      if (!o || m.disabled) {
        continue;
      }
      if (x && l.clk && m.type == "image") {
        if (l.clk == m) {
          w.push({ name: o, value: f(m).val(), type: m.type });
          w.push(
            { name: o + ".x", value: l.clk_x },
            { name: o + ".y", value: l.clk_y }
          );
        }
        continue;
      }
      y = f.fieldValue(m, true);
      if (y && y.constructor == Array) {
        if (g) {
          g.push(m);
        }
        for (q = 0, k = y.length; q < k; q++) {
          w.push({ name: o, value: y[q] });
        }
      } else {
        if (c.fileapi && m.type == "file") {
          if (g) {
            g.push(m);
          }
          var h = m.files;
          if (h.length) {
            for (q = 0; q < h.length; q++) {
              w.push({ name: o, value: h[q], type: m.type });
            }
          } else {
            w.push({ name: o, value: "", type: m.type });
          }
        } else {
          if (y !== null && typeof y != "undefined") {
            if (g) {
              g.push(m);
            }
            w.push({ name: o, value: y, type: m.type, required: m.required });
          }
        }
      }
    }
    if (!x && l.clk) {
      var s = f(l.clk),
        u = s[0];
      o = u.name;
      if (o && !u.disabled && u.type == "image") {
        w.push({ name: o, value: s.val() });
        w.push(
          { name: o + ".x", value: l.clk_x },
          { name: o + ".y", value: l.clk_y }
        );
      }
    }
    return w;
  };
  f.fn.formSerialize = function (g) {
    return f.param(this.formToArray(g));
  };
  f.fn.fieldSerialize = function (h) {
    var g = [];
    this.each(function () {
      var m = this.name;
      if (!m) {
        return;
      }
      var k = f.fieldValue(this, h);
      if (k && k.constructor == Array) {
        for (var l = 0, j = k.length; l < j; l++) {
          g.push({ name: m, value: k[l] });
        }
      } else {
        if (k !== null && typeof k != "undefined") {
          g.push({ name: this.name, value: k });
        }
      }
    });
    return f.param(g);
  };
  f.fn.fieldValue = function (m) {
    for (var l = [], j = 0, g = this.length; j < g; j++) {
      var k = this[j];
      var h = f.fieldValue(k, m);
      if (
        h === null ||
        typeof h == "undefined" ||
        (h.constructor == Array && !h.length)
      ) {
        continue;
      }
      if (h.constructor == Array) {
        f.merge(l, h);
      } else {
        l.push(h);
      }
    }
    return l;
  };
  f.fieldValue = function (g, o) {
    var j = g.name,
      u = g.type,
      w = g.tagName.toLowerCase();
    if (o === undefined) {
      o = true;
    }
    if (
      o &&
      (!j ||
        g.disabled ||
        u == "reset" ||
        u == "button" ||
        ((u == "checkbox" || u == "radio") && !g.checked) ||
        ((u == "submit" || u == "image") && g.form && g.form.clk != g) ||
        (w == "select" && g.selectedIndex == -1))
    ) {
      return null;
    }
    if (w == "select") {
      var p = g.selectedIndex;
      if (p < 0) {
        return null;
      }
      var r = [],
        h = g.options;
      var l = u == "select-one";
      var q = l ? p + 1 : h.length;
      for (var k = l ? p : 0; k < q; k++) {
        var m = h[k];
        if (m.selected) {
          var s = m.value;
          if (!s) {
            s =
              m.attributes &&
              m.attributes.value &&
              !m.attributes.value.specified
                ? m.text
                : m.value;
          }
          if (l) {
            return s;
          }
          r.push(s);
        }
      }
      return r;
    }
    return f(g).val();
  };
  f.fn.clearForm = function (g) {
    return this.each(function () {
      f("input,select,textarea", this).clearFields(g);
    });
  };
  f.fn.clearFields = f.fn.clearInputs = function (g) {
    var h =
      /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
    return this.each(function () {
      var j = this.type,
        i = this.tagName.toLowerCase();
      if (h.test(j) || i == "textarea") {
        this.value = "";
      } else {
        if (j == "checkbox" || j == "radio") {
          this.checked = false;
        } else {
          if (i == "select") {
            this.selectedIndex = -1;
          } else {
            if (j == "file") {
              if (/MSIE/.test(navigator.userAgent)) {
                f(this).replaceWith(f(this).clone(true));
              } else {
                f(this).val("");
              }
            } else {
              if (g) {
                if (
                  (g === true && /hidden/.test(j)) ||
                  (typeof g == "string" && f(this).is(g))
                ) {
                  this.value = "";
                }
              }
            }
          }
        }
      }
    });
  };
  f.fn.resetForm = function () {
    return this.each(function () {
      if (
        typeof this.reset == "function" ||
        (typeof this.reset == "object" && !this.reset.nodeType)
      ) {
        this.reset();
      }
    });
  };
  f.fn.enable = function (g) {
    if (g === undefined) {
      g = true;
    }
    return this.each(function () {
      this.disabled = !g;
    });
  };
  f.fn.selected = function (g) {
    if (g === undefined) {
      g = true;
    }
    return this.each(function () {
      var h = this.type;
      if (h == "checkbox" || h == "radio") {
        this.checked = g;
      } else {
        if (this.tagName.toLowerCase() == "option") {
          var i = f(this).parent("select");
          if (g && i[0] && i[0].type == "select-one") {
            i.find("option").selected(false);
          }
          this.selected = g;
        }
      }
    });
  };
  f.fn.ajaxSubmit.debug = false;
  function d() {
    if (!f.fn.ajaxSubmit.debug) {
      return;
    }
    var g = "[jquery.form] " + Array.prototype.join.call(arguments, "");
    if (window.console && window.console.log) {
      window.console.log(g);
    } else {
      if (window.opera && window.opera.postError) {
        window.opera.postError(g);
      }
    }
  }
})(typeof jQuery != "undefined" ? jQuery : window.Zepto);
