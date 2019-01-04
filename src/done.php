<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){

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

  // GETで完了ページをリロード
  header('Location: ./done.php');
  exit;
}
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

<p>処理完了です。</p>

<a href="./">トップへ戻る</a>

</body>

</html>
