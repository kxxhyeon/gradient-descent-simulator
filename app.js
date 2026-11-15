/* === Original file: assets/js/core/functionRegistry.js === */
/* 함수 목록(설정 데이터)과 극값 계산.
   함수의 형태와 도함수, 정지점 데이터는 FUNCTION_DEFS에서 관리해요.
   삼차함수는 기본 목록에서 제외했어요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};

  /* ---------- 함수 정의 (설정 데이터) ---------- */
  var FUNCTION_DEFS = [
    {
      id: 'F01', name: '기본 포물선', expr: 'f(x) = x²', dexpr: 'f′(x) = 2x',
      f: function (x) { return x * x; }, df: function (x) { return 2 * x; }, d2f: function () { return 2; },
      view: { xMin: -10, xMax: 10 },
      start: { default: 8, options: [-8, -4, 4, 8], min: -10, max: 10 },
      alpha: { min: 0.05, max: 1.5, step: 0.05, default: 0.8 },
      iterations: { min: 1, max: 10, default: 5 },
      compareAlphas: [0.3, 0.5, 0.8, 1.0, 1.2],
      tolX: 1e-5,
      feature: '골짜기가 하나뿐인 가장 기본적인 함수예요.',
      goal: '학습률을 바꾸며 수렴과 발산의 경계를 찾아보세요.',
      probe: '기본적인 수렴과 발산',
      guide: [
        ['0 < α < 0.5', '느리게 접근', '이동 폭이 작아 수렴이 느림'],
        ['α = 0.5', '한 번에 최솟값 도달', '시작점에서 한 번에 x = 0으로 이동'],
        ['0.5 < α < 1', '좌우로 진동하며 수렴', '최솟값을 넘지만 이동 폭이 점차 감소'],
        ['α = 1', '같은 거리로 왕복', '위치의 절댓값이 줄어들지 않음'],
        ['α > 1', '발산', '최솟값에서 점점 멀어짐']
      ]
    },
    {
      id: 'F02', name: '완만한 포물선', expr: 'f(x) = 0.25x²', dexpr: 'f′(x) = 0.5x',
      f: function (x) { return 0.25 * x * x; }, df: function (x) { return 0.5 * x; }, d2f: function () { return 0.5; },
      view: { xMin: -10, xMax: 10 },
      start: { default: 8, options: [-8, -4, 4, 8], min: -10, max: 10 },
      alpha: { min: 0.1, max: 2, step: 0.1, default: 1 },
      iterations: { min: 1, max: 40, default: 12 },
      compareAlphas: [0.2, 0.5, 1, 1.5, 2],
      tolX: 1e-5,
      feature: '곡률이 작아서 같은 학습률로도 움직임이 훨씬 작아요.',
      goal: '기본 포물선과 비교해 알맞은 학습률의 크기가 어떻게 달라지는지 찾아보세요.',
      probe: '곡률에 따른 이동 변화',
      guide: [
        ['α = 0.2', '천천히 접근', 'r = 0.9이므로 오차가 한 번에 10%씩 감소'],
        ['α = 1', '빠르게 접근', 'r = 0.5이므로 오차가 한 번에 절반씩 감소'],
        ['α = 1.5', '더 빠르게 접근', 'r = 0.25이므로 오차가 한 번에 75%씩 감소'],
        ['α = 2', '한 번에 최솟값 도달', 'r = 0이며 x₁ = 0'],
        ['α > 2', '이론적으로 진동 가능', '이 사이트의 2차함수 설정에서는 α를 2까지만 조절']
      ]
    },
    {
      id: 'F03', name: '가파른 포물선', expr: 'f(x) = 4x²', dexpr: 'f′(x) = 8x',
      f: function (x) { return 4 * x * x; }, df: function (x) { return 8 * x; }, d2f: function () { return 8; },
      view: { xMin: -4, xMax: 4 },
      start: { default: 3, options: [-3, -1.5, 1.5, 3], min: -4, max: 4 },
      alpha: { min: 0.01, max: 0.3, step: 0.01, default: 0.1 },
      iterations: { min: 1, max: 40, default: 12 },
      compareAlphas: [0.05, 0.125, 0.2, 0.25, 0.28],
      tolX: 1e-5,
      feature: '기울기가 커서 작은 학습률에도 공이 크게 움직여요.',
      goal: '큰 기울기에서 안정적으로 수렴하는 학습률의 범위를 찾아보세요.',
      probe: '큰 기울기와 학습률의 관계',
      guide: [
        ['0 < α < 0.125', '한쪽에서 접근', '이동 비율 1 − 8α 가 0과 1 사이'],
        ['α = 0.125', '한 번에 최솟값 도달', '이동 비율이 0이 됨'],
        ['0.125 < α < 0.25', '진동하며 수렴', '비율이 −1과 0 사이'],
        ['α = 0.25', '같은 거리로 왕복', '비율이 −1'],
        ['α > 0.25', '발산', '비율의 절댓값이 1보다 큼']
      ]
    },
    {
      id: 'F04', name: '깊이가 다른 두 골짜기', expr: 'f(x) = x⁴/4 − x³/3 − x² + 8/3', dexpr: 'f′(x) = (x + 1)x(x − 2)',
      f: function (x) { return x * x * x * x / 4 - x * x * x / 3 - x * x + 8 / 3; },
      df: function (x) { return (x + 1) * x * (x - 2); },
      d2f: function (x) { return 3 * x * x - 2 * x - 2; },
      stationaryXs: [-1, 0, 2],
      view: { xMin: -2, xMax: 3.2 },
      start: { default: 1.5, options: [-1.6, -1, -0.5, 0.5, 1.5, 2.5], min: -2, max: 3.2 },
      alpha: { min: 0.01, max: 1.5, step: 0.01, default: 0.15 },
      iterations: { min: 1, max: 30, default: 18 },
      compareAlphas: [0.05, 0.1, 0.15, 0.25, 0.5],
      tolX: 1e-4,
      feature: '두 골짜기의 높이가 달라요. 왼쪽은 국소극솟값, 오른쪽은 더 낮은 전역최솟값이에요.',
      goal: '같은 학습률이어도 어느 쪽에서 출발하느냐에 따라 다른 골짜기에 도착하는지 확인해 보세요.',
      probe: '지역 최솟값과 전역 최솟값',
      guide: [
        ['x = −1', '왼쪽 극솟값 · Loss = 2.25', '주변보다 낮지만 전체에서 가장 낮지는 않아요'],
        ['x = 0', '극댓값 · Loss ≈ 2.6667', '양쪽 골짜기를 가르는 경계점이에요'],
        ['x = 2', '오른쪽 전역최솟값 · Loss = 0', '두 극솟값 중 더 낮은 지점이에요'],
        ['x₀ = −1.6, α = 0.15', '왼쪽 골짜기로 이동', '첫 이동 x₁ ≈ −1.0816, Loss 감소'],
        ['x₀ = 1.5, α = 0.15', '오른쪽 골짜기로 이동', '첫 이동 x₁ ≈ 1.7813, Loss 감소']
      ]
    },
    {
      id: 'F05', name: '왼쪽에 평평한 지점', expr: 'f(x) = 3x⁴ − 4x³ + 1', dexpr: 'f′(x) = 12x²(x − 1)',
      f: function (x) { return 3 * x * x * x * x - 4 * x * x * x + 1; },
      df: function (x) { return 12 * x * x * (x - 1); },
      d2f: function (x) { return 36 * x * x - 24 * x; },
      stationaryXs: [0, 1],
      view: { xMin: -0.65, xMax: 1.65 },
      start: { default: 1.3, options: [-0.5, 0, 0.4, 0.8, 1.3, 1.6], min: -0.65, max: 1.65 },
      alpha: { min: 0.005, max: 0.2, step: 0.005, default: 0.025 },
      iterations: { min: 1, max: 30, default: 18 },
      compareAlphas: [0.01, 0.025, 0.04, 0.06, 0.1],
      tolX: 1e-4,
      feature: 'x = 0은 수평변곡점, x = 1에서만 최솟값을 가져요.',
      goal: 'x = 0에서 멈추는 경우와 x = 1까지 도달하는 경우를 비교하세요.',
      probe: '수평변곡점에서의 정지와 참 최솟값',
      guide: [
        ['x = 0', '수평변곡점 · f(0) = 1', '기울기가 0이지만 양쪽 모두 음수'],
        ['x = 1', '극솟값 · f(1) = 0', '기울기가 음수에서 양수로 바뀜'],
        ['x₀ = 0, α = 0.025', '이동하지 않음', 'f′(0) = 0이므로 x₁ = 0'],
        ['x₀ = 1.3, α = 0.025', 'x₁ = 1.1479', 'f′(1.3) = 6.084, 최솟값에 접근'],
        ['x₀ < 0에서 작은 α', 'x = 0 부근에서 느려짐', '수평변곡점의 기울기가 0에 가까움']
      ]
    },
    {
      id: 'F06', name: '볼록 사차함수', expr: 'f(x) = x⁴ + 0.5x²', dexpr: 'f′(x) = 4x³ + x',
      f: function (x) { var s = x * x; return s * s + 0.5 * s; },
      df: function (x) { return 4 * x * x * x + x; },
      d2f: function (x) { return 12 * x * x + 1; },
      view: { xMin: -2.5, xMax: 2.5 },
      start: { default: 2, options: [-2, -1.5, -1, 1, 1.5, 2], min: -2.5, max: 2.5 },
      alpha: { min: 0.005, max: 0.12, step: 0.005, default: 0.02 },
      iterations: { min: 1, max: 150, default: 80 },
      compareAlphas: [0.01, 0.03, 0.06, 0.1, 0.12],
      tolX: 0.01,
      feature: '멀리서는 기울기가 매우 크고, 최솟값 근처에서는 매우 완만해요.',
      goal: '위치에 따라 달라지는 기울기를 관찰하고, 안정적으로 수렴하는 학습률을 찾아보세요.',
      probe: '위치에 따라 달라지는 기울기 크기',
      guide: [
        ['시작점이 멀 때', '큰 기울기', '처음에는 크게 이동'],
        ['최솟값 근처', '매우 완만', '이동 폭이 작아져 수렴이 느림'],
        ['학습률이 큰 경우', '진동 또는 발산', '시작점의 큰 기울기가 이동을 키움']
      ]
    }
  ];

  /* ---------- 극값 계산: 도함수의 부호 변화 지점을 이분법으로 찾음 ---------- */
  function findStationary(fn) {
    var lo = fn.view.xMin * 1.6, hi = fn.view.xMax * 1.6, n = 4000, out = [];
    var step = (hi - lo) / n, prevX = lo, prevG = fn.df(lo);
    for (var i = 1; i <= n; i++) {
      var x = lo + step * i, g = fn.df(x);
      if (prevG === 0 || prevG * g < 0) {
        var a = prevX, b = x, ga = prevG;
        for (var k = 0; k < 80; k++) {
          var m = (a + b) / 2, gm = fn.df(m);
          if (ga * gm <= 0) { b = m; } else { a = m; ga = gm; }
        }
        var r = Math.round(((a + b) / 2) * 1e12) / 1e12;   // 이분법의 아주 작은 오차(3e-27 등)를 정리
        if (r === 0) r = 0;
        if (!out.length || Math.abs(out[out.length - 1] - r) > 1e-9) out.push(r);
      }
      prevX = x; prevG = g;
    }
    return out;
  }

  function buildFunction(def) {
    var fn = def;
    var pts = fn.stationaryXs ? fn.stationaryXs.slice() : findStationary(fn);
    fn.minima = []; fn.maxima = []; fn.stationaryInflections = [];
    // 이계도함수만으로는 중근인 정지점(수평변곡점)을 구분할 수 없어요.
    // 각 정지점 좌우의 일계도함수 부호를 비교해 극소·극대·수평변곡점을 분류해요.
    pts.forEach(function (x) {
      var eps = 1e-4;
      var left = fn.df(x - eps), right = fn.df(x + eps);
      var point = { x: x, f: fn.f(x) };
      if (left < 0 && right > 0) fn.minima.push(point);
      else if (left > 0 && right < 0) fn.maxima.push(point);
      else fn.stationaryInflections.push(point);
    });
    var best = Math.min.apply(null, fn.minima.map(function (m) { return m.f; }));
    fn.minima.forEach(function (m) { m.kind = Math.abs(m.f - best) < 1e-9 ? 'global' : 'local'; });
    fn.multiModal = fn.minima.length > 1;

    /* 시작 위치가 속한 골짜기의 최솟값이 목표. 극댓값 위에서 시작하면 목표가 없음 */
    fn.targetFor = function (start) {
      for (var i = 0; i < fn.maxima.length; i++) { if (Math.abs(start - fn.maxima[i].x) < 1e-9) return null; }
      var bounds = fn.maxima.map(function (m) { return m.x; }).sort(function (a, b) { return a - b; });
      var idx = 0; while (idx < bounds.length && start > bounds[idx]) idx++;
      var lo = idx === 0 ? -Infinity : bounds[idx - 1], hi = idx === bounds.length ? Infinity : bounds[idx];
      for (var j = 0; j < fn.minima.length; j++) { var m = fn.minima[j]; if (m.x > lo && m.x < hi) return m; }
      return null;
    };
    fn.isMaximum = function (x, tol) { return fn.maxima.some(function (m) { return Math.abs(m.x - x) <= tol; }); };
    fn.nearestMinimum = function (x) {
      var best = null, d = Infinity;
      fn.minima.forEach(function (m) { var dd = Math.abs(m.x - x); if (dd < d) { d = dd; best = m; } });
      return best;
    };
    return fn;
  }

  var byId = {};
  FUNCTION_DEFS.forEach(function (d) { buildFunction(d); byId[d.id] = d; });

  GD.functions = {
    list: FUNCTION_DEFS,
    get: function (id) { return byId[id] || null; },
    default: byId.F01
  };

  /* 도함수가 올바른지 수치 미분으로 확인(개발·검증용) */
  GD.functions.verifyDerivatives = function () {
    var report = [];
    FUNCTION_DEFS.forEach(function (fn) {
      var worst = 0, worst2 = 0;
      for (var x = fn.view.xMin; x <= fn.view.xMax; x += (fn.view.xMax - fn.view.xMin) / 80) {
        var h = 1e-5, num = (fn.f(x + h) - fn.f(x - h)) / (2 * h);
        worst = Math.max(worst, Math.abs(num - fn.df(x)) / Math.max(1, Math.abs(fn.df(x))));
        var num2 = (fn.df(x + h) - fn.df(x - h)) / (2 * h);
        worst2 = Math.max(worst2, Math.abs(num2 - fn.d2f(x)) / Math.max(1, Math.abs(fn.d2f(x))));
      }
      report.push({ id: fn.id, derivativeError: worst, secondDerivativeError: worst2, ok: worst < 1e-6 && worst2 < 1e-6 });
    });
    return report;
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/core/gradientDescent.js === */
/* 세 모드가 함께 쓰는 경사하강법 계산 엔진.
   x(n+1) = x(n) − α·f′(x(n))
   같은 함수·시작 위치·학습률·반복 제한이면 어느 모드에서든 같은 결과가 나와요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};
  var CLIP = 1e5;          // 이 값을 넘으면 발산으로 보고 안전하게 종료
  var STATIONARY_EPS = 1e-12;

  function run(fn, opts) {
    var start = Number(opts.start), alpha = Number(opts.alpha);
    var maxIter = Math.max(0, Math.floor(Number(opts.maxIter)));
    var target = Number.isFinite(start) ? fn.targetFor(start) : null;
    var xs = [], fs = [], gs = [];
    var stop = 'max_iterations', overflow = false;

    function push(x) { xs.push(x); fs.push(fn.f(x)); gs.push(fn.df(x)); }
    function reached(x) { return !!target && Math.abs(x - target.x) < fn.tolX; }

    if (!Number.isFinite(start) || !Number.isFinite(alpha)) {
      return finish(fn, opts, [start], [NaN], [NaN], 'numeric_error', false, target);
    }
    push(start);
    if (reached(start)) {
      stop = 'target_reached';
    } else if (Math.abs(gs[0]) < STATIONARY_EPS) {
      stop = 'stationary_point';            // 기울기가 0인 곳에서 시작(예: 극댓값) → 움직이지 않음
    } else {
      var x = start;
      for (var i = 0; i < maxIter; i++) {
        var g = fn.df(x), next = x - alpha * g;
        if (!Number.isFinite(next) || Math.abs(next) > CLIP) {
          overflow = true;
          var dir = Number.isFinite(next) ? (next >= 0 ? 1 : -1) : ((-alpha * g) >= 0 ? 1 : -1);
          push(dir * CLIP); stop = 'diverged'; break;
        }
        x = next; push(x);
        if (!Number.isFinite(fs[fs.length - 1])) { stop = 'numeric_error'; break; }
        if (reached(x)) { stop = 'target_reached'; break; }
        if (Math.abs(gs[gs.length - 1]) < STATIONARY_EPS) { stop = 'stationary_point'; break; }
      }
    }
    return finish(fn, opts, xs, fs, gs, stop, overflow, target);
  }

  function finish(fn, opts, xs, fs, gs, stop, overflow, target) {
    var last = xs.length - 1;
    return {
      functionId: fn.id,
      alpha: Number(opts.alpha),
      start: xs[0],
      maxIter: Math.max(0, Math.floor(Number(opts.maxIter))),
      xs: xs, losses: fs, grads: gs,
      iterations: last,
      finalX: xs[last], finalLoss: fs[last], finalGrad: gs[last],
      stopReason: stop,
      overflow: overflow,
      target: target ? { x: target.x, kind: target.kind } : null,
      success: stop === 'target_reached'
    };
  }

  var STOP_LABELS = {
    target_reached: '목표 도달', max_iterations: '최대 반복 도달', diverged: '발산으로 종료',
    numeric_error: '수치 오류', stationary_point: '기울기 0에서 정지'
  };

  GD.engine = { run: run, CLIP: CLIP, stopLabel: function (s) { return STOP_LABELS[s] || s; } };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/core/resultAnalyzer.js === */
/* 계산된 이동 기록(xs)만 보고 결과 유형을 판정해요. 화면 코드는 이 결과를 그대로 쓰고, 다시 추정하지 않아요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};

  var TYPES = {
    success:       { label: '목표 도달',          tone: 'ok' },
    one_step:      { label: '한 번에 도달',       tone: 'ok' },
    other_min:     { label: '다른 최솟값에 도달', tone: 'info' },
    oscillating:   { label: '진동하며 수렴 중',   tone: 'warn' },
    periodic:      { label: '같은 거리로 왕복',   tone: 'warn' },
    slow:          { label: '수렴 중',            tone: 'info' },
    max_iter:      { label: '반복 횟수 소진',     tone: 'info' },
    growing:       { label: '발산 경향',          tone: 'bad' },
    diverge:       { label: '발산',               tone: 'bad' },
    stuck_max:     { label: '극댓값에서 정지',    tone: 'warn' },
    stuck_flat:    { label: '기울기 0에서 정지',  tone: 'warn' },
    numeric_error: { label: '수치 오류',          tone: 'bad' }
  };
  var CONVERGING = ['success', 'one_step', 'other_min', 'oscillating', 'slow'];
  var DIVERGING = ['diverge', 'growing'];

  function flips(es) {
    var n = 0, prev = 0;
    es.forEach(function (e) {
      var s = e > 0 ? 1 : e < 0 ? -1 : 0;
      if (s !== 0) { if (prev !== 0 && s !== prev) n++; prev = s; }
    });
    return n;
  }

  function analyze(res, fn) {
    var n = res.iterations, xs = res.xs;
    var ref = res.target ? res.target.x : (fn.nearestMinimum(res.start) || { x: 0 }).x;
    var es = xs.map(function (x) { return x - ref; });
    var out = { type: 'max_iter', oscillated: flips(es) >= 1, reachedMinimum: null, detail: '' };

    function done(type, detail) { out.type = type; out.detail = detail; out.label = TYPES[type].label; out.tone = TYPES[type].tone; return out; }

    if (res.stopReason === 'numeric_error') return done('numeric_error', '계산 중 값이 너무 커져 안전하게 종료했어요.');
    if (res.overflow || res.stopReason === 'diverged') return done('diverge', '공이 목표에서 점점 멀어져 그래프 범위를 벗어났어요.');
    if (res.success) {
      var where = res.target.kind === 'global' ? '전역 최솟값' : '국소 최솟값';
      out.reachedMinimum = res.target;
      if (n === 1) return done('one_step', '한 번의 이동으로 목표 최솟값(' + where + ')에 도착했어요.');
      return done('success', (out.oscillated ? '좌우로 진동하다가 ' : '') + '목표 최솟값(' + where + ')에 도착했어요.');
    }
    if (res.stopReason === 'stationary_point' && fn.isMaximum(res.finalX, 1e-6)) {
      return done('stuck_max', '기울기가 0인 극댓값 위에서 시작해 움직이지 못했어요. 극댓값은 최솟값이 아니에요.');
    }
    var tol = Math.max(fn.tolX * 5, 1e-3);
    for (var i = 0; i < fn.minima.length; i++) {
      var m = fn.minima[i];
      if (Math.abs(res.finalX - m.x) < tol && (!res.target || m.x !== res.target.x)) {
        out.reachedMinimum = m;
        return done('other_min', '시작한 쪽이 아닌 ' + (m.kind === 'global' ? '전역' : '국소') + ' 최솟값(x ≈ ' + m.x.toFixed(3) + ')에 도착했어요. 이동이 봉우리를 넘어간 경우예요.');
      }
    }
    if (res.stopReason === 'stationary_point') return done('stuck_flat', '기울기가 0에 가까운 곳에서 멈췄어요.');
    var k = Math.min(n, 6), win = es.slice(es.length - 1 - k), d0 = Math.abs(win[0]), d1 = Math.abs(win[win.length - 1]);
    var ratio = d0 > 0 ? d1 / d0 : 1, wf = flips(win);
    if (n >= 3 && ratio > 1.5) return done('growing', '목표와의 거리가 계속 커지고 있어요. 학습률을 줄여 보세요.');
    if (wf >= 2 && ratio > 0.97 && ratio < 1.03) return done('periodic', '좌우로 오가지만 목표와의 거리가 줄어들지 않아요.');
    if (wf >= 1 && ratio <= 0.97) return done('oscillating', '목표를 넘나들며 거리가 점점 줄고 있어요. 반복 횟수를 늘리면 도착할 수 있어요.');
    if (ratio <= 0.97) return done('slow', '목표에 가까워지고 있어요. 반복 횟수를 늘리거나 학습률을 키워 보세요.');
    return done('max_iter', '정해진 반복 횟수 안에 목표에 도착하지 못했어요.');
  }

  GD.analyzer = {
    analyze: analyze, TYPES: TYPES,
    label: function (t) { return TYPES[t] ? TYPES[t].label : t; },
    isConverging: function (t) { return CONVERGING.indexOf(t) !== -1; },
    isDiverging: function (t) { return DIVERGING.indexOf(t) !== -1; }
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/storage/localRecords.js === */
/* 개인 실험 기록: 이 브라우저의 LocalStorage 에만 저장해요. 서버로 보내거나 다른 사람과 합치지 않아요.
   저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 메모리에만 두고 안내 문구를 바꿔 보여 줘요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};
  var KEY_RECORDS = 'gd.v2.records', KEY_GAME = 'gd.v2.game', KEY_PREFS = 'gd.v2.prefs';
  var MAX_RECORDS = 500, memory = {}, persistent = true;

  function probe() {
    try { var k = '__gd_probe__'; root.localStorage.setItem(k, '1'); root.localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  }
  try { persistent = typeof root.localStorage !== 'undefined' && probe(); }
  catch (e) { persistent = false; } // 파일 미리보기 등 저장소 접근이 차단된 환경

  function read(key, fallback) {
    if (persistent) {
      try { var raw = root.localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) { /* 손상된 값은 무시 */ }
    }
    return key in memory ? memory[key] : fallback;
  }
  function write(key, value) {
    memory[key] = value;
    if (persistent) { try { root.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { persistent = false; } }
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  GD.storage = {
    read: read, write: write, isPersistent: function () { return persistent; },
    notice: function () {
      return persistent
        ? '기록은 이 브라우저에만 저장돼요. 브라우저 데이터를 지우거나 다른 기기를 쓰면 사라질 수 있어요. 필요하면 CSV로 내려받아 보관하세요.'
        : '이 브라우저에서는 기록을 저장할 수 없어요. 지금 화면을 닫기 전까지만 유지되니, 필요하면 CSV로 내려받으세요.';
    },
    prefs: function () { return read(KEY_PREFS, { nickname: '익명' }); },
    setPrefs: function (p) { write(KEY_PREFS, Object.assign(read(KEY_PREFS, { nickname: '익명' }), p)); },
    game: function () { return read(KEY_GAME, null); },
    setGame: function (g) { write(KEY_GAME, g); },
    clearGame: function () { write(KEY_GAME, null); }
  };

  function all() { var r = read(KEY_RECORDS, []); return Array.isArray(r) ? r : []; }
  function matches(rec, f) {
    f = f || {};
    return (!f.mode || rec.mode === f.mode) && (!f.functionId || rec.functionId === f.functionId);
  }

  GD.records = {
    add: function (rec) {
      var full = Object.assign({ id: uid(), createdAt: new Date().toISOString() }, rec);
      var list = all(); list.push(full);
      if (list.length > MAX_RECORDS) list.splice(0, list.length - MAX_RECORDS);
      write(KEY_RECORDS, list); return full;
    },
    list: function (filter) { return all().filter(function (r) { return matches(r, filter); }); },
    get: function (id) { return all().filter(function (r) { return r.id === id; })[0] || null; },
    count: function (filter) { return this.list(filter).length; },
    clear: function (filter) {
      var keep = all().filter(function (r) { return !matches(r, filter || {}); });
      write(KEY_RECORDS, keep);
    },
    max: MAX_RECORDS
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/storage/csvExport.js === */
/* 개인 기록을 CSV 로 내려받아요. 엑셀에서 한글이 깨지지 않도록 BOM 을 붙여요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};
  var MODE_NAMES = { game: '게임모드', research: '연구자모드', challenge: '실험도전모드' };
  var COLUMNS = [
    ['모드', function (r) { return MODE_NAMES[r.mode] || r.mode; }],
    ['함수 ID', function (r) { return r.functionId; }],
    ['함수 이름', function (r) { return r.functionName; }],
    ['실험 날짜', function (r) { return localTime(r.createdAt); }],
    ['닉네임', function (r) { return r.nickname || ''; }],
    ['학습률', function (r) { return r.alpha; }],
    ['시작 위치', function (r) { return r.start; }],
    ['최대 반복 횟수', function (r) { return r.maxIter; }],
    ['반복 횟수', function (r) { return r.iterations; }],
    ['최종 위치', function (r) { return r.finalX; }],
    ['최종 Loss', function (r) { return r.finalLoss; }],
    ['결과', function (r) { return r.statusLabel; }],
    ['성공 여부', function (r) { return r.success ? '성공' : '미도달'; }],
    ['점수', function (r) { return r.score == null ? '' : r.score; }]
  ];
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function localTime(iso) {
    var d = new Date(iso); if (isNaN(d)) return '';
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function cell(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
  function toCSV(records) {
    var lines = [COLUMNS.map(function (c) { return cell(c[0]); }).join(',')];
    records.forEach(function (r) { lines.push(COLUMNS.map(function (c) { return cell(c[1](r)); }).join(',')); });
    return lines.join('\r\n');
  }
  function downloadText(csvText, filename) {
    var blob = new Blob(['\ufeff' + csvText], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename || 'gradient_descent_records.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }
  function download(records, filename) { downloadText(toCSV(records), filename); }
  GD.csv = { toCSV: toCSV, download: download, downloadText: downloadText, localTime: localTime,
    columns: COLUMNS.map(function (c) { return c[0]; }) };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/ui/common.js === */
/* 모드 공통 UI 도우미: 이스케이프, 숫자 표기, SVG 아이콘, 알림 상자. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {};

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtInt(n) { return Number(n).toLocaleString('ko-KR'); }
  function fmtNum(v) {
    v = Number(v); if (!isFinite(v)) return '∞'; if (v === 0) return '0';
    if (Math.abs(v) < 1e12 && Number.isInteger(v)) return fmtInt(v);
    if (Math.abs(v) >= 1e-3 && Math.abs(v) < 1e6) return String(Number(v.toPrecision(6)));
    return v.toExponential(3).replace('e+', 'e');
  }
  var PATHS = {
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    ball: '<circle cx="12" cy="12" r="10"/><path d="m12 8 3.8 2.8-1.4 4.4H9.6l-1.4-4.4z"/><path d="M12 2v6M20.8 9l-5 1.8M17.5 20l-3.1-4.8M6.5 20l3.1-4.8M3.2 9l5 1.8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h14l-3 4.5L18 13H4"/>',
    play: '<path d="M6 4v16l14-8z"/>', skip: '<path d="m5 4 10 8-10 8z"/><path d="M19 5v14"/>', replay: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/>', trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>', back: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    'git-compare': '<path d="M4 7h16M4 17h16"/><path d="m15 3 5 4-5 4M9 13l-5 4 5 4"/>',
    'arrow-left': '<path d="M19 12H5m7-7-7 7 7 7"/>',
    'zoom-in': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>',
    'zoom-out': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/>',
    'reset-view': '<path d="M3 11a9 9 0 1 0 2.7-6.4L3 7"/><path d="M3 3v4h4"/><path d="M12 8v4l3 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', flask: '<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5l-5.1-10.1a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/>'
  };
  function icon(name, size) {
    size = size || 20;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (PATHS[name] || '') + '</svg>';
  }
  var TONE_ICON = { ok: 'check', bad: 'alert', warn: 'activity', info: 'info' };
  function callout(tone, title, text) {
    return '<div class="c-callout is-' + tone + '" role="status">' + icon(TONE_ICON[tone] || 'info') + '<div><strong>' + esc(title) + '</strong>' + (text ? '<span>' + esc(text) + '</span>' : '') + '</div></div>';
  }
  function toast(text, kind) { if (typeof root.gdToast === 'function') { try { root.gdToast(document, text, kind || 'check'); return; } catch (e) {} } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  /* 슬라이더 값 → 소수 자릿수에 맞춰 부동소수 오차 제거 */
  function snap(v, step) { var d = (String(step).split('.')[1] || '').length; return Number(Number(v).toFixed(d)); }
  function decimals(step) { return (String(step).split('.')[1] || '').length; }

  GD.ui = { esc: esc, fmtInt: fmtInt, fmtNum: fmtNum, icon: icon, callout: callout, toast: toast, $: $, $$: $$, clamp: clamp, snap: snap, decimals: decimals };
  GD.modes = GD.modes || {};
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/ui/labControls.js === */
/* 연구자모드·실험도전모드가 함께 쓰는 실험 설정 폼.
   함수마다 달라지는 값(시작 위치 범위, 학습률 범위, 반복 횟수 범위)은 함수 목록의 설정 데이터에서 읽어요. */
(function (root) {
  'use strict';
  var GD = root.GD, U = GD.ui, esc = U.esc;

  GD.ui.createControls = function (host, opt) {
    var id = opt.prefix || 'c', fn = opt.fn, vals = {}, alphaRange = 'basic', compareMode = false, compareAlphas = (opt.compareAlphas || []).slice(), handlers = { run: opt.onRun || function () {}, change: opt.onChange || function () {}, functionChange: opt.onFunctionChange || function () {} };

    function fnOptions() {
      var functions = opt.functions || GD.functions.list;
      // 연구자모드의 실험 화면에서는 현재 함수를 제외한 나머지 5개만 선택지로 표시해요.
      // 2차/4차 카테고리를 넘나들어도 현재 함수의 기본 설정으로 다시 열립니다.
      if (opt.otherFunctionsOnly) {
        var others = functions.filter(function (f) { return f.id !== fn.id; });
        var options = '<option value="" selected disabled>다른 함수 ' + others.length + '개 중 선택…</option>';
        [
          ['2차함수', function (f) { return Number(f.id.slice(1)) <= 3; }],
          ['4차함수', function (f) { return Number(f.id.slice(1)) > 3; }]
        ].forEach(function (group) {
          var matched = others.filter(group[1]);
          if (matched.length) options += '<optgroup label="' + group[0] + '">' + matched.map(function (f) {
            return '<option value="' + f.id + '">' + f.id + ' · ' + esc(f.name) + '</option>';
          }).join('') + '</optgroup>';
        });
        return options;
      }
      return functions.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fn.id ? ' selected' : '') + '>' + f.id + ' · ' + esc(f.name) + '</option>'; }).join('');
    }
    function alphaSpec() {
      var a = opt.alpha || fn.alpha;
      return (a.rangeModes && alphaRange === 'basic') ? { min: a.min, max: a.basicMax, step: a.step } : a;
    }
    function compareTagsHTML() {
      var colors = GD.viz.seriesColors();
      return compareAlphas.map(function (value, i) {
        return '<span class="alpha-tag"><span class="swatch" style="--sw:' + colors[i % colors.length] + '"></span>α = ' + U.fmtNum(value) + '<button type="button" data-cmp-remove="' + value + '" aria-label="학습률 ' + value + ' 제외">×</button></span>';
      }).join('');
    }
    function showCompareMode() {
      if (!opt.compareEnabled) return;
      q('SingleAlpha').hidden = compareMode;
      q('CompareAlpha').hidden = !compareMode;
      q('CompareToggle').setAttribute('aria-pressed', String(compareMode));
      q('CompareToggle').innerHTML = compareMode ? U.icon('arrow-left', 16) + '단일 실험' : U.icon('git-compare', 16) + '학습률 비교';
      q('Run').innerHTML = U.icon('play', 18) + (compareMode ? '비교 실험 실행' : '실험 실행');
      var h = q('CompareModeHint');
      if (h) h.textContent = compareMode ? '같은 함수·시작점·이동 횟수에서 학습률만 비교해요.' : '';
    }
    function refreshCompareTags() {
      if (!opt.compareEnabled) return;
      q('CompareTags').innerHTML = compareTagsHTML();
      var a = alphaSpec();
      q('CompareHint').textContent = '학습률 ' + a.min + ' ~ ' + a.max + ' · 2~5개를 비교할 수 있어요.';
      q('CompareHint').style.color = '';
      q('CompareHint').removeAttribute('role');
    }
    function addCompareAlpha(value) {
      var inp = q('CompareAdd'), hint = q('CompareHint'), a = alphaSpec();
      var v = Number(value), msg = '';
      if (!isFinite(v) || String(value).trim() === '') msg = '학습률을 숫자로 입력해 주세요.';
      else if (v < a.min - 1e-9 || v > a.max + 1e-9) msg = a.min + ' ~ ' + a.max + ' 범위만 비교할 수 있어요.';
      else if (compareAlphas.some(function (x) { return Math.abs(x - v) < 1e-10; })) msg = '이미 추가한 학습률이에요.';
      else if (compareAlphas.length >= 5) msg = '최대 5개까지 비교할 수 있어요.';
      if (msg) { hint.textContent = msg; hint.style.color = 'var(--color-error)'; hint.setAttribute('role', 'alert'); return; }
      // 정밀 조절에서는 소수점 세 자리까지 허용해요. 작은 학습률도 비교할 수 있어요.
      v = Number(v.toPrecision(10)); compareAlphas.push(v); compareAlphas.sort(function (x, y) { return x - y; });
      if (inp) inp.value = ''; refreshCompareTags(); validate(); handlers.change();
    }
    function build() {
      var a = opt.alpha || fn.alpha, it = opt.iterations || fn.iterations, st = fn.start;
      host.innerHTML =
        (opt.showFunction ? '<div class="c-field"><label for="' + id + 'Fn">함수 설정</label>' + (opt.otherFunctionsOnly ? '<span class="c-hint">현재: <strong>' + esc(fn.id) + ' · ' + esc(fn.name) + '</strong></span>' : '') + '<select class="c-select" id="' + id + 'Fn" aria-label="다른 함수 선택">' + fnOptions() + '</select><span class="c-hint" id="' + id + 'FnExpr">' + esc(fn.expr) + ' · ' + esc(fn.dexpr) + '</span></div>' : '') +
        '<div class="c-field"><label for="' + id + 'Start">시작 위치 x</label>' +
          '<div class="c-range-row"><input class="c-range" type="range" id="' + id + 'StartR" aria-label="시작 위치 슬라이더" min="' + st.min + '" max="' + st.max + '" step="0.05" value="' + st.default + '">' +
          '<input class="c-num" type="number" id="' + id + 'Start" inputmode="decimal" step="any" min="' + st.min + '" max="' + st.max + '" value="' + st.default + '" aria-describedby="' + id + 'StartHint"></div>' +
          '<div class="c-chips" role="group" aria-label="시작 위치 바로 고르기">' + st.options.map(function (o) { return '<button type="button" class="c-chip" data-start="' + o + '" aria-pressed="false">' + String(o).replace('-', '\u2212') + '</button>'; }).join('') + '</div>' +
          '<span class="c-hint" id="' + id + 'StartHint">' + st.min + ' 이상 ' + st.max + ' 이하로 입력해요.</span></div>' +
        '<div class="c-field"><div class="research-alpha-header"><label for="' + id + 'Alpha">학습률 α</label>' + (opt.compareEnabled ? '<button type="button" class="c-btn c-btn--sm alpha-compare-toggle" id="' + id + 'CompareToggle" aria-pressed="false">' + U.icon('git-compare', 16) + '학습률 비교</button>' : '') + '</div>' +
          (a.rangeModes ? '<div class="alpha-range-tabs" role="group" aria-label="학습률 조절 범위"><button type="button" id="' + id + 'AlphaBasic" class="alpha-range-tab" aria-pressed="true">정밀 조절</button><button type="button" id="' + id + 'AlphaAdvanced" class="alpha-range-tab" aria-pressed="false">확장 범위</button></div>' : '') +
          '<div id="' + id + 'SingleAlpha"><div class="c-range-row"><input class="c-range" type="range" id="' + id + 'AlphaR" aria-label="학습률 슬라이더" min="' + a.min + '" max="' + (a.rangeModes ? a.basicMax : a.max) + '" step="' + a.step + '" value="' + a.default + '">' +
          '<input class="c-num" type="number" id="' + id + 'Alpha" inputmode="decimal" min="' + a.min + '" max="' + (a.rangeModes ? a.basicMax : a.max) + '" step="any" value="' + a.default + '" aria-describedby="' + id + 'AlphaHint"></div>' +
          '<span class="c-hint" id="' + id + 'AlphaHint">' + a.min + ' ~ ' + (a.rangeModes ? a.basicMax : a.max) + ' 범위. 슬라이더로 조절하거나 숫자를 직접 입력할 수 있어요.</span></div>' +
          (opt.compareEnabled ? '<div class="compare-alpha-panel" id="' + id + 'CompareAlpha" hidden><p class="c-note">공들이 같은 지점에서 출발해 각각 다른 α로 움직여요.</p><div class="alpha-tags" id="' + id + 'CompareTags">' + compareTagsHTML() + '</div><div class="compare-alpha-add"><input class="c-num" id="' + id + 'CompareAdd" type="number" inputmode="decimal" step="any" placeholder="학습률 α" aria-label="비교할 학습률 입력"><button type="button" class="c-btn c-btn--sm" id="' + id + 'CompareAddBtn">' + U.icon('plus', 16) + '추가</button></div><div class="c-row compare-alpha-actions"><button type="button" class="c-btn c-btn--sm c-btn--quiet" id="' + id + 'CompareCurrent">현재 α 추가</button><button type="button" class="c-btn c-btn--sm c-btn--quiet" id="' + id + 'CompareReset">기본값 복구</button></div><span class="c-hint" id="' + id + 'CompareHint"></span></div><p class="c-hint" id="' + id + 'CompareModeHint"></p>' : '') +
          (a.rangeModes ? '<span class="c-hint alpha-range-note" id="' + id + 'AlphaRangeNote">작은 학습률을 정밀하게 비교하는 기본 범위예요.</span>' : '') +
          '</div>' +
        '<div class="c-field"><label for="' + id + 'Iter">최대 반복 횟수</label><div class="c-range-row"><input class="c-range" type="range" id="' + id + 'IterR" aria-label="반복 횟수 슬라이더" min="' + it.min + '" max="' + it.max + '" step="1" value="' + it.default + '">' +
          '<input class="c-num" type="number" id="' + id + 'Iter" inputmode="numeric" min="' + it.min + '" max="' + it.max + '" step="1" value="' + it.default + '" aria-describedby="' + id + 'IterHint"></div>' +
          '<span class="c-hint" id="' + id + 'IterHint">' + it.min + ' ~ ' + it.max + '회. 목표에 도착하면 일찍 끝나요.</span></div>' +
        '<button class="c-btn c-btn--primary c-btn--block" type="button" id="' + id + 'Run">' + U.icon('play', 18) + '실험 실행</button>';
      vals = { start: st.default, alpha: a.default, iter: it.default };
      wire(); syncChips(); showCompareMode(); refreshCompareTags();
    }
    function q(s) { return host.querySelector('#' + id + s); }
    function updateAlphaRange() {
      var a = alphaSpec(), inp = q('Alpha'), slider = q('AlphaR');
      if (!inp || !slider) return;
      inp.min = slider.min = String(a.min); inp.max = slider.max = String(a.max); slider.step = String(a.step);
      var current = parseFloat(inp.value);
      if (isFinite(current) && current > a.max) inp.value = String(a.max);
      if (isFinite(current) && current < a.min) inp.value = String(a.min);
      var v = parseFloat(inp.value); if (isFinite(v)) slider.value = String(U.clamp(v, a.min, a.max));
      var hint = q('AlphaHint');
      hint.textContent = a.min + ' ~ ' + a.max + ' 범위. 슬라이더로 조절하거나 숫자를 직접 입력할 수 있어요.';
      delete hint.dataset.base;
      var basic = q('AlphaBasic'), advanced = q('AlphaAdvanced');
      if (basic && advanced) { basic.setAttribute('aria-pressed', String(alphaRange === 'basic')); advanced.setAttribute('aria-pressed', String(alphaRange === 'advanced'));
        q('AlphaRangeNote').textContent = alphaRange === 'basic' ? '작은 학습률을 정밀하게 비교하는 기본 범위예요.' : '큰 학습률(최대 30)에서는 진동·발산이 쉽게 일어날 수 있어요. 세밀한 조절은 숫자 입력을 이용하세요.';
      }
      if (opt.compareEnabled) { compareAlphas = compareAlphas.filter(function (x) { return x >= a.min - 1e-9 && x <= a.max + 1e-9; }); refreshCompareTags(); }
      validate();
    }
    function setHint(field, msg) {
      var h = q(field + 'Hint'), inp = q(field), base = h.dataset.base || (h.dataset.base = h.textContent);
      if (msg) { h.textContent = msg; h.setAttribute('role', 'alert'); h.style.color = 'var(--color-error)'; inp.setAttribute('aria-invalid', 'true'); }
      else { h.textContent = base; h.removeAttribute('role'); h.style.color = ''; inp.removeAttribute('aria-invalid'); }
    }
    function syncChips() { host.querySelectorAll('[data-start]').forEach(function (b) { b.setAttribute('aria-pressed', Number(b.dataset.start) === Number(q('Start').value) ? 'true' : 'false'); }); }
    function validate() {
      var st = fn.start, a = alphaSpec(), it = opt.iterations || fn.iterations, ok = true;
      var sv = parseFloat(q('Start').value), av = parseFloat(q('Alpha').value), iv = parseFloat(q('Iter').value);
      if (!isFinite(sv) || sv < st.min || sv > st.max) { setHint('Start', st.min + ' 이상 ' + st.max + ' 이하의 숫자를 입력해 주세요.'); ok = false; } else setHint('Start', '');
      if ((!compareMode || !opt.compareEnabled) && (!isFinite(av) || av < a.min - 1e-9 || av > a.max + 1e-9)) { setHint('Alpha', a.min + ' ~ ' + a.max + ' 사이의 숫자를 입력해 주세요.'); ok = false; } else setHint('Alpha', '');
      if (!isFinite(iv) || iv < it.min || iv > it.max || Math.floor(iv) !== iv) { setHint('Iter', it.min + ' ~ ' + it.max + ' 사이의 정수를 입력해 주세요.'); ok = false; } else setHint('Iter', '');
      if (compareMode && opt.compareEnabled && compareAlphas.length < 2) { q('CompareHint').textContent = '비교하려면 학습률을 2개 이상 추가해 주세요.'; q('CompareHint').style.color = 'var(--color-error)'; ok = false; }
      return { valid: ok, start: sv, alpha: av, maxIter: iv, compare: !!(opt.compareEnabled && compareMode), compareAlphas: compareAlphas.slice() };
    }
    function wire() {
      if (opt.compareEnabled) {
        q('CompareToggle').addEventListener('click', function () {
          compareMode = !compareMode; showCompareMode(); validate(); handlers.change();
        });
        q('CompareAddBtn').addEventListener('click', function () { addCompareAlpha(q('CompareAdd').value); });
        q('CompareAdd').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCompareAlpha(this.value); } });
        q('CompareCurrent').addEventListener('click', function () { addCompareAlpha(q('Alpha').value); });
        q('CompareReset').addEventListener('click', function () { compareAlphas = (opt.compareAlphas || []).slice(); refreshCompareTags(); validate(); handlers.change(); });
        q('CompareTags').addEventListener('click', function (e) {
          var b = e.target.closest('[data-cmp-remove]'); if (!b) return;
          compareAlphas = compareAlphas.filter(function (n) { return n !== Number(b.dataset.cmpRemove); });
          refreshCompareTags(); validate(); handlers.change();
        });
      }
      var fnSel = q('Fn'); if (fnSel) fnSel.addEventListener('change', function () { handlers.functionChange(fnSel.value); });
      q('AlphaR').addEventListener('input', function () { q('Alpha').value = U.snap(q('AlphaR').value, alphaSpec().step); validate(); syncChips(); handlers.change(); });
      q('Alpha').addEventListener('input', function () { var v = parseFloat(q('Alpha').value); var a = alphaSpec(); if (isFinite(v)) q('AlphaR').value = U.clamp(v, a.min, a.max); validate(); syncChips(); handlers.change(); });
      if (q('AlphaBasic')) {
        q('AlphaBasic').addEventListener('click', function () { alphaRange = 'basic'; updateAlphaRange(); handlers.change(); });
        q('AlphaAdvanced').addEventListener('click', function () { alphaRange = 'advanced'; updateAlphaRange(); handlers.change(); });
      }
      q('IterR').addEventListener('input', function () { q('Iter').value = q('IterR').value; validate(); handlers.change(); });
      q('Iter').addEventListener('input', function () { var v = parseFloat(q('Iter').value); if (isFinite(v)) q('IterR').value = U.clamp(v, (opt.iterations || fn.iterations).min, (opt.iterations || fn.iterations).max); validate(); handlers.change(); });
      q('StartR').addEventListener('input', function () { q('Start').value = U.snap(q('StartR').value, 0.05); validate(); syncChips(); handlers.change(); });
      q('Start').addEventListener('input', function () { var v = parseFloat(q('Start').value); if (isFinite(v)) q('StartR').value = U.clamp(v, fn.start.min, fn.start.max); validate(); syncChips(); handlers.change(); });
      host.querySelectorAll('[data-start]').forEach(function (b) { b.addEventListener('click', function () { q('Start').value = b.dataset.start; q('StartR').value = b.dataset.start; validate(); syncChips(); handlers.change(); }); });
      q('Run').addEventListener('click', function () { var v = validate(); if (!v.valid) { var bad = host.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); else if (v.compare && q('CompareAdd')) q('CompareAdd').focus(); return; } handlers.run(v); });
    }
    build();
    return {
      el: host,
      values: validate,
      setFunction: function (f) { fn = f; alphaRange = 'basic'; build(); },
      setValues: function (v) { if (v.start != null) { q('Start').value = v.start; q('StartR').value = v.start; } if (v.alpha != null) { q('Alpha').value = v.alpha; q('AlphaR').value = v.alpha; } if (v.maxIter != null) { q('Iter').value = v.maxIter; q('IterR').value = v.maxIter; } syncChips(); validate(); },
      setBusy: function (b) { q('Run').disabled = !!b; },
      focusRun: function () { q('Run').focus(); },
      alphaMode: function () { return alphaRange; },
      isComparison: function () { return compareMode; },
      comparisonAlphas: function () { return compareAlphas.slice(); }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/visualization/trajectory.js === */
/* 이동 경로 구간 계산. 그래프는 이 구간 목록을 그대로 점선으로 그려요.
   (시작점-끝점 한 줄이 아니라, 기록된 모든 좌표를 방문 순서대로 잇는 n개의 구간) */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {}; GD.viz = GD.viz || {};
  GD.viz.trajectory = {
    /* xs: 방문한 x 좌표 배열, f: 함수 → [{index, from:{x,y}, to:{x,y}}] */
    segments: function (xs, f) {
      var out = [];
      for (var i = 0; i < xs.length - 1; i++) {
        out.push({ index: i, from: { x: xs[i], y: f(xs[i]) }, to: { x: xs[i + 1], y: f(xs[i + 1]) } });
      }
      return out;
    },
    /* 구간 목록이 실제 방문 좌표와 정확히 이어지는지 확인(검증용) */
    isContinuous: function (segs, xs) {
      if (segs.length !== Math.max(0, xs.length - 1)) return false;
      return segs.every(function (s, i) { return s.from.x === xs[i] && s.to.x === xs[i + 1] && (i === 0 || segs[i - 1].to.x === s.from.x); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/visualization/functionGraph.js === */
/* 함수 그래프 + 축구공 이동 + 이동 경로 점선.
   - 공은 함수 곡선 위를 따라 움직여요(기존 게임모드와 같은 방식).
   - 실험이 끝나면 공이 실제로 방문한 좌표(xs)를 방문 순서대로 직선으로 이은 점선을 보여 줘요.
     시작점과 끝점만 잇지 않고, 기록된 모든 좌표를 순서대로 연결해요.
   - 색은 CSS 변수(토큰)에서 읽어 와서 디자인 시스템과 어긋나지 않아요. */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {}; GD.viz = GD.viz || {};

  function cssVar(name, fallback) {
    try { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fallback; }
    catch (e) { return fallback; }
  }
  function palette() {
    return {
      curve: cssVar('--curve', '#1F6FB5'), path: cssVar('--path', '#C4471C'), ink: cssVar('--ink', '#142B4A'),
      muted: cssVar('--muted', '#586A82'), grid: cssVar('--grid', '#E3ECF5'), axis: cssVar('--axis', '#8CA0B6'),
      gold: cssVar('--gold', '#F4B400'), goldInk: cssVar('--gold-ink', '#7A4E00'), paper: cssVar('--paper', '#FBFDFF'),
      accent: cssVar('--blue', '#1769AA'), sky: cssVar('--sky-100', '#E5F6FD'), skyLine: cssVar('--sky-300', '#B5E0F0'),
      ball: cssVar('--ball', '#1B2A3F'), font: cssVar('--font-body', 'system-ui, sans-serif')
    };
  }
  function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw)) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / e;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e;
  }
  function niceCeil(v) {
    if (!(v > 0) || !isFinite(v)) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e, s = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < s.length; i++) if (m <= s[i] + 1e-9) return s[i] * e;
    return 10 * e;
  }
  var nf = null; try { nf = new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }); } catch (e) { nf = null; }
  function fmtTick(v) {
    if (Math.abs(v) < 1e-12) return '0';
    var s = (Math.abs(v) >= 10000 && nf) ? nf.format(v) : String(Number(v.toPrecision(4)));
    if (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e15) s = v.toExponential(0);
    return s.replace('-', '\u2212');
  }
  function reducedMotion() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  GD.viz.nice = { step: niceStep, ceil: niceCeil, fmt: fmtTick };
  GD.viz.cssVar = cssVar;
  GD.viz.seriesColors = function () {
    var out = []; for (var i = 1; i <= 8; i++) out.push(cssVar('--series-' + i, '#1769AA')); return out;
  };

  GD.viz.createFunctionGraph = function (canvas, options) {
    var opt = Object.assign({ compact: false, previewOnly: false, interactive: false, onSelectStep: null, onFinish: null, onFrame: null }, options || {});
    var ctx = canvas.getContext('2d'), P = palette();
    var fn = GD.functions.default, res = null, multi = null, idleStart = fn.start.default;
    var st = { phase: 'idle', k: 0, prog: 0, moving: false, showSteps: false, selected: -1 };
    var W = 0, H = 0, M = { l: 58, r: 18, t: 16, b: 46 }, pw = 1, ph = 1;
    var view = { xMin: -10, xMax: 10, yLo: 0, yHi: 80, ys: 10, xs: 2 }, fittedView = null, customView = null;
    var raf = 0, last = null, elapsed = 0, playbackSpeed = 1, timing = { startHold: 300, move: 480, hold: 200, reduced: false }, finishCb = null, destroyed = false;

    function margins() { M = opt.compact ? { l: 10, r: 10, t: 10, b: 10 } : { l: W < 460 ? 46 : 58, r: 18, t: 16, b: 46 }; pw = Math.max(1, W - M.l - M.r); ph = Math.max(1, H - M.t - M.b); }
    function X(x) { return M.l + (x - view.xMin) / (view.xMax - view.xMin) * pw; }
    function Y(y) { return M.t + (1 - (y - view.yLo) / (view.yHi - view.yLo)) * ph; }

    function pointsOf() {
      var xs = []; if (res) xs = xs.concat(res.xs);
      if (multi) {
        var visible = multi.filter(function (it) { return it.visible !== false; });
        var stable = visible.filter(function (it) {
          return it.analysis && ['growing', 'diverge', 'numeric_error'].indexOf(it.analysis.type) < 0 && !it.result.overflow;
        });
        // 안정된 공이 하나라도 있으면 그 공들의 궤적을 기준으로 자동 배율을 잡아요.
        // 발산하는 공의 기록은 지우지 않고 결과표와 Loss 그래프에 모두 남아요.
        var fit = stable.length ? stable : visible;
        fit.forEach(function (it) {
          var initial = it.result.xs[0], span = fn.view.xMax - fn.view.xMin;
          xs = xs.concat(it.result.xs.filter(function (x) { return isFinite(x) && Math.abs(x - initial) <= span * 2; }));
        });
      }
      if (!xs.length) xs = [idleStart];
      return xs.filter(isFinite);
    }
    function computeView() {
      var base = fn.view, xs = pointsOf(), xMin = base.xMin, xMax = base.xMax;
      xs.forEach(function (x) { if (x < xMin) xMin = x; if (x > xMax) xMax = x; });
      var span = xMax - xMin;
      if (xMin < base.xMin) xMin -= span * 0.06;
      if (xMax > base.xMax) xMax += span * 0.06;
      var fs = xs.map(fn.f).filter(isFinite), top = fs.length ? Math.max.apply(null, fs) : 1;
      var mins = fn.minima.map(function (m) { return m.f; }), lo = Math.min(0, Math.min.apply(null, mins.concat(fs)));
      var barrier = fn.maxima.length ? Math.max.apply(null, fn.maxima.map(function (m) { return m.f; })) - Math.min.apply(null, mins) : 0;
      var flats = (fn.stationaryInflections || []).map(function (p) { return p.f; });
      var hi = Math.max(top * 1.15, barrier * 2.2 + Math.min.apply(null, mins), (fn.f(base.xMax) + fn.f(base.xMin)) * 0.12, Math.max.apply(null, flats.concat([0])) * 1.55);
      if (fn.id === 'F01') hi = Math.max(hi, 70);
      hi = niceCeil(hi - 0) ; if (lo < 0) hi = niceCeil(Math.max(hi, -lo * 3));
      var yLo = lo < 0 ? lo - (hi - lo) * 0.06 : -hi * 0.045;
      fittedView = { xMin: xMin, xMax: xMax, yLo: yLo, yHi: hi };
      view = Object.assign({}, customView || fittedView);
      refreshTicks();
    }

    // 확대/축소 시 마우스·손가락이 가리키는 좌표를 기준으로 시야를 바꿔요.
    // 자동 화면 맞춤은 별도로 보존해 원래 화면 버튼으로 되돌릴 수 있어요.
    function refreshTicks() {
      view.xs = niceStep((view.xMax - view.xMin) / Math.max(4, Math.floor(pw / 62)));
      view.ys = niceStep((view.yHi - view.yLo) / Math.max(3, Math.floor(ph / 52)));
    }
    function saveView() { customView = { xMin: view.xMin, xMax: view.xMax, yLo: view.yLo, yHi: view.yHi }; refreshTicks(); draw(); }
    function zoomAt(factor, px, py) {
      if (!opt.interactive || !W || !H || !(factor > 0)) return;
      px = Math.min(M.l + pw, Math.max(M.l, px == null ? M.l + pw / 2 : px));
      py = Math.min(M.t + ph, Math.max(M.t, py == null ? M.t + ph / 2 : py));
      var width = view.xMax - view.xMin, height = view.yHi - view.yLo;
      var baseW = fittedView ? fittedView.xMax - fittedView.xMin : width;
      var newW = width * factor;
      if (newW < baseW / 100 || newW > baseW * 30) return;
      var fx = (px - M.l) / pw, fy = (py - M.t) / ph;
      var pivotX = view.xMin + fx * width, pivotY = view.yHi - fy * height;
      var newH = height * factor;
      view.xMin = pivotX - fx * newW; view.xMax = view.xMin + newW;
      view.yHi = pivotY + fy * newH; view.yLo = view.yHi - newH;
      saveView();
    }
    function panBy(px, py) {
      if (!opt.interactive || !W || !H) return;
      var dx = px * (view.xMax - view.xMin) / pw;
      var dy = py * (view.yHi - view.yLo) / ph;
      view.xMin -= dx; view.xMax -= dx; view.yLo += dy; view.yHi += dy;
      saveView();
    }
    function resetView() { customView = null; computeView(); draw(); }

    function pill(text, cx, cy, fg, bg, border) {
      ctx.font = '600 12px ' + P.font; var w = ctx.measureText(text).width + 16, h = 20;
      cx = Math.min(Math.max(cx, M.l + w / 2), W - 4 - w / 2);
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 10); else ctx.rect(cx - w / 2, cy - h / 2, w, h);
      ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = border; ctx.stroke();
      ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx, cy + 0.5);
    }
    function star(cx, cy, R, r) {
      ctx.beginPath();
      for (var i = 0; i < 10; i++) { var rr = i % 2 ? r : R, a = -Math.PI / 2 + i * Math.PI / 5, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.closePath();
    }
    function pent(cx, cy, r, rot) {
      ctx.beginPath();
      for (var i = 0; i < 5; i++) { var a = rot + i * 2 * Math.PI / 5, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.closePath();
    }
    function ball(cx, cy, r) {
      ctx.save(); ctx.shadowColor = 'rgba(20,43,74,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fillStyle = P.paper; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.clip();
      ctx.fillStyle = P.ball; pent(cx, cy, r * 0.36, -Math.PI / 2); ctx.fill(); ctx.strokeStyle = P.ball; ctx.lineWidth = 1.3;
      for (var i = 0; i < 5; i++) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.36, cy + Math.sin(a) * r * 0.36); ctx.lineTo(cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72); ctx.stroke();
        pent(cx + Math.cos(b) * r, cy + Math.sin(b) * r, r * 0.27, b + Math.PI); ctx.fill();
      }
      ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.lineWidth = 1.6; ctx.strokeStyle = P.ball; ctx.stroke();
    }

    function drawGrid() {
      ctx.lineWidth = 1; ctx.font = '12px ' + P.font; ctx.textBaseline = 'middle';
      var y0 = Math.ceil(Math.max(view.yLo, 0 - 1e9) / view.ys) * view.ys; if (view.yLo < 0) y0 = Math.ceil(view.yLo / view.ys) * view.ys;
      for (var y = y0; y <= view.yHi + 1e-9; y += view.ys) {
        var yy = Y(y); ctx.strokeStyle = P.grid; ctx.beginPath(); ctx.moveTo(M.l, yy); ctx.lineTo(M.l + pw, yy); ctx.stroke();
        ctx.fillStyle = P.muted; ctx.textAlign = 'right'; ctx.fillText(fmtTick(y), M.l - 8, yy);
      }
      for (var x = Math.ceil(view.xMin / view.xs) * view.xs; x <= view.xMax + 1e-9; x += view.xs) {
        var xx = X(x); ctx.strokeStyle = P.grid; ctx.beginPath(); ctx.moveTo(xx, M.t); ctx.lineTo(xx, M.t + ph); ctx.stroke();
        ctx.fillStyle = P.muted; ctx.textAlign = 'center'; ctx.fillText(fmtTick(Math.abs(x) < 1e-9 ? 0 : x), xx, M.t + ph + 15);
      }
      ctx.fillStyle = P.ink; ctx.font = '600 12.5px ' + P.font; ctx.textAlign = 'center';
      ctx.fillText('공의 위치 x', M.l + pw / 2, H - 9);
      ctx.save(); ctx.translate(13, M.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('함숫값 f(x)', 0, 0); ctx.restore();
    }
    function curvePath(x0, x1) {
      var n = Math.max(24, Math.ceil(Math.abs(X(x1) - X(x0)) / 2));
      for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n, px = X(x), py = Y(fn.f(x)); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    }
    function drawChord(a, b, color, arrows) {
      var ax = X(a), ay = Y(fn.f(a)), bx = X(b), by = Y(fn.f(b));
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      var len = Math.hypot(bx - ax, by - ay);
      if (arrows && len >= 34 && isFinite(len)) {
        var mx = ax + (bx - ax) * 0.55, my = ay + (by - ay) * 0.55, ang = Math.atan2(by - ay, bx - ax), s = 6;
        ctx.save(); ctx.setLineDash([]); ctx.fillStyle = color; ctx.translate(mx, my); ctx.rotate(ang);
        ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s, -s * 0.8); ctx.lineTo(-s, s * 0.8); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    function drawPath(xs, upto, color, arrows) {
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = opt.compact ? 2.4 : 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.setLineDash(opt.compact ? [1, 6] : [1.5, 7]);
      for (var i = 0; i < upto; i++) drawChord(xs[i], xs[i + 1], color, false);
      ctx.restore();
      if (arrows) { ctx.save(); ctx.strokeStyle = color; for (var j = 0; j < upto; j++) drawChord(xs[j], xs[j + 1], color, true); ctx.restore(); }
    }
    function dot(x, color, r, fill) {
      var px = X(x), py = Y(fn.f(x)); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.2832); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = color; ctx.stroke();
    }
    function inPlot(px, py) { return px >= M.l - 2 && px <= M.l + pw + 2 && py >= M.t - 2 && py <= M.t + ph + 2; }

    function draw() {
      if (destroyed || !W) return; P = palette();
      ctx.clearRect(0, 0, W, H); ctx.textBaseline = 'middle';
      if (!opt.compact) drawGrid();
      ctx.save(); ctx.beginPath(); ctx.rect(M.l, M.t, pw, ph); ctx.clip();
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1.2;
      if (view.xMin < 0 && view.xMax > 0 && !opt.compact) { ctx.beginPath(); ctx.moveTo(X(0), M.t); ctx.lineTo(X(0), M.t + ph); ctx.stroke(); }
      if (view.yLo < 0 && view.yHi > 0 && !opt.compact) { ctx.beginPath(); ctx.moveTo(M.l, Y(0)); ctx.lineTo(M.l + pw, Y(0)); ctx.stroke(); }
      ctx.beginPath(); curvePath(view.xMin, view.xMax); ctx.strokeStyle = P.curve; ctx.lineWidth = opt.compact ? 2.4 : 3; ctx.lineJoin = 'round'; ctx.stroke();
      // 최솟값 표시(별): 이번 실험의 목표는 크게
      var targetX = res && res.target ? res.target.x : (!res && !multi && fn.targetFor(idleStart) ? fn.targetFor(idleStart).x : (multi && multi[0] && multi[0].result.target ? multi[0].result.target.x : null));
      fn.minima.forEach(function (m) {
        var isT = targetX !== null && Math.abs(m.x - targetX) < 1e-9;
        star(X(m.x), Y(m.f), isT ? 11 : 8, isT ? 4.8 : 3.4);
        if (isT) { ctx.fillStyle = P.gold; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = P.goldInk; ctx.stroke(); }
        else { ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = P.goldInk; ctx.stroke(); }
      });
      // 기울기 0이지만 극솟값이 아닌 수평변곡점은 파란 테두리 원으로 표시해요.
      (fn.stationaryInflections || []).forEach(function (p) {
        var xx = X(p.x), yy = Y(p.f);
        ctx.beginPath(); ctx.arc(xx, yy, opt.compact ? 6.5 : 8, 0, 2 * Math.PI);
        ctx.fillStyle = P.paper; ctx.fill(); ctx.strokeStyle = P.accent; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(xx, yy, 2.2, 0, 2 * Math.PI); ctx.fillStyle = P.accent; ctx.fill();
      });
      // 선택용 미리보기에는 출발 공을 덮어씌우지 않고 함수의 모양·특징점만 보여 줘요.
      if (opt.previewOnly) { ctx.restore(); return; }
      // 이동 경로(점선): 기록된 모든 좌표를 방문 순서대로 연결
      if (multi) {
        multi.forEach(function (it) {
          if (it.visible === false) return;
          var xs = it.result.xs, n = it.result.iterations;
          var upto = st.phase === 'multi-play' ? Math.min(st.k, n) : n;
          drawPath(xs, upto, it.color, !opt.compact);
          if (st.phase === 'multi-play' && st.moving && st.k < n) {
            var partial = xs[st.k] + (xs[st.k + 1] - xs[st.k]) * st.prog;
            drawChord(xs[st.k], partial, it.color, false);
          }
        });
      } else if (res) {
        var n = res.iterations, upto = st.phase === 'done' ? n : Math.min(st.k, n);
        drawPath(res.xs, upto, P.path, !opt.compact);
      }
      ctx.restore();
      if (multi) {
        multi.forEach(function (it) {
          if (it.visible === false) return;
          var xs = it.result.xs, n = it.result.iterations;
          var k = st.phase === 'multi-play' ? Math.min(st.k, n) : n;
          var fx = xs[k];
          if (st.phase === 'multi-play' && st.moving && st.k < n) fx = xs[st.k] + (xs[st.k + 1] - xs[st.k]) * st.prog;
          if (!isFinite(fx)) return;
          var px = X(fx), py = Y(fn.f(fx)); if (!inPlot(px, py)) return;
          ctx.save(); ctx.shadowColor = it.color; ctx.shadowBlur = 5;
          ctx.beginPath(); ctx.arc(px, py, 7.5, 0, 6.2832); ctx.fillStyle = it.color; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = P.paper; ctx.stroke(); ctx.restore();
        });
        var s0 = multi.length ? multi[0].result.start : idleStart;
        dot(s0, P.ink, 6.5, P.paper);
        if (!opt.compact) { var px0 = X(s0), py0 = Y(fn.f(s0)); if (inPlot(px0, py0)) pill('시작', px0 + 28, Math.max(M.t + 12, py0 - 14), P.accent, P.sky, P.skyLine); }
        return;
      }
      var xsP = res ? res.xs : [idleStart], n2 = xsP.length - 1;
      var reached = st.phase === 'done' ? n2 : Math.min(st.k, n2);
      if (res) {
        var lastLabel = null;
        for (var i = 0; i <= reached; i++) {
          var px = X(xsP[i]), py = Y(fn.f(xsP[i])); if (!inPlot(px, py)) continue;
          if (i > 0 && i < n2 || (i === n2 && st.phase !== 'done')) dot(xsP[i], P.path, 4.6, P.paper);
          if (st.showSteps && i > 0 && (!lastLabel || Math.hypot(px - lastLabel[0], py - lastLabel[1]) > 22)) {
            var ly = py - 17 < M.t + 8 ? py + 17 : py - 17;
            ctx.beginPath(); ctx.arc(px, ly, 9, 0, 6.2832); ctx.fillStyle = P.path; ctx.fill();
            ctx.fillStyle = P.paper; ctx.font = '700 11px ' + P.font; ctx.textAlign = 'center'; ctx.fillText(String(i), px, ly + 0.5); lastLabel = [px, ly];
          }
        }
      }
      // 시작점
      var sx = X(xsP[0]), sy = Y(fn.f(xsP[0]));
      if (inPlot(sx, sy)) {
        dot(xsP[0], P.ink, 7, P.paper);
        if (!opt.compact && (res || true)) pill('시작', sx + 28 + 20 > W ? sx - 28 : sx + 28, Math.max(M.t + 12, sy - 14), P.accent, P.sky, P.skyLine);
      }
      // 공: 재생 중에는 곡선 위를 미끄러지고, 끝나면 최종 위치에 머뭄
      var bx = xsP[reached];
      if (st.phase === 'play' && st.moving && res) bx = xsP[st.k] + (xsP[st.k + 1] - xsP[st.k]) * st.prog;
      var ballX = X(bx), ballY = Y(fn.f(bx)), r = opt.compact ? 9 : 12.5;
      if (!inPlot(ballX, ballY)) { ballX = Math.min(Math.max(ballX, M.l + 12), M.l + pw - 12); ballY = Math.min(Math.max(ballY, M.t + 12), M.t + ph - 12); r = opt.compact ? 8 : 11; }
      if (!res) { ctx.beginPath(); ctx.arc(ballX, ballY, r + 7, 0, 6.2832); ctx.strokeStyle = P.accent; ctx.globalAlpha = 0.5; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1; }
      if (st.selected >= 0 && res && st.selected <= reached) {
        var sp = X(xsP[st.selected]), sq = Y(fn.f(xsP[st.selected]));
        ctx.beginPath(); ctx.arc(sp, sq, 12, 0, 6.2832); ctx.lineWidth = 3; ctx.strokeStyle = P.accent; ctx.stroke();
      }
      ball(ballX, ballY, r);
      if (res && st.phase === 'done' && !opt.compact && n2 > 0) pill('최종', ballX + 30 + 20 > W ? ballX - 30 : ballX + 30, Math.min(M.t + ph - 12, ballY + 16), P.paper, P.accent, P.accent);
      if (opt.onFrame) opt.onFrame(st);
    }

    /* ---------- 재생 ---------- */
    function stateAt(ms) {
      var n = multi ? Math.max.apply(null, multi.map(function (it) { return it.result.iterations; }).concat([0])) : (res ? res.iterations : 0); if (n <= 0) return { k: 0, prog: 1, moving: false, done: true };
      var t = ms - timing.startHold; if (t < 0) return { k: 0, prog: 0, moving: false, done: false };
      if (timing.reduced) { var idx = Math.floor(t / timing.move) + 1; return idx >= n ? { k: n, prog: 1, moving: false, done: true } : { k: idx, prog: 1, moving: false, done: false }; }
      var per = timing.move + timing.hold, k = Math.floor(t / per);
      if (k >= n) return { k: n, prog: 1, moving: false, done: true };
      var inK = t - k * per;
      return inK < timing.move ? { k: k, prog: ease(inK / timing.move), moving: true, done: false } : { k: k + 1, prog: 1, moving: false, done: false };
    }
    function loop(ts) {
      if (destroyed) return;
      if (last === null) last = ts; elapsed += Math.min(ts - last, 100) * playbackSpeed; last = ts;
      var s = stateAt(elapsed); st.k = s.k; st.prog = s.prog; st.moving = s.moving;
      if (s.done) { finish(false); return; }
      draw(); raf = requestAnimationFrame(loop);
    }
    function setPhase(p) { st.phase = p; canvas.dataset.phase = p; if (opt.onPhase) opt.onPhase(p); }
    function startPlay(cb) {
      cancelAnimationFrame(raf); finishCb = cb || null; st.selected = -1; elapsed = 0; last = null;
      var n = Math.max(1, multi ? Math.max.apply(null, multi.map(function (it) { return it.result.iterations; }).concat([0])) : res.iterations); timing.reduced = reducedMotion();
      // 실험이 길어도 재생이 지나치게 느려지지 않도록 전체 재생 시간을 약 10초 이내로 제한해요.
      timing.move = timing.reduced ? Math.min(600, Math.max(25, 6200 / n)) : Math.min(480, Math.max(22, 6500 / n)); timing.hold = timing.move * 0.25;
      st.k = 0; st.prog = 0; st.moving = false; setPhase(multi ? 'multi-play' : 'play'); computeView(); draw(); raf = requestAnimationFrame(loop);
    }
    function finish(skipped) {
      cancelAnimationFrame(raf); st.k = res ? res.iterations : (multi ? Math.max.apply(null, multi.map(function (it) { return it.result.iterations; }).concat([0])) : 0); st.moving = false; st.prog = 1; setPhase(multi ? 'multi-done' : 'done'); draw();
      var cb = finishCb; finishCb = null; if (cb) cb(skipped);
    }

    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = root.devicePixelRatio || 1;
      W = Math.max(0, r.width); H = Math.max(0, r.height); if (!W || !H) return;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      margins(); computeView(); draw();
    }
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas); else root.addEventListener('resize', resize);
    if (root.document && document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(); });

    function nearestStep(ev) {
      if (!res || st.phase !== 'done') return -1;
      var r = canvas.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, best = -1, bd = 18;
      res.xs.forEach(function (x, i) { var d = Math.hypot(X(x) - mx, Y(fn.f(x)) - my); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    var pointers = new Map(), dragged = false, gestureDistance = 0;
    function pointerInfo(ev) { var r = canvas.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top, clientX: ev.clientX, clientY: ev.clientY }; }
    function pairInfo() {
      var a = Array.from(pointers.values());
      if (a.length < 2) return null;
      return { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2, distance: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) };
    }
    function onPointerDown(ev) {
      if (!opt.interactive || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      pointers.set(ev.pointerId, pointerInfo(ev));
      if (pointers.size > 1) dragged = true;
      gestureDistance = pairInfo() ? pairInfo().distance : 0;
      try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    }
    function onMove(ev) {
      if (!pointers.has(ev.pointerId)) {
        if (opt.interactive && ev.pointerType === 'mouse') canvas.style.cursor = nearestStep(ev) >= 0 ? 'pointer' : 'grab';
        return;
      }
      var old = pointers.get(ev.pointerId), before = pairInfo(), next = pointerInfo(ev);
      pointers.set(ev.pointerId, next);
      if (pointers.size >= 2) {
        var after = pairInfo();
        if (before && after && before.distance > 2 && after.distance > 2) zoomAt(before.distance / after.distance, after.x, after.y);
        if (before && after) panBy(after.x - before.x, after.y - before.y);
        dragged = true;
      } else {
        var dx = next.x - old.x, dy = next.y - old.y;
        if (Math.hypot(dx, dy) > 1.5 || dragged) {
          if (Math.hypot(dx, dy) > 2) dragged = true;
          if (dragged) panBy(dx, dy);
        }
      }
      canvas.style.cursor = 'grabbing';
    }
    function onPointerUp(ev) {
      pointers.delete(ev.pointerId); gestureDistance = 0;
      if (pointers.size === 0) canvas.style.cursor = opt.interactive ? 'grab' : 'default';
    }
    function onWheel(ev) {
      if (!opt.interactive) return;
      // 기본 휠 동작은 페이지 스크롤. Ctrl/Alt+휠을 눌렀을 때만 그래프 배율을 바꿔요.
      if (!(ev.ctrlKey || ev.altKey)) return;
      ev.preventDefault();
      var pos = pointerInfo(ev);
      zoomAt(ev.deltaY > 0 ? 1.14 : 1 / 1.14, pos.x, pos.y);
    }
    function onClick(ev) {
      if (dragged) { dragged = false; return; }
      if (!opt.onSelectStep) return;
      var k = nearestStep(ev); if (k >= 0) { st.selected = k; draw(); opt.onSelectStep(k); }
    }
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('click', onClick);
    if (opt.interactive) {
      canvas.classList.add('graph-interactive'); canvas.style.cursor = 'grab';
      canvas.addEventListener('wheel', onWheel, { passive: false });
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
      canvas.addEventListener('lostpointercapture', onPointerUp);
    }

    return {
      setFunction: function (f) { cancelAnimationFrame(raf); fn = f; res = null; multi = null; idleStart = f.start.default; st.selected = -1; customView = null; setPhase('idle'); computeView(); draw(); },
      showIdle: function (start) { cancelAnimationFrame(raf); res = null; multi = null; if (isFinite(start)) idleStart = start; st.selected = -1; setPhase('idle'); computeView(); draw(); },
      play: function (result, cb) { multi = null; res = result; startPlay(cb); },
      replay: function (cb) { if (res || multi) startPlay(cb || null); },
      playMulti: function (items, cb) { res = null; multi = items; startPlay(cb); },
      updateMulti: function (items) { if (!multi) return; multi = items; customView = null; computeView(); draw(); },
      setPlaybackSpeed: function (n) { if ([0.5, 1, 2, 4].indexOf(Number(n)) < 0) return false; playbackSpeed = Number(n); return true; },
      getPlaybackSpeed: function () { return playbackSpeed; },
      skip: function () { if (st.phase === 'play' || st.phase === 'multi-play') finish(true); },
      showResult: function (result) { cancelAnimationFrame(raf); multi = null; res = result; st.selected = -1; st.k = result.iterations; setPhase('done'); computeView(); draw(); },
      showMulti: function (items) { cancelAnimationFrame(raf); res = null; multi = items; setPhase('multi'); computeView(); draw(); },
      setShowSteps: function (b) { st.showSteps = !!b; draw(); },
      select: function (k) { st.selected = k; draw(); },
      redraw: function () { computeView(); draw(); },
      zoomBy: function (factor) { zoomAt(factor); },
      resetView: resetView,
      isPlaying: function () { return st.phase === 'play' || st.phase === 'multi-play'; },
      getState: function () { return { phase: st.phase, k: st.k, selected: st.selected, view: Object.assign({}, view) }; },
      project: function (x) { return { x: X(x), y: Y(fn.f(x)) }; },
      /* 지금 화면에 그려진 점선 구간(검증용): 기록된 모든 좌표를 순서대로 연결한 구간 목록 */
      drawnSegments: function () {
        if (!res || !GD.viz.trajectory) return [];
        var n = st.phase === 'done' ? res.iterations : Math.min(st.k, res.iterations);
        return GD.viz.trajectory.segments(res.xs.slice(0, n + 1), fn.f);
      },
      destroy: function () { destroyed = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); else root.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('click', onClick); canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('pointerdown', onPointerDown); canvas.removeEventListener('pointerup', onPointerUp); canvas.removeEventListener('pointercancel', onPointerUp); canvas.removeEventListener('lostpointercapture', onPointerUp); pointers.clear(); }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/visualization/lossChart.js === */
/* 반복 횟수에 따른 Loss 변화 그래프. 실제 계산한 반복별 Loss(f(x))만 그려요.
   - 선형 보기: Loss 값 그대로
   - 로그 보기: 목표 최솟값과의 차이(f − f*)를 로그 눈금으로 보여 줘서, 수렴 속도 차이를 알아보기 쉬워요.
   - 점을 누르면 같은 단계가 이동 경로 그래프에서도 강조돼요(onSelect). */
(function (root) {
  'use strict';
  var GD = root.GD = root.GD || {}; GD.viz = GD.viz || {};
  var W = 640, H = 280, L = 62, R = 18, T = 16, B = 46;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function css(n, f) { return GD.viz.cssVar(n, f); }

  GD.viz.suggestLossScale = function (series) {
    var all = []; series.forEach(function (s) { s.values.forEach(function (v) { if (isFinite(v)) all.push(Math.abs(v)); }); });
    if (!all.length) return 'linear';
    var mx = Math.max.apply(null, all), mn = Math.min.apply(null, all.filter(function (v) { return v > 0; }).concat([mx]));
    return mx / Math.max(mn, 1e-300) > 1e4 ? 'log' : 'linear';
  };

  GD.viz.createLossChart = function (container, options) {
    var opt = Object.assign({ onSelect: null }, options || {});
    var cur = { series: [], scale: 'linear', baseline: 0, selected: -1, label: '' };

    function transform(v) {
      if (cur.scale === 'log') return Math.max(v - cur.baseline, 1e-12);
      return v;
    }
    function render(series, o) {
      cur = Object.assign(cur, { series: series || cur.series }, o || {});
      var s = cur.series, nPts = Math.max.apply(null, s.map(function (x) { return x.values.length; }).concat([1]));
      if (!s.length) { container.innerHTML = ''; return; }
      var ink = css('--ink', '#142B4A'), muted = css('--muted', '#586A82'), grid = css('--grid', '#E3ECF5'), paper = css('--paper', '#FBFDFF'), accent = css('--blue', '#1769AA');
      var pw = W - L - R, ph = H - T - B, log = cur.scale === 'log';
      var vals = []; s.forEach(function (x) { x.values.forEach(function (v) { if (isFinite(v)) vals.push(transform(v)); }); });
      var yMin, yMax, yTicks = [];
      if (log) {
        var lo = Math.floor(Math.log10(Math.min.apply(null, vals))), hi = Math.ceil(Math.log10(Math.max.apply(null, vals)));
        if (hi === lo) hi = lo + 1; var stepDec = Math.max(1, Math.ceil((hi - lo) / 6));
        yMin = lo; yMax = hi; for (var e = lo; e <= hi; e += stepDec) yTicks.push(e);
      } else {
        yMin = Math.min(0, Math.min.apply(null, vals)); yMax = Math.max.apply(null, vals); if (yMax === yMin) yMax = yMin + 1;
        var st = GD.viz.nice.step((yMax - yMin) / 5); yMin = Math.floor(yMin / st) * st; yMax = Math.ceil(yMax / st) * st;
        for (var y = yMin; y <= yMax + st * 1e-6; y += st) yTicks.push(y);
      }
      function X(i) { return L + (nPts <= 1 ? pw / 2 : i / (nPts - 1) * pw); }
      function Y(v) { var t = log ? Math.log10(transform(v)) : v; return T + (1 - (t - yMin) / (yMax - yMin)) * ph; }
      var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(cur.label || 'Loss 변화 그래프') + '" focusable="false">';
      yTicks.forEach(function (t) {
        var yy = T + (1 - (t - yMin) / (yMax - yMin)) * ph;
        out += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy.toFixed(1) + '" y2="' + yy.toFixed(1) + '" stroke="' + grid + '"/>';
        out += '<text x="' + (L - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + muted + '">' + esc(log ? '1e' + t : GD.viz.nice.fmt(t)) + '</text>';
      });
      var xStep = Math.max(1, Math.ceil((nPts - 1) / 8));
      for (var i = 0; i < nPts; i += xStep) out += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 24) + '" text-anchor="middle" font-size="12" fill="' + muted + '">' + i + '</text>';
      out += '<text x="' + (L + pw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12.5" font-weight="600" fill="' + ink + '">반복 횟수</text>';
      out += '<text transform="translate(14 ' + (T + ph / 2) + ') rotate(-90)" text-anchor="middle" font-size="12.5" font-weight="600" fill="' + ink + '">' + (log ? '목표와의 Loss 차이 (f − f*)' : 'Loss f(x)') + '</text>';
      if (cur.selected >= 0 && cur.selected < nPts) out += '<line x1="' + X(cur.selected).toFixed(1) + '" x2="' + X(cur.selected).toFixed(1) + '" y1="' + T + '" y2="' + (T + ph) + '" stroke="' + accent + '" stroke-width="1.5" stroke-dasharray="4 4"/>';
      s.forEach(function (ser, si) {
        var pts = ser.values.map(function (v, k) { return X(k).toFixed(1) + ',' + Y(v).toFixed(1); }).join(' ');
        out += '<polyline points="' + pts + '" fill="none" stroke="' + ser.color + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"' + (ser.dashed ? ' stroke-dasharray="7 5"' : '') + '/>';
        if (ser.values.length <= 80) ser.values.forEach(function (v, k) {
          var sel = k === cur.selected;
          out += '<circle cx="' + X(k).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="' + (sel ? 6.5 : 4) + '" fill="' + (sel ? ser.color : paper) + '" stroke="' + ser.color + '" stroke-width="2.2"><title>' + esc((ser.label ? ser.label + ' · ' : '') + k + '회 · Loss ' + GD.viz.nice.fmt(v)) + '</title></circle>';
          out += '<circle class="hit" data-step="' + k + '" data-series="' + si + '" cx="' + X(k).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="15" fill="transparent" role="button" tabindex="0" aria-label="' + esc((ser.label ? ser.label + ' · ' : '') + k + '회 Loss 계산 보기') + '" style="cursor:pointer"/>';
        });
      });
      container.innerHTML = out + '</svg>';
    }
    function onClick(ev) {
      var t = ev.target.closest ? ev.target.closest('[data-step]') : null; if (!t) return;
      var k = Number(t.getAttribute('data-step')); cur.selected = k; render(); if (opt.onSelect) opt.onSelect(k, Number(t.getAttribute('data-series')));
    }
    function onKey(ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[data-step]')) { ev.preventDefault(); onClick(ev); } }
    container.addEventListener('click', onClick);
    container.addEventListener('keydown', onKey);
    return {
      render: render,
      select: function (k) { cur.selected = k; render(); },
      setScale: function (sc) { cur.scale = sc; render(); },
      getScale: function () { return cur.scale; },
      destroy: function () { container.removeEventListener('click', onClick); container.removeEventListener('keydown', onKey); container.innerHTML = ''; }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/visualization/gameGraphFrame.js === */
/* 게임모드 그래프: 보안상 외부 스크립트 없이 srcdoc 캔버스로 실행. Windows 모션 설정과 무관하게 사용자 선택에 따름. */
(function (root) {
  var GD = root.GD = root.GD || {};
  GD.gameGraphHtml = "\n<!doctype html><html lang=\"ko\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap\" media=\"print\" onload=\"this.media='all'\">\n<style>\n*{box-sizing:border-box}html,body{margin:0;height:100%;background:transparent;font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif;color:#142B4A}\n.card{height:100%;display:flex;flex-direction:column;background:#fff;border:1px solid #D2DFEC;border-radius:16px;box-shadow:0 1px 2px rgba(20,43,74,.06),0 2px 8px rgba(20,43,74,.05);overflow:hidden}\n.bar{display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;padding:10px 12px;border-bottom:1px solid #E6EEF6;background:linear-gradient(180deg,#F5FBFE,#fff)}\n.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:#E5F6FD;border:1px solid #B5E0F0;color:#0B6B84;font-weight:800;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}.chip.status{background:#fff;border-color:#D2DFEC;color:#26374F;font-weight:700}.chip.status.done{background:#E6F7EE;border-color:#8FD1AB;color:#14532D}.dot{width:8px;height:8px;border-radius:50%;background:#38D5E8}.done .dot{background:#1F7A4D}\nbutton.act{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:6px 14px;border-radius:10px;border:1.5px solid #8FDCEA;background:#fff;color:#142B4A;font:700 13px/1 inherit;font-family:inherit;cursor:pointer;transition:background-color .15s,border-color .15s,transform .1s;touch-action:manipulation}button.act:hover{background:#E5F6FD;border-color:#38D5E8}button.act:active{transform:scale(.97)}button.act:focus-visible{outline:3px solid #1769AA;outline-offset:2px}button.act[hidden]{display:none}\n.plot{position:relative;flex:1;min-height:200px}canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab}canvas.dragging{cursor:grabbing}.bar-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.zoom-buttons{display:inline-flex;gap:4px;align-items:center}.zoom-act{min-width:36px;padding:5px 8px!important;justify-content:center;font-size:19px!important;line-height:1!important}@media(max-width:450px){.bar{padding:8px}.chips{gap:4px}.chip{padding:5px 8px;font-size:12px}.zoom-act{min-width:35px}.bar-actions{gap:4px}}.empty{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);max-width:min(86%,360px);text-align:center;background:rgba(255,255,255,.94);border:1px solid #B5E0F0;border-radius:14px;padding:12px 16px;font-size:14px;line-height:1.55;font-weight:500;color:#26374F;box-shadow:0 6px 20px rgba(20,43,74,.10)}.empty b{color:#1769AA}\n.legend{display:flex;flex-wrap:wrap;gap:6px 16px;padding:8px 14px 10px;border-top:1px solid #E6EEF6;font-size:12.5px;color:#586A82}.legend span{display:inline-flex;align-items:center;gap:6px}.lg-dot{width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #F0603A}.lg-line{width:20px;height:4px;border-radius:3px;background:#F0603A}.lg-curve{width:20px;height:4px;border-radius:3px;background:#1F6FB5}.lg-star{width:14px;height:14px;background:#F4B400;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n</style></head><body>\n<div class=\"card\"><div class=\"bar\"><div class=\"chips\"><span class=\"chip\" id=\"stepChip\"></span><span class=\"chip status\" id=\"status\" role=\"status\" aria-live=\"polite\"><i class=\"dot\"></i><span id=\"statusText\"></span></span></div><div class=\"bar-actions\"><button class=\"act\" id=\"actBtn\" type=\"button\" hidden></button><div class=\"zoom-buttons\" role=\"group\" aria-label=\"게임 그래프 확대·축소\"><button class=\"act zoom-act\" id=\"zoomIn\" type=\"button\" aria-label=\"그래프 확대\" title=\"확대\">＋</button><button class=\"act zoom-act\" id=\"zoomOut\" type=\"button\" aria-label=\"그래프 축소\" title=\"축소\">－</button><button class=\"act zoom-act\" id=\"zoomReset\" type=\"button\" aria-label=\"원래 화면으로\" title=\"원래 화면\">⟲</button></div></div></div>\n<div class=\"plot\" id=\"plot\"><canvas id=\"cv\" role=\"img\" aria-label=\"__ARIA__\"></canvas><div class=\"empty\" id=\"empty\" hidden>왼쪽 설정에서 <b>학습률 α</b>와 <b>이동 횟수</b>를 정하고<br><b>실험 실행</b>을 눌러 보세요.</div></div>\n<div class=\"legend\" aria-hidden=\"true\"><span><i class=\"lg-curve\"></i>함수 y = x²</span><span><i class=\"lg-line\"></i>공이 지나간 길</span><span><i class=\"lg-dot\"></i>멈춘 위치</span><span><i class=\"lg-star\"></i>목표(최솟값)</span></div><p class=\"sr\">__SR__</p></div>\n<script>\n(() => {\n  const POINTS = __POINTS__, ATTEMPT = __ATTEMPT__, IDLE = __IDLE__;\n  const MOVE_MS = __MOVE_MS__, HOLD_MS = __HOLD_MS__, START_HOLD = __START_HOLD__;\n  const reduce = __REDUCE_MOTION__;\n  const C = { ink:'#142B4A', muted:'#586A82', grid:'#E6EEF6', axis:'#8CA0B6', curve:'#1F6FB5', trail:'#F0603A', trailDark:'#B83A1B', gold:'#F4B400', goldDark:'#8A5A00', bowl:'rgba(56,213,232,' };\n  const $ = (id) => document.getElementById(id), plot = $('plot'), cv = $('cv'), ctx = cv.getContext('2d');\n  const stepChip = $('stepChip'), statusEl = $('status'), statusText = $('statusText'), actBtn = $('actBtn');\n  const total = POINTS.length - 1;\n  function niceCeil(v) { const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; const s = [1,1.2,1.5,2,2.5,3,4,5,6,8,10]; for (const k of s) if (m <= k + 1e-9) return k * e; return 10 * e; }\n  function niceStep(raw) { const e = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; }\n  // 평소에는 축을 고정합니다. 이동이 너무 작아지거나 공이 화면 끝에 가까워질 때만\n  // 한 번의 부드러운 카메라 전환으로 확대/축소하고, 실험 애니메이션은 계속 재생합니다.\n  let xLim = 10, yMax = 80, yMin = -4.4, cameraCenterX = 0, cameraOffsetY = 0, manualCamera = false;\n  let cameraTransition = null;\n  let cameraEnabled = false;\n  // 확대는 공이 두 번 움직인 뒤, 이동 폭이 충분히 작을 때 반복해서 수행합니다.\n  let lastFineZoomMoveCount = 0;\n  function startCameraTransition(targetX, targetY, now, kind) {\n    cameraTransition = {\n      fromX: xLim, fromY: yMax,\n      toX: Math.max(1e-8, targetX), toY: Math.max(1e-8, targetY),\n      start: now, duration: (reduce ? 1 : 520)\n    };\n  }\n  function updateCamera(st, bx, now) {\n    if (manualCamera) return;\n    if (!cameraEnabled || IDLE) {\n      yMin = -Math.max(yMax * 0.055, 1e-9);\n      return;\n    }\n    if (cameraTransition) {\n      const raw = Math.max(0, Math.min(1, (now - cameraTransition.start) / cameraTransition.duration));\n      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;\n      xLim = Math.exp(Math.log(cameraTransition.fromX) + (Math.log(cameraTransition.toX) - Math.log(cameraTransition.fromX)) * eased);\n      yMax = Math.exp(Math.log(cameraTransition.fromY) + (Math.log(cameraTransition.toY) - Math.log(cameraTransition.fromY)) * eased);\n      if (raw >= 1) {\n        xLim = cameraTransition.toX;\n        yMax = cameraTransition.toY;\n        cameraTransition = null;\n      }\n      yMin = -Math.max(yMax * 0.055, 1e-9);\n      return;\n    }\n\n    const absX = Math.abs(bx);\n    const reached = Math.min(st.k, total);\n    const nextIndex = st.moving ? Math.min(total, st.k + 1) : Math.min(total, reached + 1);\n    const nextX = POINTS[nextIndex] ? POINTS[nextIndex].x : bx;\n    const furthestAbsX = Math.max(absX, Math.abs(nextX));\n\n    // 화면 가장자리나 그래프 상단에 닿기 전에 다음 위치까지 포함해 한 번에 축소합니다.\n    if (absX > xLim * 0.82 || bx * bx > yMax * 0.82) {\n      // 가장자리에서 조금씩 축소하지 않고, 다음 위치까지 여유 있게 담도록 한 번에 크게 축소합니다.\n      const targetX = niceCeil(Math.max(furthestAbsX * 1.24, xLim * 1.40));\n      const targetY = niceCeil(Math.max(furthestAbsX * furthestAbsX * 1.42, yMax * 1.65));\n      if (targetX > xLim * 1.06 || targetY > yMax * 1.06) {\n        startCameraTransition(targetX, targetY, now, 'out');\n        yMin = -Math.max(yMax * 0.055, 1e-9);\n        return;\n      }\n    }\n\n    // 수렴해 공의 이동 폭이 화면에서 너무 작아지면 두 번의 이동마다 확대를 다시 검토합니다.\n    // 한 번 확대할 때는 현재 공과 다음 위치를 포함하면서 시야를 크게 좁힙니다.\n    const completedMoves = st.moving ? st.k : reached;\n    if (st.moving && total > 0 && absX > 1e-8 && completedMoves >= lastFineZoomMoveCount + 2 && st.prog < 0.08) {\n      const segmentIndex = Math.min(st.k, total - 1);\n      const segmentDelta = Math.abs(POINTS[segmentIndex + 1].x - POINTS[segmentIndex].x);\n      const segmentPixels = segmentDelta * pw / Math.max(1, 2 * xLim);\n      if (segmentPixels < 52) {\n        const nextAbsX = Math.abs(POINTS[segmentIndex + 1].x);\n        const visibleAbsX = Math.max(absX, nextAbsX);\n        // 목표점(0) 중심의 대칭 축을 유지하되, 공 위치 주변으로 한 번에 약 2~3배 확대합니다.\n        const targetX = Math.max(visibleAbsX * 1.22, xLim * 0.32, 0.025);\n        const targetY = Math.max(visibleAbsX * visibleAbsX * 1.42, yMax * 0.16, targetX * targetX * 1.10, 0.02);\n        lastFineZoomMoveCount = completedMoves;\n        if (targetX < xLim * 0.90 && targetY < yMax * 0.94) {\n          startCameraTransition(targetX, targetY, now, 'in');\n          yMin = -Math.max(yMax * 0.055, 1e-9);\n          return;\n        }\n      }\n    }\n    yMin = -Math.max(yMax * 0.055, 1e-9);\n  }\n  function resetCamera() {\n    xLim = 10; yMax = 80; yMin = -4.4;\n    cameraTransition = null;\n    cameraEnabled = false;\n    lastFineZoomMoveCount = 0;\n    cameraCenterX = 0; cameraOffsetY = 0; manualCamera = false;\n  }\n  let nf = null; try { nf = new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }); } catch (e) {}\n  function fmt(v) { const s = (Math.abs(v) >= 10000 && nf) ? nf.format(v) : (Math.round(v * 100) / 100).toLocaleString('ko-KR'); return s.replace('-', '\\u2212'); }\n  let W = 0, H = 0, pw = 0, ph = 0; const M = { l: 60, r: 18, t: 14, b: 50 };\n  const X = (x) => M.l + (x - cameraCenterX + xLim) / (2 * xLim) * pw, Y = (y) => M.t + (1 - (y - yMin - cameraOffsetY) / (yMax - yMin)) * ph;\n  const unX = (px) => cameraCenterX - xLim + (px - M.l) / Math.max(pw, 1) * 2 * xLim;\n  const unY = (py) => yMin + cameraOffsetY + (1 - (py - M.t) / Math.max(ph, 1)) * (yMax - yMin);\n  function resize() { const r = plot.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; W = Math.max(1, r.width); H = Math.max(1, r.height); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); M.l = W < 420 ? 48 : 60; pw = W - M.l - M.r; ph = H - M.t - M.b; draw(lastState, performance.now()); }\n  function pent(cx, cy, r, rot) { ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = rot + i * 2 * Math.PI / 5, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); }\n  function star(cx, cy, R, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 === 0 ? R : r, a = -Math.PI / 2 + i * Math.PI / 5, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); }\n  function pill(text, cx, cy, fg, bg, border) { ctx.font = '700 12px \"Noto Sans KR\",sans-serif'; const tw = ctx.measureText(text).width, w = tw + 16, h = 20; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 10) : ctx.rect(cx - w / 2, cy - h / 2, w, h); ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = border; ctx.stroke(); ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx, cy + .5); }\n  function ball(cx, cy, r) { ctx.save(); ctx.shadowColor = 'rgba(20,43,74,.38)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = '#1B2A3F'; pent(cx, cy, r * .36, -Math.PI / 2); ctx.fill(); ctx.strokeStyle = '#1B2A3F'; ctx.lineWidth = 1.3; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * .36, cy + Math.sin(a) * r * .36); ctx.lineTo(cx + Math.cos(a) * r * .72, cy + Math.sin(a) * r * .72); ctx.stroke(); pent(cx + Math.cos(b) * r * 1.0, cy + Math.sin(b) * r * 1.0, r * .27, b + Math.PI); ctx.fill(); } ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.lineWidth = 1.6; ctx.strokeStyle = '#1B2A3F'; ctx.stroke(); }\n  function curveTo(x0, x1) { const n = Math.max(2, Math.ceil(Math.abs(X(x1) - X(x0)) / 3)); for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, px = X(x), py = Y(x * x); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } }\n  const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;\n  const FINAL = { k: Math.max(0, total), prog: 1, moving: false, done: true, step: Math.max(0, total) }, START = { k: 0, prog: 0, moving: false, done: false, step: 0 };\n  let lastState = IDLE ? START : FINAL;\n  function stateAt(ms) { if (total <= 0) return FINAL; const t = ms - START_HOLD; if (t < 0) return START; if (reduce) { const idx = Math.floor(t / 650) + 1; return idx >= total ? FINAL : { k: idx, prog: 1, moving: false, done: false, step: idx }; } const per = MOVE_MS + HOLD_MS, k = Math.floor(t / per); if (k >= total) return FINAL; const inK = t - k * per; if (inK < MOVE_MS) return { k, prog: ease(inK / MOVE_MS), moving: true, done: false, step: k + 1 }; return { k: k + 1, prog: 1, moving: false, done: false, step: k + 1 }; }\n  function draw(st, now = performance.now()) {\n    lastState = st;\n    const reached = Math.min(st.k, total);\n    const bx = st.moving ? POINTS[st.k].x + (POINTS[st.k + 1].x - POINTS[st.k].x) * st.prog : POINTS[reached].x;\n    updateCamera(st, bx, now);\n    ctx.clearRect(0, 0, W, H); ctx.textBaseline = 'middle';\n    const xTicks = Math.max(4, Math.floor(pw / 56)), xStep = niceStep(2 * xLim / xTicks), yStep = niceStep(yMax / 5);\n    ctx.font = '12px \"Noto Sans KR\",sans-serif'; ctx.lineWidth = 1;\n    for (let y = 0; y <= yMax + 1e-9; y += yStep) { const yy = Y(y); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(M.l, yy); ctx.lineTo(M.l + pw, yy); ctx.stroke(); ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.fillText(fmt(y), M.l - 8, yy); }\n    for (let x = Math.ceil(-xLim / xStep) * xStep; x <= xLim + 1e-9; x += xStep) { const xx = X(x); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(xx, M.t); ctx.lineTo(xx, M.t + ph); ctx.stroke(); ctx.fillStyle = C.muted; ctx.textAlign = 'center'; ctx.fillText(fmt(Math.abs(x) < 1e-9 ? 0 : x), xx, M.t + ph + 16); }\n    ctx.fillStyle = C.ink; ctx.font = '700 12.5px \"Noto Sans KR\",sans-serif'; ctx.textAlign = 'center'; ctx.fillText('공의 위치 x', M.l + pw / 2, H - 10); ctx.save(); ctx.translate(13, M.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('함숫값 y = x²', 0, 0); ctx.restore();\n    ctx.save(); ctx.beginPath(); ctx.rect(M.l, M.t, pw, ph); ctx.clip();\n    ctx.beginPath(); curveTo(-xLim, xLim); ctx.lineTo(X(xLim), M.t - 4); ctx.lineTo(X(-xLim), M.t - 4); ctx.closePath(); const g = ctx.createLinearGradient(0, M.t, 0, M.t + ph); g.addColorStop(0, C.bowl + '.02)'); g.addColorStop(1, C.bowl + '.16)'); ctx.fillStyle = g; ctx.fill();\n    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(X(0), M.t); ctx.lineTo(X(0), M.t + ph); ctx.stroke(); ctx.beginPath(); ctx.moveTo(M.l, Y(0)); ctx.lineTo(M.l + pw, Y(0)); ctx.stroke();\n    ctx.beginPath(); curveTo(-xLim, xLim); ctx.strokeStyle = C.curve; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();\n    if (!IDLE) { ctx.strokeStyle = C.trail; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (let i = 0; i < reached; i++) { ctx.beginPath(); curveTo(POINTS[i].x, POINTS[i + 1].x); ctx.stroke(); } if (st.moving) { ctx.beginPath(); curveTo(POINTS[st.k].x, bx); ctx.stroke(); } }\n    const gx = X(0), gy = Y(0); star(gx, gy, 11, 5); ctx.fillStyle = C.gold; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = C.goldDark; ctx.stroke(); ctx.restore();\n    if (!IDLE) { let lastLabel = null; for (let i = 0; i <= reached; i++) { const px = X(POINTS[i].x), py = Y(POINTS[i].y); if (px < M.l - 2 || px > M.l + pw + 2 || py < M.t - 2 || py > M.t + ph + 2) continue; ctx.beginPath(); ctx.arc(px, py, i === 0 ? 6.5 : 5.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2.6; ctx.strokeStyle = C.trail; ctx.stroke(); if (i > 0 && (!lastLabel || Math.hypot(px - lastLabel[0], py - lastLabel[1]) > 22)) { const ly = py - 17 < M.t + 8 ? py + 17 : py - 17; ctx.beginPath(); ctx.arc(px, ly, 9, 0, Math.PI * 2); ctx.fillStyle = C.trailDark; ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 11px \"Noto Sans KR\",sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(i), px, ly + .5); lastLabel = [px, ly]; } } }\n    const sx = X(POINTS[0].x), sy = Y(POINTS[0].y); if (!(lastState.k === 0 && !lastState.moving)) pill('시작', (sx + 26 + 22 > W ? sx - 26 : sx + 26), Math.max(M.t + 12, sy - 4), '#0B6B84', '#E5F6FD', '#B5E0F0'); pill('목표', gx + 28, gy - 22, '#8A5A00', '#FFF6DC', '#EBC565');\n    const ballX = X(bx), ballY = Y(bx * bx); if (ballX > M.l - 14 && ballX < M.l + pw + 14 && ballY > M.t - 14 && ballY < M.t + ph + 14) { if (IDLE || (lastState.k === 0 && !lastState.moving)) { ctx.beginPath(); ctx.arc(ballX, ballY, 20, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(56,213,232,.65)'; ctx.lineWidth = 3; ctx.stroke(); } ball(ballX, ballY, 12.5); } else { const ex = Math.min(Math.max(ballX, M.l + 12), M.l + pw - 12), ey = Math.min(Math.max(ballY, M.t + 12), M.t + ph - 12); ball(ex, ey, 11); }\n  }\n  // 그래프 직접 확대·축소: 사용자가 조작하면 자동 카메라를 잠시 멈춥니다.\n  function zoom(factor, px = M.l + pw / 2, py = M.t + ph / 2) {\n    if (!W || !H) return;\n    const next = Math.min(100000000, Math.max(0.0001, xLim * factor));\n    if (next === xLim) return;\n    const pivotX = unX(px), pivotY = unY(py), u = (px - M.l) / Math.max(pw, 1), v = (py - M.t) / Math.max(ph, 1);\n    manualCamera = true; cameraTransition = null;\n    xLim = next; yMax = Math.max(0.000001, Math.min(1e18, yMax * factor)); yMin = -Math.max(yMax * .055, 1e-9);\n    cameraCenterX = pivotX - (u - .5) * 2 * xLim;\n    cameraOffsetY = pivotY - yMin - (1 - v) * (yMax - yMin);\n    draw(lastState);\n  }\n  function restoreView() {\n    resetCamera(); cameraEnabled = !IDLE;\n    draw(lastState);\n  }\n  $('zoomIn').addEventListener('click', () => zoom(.72));\n  $('zoomOut').addEventListener('click', () => zoom(1.4));\n  $('zoomReset').addEventListener('click', restoreView);\n  cv.addEventListener('wheel', function (ev) {\n    // 일반 휠은 페이지 스크롤에 양보합니다. Ctrl/Alt+휠일 때만 그래프를 확대해요.\n    if (!(ev.ctrlKey || ev.altKey)) {\n      ev.preventDefault();\n      // srcdoc 내부에서 휠이 갇히지 않도록 상위 페이지에 스크롤을 전달해요.\n      try { parent.postMessage({type:'gd-game-scroll',dy:ev.deltaY * (ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? innerHeight : 1)}, '*'); } catch (e) {}\n      return;\n    }\n    ev.preventDefault();\n    const r = cv.getBoundingClientRect(); zoom(ev.deltaY > 0 ? 1.14 : 1 / 1.14, ev.clientX - r.left, ev.clientY - r.top);\n  }, { passive: false });\n  const fingers = new Map(); let dragged = false;\n  function pp(ev) { const r = cv.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }\n  function pinch() { const a = [...fingers.values()]; return a.length < 2 ? null : {\n    x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2,\n    dist: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y)\n  }; }\n  cv.addEventListener('pointerdown', function (ev) {\n    if (ev.pointerType === 'mouse' && ev.button !== 0) return;\n    fingers.set(ev.pointerId, pp(ev));\n    if (fingers.size > 1) dragged = true;\n    cv.classList.add('dragging');\n    try { cv.setPointerCapture(ev.pointerId); } catch (e) {}\n  });\n  cv.addEventListener('pointermove', function (ev) {\n    if (!fingers.has(ev.pointerId)) return;\n    const before = pinch(), old = fingers.get(ev.pointerId), next = pp(ev);\n    fingers.set(ev.pointerId, next);\n    const after = pinch();\n    if (before && after && before.dist > 2 && after.dist > 2) {\n      zoom(before.dist / after.dist, after.x, after.y);\n      dragged = true;\n    }\n    const dx = next.x - old.x, dy = next.y - old.y;\n    if (Math.hypot(dx, dy) > 1 || dragged) {\n      manualCamera = true; cameraTransition = null;\n      cameraCenterX -= dx * 2 * xLim / Math.max(pw, 1);\n      cameraOffsetY += dy * (yMax - yMin) / Math.max(ph, 1);\n      dragged = true; draw(lastState);\n    }\n  });\n  function release(ev) { fingers.delete(ev.pointerId); if (!fingers.size) { cv.classList.remove('dragging'); dragged = false; } }\n  cv.addEventListener('pointerup', release);\n  cv.addEventListener('pointercancel', release);\n  cv.addEventListener('lostpointercapture', release);\n  let signaled = false;\n  function signalFinished() { if (IDLE || signaled) return; signaled = true; try { const doc = window.parent.document; doc.documentElement.dataset.gdExperimentFinishedAttempt = String(ATTEMPT); doc.dispatchEvent(new window.parent.CustomEvent('gd-experiment-animation-finished', { detail: { attemptId: ATTEMPT } })); } catch (e) { try { window.parent.postMessage({ type: 'gd-experiment-animation-finished', attemptId: ATTEMPT }, '*'); } catch (err) {} } }\n  let startedSignaled = false;\n  function signalStarted() { if (IDLE || startedSignaled) return; startedSignaled = true; try { const doc = window.parent.document; doc.documentElement.dataset.gdExperimentStartedAttempt = String(ATTEMPT); doc.dispatchEvent(new window.parent.CustomEvent('gd-experiment-animation-started', { detail: { attemptId: ATTEMPT } })); } catch (e) { try { window.parent.postMessage({ type: 'gd-experiment-animation-started', attemptId: ATTEMPT }, '*'); } catch (err) {} } }\n  let shownPhase = '';\n  function setPhase(phase) { if (phase === shownPhase) return; shownPhase = phase; statusEl.classList.toggle('done', phase === 'done'); statusText.textContent = phase === 'idle' ? '준비 완료' : phase === 'play' ? '공이 굴러가는 중…' : '이동 완료'; actBtn.hidden = (IDLE || total <= 0); actBtn.textContent = phase === 'done' ? '↻ 다시 보기' : '⏭ 건너뛰기'; actBtn.setAttribute('aria-label', phase === 'done' ? '애니메이션 다시 보기' : '애니메이션 건너뛰기'); }\n  function updateUI(st) { stepChip.textContent = IDLE ? ('시작 위치 x = ' + POINTS[0].x) : ('이동 ' + st.step + ' / ' + total); }\n  let raf = 0, t0 = null, playing = false, lastTs = 0, elapsed = 0;\n  function settleCamera(ts) {\n    draw(FINAL, ts);\n    const finalX = POINTS[total].x;\n    const finalOutside = Math.abs(finalX) > xLim * 0.82 || finalX * finalX > yMax * 0.82;\n    if (cameraTransition || finalOutside) raf = requestAnimationFrame(settleCamera);\n    else raf = 0;\n  }\n  function loop(ts) {\n    if (t0 === null) { t0 = ts; lastTs = ts; elapsed = 0; }\n    elapsed += Math.min(ts - lastTs, 100); lastTs = ts;\n    const st = stateAt(elapsed);\n    draw(st, ts); updateUI(st);\n    if (st.done) { finish(ts); return; }\n    raf = requestAnimationFrame(loop);\n  }\n  function play() {\n    cancelAnimationFrame(raf);\n    resetCamera(); cameraEnabled = true;\n    t0 = null; playing = true; signalStarted(); setPhase('play');\n    draw(START, performance.now());\n    raf = requestAnimationFrame(loop);\n  }\n  function finish(ts = performance.now()) {\n    cancelAnimationFrame(raf); playing = false;\n    draw(FINAL, ts); updateUI(FINAL); setPhase('done'); signalFinished();\n    if (cameraTransition) raf = requestAnimationFrame(settleCamera);\n    else raf = 0;\n  }\n  actBtn.addEventListener('click', () => { if (playing) finish(); else play(); });\n  function init() { resize(); if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(plot); else window.addEventListener('resize', resize); if (IDLE) { $('empty').hidden = false; setPhase('idle'); updateUI(START); draw(START); return; } if (total <= 0) { finish(); return; } updateUI(START); draw(START); play(); }\n  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!playing) draw(lastState); });\n  init();\n})();\n</script></body></html>\n";
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/modes/gameEffects.js === */
/* 게임모드 특수효과(토스트·폭죽·번개·폭발·거북이·지그재그·핑퐁): 이전 버전의 코드를 그대로 가져왔어요. */

function gdToast(doc, text, kind) {
  try {
    if (!doc) return;
    if (!doc.getElementById('gd-toast-style')) {
      const st = doc.createElement('style'); st.id = 'gd-toast-style';
      st.textContent = '#gd-toast{position:fixed;top:18px;left:18px;z-index:2147483647;display:flex;align-items:center;gap:12px;max-width:min(440px,calc(100vw - 36px));box-sizing:border-box;padding:12px 10px 12px 14px;background:#fff;color:#142B4A;border:1px solid #CFE0EE;border-left:5px solid #38D5E8;border-radius:14px;box-shadow:0 10px 30px rgba(20,43,74,.18);font:600 15px/1.45 "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;opacity:0;transform:translateY(-8px);transition:opacity .2s ease,transform .2s ease}'
        + '#gd-toast.show{opacity:1;transform:none}'
        + '#gd-toast .gd-toast-ic{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#E4F8FC;color:#0B7A8F}'
        + '#gd-toast .gd-toast-x{flex:none;width:40px;height:40px;border:0;border-radius:10px;background:transparent;color:#586A82;cursor:pointer;display:grid;place-items:center}'
        + '#gd-toast .gd-toast-x:hover{background:#EEF4FA}'
        + '@media (prefers-reduced-motion:reduce){#gd-toast{transition:none}}';
      doc.head.appendChild(st);
    }
    const old = doc.getElementById('gd-toast'); if (old) old.remove();
    const svg = function (p) { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    const ic = kind === 'gift'
      ? svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>')
      : svg('<path d="M20 6 9 17l-5-5"/>');
    const t = doc.createElement('div');
    t.id = 'gd-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
    t.innerHTML = '<span class="gd-toast-ic">' + ic + '</span><span class="gd-toast-msg"></span><button type="button" class="gd-toast-x" aria-label="알림 닫기">' + svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>') + '</button>';
    t.querySelector('.gd-toast-msg').textContent = text;
    const closeButton = t.querySelector('.gd-toast-x');
    const dismissToast = function (ev) {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); if (ev.stopImmediatePropagation) ev.stopImmediatePropagation(); }
      if (t.isConnected) t.remove();
    };
    // Pointerdown handles touch and mouse immediately; click remains as a fallback.
    closeButton.addEventListener('pointerdown', dismissToast, true);
    closeButton.addEventListener('click', dismissToast, true);
    closeButton.onclick = dismissToast;
    doc.body.appendChild(t);
    requestAnimationFrame(function () { if (t.isConnected) t.classList.add('show'); });
    setTimeout(function () { if (t.isConnected) { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 240); } }, 7600);
  } catch (e) {}
}


function gdFireworks(win, opts) {
  try {
    opts = opts || {};
    if (win.document.body.classList.contains('gd-game-reduced-motion')) return;
    const doc = win.document;
    const old = doc.getElementById('gd-fireworks'); if (old) old.remove();
    const root = doc.createElement('div');
    root.id = 'gd-fireworks'; root.setAttribute('aria-hidden', 'true');
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483100;pointer-events:none;overflow:hidden;background:transparent';
    const canvas = doc.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    root.appendChild(canvas);
    if (opts.label) {
      const l = doc.createElement('div');
      l.textContent = opts.label;
      l.style.cssText = 'position:absolute;left:50%;bottom:11%;transform:translateX(-50%);padding:10px 22px;border-radius:999px;background:rgba(255,255,255,.96);color:#142B4A;border:2px solid #38D5E8;box-shadow:0 10px 30px rgba(20,43,74,.22);font:800 clamp(16px,2.6vw,24px)/1.3 "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;white-space:nowrap;max-width:92vw';
      root.appendChild(l);
    }
    doc.body.appendChild(root);
    const ctx = canvas.getContext('2d');
    const dpr = win.devicePixelRatio || 1;
    const big = !!opts.big, mini = !!opts.mini;
    // 기존보다 짧게 재생: 큰 폭죽 150프레임, 미니 65프레임
    const maxFrames = opts.frames || (mini ? 65 : big ? 150 : 100);
    let w = 0, h = 0, frame = 0;
    function resize() {
      w = win.innerWidth; h = win.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const colors = opts.colors || ['#38D5E8', '#1769AA', '#F4B400', '#FF7DA8', '#6FD3A0', '#9B8CFF', '#FF8A5C'];
    const rockets = [], sparks = [];
    function launch() {
      if (opts.center) {
        const ang = Math.random() * Math.PI * 2, rad = Math.min(w, h) * (.18 + Math.random() * .30);
        rockets.push({ x: w / 2, y: h * .46, tx: w / 2 + Math.cos(ang) * rad * 1.5, ty: h * .46 + Math.sin(ang) * rad, color: colors[Math.floor(Math.random() * colors.length)] });
        return;
      }
      const side = Math.random() < .58;
      rockets.push({
        x: side ? (Math.random() < .5 ? -8 : w + 8) : w * Math.random(),
        y: side ? h * (.55 + Math.random() * .35) : h + 8,
        tx: w * (.08 + Math.random() * .84), ty: h * (.10 + Math.random() * .50),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    function burst(r) {
      // 폭죽 하나당 입자 수도 줄임
      const n = mini ? 18 + Math.floor(Math.random() * 8) : (big ? 42 : 32) + Math.floor(Math.random() * 18);
      for (let i = 0; i < n; i++) {
        const a = Math.PI * 2 * i / n, s = 1.2 + Math.random() * (mini ? 2.6 : big ? 3.8 : 3.2);
        sparks.push({
          x: r.x, y: r.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 34 + Math.random() * 34, color: r.color,
          size: (mini ? 1.1 : big ? 1.6 : 1.3) + Math.random() * (mini ? 1.2 : big ? 2.0 : 1.7)
        });
      }
    }
    function draw() {
      if (!root.isConnected) return;
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = mini ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.20)'; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over';
      // 발사 빈도를 낮춰 화면을 가득 채우지 않음
      if (big) { if (frame % 8 === 0) launch(); }
      else if (mini) { if (frame % 30 === 0) launch(); }
      else if (frame % 22 === 0) { launch(); }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i], dx = r.tx - r.x, dy = r.ty - r.y;
        if (Math.hypot(dx, dy) < 10) { burst(r); rockets.splice(i, 1); continue; }
        r.x += dx * .075; r.y += dy * .075;
        ctx.fillStyle = r.color; ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += .034; p.vx *= .992; p.life--;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, p.life / 17); ctx.fillStyle = p.color;
        // 강한 번짐 대신 작은 glow만 적용
        if (big) { ctx.shadowColor = p.color; ctx.shadowBlur = 4; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1; frame++;
      if (frame < maxFrames) win.requestAnimationFrame(draw);
      else { if (root.isConnected) root.remove(); win.removeEventListener('resize', resize); }
    }
    win.addEventListener('resize', resize);
    // 시작할 때 화면 전체에 동시에 많이 발사하지 않음
    for (let i = 0; i < (mini ? 1 : big ? 4 : 2); i++) launch();
    win.requestAnimationFrame(draw);
    win.setTimeout(function () { if (root.isConnected) root.remove(); win.removeEventListener('resize', resize); }, Math.round(maxFrames / 60 * 1000) + 1200);
  } catch (e) {}
}


function gdFailureEffect(win, mode) {
  try {
    const doc = win.document;
    const lingeringFireworks = doc.getElementById('gd-fireworks');
    if (lingeringFireworks) lingeringFireworks.remove();
    if (win.document.body.classList.contains('gd-game-reduced-motion')) return;
    const isExplode = mode === 'explode';
    const styleId = 'gd-failure-effect-style';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style'); style.id = styleId;
      style.textContent = '@keyframes gdScreenShake{0%,100%{transform:translate3d(0,0,0)}20%{transform:translate3d(-5px,2px,0)}40%{transform:translate3d(4px,-2px,0)}60%{transform:translate3d(-3px,1px,0)}80%{transform:translate3d(3px,0,0)}}'
        + '@keyframes gdHardShake{0%,100%{transform:translate3d(0,0,0)}12%{transform:translate3d(-10px,4px,0) rotate(-.15deg)}25%{transform:translate3d(9px,-4px,0) rotate(.15deg)}38%{transform:translate3d(-8px,3px,0)}51%{transform:translate3d(8px,-3px,0)}64%{transform:translate3d(-5px,2px,0)}78%{transform:translate3d(4px,-2px,0)}}'
        + '.gd-screen-shaking{animation:gdScreenShake .075s ease-in-out 0s 6!important}.gd-screen-shaking-hard{animation:gdHardShake .06s ease-in-out 0s 9!important}'
        + '@keyframes gdFlashFlight{0%{opacity:0;transform:translate3d(0,0,0) rotate(var(--angle,-18deg)) scaleX(.15)}10%{opacity:1}48%{opacity:.9}100%{opacity:0;transform:translate3d(var(--dx,35vw),var(--dy,-20vh),0) rotate(var(--angle,-18deg)) scaleX(1.3)}}'
        + '.gd-flash-layer{position:fixed;inset:0;z-index:2147483100;overflow:hidden;pointer-events:none}'
        + '.gd-flash-streak{position:absolute;width:clamp(130px,24vw,340px);height:4px;border-radius:999px;opacity:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),#fff,rgba(255,190,130,.98),transparent);box-shadow:0 0 7px rgba(255,255,255,.95),0 0 18px rgba(255,90,50,.9),0 0 34px rgba(255,36,25,.5);transform-origin:center;animation:gdFlashFlight .68s cubic-bezier(.2,.8,.2,1) var(--delay,0s) both}'
        + '.gd-explode-streak{height:5px;background:linear-gradient(90deg,transparent,#FFF4BF,#fff,rgba(255,55,34,1),transparent);box-shadow:0 0 10px #fff,0 0 23px rgba(255,65,38,1),0 0 42px rgba(255,20,12,.75);animation-duration:.58s!important}'
        + '.gd-flash-streak:after{content:"";position:absolute;left:20%;top:-5px;width:55%;height:13px;border-radius:999px;background:rgba(255,255,255,.86);filter:blur(6px)}'
        + '@keyframes gdImpactFlash{0%,100%{opacity:0}7%{opacity:.8}15%{opacity:.08}25%{opacity:.62}34%{opacity:.06}43%{opacity:.25}58%{opacity:0}}'
        + '@keyframes gdShockRing{0%{transform:translate(-50%,-50%) scale(.08);opacity:.95;border-width:9px}65%{opacity:.6}100%{transform:translate(-50%,-50%) scale(2.7);opacity:0;border-width:1px}}'
        + '@keyframes gdDebris{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.35)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.08)}}'
        + '.gd-explosion-impact{position:fixed;inset:0;z-index:2147483101;overflow:hidden;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle at 50% 46%,rgba(255,250,220,.4),rgba(255,75,24,.18) 24%,transparent 67%);animation:gdImpactFlash .82s steps(1,end) 1 both}'
        + '.gd-shock-ring{position:absolute;left:50%;top:46%;width:min(48vw,520px);aspect-ratio:1;border:5px solid rgba(255,228,158,.95);border-radius:50%;box-shadow:0 0 22px rgba(255,110,30,.95),inset 0 0 18px rgba(255,70,22,.65);animation:gdShockRing .95s cubic-bezier(.1,.65,.2,1) var(--delay,0s) both}'
        + '.gd-debris{position:absolute;left:50%;top:46%;width:clamp(5px,.7vw,10px);height:clamp(14px,1.6vw,24px);border-radius:2px;background:linear-gradient(#fff6bf,#ff3f25);box-shadow:0 0 12px rgba(255,85,22,.95);animation:gdDebris .9s cubic-bezier(.1,.7,.2,1) var(--delay,0s) both}'
        ;
      doc.head.appendChild(style);
    }
    const stage = doc.querySelector('.game-view') || doc.body;
    stage.classList.remove('gd-screen-shaking', 'gd-screen-shaking-hard');
    void stage.offsetWidth;
    stage.classList.add(isExplode ? 'gd-screen-shaking-hard' : 'gd-screen-shaking');
    win.setTimeout(function () { stage.classList.remove('gd-screen-shaking', 'gd-screen-shaking-hard'); }, isExplode ? 1100 : 650);

    ['gd-failure-flashes', 'gd-explosion-impact'].forEach(function (id) { const old = doc.getElementById(id); if (old) old.remove(); });
    const layer = doc.createElement('div'); layer.id = 'gd-failure-flashes'; layer.className = 'gd-flash-layer';
    layer.setAttribute('aria-hidden', 'true');
    const count = isExplode ? 26 : 12;
    for (let i = 0; i < count; i++) {
      const streak = doc.createElement('span');
      streak.className = 'gd-flash-streak' + (isExplode ? ' gd-explode-streak' : '');
      streak.style.left = (-12 + Math.random() * 105) + 'vw';
      streak.style.top = (5 + Math.random() * 90) + 'vh';
      streak.style.setProperty('--dx', (-24 + Math.random() * 48) + 'vw');
      streak.style.setProperty('--dy', (-34 + Math.random() * 68) + 'vh');
      streak.style.setProperty('--angle', (-48 + Math.random() * 96) + 'deg');
      streak.style.setProperty('--delay', (i * (isExplode ? .024 : .055)) + 's');
      layer.appendChild(streak);
    }
    doc.body.appendChild(layer);
    if (isExplode) {
      const impact = doc.createElement('div'); impact.id = 'gd-explosion-impact'; impact.className = 'gd-explosion-impact'; impact.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 3; i++) { const ring = doc.createElement('span'); ring.className = 'gd-shock-ring'; ring.style.setProperty('--delay', (i * .11) + 's'); impact.appendChild(ring); }
      for (let i = 0; i < 32; i++) { const debris = doc.createElement('span'); debris.className = 'gd-debris'; const angle = (Math.PI * 2 * i / 32) + (Math.random() - .5) * .18; const distance = 22 + Math.random() * 42; debris.style.setProperty('--dx', (Math.cos(angle) * distance) + 'vw'); debris.style.setProperty('--dy', (Math.sin(angle) * distance) + 'vh'); debris.style.setProperty('--rot', (Math.random() * 800 - 400) + 'deg'); debris.style.setProperty('--delay', (Math.random() * .14) + 's'); impact.appendChild(debris); }
      doc.body.appendChild(impact);
      win.setTimeout(function () { if (impact.isConnected) impact.remove(); }, 1900);
    }
    win.setTimeout(function () { if (layer.isConnected) layer.remove(); }, isExplode ? 1900 : 1500);
  } catch (e) {}
}
function gdZigzagEffect(win) {
  try {
    const doc = win.document;
    const old = doc.getElementById('gd-zigzag-effect'); if (old) old.remove();
    const oldFlash = doc.getElementById('gd-electric-flash'); if (oldFlash) oldFlash.remove();
    if (win.document.body.classList.contains('gd-game-reduced-motion')) return;
    const styleId = 'gd-zigzag-effect-style';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style'); style.id = styleId;
      style.textContent = '@keyframes gdBoltReveal{0%{opacity:0;transform:scale(.72) rotate(var(--rot,0deg))}10%{opacity:1}24%{opacity:.45}32%{opacity:1}48%{opacity:.9}100%{opacity:0;transform:scale(1.12) rotate(var(--rot,0deg))}}'
        + '@keyframes gdBoltDraw{to{stroke-dashoffset:0}}'
        + '@keyframes gdElectricPulse{0%,100%{opacity:0}10%{opacity:.28}18%{opacity:.03}27%{opacity:.24}35%{opacity:.02}50%{opacity:.10}65%{opacity:0}}'
        + '.gd-zigzag-layer{position:fixed;inset:0;z-index:2147483100;overflow:hidden;pointer-events:none;background:radial-gradient(ellipse at 50% 42%,rgba(25,92,255,.13),rgba(8,12,42,.08) 55%,transparent 80%)}'
        + '.gd-zigzag-bolt{position:absolute;width:clamp(62px,9vw,116px);height:clamp(132px,28vh,250px);animation:gdBoltReveal 1.42s steps(1,end) var(--delay,0s) both;filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 10px rgba(62,160,255,.98)) drop-shadow(0 0 24px rgba(42,75,255,.75))}'
        + '.gd-zigzag-bolt .gd-bolt-main{fill:rgba(93,174,255,.22);stroke:#E8FAFF;stroke-width:3.2;stroke-linejoin:bevel;stroke-dasharray:1;stroke-dashoffset:1;animation:gdBoltDraw .35s ease-out var(--delay,0s) forwards}'
        + '.gd-zigzag-bolt .gd-bolt-branch{fill:none;stroke:#79F5FF;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:bevel;stroke-dasharray:1;stroke-dashoffset:1;animation:gdBoltDraw .3s ease-out var(--delay,0s) forwards}'
        + '.gd-electric-flash{position:fixed;inset:0;z-index:2147483099;pointer-events:none;background:linear-gradient(118deg,rgba(92,210,255,.22),rgba(74,65,255,.12),rgba(255,255,255,.06));mix-blend-mode:screen;animation:gdElectricPulse .78s steps(1,end) 1 both}'
        ;
      doc.head.appendChild(style);
    }
    const flash = doc.createElement('div'); flash.id = 'gd-electric-flash'; flash.className = 'gd-electric-flash'; flash.setAttribute('aria-hidden', 'true'); doc.body.appendChild(flash);
    const layer = doc.createElement('div'); layer.id = 'gd-zigzag-effect'; layer.className = 'gd-zigzag-layer'; layer.setAttribute('aria-hidden', 'true');
    const ns = 'http://www.w3.org/2000/svg';
    const mainPoints = 'M60 2 L36 47 L57 47 L23 96 L44 96 L12 151 L79 76 L54 76 L77 38 L55 38 Z';
    const branches = ['M36 47 L19 38 L9 49', 'M57 47 L76 58 L86 51', 'M44 96 L62 108 L69 99'];
    for (let i = 0; i < 9; i++) {
      const svg = doc.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 92 155'); svg.setAttribute('class', 'gd-zigzag-bolt');
      svg.style.left = (2 + i * 11.2 + Math.random() * 3) + 'vw';
      svg.style.top = (-4 + Math.random() * 62) + 'vh';
      svg.style.setProperty('--rot', (-23 + Math.random() * 46) + 'deg');
      svg.style.setProperty('--delay', (i * .075) + 's');
      const path = doc.createElementNS(ns, 'path'); path.setAttribute('d', mainPoints); path.setAttribute('pathLength', '1'); path.setAttribute('class', 'gd-bolt-main'); svg.appendChild(path);
      for (let b = 0; b < 2; b++) { const branch = doc.createElementNS(ns, 'path'); branch.setAttribute('d', branches[(i + b) % branches.length]); branch.setAttribute('pathLength', '1'); branch.setAttribute('class', 'gd-bolt-branch'); branch.style.animationDelay = (i * .075 + .08 + b * .04) + 's'; svg.appendChild(branch); }
      layer.appendChild(svg);
    }
    doc.body.appendChild(layer);
    win.setTimeout(function () { if (layer.isConnected) layer.remove(); if (flash.isConnected) flash.remove(); }, 2200);
  } catch (e) {}
}
function gdPingPongEffect(win) {
  try {
    const doc = win.document;
    const old = doc.getElementById('gd-pingpong-effect'); if (old) old.remove();
    if (win.document.body.classList.contains('gd-game-reduced-motion')) return;
    const styleId = 'gd-pingpong-effect-style';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style'); style.id = styleId;
      style.textContent = '@keyframes gdBounceAcross{0%,100%{transform:translateX(-38vw);opacity:.9}50%{transform:translateX(38vw);opacity:1}}'
        + '.gd-pingpong-layer{position:fixed;inset:0;z-index:2147483100;overflow:hidden;pointer-events:none}'
        + '.gd-pingpong-track{position:absolute;left:0;top:49%;width:100vw;height:2px;background:linear-gradient(90deg,transparent,rgba(174,143,255,.4),rgba(105,215,255,.65),rgba(174,143,255,.4),transparent);box-shadow:0 0 18px rgba(147,119,255,.35)}'
        + '.gd-pingpong-runner{position:absolute;left:50%;top:-12px;width:25px;height:25px;margin-left:-12px;border-radius:50%;background:#fff;border:3px solid #BBA8FF;box-shadow:0 0 12px 4px rgba(153,126,255,.8),0 0 28px rgba(89,199,255,.55);animation:gdBounceAcross 1.05s cubic-bezier(.45,0,.55,1) var(--delay,0s) 5 both}'
        + '.gd-pingpong-marker{position:absolute;top:-43px;color:white;background:rgba(46,28,104,.82);padding:4px 10px;border-radius:12px;font-size:14px;font-weight:800;white-space:nowrap}.gd-pingpong-marker--left{left:11%}.gd-pingpong-marker--right{right:11%}'
        ;
      doc.head.appendChild(style);
    }
    const layer = doc.createElement('div'); layer.id = 'gd-pingpong-effect'; layer.className = 'gd-pingpong-layer';
    layer.setAttribute('aria-hidden', 'true');
    const track = doc.createElement('div'); track.className = 'gd-pingpong-track'; layer.appendChild(track);
    const left = doc.createElement('span'); left.className = 'gd-pingpong-marker gd-pingpong-marker--left'; left.textContent = 'x = −8'; track.appendChild(left);
    const right = doc.createElement('span'); right.className = 'gd-pingpong-marker gd-pingpong-marker--right'; right.textContent = 'x = +8'; track.appendChild(right);
    const runner = doc.createElement('span'); runner.className = 'gd-pingpong-runner'; track.appendChild(runner);
    doc.body.appendChild(layer);
    win.setTimeout(function () { if (layer.isConnected) layer.remove(); }, 5500);
  } catch (e) {}
}

function gdTurtleEffect(win) {
  try {
    const doc = win.document;
    const old = doc.getElementById('gd-turtle-effect'); if (old) old.remove();
    if (win.document.body.classList.contains('gd-game-reduced-motion')) return;
    const styleId = 'gd-turtle-effect-style';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style'); style.id = styleId;
      style.textContent = '@keyframes gdTurtleRing{0%{transform:translate(-50%,-50%) scale(.25);opacity:.65}100%{transform:translate(-50%,-50%) scale(1.7);opacity:0}}'
        + '@keyframes gdTurtleFloat{0%{transform:translate3d(0,18px,0) scale(.7) rotate(-12deg);opacity:0}18%{opacity:.75}100%{transform:translate3d(var(--dx,20vw),var(--dy,-18vh),0) scale(1.05) rotate(18deg);opacity:0}}'
        + '@keyframes gdTurtleCrawl{0%{transform:translate3d(0,0,0) rotate(-7deg) scale(.9)}8%{transform:translate3d(4vw,-5px,0) rotate(5deg) scale(1)}18%{transform:translate3d(10vw,2px,0) rotate(-6deg)}28%{transform:translate3d(18vw,-5px,0) rotate(6deg)}38%{transform:translate3d(27vw,2px,0) rotate(-5deg)}48%{transform:translate3d(38vw,-5px,0) rotate(5deg)}58%{transform:translate3d(50vw,2px,0) rotate(-5deg)}70%{transform:translate3d(65vw,-4px,0) rotate(5deg)}84%{transform:translate3d(84vw,2px,0) rotate(-3deg)}100%{transform:translate3d(calc(100vw + 22vw),-3px,0) rotate(4deg) scale(1)}}'
        + '@keyframes gdTurtleLegs{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}'
        + '.gd-turtle-extra{position:fixed;inset:0;z-index:2147483100;overflow:hidden;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(72,190,135,.19),transparent 50%)}'
        + '.gd-turtle-ring{position:absolute;left:50%;top:52%;width:min(64vw,500px);aspect-ratio:1;border:2px solid rgba(80,190,140,.43);border-radius:50%;box-shadow:0 0 24px rgba(80,208,150,.14);animation:gdTurtleRing 1.3s ease-out var(--delay,0s) both}'
        + '.gd-turtle-float{position:absolute;font-size:clamp(18px,2.8vw,30px);filter:drop-shadow(0 4px 9px rgba(31,122,77,.16));animation:gdTurtleFloat 1.8s ease-out var(--delay,0s) both}'
        + '.gd-turtle-crawler{position:absolute;left:-16vw;top:calc(50% - 42px);bottom:auto;font-size:clamp(54px,8vw,92px);line-height:1;white-space:nowrap;filter:drop-shadow(0 9px 12px rgba(20,74,52,.34));transform-origin:55% 80%;animation:gdTurtleCrawl 2.6s cubic-bezier(.35,.08,.2,1) .08s both}'
        + '.gd-turtle-crawler:after{content:"";position:absolute;left:6%;right:6%;bottom:-8px;height:9px;border-radius:50%;background:rgba(31,122,77,.17);filter:blur(4px);z-index:-1}'
        ;
      doc.head.appendChild(style);
    }
    const layer = doc.createElement('div'); layer.id = 'gd-turtle-effect'; layer.className = 'gd-turtle-extra';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const ring = doc.createElement('span'); ring.className = 'gd-turtle-ring';
      ring.style.setProperty('--delay', (i * .24) + 's'); layer.appendChild(ring);
    }
    // 메인 거북이는 화면 한쪽에서 반대편으로 느릿느릿 기어옵니다.
    const crawler = doc.createElement('span'); crawler.className = 'gd-turtle-crawler'; crawler.textContent = '🐢';
    layer.appendChild(crawler);
    const symbols = ['🍃', '✦', '◦', '🌿', '·', '🍃'];
    for (let i = 0; i < 6; i++) {
      const leaf = doc.createElement('span'); leaf.className = 'gd-turtle-float';
      leaf.textContent = symbols[i % symbols.length];
      leaf.style.left = (10 + Math.random() * 78) + 'vw';
      leaf.style.top = (13 + Math.random() * 65) + 'vh';
      leaf.style.setProperty('--dx', (-13 + Math.random() * 26) + 'vw');
      leaf.style.setProperty('--dy', (-10 + Math.random() * 20) + 'vh');
      leaf.style.setProperty('--delay', (i * .08) + 's');
      layer.appendChild(leaf);
    }
    doc.body.appendChild(layer);
    win.setTimeout(function () { if (layer.isConnected) layer.remove(); }, 4300);
  } catch (e) {}
}

/* === Original file: assets/js/ui/home.js === */
/* 첫 화면: 두 가지 모드 선택 + 실제 계산 엔진으로 움직이는 데모. */
(function (root) {
  'use strict';
  var GD = root.GD, U = GD.ui, timer = 0, graph = null, userPicked = false, alive = false;
  var ALPHAS = [0.3, 0.5, 0.8, 1.0, 1.5];

  function html() {
    return '<section class="home" aria-labelledby="homeTitle">' +
      '<div class="home-hero"><div>' +
        '<h1 id="homeTitle" tabindex="-1">공을 굴리며 경사하강법을 이해해요</h1>' +
        '<p class="home-lede">학습률을 바꾸면 공의 움직임이 달라져요.</p>' +
        '<div class="home-actions"><a class="c-btn c-btn--primary" href="#/game">게임모드로 시작</a><a class="c-btn" href="#/research">연구자모드 보기</a></div>' +
      '</div>' +
      '<div class="demo-card"><div class="demo-stage"><canvas id="demoCv" role="img" aria-label="공이 포물선을 따라 최솟값으로 굴러가는 미리보기"></canvas></div>' +
        '<div class="demo-foot"><p class="demo-read" id="demoRead" aria-live="polite"></p>' +
        '<div class="c-chips" role="group" aria-label="미리볼 학습률">' + ALPHAS.map(function (a) { return '<button class="c-chip" type="button" data-a="' + a + '" aria-pressed="false">α ' + a.toFixed(1) + '</button>'; }).join('') + '</div></div></div></div>' +
      '<div class="mode-grid">' +
        card('#/game', 'ball', '게임모드', '축구공을 굴리고 퀘스트를 깨며 XP를 모아요.', '게임 시작하기') +
        card('#/research', 'chart', '연구자모드', '2차·4차함수 6종을 골라 이동 경로와 Loss를 분석하고 학습률을 비교해요.', '분석하러 가기') +
      '</div>' +
      '<p class="home-foot">' + U.esc(GD.storage.notice()) + '</p></section>';
  }
  function card(href, ic, title, text, go) {
    return '<a class="mode-card" href="' + href + '"><span class="mode-icon">' + U.icon(ic, 26) + '</span><h2>' + title + '</h2><p>' + text + '</p><span class="go">' + go + ' →</span></a>';
  }

  function play(alpha, auto) {
    var fn = GD.functions.get('F01'), r = GD.engine.run(fn, { start: 8, alpha: alpha, maxIter: 6 }), a = GD.analyzer.analyze(r, fn);
    U.$$('.c-chip[data-a]').forEach(function (b) { b.setAttribute('aria-pressed', Number(b.dataset.a) === alpha ? 'true' : 'false'); });
    U.$('#demoRead').innerHTML = '학습률 α = <strong>' + alpha.toFixed(1) + '</strong> · ' + U.esc(a.label);
    graph.play(r, function () {
      if (!alive || userPicked || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
      timer = setTimeout(function () { var i = ALPHAS.indexOf(alpha); play(ALPHAS[(i + 1) % ALPHAS.length], true); }, 2600);
    });
  }

  GD.modes.home = {
    title: '경사하강법 시뮬레이터',
    mount: function (rootEl) {
      alive = true; userPicked = false; rootEl.innerHTML = html();
      graph = GD.viz.createFunctionGraph(U.$('#demoCv'), { compact: true });
      graph.setFunction(GD.functions.get('F01'));
      U.$$('.c-chip[data-a]').forEach(function (b) { b.addEventListener('click', function () { userPicked = true; clearTimeout(timer); play(Number(b.dataset.a), false); }); });
      play(0.8, true);
    },
    unmount: function () { alive = false; clearTimeout(timer); if (graph) graph.destroy(); graph = null; }
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/modes/gameMode.js === */
/* 게임모드: 이전 Streamlit 버전의 화면·퀘스트·효과를 그대로 옮겼어요.
   바뀐 점은 두 가지뿐이에요. 계산은 공통 엔진(F01 기본 포물선)을 쓰고, 기록·진행 상황은 LocalStorage 에 저장해요. */
(function (root) {
  'use strict';
  var GD = root.GD, U = GD.ui, esc = U.esc, fmtInt = U.fmtInt, fmtNum = U.fmtNum, icon = function (n, s) { return U.icon(n, s); };
  var START_X = 8.0, THRESH = 1e-5, TARGET_XP = 10000;
  var ANIM = { startHold: 350, move: 480, hold: 200 }, EFFECT_GAP = 450, EFFECT_MS = 5800;
  var FN = GD.functions.get('F01');

  var QUESTS = [
    { id: 'first_success', title: '첫 번째 착륙', desc: '공을 목표 지점에 성공적으로 착륙시켜라.', reward: 1000 },
    { id: 'slow', title: '거북이의 비밀', desc: '학습률을 낮춰 공이 천천히 접근하는 실험을 완료하라.', reward: 1300 },
    { id: 'one_step', title: '원샷 착륙', desc: '한 번의 실제 이동으로 목표에 도착하라.', reward: 3000 },
    { id: 'zigzag', title: '지그재그 탐정', desc: '목표를 넘나들며 점점 가까워지는 움직임을 관찰하라.', reward: 1500 },
    { id: 'pingpong', title: '무한 핑퐁 실험', desc: '공이 같은 거리로 왕복하는 움직임을 재현하라.', reward: 1300 },
    { id: 'diverge', title: '폭주 경보', desc: '공이 목표에서 점점 멀어지는 실험을 실행하라.', reward: 1900 }
  ];
  var QUEST_BY_ID = {}; QUESTS.forEach(function (q) { QUEST_BY_ID[q.id] = q; });

  /* ---------- 상태 ---------- */
  var DEFAULTS = { done: [], claimed: [], masterShown: false, introSeen: false, tipDismissed: false, motion: true, alpha: 0.8, epochs: 5 };
  var S, view, listeners, attemptId, lastResult, questNotice, pending, activeFx, openModalEl, lastFocus, frameKey;

  function loadState() { var g = GD.storage.game(); S = Object.assign({}, DEFAULTS, g && typeof g === 'object' ? g : {}); }
  function save() { GD.storage.setGame(S); }
  function $(s) { return view.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(view.querySelectorAll(s)); }
  function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); }
  function currentXP() { return QUESTS.reduce(function (a, q) { return a + (S.claimed.indexOf(q.id) !== -1 ? q.reward : 0); }, 0); }
  function isMaster() { return QUESTS.every(function (q) { return S.done.indexOf(q.id) !== -1 && S.claimed.indexOf(q.id) !== -1; }); }
  function gameRecords() { return GD.records.list({ mode: 'game' }); }
  function nickname() { return GD.storage.prefs().nickname || '익명'; }

  /* ---------- 원본 규칙(학습률 기준 분류·점수) ---------- */
  function classify(alpha, fx, overflow) {
    if (overflow || !isFinite(fx) || alpha > 1) return ['우주폭발', 'explode'];
    if (Math.abs(alpha - 1) < 1e-8) return ['무한 핑퐁', 'pingpong'];
    if (Math.abs(fx) < THRESH) return ['착륙 성공', 'success'];
    if (alpha > 0.5) return ['지그재그 수렴 중', 'oscillating'];
    return ['아직 착륙 중', 'landing'];
  }
  function calcScore(fx, code) { return code === 'success' ? 100 : !isFinite(fx) ? 0 : Math.max(0, Math.min(99, Math.floor(99 * Math.exp(-Math.abs(fx) / 2)))); }

  /* ---------- 공용 조각 ---------- */
  function callout(kind, title, sub, ic) { return '<div class="callout callout-' + kind + '" role="status"><span class="co-ic">' + icon(ic || 'info', 18) + '</span><div><div class="co-t">' + title + '</div>' + (sub ? '<div class="co-s">' + sub + '</div>' : '') + '</div></div>'; }
  function xpBar(xp) { return '<div class="xp-bar" role="progressbar" aria-label="경험치 진행도" aria-valuemin="0" aria-valuemax="' + TARGET_XP + '" aria-valuenow="' + xp + '"><i style="width:' + Math.max(0, Math.min(100, xp / TARGET_XP * 100)).toFixed(1) + '%"></i></div>'; }
  var GI = { check: 'check', lock: 'lock', trophy: 'trophy', gift: 'gift', zap: 'zap', repeat: 'repeat', activity: 'activity', info: 'info', flask: 'flask', x: 'x' };
  var GPATHS = {
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>', check: '<path d="M20 6 9 17l-5-5"/>', repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', flask: '<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5l-5.1-10.1a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };
  icon = function (n, s) { s = s || 18; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (GPATHS[n] || '') + '</svg>'; };

  /* ---------- 화면 틀 ---------- */
  function layoutHTML() {
    return '<aside class="side" id="gameSide" aria-label="실험 설정"><h2>🎮 연구소 컨트롤러</h2>' +
      '<div class="field"><label for="gNick">연구원 닉네임</label><input type="text" id="gNick" maxlength="20" autocomplete="nickname" spellcheck="false"></div>' +
      '<div class="start-chip"><span class="sc-ic">' + icon('info', 20) + '</span><div><div class="sc-k">시작 위치</div><div class="sc-v">x = 8.0<small>(고정)</small></div></div></div>' +
      '<div class="field" style="margin-top:16px"><div class="lbl"><label for="gAlpha">학습률 α</label><span class="help-tip" tabindex="0" role="button" aria-label="도움말" data-tip="학습률이 높아질수록 축구공이 한 번에 더 많이 이동해요.">?</span></div>' +
      '<div class="rng" id="gAlphaRng"><output class="rng-val" id="gAlphaOut" for="gAlpha">0.80</output><input type="range" id="gAlpha" min="0.05" max="1.5" step="0.05" value="0.8" aria-describedby="gAlphaCap"></div>' +
      '<div class="range-ends" aria-hidden="true"><span>0.05</span><span>1.50</span></div><p class="caption" id="gAlphaCap">학습률이 높아질수록 축구공이 한 번에 더 많이 이동해요.</p></div>' +
      '<div class="field"><div class="lbl"><label for="gEpochs">최대 이동 횟수</label><span class="help-tip" tabindex="0" role="button" aria-label="도움말" data-tip="공이 최대 몇 번까지 이동할지 정해요. 목표에 도착하면 일찍 끝나요.">?</span></div>' +
      '<div class="rng" id="gEpochsRng"><output class="rng-val" id="gEpochsOut" for="gEpochs">5</output><input type="range" id="gEpochs" min="1" max="10" step="1" value="5"></div><div class="range-ends" aria-hidden="true"><span>1</span><span>10</span></div></div>' +
      '<label class="motion-setting" for="gMotion"><input type="checkbox" id="gMotion" checked><span><strong>모션·효과 전체 재생</strong><small>Windows에서도 그래프·폭죽·성공/실패 효과를 재생해요. 끄면 간소화돼요.</small></span></label>' +
      '<button class="btn btn-primary btn-block" id="gRunSide" type="button">⚽ 실험 실행</button></aside>' +
      '<div class="scrim" id="gScrim" hidden></div>' +
      '<main class="main" id="gameMain">' +
      '<header class="game-hero-head"><div class="gh-eyebrow">⚽ GRADIENT DESCENT LAB · GAME</div><h1>경사하강법 게임 연구소</h1><p>학습률 하나로 달라지는 공의 궤적을 실험하고, 퀘스트를 해결하며 수렴과 발산의 원리를 발견해요.</p></header><div id="gTip"></div><div id="gHud"></div><nav class="nav-row" aria-label="게임 메뉴"><button class="btn btn-primary btn-block" id="gQuestBtn" type="button" aria-haspopup="dialog">🧪 퀘스트</button></nav>' +
      '<div id="gBanner"></div>' +
      '<div class="mobile-run"><button class="btn btn-primary btn-block" id="gRunMobile" type="button">⚽ 실험 실행</button><p class="caption" id="gMobileCap" style="margin-top:.4rem"></p></div><hr>' +
      '<div class="work"><section aria-labelledby="gGraphH"><h3 class="sec-h3" id="gGraphH" tabindex="-1">🏔️ 공의 이동 경로</h3><iframe class="graph-frame" id="gFrame" title="공의 이동 경로 그래프" allow="fullscreen"></iframe><p class="caption" id="gGraphCap"></p><div id="gWarn" style="margin-top:.8rem"></div></section>' +
      '<section aria-labelledby="gResH"><h3 class="sec-h3" id="gResH">📟 이번 실험 결과</h3><div class="res-wrap" id="gResult"></div></section></div><hr>' +
      '<section class="records" aria-labelledby="gRecH"><h2 class="sec-h2" id="gRecH" style="margin-bottom:0">📒 내 개인 기록</h2><p class="caption" id="gRecNote"></p><div id="gRecBody" class="records"></div></section><hr>' +
      '<p class="caption page-foot">경사하강법 시뮬레이터 · 실험하고 발견하고 해금하세요!</p></main>' +
      '<div class="modal" id="gIntro" hidden role="dialog" aria-modal="true" aria-labelledby="gIntroT"><div class="modal-box"><div class="dlg-head"><h2 id="gIntroT">🔬 연구소 미션 브리핑</h2><button class="btn icon-btn" type="button" data-close aria-label="닫기">✕</button></div><div class="dlg-body"><div class="brief-emoji" aria-hidden="true">⚽ 🔎 📈</div><div class="brief">' +
      '<div class="brief-card"><span class="bc-n">1</span><div><div class="bc-t">한 번의 이동으로 최솟값에 도착하는 학습률을 찾아라!</div><div class="bc-s">학습률을 바꿔가며 공의 움직임을 관찰하고, 가장 알맞은 값을 직접 찾아보세요.</div></div></div>' +
      '<div class="brief-card"><span class="bc-n">2</span><div><div class="bc-t">여섯 개의 퀘스트를 완료하고 경사하강법 마스터가 되어라!</div><div class="bc-s">실험을 통해 미션을 완료하고 보상을 모아 연구소를 정복하세요.</div></div></div></div><button class="btn btn-primary btn-block" type="button" data-close>미션 시작하기 🚀</button></div></div></div>' +
      '<div class="modal" id="gQuest" hidden role="dialog" aria-modal="true" aria-labelledby="gQuestT"><div class="modal-box"><div class="dlg-head"><h2 id="gQuestT">🧪 퀘스트 센터</h2><button class="btn icon-btn" type="button" data-close aria-label="닫기">✕</button></div><div class="dlg-body" id="gQuestBody"></div></div></div>' +
      '<div class="modal" id="gMaster" hidden role="dialog" aria-modal="true" aria-labelledby="gMasterT"><div class="modal-box"><div class="dlg-head"><h2 id="gMasterT">🏆 경사하강법 마스터 달성!</h2><button class="btn icon-btn" type="button" data-close aria-label="닫기">✕</button></div><div class="dlg-body"><div class="master-dialog md-pending" id="gMasterCard"><div class="md-emoji" aria-hidden="true">🏆</div><div class="md-kicker">MASTER UNLOCKED</div><div class="md-title">경사하강법 마스터가 되었습니다!</div><p>퀘스트 6개 완료 · 모든 미션 클리어</p><div class="md-chip">+10,000 XP · MASTER RANK</div><div class="md-note">수렴과 발산의 규칙을 찾아냈어요.</div></div><button class="btn btn-block" type="button" data-close>닫기</button></div></div></div>';
  }

  /* ---------- 화면 갱신 ---------- */
  function renderBanner() {
    $('#gBanner').innerHTML = isMaster() ? '<section class="master-banner"><div class="mb-badge" aria-hidden="true">🏆</div><h2>경사하강법 마스터</h2><p>여섯 개의 퀘스트를 모두 완료하고, 움직임 연구를 마쳤습니다.</p><div class="mb-chip">ALL QUESTS COMPLETE · ' + fmtInt(TARGET_XP) + ' XP</div></section>' : '';
  }
  function renderTip() {
    // 첫 실험 안내는 제목 바로 아래에 늘 표시하고 닫기 버튼은 두지 않아요.
    $('#gTip').innerHTML = '<div class="gd-quick-tip game-intro-guide" role="note" aria-label="첫 실험 가이드">' +
      '<div class="qt-label">🔎 첫 실험 가이드</div><div class="qt-title">학습률을 바꾸고, 공이 어디로 가는지 살펴보세요.</div>' +
      '<div class="qt-copy"><strong>학습률 α</strong>는 한 번에 움직이는 크기, <strong>최대 이동 횟수</strong>는 공이 이동할 수 있는 횟수예요. 같은 시작점에서 α만 바꾸며 경로·Loss·결과를 비교해 보세요.</div>' +
      '<div class="qt-steps"><span>① 학습률·횟수 설정</span><span>② 실험 실행</span><span>③ 경로·결과 확인</span></div></div>';
  }
  function renderHUD() {
    var xp = currentXP(), doneN = QUESTS.filter(function (q) { return S.done.indexOf(q.id) !== -1; }).length, claimedN = QUESTS.filter(function (q) { return S.claimed.indexOf(q.id) !== -1; }).length;
    $('#gHud').innerHTML = '<section class="hud" aria-label="연구소 진행 현황"><div class="hud-top"><div class="hud-title">🏆 연구소 진행 현황</div><div class="hud-xp"><b>' + fmtInt(xp) + '</b> / ' + fmtInt(TARGET_XP) + ' XP</div></div>' + xpBar(xp) +
      '<div class="stat-grid"><div class="stat"><span class="st-ic">' + icon('check') + '</span><div><div class="st-k">완료한 퀘스트</div><div class="st-v">' + doneN + ' / ' + QUESTS.length + '</div></div></div><div class="stat"><span class="st-ic">' + icon('gift') + '</span><div><div class="st-k">수령한 보상</div><div class="st-v">' + claimedN + ' / ' + QUESTS.length + '</div></div></div></div></section>';
  }
  function renderResult() {
    var box = $('#gResult'), r = lastResult;
    if (!r) { box.innerHTML = callout('info', '아직 실험 기록이 없어요', '사이드바에서 설정하고 실험을 시작하세요.', 'flask'); $('#gWarn').innerHTML = ''; return; }
    var ui = { success: ['ok', '성공!', '최솟값에 도착했어요.', 'check'], explode: ['bad', '발산!', '공이 목표에서 멀어졌어요.', 'zap'], pingpong: ['warn', '왕복 반복', '거리가 줄지 않아요.', 'repeat'], oscillating: ['warn', '진동하며 수렴 중', '점점 가까워져요.', 'activity'], landing: ['info', '수렴 중', '이동 횟수를 늘려 보세요.', 'info'] }[r.code];
    box.innerHTML = callout(ui[0], ui[1], ui[2], ui[3]) + '<div class="res-score"><div class="lbl">🏅 점수</div><div class="val">' + r.score + '<small>/ 100</small></div><div class="xp-bar" role="progressbar" aria-label="점수" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + r.score + '"><i style="width:' + r.score + '%"></i></div></div>' +
      '<div class="res-rows"><div class="res-row"><span class="k">📍 최종 위치</span><span class="v">' + fmtNum(r.finalX) + '</span></div><div class="res-row"><span class="k">📉 최종 Loss</span><span class="v">' + fmtNum(r.finalLoss) + '</span></div><div class="res-row"><span class="k">🔁 실제 이동 횟수<small>목표에 도착하면 일찍 끝나요</small></span><span class="v">' + r.steps + '회</span></div></div>' +
      '<p class="res-note">최대 이동 횟수 ' + r.epochs + '회 · 성공 기준 |x| &lt; ' + THRESH.toFixed(5) + '</p>';
    $('#gWarn').innerHTML = Math.abs(r.finalX) > 12 ? callout('warn', '공이 시작점보다 훨씬 멀리 날아갔어요', '공이 멀어지면 실험 중 그래프 범위도 실시간으로 넓어져요. 정확한 위치는 오른쪽 결과에서 확인하세요.', 'zap') : '';
  }
  function scoreChart(recs) {
    var W = 640, H = 250, L = 44, R = 16, T = 14, B = 36, pw = W - L - R, ph = H - T - B, n = recs.length;
    function X(i) { return L + (n === 1 ? pw / 2 : i / (n - 1) * pw); } function Y(v) { return T + (1 - v / 100) * ph; }
    var g = ''; for (var v = 0; v <= 100; v += 25) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#E6EEF6"/><text x="' + (L - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="12" fill="#586A82">' + v + '</text>';
    var step = Math.max(1, Math.ceil(n / 10)); for (var i = 0; i < n; i += step) g += '<text x="' + X(i) + '" y="' + (H - 14) + '" text-anchor="middle" font-size="12" fill="#586A82">' + (i + 1) + '</text>';
    g += '<text x="' + (L + pw / 2) + '" y="' + (H - 1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#142B4A">도전 번호</text>';
    var pts = recs.map(function (r, k) { return X(k).toFixed(1) + ',' + Y(r.score).toFixed(1); }).join(' ');
    var dots = recs.map(function (r, k) { return '<circle cx="' + X(k).toFixed(1) + '" cy="' + Y(r.score).toFixed(1) + '" r="5" fill="#fff" stroke="#1769AA" stroke-width="2.5"><title>' + (k + 1) + '번째 도전 · α ' + Number(r.alpha).toFixed(2) + ' · ' + r.score + '점 · ' + esc(r.statusLabel) + '</title></circle>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="도전 번호별 점수 꺾은선 그래프. 최근 ' + recs[n - 1].score + '점"><desc>자세한 값은 위의 기록 표에서 확인할 수 있어요.</desc>' + g + '<polyline points="' + pts + '" fill="none" stroke="#1769AA" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' + dots + '</svg>';
  }
  function renderRecords() {
    var body = $('#gRecBody'), recs = gameRecords();
    $('#gRecNote').textContent = GD.storage.notice();
    if (!recs.length) { body.innerHTML = callout('info', '아직 개인 기록이 없어요', '실험을 실행하면 결과가 저장됩니다.', 'flask'); return; }
    var best = Math.max.apply(null, recs.map(function (r) { return r.score; })), wins = recs.filter(function (r) { return r.success; }).length;
    var rows = recs.slice().reverse().map(function (r) { return '<tr><td>' + esc(r.nickname) + '</td><td>' + Number(r.alpha).toFixed(2) + '</td><td>' + r.maxIter + '</td><td>' + r.iterations + '</td><td>' + fmtNum(r.finalX) + '</td><td>' + fmtNum(r.finalLoss) + '</td><td><span class="sbar"><i><b style="width:' + r.score + '%"></b></i>' + r.score + '</span></td><td>' + esc(r.statusLabel) + '</td></tr>'; }).join('');
    body.innerHTML = '<div class="stat-grid" style="margin-bottom:.4rem"><div class="stat"><span class="st-ic">' + icon('flask') + '</span><div><div class="st-k">총 플레이</div><div class="st-v">' + recs.length + '회</div></div></div><div class="stat"><span class="st-ic">' + icon('trophy') + '</span><div><div class="st-k">최고 점수</div><div class="st-v">' + best + '점</div></div></div><div class="stat"><span class="st-ic">' + icon('check') + '</span><div><div class="st-k">성공 횟수</div><div class="st-v">' + wins + '회</div></div></div></div>' +
      '<div class="table-wrap" tabindex="0" role="region" aria-label="실험 기록 표(스크롤 가능)"><table class="rec-table"><thead><tr><th scope="col">닉네임</th><th scope="col">학습률</th><th scope="col">최대 이동 횟수</th><th scope="col">실제 이동 횟수</th><th scope="col">최종 위치</th><th scope="col">최종 Loss</th><th scope="col">점수</th><th scope="col">결과</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<button class="btn btn-block" id="gCsv" type="button">📥 내 기록 CSV 다운로드</button><button class="btn btn-ghost" id="gReset" type="button" style="align-self:flex-start">기록과 퀘스트 진행 초기화</button>' +
      '<h3 class="sec-h3" style="margin:.6rem 0 0">도전할수록 점수가 어떻게 달라질까?</h3><div class="chart-card">' + scoreChart(recs) + '</div>';
    on($('#gCsv'), 'click', function () { GD.csv.download(gameRecords(), 'game_mode_records.csv'); });
    on($('#gReset'), 'click', resetAll);
  }
  function resetAll() {
    if (!root.confirm('이 브라우저에 저장된 게임모드 기록과 퀘스트·경험치 진행을 모두 지울까요?')) return;
    cancelPending(); closeEffect(true); GD.records.clear({ mode: 'game' }); GD.storage.clearGame(); loadState(); lastResult = null; frameKey = ''; applyControls();
    $('#gGraphCap').textContent = idleCap; renderGraph([START_X], 0, true); renderAll(); U.toast('처음 상태로 되돌렸어요.');
  }

  /* ---------- 그래프(원본 canvas 를 iframe 으로) ---------- */
  var idleCap = '공은 y = x² 곡선 위를 따라 이동하고, 멈춘 위치마다 번호가 남아요. 실험을 실행하면 자동으로 재생됩니다.';
  function renderGraph(xs, id, idle) {
    var points = xs.map(function (x) { return { x: x, y: x * x }; }), n = points.length - 1;
    var aria = idle ? '이차함수 y = x² 그래프입니다. 공이 x = ' + START_X + '에서 출발을 기다리고 있어요.' : '이차함수 y = x² 위에서 공이 x = ' + points[0].x + '에서 출발해 ' + n + '번 이동했고 최종 위치는 x = ' + Number(points[n].x.toPrecision(6)) + '입니다.';
    var sr = idle ? '실험을 실행하면 공이 곡선을 따라 목표 지점 x = 0으로 이동합니다.' : '이동 기록(x 좌표): ' + points.map(function (p) { return Number(p.x.toPrecision(4)); }).join(' → ');
    var key = idle ? 'idle' : 'run' + id; if (key === frameKey && idle) return; frameKey = key;
    function rep(s, a, b) { return s.split(a).join(b); }
    var page = GD.gameGraphHtml; page = rep(page, '__POINTS__', JSON.stringify(points)); page = rep(page, '__ATTEMPT__', String(id)); page = rep(page, '__IDLE__', idle ? 'true' : 'false');
    page = rep(page, '__MOVE_MS__', ANIM.move); page = rep(page, '__HOLD_MS__', ANIM.hold); page = rep(page, '__START_HOLD__', ANIM.startHold); page = rep(page, '__REDUCE_MOTION__', S.motion === false ? 'true' : 'false'); page = rep(page, '__ARIA__', esc(aria)); page = rep(page, '__SR__', esc(sr));
    $('#gFrame').srcdoc = page;
  }

  /* ---------- 특수효과(그래프 애니메이션이 끝난 뒤에만 시작) ---------- */
  function failureSpec(alpha) {
    function same(x) { return Object.assign({ label: '실험 결과: 착륙 실패', meta: '실험 상황 · 학습률 α=' + alpha }, x); }
    if (alpha > 0 && alpha < 0.5) return same({ kind: 'turtle', kicker: 'SLOW CONVERGENCE', hero: '🐢 ↘', head: '느리지만 수렴 중', copy: '작은 이동으로 최솟값에 가까워지고 있어요.', particles: [['🐢', '-34vw', '-28vh'], ['🫧', '34vw', '-22vh'], ['🍃', '-38vw', '20vh'], ['✦', '38vw', '22vh'], ['🌱', '-18vw', '34vh'], ['✨', '20vw', '-36vh']] });
    if (alpha > 0.5 && alpha < 1) return same({ kind: 'zigzag', kicker: 'OSCILLATING', hero: '⚡', head: '진동하며 수렴 중', copy: '최솟값을 넘나들며 점점 가까워져요.', particles: [['⚡', '-36vw', '-25vh'], ['✦', '35vw', '-30vh'], ['🔹', '-40vw', '18vh'], ['⚡', '39vw', '22vh'], ['✧', '-16vw', '35vh'], ['💠', '18vw', '-36vh']] });
    if (Math.abs(alpha - 1) < 1e-8) return same({ kind: 'pingpong', kicker: 'PERIODIC MOTION', hero: '↔', head: '같은 거리에서 왕복 중', copy: 'α=1에서는 거리가 줄지 않아요.', particles: [['↔', '-38vw', '-20vh'], ['◉', '36vw', '-25vh'], ['⟷', '-40vw', '20vh'], ['✦', '40vw', '24vh'], ['◌', '-18vw', '34vh'], ['✧', '20vw', '-35vh']] });
    if (alpha > 1) return same({ kind: 'explode', kicker: 'DIVERGENCE', hero: '💣 ↗️', head: '발산 중!', copy: '학습률을 낮춰 다시 시도해 보세요.', particles: [['💥', '-37vw', '-25vh'], ['⚠️', '36vw', '-28vh'], ['🔥', '-40vw', '20vh'], ['✹', '39vw', '22vh'], ['💢', '-18vw', '35vh'], ['⚡', '19vw', '-35vh'], ['✦', '0vw', '38vh']] });
    return same({ kind: 'failure', kicker: 'EXPERIMENT INCOMPLETE', hero: '!', head: '아직 도착하지 못했어요', copy: '학습률이나 이동 횟수를 조정해 보세요.', particles: [['✦', '-34vw', '-28vh'], ['!', '34vw', '-22vh'], ['⚡', '-38vw', '20vh'], ['✧', '38vw', '22vh']] });
  }
  function effectSpec(res) {
    if (res.code !== 'success') return failureSpec(res.alpha);
    if (res.alpha < 0.5) return { kind: 'turtle', label: '실험 결과: 느린 수렴', kicker: 'SLOW CONVERGENCE', hero: '🐢 ↘', head: '천천히, 꾸준하게', copy: '작은 이동으로 최솟값에 접근 중이에요.', meta: '', particles: [['🐢', '-42vw', '-22vh'], ['🐢', '38vw', '-28vh'], ['🍃', '-40vw', '24vh'], ['✦', '40vw', '18vh'], ['🌿', '-24vw', '-34vh'], ['✧', '27vw', '32vh'], ['🍃', '-36vw', '8vh'], ['·', '30vw', '-16vh'], ['✦', '-8vw', '36vh']] };
    return { kind: 'success', label: '실험 결과: 착륙 성공', kicker: 'SUCCESS', hero: '🏆 ⚽', head: '최솟값에 도착했어요!', copy: 'α=0.5면 한 번에 도착합니다.<br>점수 +100점!', meta: '', particles: [['🎆', '-34vw', '-35vh'], ['🎇', '30vw', '-30vh'], ['🎉', '-38vw', '20vh'], ['✨', '36vw', '28vh'], ['🎊', '-42vw', '-4vh'], ['⭐', '40vw', '-8vh'], ['🥳', '-24vw', '34vh'], ['🪅', '22vw', '36vh'], ['💫', '-12vw', '-38vh'], ['🌟', '14vw', '-37vh'], ['🎈', '-30vw', '-20vh'], ['🎊', '32vw', '-22vh']] };
  }
  function toastTextFor(notices) {
    var done = (notices || []).filter(function (n) { return n.indexOf('퀘스트 완료') !== -1; });
    if (done.length > 1) return '퀘스트 ' + done.length + '개 완료! 퀘스트 센터에서 보상을 수령하세요.';
    if (done.length === 1) return '퀘스트 완료! 퀘스트 센터에서 보상을 수령하세요.';
    return (notices && notices.length) ? '연구 기록이 저장되었습니다.' : '기록되었습니다.';
  }
  var EXTRA_IDS = ['gd-failure-flashes', 'gd-explosion-impact', 'gd-electric-flash', 'gd-turtle-effect', 'gd-zigzag-effect', 'gd-pingpong-effect', 'gd-fireworks'];
  function closeEffect(silent) {
    var fx = activeFx; if (!fx || fx.closed) return; fx.closed = true; activeFx = null;
    clearTimeout(fx.timer); document.removeEventListener('keydown', fx.onKey, true);
    fx.el.classList.add('is-closing'); setTimeout(function () { fx.el.remove(); }, 200);
    EXTRA_IDS.forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    var stage = document.querySelector('.gd-screen-shaking, .gd-screen-shaking-hard'); if (stage) stage.classList.remove('gd-screen-shaking', 'gd-screen-shaking-hard');
    if (!silent && fx.toastText && fx.toastText.indexOf('퀘스트') !== -1) setTimeout(function () { try { root.gdToast(document, fx.toastText, 'gift'); } catch (e) {} }, 260);
  }
  function startEffect(p) {
    closeEffect(true);
    var sp = p.spec, el = document.createElement('div');
    el.className = 'gd-overlay keep-motion gd-' + sp.kind; el.id = sp.kind + '-' + p.id; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', sp.label);
    var parts = sp.particles.map(function (q, i) { return '<span class="gd-particle" style="--dx:' + q[1] + ';--dy:' + q[2] + ';--d:' + (i * 0.05).toFixed(2) + 's" aria-hidden="true">' + esc(q[0]) + '</span>'; }).join('');
    el.innerHTML = parts + '<div class="gd-card"><button class="gd-close" type="button" aria-label="알림 닫기">' + icon('x', 22) + '</button><div class="gd-kicker">' + sp.kicker + '</div><div class="gd-emoji" aria-hidden="true">' + sp.hero + '</div><div class="gd-head">' + esc(sp.head) + '</div><div class="gd-copy">' + (sp.kind === 'success' ? sp.copy : esc(sp.copy)) + '</div>' + (sp.meta ? '<div class="gd-meta">' + esc(sp.meta) + '</div>' : '') + '</div><div class="gd-hint">화면을 누르면 닫혀요<span class="gd-hint-k"> (Esc 키도 가능)</span></div>';
    var fx = { el: el, closed: false, toastText: p.toastText, timer: 0, onKey: null };
    function dismiss(ev) { if (fx.closed) return; if (ev) { ev.preventDefault(); ev.stopPropagation(); if (ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } closeEffect(false); }
    fx.onKey = function (ev) { if (ev.key === 'Escape') dismiss(ev); };
    document.addEventListener('keydown', fx.onKey, true); el.addEventListener('pointerdown', dismiss, true); el.addEventListener('click', dismiss, true);
    activeFx = fx; document.body.appendChild(el);
    try { if (sp.kind === 'success') root.gdFireworks(root, { big: true, frames: 140 });
    else {
      var old = document.getElementById('gd-fireworks'); if (old) old.remove();
      if (sp.kind === 'failure') root.gdFailureEffect(root, 'normal'); else if (sp.kind === 'turtle') root.gdTurtleEffect(root); else if (sp.kind === 'zigzag') root.gdZigzagEffect(root);
      else if (sp.kind === 'pingpong') root.gdPingPongEffect(root); else if (sp.kind === 'explode') root.gdFailureEffect(root, 'explode');
    } } catch (e) { console.warn('보조 효과를 불러올 수 없어 결과 카드를 유지합니다.', e); }
    fx.timer = setTimeout(function () { closeEffect(false); }, EFFECT_MS + 100);
  }
  function cancelPending() { if (pending) { clearTimeout(pending.timer); pending = null; } }
  function scheduleEffect(p) {
    if (!pending || pending !== p || p.fired) return; p.fired = true; clearTimeout(p.timer);
    p.timer = setTimeout(function () { if (pending === p) { pending = null; startEffect(p); } }, EFFECT_GAP);
  }
  function onStarted(ev) { var p = pending; if (p && ev.detail && ev.detail.attemptId === p.id && !p.fired) { clearTimeout(p.timer); p.timer = setTimeout(function () { scheduleEffect(p); }, p.animMs + 1200); } }
  function onFinished(ev) { var p = pending; if (p && ev.detail && ev.detail.attemptId === p.id) scheduleEffect(p); }

  /* ---------- 실험 실행 ---------- */
  function runExperiment() {
    cancelPending(); closeEffect(true);
    var nick = ($('#gNick').value.trim() || '익명').slice(0, 20), alpha = Math.round(parseFloat($('#gAlpha').value) * 100) / 100, epochs = parseInt($('#gEpochs').value, 10);
    GD.storage.setPrefs({ nickname: nick });
    var run = GD.engine.run(FN, { start: START_X, alpha: alpha, maxIter: epochs });     // 공통 계산 엔진
    var cl = classify(alpha, run.finalX, run.overflow), label = cl[0], code = cl[1], score = calcScore(run.finalX, code);
    attemptId++; lastResult = { alpha: alpha, epochs: epochs, steps: run.iterations, finalX: run.finalX, finalLoss: run.finalLoss, label: label, code: code, score: score, id: attemptId };
    GD.records.add({ mode: 'game', functionId: 'F01', functionName: FN.name, nickname: nick, alpha: alpha, start: START_X, maxIter: epochs, iterations: run.iterations, finalX: run.finalX, finalLoss: run.finalLoss, statusLabel: label, success: code === 'success', score: score });
    var notices = [];
    function complete(qid) { if (S.done.indexOf(qid) === -1) { S.done.push(qid); var q = QUEST_BY_ID[qid]; notices.push(q.title + ' 퀘스트 완료! 보상 ' + fmtInt(q.reward) + ' XP 수령 가능'); } }
    if (code === 'success') complete('first_success');
    if (alpha > 0 && alpha < 0.5 && run.iterations > 0) complete('slow');
    if (Math.abs(alpha - 0.5) < 1e-9 && code === 'success' && run.iterations === 1) complete('one_step');
    if (alpha > 0.5 && alpha < 1 && run.iterations >= 2) complete('zigzag');
    if (Math.abs(alpha - 1) < 1e-9) complete('pingpong');
    if (alpha > 1) complete('diverge');
    questNotice = notices; S.alpha = alpha; S.epochs = epochs; save();
    renderResult(); renderHUD(); renderRecords(); renderBanner();
    $('#gGraphCap').textContent = '공은 y = x² 곡선 위를 따라 이동하고, 멈춘 위치마다 번호가 남아요. ‘건너뛰기’로 바로 결과를 볼 수 있어요.';
    var animMs = ANIM.startHold + Math.max(0, run.xs.length - 1) * (ANIM.move + ANIM.hold) + 500;
    var p = { id: attemptId, spec: effectSpec(lastResult), toastText: toastTextFor(questNotice), animMs: animMs, fired: false, timer: 0 };
    pending = p; p.timer = setTimeout(function () { scheduleEffect(p); }, animMs + 1200);
    renderGraph(run.xs, attemptId, false);
    // 사용자의 스크롤 위치를 강제로 이동하지 않아요. 특히 상단 복귀를 방해하던 예약 스크롤을 제거했어요.
    closeDrawer();
  }

  /* ---------- 팝업(모달) ---------- */
  var focusables = function (r) { return Array.prototype.slice.call(r.querySelectorAll('button:not([disabled]),[href],input,[tabindex]:not([tabindex="-1"])')).filter(function (e) { return e.offsetParent !== null; }); };
  function setInert(on_) { ['#gameMain', '#gameSide'].forEach(function (s) { var e = $(s); if (e) { if (on_) e.setAttribute('inert', ''); else e.removeAttribute('inert'); } }); }
  function openModal(m) {
    if (openModalEl && openModalEl !== m) closeModal(openModalEl, true);
    lastFocus = document.activeElement; m.hidden = false; openModalEl = m; document.body.classList.add('modal-open'); setInert(true);
    var f = focusables(m); (f.filter(function (e) { return e.classList.contains('btn-primary'); })[0] || f[0] || m).focus();
  }
  function closeModal(m, quiet) {
    m.hidden = true; if (openModalEl === m) openModalEl = null; document.body.classList.remove('modal-open'); setInert(false);
    if (!quiet && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    if (m.id === 'gIntro') { S.introSeen = true; save(); renderTip(); }
    renderHUD(); renderBanner();
  }
  function questCard(q) {
    var done = S.done.indexOf(q.id) !== -1, claimed = S.claimed.indexOf(q.id) !== -1, st = claimed ? 'claimed' : done ? 'ready' : 'locked';
    var badge = icon(claimed ? 'trophy' : done ? 'gift' : 'lock', 20);
    var foot = claimed ? '<span class="quest-state is-claimed">' + icon('check', 16) + ' 보상 수령 완료</span>' : done ? '<button class="btn btn-primary btn-block" type="button" data-claim="' + q.id + '">🎁 ' + fmtInt(q.reward) + ' XP 받기</button>' : '<span class="quest-state is-locked">' + icon('lock', 14) + ' 미완료 — 실험 조건을 바꾸어 도전하세요.</span>';
    return '<article class="qcard ' + (done && !claimed ? 'q-ready' : '') + '"><div class="quest-head q-' + st + '"><span class="quest-badge">' + badge + '</span><div class="quest-main"><div class="quest-title">' + q.title + '</div><div class="quest-desc">' + q.desc + '</div></div><span class="xp-chip">' + fmtInt(q.reward) + ' XP</span></div>' + foot + '</article>';
  }
  function renderQuest() {
    var body = $('#gQuestBody'), keep = body.scrollTop, xp = currentXP(), doneN = QUESTS.filter(function (q) { return S.done.indexOf(q.id) !== -1; }).length, claimedN = QUESTS.filter(function (q) { return S.claimed.indexOf(q.id) !== -1; }).length;
    body.innerHTML = '<div class="panel-heading"><div class="ph-row"><span class="ph-kicker">QUEST CENTER</span><span class="ph-xp"><b>' + fmtInt(xp) + '</b> / ' + fmtInt(TARGET_XP) + ' XP</span></div>' + xpBar(xp) + '<p class="ph-sub">미션을 완료하고 보상을 수령하세요 · 완료 ' + doneN + '/' + QUESTS.length + ' · 수령 ' + claimedN + '/' + QUESTS.length + '</p></div>' + QUESTS.map(questCard).join('') + '<button class="btn btn-block" type="button" data-close>닫기</button>';
    body.scrollTop = keep;
  }
  function openQuest() { renderQuest(); openModal($('#gQuest')); }
  function showMaster() {
    var m = $('#gMaster'), card = $('#gMasterCard'); card.className = 'master-dialog md-pending'; openModal(m);
    setTimeout(function () { if (m.hidden) return; card.classList.remove('md-pending'); card.classList.add('md-reveal'); root.gdFireworks(root, { big: true, frames: 190, center: true, colors: ['#38D5E8', '#1769AA', '#F4B400', '#FF7DA8', '#6FD3A0', '#9B8CFF'] }); }, 1500);
  }
  function onClaim(e) {
    var b = e.target.closest('[data-claim]'); if (!b) return; var qid = b.dataset.claim;
    if (S.claimed.indexOf(qid) !== -1 || S.done.indexOf(qid) === -1) return;
    S.claimed.push(qid); save(); renderHUD(); renderBanner();
    if (isMaster() && !S.masterShown) { S.masterShown = true; save(); closeModal($('#gQuest'), true); showMaster(); }
    else { renderQuest(); root.gdFireworks(root, { mini: true, frames: 65, label: '🎁 REWARD CLAIMED!' }); root.gdToast(document, '퀘스트 보상을 수령했습니다.', 'gift'); }
  }

  /* ---------- 사이드바(좁은 화면에서는 위쪽 '설정' 버튼으로 열기) ---------- */
  function openDrawer() { $('#gameSide').classList.add('open'); $('#gScrim').hidden = false; var t = document.getElementById('settingsToggle'); if (t) t.setAttribute('aria-expanded', 'true'); }
  function closeDrawer() { if (!view) return; $('#gameSide').classList.remove('open'); $('#gScrim').hidden = true; var t = document.getElementById('settingsToggle'); if (t) t.setAttribute('aria-expanded', 'false'); }
  function syncRange(id, out, fmt) { var el = $(id), wrap = el.closest('.rng'), p = (el.value - el.min) / (el.max - el.min); wrap.style.setProperty('--p', p); wrap.style.setProperty('--pct', (p * 100) + '%'); $(out).textContent = fmt(el.value); }
  function syncMobileCap() { $('#gMobileCap').textContent = '현재 설정 · α ' + Number($('#gAlpha').value).toFixed(2) + ' · 최대 ' + $('#gEpochs').value + '회 — 설정은 위쪽 ‘설정’ 버튼에서 바꿀 수 있어요.'; }
  function applyMotion() {
    document.body.classList.toggle('gd-game-full-motion', S.motion !== false);
    document.body.classList.toggle('gd-game-reduced-motion', S.motion === false);
  }
  function applyControls() {
    $('#gMotion').checked = S.motion !== false; applyMotion(); $('#gNick').value = nickname(); $('#gAlpha').value = S.alpha; $('#gEpochs').value = S.epochs;
    syncRange('#gAlpha', '#gAlphaOut', function (v) { return Number(v).toFixed(2); }); syncRange('#gEpochs', '#gEpochsOut', String); syncMobileCap();
  }
  function renderAll() { renderBanner(); renderTip(); renderHUD(); renderResult(); renderRecords(); }

  function mount(rootEl) {
    listeners = []; attemptId = 0; lastResult = null; questNotice = null; pending = null; activeFx = null; openModalEl = null; frameKey = ''; loadState();
    rootEl.innerHTML = '<div class="game-view app-root" id="gameView">' + layoutHTML() + '</div>'; view = rootEl.querySelector('#gameView');
    applyControls(); $('#gGraphCap').textContent = idleCap; renderAll(); renderGraph([START_X], 0, true);
    on($('#gMotion'), 'change', function () { S.motion = $('#gMotion').checked; save(); applyMotion();
      if (!lastResult) renderGraph([START_X], ++attemptId, true);
    });
    on($('#gAlpha'), 'input', function () { syncRange('#gAlpha', '#gAlphaOut', function (v) { return Number(v).toFixed(2); }); S.alpha = Number($('#gAlpha').value); save(); syncMobileCap(); });
    on($('#gEpochs'), 'input', function () { syncRange('#gEpochs', '#gEpochsOut', String); S.epochs = Number($('#gEpochs').value); save(); syncMobileCap(); });
    on($('#gNick'), 'change', function () { GD.storage.setPrefs({ nickname: $('#gNick').value.trim() || '익명' }); });
    on($('#gRunSide'), 'click', runExperiment); on($('#gRunMobile'), 'click', runExperiment); on($('#gQuestBtn'), 'click', openQuest);
    on($('#gQuestBody'), 'click', onClaim);
    ['#gIntro', '#gQuest', '#gMaster'].forEach(function (s) { var m = $(s); on(m, 'click', function (e) { if (e.target.closest('[data-close]') || e.target === m) closeModal(m); });
      on(m, 'keydown', function (e) { if (e.key !== 'Tab') return; var f = focusables(m); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }); });
    on(document, 'keydown', function (e) { if (e.key === 'Escape' && !activeFx) { if (openModalEl) closeModal(openModalEl); else if ($('#gameSide').classList.contains('open')) closeDrawer(); } });
    on(document, 'gd-experiment-animation-started', onStarted); on(document, 'gd-experiment-animation-finished', onFinished);
    // iframe 이벤트가 차단되는 브라우저에서는 메시지로도 완료 신호를 받습니다.
    on(root, 'message', function (ev) { if (!view || !$('#gFrame') || ev.source !== $('#gFrame').contentWindow) return;
      if (!ev.data || typeof ev.data !== 'object') return;
      if (ev.data.type === 'gd-game-scroll') {
        var dy = Number(ev.data.dy);
        if (isFinite(dy) && Math.abs(dy) <= 2000) root.scrollBy(0, dy);
        return;
      }
      var e = { detail: { attemptId: Number(ev.data.attemptId) } };
      if (ev.data.type === 'gd-experiment-animation-started') onStarted(e);
      if (ev.data.type === 'gd-experiment-animation-finished') onFinished(e);
    });
    on($('#gScrim'), 'click', closeDrawer);
    var tg = document.getElementById('settingsToggle'); if (tg) on(tg, 'click', function () { if ($('#gameSide').classList.contains('open')) closeDrawer(); else openDrawer(); });
    $$('.help-tip').forEach(function (t) { on(t, 'click', function (e) { e.stopPropagation(); var o = t.classList.contains('open'); $$('.help-tip.open').forEach(function (x) { x.classList.remove('open'); }); if (!o) t.classList.add('open'); }); on(t, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } }); });
    on(document, 'click', function () { $$('.help-tip.open').forEach(function (x) { x.classList.remove('open'); }); });
    if (!S.introSeen) openModal($('#gIntro'));
  }
  function unmount() {
    cancelPending(); closeEffect(true);
    EXTRA_IDS.concat(['gd-toast']).forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    document.body.classList.remove('modal-open', 'gd-game-full-motion', 'gd-game-reduced-motion'); closeDrawer();
    (listeners || []).forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = []; view = null;
  }

  GD.modes.game = { title: '게임모드', mount: mount, unmount: unmount, _classify: classify, _calcScore: calcScore, QUESTS: QUESTS };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/modes/researchMode.js === */
/* 연구자모드: 실험을 실행하고 결과를 분석해요.
   - 실험 중에는 공이 곡선 위를 따라 움직이고, 끝나면 방문한 모든 좌표를 순서대로 이은 점선 경로가 남아요.
   - 학습률 비교는 기존 실험 설정과 함수 그래프를 함께 사용해요.
   - 분석 도구는 관찰 가이드 → Loss 변화 순서예요.
   - Loss 점을 누르면 해당 반복의 수치 계산을 간단히 확인할 수 있어요. */
(function (root) {
  'use strict';
  var GD = root.GD, U = GD.ui, esc = U.esc;
  var family, fn, ctl, graph, loss, host, st, listeners, previews = [];

  function on(t, ev, f, o) { t.addEventListener(ev, f, o); listeners.push([t, ev, f, o]); }
  function $(s) { return host.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(host.querySelectorAll(s)); }
  function nick() { return GD.storage.prefs().nickname || '익명'; }
  function newState() { return { result: null, analysis: null, runKind: 'single', tab: null, showSteps: false, lossScale: 'linear', selected: -1, selectedSeries: 0, cmp: { items: [], conds: null } }; }
  function defaultCompareAlphas() {
    var all = fn.compareAlphas.filter(function (a) { return a >= fn.alpha.min && a <= fn.alpha.max; });
    if (all.length <= 3) return all;
    return [all[0], all[Math.floor(all.length / 2)], all[all.length - 1]];
  }
  function fStar() { return Math.min.apply(null, fn.minima.map(function (m) { return m.f; })); }
  // 연구자모드는 고학습률 발산 실험까지 허용하고, 다른 모드에는 영향을 주지 않아요.
  function researchAlpha() { return { min: fn.alpha.min, max: Number(fn.id.slice(1)) <= 3 ? fn.alpha.max : 30, basicMax: fn.alpha.max, rangeModes: Number(fn.id.slice(1)) > 3, step: fn.id === 'F03' ? 0.005 : fn.alpha.step, default: fn.alpha.default }; }
  // 연구자모드의 최대 이동 횟수는 모든 함수에서 50회 이하로 제한해요.
  // 함수별 곡률과 수렴 특성을 고려하여 초깃값과 최대치를 조정합니다.
  // 단일 실험과 학습률 비교 실험에 동일한 최대 이동 횟수가 적용돼요.
  function researchIterations() {
    var choices = {
      F01: { max: 30, default: 12 },
      F02: { max: 50, default: 30 },
      F03: { max: 30, default: 15 },
      F04: { max: 50, default: 30 },
      F05: { max: 50, default: 35 },
      F06: { max: 50, default: 40 }
    };
    var v = choices[fn.id]; return { min: 1, max: v.max, default: v.default };
  }

  function layout() {
    return '<div class="lab"><aside class="lab-side" aria-label="실험 설정"><h2>실험 설정</h2><div id="rCtl"></div></aside>' +
      '<div class="lab-main"><nav class="r-breadcrumbs" aria-label="현재 함수 선택 경로"><a href="#/research">차수 선택</a><span aria-hidden="true">›</span><a href="#/research/' + family + '">' + (family === 'quadratic' ? '2차함수' : '4차함수') + '</a><span aria-hidden="true">›</span><span aria-current="page">' + esc(fn.name) + '</span></nav><header class="page-head"><h1>연구자모드</h1><p><strong>' + esc(fn.name) + '</strong> · 이동 경로, Loss 변화, 학습률을 분석해요.</p></header>' +
      '<section class="graph-card" aria-label="이동 경로 그래프"><div class="graph-bar"><span class="graph-status" id="rStatus" data-phase="idle" role="status" aria-live="polite">준비 완료</span>' +
      '<div class="graph-toolbar"><div class="c-row"><label class="c-check"><input type="checkbox" id="rSteps"> 단계 번호 표시</label><button class="c-btn c-btn--sm" id="rAct" type="button" hidden></button>' +
      '<label class="playback-control" for="rSpeed">재생 속도 <select class="c-select playback-select" id="rSpeed" aria-label="공 애니메이션 재생 속도"><option value="0.5">0.5배속</option><option value="1" selected>1배속</option><option value="2">2배속</option><option value="4">4배속</option></select></label></div>' +
      '<div class="graph-zoom" role="group" aria-label="함수 그래프 확대 축소"><button class="graph-zoom-btn" id="rZoomIn" type="button" aria-label="그래프 확대" title="확대">' + U.icon('zoom-in', 18) + '</button><button class="graph-zoom-btn" id="rZoomOut" type="button" aria-label="그래프 축소" title="축소">' + U.icon('zoom-out', 18) + '</button><button class="graph-zoom-btn" id="rZoomReset" type="button" aria-label="그래프 원래 화면으로" title="원래 화면">' + U.icon('reset-view', 18) + '</button></div></div></div>' +
      '<div class="graph-stage"><canvas id="rCv" role="img" aria-label="함수 그래프" aria-describedby="rGraphHelp"></canvas></div>' +
      '<div class="graph-empty graph-empty--below" id="rEmpty" role="status">시작 위치를 바꾸면 공이 이동해요. <strong>실험 실행</strong>을 눌러 경로를 관찰하세요.</div>' +
      '<p class="graph-interaction-hint" id="rGraphHelp"><span class="graph-help-desktop">그래프 확대·축소: 버튼 또는 Ctrl+마우스 휠 · 드래그로 이동 · 스마트폰에서 두 손가락 확대 · 원래 화면 버튼으로 초기화</span><span class="graph-help-mobile">확대/축소 버튼 · 한 손가락으로 이동 · 두 손가락으로 확대</span></p>' +
      '<div class="legend" aria-hidden="true"><span><i></i>함수 곡선</span><span><i class="dotted"></i>이동 경로</span><span><i class="dot"></i>방문한 위치</span><span><i class="star"></i>극솟값</span>' + ((fn.stationaryInflections || []).length ? '<span><i class="flat"></i>수평변곡점(기울기 0)</span>' : '') + '</div><div class="compare-inline-legend" id="rCompareLegend" role="group" aria-label="학습률별 이동 경로" hidden></div></section>' +
      '<p class="sr-live" id="rPath"></p><section id="rSummary" class="c-stack" aria-live="polite"></section>' +
      '<section class="c-panel" aria-labelledby="rToolsH"><h2 class="c-subtitle" id="rToolsH" style="margin-bottom:var(--space-sm)">분석 도구</h2>' +
      '<div class="c-tablist" role="tablist" aria-label="분석 도구">' +
      '<button class="c-tab" role="tab" id="tabGuide" aria-controls="panGuide" aria-selected="false" data-tab="guide">관찰 가이드</button>' +
      '<button class="c-tab" role="tab" id="tabLoss" aria-controls="panLoss" aria-selected="false" data-tab="loss" disabled>Loss 변화</button></div>' +
      '<p class="c-note" id="rToolsHint">관찰 가이드는 바로 열 수 있어요. 실험을 마치면 Loss 변화도 확인할 수 있어요.</p>' +
      '<div role="tabpanel" id="panGuide" aria-labelledby="tabGuide" hidden></div><div role="tabpanel" id="panLoss" aria-labelledby="tabLoss" hidden></div></section>' +
      '<section class="c-panel" aria-labelledby="rRecH"><h2 class="c-subtitle" id="rRecH">내 연구자모드 기록</h2><p class="c-note" id="rRecNote" style="margin:var(--space-2xs) 0 var(--space-sm)"></p><div id="rRec"></div></section></div></div>';
  }

  /* ---------- 상태 표시 / 요약 ---------- */
  function setPhase(p) {
    var s = $('#rStatus'), a = $('#rAct'); if (!s) return; s.dataset.phase = p;
    var isPlay = p === 'play' || p === 'multi-play', hasResults = !!st.result || st.cmp.items.length > 0;
    s.textContent = p === 'idle' ? '준비 완료' : isPlay ? (st.runKind === 'compare' ? '여러 공이 이동하는 중…' : '공이 굴러가는 중…') : '이동 완료';
    s.dataset.phase = isPlay ? 'play' : p === 'idle' ? 'idle' : 'done';
    a.hidden = (p === 'idle' || !hasResults); 
    a.innerHTML = isPlay ? U.icon('skip', 16) + '건너뛰기' : U.icon('replay', 16) + '다시 보기';
    a.setAttribute('aria-label', isPlay ? '애니메이션 건너뛰기' : '애니메이션 다시 보기');
    if (isPlay) $('#rEmpty').hidden = true;
  }
  function stat(k, v) { return '<div class="c-stat"><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>'; }
  function renderSummary() {
    var r = st.result, a = st.analysis, box = $('#rSummary');
    if (st.runKind === 'compare') { renderCompareSummary(); return; }
    if (!r) { box.innerHTML = ''; return; }
    var tgt = r.target ? 'x = ' + U.fmtNum(r.target.x) + (fn.multiModal ? (r.target.kind === 'global' ? ' (전역)' : ' (국소)') : '') : '없음';
    box.innerHTML = U.callout(a.tone, a.label, a.detail) +
      '<dl class="c-stats">' + stat('최종 위치', U.fmtNum(r.finalX)) + stat('최종 Loss', U.fmtNum(r.finalLoss)) + stat('반복 횟수', r.iterations + '회') + stat('종료 사유', GD.engine.stopLabel(r.stopReason)) + stat('목표 최솟값', tgt) + '</dl>';
  }

  function renderCompareLegend() {
    var box = $('#rCompareLegend');
    if (!box) return;
    box.hidden = st.runKind !== 'compare' || !st.cmp.items.length;
    if (box.hidden) { box.innerHTML = ''; return; }
    box.innerHTML = '<span class="c-note">학습률별 공과 이동 경로 · 누르면 표시/숨기기</span><div class="compare-legend">' +
      st.cmp.items.map(function (it, i) {
        return '<button type="button" class="c-chip cmp-line-chip" data-cmp-idx="' + i + '" aria-pressed="' + it.visible + '"><span class="swatch" style="background:' + it.color + '"></span>α ' + U.fmtNum(it.alpha) + '</button>';
      }).join('') + '</div>' + (st.cmp.items.some(function (it) { return it.result.xs.some(function (x) { return Math.abs(x) > Math.max(10, Math.abs(fn.start.max - fn.start.min) * 5); }); }) ? '<p class="c-note">발산하는 공의 먼 이동 경로는 화면 밖으로 이어질 수 있어요. 실제 최종 위치와 Loss는 아래 결과표에서 확인할 수 있어요.</p>' : '');
  }
  function renderCompareSummary() {
    if (!st.cmp.items.length) return;
    $('#rSummary').innerHTML = '<div class="c-panel c-stack"><h3 class="c-subtitle">학습률 비교 결과</h3><p class="c-note">함수·시작점·최대 반복 횟수는 동일하고 학습률만 달라요.</p><div class="c-table-scroll"><table class="c-table"><thead><tr><th class="left" scope="col">학습률</th><th class="left" scope="col">결과</th><th scope="col">이동 횟수</th><th scope="col">최종 위치</th><th scope="col">최종 Loss</th></tr></thead><tbody>' +
      st.cmp.items.map(function (it) { return '<tr><td class="left"><span class="swatch" style="background:' + it.color + '"></span> α ' + U.fmtNum(it.alpha) + '</td><td class="left">' + esc(it.analysis.label) + '</td><td>' + it.result.iterations + '</td><td>' + U.fmtNum(it.result.finalX) + '</td><td>' + U.fmtNum(it.result.finalLoss) + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>';
  }
  function runComparison(v) {
    var colors = GD.viz.seriesColors();
    st.runKind = 'compare'; st.result = null; st.analysis = null; st.selected = -1; st.selectedSeries = 0;
    st.cmp.conds = { start: v.start, maxIter: v.maxIter, fnId: fn.id };
    st.cmp.items = v.compareAlphas.map(function (alpha, i) {
      var result = GD.engine.run(fn, { start: v.start, alpha: alpha, maxIter: v.maxIter });
      return { alpha: alpha, result: result, analysis: GD.analyzer.analyze(result, fn), color: colors[i % colors.length], visible: true };
    });
    var vs = st.cmp.items.map(function (it) { return { values: it.result.losses.map(function (l) { return l - fStar(); }) }; });
    st.lossScale = GD.viz.suggestLossScale(vs) === 'log' ? 'log' : 'linear';
    $('#rSummary').innerHTML = ''; $('#tabLoss').disabled = true; $('#panLoss').innerHTML = '';
    $('#rPath').textContent = '학습률 ' + v.compareAlphas.join(', ') + ' 각각의 공이 동일한 시작점 ' + v.start + '에서 출발합니다.';
    $('#rCv').setAttribute('aria-label', fn.name + ' 그래프. ' + v.compareAlphas.length + '개 학습률을 동일한 시작 위치에서 비교합니다.');
    $('#rEmpty').hidden = true; renderCompareLegend();
    graph.playMulti(st.cmp.items, function () { onFinished(); });
  }

  /* ---------- 실험 실행 ---------- */
  function runExperiment(v) {
    if (v.compare) { runComparison(v); return; }
    st.runKind = 'single'; st.cmp.items = []; renderCompareLegend();
    var result = GD.engine.run(fn, { start: v.start, alpha: v.alpha, maxIter: v.maxIter }), a = GD.analyzer.analyze(result, fn);
    st.result = result; st.analysis = a; st.selected = -1;
    st.lossScale = GD.viz.suggestLossScale([{ values: result.losses.map(function (l) { return l - fStar(); }) }]) === 'log' ? 'log' : 'linear';
    GD.records.add({ mode: 'research', functionId: fn.id, functionName: fn.name, nickname: nick(), alpha: result.alpha, start: result.start, maxIter: result.maxIter, iterations: result.iterations, finalX: result.finalX, finalLoss: result.finalLoss, statusLabel: a.label, statusType: a.type, oscillated: a.oscillated, success: result.success });
    $('#rSummary').innerHTML = ''; $('#tabLoss').disabled = true;
    $('#rPath').textContent = '이동 기록(x 좌표): ' + result.xs.map(function (x) { return Number(x.toPrecision(4)); }).join(' → ');
    $('#rCv').setAttribute('aria-label', fn.name + ' 그래프. 공이 x = ' + result.start + '에서 출발해 ' + result.iterations + '번 이동했고 최종 위치는 x = ' + Number(result.finalX.toPrecision(5)) + '입니다.');
    graph.play(result, function () { onFinished(); });
    setPhase('play');
  }
  function onFinished() {
    renderSummary(); $('#tabLoss').disabled = false; renderRecords();
    $('#rToolsHint').textContent = '관찰 가이드와 Loss 변화를 열어 이동 결과를 분석해 보세요.';
    if (st.tab === 'loss') renderLoss();
  }

  /* ---------- 단계 선택(이동 경로 ↔ Loss 그래프) ---------- */
  // Loss 점을 누르면 해당 단계의 x 갱신식과 함수값 대입식을 보여 줘요.
  function valueFormula(x) {
    var t = '(' + U.fmtNum(x) + ')';
    switch (fn.id) {
      case 'F01': return t + '²';
      case 'F02': return '0.25 × ' + t + '²';
      case 'F03': return '4 × ' + t + '²';
      case 'F04': return t + '⁴ / 4 − ' + t + '³ / 3 − ' + t + '² + 8/3';
      case 'F05': return '3 × ' + t + '⁴ − 4 × ' + t + '³ + 1';
      case 'F06': return t + '⁴ + 0.5 × ' + t + '²';
      default: return 'f(' + U.fmtNum(x) + ')';
    }
  }
  function stepCalcHTML(r, k) {
    if (!r || k < 0 || k >= r.xs.length) return '';
    var x = r.xs[k], v = r.losses[k];
    var val = '<div class="loss-calc-line">Loss' + k + ' = f(x' + k + ') = ' + esc(valueFormula(x)) + ' ≈ <strong>' + U.fmtNum(v) + '</strong></div>';
    if (k === 0) return '<strong>0번째 · 시작 위치 x₀ = ' + U.fmtNum(x) + '</strong>' + val;
    var prev = r.xs[k - 1], grad = r.grads[k - 1];
    var move = '<div class="loss-calc-line">x' + k + ' = x' + (k - 1) + ' − α × f′(x' + (k - 1) + ') = ' + U.fmtNum(prev) + ' − ' + U.fmtNum(r.alpha) + ' × (' + U.fmtNum(grad) + ') ≈ <strong>' + U.fmtNum(x) + '</strong></div>';
    return '<strong>' + k + '번째 이동 · ' + esc(fn.dexpr) + '</strong>' + move + val;
  }
  function readoutHTML() {
    var r = st.result; if (!r) return '';
    return st.selected < 0
      ? '그래프의 점을 누르면 그 단계의 수치 계산식이 나와요. (최종 Loss: ' + U.fmtNum(r.finalLoss) + ')'
      : stepCalcHTML(r, st.selected);
  }
  function selectStep(k, from, si) {
    st.selected = k;
    if (st.runKind === 'compare') {
      if (si != null) st.selectedSeries = si;
    } else if (from !== 'graph' && graph) graph.select(k);
    if (from !== 'loss' && loss && st.tab === 'loss') loss.select(k);
    var ro = $('#lossRead'); if (ro) ro.innerHTML = st.runKind === 'compare' ? compareReadoutHTML() : readoutHTML();
    var picker = $('#lossStepSelect'); if (picker) picker.value = String(k);
  }
  function compareReadoutHTML() {
    var it = st.cmp.items[st.selectedSeries];
    if (!it) return '';
    var k = st.selected < 0 ? 0 : Math.min(st.selected, it.result.iterations);
    return '<strong>학습률 α = ' + U.fmtNum(it.alpha) + '</strong><div>' + stepCalcHTML(it.result, k) + '</div>';
  }

  /* ---------- 분석 도구 ---------- */
  function selectTab(name) {
    st.tab = st.tab === name ? null : name;
    $$('.c-tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === st.tab ? 'true' : 'false'); });
    [['guide', '#panGuide'], ['loss', '#panLoss']].forEach(function (p) { $(p[1]).hidden = p[0] !== st.tab; });
    if (st.tab === 'loss') renderLoss();
    if (st.tab === 'guide') renderGuide();
  }
  function scaleChips(cur, id) {
    return '<div class="c-chips" role="group" aria-label="그래프 눈금"><button type="button" class="c-chip" data-scale="linear" data-for="' + id + '" aria-pressed="' + (cur === 'linear') + '">선형</button>' +
      '<button type="button" class="c-chip" data-scale="log" data-for="' + id + '" aria-pressed="' + (cur === 'log') + '">로그 (목표와의 차이)</button></div>';
  }
  function renderLoss() {
    var compare = st.runKind === 'compare', r = st.result, p = $('#panLoss');
    if (!compare && !r) { p.innerHTML = ''; return; }
    var items = compare ? st.cmp.items.filter(function (it) { return it.visible; }) : [];
    if (compare && !items.length) { p.innerHTML = '<p class="c-note">비교 그래프에서 표시할 학습률을 선택해 주세요.</p>'; return; }
    var picked = compare ? (st.cmp.items[st.selectedSeries] || items[0]).result : r;
    p.innerHTML = '<div class="c-stack"><div class="toolbar"><h3 class="c-subtitle">' + (compare ? '학습률별 Loss 변화' : '반복 횟수에 따른 Loss') + '</h3>' + scaleChips(st.lossScale, 'loss') + '</div><div class="loss-chart" id="lossBox"></div>' +
      (compare ? '<div class="loss-step-row"><label for="lossAlphaSelect">계산할 학습률</label><select class="c-select" id="lossAlphaSelect">' + st.cmp.items.map(function (it, i) { return '<option value="' + i + '"' + (i === st.selectedSeries ? ' selected' : '') + '>α = ' + U.fmtNum(it.alpha) + '</option>'; }).join('') + '</select></div>' : '') +
      '<div class="loss-step-row"><label for="lossStepSelect">계산을 볼 단계</label><select class="c-select" id="lossStepSelect" aria-label="계산을 볼 이동 단계">' + picked.xs.map(function (x, i) { return '<option value="' + i + '"' + (i === st.selected ? ' selected' : '') + '>' + i + '단계 · x = ' + U.fmtNum(x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="loss-calc" id="lossRead" aria-live="polite">' + (compare ? compareReadoutHTML() : readoutHTML()) + '</div>' +
      '<p class="c-note">Loss는 f(x) 값이에요. 로그 눈금은 전역최솟값(f*)과의 차이를 보여 줘요. 국소극솟값에서 멈추면 차이가 남을 수 있어요.</p></div>';
    if (loss) loss.destroy();
    loss = GD.viz.createLossChart($('#lossBox'), { onSelect: function (k, i) {
      if (compare) { var it = items[i]; if (it) { st.selectedSeries = st.cmp.items.indexOf(it); st.selected = k; renderLoss(); } }
      else selectStep(k, 'loss');
    } });
    var select = $('#lossStepSelect');
    select.addEventListener('change', function () { selectStep(Number(this.value), 'loss'); });
    var alphaSelect = $('#lossAlphaSelect');
    if (alphaSelect) alphaSelect.addEventListener('change', function () { st.selectedSeries = Number(this.value); st.selected = -1; renderLoss(); });
    var series = compare ? items.map(function (it) { return { label: 'α ' + it.alpha, color: it.color, values: it.result.losses }; }) : [{ label: 'Loss', color: GD.viz.seriesColors()[0], values: r.losses }];
    loss.render(series, { scale: st.lossScale, baseline: fStar(), selected: st.selected, label: fn.name + '의 반복 횟수별 Loss 변화 그래프' });
  }
  /* ---------- 함수별 학습률 수치 예시: 실제 계산 엔진으로 표를 생성 ---------- */
  function renderGuide() {
    var quadratic = Number(fn.id.slice(1)) <= 3;
    var intro = quadratic
      ? '<p>2차함수 <strong>f(x) = ax²</strong>에서는 <strong>xₙ₊₁ = (1 − 2aα)xₙ</strong>이에요. 이동 비율 <strong>r = 1 − 2aα</strong>의 크기가 1보다 작으면 수렴, −1이면 같은 거리로 왕복, 절댓값이 1보다 크면 발산해요.</p>'
      : '<p>4차함수는 <strong>xₙ₊₁ = xₙ − αf′(xₙ)</strong>을 반복해요. 위치마다 기울기가 달라 <strong>시작점과 학습률을 함께</strong> 바꿔 살펴봐야 해요. 2차함수처럼 한 개의 고정된 이동 비율로 설명할 수는 없어요.</p>';
    var examples = {
      F01: [0.1, 0.3, 0.5, 0.8, 0.9, 1, 1.2, 1.5],
      F02: [0.2, 0.5, 1, 1.5, 2],
      F03: [0.05, 0.1, 0.125, 0.2, 0.25, 0.28],
      F04: [0.05, 0.1, 0.15, 0.25, 0.5],
      F05: [0.01, 0.025, 0.04, 0.06, 0.1],
      F06: [0.01, 0.02, 0.03, 0.06, 0.1, 0.12]
    };
    var descriptions = {
      F01: ['한쪽에서 천천히 접근', '한쪽에서 빠르게 접근', '한 번에 도착', '좌우 진동하며 수렴', '작은 진동으로 수렴', '동일한 거리로 왕복', '진폭이 커지며 발산', '빠르게 발산'],
      F02: ['천천히 수렴', '한쪽으로 수렴', '거리 절반씩 감소', '더 빠르게 수렴', '한 번에 도착'],
      F03: ['한쪽으로 수렴', '한쪽으로 빠르게 수렴', '한 번에 도착', '진동하며 수렴', '같은 거리로 왕복', '발산'],
      F04: ['이동이 느림', '골짜기 방향 이동', '골짜기 방향 이동', '이동 폭 증가', '다른 골짜기 이동/진동 가능'],
      F05: ['느리게 접근', '안정적인 접근', '빠른 변화', '진동 가능', '시작점에 따라 발산 가능'],
      F06: ['천천히 이동', '기울기에 따라 이동 폭 감소', '더 큰 이동', '진동 가능', '크게 진동', '과도한 이동 가능']
    };
    var start = fn.start.default, alphas = examples[fn.id] || [], desc = descriptions[fn.id] || [];
    function valueAt(r, n) {
      return n < r.xs.length ? U.fmtNum(r.xs[n]) : (r.success ? '도착 후 종료' : '종료');
    }
    var rows = alphas.map(function (alpha, i) {
      var result = GD.engine.run(fn, { start: start, alpha: alpha, maxIter: 3 });
      var term = result.stopReason === 'diverged' ? '발산(계산 중단)' : desc[i];
      return '<tr><td><strong>' + U.fmtNum(alpha) + '</strong></td><td>' + valueAt(result, 1) + '</td><td>' + valueAt(result, 2) + '</td><td>' + valueAt(result, 3) + '</td><td class="left">' + esc(term) + '</td></tr>';
    }).join('');
    var cases = (fn.guide || []).map(function (g) {
      return '<tr><td class="left"><strong>' + esc(g[0]) + '</strong></td><td class="left">' + esc(g[1]) + '</td><td class="left">' + esc(g[2]) + '</td></tr>';
    }).join('');
    $('#panGuide').innerHTML = '<div class="c-stack guide-content guide-numeric">' +
      '<h3 class="c-subtitle">' + esc(fn.name) + ' · 관찰 가이드</h3>' +
      '<p class="c-note">' + esc(fn.expr) + ' · ' + esc(fn.dexpr) + '</p>' + intro +
      '<h4>① 학습률별 이동 좌표 예시</h4>' +
      '<p>시작 위치를 <strong>x₀ = ' + U.fmtNum(start) + '</strong>로 고정하고, α만 바꾸어 계산한 실제 값이에요. 아래 x₁·x₂·x₃은 공이 1~3번 이동한 뒤의 위치입니다.</p>' +
      '<div class="c-table-scroll guide-table-scroll" tabindex="0" role="region" aria-label="학습률별 1~3회 이동 결과"><table class="c-table guide-numeric-table"><thead><tr><th>학습률 α</th><th>x₁</th><th>x₂</th><th>x₃</th><th class="left">움직임 해석</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="c-note">※ 목표에 일찍 도착하면 그 이후의 값은 계산하지 않아요. 발산으로 종료된 경우에는 안전한 표시 한계값이 보일 수 있어요. 표의 위치는 반올림해 표시해요.</p>' +
      '<h4>② 값의 범위에 따른 수렴·발산 규칙</h4>' +
      '<div class="c-table-scroll guide-table-scroll" tabindex="0" role="region" aria-label="학습률 범위에 따른 특징"><table class="c-table guide-rules-table"><thead><tr><th class="left">조건·학습률</th><th class="left">현상</th><th class="left">왜 그런가요?</th></tr></thead><tbody>' + cases + '</tbody></table></div>' +
      '<h4>③ 직접 실험하기</h4><ol><li>위 표의 α를 설정하고 <strong>이동 횟수 3회</strong>로 시작해 x₁·x₂·x₃을 확인해 보세요.</li>' +
      '<li>이동 횟수를 늘려 경로와 <strong>Loss 변화</strong>를 비교하세요.</li>' +
      '<li><strong>학습률 비교</strong> 버튼을 누르면 같은 함수·출발점에서 여러 공의 움직임을 함께 볼 수 있어요.</li></ol>' +
      '<p class="c-note">탐구 목표: ' + esc(fn.goal) + '</p></div>';
  }

  /* ---------- 개인 기록 ---------- */
  function renderRecords() {
    var recs = GD.records.list({ mode: 'research' }), box = $('#rRec'); $('#rRecNote').textContent = GD.storage.notice();
    if (!recs.length) { box.innerHTML = U.callout('info', '아직 기록이 없어요', '실험을 실행하면 이 브라우저에 저장돼요.'); return; }
    box.innerHTML = '<div class="c-stack"><div class="c-table-scroll" tabindex="0" role="region" aria-label="연구자모드 실험 기록(스크롤 가능)"><table class="c-table" id="rTable"><thead><tr><th class="left" scope="col">날짜</th><th class="left" scope="col">함수</th><th scope="col">학습률</th><th scope="col">시작</th><th scope="col">반복</th><th scope="col">최종 위치</th><th scope="col">최종 Loss</th><th class="left" scope="col">결과</th></tr></thead><tbody>' +
      recs.slice().reverse().map(function (r) { return '<tr><td class="left">' + esc(GD.csv.localTime(r.createdAt)) + '</td><td class="left">' + esc(r.functionId) + ' · ' + esc(r.functionName) + '</td><td>' + r.alpha + '</td><td>' + U.fmtNum(r.start) + '</td><td>' + r.iterations + '</td><td>' + U.fmtNum(r.finalX) + '</td><td>' + U.fmtNum(r.finalLoss) + '</td><td class="left">' + esc(r.statusLabel) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="c-row"><button class="c-btn" type="button" id="rCsv">' + U.icon('download', 18) + 'CSV 내려받기</button><button class="c-btn c-btn--quiet" type="button" id="rClear">' + U.icon('trash', 18) + '기록 지우기</button></div></div>';
    on($('#rCsv'), 'click', function () { GD.csv.download(GD.records.list({ mode: 'research' }), 'research_mode_records.csv'); });
    on($('#rClear'), 'click', function () { if (root.confirm('연구자모드 기록을 모두 지울까요? 이 브라우저에서만 지워지고 되돌릴 수 없어요.')) { GD.records.clear({ mode: 'research' }); renderRecords(); } });
  }

  /* ---------- 함수 바꾸기 ---------- */
  function changeFunction(id) {
    // 2차 ↔ 4차를 넘어서 바꿀 때도 선택한 함수에 맞는 경로로 이동해요.
    var next = GD.functions.get(id);
    if (!next || next.id === fn.id) return;
    var nextFamily = Number(next.id.slice(1)) <= 3 ? 'quadratic' : 'quartic';
    location.hash = '#/research/' + nextFamily + '/' + next.id;
  }

  function familyFunctions(group) { return GD.functions.list.filter(function (f) { return group === 'quadratic' ? Number(f.id.slice(1)) <= 3 : Number(f.id.slice(1)) > 3; }); }
  function picker(params) {
    var group = params[0], valid = group === 'quadratic' || group === 'quartic';
    host.innerHTML = '<section class="home"><header class="page-head"><h1>연구자모드</h1><p>' + (valid ? '2단계 · 그래프를 보고 실험할 함수를 고르세요.' : '1단계 · 2차함수 또는 4차함수를 선택하세요.') + '</p></header>' +
      (valid ? '<a class="c-btn" href="#/research">← 차수 다시 선택</a>' : '') + '<div class="mode-grid">' +
      (valid ? familyFunctions(group).map(function (f) { var pts = f.stationaryInflections || []; return '<a class="mode-card research-fn-card" href="#/research/' + group + '/' + f.id + '"><div class="research-fn-preview"><canvas data-r-preview="' + f.id + '" role="img" aria-label="' + esc(f.name) + ' 함수 그래프 미리보기"></canvas></div><div class="research-fn-meta"><span class="fn-id">' + esc(f.id) + '</span><span>' + (pts.length ? '★ 극솟값 ' + f.minima.length + '개 · ◉ 수평변곡점 ' + pts.length + '개' : '★ 극솟값 ' + f.minima.length + '개' + (f.minima.length > 1 ? ' · 깊이 다름' : '')) + '</span></div><h2>' + esc(f.name) + '</h2><p class="fn-expr">' + esc(f.expr) + '</p><p>' + esc(f.feature) + '</p><span class="go">이 함수로 실험하기 →</span></a>'; }).join('') :
      '<a class="mode-card" href="#/research/quadratic"><h2>2차함수</h2><p>기본·완만한·가파른 포물선 3종으로 학습률과 곡률의 관계를 관찰해요.</p><span class="go">종류 선택 →</span></a><a class="mode-card" href="#/research/quartic"><h2>4차함수</h2><p>깊이가 다른 두 골짜기·수평변곡점·U자형 4차함수로 시작 위치와 수렴을 탐구해요.</p><span class="go">종류 선택 →</span></a>') + '</div></section>'
    if (valid) previews = $$('canvas[data-r-preview]').map(function (canvas) {
      var g = GD.viz.createFunctionGraph(canvas, { compact: true, previewOnly: true });
      g.setFunction(GD.functions.get(canvas.dataset.rPreview));
      return g;
    });
  }
  // 설정 중에는 기존 실험 경로 대신 새로운 출발점을 즉시 보여줘요.
  // 결과를 저장하지 않으며, 조정한 조건으로 다시 실험해야 분석값이 갱신돼요.
  function settingsChanged() {
    if (!ctl || !graph) return;
    var v = ctl.values();
    if (isFinite(v.start) && v.start >= fn.start.min && v.start <= fn.start.max) graph.showIdle(v.start);
    st.result = null; st.analysis = null; st.selected = -1;
    $('#rSummary').innerHTML = ''; $('#rPath').textContent = '';
    $('#rEmpty').hidden = false;
    $('#rEmpty').innerHTML = v.valid ? '시작 위치 <strong>x = ' + U.fmtNum(v.start) + '</strong> · 조건을 정한 뒤 실험을 실행하세요.' : '입력값을 확인해 주세요. 올바른 조건으로 실험을 실행할 수 있어요.';
    if (isFinite(v.start) && v.start >= fn.start.min && v.start <= fn.start.max) $('#rCv').setAttribute('aria-label', esc(fn.name) + ' 함수 그래프. 현재 시작 위치 x = ' + U.fmtNum(v.start) + ', 함수값 f(x) = ' + U.fmtNum(fn.f(v.start)));
    $('#tabLoss').disabled = true;
    $('#panLoss').innerHTML = '';
    $('#rToolsHint').textContent = '조건이 변경됐어요. 관찰 가이드는 지금, Loss 변화는 실험 후 확인할 수 있어요.';
    st.cmp.items = []; st.runKind = v.compare ? 'compare' : 'single'; renderCompareLegend(); if (loss) { loss.destroy(); loss = null; }
    setPhase('idle');
  }

  function mount(el, params) {
    host = el; listeners = []; st = newState(); previews = []; params = params || []; family = params[0];
    if ((family !== 'quadratic' && family !== 'quartic') || !familyFunctions(family).some(function (f) { return f.id === params[1]; })) { picker(params); return; }
    fn = GD.functions.get(params[1]);
    host.innerHTML = layout();
    ctl = GD.ui.createControls($('#rCtl'), { prefix: 'r', fn: fn, alpha: researchAlpha(), showFunction: true, functions: GD.functions.list, otherFunctionsOnly: true, iterations: researchIterations(), compareEnabled: true, compareAlphas: defaultCompareAlphas(), onRun: runExperiment, onChange: settingsChanged, onFunctionChange: changeFunction });
    graph = GD.viz.createFunctionGraph($('#rCv'), { interactive: true, onSelectStep: function (k) { selectStep(k, 'graph'); }, onPhase: setPhase });
    graph.setFunction(fn); setPhase('idle'); renderRecords();
    on($('#rZoomIn'), 'click', function () { graph.zoomBy(0.75); });
    on($('#rZoomOut'), 'click', function () { graph.zoomBy(1.3); });
    on($('#rZoomReset'), 'click', function () { graph.resetView(); });
    on($('#rSpeed'), 'change', function () { graph.setPlaybackSpeed(Number(this.value)); });
    on($('#rSteps'), 'change', function () { st.showSteps = $('#rSteps').checked; graph.setShowSteps(st.showSteps); });
    on($('#rCompareLegend'), 'click', function (ev) {
      var b = ev.target.closest('[data-cmp-idx]'); if (!b) return;
      var it = st.cmp.items[Number(b.dataset.cmpIdx)]; if (!it) return;
      if (it.visible && st.cmp.items.filter(function (v) { return v.visible; }).length <= 1) return;
      it.visible = !it.visible; renderCompareLegend(); graph.updateMulti(st.cmp.items);
      if (st.tab === 'loss' && !$('#tabLoss').disabled) renderLoss();
    });
    on($('#rAct'), 'click', function () { if (graph.isPlaying()) graph.skip(); else if (st.result || st.cmp.items.length) {
      // 비교 모드에는 st.result가 없으므로 비교 결과를 기준으로도 다시 보기가 가능해야 해요.
      $('#tabLoss').disabled = true; graph.replay(function () { onFinished(); });
    } });
    $$('.c-tab').forEach(function (b) { on(b, 'click', function () { if (!b.disabled) selectTab(b.dataset.tab); });
      on(b, 'keydown', function (e) {   // 탭 목록은 좌우 방향키로 이동해요(Enter/Space 로 열기)
        var tabs = $$('.c-tab').filter(function (t) { return !t.disabled; }), i = tabs.indexOf(b), n = -1;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n >= 0) { e.preventDefault(); tabs[n].focus(); } }); });
    on($('#panLoss'), 'click', function (e) { var s = e.target.closest('[data-for="loss"]'); if (!s) return; st.lossScale = s.dataset.scale; renderLoss(); });
  }
  function unmount() {
    previews.forEach(function (g) { g.destroy(); }); previews = [];
    if (graph) graph.destroy(); if (loss) loss.destroy();
    graph = loss = null; (listeners || []).forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
  }
  GD.modes.research = { title: '연구자모드', mount: mount, unmount: unmount, _state: function () { return st; }, _graph: function () { return graph; }, _cmpGraph: function () { return null; } };
})(typeof window !== 'undefined' ? window : globalThis);

/* === Original file: assets/js/main.js === */
/* 주소(#/…)에 따라 모드를 바꿔 보여 주는 라우터. 새로고침·직접 접속·뒤로가기가 모두 동작해요. */
(function (root) {
  'use strict';
  var GD = root.GD, U = GD.ui, current = null, currentName = null;
  var TITLES = { '': '경사하강법 시뮬레이터', game: '게임모드', research: '연구자모드', challenge: '실험도전모드' };

  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, ''), parts = h.split('/').filter(Boolean);
    var name = parts[0] || ''; if (name === 'challenge') { name = 'research'; parts = ['research']; } if (!GD.modes[name || 'home']) name = '';
    return { name: name, params: parts.slice(1) };
  }
  function setTabs(name) {
    U.$$('.route-tab').forEach(function (a) { if (a.dataset.route === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var t = U.$('#settingsToggle'); t.classList.toggle('is-available', name === 'game');
  }
  function route() {
    var r = parse(), app = U.$('#app'), mod = GD.modes[r.name || 'home'];
    var sameMode = current && currentName === r.name && typeof current.update === 'function';
    if (sameMode) { current.update(r.params); }
    else {
      if (current && current.unmount) { try { current.unmount(); } catch (e) { if (root.console) console.error(e); } }
      app.innerHTML = ''; current = mod; currentName = r.name;
      mod.mount(app, r.params);
    }
    setTabs(r.name);
    document.title = (mod.title || TITLES[r.name]) + (r.name ? ' · 경사하강법 시뮬레이터' : '');
    root.scrollTo(0, 0);
    var h1 = app.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }
  root.addEventListener('hashchange', route);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
  GD.router = { go: function (h) { location.hash = h; }, current: function () { return currentName; } };
})(typeof window !== 'undefined' ? window : globalThis);

/* === 페이지 스크롤 복구: 모드별 긴 화면에도 맨 위로 버튼 제공 === */
(function () {
  'use strict';
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  function refresh() { btn.classList.toggle('is-visible', (window.scrollY || document.documentElement.scrollTop || 0) > 320); }
  function toTop() {
    // 브라우저별 scrollingElement 차이를 보완해 상단으로 이동해요.
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) window.scrollTo(0, 0);
  }
  btn.addEventListener('click', toTop);
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('hashchange', refresh);
  refresh();
})();
