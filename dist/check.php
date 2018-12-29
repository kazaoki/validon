<?php

// バリデート

require_once('assets/validon/validon.php');
require_once('assets/validon/configs/contact/01.php');


// バリデート
$errors = validon($_POST); // エラーセットのみ返す。新データは直接引数を書き換える
// list($new_params, $errors, $changed) = validon($_POST, true); // 書き換えず詳しく返す


var_dump($errors);
