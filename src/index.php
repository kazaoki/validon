<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Validon dev</title>
</head>
<body>

<form action="check.php" method="post" id="form">
  <h2>テキスト</h2>
  お名前：<input type="text" name="name" data-validon-on="keypress"> ※これのみ keypress イベントで発火<br>
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
  <select name="list" multiple>
    <option value="111">111</option>
    <option value="222">222</option>
    <option value="333">333</option>
    <option value="444">444</option>
  </select>

  <br>
  <button type="submit">確認画面へ</button>
  <button type="button" onClick="validon.validate(['content','age'])">お問い合わせ内容と年齢だけチェック</button>

</form>

</body>

<script src="assets/validon/valid.js"></script>
<script>
var validon = new Validon({
  form:     '#form',
  config:   'contact/01',
  eachfire: true,
  errortag: '<div class="error">$message</div>',
  position: 'append',
  beforeFunc: function(send_json){
    console.log('BEFORE')
    console.log(send_json)
  },
  afterFunc: function(receive_json){
    console.log('AFTER')
    console.log(receive_json)
  },
})
</script>

</html>
