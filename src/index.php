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
  data-validon-fire="blur"
  data-validon-errortag="<div class=error>$message</div>"
  data-validon-position="append"
>
  お名前：<input type="text" name="name"><br>
  カナ：<input type="text" name="kana"><br>
  年齢：<input type="text" name="age"><br>
  お問い合せ内容：<br>
  <textarea name="content"></textarea><br>

  <br><br>

  <button type="submit">確認画面へ!</button>

</form>

</body>

<script src="assets/validon/valid.js"></script>

</html>
