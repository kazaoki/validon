<?php

// バリどん呼んでくる
require_once('assets/validon/validon.php');
require_once('assets/validon/configs/contact/01.php');

// バリデート実行
$result = validon($_POST);
if(count(@$result['errors'])) {
  header('HTTP', true, 400);
  echo '<p>';
  echo '入力値に問題が見つかりました。<br>';
  echo 'JavaScriptを有効にし最初からやり直して下さい。<br>';
  echo '※何度も表示される場合は事務局へご連絡下さい。<br>';
  echo '</p>';
  echo '<ul>';
  foreach($result['errors'] as $key=>$message) {
    echo sprintf('<li>%s: %s</li>',
      $key,
      htmlspecialchars($message)
    );
  }
  echo '</ul>';
  exit;
}

// 変数展開
extract ($_POST);
?>
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

<form action="done.php" method="post" id="form">
  <p>以下の内容に問題がなければ送信してください。</p>
  <table border="1">
    <thead>
      <tr>
        <th>項目</th>
        <th>キー名</th>
        <th>値</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>お名前</td>
        <td>name</td>
        <td><?= htmlspecialchars($name) ?></td>
      </tr>
      <tr>
        <td>カナ</td>
        <td>kana</td>
        <td><?= htmlspecialchars($kana) ?></td>
      </tr>
      <tr>
        <td>年齢</td>
        <td>age</td>
        <td><?= htmlspecialchars($age) ?></td>
      </tr>
      <tr>
        <td>好きな食べ物（任意）</td>
        <td>food</td>
        <td><?= htmlspecialchars($food) ?></td>
      </tr>
      <tr>
        <td>お問い合わせ内容</td>
        <td>content</td>
        <td><?= nl2br(htmlspecialchars($content)) ?></td>
      </tr>
      <tr>
        <td>サイズ選択（ラジオボタン）</td>
        <td>size</td>
        <td><?= htmlspecialchars($size) ?></td>
      </tr>
      <tr>
        <td>色選択（チェックボックス）</td>
        <td>color[]</td>
        <td><?= htmlspecialchars(implode('、', $color)) ?></td>
      </tr>
      <tr>
        <td>プルダウン</td>
        <td>list[]</td>
        <td><?= htmlspecialchars(implode('、', $list)) ?></td>
      </tr>
      <tr>
        <td>シングルファイル選択</td>
        <td>docfile</td>
        <td><?= htmlspecialchars($docfile['name']) ?></td>
      </tr>
      <tr>
        <td>マルチファイル選択</td>
        <td>picfiles</td>
        <td>
          <?php foreach($picfiles as $picfile) { ?>
            <div><?= htmlspecialchars($picfile['name']) ?></div>
          <?php } ?>
        </td>
      </tr>
      <tr>
        <td>その他特殊</td>
        <td>-</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>

  <input type="hidden" name="name" value="<?= htmlspecialchars($name) ?>">
  <input type="hidden" name="kana" value="<?= htmlspecialchars($kana) ?>">
  <input type="hidden" name="age" value="<?= htmlspecialchars($age) ?>">
  <input type="hidden" name="content" value="<?= htmlspecialchars($content) ?>">
  <input type="hidden" name="size" value="<?= htmlspecialchars($size) ?>">
  <?php foreach(@$color as $item) { ?>
  <input type="hidden" name="color[]" value="<?= htmlspecialchars($item) ?>">
  <?php } ?>
  <?php foreach(@$list as $item) { ?>
  <input type="hidden" name="list[]" value="<?= htmlspecialchars($item) ?>">
  <?php } ?>

  <br>
  <button type="submit">送信する</button>

</form>

</body>

</html>
