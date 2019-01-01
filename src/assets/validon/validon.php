<?php

/**
 * JSON受信したならJavaScriptからのAjax通信
 */
if('application/json'===$_SERVER['CONTENT_TYPE']) {
    $json = json_decode(file_get_contents("php://input"), true) ?: [];

    // 指定のバリデート設定をロード
    $configfile = __DIR__.'/configs/'.$json['config'].'.php';
    if(!file_exists($configfile)) throw new Exception('Validon error: not found config file at '.$configfile);
    require_once $configfile;

    // バリデート実行
    list($errors, $new_params, $changes) = validon($json['params'], true);
    $json['errors'] = $errors;
    $json['new_params'] = $new_params;
    $json['changes'] = $changes;

    // 結果JSONを返す
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($json);

    exit;
}

/**
 * バリデート関数
 *
 * $errors = validon($_POST); // エラーセットのみ返す。新データは直接引数を書き換える
 * list($errors, $new_params, $changes) = validon($_POST, true); // 書き換えず詳しく返す
 */
function validon(&$params, $verbose=false)
{
    global $_VALIDON;
    global $_VALIDON_ENV;

    // 変数用意
    $new_params = $params;
    $errors = [];
    $changes = [];

    // 各種処理
    foreach($new_params as $key=>$value) {

        // 全ての値をバリデートする前にフック実行
        if(is_callable(@$_VALIDON_ENV['BEFORE'])) {
            $_VALIDON_ENV['BEFORE']($key, $new_params, $errors);
        }

        // バリデート関数が設定ファイルで定義されていればバリデート実行
        if(is_callable(@$_VALIDON[$key])) {
            $_VALIDON[$key]($new_params, $errors, $json);
        } else {
            if(@$_VALIDON_ENV['NOTICE']) error_log(sprintf('Validon notice: no defined rules "%s"', $key));
        }

        // 全ての値をバリデートした後にフック実行
        if(is_callable(@$_VALIDON_ENV['AFTER'])) {
            $_VALIDON_ENV['AFTER']($key, $new_params, $errors);
        }
    }

    // 値が変更されたキーのみ changes に集計する
    foreach(array_unique(array_merge(array_keys($params), array_keys($new_params))) as $key) {
        if(@$params[$key] !== @$new_params[$key]) {
            $changes[] = $key;
        }
    }

    // 返却
    if($verbose) {
        return [$errors, $new_params, $changes];
    } else {
        $params = $new_params;
        return $errors;
    }
}

/**
 * バリデートヘルパー関数
 */
// 必須項目とか簡単にできるやつとか？
