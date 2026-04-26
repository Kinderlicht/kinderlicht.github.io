<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>$deck_title</title>
  <meta name="description" content="JHV-Folien für Kinderlicht." />
  <style>
$embedded_css
  </style>
</head>
<body>
  <div class="deck-shell">
    <header class="hud">
      <div class="brand"><div class="dot"></div><strong>Kinderlicht</strong></div>
      <button type="button" data-nav="prev" aria-label="Zurück">‹</button>
      <button type="button" data-nav="next" aria-label="Weiter">›</button>
      <div class="counter"><strong id="slide-index">1</strong> / <span id="slide-count">0</span></div>
    </header>
    <div class="progress-track"><div id="progress-bar"></div></div>

    <main class="slides" id="slides">
$slides_markup
    </main>
  </div>
  <script>
$embedded_js
  </script>
</body>
</html>
