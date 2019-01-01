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
    $json = validon($json['params'], $json);

    // 結果JSONを返す
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($json);

    exit;
}

/**
 * バリデート関数
 *
 * @param Array $params ['name'=>'tarou'] のようなペア配列
 * @param Array $fulldata ajaxから受けたフルのjsonデータの配列化したもの。またはバリデート中に他の要素を参照できるよう全ての値が入る。
 *
 * $result_set = validon($_POST);
 * $result_set = validon(['name'=>'ほげたろう']);
 * $result_set = validon($json['params'], $json);
 *
 * $result_set['params'] ... バリデート済み全パラメータがキー・バリューでセットされてくる
 * $result_set['errors'] ... エラーメッセージがキー・バリューでセットされてくる
 * $result_set['changes'] ... 変更のあるパラメータのキー名のみが配列で入ってくる
 */
function validon($params, $fulldata=false)
{
    global $_VALIDON;
    global $_VALIDON_ENV;

    // 変更前値の退避
    $original_params = $params;

    // 各種処理
    foreach($params as $key=>$value) {

        // 全ての値をバリデートする前にフック実行
        if(is_callable(@$_VALIDON_ENV['BEFORE'])) {
            $_VALIDON_ENV['BEFORE']($key, $params[$key], $fulldata);
        }

        // バリデート関数が設定ファイルで定義されていればバリデート実行
        if(is_callable(@$_VALIDON[$key])) {
            $error = $_VALIDON[$key]($params[$key], $fulldata);
            if(strlen($error)) $errors[$key] = $error;
        } else {
            if(@$_VALIDON_ENV['NOTICE']) error_log(sprintf('Validon notice: no defined rules "%s"', $key));
        }

        // 全ての値をバリデートした後にフック実行
        if(is_callable(@$_VALIDON_ENV['AFTER'])) {
            $_VALIDON_ENV['AFTER']($key, $params[$key], $fulldata);
        }
    }

    // 値が変更されたキーのみ changes に集計する
    foreach(array_unique(array_merge(array_keys($params), array_keys($original_params))) as $key) {
        if(@$params[$key] !== @$original_params[$key]) {
            $changes[] = $key;
        }
    }

    // 返却
    @$fulldata['params'] = $params;
    @$fulldata['errors'] = @$errors;
    @$fulldata['changes'] = @$changes;

    return $fulldata;
}

/**
 * バリデートヘルパー関数
 */
// 必須項目とか簡単にできるやつとか？
