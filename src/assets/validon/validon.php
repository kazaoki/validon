<?php

// JSON受信
$json = [];
if('application/json'===$_SERVER['CONTENT_TYPE']) {
    $json = json_decode(file_get_contents("php://input"), true) ?: [];
}

// バリデート設定をロード
require_once 'configs/'.$json['config'].'.php';

// バリデート実行
$validated = validate($json['params']);

// 結果JSONを返す
header('Content-Type: application/json; charset=utf-8');
echo json_encode($validated);

exit;

/**
 * バリデート関数
 */
function validate($params)
{
    $validated = [
        'changes'  => [],
        'errors'   => [],
        'original' => $params,
    ];

    // 各種処理
    foreach($params as $key=>$value) {
        if(@$_VALIDON[$key]) {
            $validated = $_VALIDON[$key]($params, $validated);
        }
    }

    return $validated;
}

/**
 * バリデートヘルパー関数
 */
// 必須項目とか簡単にできるやつとか？
