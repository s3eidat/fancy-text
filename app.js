/* Fancy Text — maps letters to Unicode look-alikes. Pure string work, nothing leaves the page. */
(function () {
  "use strict";
  var $ = S3.$;
  var cp = String.fromCodePoint;

  // Mathematical Alphanumeric Symbols: [A, a, 0] start code points, plus letters Unicode placed elsewhere (the "holes").
  function math(A, a, zero, holes) {
    return function (ch) {
      if (holes && holes[ch]) return holes[ch];
      var c = ch.charCodeAt(0);
      if (c >= 65 && c <= 90 && A) return cp(A + c - 65);
      if (c >= 97 && c <= 122 && a) return cp(a + c - 97);
      if (c >= 48 && c <= 57 && zero) return cp(zero + c - 48);
      return ch;
    };
  }
  function table(from, to) {
    var a = Array.from(from), b = Array.from(to), m = {};
    a.forEach(function (c, i) { m[c] = b[i]; });
    return function (ch) { return m[ch] != null ? m[ch] : ch; };
  }
  function upperOnly(A, digits) {
    return function (ch) {
      var c = ch.toUpperCase().charCodeAt(0);
      if (ch.length === 1 && c >= 65 && c <= 90) return cp(A + c - 65);
      if (digits && /^[0-9]$/.test(ch)) return digits(+ch);
      return ch;
    };
  }
  function combine(mark) { return function (ch) { return ch === "\n" ? ch : ch + mark; }; }

  var STYLES = [
    ["Bold", math(0x1D400, 0x1D41A, 0x1D7CE)],
    ["Italic", math(0x1D434, 0x1D44E, 0, { h: "ℎ" })],
    ["Bold italic", math(0x1D468, 0x1D482, 0)],
    ["Script", math(0x1D49C, 0x1D4B6, 0, { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" })],
    ["Bold script", math(0x1D4D0, 0x1D4EA, 0)],
    ["Fraktur", math(0x1D504, 0x1D51E, 0, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" })],
    ["Bold fraktur", math(0x1D56C, 0x1D586, 0)],
    ["Double-struck", math(0x1D538, 0x1D552, 0x1D7D8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" })],
    ["Sans-serif", math(0x1D5A0, 0x1D5BA, 0x1D7E2)],
    ["Sans bold", math(0x1D5D4, 0x1D5EE, 0x1D7EC)],
    ["Sans italic", math(0x1D608, 0x1D622, 0)],
    ["Sans bold italic", math(0x1D63C, 0x1D656, 0)],
    ["Monospace", math(0x1D670, 0x1D68A, 0x1D7F6)],
    ["Circled", math(0x24B6, 0x24D0, 0, { "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨" })],
    ["Circled dark", upperOnly(0x1F150, function (d) { return d ? cp(0x2775 + d) : "⓿"; })],
    ["Squared", upperOnly(0x1F130)],
    ["Squared dark", upperOnly(0x1F170)],
    ["Parenthesized", math(0x1F110, 0x249C, 0, { "1": "⑴", "2": "⑵", "3": "⑶", "4": "⑷", "5": "⑸", "6": "⑹", "7": "⑺", "8": "⑻", "9": "⑼" })],
    ["Fullwidth", function (ch) { var c = ch.charCodeAt(0); return ch === " " ? "　" : ch.length === 1 && c >= 0x21 && c <= 0x7E ? cp(c + 0xFEE0) : ch; }],
    ["Small caps", table("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ")],
    ["Superscript", table("abcdefghijklmnoprstuvwxyzABDEGHIJKLMNOPRTUVW0123456789+-=()", "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾")],
    ["Upside down", null],
    ["Strikethrough", combine("̶")],
    ["Underline", combine("̲")],
    ["Double underline", combine("̳")],
    ["Slashed", combine("̸")],
    ["Overline", combine("̅")],
    ["Wide spaced", function (ch) { return ch === "\n" ? ch : ch + " "; }]
  ];
  var FLIP = table("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'\"?!()[]{}<>_&;",
    "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆᗡƎℲ⅁HIſꓘ˥WNOԀΌᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙'‚„¿¡)(][}{><‾⅋؛");

  function apply(style, text) {
    var chars = Array.from(text.normalize("NFC"));
    if (style[0] === "Upside down") return chars.map(FLIP).reverse().join(""); // reversing the whole string flips the line order too
    var out = chars.map(style[1]).join("");
    return style[0] === "Wide spaced" ? out.replace(/ +$/gm, "") : out;
  }

  // ---------- UI ----------
  var input = $("#input"), list = $("#list");
  var PLACEHOLDER = "Fancy Text 2026";

  function render() {
    var t = input.value || PLACEHOLDER;
    list.textContent = "";
    STYLES.forEach(function (s, i) {
      var out = apply(s, t);
      list.appendChild(S3.h("li", {}, [
        S3.h("span", { "class": "name", text: s[0] }),
        S3.h("span", { "class": "val" + (input.value ? "" : " ph"), text: out }),
        S3.h("button", { "class": "btn small", "data-i": i, "aria-label": "Copy " + s[0], html: S3.icon("copy") + "Copy" })
      ]));
    });
  }
  list.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-i]"); if (!b) return;
    if (!input.value) { S3.toast("Type your text first", "error"); input.focus(); return; }
    S3.copy(apply(STYLES[+b.dataset.i], input.value), STYLES[+b.dataset.i][0] + " copied"); S3.done();
  });
  input.addEventListener("input", S3.debounce(function () { render(); S3.store("fancy.text", input.value || undefined); }, 60));
  $("#clear").addEventListener("click", function () { input.value = ""; S3.store("fancy.text", undefined); render(); input.focus(); });

  input.value = S3.store("fancy.text") || "";
  render();

  window.S3_DEMO = function () { input.value = "Stay curious 2026"; render(); };

  window.S3_SELFTEST = function () {
    function by(n) { return STYLES.filter(function (s) { return s[0] === n; })[0]; }
    var t = [
      [apply(by("Bold"), "Ab1"), "𝐀𝐛𝟏"],
      [apply(by("Italic"), "hi"), "ℎ𝑖"],
      [apply(by("Script"), "Be"), "ℬℯ"],
      [apply(by("Fraktur"), "Ca"), "ℭ𝔞"],
      [apply(by("Double-struck"), "RZ1"), "ℝℤ𝟙"],
      [apply(by("Monospace"), "a0"), "𝚊𝟶"],
      [apply(by("Sans bold"), "Z9"), "𝗭𝟵"],
      [apply(by("Circled"), "a1 0"), "ⓐ① ⓪"],
      [apply(by("Circled dark"), "ab 10"), "🅐🅑 ❶⓿"],
      [apply(by("Squared"), "Ok"), "🄾🄺"],
      [apply(by("Fullwidth"), "A! b"), "Ａ！　ｂ"],
      [apply(by("Small caps"), "Hi"), "ʜɪ"],
      [apply(by("Superscript"), "x2"), "ˣ²"],
      [apply(by("Upside down"), "abc!"), "¡ɔqɐ"],
      [apply(by("Upside down"), "ab\ncd"), "pɔ\nqɐ"],
      [apply(by("Strikethrough"), "ab"), "a̶b̶"],
      [apply(by("Wide spaced"), "abc"), "a b c"],
      [apply(by("Bold"), "مرحبا 😀"), "مرحبا 😀"]
    ];
    return STYLES.length >= 25 && t.every(function (p) { return p[0] === p[1]; });
  };
})();
