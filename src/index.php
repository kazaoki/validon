<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Validon dev</title>
  <!--[if lt IE 9]>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
  <![endif]-->
  <link rel="stylesheet" href="style.css">
</head>

<body>

<form action="check.php" method="post" id="form" enctype="multipart/form-data">
  <section>
    <h2>テキスト</h2>
    <section>
      *お名前：<input type="text" name="name" value="山田 太郎" data-validon-on="blur,keyup"> ※これのみ keyup イベントで発火<br>
    </section>
    <section>
      *カナ：<input type="text" name="kana" value="ヤマダ タロウ"><br>
    </section>
    <section>
      *年齢：<input type="text" name="age" value=""><br>
    </section>
    <section>
      好きな食べ物（任意）：<input type="text" name="food" value=""><br>
    </section>
  </section>

  <section>
    <h2>テキストエリア</h2>
    *お問い合せ内容：<br>
    <textarea name="content">test1
test2
test3</textarea><br>
  </section>

  <section>
    <h2>サイズ選択（ラジオボタン）</h2>
    <label><input type="radio" name="size" value="大"> 大</label><br>
    <label><input type="radio" name="size" value="中"> 中</label><br>
    <label><input type="radio" name="size" value="小"> 小</label><br>
  </section>

  <section>
    <h2>色選択（チェックボックス）</h2>
    <div>※エラー位置固定→<div data-validon-errorholder="color[]"></div></div>
    <label><input type="checkbox" name="color[]" value="赤"> 赤</label><br>
    <label><input type="checkbox" name="color[]" value="青" checked> 青</label><br>
    <label><input type="checkbox" name="color[]" value="黄"> 黄</label><br>
    <label><input type="checkbox" name="color[]" value="白" checked> 白</label><br>
    <label><input type="checkbox" name="color[]" value="黒" checked> 黒</label><br>
  </section>

  <section>
    <h2>*プルダウン</h2>
    <select name="list[]" multiple>
      <option value="111">111</option>
      <option value="222" selected>222</option>
      <option value="333">333</option>
      <option value="444" selected>444</option>
    </select>
  </section>

  <section>
    <h2>ファイル選択</h2>
    <section>
      シングルファイル：<input type="file" name="docfile">
    </section>
    <section>
      マルチファイル：<input type="file" name="picfiles[]" accept="image/*" multiple>
    </section>
  </section>

  <section>
    <h2>その他特殊</h2>
    ※日時やスライダーなど
  </section>

  <br>
  <button type="submit">確認画面へ</button>
  <button type="button" onClick="validon.send(['content','age'], function(json){console.log('EACH IT !'); console.log(json)})">お問い合わせ内容と年齢だけチェック</button>
  <button type="button" onClick="validon.send(['age','color[]'])">年齢と色だけチェック</button>

</form>

</body>

<script src="assets/validon/validon.js"></script>
<script>
var validon = new Validon({
  form:     '#form',
  config:   'contact/01',
  eachfire: true,
  errorgroup: 'section',
  // errorposition: 'prepend',
  errortag: '<div class="error">$message</div>',
  startFunc: function(){
    console.log('START')
  },
  beforeFunc: function(send_json){
    console.log('BEFORE')
    console.log(send_json)
  },
  afterFunc: function(receive_json){
    console.log('AFTER')
    console.log(receive_json)
  },
  finishFunc: function(json){
    console.log('FINISH')
    if(json.isSubmit) {
      var error = this.form.querySelector('.error');
      if(error) document.querySelector('html').scrollTop = error.offsetTop - 30
    }
  }
})
</script>

</html>
