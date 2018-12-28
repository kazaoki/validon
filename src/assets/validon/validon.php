<?php

// JSON受信
$json = [];
if('application/json'===$_SERVER['CONTENT_TYPE']) {
    $json = json_decode(file_get_contents("php://input"), true) ?: [];
}

// error_log(print_r($json, 1));

// バリデート設定をロード
require_once 'configs/'.$json['config'].'.php';

// // バリデート実行
// fireach(@$json['targets'] as $target) {
//     ;
//     $validated = validon($target, $json);
// }

// 結果JSONを返す
header('Content-Type: application/json; charset=utf-8');
echo json_encode($validated);

exit;

/**
 * バリデート関数
 */
function validon($params, $targets)
{
    // $validated = [
    //     'changes'  => [],
    //     'errors'   => [],
    //     'original' => $params,
    // ];
    $original = $params;

    // 各種処理
    foreach($params as $key=>$value) {
        if(@$_VALIDON[$key]) {
            list($params, $errors) = $_VALIDON[$key]($params, $errors);
        }
    }

    // 値の変更を検出
    $changes; // TODO

    return [
        'changes'  => $changes,
        'errors'   => $errors,
        'original' => $original,
    ];
}

/**
 * バリデートヘルパー関数
 */
// 必須項目とか簡単にできるやつとか？
