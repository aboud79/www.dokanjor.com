function initAligningGuidelines(c) {
  var n = c.getSelectionContext(),
    b = 5,
    a = 4,
    i = 1,
    l = "rgb(0,255,0)",
    f,
    m = 1;
  function g(o) {
    j(
      o.x + 0.5,
      o.y1 > o.y2 ? o.y2 : o.y1,
      o.x + 0.5,
      o.y2 > o.y1 ? o.y2 : o.y1
    );
  }
  function d(o) {
    j(
      o.x1 > o.x2 ? o.x2 : o.x1,
      o.y + 0.5,
      o.x2 > o.x1 ? o.x2 : o.x1,
      o.y + 0.5
    );
  }
  function j(p, r, o, q) {
    n.save();
    n.lineWidth = i;
    n.strokeStyle = l;
    n.beginPath();
    n.moveTo((p + f[4]) * m, (r + f[5]) * m);
    n.lineTo((o + f[4]) * m, (q + f[5]) * m);
    n.stroke();
    n.restore();
  }
  function e(q, p) {
    q = Math.round(q);
    p = Math.round(p);
    for (var r = q - a, o = q + a; r <= o; r++) {
      if (r === p) {
        return true;
      }
    }
    return false;
  }
  var k = [],
    h = [];
  c.on("mouse:down", function () {
    f = c.viewportTransform;
    m = c.getZoom();
  });
  c.on("object:moving", function (D) {
    var p = D.target,
      s = c.getObjects(),
      q = p.getCenterPoint(),
      t = q.x,
      o = q.y,
      z = p.getBoundingRect(),
      C = z.height / f[3],
      G = z.width / f[0],
      v = false,
      F = false,
      u = c._currentTransform;
    if (!u) {
      return;
    }
    for (var A = s.length; A--; ) {
      if (s[A] === p) {
        continue;
      }
      var r = s[A].getCenterPoint(),
        y = r.x,
        w = r.y,
        B = s[A].getBoundingRect(),
        E = B.height / f[3],
        x = B.width / f[0];
      if (e(y, t)) {
        F = true;
        k.push({
          x: y,
          y1: w < o ? w - E / 2 - b : w + E / 2 + b,
          y2: o > w ? o + C / 2 + b : o - C / 2 - b,
        });
        p.setPositionByOrigin(new fabric.Point(y, o), "center", "center");
      }
      if (e(y - x / 2, t - G / 2)) {
        F = true;
        k.push({
          x: y - x / 2,
          y1: w < o ? w - E / 2 - b : w + E / 2 + b,
          y2: o > w ? o + C / 2 + b : o - C / 2 - b,
        });
        p.setPositionByOrigin(
          new fabric.Point(y - x / 2 + G / 2, o),
          "center",
          "center"
        );
      }
      if (e(y + x / 2, t + G / 2)) {
        F = true;
        k.push({
          x: y + x / 2,
          y1: w < o ? w - E / 2 - b : w + E / 2 + b,
          y2: o > w ? o + C / 2 + b : o - C / 2 - b,
        });
        p.setPositionByOrigin(
          new fabric.Point(y + x / 2 - G / 2, o),
          "center",
          "center"
        );
      }
      if (e(w, o)) {
        v = true;
        h.push({
          y: w,
          x1: y < t ? y - x / 2 - b : y + x / 2 + b,
          x2: t > y ? t + G / 2 + b : t - G / 2 - b,
        });
        p.setPositionByOrigin(new fabric.Point(t, w), "center", "center");
      }
      if (e(w - E / 2, o - C / 2)) {
        v = true;
        h.push({
          y: w - E / 2,
          x1: y < t ? y - x / 2 - b : y + x / 2 + b,
          x2: t > y ? t + G / 2 + b : t - G / 2 - b,
        });
        p.setPositionByOrigin(
          new fabric.Point(t, w - E / 2 + C / 2),
          "center",
          "center"
        );
      }
      if (e(w + E / 2, o + C / 2)) {
        v = true;
        h.push({
          y: w + E / 2,
          x1: y < t ? y - x / 2 - b : y + x / 2 + b,
          x2: t > y ? t + G / 2 + b : t - G / 2 - b,
        });
        p.setPositionByOrigin(
          new fabric.Point(t, w + E / 2 - C / 2),
          "center",
          "center"
        );
      }
    }
    if (!v) {
      h.length = 0;
    }
    if (!F) {
      k.length = 0;
    }
  });
  c.on("before:render", function () {
    if (c.contextTop != null) {
      c.clearContext(c.contextTop);
    }
  });
  c.on("after:render", function () {
    for (var o = k.length; o--; ) {
      g(k[o]);
    }
    for (var o = h.length; o--; ) {
      d(h[o]);
    }
    k.length = h.length = 0;
  });
  c.on("mouse:up", function () {
    k.length = h.length = 0;
    c.renderAll();
  });
}
