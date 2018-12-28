<?php

// バリデート

require_once('assets/validon/validon.php');


// 全体のバリデート
$validated = validon($_POST);


// $validated['changes'] ... 値の変更のあるものが返る
// $validated['errors'] ... エラーのあるものが返る



// 個別のバリデート
$validated = validon(['name'=>'ヤマダタロウ']);
$validated = validon(['name'=>'ヤマダタロウ', 'age'=>999]);

