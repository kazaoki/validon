<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Validon dev</title>
</head>
<body>

<form action="check.php" method="post"
  data-validon-config="contact/01"
  data-validon-each="blur"
  data-validon-errortag="<div class=error>$message</div>"
  data-validon-position="append"
>
  <h2>テキスト</h2>
  お名前：<input type="text" name="name"><br>
  カナ：<input type="text" name="kana"><br>
  年齢：<input type="text" name="age"><br>

  <h2>テキストエリア</h2>
  お問い合せ内容：<br>
  <textarea name="content"></textarea><br>

  <h2>ラジオボタン</h2>
  <label><input type="radio" name="size" value="大"> 大</label><br>
  <label><input type="radio" name="size" value="中"> 中</label><br>
  <label><input type="radio" name="size" value="小"> 小</label><br>

  <h2>チェックボックス</h2>
  <label><input type="checkbox" name="color" value="赤"> 赤</label><br>
  <label><input type="checkbox" name="color" value="青"> 青</label><br>
  <label><input type="checkbox" name="color" value="黄"> 黄</label><br>
  <label><input type="checkbox" name="color" value="白"> 白</label><br>
  <label><input type="checkbox" name="color" value="黒"> 黒</label><br>

  <h2>プルダウン</h2>

  <br>
  <button type="submit">確認画面へ</button>

</form>

</body>

<script src="assets/validon/valid.js"></script>

</html>
