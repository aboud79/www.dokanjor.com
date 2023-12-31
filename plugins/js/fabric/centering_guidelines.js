function initCenteringGuidelines(c) {
  var q = c.getWidth(),
    b = c.getHeight(),
    l = q / 2,
    u = b / 2,
    o = {},
    p = {},
    h = 4,
    k = "rgba(255,0,241,0.5)",
    g = 1,
    j = c.getSelectionContext(),
    r;
  for (var m = l - h, n = l + h; m <= n; m++) {
    o[Math.round(m)] = true;
  }
  for (var m = u - h, n = u + h; m <= n; m++) {
    p[Math.round(m)] = true;
  }
  function a() {
    d(l + 0.5, 0, l + 0.5, b);
  }
  function e() {
    d(0, u + 0.5, q, u + 0.5);
  }
  function d(v, x, i, w) {
    j.save();
    j.strokeStyle = k;
    j.lineWidth = g;
    j.beginPath();
    j.moveTo(v * r[0], x * r[3]);
    j.lineTo(i * r[0], w * r[3]);
    j.stroke();
    j.restore();
  }
  var t = [],
    f,
    s;
  c.on("mouse:down", function () {
    r = c.viewportTransform;
  });
  c.on("object:moving", function (x) {
    var w = x.target,
      i = w.getCenterPoint(),
      v = c._currentTransform;
    if (!v) {
      return;
    }
    (f = Math.round(i.x) in o), (s = Math.round(i.y) in p);
    if (s || f) {
      w.setPositionByOrigin(
        new fabric.Point(f ? l : i.x, s ? u : i.y),
        "center",
        "center"
      );
    }
  });
  c.on("before:render", function () {
    if (c.contextTop != null) {
      c.clearContext(c.contextTop);
    }
  });
  c.on("after:render", function () {
    if (f) {
      a();
    }
    if (s) {
      e();
    }
  });
  c.on("mouse:up", function () {
    f = s = null;
    c.renderAll();
  });
}
