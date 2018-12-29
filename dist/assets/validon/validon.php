<?php

/**
 * JSON受信したならJavaScriptからのAjax通信
 */
if('application/json'===$_SERVER['CONTENT_TYPE']) {
    $json = json_decode(file_get_contents("php://input"), true) ?: [];

    // 指定のバリデート設定をロード
    require_once __DIR__.'/configs/'.$json['config'].'.php';

    // バリデート実行
    list($errors, $new_params, $changed) = validon($json['params'], true);
    $json['errors'] = $errors;
    $json['params'] = $new_params;
    $json['changed'] = $changed;

    // 結果JSONを返す
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($json);
    // echo json_encode([
    //     'erros' => $errors,
    //     'params' => $json['params'],
    //     'changed' => $json['changed'],
    // ]);

    exit;
}

/**
 * バリデート関数
 *
 * $errors = validon($_POST); // エラーセットのみ返す。新データは直接引数を書き換える
 * list($errors, $new_params, $changed) = validon($_POST, true); // 書き換えず詳しく返す
 */
function validon(&$params, $verbose=false)
{
    global $_VALIDON;

    // 変数用意
    $new_params = $params;
    $errors = [];
    $changed = [];

    // 各種処理
    foreach($new_params as $key=>$value) {
        if(is_callable(@$_VALIDON[$key])) {
            $error = $_VALIDON[$key]($new_params, $errors);
            if(@$params[$key]!==$new_params[$key]) $changed[$key] = $new_params[$key];
        } else {
            error_log(sprintf('Validon error: no defined rules "%s"', $key));
        }
    }

    // 値の変更を検出
    $changes; // TODO

    // 返却
    if($verbose) {
        return [
            'errors' => $errors,
            'new_params' => $new_params,
            'changed' => $changed,
        ];
    } else {
        $params = $new_params;
        return $errors;
    }
}

/**
 * バリデートヘルパー関数
 */
// 必須項目とか簡単にできるやつとか？
