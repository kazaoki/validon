<?php

// バリデート

require_once('assets/validon/valid.php');


// 全体のバリデート
$validated = validate($_POST);


// $validated['changes'] ... 値の変更のあるものが返る
// $validated['errors'] ... エラーのあるものが返る



// 個別のバリデート
$validated = validate(['name'=>'ヤマダタロウ']);
$validated = validate(['name'=>'ヤマダタロウ', 'age'=>999]);

