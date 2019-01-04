# Validon

## なにこれ

PHPとJavaScriptとで共通で使える汎用バリデータです。
PHPフォームを作成する時など、JavaScriptとPHPとで入力チェックを行ったりしますが、別々のルールになってしまい統一性がなかったり、毎回同じようなことをPHPとJSで２回書くのは面倒ですよね。
そこで、バリデータの内容は項目ごとにPHPで自由に書いて、JSからはajaxで、PHPからは `require()` 等でロードして同一のバリデートができるようにしました。

設定ファイルがPHPなので、かなり融通がききます。
既存のフレームワークに組み込んだり、データベースと連帯してみたり、ものすごく複雑な処理が必要だったりする場合も比較的カンタンに実装できるはずです。

また、jQuery依存なしで、最新ChromeとIE8で動作確認をしています。
（PHPのバージョンは5.5以上、7以上を推奨とします）

## 読み方

ばりどん。

## サンプルコード

### HTMLフォーム側（submit時や任意のタイミングでチェック可※後述）

```html
<form action="send.php" method="post" id="form">
  <section>お名前（必須）：<input type="text" name="name"></section>
  <section>年齢（任意）：<input type="text" name="age"></section>
  <button>送信</button>
</form>

<script src="assets/validon/validon.js"></script>
<script>
var validon = new Validon({
  form:     '#form',
  config:   'contact',
})
</script>
```

### PHP側（送信前にチェック）

```php
<?php

// ばりどん呼び出し
require_once('assets/validon/validon.php');
require_once('assets/validon/configs/contact.php');

// バリデート実行
$result = validon($_POST);
if(count(@$result['errors'])) {
  header('HTTP', true, 400);
  echo '<p>入力値に問題が見つかりました。JavaScriptを有効にし最初からやり直して下さい。</p>';
  exit;
}

// 送信処理
...
?>
```

### バリデータ設定ファイル例： `assets/validon/configs/contact.php`

```php
/**
 * お名前（必須）
 */
$_VALIDON['name'] = function(&$value, &$data=null)
{
    // 条件
    if(!strlen($value)) return '必須項目です。';
    if(mb_strlen($value) > 32) return '32文字以内で入力してください。';
};

/**
 * 年齢（任意）
 */
$_VALIDON['age'] = function(&$value, &$data=null)
{
    return;
};
```

## 設置手順

### 1.本体のダウンロード
このリポジトリをZIPダウンロードして `/dist/assets/validon` を抜き、ブラウザからアクセスできる適当な場所へ配置します。
以下例では、`assets/` ディレクトリに `validon/` フォルダを置きます。

### 2. HTMLフォーム側の設置法

フォームのあるHTMLにて `script` タグで本体のjsファイルをロードし、オブジェクトを作成するだけです。  
オブジェクト変数名は `validon` でなくても大丈夫です。１つのHTML内に複数のフォームがあれば、それぞれオブジェクトを作成してもOKです。

```html
<script src="assets/validon/validon.js"></script>
<script>
var validon = new Validon({
  form:     '#form',
  config:   'contact',
  errortag: '<div class="error">$message</div>',
  // 設定できるものは他にもあります。（後述
})
</script>
```

### 3. PHP側の設置法

確認画面や送信前にバリデータを行いたいときは、本体プログラムと設定ファイルをロードしてバリデート用の関数にフォームデータを投げるだけです。

```php
<?php

// ばりどん呼び出し
require_once('assets/validon/validon.php');
require_once('assets/validon/configs/contact.php');

// バリデート実行
$result = validon($_POST);
if(count(@$result['errors'])) {
  header('HTTP', true, 400);
  echo '<p>入力値に問題が見つかりました。JavaScriptを有効にし最初からやり直して下さい。</p>';
  exit;
}
```

### 4. 設定ファイル（PHP）の書き方

設定ファイルは `validon/configs/` ディレクトリに用意します。  
jsオブジェクトを生成する際の `config` に書いたものに `.php` をつけます。設定ファイル名に `/` をいれてディレクトリ分けも可能です。

config: '2018/contact' -> `assets/validon/configs/2018/contact.php`

具体的な書き方ですが、 `$_VALIDON` というグローバル変数があるので、HTML側で用意した要素名(name)をキーにしてバリデータ関数を書くだけです。

```php
/**
 * 年齢
 */
$_VALIDON['age'] = function(&$value, &$data=null)
{
    // 全角英数字を半角に変換
    $value = mb_convert_kana($value, 'as');

    // 条件
    if(!strlen($value)) return '必須項目です。';
    if($value<0 || $value>200) return '正しくない値です。';
    if(!ctype_digit($value)) return '数字以外が入力されています。';
};
```

### バリデート関数の引数について
第一引数は対象となる項目の実際の入力値が入ってきます。`&` で指定してあるので、直接内容を書き換えてしまうことができ、JS側にもその新しい値が戻っていきます。例えば、上記設定ですと全角数字で「４０」と入力しフォーカスが別の要素に移ると、バリデータが実行され半角の「40」になってブラウザ側へ返り、INPUT要素の値も自動的に書き換わるという感じです。  
チェックボックスや `<select>` の複数選択などは配列で入ってきます。複数値が入る場合にキー名はHTMLに合わせて `～[]` としてください。

第二引数は、他の要素のデータが入ってきますので参照/書き換えを行うことが出来ます。

### バリデート関数の返り値について
返り値はエラーメッセージを返して下さい。
エラーがない、任意の項目であるなどの場合は、 `return` のみでOKです。
（このエラーメッセージがHTML側に表示されるものです）


## リファレンス




（以下、ドキュメント準備中...

### jsonの形

### バリデータ関数の第二引数の形

### バリデータ結果値の形
